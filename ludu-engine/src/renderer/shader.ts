import { Matrix4x4, Vector3, Vector4 } from "../math";
import { Camera } from "./camera";
import { gl } from "./renderer";

export abstract class Shader {
	private _name: string;
	private _vertexSource: string;
	private _fragmentSource: string;

	protected _program: WebGLProgram;

	public constructor(name: string, vertexSrc: string, fragmentSrc: string) {
		this._name = name;
		this._vertexSource = vertexSrc;
		this._fragmentSource = fragmentSrc;

		let vertexShader = Shader.create(vertexSrc, gl.VERTEX_SHADER);
		let fragmentShader = Shader.create(fragmentSrc, gl.FRAGMENT_SHADER);

		this._program = Shader.createProgram(vertexShader, fragmentShader);
	}

	public static create(source: string, type: GLenum): WebGLShader {
		let shader = gl.createShader(type);

		if (!shader) {
			throw new Error("Unable to create gl shader " + type);
		}

		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			// gl.deleteShader(shader);
			throw new Error(
				"Error compiling shader: " + source + "\nError: " + gl.getShaderInfoLog(shader)
			);
		}

		return shader;
	}

	public static createProgram(
		vertexShader: WebGLShader,
		fragmentShader: WebGLShader
	): WebGLProgram {
		let program = gl.createProgram();

		if (!program) {
			throw new Error("Unable to create WebGL program!");
		}

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);

		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			gl.deleteProgram(program);
			throw new Error("Error creating shader program!");
		}

		return program;
	}

	public abstract render(camera: Camera): void;

	public use(): void {
		gl.useProgram(this._program);
	}

	public setFloat(uniform: string, float: number): void {
		let location = gl.getUniformLocation(this._program, uniform);
		gl.uniform1f(location, float);
	}
	public setVec3(uniform: string, vector: Vector3): void {
		let location = gl.getUniformLocation(this._program, uniform);
		gl.uniform3fv(location, [vector.x, vector.y, vector.z]);
	}

	public setVec4(uniform: string, vector: Vector4): void {
		let location = gl.getUniformLocation(this._program, uniform);
		gl.uniform4fv(location, [vector.x, vector.y, vector.z, vector.w]);
	}

	public setMat4(uniform: string, matrix: Matrix4x4): void {
		let location = gl.getUniformLocation(this._program, uniform);
		gl.uniformMatrix4fv(location, false, matrix.toFloat32Array());
	}
}
