import { createStore } from "redux";
import reducer from "./reducer/index";
import * as Actions from "./action";
import initialState from "./initialState";

const PERSIST_KEYS = ["user", "dashboard", "bikes", "brands", "showroom"];

const loadState = () => {
  try {
    const serializedState = localStorage.getItem("multiBrandState");
    if (serializedState === null) {
      return undefined;
    }
    const persistedState = JSON.parse(serializedState);
    return {
      ...initialState,
      ...persistedState,
    };
  } catch (err) {
    console.error("Error loading state:", err);
    return undefined;
  }
};

const saveState = (state: any) => {
  try {
    const stateToPersist: any = {};
    PERSIST_KEYS.forEach((key) => {
      if (state[key]) {
        stateToPersist[key] = state[key];
      }
    });
    const serializedState = JSON.stringify(stateToPersist);
    localStorage.setItem("multiBrandState", serializedState);
  } catch (err) {
    console.error("Error saving state:", err);
  }
};

const persistedState = loadState();
const store = createStore(reducer, persistedState);

store.subscribe(() => {
  saveState(store.getState());
});

export { store, Actions };
export type AppDispatch = typeof store.dispatch;
