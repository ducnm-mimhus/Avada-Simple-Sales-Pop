/**
 *
 * @param urlStr
 * @returns {Set<string>}
 */
const parseUrls = urlStr => {
  const urls = (urlStr || '')
    .split('\n')
    .map(url => url.trim())
    .filter(Boolean);
  return new Set(urls);
};

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

  return false;
}
