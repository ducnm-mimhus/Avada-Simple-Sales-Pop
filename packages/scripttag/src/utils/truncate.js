export const truncate = (str, limit = 18) => {
  if (!str) return '';
  return str.length > limit ? `${str.substring(0, limit)}...` : str;
};
