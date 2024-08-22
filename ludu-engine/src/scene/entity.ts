import { Application } from "../core";
import { Transform } from "../math";
import { generateUUID } from "../util";
import { Component } from "./component";
import { TransformComponent } from "./components";

export class Entity {
	private _id: number;
	private _name: string;

	private _components: { [key: number]: Component } = {};
	private _transformComponent: TransformComponent;

	private _children: { [key: number]: Entity } = {};
	private _parent: Entity | undefined = undefined;

	public constructor(name: string, parent?: Entity) {
		this._id = generateUUID();
		this._name = name;

		if (parent) {
			this._parent = parent;
		} else if (this._name !== "__ROOT__") {
			Application.activeScene.addEntity(this);
		}

		this._transformComponent = new TransformComponent();
		this._components[this._transformComponent.id] = this._transformComponent;
	}

	public get id(): number {
		return this._id;
	}

	public get name(): string {
		return this._name;
	}

	public get parent(): Entity | undefined {
		return this._parent;
	}

	public set parent(parent: Entity) {
		this._parent = parent;
	}

	public get localTransform(): Transform {
		return this._transformComponent.localTransform;
	}

	public get worldTransform(): Transform {
		return this._transformComponent.worldTransform;
	}

	public addComponent(component: Component): Component {
		this._components[component.id] = component;
		return this._components[component.id];
	}

	public getComponentById(id: number): Component | null {
		if (!this._components[id]) {
			console.log(`Unable to find Component with id '${id}'`);
			return null;
		}
		return this._components[id];
	}

	public addChild(child: Entity): Entity {
		this._children[child.id] = child;
		return this._children[child.id];
	}

	public getChildById(id: number): Entity | null {
		if (this._id === id) {
			return this;
		}

		for (let [_, child] of Object.entries(this._children)) {
			let result = child.getChildById(id);
			if (result) {
				return result;
			}
		}

		return null;
	}

	public start() {
		for (let [_, component] of Object.entries(this._components)) {
			component.start();
		}
	}

	public update() {
		for (let [_, component] of Object.entries(this._components)) {
			component.update();
		}
	}

	public render() {
		for (let [_, component] of Object.entries(this._components)) {
			component.render();
		}
	}
}
