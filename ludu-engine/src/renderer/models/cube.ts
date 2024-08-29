import { Matrix4x4, Vector3, Vector4 } from "../../math";
import { Entity, Scene } from "../../scene";
import { LightComponent } from "../../scene/components/light-component";
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

	public render(camera: Camera, scene: Scene): void {
		if (!this._shader || !this._mesh) return;

		this._shader.use();

		let projectionMatrix = camera.projectionMatrix;
		let viewMatrix = Matrix4x4.inverse(camera.transformMatrix);
		let worldMatrix = this.transform.matrix;

		this._shader.setVec3("u_viewPosition", camera.position);
		this._shader.setMat4("u_model", worldMatrix);
		this._shader.setMat4("u_projection", projectionMatrix);
		this._shader.setMat4("u_view", viewMatrix);

		let lightEntities = scene.root.getChildrenWithComponentType("light");

		this._shader.setInt("u_pointLightsCount", lightEntities.length);

		for (let i = 0; i < lightEntities.length; i++) {
			this._shader.setVec3(`u_pointLights[${i}].position`, lightEntities[i].worldPosition);

			let comp = lightEntities[i].getComponentByType("light") as LightComponent;
			let light = comp.light;

			if (!light) continue;

			let lightColor = light.diffuse;
			let diffuseColor = lightColor.multiply(new Vector3(0.6, 0.6, 0.6));

			this._shader.setVec3(`u_pointLights[${i}].ambient`, diffuseColor);
			this._shader.setVec3(`u_pointLights[${i}].diffuse`, diffuseColor);
			this._shader.setVec3(`u_pointLights[${i}].specular`, light.specular);

			this._shader.setFloat(`u_pointLights[${i}].constant`, light.constant);
			this._shader.setFloat(`u_pointLights[${i}].linear`, light.linear);
			this._shader.setFloat(`u_pointLights[${i}].quadratic`, light.quadratic);
		}

		this._mesh.render(this._shader);
	}
}
