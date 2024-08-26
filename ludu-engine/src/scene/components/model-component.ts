import { Camera } from "../../renderer";
import { Model } from "../../renderer/model";
import { Cube } from "../../renderer/models/cube";
import { Component } from "../component";
import { Entity } from "../entity";
import { Scene } from "../scene";

export class ModelComponent extends Component {
	private _model: Model;

	public constructor(parent: Entity, data?: any) {
		super("model", parent);

		switch (data?.type) {
			case "cube":
				this._model = new Cube();
				break;

			default:
				this._model = new Cube();
				break;
		}

		this._model.transform = parent.worldTransform;
	}

	public start(): void {}

	public update(): void {}

	public render(camera: Camera, scene: Scene): void {
		this._model.render(camera, scene);
	}
}
