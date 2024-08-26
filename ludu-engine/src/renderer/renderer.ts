import { Camera } from ".";
import { Scene } from "../scene";

export let gl: WebGL2RenderingContext;

export class Renderer {
	private static _canvas: HTMLCanvasElement;

	// temp
	private static _camera: Camera;

	public static initialize(canvasId: string, width: number, height: number): void {
		Renderer._canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		gl = Renderer._canvas.getContext("webgl2") as WebGL2RenderingContext;

		if (!gl) {
			throw new Error("Unable to load WebGL2!");
		}

		gl.enable(gl.DEPTH_TEST);

		Renderer.resize(width, height);

		// this._camera = new PerspectiveCamera(50, 1, 1, 2000);
	}

	public static set camera(camera: Camera) {
		Renderer._camera = camera;
	}

	public static render(scene: Scene): void {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		if (!this._camera) return;

		// cube.render(this._camera);
		scene.root.render(this._camera, scene);
	}

	public static resize(width: number, height: number): void {
		Renderer._canvas.style.width = width + "px";
		Renderer._canvas.style.height = height + "px";
		Renderer._canvas.width = width;
		Renderer._canvas.height = height;
		gl.viewport(0, 0, width, height);
	}
}
