import makeRequest from '../helpers/api/makeRequest';

export default class ApiManager {
  constructor() {
    this.shopDomain = window.Shopify?.shop || window.location.hostname;
    this.host = process.env.HOST || '';
    if (this.host && !this.host.startsWith('http')) {
      this.host = `https://${this.host}`;
    }
  }

  async recordEvent(type) {
    try {
      const url = `${this.host}/clientApi/records`;
      await makeRequest({
        url: url,
        method: 'POST',
        data: {
          shopDomain: this.shopDomain,
          type: type
        }
      });
    } catch (e) {
      console.error('Failed to record click', e);
    }
  }

  /**
   *
   * @param since
   * @returns {Promise<{notifications: ([]|*|*[]), setting: (*|{})}|{notifications: *[], setting: {}}>}
   */
  async getApiData(since = null) {
    try {
      const params = new URLSearchParams({shopDomain: this.shopDomain});
      if (since) params.append('since', since);

      const url = `${this.host}/clientApi/notifications?${params.toString()}`;
      const response = await makeRequest({url: url, method: 'GET'});

      return {
        notifications: response?.data?.notifications.reverse() || [],
        setting: response?.data?.setting || {}
      };
    } catch (error) {
      console.error('[ApiManager] Fetch data failed:', error);
      return {notifications: [], setting: {}};
    }
  }

  /**
   *
   * @param callback
   * @param getSince
   */
  startAutoRefresh(callback, getSince) {
    setInterval(async () => {
      console.log('ApiManager: Refreshing data...');
      const since = getSince();
      const data = await this.getApiData(since);
      callback(data);
    }, 30 * 1000);
  }
}
