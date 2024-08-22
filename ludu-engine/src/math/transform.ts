import { Matrix4x4, Vector3 } from ".";

export class Transform {
	private _position: Vector3;
	private _rotation: Vector3;
	private _scale: Vector3;

	public constructor() {
		this._position = Vector3.zero;
		this._rotation = Vector3.zero;
		this._scale = Vector3.one;
	}

	public get position(): Vector3 {
		return this._position;
	}

	public set position(value: Vector3) {
		this._position = value;
		// this.updateMatrix();
	}

	public get rotation(): Vector3 {
		return this._rotation;
	}

	public set rotation(value: Vector3) {
		this._rotation = value;
		// this.updateMatrix();
	}

	public get scale(): Vector3 {
		return this._scale;
	}

	public set scale(value: Vector3) {
		this._scale = value;
		// this.updateMatrix();
	}

	public get matrix(): Matrix4x4 {
		let translation = Matrix4x4.translation(this._position);
		let rotation = Matrix4x4.rotationXYZ(this._rotation.x, this._rotation.y, this._rotation.z);
		let scale = Matrix4x4.scale(this._scale);
		return Matrix4x4.multiply(Matrix4x4.multiply(translation, rotation), scale);
	}
}
