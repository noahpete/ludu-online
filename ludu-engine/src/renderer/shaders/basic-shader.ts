import { gl, Shader } from "..";

const vertexSource = `#version 300 es
 
in vec4 a_position;
 
void main() {
  gl_Position = a_position;
}
`;

const fragmentSource = `#version 300 es
 
precision highp float;

out vec4 outColor;
 
void main() {
  outColor = vec4(1, 0, 0.5, 1);
}
`;

export class BasicShader extends Shader {
	public constructor() {
		super("basic", vertexSource, fragmentSource);

		let positionAttributeLocation = gl.getAttribLocation(this._program, "a_position");

		let positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		let positions = [0, 0, 0, 0.5, 0.7, 0];
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

		let vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		gl.enableVertexAttribArray(positionAttributeLocation);

		let size = 2;
		let type = gl.FLOAT;
		let normalize = false;
		let stride = 0;
		let offset = 0;
		gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

		gl.useProgram(this._program);
		gl.bindVertexArray(vao);
	}

	public render() {
		let primitiveType = gl.TRIANGLES;
		let offset = 0;
		let count = 3;
		gl.drawArrays(primitiveType, offset, count);
	}
}
