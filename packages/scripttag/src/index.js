import DisplayManager from './managers/DisplayManager';
import ApiManager from './managers/ApiManager';
import {shouldShowPopup} from './helpers/helper';

async function main() {
  const apiManager = new ApiManager();
  const displayManager = new DisplayManager(apiManager);

  const initialData = await apiManager.getApiData();
  console.log(initialData.setting);
  if (!shouldShowPopup(initialData.setting)) {
    return;
  }

  displayManager.initialize(initialData);
  apiManager.startAutoRefresh(
    newData => displayManager.updateData(newData),
    () => displayManager.getLatestTimestamp()
  );
}

main();
