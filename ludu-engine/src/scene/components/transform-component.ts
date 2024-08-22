import { Transform, Vector3 } from "../../math";
import { Component } from "../component";
import { Entity } from "../entity";

export class TransformComponent extends Component {
	private _localTransform: Transform;
	private _worldTransform: Transform;

	public constructor(parent: Entity) {
		super("transform", parent);

		this._localTransform = new Transform();
		this._worldTransform = new Transform();
	}

	public get localTransform(): Transform {
		return this._localTransform;
	}

	public get worldTransform(): Transform {
		return this._worldTransform;
	}

	public start(): void {}

	public update(): void {}

	public render(): void {}
}
