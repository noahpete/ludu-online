import { Camera, Renderer } from "../../renderer";
import { PerspectiveCamera } from "../../renderer/perspective-camera";
import { Component } from "../component";
import { Entity } from "../entity";
import { Scene } from "../scene";

export class CameraComponent extends Component {
	private _camera: Camera;

	public constructor(parent: Entity, data?: any) {
		super("camera", parent);

		let transformMatrix = this._parent.worldTransform.matrix;
		this._camera = new PerspectiveCamera(45, 1, 0.1, 100, transformMatrix);

		// temp
		Renderer.camera = this._camera;
	}

	public start() {}

	public update() {
		this._camera.transformMatrix = this._parent.worldTransform.matrix;
	}

	public render(camera: Camera, scene: Scene) {}
}
