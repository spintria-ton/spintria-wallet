import { atom } from 'recoil';

export const resetableDependencyVersion = atom({
  key: 'resetableDependencyVersion',
  default: 0,
});
