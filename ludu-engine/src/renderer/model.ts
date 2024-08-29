import { Transform } from "../math";
import { Scene } from "../scene";
import { Camera } from "./camera";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { Shader } from "./shader";

export abstract class Model {
	protected _mesh: Mesh | null = null;
	protected _shader: Shader | null = null; // TODO: make shader part of a Material
	protected _material: Material;

	public transform: Transform;

	public constructor() {
		this.transform = new Transform();

		// temp
		this._material = new Material();
	}

	public setUniforms(): void {}

	public abstract render(camera: Camera, scene: Scene): void;
}
