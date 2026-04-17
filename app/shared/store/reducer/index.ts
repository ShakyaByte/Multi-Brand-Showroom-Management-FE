import { produce } from "immer";
import type { Draft } from "immer";
import { SET, RESET, UPDATE, REMOVE, APPEND, PREPEND } from "../constants";
import initialState from "../initialState";
import set from "./set";
import update from "./update";

interface Action {
  key: keyof typeof initialState;
  data?: any;
  type: string;
}

const appReducer = (state = initialState, action: Action) => {
  return produce(state, (draft: Draft<any>) => {
    const data = action?.data;
    const key = action?.key;
    const oldState: any = state;

    if (!!data?.loadingState) {
      if (!!draft[key]?.loadingState) {
        draft[key] = { ...oldState[key], loading: data?.loading };
      }
      return;
    }

    switch (action.type) {
      case SET:
        draft[key] = set({
          data,
          loadingState: draft[key]?.loadingState,
          oldData: oldState[key],
        });
        break;
      case RESET:
        draft[key] = initialState[key];
        break;
      case UPDATE:
        draft[key] = update({
          data,
          loadingState: draft[key]?.loadingState,
          oldData: oldState[key],
          draft: draft[key],
        });
        break;
      case APPEND:
        if (draft[key]?.items) {
           draft[key].items.push(data);
        } else if (Array.isArray(draft[key]?.data)) {
           draft[key].data.push(data);
        }
        break;
      case PREPEND:
        if (draft[key]?.items) {
           draft[key].items.unshift(data);
        } else if (Array.isArray(draft[key]?.data)) {
           draft[key].data.unshift(data);
        }
        break;
      case REMOVE:
        if (draft[key]?.items) {
          draft[key].items = draft[key].items.filter((item: any) => item.id !== data?.id);
        } else if (Array.isArray(draft[key]?.data)) {
          draft[key].data = draft[key].data.filter((item: any) => item.id !== data?.id);
        }
        break;
      default:
        break;
    }
  });
};

export default appReducer;
