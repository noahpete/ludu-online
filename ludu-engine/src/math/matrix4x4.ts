import { Vector3 } from "./vector3";

export class Matrix4x4 {
	data: Float32Array;

	constructor() {
		this.data = Matrix4x4.identity();
	}

	vTranslate(vector: Vector3): this {
		Matrix4x4.translate(this.data, vector.x, vector.y, vector.z);
		return this;
	}

	translate(x: number, y: number, z: number): this {
		Matrix4x4.translate(this.data, x, y, z);
		return this;
	}

	rotateY(rad: number): this {
		Matrix4x4.rotateY(this.data, rad);
		return this;
	}

	rotateX(rad: number): this {
		Matrix4x4.rotateX(this.data, rad);
		return this;
	}

	rotateZ(rad: number): this {
		Matrix4x4.rotateZ(this.data, rad);
		return this;
	}

	vScale(vector: Vector3): this {
		Matrix4x4.scale(this.data, vector.x, vector.y, vector.z);
		return this;
	}

	scale(x: number, y: number, z: number): this {
		Matrix4x4.scale(this.data, x, y, z);
		return this;
	}

	invert(): this {
		Matrix4x4.invert(this.data);
		return this;
	}

	resetRotation(): this {
		for (let i = 0; i < this.data.length; i++) {
			if (i >= 12 && i <= 14) continue;
			this.data[i] = i % 5 === 0 ? 1 : 0; // only positions 0, 5, 10, 15 need to be 1, else 0
		}
		return this;
	}

	reset(): this {
		for (let i = 0; i < this.data.length; i++) {
			this.data[i] = i % 5 === 0 ? 1 : 0;
		}
		return this;
	}

	// Static Data Methods
	static identity(): Float32Array {
		const a = new Float32Array(16);
		a[0] = a[5] = a[10] = a[15] = 1;
		return a;
	}

	static perspective(fovy: number, aspect: number, near: number, far: number): Matrix4x4 {
		const f = 1.0 / Math.tan(fovy / 2);
		const nf = 1 / (near - far);

		const mat = new Matrix4x4();
		let data = mat.data;

		data[0] = f / aspect;
		data[1] = 0;
		data[2] = 0;
		data[3] = 0;
		data[4] = 0;
		data[5] = f;
		data[6] = 0;
		data[7] = 0;
		data[8] = 0;
		data[9] = 0;
		data[10] = (far + near) * nf;
		data[11] = -1;
		data[12] = 0;
		data[13] = 0;
		data[14] = 2 * far * near * nf;
		data[15] = 0;

		return mat;
	}

	static ortho(
		left: number,
		right: number,
		bottom: number,
		top: number,
		near: number,
		far: number
	): Matrix4x4 {
		const lr = 1 / (left - right);
		const bt = 1 / (bottom - top);
		const nf = 1 / (near - far);

		const mat = new Matrix4x4();
		let data = mat.data;

		data[0] = -2 * lr;
		data[1] = 0;
		data[2] = 0;
		data[3] = 0;
		data[4] = 0;
		data[5] = -2 * bt;
		data[6] = 0;
		data[7] = 0;
		data[8] = 0;
		data[9] = 0;
		data[10] = 2 * nf;
		data[11] = 0;
		data[12] = (left + right) * lr;
		data[13] = (top + bottom) * bt;
		data[14] = (far + near) * nf;
		data[15] = 1;

		return mat;
	}

	static transpose(out: Float32Array, a: Float32Array): Float32Array {
		if (out === a) {
			const a01 = a[1],
				a02 = a[2],
				a03 = a[3],
				a12 = a[6],
				a13 = a[7],
				a23 = a[11];
			out[1] = a[4];
			out[2] = a[8];
			out[3] = a[12];
			out[4] = a01;
			out[6] = a[9];
			out[7] = a[13];
			out[8] = a02;
			out[9] = a12;
			out[11] = a[14];
			out[12] = a03;
			out[13] = a13;
			out[14] = a23;
		} else {
			out[0] = a[0];
			out[1] = a[4];
			out[2] = a[8];
			out[3] = a[12];
			out[4] = a[1];
			out[5] = a[5];
			out[6] = a[9];
			out[7] = a[13];
			out[8] = a[2];
			out[9] = a[6];
			out[10] = a[10];
			out[11] = a[14];
			out[12] = a[3];
			out[13] = a[7];
			out[14] = a[11];
			out[15] = a[15];
		}
		return out;
	}

