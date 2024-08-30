import { Vector2 } from "../math";

export class Input {
	private static _keys: Map<string, boolean> = new Map<string, boolean>();
	private static _prevKeys: Map<string, boolean> = new Map<string, boolean>();

	private static _mouseDelta: Vector2 = new Vector2(0.0, 0.0);
	private static _buttons: Map<number, boolean> = new Map<number, boolean>();
	private static _prevButtons: Map<number, boolean> = new Map<number, boolean>();

	public static initialize(canvasId: string): void {
		let canvas = document.getElementById(canvasId) as HTMLCanvasElement;

		canvas.addEventListener("keydown", Input.onKeyDown);
		canvas.addEventListener("keyup", Input.onKeyUp);

		canvas.addEventListener("mousemove", Input.onMouseMove);
		canvas.addEventListener("mousedown", Input.onMouseDown);
		canvas.addEventListener("mouseup", Input.onMouseUp);
	}

	public static getKey(key: string): boolean {
		return Input._keys.has(key) && Input._keys.get(key)!;
	}

	public static getKeyDown(key: string): boolean {
		const isDown = Input._keys.get(key) || false;
		const wasDown = Input._prevKeys.get(key) || false;
		return isDown && !wasDown;
	}

	public static getKeyUp(key: string): boolean {
		const isDown = Input._keys.get(key) || false;
		const wasDown = Input._prevKeys.get(key) || false;
		return !isDown && wasDown;
	}

	public static getMouseDeltaX(): number {
		return Input._mouseDelta.x;
	}

	public static getMouseDeltaY(): number {
		return Input._mouseDelta.y;
	}

	public static getMouseButton(button: number): boolean {
		return Input._buttons.has(button) && Input._buttons.get(button)!;
	}

	public static getMouseButtonDown(button: number): boolean {
		const isDown = Input._buttons.get(button) || false;
		const wasDown = Input._prevButtons.get(button) || false;
		return isDown && !wasDown;
	}

	public static getMouseButtonUp(button: number): boolean {
		const isDown = Input._buttons.get(button) || false;
		const wasDown = Input._prevButtons.get(button) || false;
		return !isDown && wasDown;
	}

	public static update(): void {
		Input._prevKeys = new Map(Input._keys);
		Input._prevButtons = new Map(Input._buttons);
		Input._mouseDelta = Vector2.zero;
	}

	private static onKeyDown(event: KeyboardEvent): boolean {
		Input._keys.set(event.key, true);
		return true;
	}

	private static onKeyUp(event: KeyboardEvent): boolean {
		Input._keys.set(event.key, false);
		return true;
	}

	private static onMouseMove(event: MouseEvent): boolean {
		Input._mouseDelta.x = event.movementX;
		Input._mouseDelta.y = event.movementY;
		return true;
	}

	private static onMouseDown(event: MouseEvent): boolean {
		Input._buttons.set(event.button, true);
		return true;
	}

	private static onMouseUp(event: MouseEvent): boolean {
		Input._buttons.set(event.button, false);
		return true;
	}
}
