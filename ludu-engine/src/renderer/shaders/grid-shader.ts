import { gl } from "../renderer";
import { Shader } from "../shader";

const vertexSource = `#version 300 es
	in vec3 a_position;

	layout(location = 4) in float a_color;

	uniform mat4 u_pMatrix;
	uniform mat4 u_mvMatrix;
	uniform mat4 u_cameraMatrix;
	uniform vec3 u_color[4];

	out lowp vec4 color;

	void main(void) {
		color = vec4(u_color[ int(a_color) ], 1.0);
		gl_Position = u_pMatrix * u_cameraMatrix * u_mvMatrix * vec4(a_position, 1.0);
	}
`;

const fragmentSource = `#version 300 es
	precision mediump float;

	in vec4 color;

	out vec4 finalColor;
		
	void main(void) {
		finalColor = color;
	}
`;

export class GridShader extends Shader {
	// TODO: temp
	private _colors: number[] = [0.8, 0.8, 0.8, 1, 0, 0, 0, 1, 0, 0, 0, 1];

	public constructor() {
		super("basic", vertexSource, fragmentSource);

		let uColor = gl.getUniformLocation(this._program, "u_color");
		gl.uniform3fv(uColor, this._colors);

		gl.useProgram(null);
	}
}
