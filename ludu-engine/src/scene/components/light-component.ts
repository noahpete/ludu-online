import { Camera } from "../../renderer";
import { Component } from "../component";
import { Entity } from "../entity";
import { Scene } from "../scene";

export class LightComponent extends Component {
	public constructor(parent: Entity) {
		super("light", parent);
	}

	public start(): void {}

	public update(): void {}

	public render(camera: Camera, scene: Scene): void {}
}
