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

	public resetScale(transformMatrix: Matrix4x4) {
		const scaleX = Math.sqrt(
			transformMatrix.data[0] * transformMatrix.data[0] +
				transformMatrix.data[1] * transformMatrix.data[1] +
				transformMatrix.data[2] * transformMatrix.data[2]
		);
		const scaleY = Math.sqrt(
			transformMatrix.data[4] * transformMatrix.data[4] +
				transformMatrix.data[5] * transformMatrix.data[5] +
				transformMatrix.data[6] * transformMatrix.data[6]
		);
		const scaleZ = Math.sqrt(
			transformMatrix.data[8] * transformMatrix.data[8] +
				transformMatrix.data[9] * transformMatrix.data[9] +
				transformMatrix.data[10] * transformMatrix.data[10]
		);

		// Normalize the scale to 1
		const inverseScaleX = 1 / scaleX;
		const inverseScaleY = 1 / scaleY;
		const inverseScaleZ = 1 / scaleZ;

		transformMatrix.data[0] *= inverseScaleX;
		transformMatrix.data[1] *= inverseScaleX;
		transformMatrix.data[2] *= inverseScaleX;

		transformMatrix.data[4] *= inverseScaleY;
		transformMatrix.data[5] *= inverseScaleY;
		transformMatrix.data[6] *= inverseScaleY;

		transformMatrix.data[8] *= inverseScaleZ;
		transformMatrix.data[9] *= inverseScaleZ;
		transformMatrix.data[10] *= inverseScaleZ;

		this._transformMatrix = transformMatrix;
	}
}
