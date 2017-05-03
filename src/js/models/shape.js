import { polygonArea } from '../helpers';
const PIXI = require('pixi.js');

export class Shape {
    constructor(data = {}) {
        if (data.sprite == null) {
            throw new Error('Can\'t instantiate shape without sprite');
        }

        this.id = data.id || new Date().getTime();
        this.width = data.width || 50;
        this.height = data.height || 50;
        this.color = this.generateColor() || 0xFF3300;
        this.points = data.points || null;
        this.sprite = data.sprite;
        this.x = data.x;
        this.y = data.y;

        this.initSprite(this.render());
        this.coveredArea = this.getArea();
    }

    move(deltaPosition) {
        this.x += deltaPosition.x;
        this.y += deltaPosition.y;
    }

    render() {
        if (!this.points) {
            return;
        }

        const g = this.createGraphics();
        g.beginFill(this.color);
        g.moveTo(this.x, this.y);
        this.points.forEach(point => {
            g.lineTo(point.x, point.y);
        });
        g.lineTo(this.x, this.y);
        g.endFill();

        return g;
    }

    initSprite(g) {
        if (g != null) {
            this.sprite.texture = g.generateCanvasTexture();
        }
    }

    createGraphics() {
        const g = new PIXI.Graphics();
        g.boundsPadding = 0;

        return g;
    }

    getArea() {
        if (!this.points) {
            return;
        }
        const top = { x: this.x, y: this.y };
        return polygonArea([top].concat(this.points).concat([top]));
    }

    generateColor() {
        return parseInt(Math.floor(Math.random() * 16777215), 16);
    }

    get x() {
        return this.sprite.position.x;
    }

    set x(value) {
        this.sprite.position.x = value;
    }

    get y() {
        return this.sprite.position.y;
    }

    set y(value) {
        this.sprite.position.y = value;
    }
}
