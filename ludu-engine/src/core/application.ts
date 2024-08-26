import { Renderer } from "../renderer";
import { BasicMaterialShader } from "../renderer/shaders/basic-material-shader";
import { Scene } from "../scene";

export class Application {
	private _lastTime: number = 0;

	// TODO: temp?
	private static _activeScene: Scene;
	private _shader: BasicMaterialShader;

	public constructor() {
		Renderer.initialize("app", 500, 500);

		Application._activeScene = new Scene();

		// temp
		this._shader = new BasicMaterialShader();
	}

	public static get activeScene(): Scene {
		return Application._activeScene;
	}

	public start(): void {
		this.loop();
	}

	public loop(): void {
		this.input();
		this.update();
		this.render();
		requestAnimationFrame(this.loop.bind(this));
	}

	public input(): void {}

	public update(): void {
		let dt = performance.now() - this._lastTime;
		this._lastTime = performance.now();

		Application.activeScene.root.update();
	}

	public render(): void {
		Renderer.render(this._shader);
	}
}
