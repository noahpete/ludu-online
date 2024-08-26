import { Matrix4x4, Vector3 } from "../../math";
import { Camera } from "../camera";
import { Mesh } from "../mesh";
import { Model } from "../model";
import { Shader } from "../shader";
import { BasicMaterialShader } from "../shaders/basic-material-shader";

const positions = [
	-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5,
	-0.5,

	-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5,

	-0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5,
	0.5,

	0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,

	-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5,
	-0.5,

	-0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
];

const normals = [
	0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

	0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

	-1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,

	1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

	0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

	0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
];

export class Cube extends Model {
	public constructor() {
		super();
		this._mesh = new Mesh(positions, normals);
		this._shader = new BasicMaterialShader();
	}

	public render(camera: Camera): void {
		if (!this._shader || !this._mesh) return;

		this._shader.use();

		this._shader.setVec3("light.position", new Vector3(0, 1, -2));
		this._shader.setVec3("viewPos", camera.position);

		// Light properties
		let lightColor = new Vector3(1, 1, 1);
		let diffuseColor = lightColor.multiply(new Vector3(0.5, 0.5, 0.5));
		let ambientColor = diffuseColor.multiply(new Vector3(0.5, 0.5, 0.5));
		this._shader.setVec3("light.ambient", ambientColor);
		this._shader.setVec3("light.diffuse", diffuseColor);
		this._shader.setVec3("light.specular", new Vector3(1, 1, 1));

		// Material properties
		this._shader.setVec3("material.ambient", new Vector3(1, 0.5, 0.3));
		this._shader.setVec3("material.diffuse", new Vector3(1, 0.5, 0.3));
		this._shader.setVec3("material.specular", new Vector3(0.5, 0.5, 0.5));
		this._shader.setFloat("material.shininess", 32);

		// View/projection transformations
		this._shader.setMat4("projection", camera.projectionMatrix);
		this._shader.setMat4("view", camera.transformMatrix);

		this._shader.setMat4("model", this.transform.matrix);

		this._mesh.render(this._shader);
	}
}
