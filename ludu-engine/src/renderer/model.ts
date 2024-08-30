import { Transform } from "../math";
import { Scene } from "../scene";
import { Camera } from "./camera";
import { Material } from "./material";
import { Mesh } from "./mesh";
import { Shader } from "./shader";

export abstract class Model {
	protected _mesh: Mesh | null = null;
	protected _shader: Shader | null = null; // TODO: make shader part of a Material
	protected _material: Material;

	public transform: Transform;

	public constructor() {
		this.transform = new Transform();

		// temp
		this._material = new Material();
	}

	public async loadObj(path: string): Promise<void> {
		const response = await fetch(path);
		const text = await response.text();
		const data = this.parseOBJ(text);
		this._mesh = new Mesh(data.position, data.normal, data.texcoord);
	}

	// from https://webgl2fundamentals.org/webgl/lessons/webgl-load-obj.html
	public parseOBJ(text: string): any {
		// because indices are base 1 let's just fill in the 0th data
		const objPositions: number[][] = [[0, 0, 0]];
		const objTexcoords: number[][] = [[0, 0]];
		const objNormals: number[][] = [[0, 0, 0]];

		// same order as `f` indices
		const objVertexData = [objPositions, objTexcoords, objNormals];

		// same order as `f` indices
		let webglVertexData: number[][] = [
			[], // positions
			[], // texcoords
			[], // normals
		];

		let geometry: { data: { position: number[] } } | undefined;

		function newGeometry() {
			// If there is an existing geometry and it's
			// not empty then start a new one.
			if (geometry && geometry.data.position.length) {
				geometry = undefined;
			}
			setGeometry();
		}

		function setGeometry() {
			if (!geometry) {
				geometry = { data: { position: [] } };
			}
		}

		function addVertex(vert: string) {
			const ptn = vert.split("/");
			ptn.forEach((objIndexStr, i) => {
				if (!objIndexStr) {
					return;
				}
				const objIndex = parseInt(objIndexStr);
				const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
				webglVertexData[i].push(...objVertexData[i][index]);
			});
		}

		const keywords: { [key: string]: (parts: string[]) => void } = {
			v(parts: string[]) {
				objPositions.push(parts.map(parseFloat));
			},
			vn(parts: string[]) {
				objNormals.push(parts.map(parseFloat));
			},
			vt(parts: string[]) {
				// should check for missing v and extra w?
				objTexcoords.push(parts.map(parseFloat));
			},
			f(parts: string[]) {
				const numTriangles = parts.length - 2;
				for (let tri = 0; tri < numTriangles; ++tri) {
					addVertex(parts[0]);
					addVertex(parts[tri + 1]);
					addVertex(parts[tri + 2]);
				}
			},
		};

		const keywordRE = /(\w*)(?: )*(.*)/;
		const lines = text.split("\n");
		for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
			const line = lines[lineNo].trim();
			if (line === "" || line.startsWith("#")) {
				continue;
			}
			const m = keywordRE.exec(line);
			if (!m) {
				continue;
			}
			const [, keyword, unparsedArgs] = m;
			const parts = line.split(/\s+/).slice(1);
			const handler = keywords[keyword];
			if (!handler) {
				console.warn("unhandled keyword:", keyword);
				continue;
			}
			handler(parts);
		}

		return {
			position: webglVertexData[0],
			texcoord: webglVertexData[1],
			normal: webglVertexData[2],
		};
	}

	public setUniforms(): void {}

	public abstract render(camera: Camera, scene: Scene): void;
}
