import { Application } from "../core";
import { Transform, Vector3 } from "../math";
import { Camera } from "../renderer";
import { generateUUID } from "../util";
import { Component } from "./component";
import { TransformComponent } from "./components";
import { CameraComponent } from "./components/camera-component";
import { LightComponent } from "./components/light-component";
import { ModelComponent } from "./components/model-component";
import { Scene } from "./scene";

export class Entity {
	private _id: number;
	private _name: string;

	private _components: { [key: number]: Component } = {};
	private _transformComponent: TransformComponent;

	private _children: { [key: number]: Entity } = {};
	private _parent: Entity | undefined = undefined;

	private _updateCallbacks: Array<(dt: number) => void> = [];

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
			case "light": {
				let component = new LightComponent(this, data);
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

	public getComponentByType(type: string): Component | undefined {
		for (let component of Object.values(this._components)) {
			if (component.type === type) {
				return component;
			}
		}
		return undefined;
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

	public getChildrenWithComponentType(type: string): Entity[] {
		let children: Entity[] = [];

		if (this.getComponentByType(type)) {
			children.push(this);
		}

		for (let child of Object.values(this._children)) {
			children = children.concat(child.getChildrenWithComponentType(type));
		}

		return children;
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

	public setScale(x: number, y: number, z: number): void {
		this.localTransform.scale = new Vector3(x, y, z);
	}

	public rotate(dx: number, dy: number, dz: number): void {
		let rotation = this.localTransform.rotation;
		rotation.add(new Vector3(dx, dy, dz));
		this.setRotation(rotation.x, rotation.y, rotation.z);
	}

	public move(dx: number, dy: number, dz: number): void {
		let translation = this.localTransform.position;
		translation.add(new Vector3(dx, dy, dz));
		this.setPosition(translation.x, translation.y, translation.z);
	}

	public start() {
		for (let [_, component] of Object.entries(this._components)) {
			component.start();
		}
	}

	public update(dt: number) {
		this.updateWorldTransform();

		for (let callback of this._updateCallbacks) {
			callback(dt);
		}

		for (let [_, component] of Object.entries(this._components)) {
			component.update(dt);
		}

		for (let [_, child] of Object.entries(this._children)) {
			child.update(dt);
		}
	}

	public addUpdateCallback(callback: (dt: number) => void): void {
		this._updateCallbacks.push(callback);
	}

	public removeUpdateCallback(callback: (dt: number) => void): void {
		this._updateCallbacks = this._updateCallbacks.filter((fn) => fn !== callback);
	}

	public render(camera: Camera, scene: Scene) {
		for (let [_, component] of Object.entries(this._components)) {
			component.render(camera, scene);
		}

		for (let [_, child] of Object.entries(this._children)) {
			child.render(camera, scene);
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
