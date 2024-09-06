import { Matrix4x4 } from "../math";
import { Camera } from "./camera";

export class OrthographicCamera extends Camera {
	public left: number;
	public right: number;
	public bottom: number;
	public top: number;
	public near: number;
	public far: number;

	public constructor(
		left: number,
		right: number,
		bottom: number,
		top: number,
		near: number,
		far: number,
		transformMatrix?: Matrix4x4
	) {
		super(
			"orthographic",
			Matrix4x4.orthographic(left, right, bottom, top, near, far),
			transformMatrix
		);

		this.left = left;
		this.right = right;
		this.bottom = bottom;
		this.top = top;
		this.near = near;
		this.far = far;
	}

	public updateMatrix(fov: number, aspect: number, near: number, far: number): void {
		this.projectionMatrix = Matrix4x4.perspective(fov, aspect, near, far);
	}
}
