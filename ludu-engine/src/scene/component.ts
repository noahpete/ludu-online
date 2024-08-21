export abstract class Component {
	protected _type: string;

	protected constructor(type: string) {
		this._type = type;
	}

	public start(): void {}

	public update(): void {}

	public render(): void {}
}
