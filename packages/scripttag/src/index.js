import {fetchAndEnqueue} from './services/notificationService';
import {processQueue} from './services/displayService';
import {delay} from './utils/delay';
import {shouldShowPopup} from './utils/url';
import {state} from './utils/state';

async function start() {
  console.log('Avada Sales Pop: Initializing...');
  await fetchAndEnqueue();

  if (!state.settings) {
    console.log('No settings found. Stop.');
    return;
  }

  if (!shouldShowPopup(state.settings)) {
    console.log('Page excluded.');
    return;
  }

  await delay(state.settings.firstDelay);
  processQueue();
  setInterval(fetchAndEnqueue, 30 * 1000);
}

start();
