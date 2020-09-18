export interface ToolInterface {
    start(event: MouseEvent): void;
    end(): void;
    draw(event: MouseEvent): void;
    shortcut(event: KeyboardEvent, isMouseUp: boolean): void;
}