	static normalMat3(out: Float32Array, a: Float32Array): Float32Array | null {
		const a00 = a[0],
			a01 = a[1],
			a02 = a[2],
			a03 = a[3],
			a10 = a[4],
			a11 = a[5],
			a12 = a[6],
			a13 = a[7],
			a20 = a[8],
			a21 = a[9],
			a22 = a[10],
			a23 = a[11],
			a30 = a[12],
			a31 = a[13],
			a32 = a[14],
			a33 = a[15],
			b00 = a00 * a11 - a01 * a10,
			b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10,
			b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11,
			b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30,
			b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30,
			b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31,
			b11 = a22 * a33 - a23 * a32,
			det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

		if (!det) return null;

		const invDet = 1.0 / det;

		out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
		out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * invDet;
		out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;

		out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * invDet;
		out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
		out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * invDet;

		out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
		out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * invDet;
		out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;

		return out;
	}

	static multiplyVector(mat4: Float32Array, v: number[]): number[] {
		const [x, y, z, w] = v;
		return [
			x * mat4[0] + y * mat4[4] + z * mat4[8] + w * mat4[12],
			x * mat4[1] + y * mat4[5] + z * mat4[9] + w * mat4[13],
			x * mat4[2] + y * mat4[6] + z * mat4[10] + w * mat4[14],
			x * mat4[3] + y * mat4[7] + z * mat4[11] + w * mat4[15],
		];
	}

