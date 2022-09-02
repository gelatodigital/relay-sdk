import axios from "axios";

import { GELATO_RELAY_URL } from "../../constants";
import { getHttpErrorMessage } from "../../utils";

import { TransactionStatus } from "./types";

/**
 * @param {string} taskId - Task Id
 * @returns {Promise<TransactionStatus | undefined>} Transaction status of the task id
 *
 */
export const getTaskStatus = async (
  taskId: string
): Promise<TransactionStatus | undefined> => {
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
