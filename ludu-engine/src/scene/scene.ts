import { Entity } from ".";

export class Scene {
	private _entities: Entity[] = [];

	public constructor() {}

	public addEntity(entity: Entity) {
		this._entities.push(entity);
	}
}
