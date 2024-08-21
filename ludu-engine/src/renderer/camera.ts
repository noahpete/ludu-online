import { Matrix4x4 } from "../math";

export class Camera {
	protected _projectionMatrix: Matrix4x4;

	protected constructor(projectionMatrix?: Matrix4x4) {
		this._projectionMatrix = projectionMatrix
			? projectionMatrix
			: Matrix4x4.orthographic(-1, 1, -1, 1, -1, 1);
	}

	public get projectionMatrix(): Matrix4x4 {
		return this._projectionMatrix;
	}
}
