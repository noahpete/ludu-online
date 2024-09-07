import { Matrix4x4 } from "../../math";
import { Scene } from "../../scene";
import { Camera } from "../camera";
import { Model } from "../model";
import { gl } from "../renderer";
import { GizmoShader } from "../shaders/gizmo-shader";

const vertices = new Float32Array([
	// X axis (red)
	0, 0, 0, 1, 0, 0,
	// Y axis (green)
	0, 0, 0, 0, 1, 0,
	// Z axis (blue)
	0, 0, 0, 0, 0, 1,
]);

const colors = new Float32Array([
	// X axis (red)
	1, 0, 0, 1, 0, 0,
	// Y axis (green)
	0, 1, 0, 0, 1, 0,
	// Z axis (blue)
	0, 0, 1, 0, 0, 1,
]);

export class Gizmo extends Model {
	private _vao: WebGLVertexArrayObject;
	private _positions: WebGLBuffer;
	private _colors: WebGLBuffer;

	public constructor() {
		super();

		this._shader = new GizmoShader();

		this._vao = gl.createVertexArray() as WebGLVertexArrayObject;
		gl.bindVertexArray(this._vao);

		this._positions = gl.createBuffer() as WebGLBuffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, this._positions);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		this._colors = gl.createBuffer() as WebGLBuffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, this._colors);
		gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this._positions);
		const positionLocation = gl.getAttribLocation(this._shader.program, "a_position");
		gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(positionLocation);

		gl.bindBuffer(gl.ARRAY_BUFFER, this._colors);
		const colorLocation = gl.getAttribLocation(this._shader.program, "a_color");
		gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(colorLocation);
	}

	public render(camera: Camera, scene: Scene): void {
		if (!this._shader) return;

		this._shader.use();
		gl.bindVertexArray(this._vao);

		let projectionMatrix = camera.projectionMatrix;
		let viewMatrix = Matrix4x4.inverse(camera.transformMatrix);
		let worldMatrix = this.transform.matrix;

		this._shader.setVec3("u_viewPosition", camera.position);
		this._shader.setMat4("u_model", worldMatrix);
		this._shader.setMat4("u_projection", projectionMatrix);
		this._shader.setMat4("u_view", viewMatrix);

		gl.drawArrays(gl.LINES, 0, 6);
	}
}
