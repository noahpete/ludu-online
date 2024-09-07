import { Camera, gl, Shader } from "..";

const vertexSource = `#version 300 es

    layout (location = 0) in vec3 a_position;
	layout (location = 1) in vec3 a_color;

    out vec3 v_color;

	uniform mat4 u_model;
	uniform mat4 u_view;
	uniform mat4 u_projection;

	void main() {
		vec3 v_fragPosition = vec3(u_model * vec4(a_position, 1.0));
		gl_Position = u_projection * u_view * vec4(v_fragPosition, 1.0);
        v_color = a_color;
	}
`;

const fragmentSource = `#version 300 es

    precision highp float;

	in vec3 v_color;

	out vec4 outColor;

	void main() {
		outColor = vec4(v_color, 1.0);
	}
`;

export class GizmoShader extends Shader {
	public constructor() {
		super("gizmo", vertexSource, fragmentSource);
	}
}
