import { UI } from './index';

export interface IUIStore {
    name: string;
    ui: InstanceType<typeof UI>
}