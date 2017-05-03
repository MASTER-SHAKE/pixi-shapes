const PIXI = require('pixi.js');
import { AppController } from './controllers/app.controller';
import { AppView } from './views/app.view';
import { AppModel } from './models/app.model';


const appContainer = document.getElementById('app');
const app = new PIXI.Application(appContainer.clientWidth, appContainer.clientHeight);
app.stage.interactive = true;

appContainer.appendChild(app.view);

const view = new AppView(app);
const model = new AppModel();
const controller = new AppController(view, model);


let renderCounter = 0;
app.ticker.add(() => {
    const containerSize = { width: app.view.clientWidth, height: app.view.clientHeight };
    const tickerInterval = app.ticker.elapsedMS; // ~16.6667ms by default
    const shouldGenerate = renderCounter * tickerInterval % 1000 < tickerInterval;

    view.tick();
    controller.tick(containerSize, shouldGenerate);
    renderCounter++;
});
