import {h, render} from 'preact';
import {delay} from '../utils/delay';
import {Popup} from '../components/Popup';
import {state} from '../utils/state';
import {getNextNotification} from './notificationService';

function getOrCreateContainer() {
  let container = document.getElementById('avada-sales-pop-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'avada-sales-pop-container';
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '2147483647',
      pointerEvents: 'none',
      display: 'block'
    });
    document.body.appendChild(container);
  }
  return container;
}

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export async function processQueue() {
  const container = getOrCreateContainer();
  console.log('Consumer started running...');

  while (true) {
    const config = state.settings;

    if (!config) {
      await delay(1);
      continue;
    }

    const nextItem = getNextNotification();
    if (!nextItem) {
      await delay(1);
      continue;
    }

    const {noti, isRealData} = nextItem;
    console.log(isRealData ? 'Real Order:' : 'Fake Loop:', noti.productName);

    render(<Popup notification={noti} setting={config} />, container);
    await delay(config.displayDuration);
    render(null, container);

    if (isRealData) {
      await delay(config.popsInterval);
    } else {
      const minGap = 5;
      const maxGap = config.randomGap;
      const waitTime = getRandomInt(minGap, maxGap);
      console.log(`Waiting random ${waitTime}s...`);

      for (let i = 0; i < waitTime; i++) {
        if (state.queue.length > 0) {
          console.log('Interrupt: Đơn thật mới về! Hủy chờ.');
          break;
        }
        await delay(1);
      }
    }
  }
}
