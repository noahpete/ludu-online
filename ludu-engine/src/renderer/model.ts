import { Renderer, Mesh, Texture } from ".";

export class Model {
	private _mesh: Mesh;
	private _texture: Texture | null;

	public constructor(mesh: Mesh, texture: Texture) {
		this._mesh = mesh;
		this._texture = texture;

		Renderer.addModel(this);
	}

	public get mesh(): Mesh {
		return this._mesh;
	}

	public set mesh(value: Mesh) {
		this._mesh = value;
	}

	public get texture(): Texture | null {
		return this._texture;
	}

	public set texture(value: Texture) {
		this._texture = value;
	}

	public render() {}
}
