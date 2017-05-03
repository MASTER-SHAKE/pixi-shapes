const PIXI = require('pixi.js');
import { random } from '../helpers';
import { EVENT_TYPES, SHAPE_SIZE_LIMIT } from '../constants';

/*
* The purpose of View class is to notify controller about changes in DOM
* and to expose API for DOM manipulations
* */
export class AppView {
    constructor(app) {
        this.app = app;

        this.$numberOfShapes = document.getElementById('number-of-shapes');
        this.$coveredArea = document.getElementById('covered-area');
        this.$shapesPerSecond = document.getElementById('shapes-per-second');
        this.$gravity = document.getElementById('gravity');

        this.updateInfo = this.updateInfo.bind(this);

        this.addBackground();
    }

    addBackground() {
        const g = new PIXI.Graphics();
        g.beginFill(0x000000);
        g.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        g.endFill();

        this.background = new PIXI.Sprite(g.generateCanvasTexture());
        this.background.interactive = true;
        this.app.stage.addChild(this.background);
    }

    /*
    * Registers controller's functions as listeners of DOM-events
    * */
    bind(event, handler) {
        switch (event) {
            case EVENT_TYPES.ADD_SHAPE: {
                this.background.click = ($event) => {
                    handler(this._getRandomShapeData($event.data.global));
                };
                break;
            }
            case EVENT_TYPES.GRAVITY_UPDATE: {
                this.$gravity.addEventListener('input', ($event) => {
                    handler($event.target.value);
                });
                break;
            }
            case EVENT_TYPES.SHAPES_PER_SECOND_UPDATE: {
                this.$shapesPerSecond.addEventListener('input', ($event) => {
                    handler($event.target.value);
                });
                break;
            }
            default: return;
        }
    }

    tick() {}

    addSprite(sprite) {
        this.app.stage.addChild(sprite);
    }

    removeSprite(sprite) {
        this.app.stage.removeChild(sprite);
        sprite.click = null;
        sprite.destroy();
    }

    updateInfo(coveredArea, numberOfShapes) {
        this.$coveredArea.innerText = `${coveredArea} px^2`;
        this.$numberOfShapes.innerText = numberOfShapes;
    }

    _getRandomShapeData(position) {
        return Object.assign({}, position, {
            width: random(SHAPE_SIZE_LIMIT.WIDTH.MIN, SHAPE_SIZE_LIMIT.WIDTH.MAX),
            height: random(SHAPE_SIZE_LIMIT.HEIGHT.MIN, SHAPE_SIZE_LIMIT.HEIGHT.MAX)
        });
    }
}
