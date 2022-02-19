import { State as MainState } from './slices/main.slice';
import { State as ModManagerState } from './slices/modManager.slice';
import { State as ConfigState } from './slices/config.slice';

export default interface StoreState {
    main: MainState;
    modManager: ModManagerState;
    config: ConfigState;
}
