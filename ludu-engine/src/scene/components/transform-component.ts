import { Transform, Vector3 } from "../../math";
import { Component } from "../component";

export class TransformComponent extends Component {
	private _localTransform: Transform;
	private _worldTransform: Transform;

	public constructor() {
		super("transform");

		this._localTransform = new Transform();
		this._worldTransform = new Transform();
	}

	public get localTransform(): Transform {
		return this._localTransform;
	}

	public get worldTransform(): Transform {
		return this._worldTransform;
	}

	public get position(): Vector3 {
		return this._localTransform.position;
	}

	public get rotation(): Vector3 {
		return this._localTransform.rotation;
	}

	public get scale(): Vector3 {
		return this._localTransform.scale;
	}

	public start(): void {}

	public update(): void {}

	public render(): void {}
}
