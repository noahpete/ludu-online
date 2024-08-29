import { Camera } from "../renderer";
import { generateUUID } from "../util";
import { Entity } from "./entity";
import { Scene } from "./scene";

export abstract class Component {
	private _id: number;
	protected _type: string;
	protected _parent: Entity;

	protected constructor(type: string, parent: Entity) {
		this._id = generateUUID();
		this._type = type;
		this._parent = parent;
	}

	public get id(): number {
		return this._id;
	}

	public get type(): string {
		return this._type;
	}

	public get parent(): Entity {
		return this._parent;
	}

	public abstract start(): void;

	public abstract update(dt: number): void;

	public abstract render(camera: Camera, scene: Scene): void;
}
