import { Matrix4x4 } from "../math";
import { Camera } from "./camera";

export class PerspectiveCamera extends Camera {
	public fov: number;
	public aspect: number;
	public near: number;
	public far: number;

	public constructor(
		fov: number,
		aspect: number,
		near: number,
		far: number,
		transformMatrix?: Matrix4x4
	) {
		super("perspective", Matrix4x4.perspective(fov, aspect, near, far), transformMatrix);

		this.fov = fov;
		this.aspect = aspect;
		this.near = near;
		this.far = far;
	}

	public updateMatrix(fov: number, aspect: number, near: number, far: number): void {
		this.projectionMatrix = Matrix4x4.perspective(fov, aspect, near, far);
	}
}
