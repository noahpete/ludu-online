export class Vector4 {
	public x: number;
	public y: number;
	public z: number;
	public w: number;

	public constructor(x: number, y: number, z: number, w: number) {
		this.x = x || 0.0;
		this.y = y || 0.0;
		this.z = z || 0.0;
		this.w = w || 0.0;
	}

	public static get zero() {
		return new Vector4(0, 0, 0, 0);
	}

	public static get one() {
		return new Vector4(1, 1, 1, 1);
	}

	public get r(): number {
		return this.x;
	}

	public get g(): number {
		return this.y;
	}

	public get b(): number {
		return this.z;
	}

	public get a(): number {
		return this.w;
	}

	public magnitude(vector?: Vector4) {
		//Only get the magnitude of this vector
		if (vector === undefined)
			return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);

		//Get magnitude based on another vector
		let x = vector.x - this.x,
			y = vector.y - this.y,
			z = vector.y - this.z,
			w = vector.w - this.w;

		return Math.sqrt(x * x + y * y + z * z + w * w);
	}

	public normalize() {
		let mag = this.magnitude();
		this.x /= mag;
		this.y /= mag;
		this.z /= mag;
		this.w /= mag;
		return this;
	}

	public set(x: number, y: number, z: number, w: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
		return this;
	}

	public multiScalar(value: number) {
		this.x *= value;
		this.y *= value;
		this.z *= value;
		this.w *= value;
		return this;
	}

	public getArray() {
		return [this.x, this.y, this.z, this.w];
	}

	public getFloat32Array() {
		return new Float32Array([this.x, this.y, this.z, this.w]);
	}

	public clone() {
		return new Vector4(this.x, this.y, this.z, this.w);
	}
}
