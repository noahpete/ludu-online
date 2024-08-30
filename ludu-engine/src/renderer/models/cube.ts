import { Matrix4x4, Vector3 } from "../../math";
import { Entity, Scene } from "../../scene";
import { LightComponent } from "../../scene/components/light-component";
import { Camera } from "../camera";
import { Mesh } from "../mesh";
import { Model } from "../model";
import { gl } from "../renderer";
import { Shader } from "../shader";
import { BasicMaterialShader } from "../shaders/basic-material-shader";

const positions = [
	-0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
	-0.5,

	-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5,

	-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,

	-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
	0.5,

	-0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
	-0.5,

	0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
];

const normals = [
	0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,
	0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, -1.0,
	0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, -1.0,
	0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, 1.0,
	0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
];

const texcoords = [
	0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

	0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

	0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

	0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

	0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,

	0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0,
];

export class Cube extends Model {
	private texture: WebGLTexture | null = null;

	public constructor() {
		super();
		this._mesh = new Mesh(positions, normals, texcoords);
		this._shader = new BasicMaterialShader();
		this.loadTexture("resources/f.png");
	}

	private loadTexture(url: string): void {
		this.texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, this.texture);

		// Temporary pixel until the image is loaded
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			1,
			1,
			0,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			new Uint8Array([0, 0, 255, 255])
		);

		const image = new Image();
		image.src = url;
		image.addEventListener("load", () => {
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.generateMipmap(gl.TEXTURE_2D);
		});
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

		// Bind the texture
		if (this.texture) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture);
			this._shader.setInt("u_texture", 0);
		}

		// Set material properties
		this._shader.setVec3("u_material.specular", this._material.specularColor);
		this._shader.setFloat("u_material.shininess", this._material.shininess);

		let lightEntities = scene.root.getChildrenWithComponentType("light");

		this._shader.setInt("u_pointLightsCount", lightEntities.length);

		for (let i = 0; i < lightEntities.length; i++) {
			this._shader.setVec3(`u_pointLights[${i}].position`, lightEntities[i].worldPosition);

			let comp = lightEntities[i].getComponentByType("light") as LightComponent;
			let light = comp.light;

			if (!light) continue;

			this._shader.setVec3(`u_pointLights[${i}].ambient`, light.ambient);
			this._shader.setVec3(`u_pointLights[${i}].diffuse`, light.diffuse);
			this._shader.setVec3(`u_pointLights[${i}].specular`, light.specular);

			this._shader.setFloat(`u_pointLights[${i}].constant`, light.constant);
			this._shader.setFloat(`u_pointLights[${i}].linear`, light.linear);
			this._shader.setFloat(`u_pointLights[${i}].quadratic`, light.quadratic);
		}

		this._mesh.render(this._shader);
	}
}
