const PIXI = require('pixi.js');
import { Triangle, Rectangle, Circle, Ellipse, Pentagon, Hexagon } from '../models/shape-types';
import { random } from '../helpers';

const shapeClasses = [Triangle, Rectangle, Circle, Ellipse, Pentagon, Hexagon];

/*
* Model keeps state of the application and provides API (to the controller) for manipulating this state
* */
export class AppModel {
    constructor() {
        this.shapes = [];
        this.gravity = 1;
        this.shapesPerSecond = 2;

        this.addShape = this.addShape.bind(this);
        this.removeShape = this.removeShape.bind(this);
    }

    addShape(data) {
        const sprite = this._createEmptySprite();
        const ShapeClass = shapeClasses[random(0, shapeClasses.length)]; // randomly select type of shape
        const newShape = new ShapeClass(Object.assign(data, { sprite }));
        this.shapes.push(newShape);

        return newShape;
    }

    moveShapes() {
        this.shapes.forEach(shape => {
            shape.move({ x: 0, y: this.gravity });
        });
    }

    removeShape(shapeToRemove, callback) {
        const shapeIndex = this.shapes.findIndex(shape => shape.id === shapeToRemove.id);
        callback(this.shapes[shapeIndex]); // notify view (through controller) in order to remove sprite from canvas
        this.shapes.splice(shapeIndex, 1);
    }

    removeFinishedShapes(containerSize, callback) {
        this.shapes
            .filter(shape => shape.x >= containerSize.width || shape.y >= containerSize.height)
            .forEach((shape) => {
                this.removeShape(shape, callback);
            });
    }

    _createEmptySprite() {
        const sprite = new PIXI.Sprite();
        sprite.interactive = true;
        return sprite;
    }

    get coveredArea() {
        return Math.ceil(this.shapes.reduce((prev, curr) => prev + curr.coveredArea, 0));
    }

    get gravity() {
        return this._gravity;
    }

    set gravity(value) {
        this._gravity = Number(value);
    }

    get shapesPerSecond() {
        return this._shapesPerSecond;
    }

    set shapesPerSecond(value) {
        this._shapesPerSecond = Number(value);
    }

    get numberOfShapes() {
        return this.shapes.length;
    }
}
