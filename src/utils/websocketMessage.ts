import { TransactionStatusResponse } from "../lib/status/types/index.js";

export enum WebsocketEvent {
  ERROR = "error",
  UPDATE = "update",
}

export interface WebsocketMessage<T> {
  event: WebsocketEvent;
  payload: T;
}

export interface UpdateWebsocketMessage {
  event: WebsocketEvent.UPDATE;
  payload: TransactionStatusResponse;
}

export interface ErrorWebsocketMessage {
  event: WebsocketEvent.ERROR;
  payload: Error;
}
