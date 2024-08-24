import { degToRad } from "../util";
import { Vector3 } from "./vector3";

/** A 4x4 matrix to be used for transformations. */
export class Matrix4x4 {
	private _data: number[] = [];

	/** Creates a new matrix 4x4. Marked as private to enforce the use of static methods. */
	private constructor() {
		this._data = [1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0];
	}

	/** Returns the data contained in this matrix as an array of numbers. */
	public get data(): number[] {
		return this._data;
	}

	public translate(x: number, y: number, z: number): void {
		let translationMatrix = Matrix4x4.translation(new Vector3(x, y, z));
		this._data = Matrix4x4.multiply(this, translationMatrix)._data;
	}

	public rotate(x: number, y: number, z: number): void {
		let rotationMatrix = Matrix4x4.rotationXYZ(x, y, z);
		this._data = Matrix4x4.multiply(this, rotationMatrix)._data;
	}

	public scale(x: number, y: number, z: number): void {
		let scaleMatrix = Matrix4x4.scale(new Vector3(x, y, z));
		this._data = Matrix4x4.multiply(this, scaleMatrix)._data;
	}

	/** Creates and returns an identity matrix. */
	public static identity(): Matrix4x4 {
		return new Matrix4x4();
	}

	/**
	 * Creates and returns a new orthographic projection matrix.
	 * @param left The left extents of the viewport.
	 * @param right The right extents of the viewport.
	 * @param bottom The bottom extents of the viewport.
	 * @param top The top extents of the viewport.
	 * @param nearClip The near clipping plane.
	 * @param farClip The far clipping plane.
	 */
	public static orthographic(
		left: number,
		right: number,
		bottom: number,
		top: number,
		nearClip: number,
		farClip: number
	): Matrix4x4 {
		let m = new Matrix4x4();

		let lr: number = 1.0 / (left - right);
		let bt: number = 1.0 / (bottom - top);
		let nf: number = 1.0 / (nearClip - farClip);

		m._data[0] = -2.0 * lr;

		m._data[5] = -2.0 * bt;

		m._data[10] = -2.0 * nf;

		m._data[12] = (left + right) * lr;
		m._data[13] = (top + bottom) * bt;
		m._data[14] = (farClip + nearClip) * nf;

		return m;
	}

	/**
	 * Creates and returns a new perspective projection matrix.
	 * @param fov The field of view in degrees.
	 * @param aspect The aspect ratio.
	 * @param nearClip The near clipping plane distance.
	 * @param farClip The far clipping plane distance.
	 */
	public static perspective(
		fov: number,
		aspect: number,
		nearClip: number,
		farClip: number
	): Matrix4x4 {
		let f = 1.0 / Math.tan((fov * (Math.PI / 180)) / 2.0);
		let rangeInv = 1.0 / (nearClip - farClip);

		// data
		let m = new Matrix4x4();
		m._data = [
			f / aspect,
			0,
			0,
			0,
			0,
			f,
			0,
			0,
			0,
			0,
			(nearClip + farClip) * rangeInv,
			-1.0,
			0,
			0,
			nearClip * farClip * rangeInv * 2.0,
			0.0,
		];
		return m;
	}

	/**
	 * Creates a transformation matrix using the provided position.
	 * @param position The position to be used in transformation.
	 */
	public static translation(position: Vector3): Matrix4x4 {
		let m = new Matrix4x4();

		m._data[12] = position.x;
		m._data[13] = position.y;
		m._data[14] = position.z;

		return m;
	}

	/**
	 * Creates a rotation matrix on the X axis from the provided angle in radians.
	 * @param angle The angle in degrees.
	 */
	public static rotationX(angle: number): Matrix4x4 {
		let m = new Matrix4x4();

		let c = Math.cos(degToRad(angle));
		let s = Math.sin(degToRad(angle));

		m._data[5] = c;
		m._data[6] = s;
		m._data[9] = -s;
		m._data[10] = c;

		return m;
	}

