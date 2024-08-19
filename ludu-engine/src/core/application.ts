import { Renderer } from "../renderer/renderer.ts";

export class Application {
	private _lastTime: number = 0;

	public constructor() {
		Renderer.initialize();
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
	}

	public render(): void {
		Renderer.render();
	}
}
