import { Application } from "../core";
import { Transform, Vector3 } from "../math";
import { Camera } from "../renderer";
import { generateUUID } from "../util";
import { Component } from "./component";
import { TransformComponent } from "./components";
import { CameraComponent } from "./components/camera-component";
import { ModelComponent } from "./components/model-component";

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

		this._transformComponent = new TransformComponent(this);
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

	public addComponentByType(type: string, data?: any): Component | undefined {
		switch (type) {
			case "camera": {
				let component = new CameraComponent(this, data);
				this.addComponent(component);
				return component;
			}
			case "model": {
				let component = new ModelComponent(this, data);
				this.addComponent(component);
				return component;
			}

			default:
				return undefined;
		}
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

	public get worldPosition(): Vector3 {
		return this.worldTransform.position;
	}

	public get localPosition(): Vector3 {
		return this.localTransform.position;
	}

	/**
	 *  Set the local position.
	 */
	public setPosition(x: number, y: number, z: number): void {
		this.localTransform.position = new Vector3(x, y, z);
	}

	/**
	 *  Set the local rotation.
	 */
	public setRotation(x: number, y: number, z: number): void {
		this.localTransform.rotation = new Vector3(x, y, z);
	}

	public start() {
		for (let [_, component] of Object.entries(this._components)) {
			component.start();
		}
	}

	public update() {
		this.updateWorldTransform();

		for (let [_, component] of Object.entries(this._components)) {
			component.update();
		}

		for (let [_, child] of Object.entries(this._children)) {
			child.update();
		}
	}

	public render(camera: Camera) {
		for (let [_, component] of Object.entries(this._components)) {
			component.render(camera);
		}

		for (let [_, child] of Object.entries(this._children)) {
			child.render(camera);
		}
	}

	private updateWorldTransform(): void {
		if (this._parent) {
			let parentTransform = this._parent.worldTransform;

			this.worldTransform.position.x = parentTransform.position.x + this.localTransform.position.x;
			this.worldTransform.position.y = parentTransform.position.y + this.localTransform.position.y;
			this.worldTransform.position.z = parentTransform.position.z + this.localTransform.position.z;

			this.worldTransform.rotation.x = parentTransform.rotation.x + this.localTransform.rotation.x;
			this.worldTransform.rotation.y = parentTransform.rotation.y + this.localTransform.rotation.y;
			this.worldTransform.rotation.z = parentTransform.rotation.z + this.localTransform.rotation.z;

			this.worldTransform.scale.x = parentTransform.scale.x * this.localTransform.scale.x;
			this.worldTransform.scale.y = parentTransform.scale.y * this.localTransform.scale.y;
			this.worldTransform.scale.z = parentTransform.scale.z * this.localTransform.scale.z;
		} else {
			this.worldTransform.position.x = this.localTransform.position.x;
			this.worldTransform.position.y = this.localTransform.position.y;
			this.worldTransform.position.z = this.localTransform.position.z;

			this.worldTransform.rotation.x = this.localTransform.rotation.x;
			this.worldTransform.rotation.y = this.localTransform.rotation.y;
			this.worldTransform.rotation.z = this.localTransform.rotation.z;

			this.worldTransform.scale.x = this.localTransform.scale.x;
			this.worldTransform.scale.y = this.localTransform.scale.y;
			this.worldTransform.scale.z = this.localTransform.scale.z;
		}
	}
}
