import WebSocket from "isomorphic-ws";

import { TransactionStatusResponse } from "../lib/status/types/index.js";

import { isFinalTaskState } from "./isFinalTaskState.js";
import {
  ErrorWebsocketMessage,
  UpdateWebsocketMessage,
  WebsocketEvent,
  WebsocketMessage,
} from "./websocketMessage.js";

export class WebsocketHandler {
  readonly #url: string;
  readonly #subscriptions: Set<string> = new Set();
  #updateHandlers: ((taskStatus: TransactionStatusResponse) => void)[] = [];
  #errorHandlers: ((error: Error) => void)[] = [];
  #websocket?: WebSocket;
  readonly #reconnectIntervalMillis = 1000;

  constructor(url: string) {
    this.#url = `${url}/tasks/ws/status`;
  }

  public onUpdate(
    handler: (taskStatus: TransactionStatusResponse) => void
  ): void {
    if (!handler) {
      throw new Error("Callback handler is not provided");
    }

    this.#updateHandlers.push(handler);

    this._connect();
  }

  public offUpdate(
    handler: (taskStatus: TransactionStatusResponse) => void
  ): void {
    if (!handler) {
      throw new Error("Callback handler is not provided");
    }

    this.#updateHandlers = this.#updateHandlers.filter(
      (element) => element !== handler
    );

    this._disconnectIfUnused();
  }

  public onError(handler: (error: Error) => void): void {
    if (!handler) {
      throw new Error("Callback handler is not provided");
    }

    this.#errorHandlers.push(handler);

    this._connect();
  }

  public offError(handler: (error: Error) => void): void {
    if (!handler) {
      throw new Error("Callback handler is not provided");
    }

    this.#errorHandlers = this.#errorHandlers.filter(
      (element) => element !== handler
    );

    this._disconnectIfUnused();
  }

  public subscribe(taskId: string) {
    if (this.#subscriptions.has(taskId)) {
      return;
    }

    this.#subscriptions.add(taskId);

    this._sendWebsocketMessage({
      action: "subscribe",
      taskId,
    });
  }

  public unsubscribe(taskId: string) {
    if (!this.#subscriptions.has(taskId)) {
      return;
    }

    this.#subscriptions.delete(taskId);

    this._sendWebsocketMessage({
      action: "unsubscribe",
      taskId,
    });
  }

  private _connect() {
    if (this.#websocket) {
      return;
    }

    this.#websocket = new WebSocket(this.#url);

    this.#websocket.onopen = () => {
      this.#subscriptions.forEach((taskId) => {
        this._sendWebsocketMessage({
          action: "subscribe",
          taskId,
        });
      });
    };

    this.#websocket.onclose = () => {
      setTimeout(() => {
        this._connect();
      }, this.#reconnectIntervalMillis);
    };

    this.#websocket.onmessage = (data: WebSocket.MessageEvent) => {
      const message = JSON.parse(
        data.data.toString()
      ) as WebsocketMessage<unknown>;

      switch (message.event) {
        case WebsocketEvent.ERROR: {
          const errorWebsocketMessage = message as ErrorWebsocketMessage;
          const error: Error = errorWebsocketMessage.payload;

          this.#errorHandlers.forEach((handler) => {
            handler(error);
          });
          break;
        }
        case WebsocketEvent.UPDATE: {
          const updateWebsocketMessage = message as UpdateWebsocketMessage;
          const taskStatus: TransactionStatusResponse =
            updateWebsocketMessage.payload;

          if (isFinalTaskState(taskStatus.taskState)) {
            this.unsubscribe(taskStatus.taskId);
          }

          this.#updateHandlers.forEach((handler) => {
            handler(taskStatus);
          });
          break;
        }
        default: {
          break;
        }
      }
    };
  }

  private _sendWebsocketMessage(message: unknown): void {
    if (this.#websocket && this.#websocket.readyState === WebSocket.OPEN) {
      this.#websocket.send(JSON.stringify(message));
    }
  }

  private _disconnectIfUnused() {
    if (
      this.#updateHandlers.length === 0 &&
      this.#errorHandlers.length === 0 &&
      this.#websocket
    ) {
      this.#websocket.close();
      this.#websocket = undefined;
    }
  }
}
