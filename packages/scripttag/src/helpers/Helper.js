import moment from 'moment/moment';

export default class Helper {
  delay = seconds => new Promise(resolve => setTimeout(resolve, seconds * 1000));

  timeAgo = timestamp => {
    if (!timestamp) return 'just now';
    const mDate = moment(timestamp);
    if (!mDate.isValid()) return '';
    return mDate.fromNow();
  };

  truncate = (str, limit = 18) => {
    if (!str) return '';
    return str.length > limit ? `${str.substring(0, limit)}...` : str;
  };

  slugify = text => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  parseUrls(urlStr) {
    const urls = (urlStr || '')
      .split('\n')
      .map(url => url.trim())
      .filter(Boolean);
    return new Set(urls);
  }

  shouldShowPopup(setting) {
    const {allowShow, excludedUrls, includedUrls} = setting;
    const currentPath = window.location.pathname;

    if (allowShow === 'all') {
      const excludedSet = this.parseUrls(excludedUrls);
      return !excludedSet.has(currentPath);
    }

    if (allowShow === 'specific') {
      const includedSet = this.parseUrls(includedUrls);
      return includedSet.has(currentPath);
    }
    return true;
  }
}
