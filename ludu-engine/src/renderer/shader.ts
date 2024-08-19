import {
	ATTR_NORMAL_LOC,
	ATTR_NORMAL_NAME,
	ATTR_POSITION_LOC,
	ATTR_POSITION_NAME,
	ATTR_UV_LOC,
	ATTR_UV_NAME,
} from "../core/constants";
import { Model } from "./model";
import { gl } from "./renderer";

export class Shader {
	private _id: string = "";
	private _name: string = "";

	protected _vertexSource: string;
	protected _fragmentSource: string;

	protected _program: WebGLProgram;

	protected _attributeLocations: any;
	protected _uniformLocations: any;

	/**
	 * Initializes shader and creates shader program from source.
	 * @param name - The name of the Shader.
	 * @param vertexSource - The vertex shader source code.
	 * @param fragmentSource - The fragment shader source code.
	 * @requires gl.useProgram(null) - Must unuse the program in extended constructor.
	 */
	public constructor(name: string, vertexSource: string = "", fragmentSource: string = "") {
		// this._id = ;
		this._name = name;

		this._vertexSource = vertexSource;
		this._fragmentSource = fragmentSource;

		let vertexShader = Shader.create(vertexSource, gl.VERTEX_SHADER);
		let fragmentShader = Shader.create(fragmentSource, gl.FRAGMENT_SHADER);

		this._program = Shader.createProgram(vertexShader, fragmentShader, true);

		if (this._program !== null) {
			gl.useProgram(this._program);
			this._attributeLocations = Shader.getStandardAttributeLocations(this._program);
			this._uniformLocations = {};
		}

		// Note: extended Shaders must call gl.useProgram(null) in their constructor
	}

	public get id(): string {
		return this._id;
	}

	public get name(): string {
		return this._name;
	}

	public get vertexSource(): string {
		return this._vertexSource;
	}

	public get fragmentSource(): string {
		return this._fragmentSource;
	}

	public use(): Shader {
		gl.useProgram(this._program);
		return this;
	}

	public unuse(): void {
		gl.useProgram(null);
	}

	public renderModel(model: Model) {
		gl.bindVertexArray(model.mesh.vao);

		if (model.mesh.indexCount) {
			gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, gl.UNSIGNED_SHORT, 0);
		} else {
			gl.drawArrays(model.mesh.drawMode, 0, model.mesh.vertexCount);
		}

		gl.bindVertexArray(null);
	}

	public static getStandardAttributeLocations(program: WebGLProgram): any {
		return {
			position: gl.getAttribLocation(program, ATTR_POSITION_NAME),
			norm: gl.getAttribLocation(program, ATTR_NORMAL_NAME),
			uv: gl.getAttribLocation(program, ATTR_UV_NAME),
		};
	}

	public static getStandardUniformLocations(program: WebGLProgram): any {
		return {
			perspective: gl.getUniformLocation(program, "u_pMatrix"),
			modelMatrix: gl.getUniformLocation(program, "u_mvMatrix"),
			cameraMatrix: gl.getUniformLocation(program, "u_cameraMatrix"),
			mainTexture: gl.getUniformLocation(program, "u_mainTexture"),
		};
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
		fragmentShader: WebGLShader,
		validate: boolean
	): WebGLProgram {
		let program = gl.createProgram();

		if (!program) {
			throw new Error("Unable to create WebGL program!");
		}

		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);

		gl.bindAttribLocation(program, ATTR_POSITION_LOC, ATTR_POSITION_NAME);
		gl.bindAttribLocation(program, ATTR_NORMAL_LOC, ATTR_NORMAL_NAME);
		gl.bindAttribLocation(program, ATTR_UV_LOC, ATTR_UV_NAME);

		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			gl.deleteProgram(program);
			throw new Error("Error creating shader program!");
		}

		if (validate) {
			gl.validateProgram(program);

			if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
				gl.deleteProgram(program);
				throw new Error("Error validating shader program!");
			}
		}

		gl.detachShader(program, vertexShader);
		gl.detachShader(program, fragmentShader);
		gl.deleteShader(fragmentShader);
		gl.deleteShader(vertexShader);

		return program;
	}
}
