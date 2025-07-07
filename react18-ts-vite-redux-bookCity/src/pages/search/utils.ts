import storage from '@/utils/storage';
import { HISTORY_SEARCH_KEY } from './constants';

// 删除数组中的某个值
const deleteArrItem = (arr: string[], value: string) => {
  const index = arr.findIndex((item) => item === value);

  if (index !== -1) {
    arr.splice(index, 1);
  }
};

// 存储历史搜索到localStorage
export const setHistory = (value: string) => {
  if (!value) return;

  const arr: string[] = storage.get(HISTORY_SEARCH_KEY) || [];

  deleteArrItem(arr, value);

  arr.unshift(value);

  storage.set(HISTORY_SEARCH_KEY, arr);

  // 这行代码的作用是手动触发一个自定义的 local-storage 事件，并将与历史搜索相关的 key作为事件的附加传递出去。
  window.dispatchEvent(new CustomEvent('local-storage', { detail: { key: HISTORY_SEARCH_KEY } }));
};

// 删除历史搜索
export const deleteHistory = (value: string) => {
  const arr: string[] = storage.get(HISTORY_SEARCH_KEY) || [];

  deleteArrItem(arr, value);

  storage.set(HISTORY_SEARCH_KEY, arr);

  window.dispatchEvent(new CustomEvent('local-storage', { detail: { key: HISTORY_SEARCH_KEY } }));
};

// 删除所有历史搜索
export const clearHistory = () => {
  storage.remove(HISTORY_SEARCH_KEY);

  window.dispatchEvent(new CustomEvent('local-storage', { detail: { key: HISTORY_SEARCH_KEY } }));
};
