import { Camera, gl, Shader } from "..";
import { Matrix4x4, Vector3 } from "../../math";
const vertexSource = `#version 300 es

    in vec4 a_position;
    in vec3 a_normal;

    uniform mat4 u_worldViewProjection;
    uniform mat4 u_worldInverseTranspose;

    out vec3 v_normal;

    void main() {
        gl_Position = u_worldViewProjection * a_position;
        v_normal = mat3(u_worldInverseTranspose) * a_normal;
    }
`;

const fragmentSource = `#version 300 es

    precision highp float;

    in vec3 v_normal;

    uniform vec3 u_reverseLightDirection;
    uniform vec4 u_color;

    out vec4 outColor;

    void main() {
        vec3 normal = normalize(v_normal);

        float light = dot(normal, u_reverseLightDirection);

        outColor = u_color;

        outColor.rgb *= light;
    }
`;

export class BasicShader extends Shader {
	private _vao: WebGLVertexArrayObject;

	public constructor() {
		super("basic", vertexSource, fragmentSource);

		let positionLocation = gl.getAttribLocation(this._program, "a_position");
		let normalLocation = gl.getAttribLocation(this._program, "a_normal");

		let positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		let positions = [0, 0, 0, 0.5, 0.7, 0];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		this._vao = gl.createVertexArray() as WebGLVertexArrayObject;
		gl.bindVertexArray(this._vao);
		gl.enableVertexAttribArray(positionLocation);
		this.setGeometry();

		let size = 3;
		let type = gl.FLOAT;
		let normalize = false;
		let stride = 0;
		let offset = 0;
		gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

		let buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(normalLocation);
		gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
		this.setNormals();
	}

	public render(camera: Camera): void {
		gl.useProgram(this._program);

		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		gl.bindVertexArray(this._vao);

		let worldViewProjectionLocation = gl.getUniformLocation(this._program, "u_worldViewProjection");
		let worldInverseTransposeLocation = gl.getUniformLocation(
			this._program,
			"u_worldInverseTranspose"
		);

		let colorLocation = gl.getUniformLocation(this._program, "u_color");
		let reverseLightDirectionLocation = gl.getUniformLocation(
			this._program,
			"u_reverseLightDirection"
		);

		let projectionMatrix = camera.projectionMatrix;

		let cameraMatrix = camera.transformMatrix;

		let viewMatrix = Matrix4x4.inverse(cameraMatrix);

		let worldMatrix = Matrix4x4.rotationY(0);
		// worldMatrix.rotate(180, -20, 0);
		// worldMatrix.translate(40, -40, 0);
		let worldInverseMatrix = Matrix4x4.inverse(worldMatrix);
		let worldInverseTransposeMatrix = Matrix4x4.transpose(worldInverseMatrix);

		let viewProjectionMatrix = Matrix4x4.multiply(projectionMatrix, viewMatrix);
		let worldViewProjectionMatrix = Matrix4x4.multiply(viewProjectionMatrix, worldMatrix);

		// viewProjectionMatrix.translate(-130, 0, -360);
		// viewProjectionMatrix.rotate(180, 0, 0);

		gl.uniformMatrix4fv(
			worldViewProjectionLocation,
			false,
			worldViewProjectionMatrix.toFloat32Array()
		);
		gl.uniformMatrix4fv(
			worldInverseTransposeLocation,
			false,
			worldInverseTransposeMatrix.toFloat32Array()
		);

		gl.uniform4fv(colorLocation, [0.5, 0.5, 0.9, 1]);

		let lightLocation = new Vector3(-0.5, -0.7, -16).normalize();
		gl.uniform3fv(reverseLightDirectionLocation, lightLocation.toFloat32Array());

		// Draw the geometry
		let primitiveType = gl.TRIANGLES;
		let offset = 0;
		let count = 16 * 6;
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

	private setNormals() {
		var normals = new Float32Array([
			// left column front
			0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

			// top rung front
			0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

			// middle rung front
			0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,

			// left column back
			0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

			// top rung back
			0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

			// middle rung back
			0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,

			// top
			0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

			// top rung right
			1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

			// under top rung
			0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

			// between top rung and middle
			1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

			// top of middle rung
			0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,

			// right of middle rung
			1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

			// bottom of middle rung.
			0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

			// right of bottom
			1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,

			// bottom
			0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,

			// left side
			-1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
		]);
		gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
	}
}
