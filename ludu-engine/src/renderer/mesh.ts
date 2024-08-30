import { gl } from "./renderer";
import { Shader } from "./shader";

export class Mesh {
	private _VAO: WebGLVertexArrayObject;

	private _positionVBO: WebGLBuffer;
	private _positionCount: number;

	private _normalVBO: WebGLBuffer;
	private _normalCount: number;

	private _texcoordVBO: WebGLBuffer;
	private _texcoordCount: number;

	public constructor(positions: number[], normals: number[], texcoords: number[]) {
		this._VAO = gl.createVertexArray() as WebGLVertexArrayObject;
		gl.bindVertexArray(this._VAO);

		this._positionCount = positions.length;
		this._normalCount = normals.length;
		this._texcoordCount = texcoords.length;

		this._positionVBO = gl.createBuffer() as WebGLBuffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, this._positionVBO);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3 * 4, 0);
		gl.enableVertexAttribArray(0); // TODO: varies per shader layout

		this._normalVBO = gl.createBuffer() as WebGLBuffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, this._normalVBO);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 3 * 4, 0);
		gl.enableVertexAttribArray(1);

		this._texcoordVBO = gl.createBuffer() as WebGLBuffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, this._texcoordVBO);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
		gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(2);

		gl.bindVertexArray(null);
	}

	public render(shader: Shader) {
		shader.use();

		gl.bindVertexArray(this._VAO);
		gl.drawArrays(gl.TRIANGLES, 0, this._positionCount / 3);

		gl.bindVertexArray(null);
	}
}
