import { Matrix4x4, Transform, Vector3 } from "../math";

export class Camera {
	protected _projectionMatrix: Matrix4x4;
	protected _transformMatrix: Matrix4x4;

	protected constructor(projectionMatrix?: Matrix4x4, transformMatrix?: Matrix4x4) {
		this._projectionMatrix = projectionMatrix
			? projectionMatrix
			: Matrix4x4.orthographic(-1, 1, -1, 1, -1, 1);

		this._transformMatrix = transformMatrix ? transformMatrix : Matrix4x4.identity();
	}

	public get projectionMatrix(): Matrix4x4 {
		return this._projectionMatrix;
	}

	public get transformMatrix(): Matrix4x4 {
		return this._transformMatrix;
	}

	public set projectionMatrix(value: Matrix4x4) {
		this._projectionMatrix = value;
	}

	public set transformMatrix(value: Matrix4x4) {
		this._transformMatrix = value;
	}

	public get position(): Vector3 {
		let matrix = this._transformMatrix.toFloat32Array();
		return new Vector3(matrix[12], matrix[13], matrix[14]);
	}
}
