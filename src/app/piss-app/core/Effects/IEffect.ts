import { IAddOptions } from 'resource-loader';

export interface IEffect {
    assets?: IAddOptions[];
    container?: PIXI.Container;
    filters: PIXI.Filter[];
    filterIndexs: number[];
    enabled: boolean;

    init: (...params: any[]) => any;
    destroy?: (...params: any[]) => any;
    events?: (...params: any[]) => any;
    tick?: (...param: any[]) => any;
}
