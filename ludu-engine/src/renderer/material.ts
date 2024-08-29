import { Vector3 } from "../math";
import { Shader } from "./shader";

export class Material {
	public diffuseColor: Vector3;
	public specularColor: Vector3;
	public shininess: number;
	// private _shader: Shader;

	public constructor() {
		this.diffuseColor = new Vector3(0.5, 0.5, 0.5);
		this.specularColor = new Vector3(1.0, 1.0, 1.0);
		this.shininess = 30;
		// this._shader = new BasicShader();
	}
}
