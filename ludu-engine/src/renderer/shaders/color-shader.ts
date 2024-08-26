import { Camera, gl, Shader } from "..";
import { Matrix4x4, Vector3 } from "../../math";

const vertexSource = `#version 300 es

    layout (location = 0) in vec3 a_pos;

	uniform mat4 model;
	uniform mat4 view;
	uniform mat4 projection;

	void main()
	{
		gl_Position = projection * view * model * vec4(a_pos, 1.0);
	}
`;

const fragmentSource = `#version 300 es

    precision highp float;

    out vec4 FragColor;
  
	uniform vec3 objectColor;
	uniform vec3 lightColor;

	void main()
	{
		FragColor = vec4(lightColor * objectColor, 1.0);
	}
`;

export class ColorShader extends Shader {
	private _cubeVAO: WebGLVertexArrayObject;

	public constructor() {
		super("basic", vertexSource, fragmentSource);

		let vertices = [
			-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5,
			-0.5, -0.5,

			-0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5,
			0.5,

			-0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5,
			0.5, 0.5,

			0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, 0.5,
			0.5,

			-0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
			-0.5, -0.5,

			-0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5,
			-0.5,
		];

		// configure cube VAO
		this._cubeVAO = gl.createVertexArray()!;
		let VBO = gl.createBuffer()!;

		gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		gl.bindVertexArray(this._cubeVAO);

		// position attribute
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
		gl.enableVertexAttribArray(0);

		// let firstTriangle = [-0.75, 0, 0, -0.25, 0, 0, -0.5, 0.4, 0];
		// let secondTriangle = [0.25, 0, 0, 0.75, 0, 0, 0.5, 0.4, 0];

		// this._firstVao = gl.createVertexArray()!;
		// let firstVbo = gl.createBuffer()!;

		// gl.bindVertexArray(this._firstVao);
		// gl.bindBuffer(gl.ARRAY_BUFFER, firstVbo);
		// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(firstTriangle), gl.STATIC_DRAW);
		// gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
		// gl.enableVertexAttribArray(0);

		// this._secondVao = gl.createVertexArray()!;
		// let secondVbo = gl.createBuffer()!;

		// gl.bindVertexArray(this._secondVao);
		// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(secondTriangle), gl.STATIC_DRAW);
		// gl.bindBuffer(gl.ARRAY_BUFFER, secondVbo);
		// gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
		// gl.enableVertexAttribArray(0);
	}

	public render(camera: Camera): void {
		gl.useProgram(this._program);

		this.setVec3("objectColor", new Vector3(1.0, 0.5, 0.31));
		this.setVec3("lightColor", new Vector3(1.0, 1.0, 1.0));

		this.setMat4("projection", camera.projectionMatrix);
		this.setMat4("view", camera.transformMatrix);

		this.setMat4("model", Matrix4x4.identity());

		gl.bindVertexArray(this._cubeVAO);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
	}
}
