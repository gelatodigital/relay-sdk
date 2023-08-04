export const calculateDeadline = (gap: number) => {
  return Math.floor(Date.now() / 1000) + gap;
};
