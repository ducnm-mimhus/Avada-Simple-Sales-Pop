import moment from 'moment';

/**
 * @param {string|number|Date} timestamp
 * @returns {string}
 */
export const timeAgo = timestamp => {
  if (!timestamp) return 'just now';
  const cleanTime = typeof timestamp === 'string' ? timestamp.replace(/\bat\b/g, '') : timestamp;
  const mDate = moment(cleanTime);
  if (!mDate.isValid()) return '';
  return mDate.fromNow();
};
