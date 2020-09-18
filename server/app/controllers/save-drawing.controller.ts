import { NextFunction, Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

import { DatabaseService } from '../services/database.service';

import Types from '../types';

@injectable()
export class SaveDrawingController {
    router: Router;

    constructor(
        @inject(Types.DatabaseService) private databaseService: DatabaseService,
    ) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            console.log('Controller: ' + req.body.name);
            res.json(this.databaseService.saveDrawing(req.body));
        });
    }

}