	/**
	 * Creates a rotation matrix on the Y axis from the provided angle in radians.
	 * @param angle The angle in degrees.
	 */
	public static rotationY(angle: number): Matrix4x4 {
		let m = new Matrix4x4();

		let c = Math.cos(degToRad(angle));
		let s = Math.sin(degToRad(angle));

		m._data[0] = c;
		m._data[2] = -s;
		m._data[8] = s;
		m._data[10] = c;

		return m;
	}

	/**
	 * Creates a rotation matrix on the Z axis from the provided angle in radians.
	 * @param angle The angle in degrees.
	 */
	public static rotationZ(angle: number): Matrix4x4 {
		let m = new Matrix4x4();

		let c = Math.cos(degToRad(angle));
		let s = Math.sin(degToRad(angle));

		m._data[0] = c;
		m._data[1] = s;
		m._data[4] = -s;
		m._data[5] = c;

		return m;
	}

	/**
	 * Creates a rotation matrix from the provided angles in radians.
	 * @param xRadians The angle in radians on the X axis.
	 * @param yRadians The angle in radians on the Y axis.
	 * @param zRadians The angle in radians on the Z axis.
	 */
	public static rotationXYZ(xRadians: number, yRadians: number, zRadians: number): Matrix4x4 {
		let rx = Matrix4x4.rotationX(xRadians);
		let ry = Matrix4x4.rotationY(yRadians);
		let rz = Matrix4x4.rotationZ(zRadians);

		// ZYX
		return Matrix4x4.multiply(Matrix4x4.multiply(rz, ry), rx);
	}

	/**
	 * Creates a scale matrix.
	 * @param scale The scale to use.
	 */
	public static scale(scale: Vector3): Matrix4x4 {
		let m = new Matrix4x4();

		m._data[0] = scale.x;
		m._data[5] = scale.y;
		m._data[10] = scale.z;

		return m;
	}

