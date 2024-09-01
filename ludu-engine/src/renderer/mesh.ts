import { gl } from "./renderer";
import { Shader } from "./shader";

export class Mesh {
	private _VAO: WebGLVertexArrayObject;
	private _VBOs: WebGLBuffer[] = [];
	private _attributeCounts: number[] = [];
	private _drawCount: number;
	private _isIndexed: boolean = false;

	public constructor(
		positions: number[],
		normals?: number[],
		texcoords?: number[],
		indices?: number[]
	) {
		this._VAO = gl.createVertexArray() as WebGLVertexArrayObject;
		gl.bindVertexArray(this._VAO);

		// Positions
		this.createVBO(positions, 3, 0);
		this._drawCount = positions.length / 3;

		// Normals
		if (normals && normals.length > 0) {
			this.createVBO(normals, 3, 1);
		}

		// Texture Coordinates
		if (texcoords && texcoords.length > 0) {
			this.createVBO(texcoords, 2, 2);
		}

		// Indices
		if (indices && indices.length > 0) {
			this._isIndexed = true;
			const indexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
			this._drawCount = indices.length;
		}

		gl.bindVertexArray(null);
	}

	private createVBO(data: number[], size: number, index: number) {
		const vbo = gl.createBuffer() as WebGLBuffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
		gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(index);

		this._VBOs.push(vbo);
		this._attributeCounts.push(data.length / size);
	}

	public render(shader: Shader, mode: number = gl.TRIANGLES) {
		shader.use();
		gl.bindVertexArray(this._VAO);

		if (this._isIndexed) {
			gl.drawElements(mode, this._drawCount, gl.UNSIGNED_SHORT, 0);
		} else {
			gl.drawArrays(mode, 0, this._drawCount);
		}

		gl.bindVertexArray(null);
	}
}
