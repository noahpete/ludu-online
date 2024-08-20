import { Application } from "../core";
import { generateUUID } from "../util";

export class Entity {
	private _id: number;
	private _name: string;

	public constructor(name: string) {
		Application.activeScene.addEntity(this); // TODO: change this

		this._id = generateUUID();
		this._name = name;
	}
}
