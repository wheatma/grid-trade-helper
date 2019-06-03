export const formatAmount = num => {
  return Math.round(num);
};

export const formatPrice = num => {
  return Number(num).toFixed(2);
};
