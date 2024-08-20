import { Shader } from ".";
import { BasicShader } from "./shaders/basic-shader";

export let gl: WebGL2RenderingContext;

export class Renderer {
	private static _canvas: HTMLCanvasElement;

	public static initialize(canvasId: string, width: number, height: number): void {
		Renderer._canvas = document.getElementById(canvasId) as HTMLCanvasElement;
		gl = Renderer._canvas.getContext("webgl2") as WebGL2RenderingContext;

		if (!gl) {
			throw new Error("Unable to load WebGL2!");
		}

		Renderer.resize(width, height);
	}

	public static render(shader: Shader) {
		shader.render();
	}

	public static resize(width: number, height: number): void {
		Renderer._canvas.style.width = width + "px";
		Renderer._canvas.style.height = height + "px";
		Renderer._canvas.width = width;
		Renderer._canvas.height = height;
		gl.viewport(0, 0, width, height);
	}
}
