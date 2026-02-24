import moment from 'moment/moment';

export const delay = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

export function timeAgo(timestamp) {
  if (!timestamp) return 'just now';
  const mDate = moment(timestamp);
  if (!mDate.isValid()) return '';
  return mDate.fromNow();
}

export function truncate(str, limit = 18) {
  if (!str) return '';
  return str.length > limit ? `${str.substring(0, limit)}...` : str;
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function parseUrls(urlStr) {
  const urls = (urlStr || '')
    .split('\n')
    .map(url => url.trim())
    .filter(Boolean);
  return new Set(urls);
}

export function shouldShowPopup(setting) {
  const {allowShow, excludedUrls, includedUrls} = setting;
  const currentPath = window.location.pathname;

  if (allowShow === 'all') {
    const excludedSet = parseUrls(excludedUrls);
    return !excludedSet.has(currentPath);
  }

  if (allowShow === 'specific') {
    const includedSet = parseUrls(includedUrls);
    return includedSet.has(currentPath);
  }
  return true;
}
