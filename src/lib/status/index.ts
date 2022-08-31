import axios from "axios";

import { GELATO_RELAY_URL } from "../../constants";
import { getHttpErrorMessage } from "../../utils";

import { Service, TransactionStatus } from "./types";

/**
 * @param {string} taskId - Task Id
 * @param {Service} [service] - Optional Service parameter: Service.Relay or Service.Relay_V2
 * @returns {Promise<TransactionStatus | undefined>} Transaction status of the task id
 *
 */
export const getTaskStatus = async (
  taskId: string,
  service?: Service
): Promise<TransactionStatus | undefined> => {
  try {
    let path: string;
    if (service) {
      path = `${GELATO_RELAY_URL}/tasks/status/${service}/${taskId}`;
    } else {
      path = `${GELATO_RELAY_URL}/tasks/status/${taskId}`;
    }
    return (await axios.get(path)).data.task;
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getTaskStatus: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
