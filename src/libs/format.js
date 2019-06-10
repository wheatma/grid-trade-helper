export const formatAmount = num => {
  if (isNaN(num)) {
    return num;
  }
  return Math.round(num);
};

export const formatPrice = num => {
  if (isNaN(num)) {
    return num;
  }
  return Number(num).toFixed(2);
};
