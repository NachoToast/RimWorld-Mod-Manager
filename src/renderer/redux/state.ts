import { State as MainState } from './slices/main.slice';
import { State as ModManagerState } from './slices/modManager.slice';

export default interface StoreState {
    main: MainState;
    modManager: ModManagerState;
}
