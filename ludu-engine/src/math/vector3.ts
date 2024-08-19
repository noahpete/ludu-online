export class Vector3 {
	public x: number;
	public y: number;
	public z: number;

	public constructor(x: number, y: number, z: number) {
		this.x = x || 0.0;
		this.y = y || 0.0;
		this.z = z || 0.0;
	}

	public static get zero() {
		return new Vector3(0, 0, 0);
	}

	public static get one() {
		return new Vector3(1, 1, 1);
	}

	public magnitude(vector?: Vector3) {
		//Only get the magnitude of this vector
		if (vector === undefined) return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);

		//Get magnitude based on another vector
		let x = vector.x - this.x,
			y = vector.y - this.y,
			z = vector.y - this.z;

		return Math.sqrt(x * x + y * y + z * z);
	}

	public normalize() {
		let mag = this.magnitude();
		this.x /= mag;
		this.y /= mag;
		this.z /= mag;
		return this;
	}

	public set(x: number, y: number, z: number) {
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	public multiScalar(value: number) {
		this.x *= value;
		this.y *= value;
		this.z *= value;
		return this;
	}

	public getArray() {
		return [this.x, this.y, this.z];
	}

	public getFloat32Array() {
		return new Float32Array([this.x, this.y, this.z]);
	}

	public clone() {
		return new Vector3(this.x, this.y, this.z);
	}
}
