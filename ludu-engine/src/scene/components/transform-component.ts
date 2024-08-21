import { Transform, Vector3 } from "../../math";
import { Component } from "../component";

export class TransformComponent extends Component {
	private _transform: Transform;

	public constructor() {
		super("transform");

		this._transform = new Transform();
	}

	public get position(): Vector3 {
		return this._transform.position;
	}

	public get rotation(): Vector3 {
		return this._transform.rotation;
	}

	public get scale(): Vector3 {
		return this._transform.scale;
	}

	public start(): void {}

	public update(): void {}

	public render(): void {}
}
