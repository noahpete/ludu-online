import { Vector3 } from "../../math";
import { Camera, Renderer } from "../../renderer";
import { OrthographicCamera } from "../../renderer/orthographic-camera";
import { PerspectiveCamera } from "../../renderer/perspective-camera";
import { Component } from "../component";
import { Entity } from "../entity";
import { Scene } from "../scene";

export class CameraComponent extends Component {
	private _camera: Camera;

	public constructor(parent: Entity, data?: any) {
		super("camera", parent);

		const type = data?.type ? data.type : "perspective";

		if (type === "perspective") {
			const fov = data?.fov ? data.fov : 45;
			const aspect = data?.aspect ? data.aspect : 1.67;
			const near = data?.near ? data.near : 0.1;
			const far = data?.far ? data.far : 10;

			this._camera = new PerspectiveCamera(
				fov,
				aspect,
				near,
				far,
				this._parent.worldTransform.matrix
			);
		} else {
			const left = data?.left ? data.left : -1;
			const right = data?.right ? data.right : 1;
			const bottom = data?.bottom ? data.bottom : -1;
			const top = data?.top ? data.top : 1;
			const near = data?.near ? data.near : -10;
			const far = data?.far ? data.far : 10;

			this._camera = new OrthographicCamera(left, right, bottom, top, near, far);
		}
	}

	public get camera(): Camera {
		return this._camera;
	}

	public start() {}

	public update(dt: number) {
		this._camera.transformMatrix = this._parent.worldTransform.matrix;

		// Make sure camera isn't affected by parent's scaling
		this._camera.resetScale(this._parent.worldTransform.matrix);
	}

	public render(camera: Camera, scene: Scene) {}
}
