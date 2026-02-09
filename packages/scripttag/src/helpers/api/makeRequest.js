/**
 * Wrap XHR in promise
 *
 * @param url
 * @param method
 * @param data
 * @param options
 * @returns {Promise<unknown>}
 */
export default function makeRequest(url, method, data = null, options = {}) {
  const request = new XMLHttpRequest();
  return new Promise(function(resolve, reject) {
    request.onreadystatechange = function() {
      if (request.readyState !== 4) return;
      if (request.status >= 200 && request.status < 300) {
        resolve(JSON.parse(request.responseText));
      } else {
        reject(request.statusText);
      }
    };

    request.open(method || 'GET', url, true);
    if (data) {
      const contentType = options.contentType || 'application/json;charset=UTF-8';
      request.setRequestHeader('Content-Type', contentType);
      request.send(JSON.stringify(data));
    } else {
      request.send();
    }
  });
}
