import { TestBed } from '@angular/core/testing';
import { CommandService } from '../command/command.service';
import { CommandManagerService } from './command-manager.service';

class FakeCommand extends CommandService {
  execute(): void { return; }
  remove(): void { return; }
}

describe('CommandManagerService', () => {
  let service: CommandManagerService;
  let fakeCommand: FakeCommand;

  beforeEach(() => {
    const spyCommand = jasmine.createSpyObj('CommandService', ['remove']);
    fakeCommand = new FakeCommand();

    TestBed.configureTestingModule({
      providers: [
        CommandManagerService,
        { provide: CommandService, useValue: spyCommand }
      ]
    });
    service = TestBed.get(CommandManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#undo should work properly', () => {
    service.commandDone.push(fakeCommand);
    spyOn(service.commandUndone, 'push').and.callThrough();
    spyOn(service.commandDone, 'pop').and.callThrough();

    service.undo();
    expect(service.commandDone.pop).toHaveBeenCalled();
    expect(service.commandUndone.push).toHaveBeenCalled();
  });

  it('#undo shouldnt work if command undefined', () => {
    spyOn(service.commandUndone, 'push').and.callThrough();
    spyOn(service.commandDone, 'pop').and.callThrough();

    service.undo();
    expect(service.commandDone.pop).toHaveBeenCalled();
    expect(service.commandUndone.push).not.toHaveBeenCalled();
  });

  it('#undo shouldnt work if command undefined', () => {
    spyOn(service.commandUndone, 'push').and.callThrough();
    spyOn(service.commandDone, 'pop').and.callThrough();

    service.undo();
    expect(service.commandDone.pop).toHaveBeenCalled();
    expect(service.commandUndone.push).not.toHaveBeenCalled();
  });

  it('#redo should work properly', () => {
    service.commandUndone.push(fakeCommand);
    spyOn(service.commandDone, 'push').and.callThrough();
    spyOn(service.commandUndone, 'pop').and.callThrough();

    service.redo();
    expect(service.commandUndone.pop).toHaveBeenCalled();
    expect(service.commandDone.push).toHaveBeenCalled();
  });

  it('#redo shouldnt work if command undefined', () => {
    spyOn(service.commandDone, 'push').and.callThrough();
    spyOn(service.commandUndone, 'pop').and.callThrough();

    service.redo();
    expect(service.commandUndone.pop).toHaveBeenCalled();
    expect(service.commandDone.push).not.toHaveBeenCalled();
  });

  it('#add should work properly', () => {
    spyOn(service.commandDone, 'push').and.callThrough();

    service.add(fakeCommand);
    expect(service.commandUndone).toEqual(new Array<CommandService>());
    expect(service.commandDone.push).toHaveBeenCalled();
  });

});
