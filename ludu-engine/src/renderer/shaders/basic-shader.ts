import { gl, Shader } from "..";
import { Matrix4x4 } from "../../math/matrix4x4";
import { Vector3 } from "../../math/vector3";

const vertexSource = `#version 300 es

    in vec4 a_position;
    in vec4 a_color;

    uniform mat4 u_matrix;

    out vec4 v_color;

    void main() {
        gl_Position = u_matrix * a_position;
        v_color = a_color;
    }
`;

const fragmentSource = `#version 300 es

    precision highp float;

    in vec4 v_color;

    out vec4 outColor;

    void main() {
        outColor = v_color;
    }
`;

export class BasicShader extends Shader {
	private _vao: WebGLVertexArrayObject;

	public constructor() {
		super("basic", vertexSource, fragmentSource);

		let positionAttributeLocation = gl.getAttribLocation(this._program, "a_position");
		let colorAttributeLocation = gl.getAttribLocation(this._program, "a_color");

		let matrixLocation = gl.getUniformLocation(this._program, "u_matrix");

		let positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		let positions = [0, 0, 0, 0.5, 0.7, 0];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		this._vao = gl.createVertexArray() as WebGLVertexArrayObject;
		gl.bindVertexArray(this._vao);
		gl.enableVertexAttribArray(positionAttributeLocation);
		this.setGeometry();

		let size = 3;
		let type = gl.FLOAT;
		let normalize = false;
		let stride = 0;
		let offset = 0;
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

		// turn on color
		let colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		this.setColors();
		gl.enableVertexAttribArray(colorAttributeLocation);

		// get data out of colorBuffer
		gl.vertexAttribPointer(colorAttributeLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

		let translation = [0, 0];
		let width = 100;
		let color = [Math.random(), Math.random(), Math.random(), 1];
		let rotation = [0, 1];
		let scale = [1, 1];

		// Should be in render function
		gl.useProgram(this._program);
		gl.bindVertexArray(this._vao);
		let matrix = Matrix4x4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -400, 400);
		let rotMat = Matrix4x4.rotationXYZ(0.6, 0.6, 0);
		let transMat = Matrix4x4.translation(new Vector3(100, 100, 0));
		let res = Matrix4x4.multiply(Matrix4x4.multiply(matrix, rotMat), transMat);
		gl.uniformMatrix4fv(matrixLocation, false, res.toFloat32Array());
	}

	public render(): void {
		gl.useProgram(this._program);

		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		gl.bindVertexArray(this._vao);

		// Clear the canvas
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Ensure matrices are calculated for every frame if they change
		let matrixLocation = gl.getUniformLocation(this._program, "u_matrix");
		let matrix = Matrix4x4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -400, 400);
		let rotMat = Matrix4x4.rotationXYZ(0.6, 0.6, 0);
		let transMat = Matrix4x4.translation(new Vector3(100, 100, 0));
		let res = Matrix4x4.multiply(Matrix4x4.multiply(matrix, rotMat), transMat);
		gl.uniformMatrix4fv(matrixLocation, false, res.toFloat32Array());

		// Draw the geometry
		let primitiveType = gl.TRIANGLES;
		let offset = 0;
		let count = 16 * 6; // Adjust this based on the actual number of vertices
		gl.drawArrays(primitiveType, offset, count);
	}

	private setGeometry() {
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				// left column front
				0, 0, 0, 0, 150, 0, 30, 0, 0, 0, 150, 0, 30, 150, 0, 30, 0, 0,

				// top rung front
				30, 0, 0, 30, 30, 0, 100, 0, 0, 30, 30, 0, 100, 30, 0, 100, 0, 0,

				// middle rung front
				30, 60, 0, 30, 90, 0, 67, 60, 0, 30, 90, 0, 67, 90, 0, 67, 60, 0,

				// left column back
				0, 0, 30, 30, 0, 30, 0, 150, 30, 0, 150, 30, 30, 0, 30, 30, 150, 30,

				// top rung back
				30, 0, 30, 100, 0, 30, 30, 30, 30, 30, 30, 30, 100, 0, 30, 100, 30, 30,

				// middle rung back
				30, 60, 30, 67, 60, 30, 30, 90, 30, 30, 90, 30, 67, 60, 30, 67, 90, 30,

				// top
				0, 0, 0, 100, 0, 0, 100, 0, 30, 0, 0, 0, 100, 0, 30, 0, 0, 30,

				// top rung right
				100, 0, 0, 100, 30, 0, 100, 30, 30, 100, 0, 0, 100, 30, 30, 100, 0, 30,

				// under top rung
				30, 30, 0, 30, 30, 30, 100, 30, 30, 30, 30, 0, 100, 30, 30, 100, 30, 0,

				// between top rung and middle
				30, 30, 0, 30, 60, 30, 30, 30, 30, 30, 30, 0, 30, 60, 0, 30, 60, 30,

				// top of middle rung
				30, 60, 0, 67, 60, 30, 30, 60, 30, 30, 60, 0, 67, 60, 0, 67, 60, 30,

				// right of middle rung
				67, 60, 0, 67, 90, 30, 67, 60, 30, 67, 60, 0, 67, 90, 0, 67, 90, 30,

				// bottom of middle rung.
				30, 90, 0, 30, 90, 30, 67, 90, 30, 30, 90, 0, 67, 90, 30, 67, 90, 0,

				// right of bottom
				30, 90, 0, 30, 150, 30, 30, 90, 30, 30, 90, 0, 30, 150, 0, 30, 150, 30,

				// bottom
				0, 150, 0, 0, 150, 30, 30, 150, 30, 0, 150, 0, 30, 150, 30, 30, 150, 0,

				// left side
				0, 0, 0, 0, 0, 30, 0, 150, 30, 0, 0, 0, 0, 150, 30, 0, 150, 0,
			]),
			gl.STATIC_DRAW
		);
	}

	private setColors() {
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Uint8Array([
				// left column front
				200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,

				// top rung front
				200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,

				// middle rung front
				200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120, 200, 70, 120,

				// left column back
				80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

				// top rung back
				80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

				// middle rung back
				80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200, 80, 70, 200,

				// top
				70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210, 70, 200, 210,

				// top rung right
				200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70, 200, 200, 70,

				// under top rung
				210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70,

				// between top rung and middle
				210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70, 210, 160, 70,

				// top of middle rung
				70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210, 70, 180, 210,

				// right of middle rung
				100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210, 100, 70, 210,

				// bottom of middle rung.
				76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100, 76, 210, 100,

				// right of bottom
				140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80, 140, 210, 80,

				// bottom
				90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110, 90, 130, 110,

				// left side
				160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220, 160, 160, 220,
			]),
			gl.STATIC_DRAW
		);
	}
}
