import { Renderer } from "../renderer";
import { Scene } from "../scene";
import { Input } from "./input";

export class Application {
	private _lastTime: number = 0;
	private _play: boolean = false;

	// TODO: temp?
	private static _activeScene: Scene;
	private static _currentFrame: number = 0;

	public constructor(canvasId: string) {
		Renderer.initialize(canvasId);
		Input.initialize(canvasId);

		Application._activeScene = new Scene();
	}

	public static get activeScene(): Scene {
		return Application._activeScene;
	}

	public static get currentFrame(): number {
		return Application._currentFrame;
	}

	public start(): void {
		this.loop();
	}

	public play(): void {
		Application._currentFrame = 0;

		this._play = true;
	}

	public stop(): void {
		this._play = false;
	}

	public loop(): void {
		this.input();
		this.update();
		this.render();

		requestAnimationFrame(this.loop.bind(this));
		Application._currentFrame += this._play ? 1 : 0;
	}

	public input(): void {}

	public update(): void {
		let dt = performance.now() - this._lastTime;
		this._lastTime = performance.now();

		Application._activeScene.root.update(this._play ? dt : 0);

		Input.update();
	}

	public render(): void {
		Renderer.render(Application._activeScene);
	}
}
