import { Vector3 } from "../math";
import { Light } from "./light";

export class PointLight extends Light {
	public constant: number;
	public linear: number;
	public quadratic: number;

	public constructor(ambient?: Vector3, diffuse?: Vector3, specular?: Vector3) {
		super(ambient, diffuse, specular);

		this.constant = 1.0;
		this.linear = 0.09;
		this.quadratic = 0.032;
	}
}