	static multiply(out: Float32Array, a: Float32Array, b: Float32Array): Float32Array {
		const a00 = a[0],
			a01 = a[1],
			a02 = a[2],
			a03 = a[3],
			a10 = a[4],
			a11 = a[5],
			a12 = a[6],
			a13 = a[7],
			a20 = a[8],
			a21 = a[9],
			a22 = a[10],
			a23 = a[11],
			a30 = a[12],
			a31 = a[13],
			a32 = a[14],
			a33 = a[15];

		const b00 = b[0],
			b01 = b[1],
			b02 = b[2],
			b03 = b[3],
			b10 = b[4],
			b11 = b[5],
			b12 = b[6],
			b13 = b[7],
			b20 = b[8],
			b21 = b[9],
			b22 = b[10],
			b23 = b[11],
			b30 = b[12],
			b31 = b[13],
			b32 = b[14],
			b33 = b[15];

		out[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
		out[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
		out[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
		out[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;

		out[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
		out[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
		out[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
		out[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;

		out[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
		out[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
		out[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
		out[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;

		out[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
		out[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
		out[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
		out[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

		return out;
	}

	static translate(out: Float32Array, x: number, y: number, z: number): void {
		out[12] += x;
		out[13] += y;
		out[14] += z;
	}

	static rotateY(out: Float32Array, rad: number): void {
		const sin = Math.sin(rad);
		const cos = Math.cos(rad);

		const m00 = out[0];
		const m02 = out[8];
		const m10 = out[1];
		const m12 = out[9];
		const m20 = out[2];
		const m22 = out[10];
		const m30 = out[3];
		const m32 = out[11];

		out[0] = m00 * cos + m02 * sin;
		out[8] = m00 * -sin + m02 * cos;

		out[1] = m10 * cos + m12 * sin;
		out[9] = m10 * -sin + m12 * cos;

		out[2] = m20 * cos + m22 * sin;
		out[10] = m20 * -sin + m22 * cos;

		out[3] = m30 * cos + m32 * sin;
		out[11] = m30 * -sin + m32 * cos;
	}

	static rotateX(out: Float32Array, rad: number): void {
		const sin = Math.sin(rad);
		const cos = Math.cos(rad);

		const m01 = out[4];
		const m02 = out[8];
		const m11 = out[5];
		const m12 = out[9];
		const m21 = out[6];
		const m22 = out[10];
		const m31 = out[7];
		const m32 = out[11];

		out[4] = m01 * cos - m02 * sin;
		out[8] = m01 * sin + m02 * cos;

		out[5] = m11 * cos - m12 * sin;
		out[9] = m11 * sin + m12 * cos;

		out[6] = m21 * cos - m22 * sin;
		out[10] = m21 * sin + m22 * cos;

		out[7] = m31 * cos - m32 * sin;
		out[11] = m31 * sin + m32 * cos;
	}

	static rotateZ(out: Float32Array, rad: number): void {
		const sin = Math.sin(rad);
		const cos = Math.cos(rad);

		const m00 = out[0];
		const m01 = out[4];
		const m10 = out[1];
		const m11 = out[5];
		const m20 = out[2];
		const m21 = out[6];
		const m30 = out[3];
		const m31 = out[7];

		out[0] = m00 * cos - m01 * sin;
		out[4] = m00 * sin + m01 * cos;

		out[1] = m10 * cos - m11 * sin;
		out[5] = m10 * sin + m11 * cos;

		out[2] = m20 * cos - m21 * sin;
		out[6] = m20 * sin + m21 * cos;

		out[3] = m30 * cos - m31 * sin;
		out[7] = m30 * sin + m31 * cos;
	}

	static scale(out: Float32Array, x: number, y: number, z: number): void {
		out[0] *= x;
		out[1] *= x;
		out[2] *= x;
		out[3] *= x;

		out[4] *= y;
		out[5] *= y;
		out[6] *= y;
		out[7] *= y;

		out[8] *= z;
		out[9] *= z;
		out[10] *= z;
		out[11] *= z;
	}

	static invert(out: Float32Array): Float32Array | null {
		const m00 = out[0],
			m01 = out[1],
			m02 = out[2],
			m03 = out[3],
			m10 = out[4],
			m11 = out[5],
			m12 = out[6],
			m13 = out[7],
			m20 = out[8],
			m21 = out[9],
			m22 = out[10],
			m23 = out[11],
			m30 = out[12],
			m31 = out[13],
			m32 = out[14],
			m33 = out[15],
			b00 = m00 * m11 - m01 * m10,
			b01 = m00 * m12 - m02 * m10,
			b02 = m00 * m13 - m03 * m10,
			b03 = m01 * m12 - m02 * m11,
			b04 = m01 * m13 - m03 * m11,
			b05 = m02 * m13 - m03 * m12,
			b06 = m20 * m31 - m21 * m30,
			b07 = m20 * m32 - m22 * m30,
			b08 = m20 * m33 - m23 * m30,
			b09 = m21 * m32 - m22 * m31,
			b10 = m21 * m33 - m23 * m31,
			b11 = m22 * m33 - m23 * m32,
			det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

		if (!det) return null;
		const invDet = 1.0 / det;

		out[0] = (m11 * b11 - m12 * b10 + m13 * b09) * invDet;
		out[1] = (m02 * b10 - m01 * b11 - m03 * b09) * invDet;
		out[2] = (m31 * b05 - m32 * b04 + m33 * b03) * invDet;
		out[3] = (m22 * b04 - m21 * b05 - m23 * b03) * invDet;

		out[4] = (m12 * b08 - m10 * b11 - m13 * b07) * invDet;
		out[5] = (m00 * b11 - m02 * b08 + m03 * b07) * invDet;
		out[6] = (m32 * b02 - m30 * b05 - m33 * b01) * invDet;
		out[7] = (m20 * b05 - m22 * b02 + m23 * b01) * invDet;

		out[8] = (m10 * b10 - m11 * b08 + m13 * b06) * invDet;
		out[9] = (m01 * b08 - m00 * b10 - m03 * b06) * invDet;
		out[10] = (m30 * b04 - m31 * b02 + m33 * b00) * invDet;
		out[11] = (m21 * b02 - m20 * b04 - m23 * b00) * invDet;

		out[12] = (m11 * b07 - m10 * b09 - m12 * b06) * invDet;
		out[13] = (m00 * b09 - m01 * b07 + m02 * b06) * invDet;
		out[14] = (m31 * b01 - m30 * b03 - m32 * b00) * invDet;
		out[15] = (m20 * b03 - m21 * b01 + m22 * b00) * invDet;

		return out;
	}
}
