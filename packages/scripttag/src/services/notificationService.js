import {fetchNotifications} from '../utils/api';
import {state} from '../utils/state';

export async function fetchAndEnqueue() {
  if (state.isFetching) return;
  state.isFetching = true;

  try {
    const {notifications = [], setting = null} = (await fetchNotifications(state.lastSync)) || {};
    if (setting) {
      state.settings = setting;
    }

    if (notifications.length > 0) {
      state.lastSync = notifications[0].timestamp;
      const newItems = [...notifications].reverse();
      newItems.forEach(noti => {
        const isDuplicate = state.queue.some(item => item.id === noti.id);
        if (!isDuplicate) {
          state.queue.push(noti);
          state.inventory.push(noti);
        }
      });

      if (state.inventory.length > 20) {
        state.inventory = state.inventory.slice(-20);
      }

      console.log(`Queue: ${state.queue.length}, Inventory: ${state.inventory.length}`);
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  } finally {
    state.isFetching = false;
  }
}

export function getNextNotification() {
  if (state.queue.length > 0) {
    return {
      noti: state.queue.shift(),
      isRealData: true
    };
  }

  if (state.settings?.allowLoop && state.inventory.length > 0) {
    const randomIndex = Math.floor(Math.random() * state.inventory.length);
    return {
      noti: {
        ...state.inventory[randomIndex],
        id: `loop_${Date.now()}_${Math.random()}`,
        timestamp: new Date().toISOString()
      },
      isRealData: false
    };
  }
  return null;
}
