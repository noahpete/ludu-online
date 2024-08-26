import { Camera, gl, Shader } from "..";
import { Matrix4x4, Vector3 } from "../../math";
const vertexSource = `#version 300 es

    layout (location = 0) in vec3 a_pos;

	void main()
	{
		gl_Position = vec4(a_pos.x, a_pos.y, a_pos.z, 1.0);
	}
`;

const fragmentSource = `#version 300 es

    precision highp float;

    out vec4 FragColor;

	void main()
	{
		FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);
	}
`;

export class TwoTrianglesShader extends Shader {
	private _firstVao: WebGLVertexArrayObject;
	private _secondVao: WebGLVertexArrayObject;

	public constructor() {
		super("basic", vertexSource, fragmentSource);

		let firstTriangle = [-0.75, 0, 0, -0.25, 0, 0, -0.5, 0.4, 0];
		let secondTriangle = [0.25, 0, 0, 0.75, 0, 0, 0.5, 0.4, 0];

		this._firstVao = gl.createVertexArray()!;
		let firstVbo = gl.createBuffer()!;

		gl.bindVertexArray(this._firstVao);
		gl.bindBuffer(gl.ARRAY_BUFFER, firstVbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(firstTriangle), gl.STATIC_DRAW);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
		gl.enableVertexAttribArray(0);

		this._secondVao = gl.createVertexArray()!;
		let secondVbo = gl.createBuffer()!;

		gl.bindVertexArray(this._secondVao);
		gl.bindBuffer(gl.ARRAY_BUFFER, secondVbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(secondTriangle), gl.STATIC_DRAW);
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
		gl.enableVertexAttribArray(0);
	}

	public render(camera: Camera): void {
		gl.useProgram(this._program);

		gl.bindVertexArray(this._firstVao);
		gl.drawArrays(gl.TRIANGLES, 0, 3);

		gl.bindVertexArray(this._secondVao);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
	}
}
