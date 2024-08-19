import { gl, Mesh, Model } from "..";
import { ATTR_POSITION_LOC } from "../../core/constants";

class GridAxisMesh extends Mesh {
	public constructor(includeAxes: boolean) {
		super("GridAxisMesh");

		const vertices = [];
		const size = 2;
		const divisions = 10.0;
		const step = size / divisions;
		const half = size / 2;

		let position;
		for (let i = 0; i <= divisions; i++) {
			// Vertical line
			position = -half + i * step;
			vertices.push(position, 0, half, 0);
			vertices.push(position, 0, -half, 0);

			// Horizontal line
			position = half - i * step;
			vertices.push(-half, 0, position, 0);
			vertices.push(half, 0, position, 0);
		}

		if (includeAxes) {
			// x axis
			vertices.push(-1.1, 0, 0, 1);
			vertices.push(1.1, 0, 0, 1);

			// y axis
			vertices.push(0, -1.1, 0, 2);
			vertices.push(0, 1.1, 0, 2);

			// z axis
			vertices.push(0, 0, -1.1, 3);
			vertices.push(0, 0, 1.1, 3);
		}

		let aColorLocation = 4;
		let strideLength: number;

		(this._drawMode = gl.LINES), (this._vao = gl.createVertexArray());

		this._vertexComponentLength = 4;
		this._vertexCount = vertices.length / this._vertexComponentLength;
		strideLength = Float32Array.BYTES_PER_ELEMENT * this._vertexComponentLength;

		this._verticesBuffer = gl.createBuffer();
		gl.bindVertexArray(this._vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this._verticesBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		gl.enableVertexAttribArray(ATTR_POSITION_LOC);
		gl.enableVertexAttribArray(aColorLocation);

		gl.vertexAttribPointer(ATTR_POSITION_LOC, 3, gl.FLOAT, false, strideLength, 0);

		gl.vertexAttribPointer(
			aColorLocation,
			1,
			gl.FLOAT,
			false,
			strideLength,
			Float32Array.BYTES_PER_ELEMENT * 3
		);

		gl.bindVertexArray(null);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		// gl.m_meshCache["grid"] = this;
	}
}

export class GridAxisModel extends Model {
	public constructor() {
		super();
	}
}
