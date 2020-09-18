
import { injectable } from 'inversify';
import { Mockgoose } from 'mockgoose';
import {
    Collection, FilterQuery, MongoClient,
    MongoClientOptions
} from 'mongodb';
import 'reflect-metadata';
import { Drawing } from '../interfaces/drawing.interface';
import { Tag } from '../interfaces/tag.interface';

// CHANGE the URL for your database information
const DATABASE_URL = 'mongodb+srv://Admin:admin@cora-maltese-3chu6.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'polyDessinDB';
const DATABASE_DRAWINGS_COLLECTION = 'drawings';

@injectable()
export class DatabaseService {

    client: MongoClient;
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    drawingsCollection: Collection<Drawing>;
    tagsCollection: Collection<Tag>;
    mockgoose: Mockgoose;

    constructor() {
        this.mockgoose = new Mockgoose(MongoClient);
        this.mockgoose.prepareStorage()
            .then(() => {
                MongoClient.connect(DATABASE_URL, this.options)
                    .then((client: MongoClient) => {
                        this.drawingsCollection = client.db(DATABASE_NAME).collection(DATABASE_DRAWINGS_COLLECTION);
                        console.log('Data Test Base connected ');

                    });
            })
            .catch(() => {
                console.error('CONNECTION ERROR. EXITING PROCESS');

                process.exit(1);

            });

    }

    async disconnect(): Promise<void> {
        await this.client.close();
    }

    async saveDrawing(drawing: Drawing): Promise<void> {
        if (await this.validateDrawing(drawing)) {
            this.drawingsCollection.insertOne(drawing).catch((error: Error) => {
                throw error;
            });
        } else {/**/ }
    }

    async getAllDrawings(): Promise<Drawing[]> {
        return this.drawingsCollection.find({}).toArray()
            .then((drawings: Drawing[]) => {
                return drawings;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    // version Gab
    async getDrawingsByTag(inputTag: string): Promise<Drawing[]> {
        const filterQuery: FilterQuery<Tag> = { tags: inputTag };
        return this.drawingsCollection.find(filterQuery).toArray()
            .then((drawings: Drawing[]) => {
                return drawings;
            })
            .catch((error: Error) => {
                console.log('erreur');
                throw error;
            });
    }

    async getAllTags(): Promise<Tag[]> {
        return this.tagsCollection.find({}).toArray()
            // return this.drawingsCollection.find({tags})
            .then((tags: Tag[]) => {
                return tags;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async deleteDrawing(toDelete: string): Promise<void> {
        console.log('ServiceServer: ' + toDelete);
        return this.drawingsCollection.findOneAndDelete({ name: toDelete })
            .then(() => { console.log('deleted, good !'); })
            .catch((error: Error) => {
                throw new Error('Failed to delete the drawing');
            });
    }

    async getDrawingsByManyTags(inputTags: string[]): Promise<Drawing[]> {
        return this.drawingsCollection.find({ tag: { $in: inputTags } }).toArray()
            // trouve un tag qui appartient au moins au tableau inputTags
            .then((drawings: Drawing[]) => {
                return drawings;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    private async validateDrawing(drawing: Drawing): Promise<boolean> {
        const research = await this.drawingsCollection.findOne({ name: drawing.name })
            .then((result) => {
                if (result) {
                    return false;
                } else {
                    return true;
                }
            })
            .catch((error: Error) => {
                throw error;
            });
        if (research) {
            return true;
        } else {
            return false;
        }
    }
}