	/**
	 * Multiplies matrix a by matrix b and returns the result.
	 * @param a The first matrix.
	 * @param b The second matrix.
	 */
	public static multiply(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
		let m = new Matrix4x4();

		let b00 = b._data[0 * 4 + 0];
		let b01 = b._data[0 * 4 + 1];
		let b02 = b._data[0 * 4 + 2];
		let b03 = b._data[0 * 4 + 3];
		let b10 = b._data[1 * 4 + 0];
		let b11 = b._data[1 * 4 + 1];
		let b12 = b._data[1 * 4 + 2];
		let b13 = b._data[1 * 4 + 3];
		let b20 = b._data[2 * 4 + 0];
		let b21 = b._data[2 * 4 + 1];
		let b22 = b._data[2 * 4 + 2];
		let b23 = b._data[2 * 4 + 3];
		let b30 = b._data[3 * 4 + 0];
		let b31 = b._data[3 * 4 + 1];
		let b32 = b._data[3 * 4 + 2];
		let b33 = b._data[3 * 4 + 3];
		let a00 = a._data[0 * 4 + 0];
		let a01 = a._data[0 * 4 + 1];
		let a02 = a._data[0 * 4 + 2];
		let a03 = a._data[0 * 4 + 3];
		let a10 = a._data[1 * 4 + 0];
		let a11 = a._data[1 * 4 + 1];
		let a12 = a._data[1 * 4 + 2];
		let a13 = a._data[1 * 4 + 3];
		let a20 = a._data[2 * 4 + 0];
		let a21 = a._data[2 * 4 + 1];
		let a22 = a._data[2 * 4 + 2];
		let a23 = a._data[2 * 4 + 3];
		let a30 = a._data[3 * 4 + 0];
		let a31 = a._data[3 * 4 + 1];
		let a32 = a._data[3 * 4 + 2];
		let a33 = a._data[3 * 4 + 3];

		m._data[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
		m._data[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
		m._data[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
		m._data[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
		m._data[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
		m._data[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
		m._data[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
		m._data[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
		m._data[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
		m._data[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
		m._data[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
		m._data[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
		m._data[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
		m._data[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
		m._data[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
		m._data[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;

		return m;
	}

	public static inverse(matrix: Matrix4x4): Matrix4x4 {
		{
			var m00 = matrix._data[0 * 4 + 0];
			var m01 = matrix._data[0 * 4 + 1];
			var m02 = matrix._data[0 * 4 + 2];
			var m03 = matrix._data[0 * 4 + 3];
			var m10 = matrix._data[1 * 4 + 0];
			var m11 = matrix._data[1 * 4 + 1];
			var m12 = matrix._data[1 * 4 + 2];
			var m13 = matrix._data[1 * 4 + 3];
			var m20 = matrix._data[2 * 4 + 0];
			var m21 = matrix._data[2 * 4 + 1];
			var m22 = matrix._data[2 * 4 + 2];
			var m23 = matrix._data[2 * 4 + 3];
			var m30 = matrix._data[3 * 4 + 0];
			var m31 = matrix._data[3 * 4 + 1];
			var m32 = matrix._data[3 * 4 + 2];
			var m33 = matrix._data[3 * 4 + 3];
			var tmp_0 = m22 * m33;
			var tmp_1 = m32 * m23;
			var tmp_2 = m12 * m33;
			var tmp_3 = m32 * m13;
			var tmp_4 = m12 * m23;
			var tmp_5 = m22 * m13;
			var tmp_6 = m02 * m33;
			var tmp_7 = m32 * m03;
			var tmp_8 = m02 * m23;
			var tmp_9 = m22 * m03;
			var tmp_10 = m02 * m13;
			var tmp_11 = m12 * m03;
			var tmp_12 = m20 * m31;
			var tmp_13 = m30 * m21;
			var tmp_14 = m10 * m31;
			var tmp_15 = m30 * m11;
			var tmp_16 = m10 * m21;
			var tmp_17 = m20 * m11;
			var tmp_18 = m00 * m31;
			var tmp_19 = m30 * m01;
			var tmp_20 = m00 * m21;
			var tmp_21 = m20 * m01;
			var tmp_22 = m00 * m11;
			var tmp_23 = m10 * m01;

			var t0 = tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31 - (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
			var t1 = tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31 - (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
			var t2 =
				tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31 - (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
			var t3 =
				tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21 - (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

			var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

			let m = new Matrix4x4();
			m._data = [
				d * t0,
				d * t1,
				d * t2,
				d * t3,
				d * (tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30 - (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
				d * (tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30 - (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
				d * (tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30 - (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
				d * (tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20 - (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
				d *
					(tmp_12 * m13 +
						tmp_15 * m23 +
						tmp_16 * m33 -
						(tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
				d *
					(tmp_13 * m03 +
						tmp_18 * m23 +
						tmp_21 * m33 -
						(tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
				d *
					(tmp_14 * m03 +
						tmp_19 * m13 +
						tmp_22 * m33 -
						(tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
				d *
					(tmp_17 * m03 +
						tmp_20 * m13 +
						tmp_23 * m23 -
						(tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
				d *
					(tmp_14 * m22 +
						tmp_17 * m32 +
						tmp_13 * m12 -
						(tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
				d *
					(tmp_20 * m32 +
						tmp_12 * m02 +
						tmp_19 * m22 -
						(tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
				d *
					(tmp_18 * m12 +
						tmp_23 * m32 +
						tmp_15 * m02 -
						(tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
				d *
					(tmp_22 * m22 +
						tmp_16 * m02 +
						tmp_21 * m12 -
						(tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
			];
			return m;
		}
	}

	public static transpose(matrix: Matrix4x4): Matrix4x4 {
		let m = new Matrix4x4();
		m._data = [
			matrix._data[0],
			matrix._data[4],
			matrix._data[8],
			matrix._data[12],
			matrix._data[1],
			matrix._data[5],
			matrix._data[9],
			matrix._data[13],
			matrix._data[2],
			matrix._data[6],
			matrix._data[10],
			matrix._data[14],
			matrix._data[3],
			matrix._data[7],
			matrix._data[11],
			matrix._data[15],
		];
		return m;
	}

	/** Returns the data of this matrix as a Float32Array. */
	public toFloat32Array(): Float32Array {
		return new Float32Array(this._data);
	}

	/**
	 * Creates a copy of matrix m.
	 * @param m The matrix to copy.
	 */
	public copyFrom(m: Matrix4x4): void {
		for (let i = 0; i < 16; ++i) {
			this._data[i] = m._data[i];
		}
	}
}
