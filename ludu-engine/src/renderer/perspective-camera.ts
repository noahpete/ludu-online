import { Matrix4x4 } from "../math";
import { Camera } from "./camera";

export class PerspectiveCamera extends Camera {
	private _fov: number;
	private _aspect: number;
	private _near: number;
	private _far: number;

	public constructor(
		fov: number,
		aspect: number,
		near: number,
		far: number,
		transformMatrix?: Matrix4x4
	) {
		super("perspective", Matrix4x4.perspective(fov, aspect, near, far), transformMatrix);

		this._fov = fov;
		this._aspect = aspect;
		this._near = near;
		this._far = far;
	}

	public get fov(): number {
		return this._fov;
	}

	public set fov(value: number) {
		this.updateMatrix(value, this._aspect, this._near, this._far);
	}

	public get aspect(): number {
		return this._aspect;
	}

	public get near(): number {
		return this._near;
	}

	public get far(): number {
		return this._far;
	}

	public updateMatrix(fov: number, aspect: number, near: number, far: number): void {
		this.projectionMatrix = Matrix4x4.perspective(fov, aspect, near, far);
	}
}
