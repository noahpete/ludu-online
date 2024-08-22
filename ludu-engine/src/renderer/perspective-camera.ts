import { Matrix4x4 } from "../math";
import { Camera } from "./camera";

export class PerspectiveCamera extends Camera {
	public constructor(
		fov: number,
		aspect: number,
		near: number,
		far: number,
		transformMatrix?: Matrix4x4
	) {
		super(Matrix4x4.perspective(fov, aspect, near, far), transformMatrix);
	}
}
