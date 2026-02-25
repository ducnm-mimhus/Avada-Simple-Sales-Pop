import {h, render} from 'preact';
import {insertAfter} from '../helpers/insertHelpers';
import {Popup} from '../components/Popup';
import {delay} from '../helpers/helper';
import SessionStorageManager from './SessionStorageManager';

const STAT_THRESHOLD = 10;
const FLUSH_INTERVAL = 120 * 1000;
const MAX_INVENTORY_SIZE = 20;
const DEFAULT_FIRST_DELAY = 5;
const DEFAULT_POPS_INTERVAL = 3;
const DEFAULT_PENDING_STARTS = {impressions: 0, clicks: 0};

export default class DisplayManager {
  constructor(apiManager) {
    this.apiManager = apiManager;
    this.storage = new SessionStorageManager();
    const savedState = this.storage.getState();
    this.liveQueue = savedState?.liveQueue || [];
    this.inventory = savedState?.inventory || [];
    this.setting = savedState?.setting || {};
    this.pendingStats = savedState?.pendingStats || DEFAULT_PENDING_STARTS;
    this.container = null;
    this.isResumed = !!savedState;
    this.setupExitListener();
    this.setupAutoFlush();
  }

  syncStorage() {
    this.storage.saveState({
      liveQueue: this.liveQueue,
      inventory: this.inventory,
      setting: this.setting,
      pendingStats: this.pendingStats
    });
  }

  /**
   *
   @param notifications
   @param setting
   @returns {Promise<void>}
   */
  async initialize({notifications, setting}) {
    this.setting = setting || {};
    const newNotifications = notifications || [];
    newNotifications.forEach(notification => {
      const isExist = this.inventory.some(item => item.id === notification.id);
      if (!isExist) {
        this.liveQueue.push(notification);
        this.inventory = [notification, ...this.inventory].slice(0, MAX_INVENTORY_SIZE);
      }
    });

    this.container = this.insertContainer();
    this.syncStorage();

    if (this.inventory.length > 0 || this.liveQueue.length > 0) {
      const initialDelay = this.isResumed
        ? this.setting.popsInterval || DEFAULT_POPS_INTERVAL
        : this.setting.firstDelay || DEFAULT_FIRST_DELAY;

      await delay(initialDelay);
      this.startDisplayLoop();
    }
  }

  trackEvent(type) {
    if (this.pendingStats.hasOwnProperty(type)) {
      this.pendingStats[type]++;
    }

    const shouldFlush = type === 'clicks' || this.pendingStats.impressions >= STAT_THRESHOLD;
    if (shouldFlush) {
      this.flushStats();
    }

    this.syncStorage();
  }

  setupExitListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushStats();
      }
    });
  }

  setupAutoFlush() {
    setInterval(() => {
      if (this.pendingStats.impressions > 0 || this.pendingStats.clicks > 0) {
        this.flushStats();
      }
    }, FLUSH_INTERVAL);
  }

  async flushStats() {
    if (this.pendingStats.impressions === 0 && this.pendingStats.clicks === 0) return;
    const dataToSave = {...this.pendingStats};
    this.pendingStats = {impressions: 0, clicks: 0};
    this.syncStorage();

    try {
      await this.apiManager.recordEvent(dataToSave.impressions, dataToSave.clicks);
    } catch (e) {
      console.error('Flush failed', e);
    }
  }

  /**
   *
   @param notifications
   @param setting
   */
  updateData({notifications, setting}) {
    if (setting) this.setting = setting;
    if (notifications && notifications.length > 0) {
      notifications.forEach(notification => {
        const isExist = this.inventory.some(item => item.id === notification.id);
        if (!isExist) {
          this.liveQueue.push(notification);
          this.inventory = [notification, ...this.inventory].slice(0, 20);
        }
      });
      this.syncStorage();
    }
  }

  getLatestTimestamp() {
    return this.inventory[0]?.timestamp || null;
  }

  /**
   *

   @returns {Promise<void>}
   */
  async startDisplayLoop() {
    while (true) {
      const nextItem = this.getNextNotification();
      if (!nextItem) {
        console.log('Khong cos pop up moi!q');
        await delay(1);
        continue;
      }

      const {notification, isRealData} = nextItem;
      this.display(notification);

      await delay(this.setting.displayDuration);
      this.fadeOut();

      this.syncStorage();
      await this.waitForNext(isRealData);
    }
  }

  /**
   *

   @returns {{noti: *, isRealData: boolean}|null|{noti: {[p: string]: *}, isRealData: boolean}}
   */
  getNextNotification() {
    if (this.liveQueue.length > 0) {
      const notification = this.liveQueue.shift();
      return {notification, isRealData: true};
    }
    if (this.setting.allowLoop && this.inventory.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.inventory.length);
      const randomNotification = {...this.inventory[randomIndex]};
      randomNotification.timestamp = new Date().toISOString();
      randomNotification.id = `loop_${Date.now()}`;
      return {notification: randomNotification, isRealData: false};
    }
    return null;
  }

  /**
   *
   @param isRealData
   @returns {Promise<void>}
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

  /**
   *
   @param notification
   */
  display(notification) {
    render(
      <Popup
        notification={notification}
        setting={this.setting}
        onItemClick={() => this.trackEvent('clicks')}
      />,
      this.container
    );
    this.trackEvent('impressions');
  }

  fadeOut() {
    if (this.container) render(null, this.container);
  }

  /**
   *
   @returns {Element}
   */
  insertContainer() {
    let popupEl = document.querySelector('#Avada-SalePop');
    if (popupEl) return popupEl;
    popupEl = document.createElement('div');
    popupEl.id = 'Avada-SalePop';
    popupEl.classList.add('Avada-SalePop__OuterWrapper');
    Object.assign(popupEl.style, {position: 'fixed', zIndex: '2147483647', pointerEvents: 'none'});
    const targetEl = document.body.firstChild;
    if (targetEl) insertAfter(popupEl, targetEl);
    return popupEl;
  }
}
