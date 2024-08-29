import { Camera } from "../../renderer";
import { PointLight } from "../../renderer/point-light";
import { Component } from "../component";
import { Entity } from "../entity";
import { Scene } from "../scene";

export class LightComponent extends Component {
	private _light: PointLight;

	public constructor(parent: Entity, data?: any) {
		super("light", parent);

		if (data?.type === "point") {
			this._light = new PointLight();
			// } else if (data.type === "directional") {
			// } else if (data.type === "spot") {
		} else {
			this._light = new PointLight();
		}

		if (data?.color) {
			this._light.ambient = data.color;
			this._light.diffuse = data.color;
			this._light.specular = data.color;
		}
	}

	public get light(): PointLight {
		return this._light;
	}

	public start(): void {}

	public update(dt: number): void {}

	public render(camera: Camera, scene: Scene): void {}
}
