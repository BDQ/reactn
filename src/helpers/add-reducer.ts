import createReducer from '../create-reducer';
import reducers from '../reducers';
import { GlobalReducer } from '../../typings/reactn';

export default function addReducer(name: string, reducer: GlobalReducer): void {
  reducers[name] = createReducer(reducer);
};
