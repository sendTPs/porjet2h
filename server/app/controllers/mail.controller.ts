import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { /* inject, */ injectable } from 'inversify';


@injectable()
export class MailController {
    router: Router;
    apiKey: string;

    constructor(
    ) {
        this.configureRouter();
        this.apiKey= 'c28b0070-beb7-4ad7-8dcd-e6ca583b46dd';
    }

    private configureRouter(): void {
        this.router = Router();
        

        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            console.log('MailController: ' + req.body.emailAddress);
           

            res.sendStatus(Httpstatus.OK).send();
            

           

        });
    }

}
