import { random } from '../helpers';
import { EVENT_TYPES, SHAPE_SIZE_LIMIT } from '../constants';

/*
* Controller binds view and model
* */
export class AppController {
    constructor(view, model) {
        this.view = view;
        this.model = model;

        this.onRemoveShape = this.onRemoveShape.bind(this);
        this.onAddShape = this.onAddShape.bind(this);
        this.onGravityUpdate = this.onGravityUpdate.bind(this);
        this.onShapesPerSecondUpdate = this.onShapesPerSecondUpdate.bind(this);
        this.tick = this.tick.bind(this);

        this.addListeners();
    }

    /*
    * Listen to view changes
    * */
    addListeners() {
        this.view.bind(EVENT_TYPES.ADD_SHAPE, this.onAddShape);
        this.view.bind(EVENT_TYPES.GRAVITY_UPDATE, this.onGravityUpdate);
        this.view.bind(EVENT_TYPES.SHAPES_PER_SECOND_UPDATE, this.onShapesPerSecondUpdate);
    }

    /*
    * It creates new shape, adds click handler to it's sprite and then sends to the view
    * */
    onAddShape(data) {
        const newShape = this.model.addShape(data);
        newShape.sprite.click = ($event) => {
            $event.stopPropagation(); // don't propagate to canvas
            this.model.removeShape(newShape, this.onRemoveShape);
        };

        this.view.addSprite(newShape.sprite);
    }

    onRemoveShape(shape) {
        this.view.removeSprite(shape.sprite);
    }

    onGravityUpdate(value) {
        this.model.gravity = value;
    }

    onShapesPerSecondUpdate(value) {
        this.model.shapesPerSecond = value;
    }

    tick(containerSize, shouldGenerate) {
        // each second generate given amount of shapes and remove those, which are outside of the canvas
        if (shouldGenerate) {
            this._generateShapes(containerSize, this.model.shapesPerSecond);
            this.model.removeFinishedShapes(containerSize, this.onRemoveShape);
        }
        // move shapes and update stats
        this.model.moveShapes();
        this.view.updateInfo(this.model.coveredArea, this.model.numberOfShapes);
    }

    /*
    * It generates shape data with random size and x-position
    * */
    _generateShapes(containerSize, amount) {
        const ms = new Date().getTime();
        for (let i = 0; i < amount; i++) {
            const width = random(SHAPE_SIZE_LIMIT.WIDTH.MIN, SHAPE_SIZE_LIMIT.WIDTH.MAX);
            this.onAddShape({
                id: ms + i,
                x: random(0, containerSize.width - width),
                y: 0,
                width,
                height: random(SHAPE_SIZE_LIMIT.HEIGHT.MIN, SHAPE_SIZE_LIMIT.HEIGHT.MAX)
            });
        }
    }
}
