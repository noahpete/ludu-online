import { Camera, Shader } from ".";
import { PerspectiveCamera } from "./perspective-camera";
import { BasicShader } from "./shaders/basic-shader";

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

		Renderer.resize(width, height);

		this._camera = new PerspectiveCamera(50, 1, 1, 2000);
	}

	public static render(shader: Shader) {
		// Clear the canvas
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		shader.render(this._camera);
	}

	public static resize(width: number, height: number): void {
		Renderer._canvas.style.width = width + "px";
		Renderer._canvas.style.height = height + "px";
		Renderer._canvas.width = width;
		Renderer._canvas.height = height;
		gl.viewport(0, 0, width, height);
	}
}
