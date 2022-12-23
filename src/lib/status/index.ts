import axios from "axios";

import { GELATO_RELAY_URL } from "../../constants";
import { getHttpErrorMessage } from "../../utils";

import { TransactionStatusResponse } from "./types";

export const getTaskStatus = async (
  taskId: string
): Promise<TransactionStatusResponse | undefined> => {
  try {
    return (await axios.get(`${GELATO_RELAY_URL}/tasks/status/${taskId}`)).data
      .task;
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getTaskStatus: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
