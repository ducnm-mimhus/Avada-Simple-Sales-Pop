const STORAGE_KEY = 'avada_sales_pop_state';

export default class SessionStorageManager {
  /**
   *
   * @returns {any|null}
   */
  getState() {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Failed to load session state', e);
      return null;
    }
  }

  /**
   *
   * @param state
   */
  saveState(state) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save session state', e);
    }
  }

  /**
   *
   * @param partialState
   */
  updateState(partialState) {
    const currentState = this.getState() || {};
    const newState = {...currentState, ...partialState};
    this.saveState(newState);
  }

  clear() {
    sessionStorage.removeItem(STORAGE_KEY);
  }
}
