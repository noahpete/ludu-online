import { Entity } from ".";

export class Scene {
	private _root: Entity;

	public constructor() {
		this._root = new Entity("__ROOT__");
	}

	public get root(): Entity {
		return this._root;
	}

	public addEntity(entity: Entity) {
		entity.parent = this._root;
		this._root.addChild(entity);
	}
}
