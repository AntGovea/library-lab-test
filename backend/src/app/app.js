import express from 'express';
import { Middlewares } from '../middlewares/index.js';
import { Routes } from '../routes/index.js';
import { Errors } from '../errors/index.js';

class App {
    constructor() {
        this.app = express();

        this.middlewares();
        this.routes();
        this.errors();
    }

    middlewares() {
        Middlewares.configure(this.app);
    }

    routes() {
        Routes.configure(this.app);
        
    }

    errors() {
        Errors.notFound(this.app);
        Errors.handler(this.app);
    }

    getApp() {
        return this.app;
    }
}

const application = new App();

export default application.getApp();