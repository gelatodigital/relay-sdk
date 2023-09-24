import { TransactionStatusResponse } from "../lib/status/types/index.js";

export enum WebsocketEvent {
  UPDATE = "update",
}

export interface WebsocketMessage {
  event: WebsocketEvent;
  payload: TransactionStatusResponse;
}
