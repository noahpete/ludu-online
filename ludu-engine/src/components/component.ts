import { Entity } from "../core";
import { generateUUID } from "../util";

export abstract class Component {
	private _id: number;
	private _type: string;
	private _parent: Entity;

	public constructor(parent: Entity, type: string) {
		this._id = generateUUID();
		this._type = type;
		this._parent = parent;
	}

	public get parent(): Entity {
		return this._parent;
	}

	public get type(): string {
		return this._type;
	}

	public update(): void {}

	public render(): void {}
}
