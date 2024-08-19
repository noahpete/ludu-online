import { ATTR_NORMAL_LOC, ATTR_POSITION_LOC, ATTR_UV_LOC } from "../core/constants";
import { gl } from "./renderer";

export class Mesh {
	protected _drawMode: GLenum = gl.TRIANGLES;
	protected _vao: WebGLVertexArrayObject | null = null;

	protected _verticesBuffer: WebGLBuffer | null = null;
	protected _vertexComponentLength: number = 1;
	protected _vertexCount: number = 0;

	protected _normalsBuffer: WebGLBuffer | null = null;
	protected _uvsBuffer: WebGLBuffer | null = null;

	protected _indicesBuffer: WebGLBuffer | null = null;
	protected _indexCount: number = 0;

	public constructor(
		name: string,
		indices?: number[],
		vertices?: number[],
		normals?: number[],
		uvs?: number[]
	) {
		this._vao = gl.createVertexArray();

		if (!this._vao) return;

		gl.bindVertexArray(this._vao);

		this.initializeVertices(vertices);
		this.initializeNormals(normals);
		this.initializeUVs(uvs);
		this.initializeIndices(indices);

		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// (gl as any).m_MeshCache[name] = rtn;
	}

	public get vao(): WebGLVertexArrayObject | null {
		return this._vao;
	}

	public get drawMode(): GLenum {
		return this._drawMode;
	}

	// public set drawMode(value: GLenum) {
	// 	this._drawMode = value;
	// }

	public get vertexCount(): number {
		return this._vertexCount;
	}

	// public get vertexComponentLength(): number {
	// 	return this._vertexComponentLength;
	// }

	// public set vertexComponentLength(value: number) {
	// 	this._vertexComponentLength = value;
	// }

	public get indexCount(): number {
		return this._indexCount;
	}

	private initializeVertices(vertices: number[] | undefined): void {
		if (vertices !== undefined && vertices !== null) {
			this._verticesBuffer = gl.createBuffer();
			this._vertexComponentLength = 3;
			this._vertexCount = vertices.length / this._vertexComponentLength;
			gl.bindBuffer(gl.ARRAY_BUFFER, this._verticesBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(ATTR_POSITION_LOC);
			gl.vertexAttribPointer(ATTR_POSITION_LOC, 3, gl.FLOAT, false, 0, 0);
		}
	}

	private initializeNormals(normals: number[] | undefined): void {
		if (normals !== undefined && normals !== null) {
			this._normalsBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._normalsBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(ATTR_NORMAL_LOC);
			gl.vertexAttribPointer(ATTR_NORMAL_LOC, 3, gl.FLOAT, false, 0, 0);
		}
	}

	private initializeUVs(uvs: number[] | undefined): void {
		if (uvs !== undefined && uvs !== null) {
			this._uvsBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, this._uvsBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
			gl.enableVertexAttribArray(ATTR_UV_LOC);
			gl.vertexAttribPointer(ATTR_UV_LOC, 2, gl.FLOAT, false, 0, 0);
		}
	}

	private initializeIndices(indices: number[] | undefined): void {
		if (indices !== undefined && indices !== null) {
			this._indicesBuffer = gl.createBuffer();
			this._indexCount = indices.length;
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indicesBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}
	}
}
