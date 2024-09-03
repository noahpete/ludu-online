import { Renderer } from "../renderer";
import { Cube } from "../renderer/models/cube";
import { BasicShader } from "../renderer/shaders/basic-shader";
import { Scene } from "../scene";
import { Input } from "./input";

export class Application {
	private _lastTime: number = 0;

	// TODO: temp?
	private static _activeScene: Scene;
	private static _currentFrame: number = 0;
	private _shader: BasicShader;
	private _cube: Cube;

	public constructor(canvasId: string) {
		Renderer.initialize(canvasId);
		Input.initialize(canvasId);

		Application._activeScene = new Scene();

		// temp
		this._shader = new BasicShader();
		this._cube = new Cube();
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

	public loop(): void {
		this.input();
		this.update();
		this.render();

		requestAnimationFrame(this.loop.bind(this));
		Application._currentFrame += 1;
	}

	public input(): void {}

	public update(): void {
		let dt = performance.now() - this._lastTime;
		this._lastTime = performance.now();

		Application._activeScene.root.update(dt);

		Input.update();
	}

	public render(): void {
		Renderer.render(Application._activeScene);
	}
}
