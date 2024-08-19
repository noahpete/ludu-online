import { Model, Shader } from ".";

export let gl: WebGL2RenderingContext;

export class Renderer {
	private static _canvas: HTMLCanvasElement;
	private static _models: Model[] = [];
	private static _shaders: Shader[] = [];

	private constructor() {}

	public static initialize(): void {
		Renderer._canvas = document.getElementById("app") as HTMLCanvasElement;
		gl = Renderer._canvas.getContext("webgl2") as WebGL2RenderingContext;

		if (!gl) {
			throw new Error("Unable to initialize WebGL2!");
		}

		Renderer.resize(500, 500);

		gl.clearColor(1.0, 1.0, 1.0, 1.0);
	}

	public static render(): void {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		for (let m of Renderer._models) {
			m.render();
		}
	}

	public static resize(width: number, height: number): void {
		Renderer._canvas.style.width = width + "px";
		Renderer._canvas.style.height = height + "px";
		Renderer._canvas.width = width;
		Renderer._canvas.height = height;
		gl.viewport(0, 0, width, height);
	}

	public static addModel(model: Model): void {
		Renderer._models.push(model);
	}

	public static addShader(shader: Shader): void {
		Renderer._shaders.push(shader);
	}
}
