import { Vector3 } from ".";

export class Transform {
	private _position: Vector3;
	private _rotation: Vector3;
	private _scale: Vector3;

	public constructor(data?: { position?: Vector3; rotation?: Vector3; scale?: Vector3 }) {
		this._position = data?.position ? data.position : Vector3.zero;
		this._rotation = data?.rotation ? data.rotation : Vector3.zero;
		this._scale = data?.scale ? data.scale : Vector3.one;
	}

	public get position(): Vector3 {
		return this._position;
	}

	public set position(value: Vector3) {
		this._position = value;
	}

	public get rotation(): Vector3 {
		return this._rotation;
	}

	public set rotation(value: Vector3) {
		this._rotation = value;
	}

	public get scale(): Vector3 {
		return this._scale;
	}

	public set scale(value: Vector3) {
		this._scale = value;
	}
}
