import { gl } from "./renderer";

export class Buffer {
	public static createArrayBuffer(floatArray: Float32Array, isStatic: boolean) {
		if (isStatic === undefined) isStatic = true;
		let buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, floatArray, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		return buffer;
	}
}
