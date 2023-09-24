import WebSocket from "isomorphic-ws";

import { TransactionStatusResponse } from "../lib/status/types/index.js";

import { isFinalTaskState } from "./isFinalTaskState.js";
import { WebsocketEvent, WebsocketMessage } from "./websocketMessage.js";

export class WebsocketHandler {
  readonly #url: string;
  readonly #subscriptions: Set<string> = new Set();
  #taskStatusHandlers: ((taskStatus: TransactionStatusResponse) => void)[] = [];
  #webSocket?: WebSocket;
  readonly #reconnectIntervalMillis = 1000;

  constructor(url: string) {
    this.#url = url;
  }

  public onUpdate(
    handler: (taskStatus: TransactionStatusResponse) => void
  ): void {
    if (!handler) {
      throw new Error("Callback handler is not provided");
    }

    this.#taskStatusHandlers.push(handler);

    if (!this.#webSocket) {
      this._connectWebsocket(`${this.#url}/tasks/ws/status`);
    }
  }

  public offUpdate(
    handler: (taskStatus: TransactionStatusResponse) => void
  ): void {
    if (!handler) {
      throw new Error("Callback handler is not provided");
    }

    this.#taskStatusHandlers = this.#taskStatusHandlers.filter(
      (element) => element !== handler
    );

    if (this.#taskStatusHandlers.length === 0 && this.#webSocket) {
      this.#webSocket.close();
      this.#webSocket = undefined;
    }
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

  private _connectWebsocket(url: string) {
    this.#webSocket = new WebSocket(url);

    this.#webSocket.onopen = () => {
      this.#subscriptions.forEach((taskId) => {
        this._sendWebsocketMessage({
          action: "subscribe",
          taskId,
        });
      });
    };

    this.#webSocket.onclose = () => {
      setTimeout(() => {
        this._connectWebsocket(url);
      }, this.#reconnectIntervalMillis);
    };

    this.#webSocket.onmessage = (data: WebSocket.MessageEvent) => {
      const message = JSON.parse(data.data.toString()) as WebsocketMessage;
      if (message.event === WebsocketEvent.UPDATE) {
        const taskStatus = message.payload;

        if (isFinalTaskState(taskStatus.taskState)) {
          this.unsubscribe(taskStatus.taskId);
        }

        this.#taskStatusHandlers.forEach((handler) => {
          handler(taskStatus);
        });
      }
    };
  }

  private _sendWebsocketMessage(message: unknown): void {
    if (this.#webSocket && this.#webSocket.readyState === WebSocket.OPEN) {
      this.#webSocket.send(JSON.stringify(message));
    }
  }
}
