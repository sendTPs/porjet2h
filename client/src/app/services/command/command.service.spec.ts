import { TestBed } from '@angular/core/testing';

import { CommandService } from './command.service';

describe('CommandService', () => {
    let service: CommandService;

    beforeEach(() => {
        TestBed.configureTestingModule({

        });
        service = TestBed.get(CommandService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('execute is a function and returns nothing', () => {
        service.execute();
        expect(service.execute).toEqual(jasmine.any(Function));
    });

    it('remove is a function and returns nothing', () => {
        service.remove();
        expect(service.remove).toEqual(jasmine.any(Function));
    });
});
