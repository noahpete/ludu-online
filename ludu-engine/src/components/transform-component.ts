import { Entity } from "../core";
import { Transform } from "../math";
import { Vector3 } from "../math/vector3";
import { Component } from "./component";

export class TransformComponent extends Component {
	private _transform: Transform;

	public constructor(
		parent: Entity,
		data?: { position?: Vector3; rotation?: Vector3; scale?: Vector3 }
	) {
		super(parent, "transform");
		this._transform = new Transform(data);
	}

	public get position(): Vector3 {
		return this._transform.position;
	}

	public set position(value: Vector3) {
		this._transform.position = value;
	}

	public get rotation(): Vector3 {
		return this._transform.rotation;
	}

	public get scale(): Vector3 {
		return this._transform.scale;
	}
}
