import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Drawing } from '../interfaces/drawing.interface';
// import { Tag } from '../interfaces/tag.interface';
import { DatabaseService } from '../services/database.service';
import Types from '../types';

@injectable()
export class GalleryController {
    router: Router;

    constructor(
        @inject(Types.DatabaseService) private databaseService: DatabaseService,
    ) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.delete('/:name', async (req: Request, res: Response, next: NextFunction) => {
            console.log('controller: ' + req.query.name);

            this.databaseService.deleteDrawing(req.query.name)
                .then(() => {
                    res.sendStatus(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    return res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getAllDrawings()
                .then((drawings: Drawing[]) => {
                    res.json(drawings);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/allTags', async (req: Request, res: Response, next: NextFunction) => {
            res.json(this.databaseService.getAllTags());
            // .then((tags: Tag[]) => {
            //     res.json(tags);
            // })
            // .catch((error: Error) => {
            //     res.status(Httpstatus.NOT_FOUND).send(error.message);
            // });
            // next();
        });

        this.router.get('/:tags', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getDrawingsByTag(req.query.tags)
                .then((drawings: Drawing[]) => {
                    res.json(drawings);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

    }
}
