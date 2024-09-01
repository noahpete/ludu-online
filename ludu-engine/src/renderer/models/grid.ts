import { Matrix4x4, Vector4 } from "../../math";
import { Scene } from "../../scene";
import { Camera } from "../camera";
import { Mesh } from "../mesh";
import { Model } from "../model";
import { gl } from "../renderer";
import { ColorShader } from "../shaders/color-shader";

export class Grid extends Model {
	public constructor(slices: number = 10) {
		super();

		let vertices: number[] = [];
		let indices: number[] = [];

		for (let j = 0; j <= slices; j++) {
			for (let i = 0; i <= slices; i++) {
				let x = i / slices;
				let y = j / slices;
				vertices.push(x);
				vertices.push(y);
				vertices.push(0);
			}
		}

		for (let j = 0; j < slices; j++) {
			for (let i = 0; i < slices; i++) {
				let row1 = j * (slices + 1);
				let row2 = (j + 1) * (slices + 1);
				indices.push(row1 + i, row1 + i + 1);
				indices.push(row1 + i + 1, row2 + i + 1);
				indices.push(row2 + i + 1, row2 + i);
				indices.push(row2 + i, row1 + i);
			}
		}

		this._mesh = new Mesh(vertices, undefined, undefined, indices);
		this._shader = new ColorShader();
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

		this._shader.setVec4("u_color", new Vector4(0.0, 0.0, 0.0, 0.5));

		this._mesh.render(this._shader, gl.LINES);
	}
}
