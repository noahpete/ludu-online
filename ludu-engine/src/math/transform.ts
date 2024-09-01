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

	public get forward(): Vector3 {
		const forward = new Vector3(0, 0, 1);
		return this.transformDirection(forward);
	}

	public get right(): Vector3 {
		const right = new Vector3(1, 0, 0);
		return this.transformDirection(right);
	}

	public get up(): Vector3 {
		const up = new Vector3(0, 1, 0);
		return this.transformDirection(up);
	}

	private transformDirection(direction: Vector3): Vector3 {
		const rotationMatrix = Matrix4x4.rotationXYZ(
			this._rotation.x,
			this._rotation.y,
			this._rotation.z
		);
		const transformedDirection = rotationMatrix.multiplyVector3(direction);
		return transformedDirection.normalize();
	}
}
