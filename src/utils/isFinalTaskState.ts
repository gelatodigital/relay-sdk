import { TaskState } from "../lib/status/types/index.js";

export const isFinalTaskState = (taskState: TaskState): boolean => {
  switch (taskState) {
    case TaskState.ExecSuccess:
    case TaskState.ExecReverted:
    case TaskState.Cancelled:
      return true;
    default:
      return false;
  }
};
