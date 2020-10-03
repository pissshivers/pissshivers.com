import * as PIXI from 'pixi.js';
window.PIXI = PIXI;
import 'pixi-picture';

import fragment from './backdrop.frag';
import vertex from './backdrop.vert';

export class BackdropDisplacementFilter extends PIXI.Filter
{
    public maskSprite: any;
    public maskMatrix: any;
    public scale: any;
    backdropUniformName: string;
    clearColor: any;

    /**
     * @param {PIXI.Sprite} sprite - The sprite used for the displacement map. (make sure its added to the scene!)
     * @param {number} [scale] - The scale of the displacement
     */
    constructor(scale?: number) {
        super(
            vertex,
            fragment,
        );

        this.uniforms.scale = { x: 1, y: 1 };

        if (scale === null || scale === undefined) {
            scale = 20;
        }

        this.scale = new PIXI.Point(scale, scale);

        this.backdropUniformName = 'backdropSampler';
    }

    apply(filterManager: PIXI.systems.FilterSystem, input: PIXI.RenderTexture, output: PIXI.RenderTexture, clearMode: PIXI.CLEAR_MODES) {
        this.uniforms.scale.x = this.scale.x;
        this.uniforms.scale.y = this.scale.y;

        // draw the filter...
        filterManager.applyFilter(this, input, output, clearMode);

        this.clearColor = [0.5, 0.5, 0.5, 1.0];
    }
}