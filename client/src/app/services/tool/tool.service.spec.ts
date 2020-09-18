import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ToolInterface } from '@models/tool.interface';

import { PointStorageService } from '@services/point-storage/point-storage.service';
import { ToolService } from './tool.service';

export class FakeToolService implements ToolInterface {
  renderer: Renderer2;

  start(event: MouseEvent): void { return; }
  end(): void { return; }
  draw(event: MouseEvent): void { return; }
  shortcut(event: KeyboardEvent, isMouseUp: boolean): void { return; }
  constructor(pointStorage: PointStorageService) { return; }
}

describe('ToolService', () => {
  let service: ToolService;
  const FAKE_SHORTCUT_EVENT = { key: 'fakeKey', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
  const RANDOM_SHORTCUT_EVENT = { key: 'random', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
  const FAKE_KEY = 'fakeKey000';

  beforeEach(() => {
    service = TestBed.get(ToolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 chooseTool works when key exist in map and tool is activated', () => {
    service.tool = FAKE_KEY;
    service.toolMapString.set(FAKE_KEY, 'fakeTool');
    service.toolMap.set(FAKE_KEY, FAKE_KEY);

    service.chooseTool(FAKE_SHORTCUT_EVENT);

    expect(service.toolMap.has(FAKE_KEY)).toBeTruthy();
    expect(service.chooseTool(FAKE_SHORTCUT_EVENT)).toBeFalsy();
    expect(service.toolActivateToString).toBe('fakeTool');

  });

  it('#2 chooseTool works when key exist but tool not activated', () => {
    service.toolMapString.set(FAKE_KEY, 'fakeTool');
    service.toolMap.set(FAKE_KEY, FAKE_KEY);

    expect(service.chooseTool(FAKE_SHORTCUT_EVENT)).toBeTruthy();
    expect(service.tool).toBe(FAKE_KEY);
    expect(service.toolActivateToString).toBe('fakeTool');
  });

  it('#3 chooseTool works when key doesnt exist', () => {
    expect(service.chooseTool(RANDOM_SHORTCUT_EVENT)).toBeFalsy();
  });

  it('#4 chooseTool works when key doesnt exist', () => {
    const E1 = { key: 'fakeKey', ctrlKey: false, altKey: false, shiftKey: false } as KeyboardEvent;
    const E2 = { key: 'fakeKey', ctrlKey: true, altKey: true, shiftKey: true } as KeyboardEvent;
    expect(service.chooseTool(E1)).toBeFalsy();
    expect(service.chooseTool(E2)).toBeFalsy();
  });

  it('#5 getToolActivate get the good key in string', () => {
    service.toolActivateToString = 'fake';
    expect(service.getToolActivateToString()).toBe('fake');
  });

});
