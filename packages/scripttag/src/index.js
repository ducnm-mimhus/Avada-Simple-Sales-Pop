import DisplayManager from './managers/DisplayManager';
import ApiManager from './managers/ApiManager';
import Helper from './helpers/Helper';

async function main() {
  const apiManager = new ApiManager();
  const displayManager = new DisplayManager();
  const helper = new Helper();

  const initialData = await apiManager.getApiData();
  if (!helper.shouldShowPopup(initialData.setting)) {
    return;
  }

  displayManager.initialize(initialData);
  apiManager.startAutoRefresh(
    newData => displayManager.updateData(newData),
    () => displayManager.getLatestTimestamp()
  );
}

main();
