import { Component, TransformComponent } from "../components";
import { generateUUID } from "../util";

export class Entity {
	private _id: number;
	private _name: string;

	private _components: Component[] = []; // TODO: make into map

	public constructor(name: string) {
		this._id = generateUUID();
		this._name = name;

		this.addComponent("transform");
	}

	public get id(): number {
		return this._id;
	}

	public get name(): string {
		return this._name;
	}

	public update(): void {}

	public render(): void {}

	/**
	 * Adds a component to the entity based on the given type.
	 * Optionally accepts data for initializing the component.
	 * @param type - The type of the component to add.
	 * @param data - Optional data for the component.
	 */
	public addComponent(type: string, data?: any) {
		switch (type) {
			// case "camera":
			// 	this._components.push(new CameraComponent());
			// 	break;

			case "transform":
				this._components.push(new TransformComponent(this), data);
				break;

			default:
				break;
		}
	}

	/**
	 * Retrieves a component of a given type.
	 * @param type - The type of the component to retrieve.
	 * @returns The found component or undefined if not found.
	 */
	public getComponent(type: string): Component | undefined {
		for (const component of this._components) {
			if (component.type == type) {
				return component;
			}
		}
		return undefined;
	}

	public setPosition(x: number, y: number, z: number) {
		let tc = this.getComponent("transform") as TransformComponent;
	}
}
