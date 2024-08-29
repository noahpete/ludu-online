import { Vector3 } from "../math";

export abstract class Light {
	public ambient: Vector3;
	public diffuse: Vector3;
	public specular: Vector3;

	protected constructor(ambient?: Vector3, diffuse?: Vector3, specular?: Vector3) {
		this.ambient = ambient ? ambient : Vector3.zero;
		this.diffuse = diffuse ? diffuse : Vector3.one;
		this.specular = specular ? specular : Vector3.one;
	}
}
