import { Matrix4x4, Transform, Vector3 } from "../math";

export class PerspectiveCamera {
	private _projectionMatrix: Matrix4x4;
	private _clearColor: Vector3;

	// TODO: temp?
	private _transform: Transform;
	private _viewMatrix: Matrix4x4;

	public constructor(
		fov: number,
		ratio: number,
		near: number,
		far: number,
		position?: Vector3,
		clearColor?: Vector3
	) {
		this._projectionMatrix = Matrix4x4.perspective(fov, ratio, near, far);
		this._clearColor = clearColor ? clearColor : Vector3.zero;
		this._transform = new Transform();
		this._viewMatrix = new Matrix4x4();

		if (position) {
			this._transform.position = position;
		}
	}
}
