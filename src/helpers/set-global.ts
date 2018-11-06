import globalStateManager from '../global-state-manager';
import { GlobalCallback, NewGlobal } from '../../typings/reactn';

export default function setGlobal(newGlobal: NewGlobal, callback: GlobalCallback | null = null) {
  return globalStateManager.setAnyCallback(newGlobal, callback);
};
