import { generateUUID } from "../util";

export abstract class Component {
	private _id: number;
	protected _type: string;

	protected constructor(type: string) {
		this._id = generateUUID();
		this._type = type;
	}

	public get id(): number {
		return this._id;
	}

	public start(): void {}

	public update(): void {}

	public render(): void {}
}
