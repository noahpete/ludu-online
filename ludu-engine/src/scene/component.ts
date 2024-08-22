import { generateUUID } from "../util";
import { Entity } from "./entity";

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

	public get parent(): Entity {
		return this._parent;
	}

	public start(): void {}

	public update(): void {}

	public render(): void {}
}
