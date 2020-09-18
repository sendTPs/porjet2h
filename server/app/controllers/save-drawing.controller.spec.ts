import { expect } from 'chai';
import { Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { DatabaseService } from '../services/database.service';
import { SaveDrawingController } from './save-drawing.controller';

describe('DrawingRoutes :', () => {
    const database: DatabaseService = new DatabaseService();
    const drawingController: SaveDrawingController = new SaveDrawingController(database);
    const router: Router = Router();

    it('should add drawing to the database', () => {
        // tslint:disable: no-any
        (drawingController as any).configureRouter();
        router.post('/', async (req, res) => {
            expect(res.status).equal(Httpstatus.CREATED);
        });
    });

    it('should send an error if the user does not have an email', (done) => {
        const fakeReq = {
            body: new Error('service error')
        } as unknown as Request;
        const fakeRes = {};

        return expect((drawingController as any).configureRouter(fakeReq, fakeRes)).to.be.rejectedWith(Error, 'service error');

        // router.post('/', async (fakeReq, res) => {
        //     expect(database.saveDrawing(fakeReq.body as any)).to.be.rejectedWith(Error, 'email needed');
        // });

    });

});
