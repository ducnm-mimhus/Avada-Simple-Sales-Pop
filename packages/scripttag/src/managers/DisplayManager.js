import {h, render} from 'preact';
import {insertAfter} from '../helpers/insertHelpers';
import {Popup} from '../components/Popup';
import {delay} from '../helpers/helper';

export default class DisplayManager {
  constructor(apiManager) {
    this.liveQueue = [];
    this.inventory = [];
    this.setting = {};
    this.container = null;
    this.apiManager = apiManager;
  }

  /**
   *
   * @param notifications
   * @param setting
   * @returns {Promise<void>}
   */
  async initialize({notifications, setting}) {
    this.setting = setting || {};
    this.liveQueue = [...(notifications || [])];
    this.inventory = (notifications || []).slice(0, 20);
    this.container = this.insertContainer();

    if (this.inventory.length > 0 || this.liveQueue.length > 0) {
      await delay(this.setting.firstDelay);
      this.startDisplayLoop();
    }
  }

  /**
   *
   * @param notifications
   * @param setting
   */
  updateData({notifications, setting}) {
    if (setting) this.setting = setting;

    if (notifications && notifications.length > 0) {
      notifications.forEach(noti => {
        const isExist =
          this.inventory.some(item => item.id === noti.id) ||
          this.liveQueue.some(item => item.id === noti.id);
        if (!isExist) {
          this.liveQueue.push(noti);
          this.inventory = [noti, ...this.inventory].slice(0, 20);
        }
      });
    }
  }

  getLatestTimestamp() {
    return this.inventory[0]?.timestamp || null;
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async startDisplayLoop() {
    while (true) {
      const nextItem = this.getNextNotification();
      if (!nextItem) {
        await delay(1);
        continue;
      }

      const {noti, isRealData} = nextItem;
      this.display(noti);

      await delay(this.setting.displayDuration);
      this.fadeOut();
      await this.waitForNext(isRealData);
    }
  }

  /**
   *
   * @returns {{noti: *, isRealData: boolean}|null|{noti: {[p: string]: *}, isRealData: boolean}}
   */
  getNextNotification() {
    if (this.liveQueue.length > 0) {
      return {noti: this.liveQueue.shift(), isRealData: true};
    }

    if (this.setting.allowLoop && this.inventory.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.inventory.length);
      const randomNoti = {...this.inventory[randomIndex]};

      randomNoti.timestamp = new Date().toISOString();
      randomNoti.id = `loop_${Date.now()}`;

      return {noti: randomNoti, isRealData: false};
    }
    return null;
  }

  /**
   *
   * @param isRealData
   * @returns {Promise<void>}
   */
  async waitForNext(isRealData) {
    if (isRealData) {
      await delay(this.setting.popsInterval || 3);
    } else {
      const minGap = 5;
      const maxGap = this.setting.randomGap || 10;
      const waitTime = Math.floor(Math.random() * (maxGap - minGap + 1)) + minGap;
      await delay(waitTime);
    }
  }

  display(notification) {
    render(
      <Popup
        notification={notification}
        setting={this.setting}
        onItemClick={() => this.apiManager.recordEvent('Clicks')}
      />,
      this.container
    );
    this.apiManager.recordEvent('Impressions');
  }

  fadeOut() {
    if (this.container) render(null, this.container);
  }

  /**
   *
   * @returns {Element}
   */
  insertContainer() {
    let popupEl = document.querySelector('#Avada-SalePop');
    if (popupEl) return popupEl;
    popupEl = document.createElement('div');
    popupEl.id = `Avada-SalePop`;
    popupEl.classList.add('Avada-SalePop__OuterWrapper');
    Object.assign(popupEl.style, {position: 'fixed', zIndex: '2147483647', pointerEvents: 'none'});
    const targetEl = document.body.firstChild;
    if (targetEl) insertAfter(popupEl, targetEl);
    return popupEl;
  }
}
