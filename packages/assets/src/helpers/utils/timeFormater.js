import moment from 'moment';

export const cleanDate = timestamp => {
  if (!timestamp) return moment();
  const cleanTime = typeof timestamp === 'string' ? timestamp.replace(/\s+at\s+/i, ' ') : timestamp;

  const m = moment(cleanTime);
  return m.isValid() ? m : moment();
};

export const formatDate = timestamp => {
  const m = cleanDate(timestamp);
  return `From ${m.format('MMMM D, YYYY')}`;
};

export const timeAgo = timestamp => {
  const m = cleanDate(timestamp);
  return m.fromNow();
};
