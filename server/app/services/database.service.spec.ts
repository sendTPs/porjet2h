import { expect } from 'chai';
import { testingContainer } from '../../test/test-utils';
import { Drawing } from '../interfaces/drawing.interface';
import Types from '../types';
import { DatabaseService } from './database.service';

describe('Date Service', () => {
    let databaseService: DatabaseService = new DatabaseService();

    const fakeDrawing1 = {
        name: 'drawing1',
        tags: 'tag1, tag2',
        image: 'image1',
        thumbnail: 'thumb1'
    } as unknown as Drawing;

    const fakeDrawing2 = {
        name: 'drawing2',
        tags: 'tag1, tag2, tag3',
        image: 'image2',
        thumbnail: 'thumb2'
    } as unknown as Drawing;

    beforeEach(async () => {
        const [container] = await testingContainer();
        databaseService = container.get<DatabaseService>(Types.DatabaseService);
        // clock = sinon.useFakeTimers();
    });

    it('#getAllDrawing should return all drawings', async () => {
        const result = await databaseService.disconnect();
        // expect(result).to.call(databaseService.client.close());
    });

    it('#getAllDrawing should return all drawings', async () => {
        databaseService.drawingsCollection.insertMany([fakeDrawing1, fakeDrawing2]);
        const result = await databaseService.getAllDrawings();
        expect(result.length).to.equal(2);
        expect(result[0]).to.equal(fakeDrawing1.name);
        expect(result[1]).to.equal(fakeDrawing2.name);
    });
});
