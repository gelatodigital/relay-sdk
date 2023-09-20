import { axiosInstance, getHttpErrorMessage } from "../../utils";
import { Config } from "../types";

import { TransactionStatusResponse } from "./types";

export const getTaskStatus = async (
  payload: { taskId: string },
  config: Config
): Promise<TransactionStatusResponse | undefined> => {
  try {
    return (
      await axiosInstance.get(`${config.url}/tasks/status/${payload.taskId}`)
    ).data.task;
  } catch (error) {
    throw new Error(
      `GelatoRelaySDK/getTaskStatus: Failed with error: ${getHttpErrorMessage(
        error
      )}`
    );
  }
};
