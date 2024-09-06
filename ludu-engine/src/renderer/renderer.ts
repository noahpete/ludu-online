import { Camera } from ".";
import { Entity, Scene } from "../scene";
import { PerspectiveCamera } from "./perspective-camera";

export let gl: WebGL2RenderingContext;

export class Renderer {
	private static _canvas: HTMLCanvasElement;

	// temp?
	private static _camera: Camera;

	public static initialize(canvasId: string): void {
		Renderer._canvas = document.getElementById(canvasId) as HTMLCanvasElement;

		// Renderer._canvas.addEventListener("click", () => {
		// 	Renderer._canvas.requestPointerLock();
		// });

		gl = Renderer._canvas.getContext("webgl2") as WebGL2RenderingContext;

		if (!gl) {
			throw new Error("Unable to load WebGL2!");
		}

		gl.enable(gl.DEPTH_TEST);
		// gl.enable(gl.CULL_FACE);

		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		Renderer.resize(Renderer._canvas.width, Renderer._canvas.height);
	}

	public static set camera(camera: Camera) {
		Renderer._camera = camera;
	}

	public static render(scene: Scene): void {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		if (!this._camera) return;

		scene.root.render(this._camera, scene);
	}

	public static resize(width?: number, height?: number): void {
		if (!Renderer._canvas) {
			console.warn("Canvas is not initialized.");
			return;
		}

		if (width && height) {
			Renderer._canvas.style.width = width + "px";
			Renderer._canvas.style.height = height + "px";
			Renderer._canvas.width = width;
			Renderer._canvas.height = height;
			gl.viewport(0, 0, width, height);
		} else {
			Renderer._canvas.style.width = "100%";
			Renderer._canvas.style.height = "100%";
			gl.viewport(0, 0, Renderer._canvas.width, Renderer._canvas.height);
		}

		if (Renderer._camera instanceof PerspectiveCamera) {
			let camera = Renderer._camera as PerspectiveCamera;
			camera.updateMatrix(
				camera.fov,
				Renderer._canvas.width / Renderer._canvas.height,
				camera.near,
				camera.far
			);
		}
	}
}
