import { Vector3 } from "../../math";
import { Camera, Renderer } from "../../renderer";
import { OrthographicCamera } from "../../renderer/orthographic-camera";
import { PerspectiveCamera } from "../../renderer/perspective-camera";
import { Component } from "../component";
import { Entity } from "../entity";
import { Scene } from "../scene";

export class CameraComponent extends Component {
	private _camera: Camera;
	private _data: any;

	public constructor(parent: Entity, data?: any) {
		super("camera", parent);

		this._data = data;

		const type = data?.type ? data.type : "perspective";

		if (type === "perspective") {
			const fov = this._data?.fov ? this._data.fov : 45;
			const aspect = this._data?.aspect ? this._data.aspect : 1.67;
			const near = this._data?.near ? this._data.near : 0.1;
			const far = this._data?.far ? this._data.far : 10;

			this._camera = new PerspectiveCamera(
				fov,
				aspect,
				near,
				far,
				this._parent.worldTransform.matrix
			);
		} else {
			const left = this._data?.left ? this._data.left : -1;
			const right = this._data?.right ? this._data.right : 1;
			const bottom = this._data?.bottom ? this._data.bottom : -1;
			const top = this._data?.top ? this._data.top : 1;
			const near = this._data?.near ? this._data.near : -10;
			const far = this._data?.far ? this._data.far : 10;

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

	public switchToPerspective(): void {
		const fov = this._data?.fov ? this._data.fov : 45;
		const aspect = this._data?.aspect ? this._data.aspect : 1.67;
		const near = this._data?.near ? this._data.near : 0.1;
		const far = this._data?.far ? this._data.far : 10;

		this._camera = new PerspectiveCamera(
			fov,
			aspect,
			near,
			far,
			this._parent.worldTransform.matrix
		);

		Renderer.camera = this._camera;
		Renderer.resize();
	}

	public switchToOrthographic(): void {
		const left = this._data?.left ? this._data.left : -1;
		const right = this._data?.right ? this._data.right : 1;
		const bottom = this._data?.bottom ? this._data.bottom : -1;
		const top = this._data?.top ? this._data.top : 1;
		const near = this._data?.near ? this._data.near : -10;
		const far = this._data?.far ? this._data.far : 10;

		this._camera = new OrthographicCamera(left, right, bottom, top, near, far);

		Renderer.camera = this._camera;
		Renderer.resize();
	}
}
