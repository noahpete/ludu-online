import { Camera, gl, Shader } from "..";
import { Matrix4x4, Vector3 } from "../../math";

const vertexSource = `#version 300 es

    layout (location = 0) in vec3 aPos;
	layout (location = 1) in vec3 aNormal;

	out vec3 FragPos;
	out vec3 Normal;

	uniform mat4 model;
	uniform mat4 view;
	uniform mat4 projection;

	void main()
	{
		FragPos = vec3(model * vec4(aPos, 1.0));
		Normal = mat3(transpose(inverse(model))) * aNormal;  
		
		gl_Position = projection * view * vec4(FragPos, 1.0);
	}
`;

const fragmentSource = `#version 300 es

    precision highp float;

	out vec4 FragColor;

	struct Material {
		vec3 diffuse;
		vec3 specular;    
		float shininess;
	}; 

	struct Light {
		vec3 position;

		vec3 ambient;
		vec3 diffuse;
		vec3 specular;
	};

	in vec3 FragPos;  
	in vec3 Normal;
	in vec2 TexCoords;
	
	uniform vec3 viewPos;
	uniform Material material;
	uniform Light light;

	void main()
	{
		// ambient
		vec3 ambient = light.ambient * material.ambient;
		
		// diffuse 
		vec3 norm = normalize(Normal);
		vec3 lightDir = normalize(light.position - FragPos);
		float diff = max(dot(norm, lightDir), 0.0);
		vec3 diffuse = light.diffuse * (diff * material.diffuse);
		
		// specular
		vec3 viewDir = normalize(viewPos - FragPos);
		vec3 reflectDir = reflect(-lightDir, norm);  
		float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
		vec3 specular = light.specular * (spec * material.specular);  
			
		vec3 result = ambient + diffuse + specular;
		FragColor = vec4(result, 1.0);
	}
`;

export class LightingMapShader extends Shader {
	private _cubeVAO: WebGLVertexArrayObject;

	public constructor() {
		super("basic", vertexSource, fragmentSource);

		let vertices = [
			-0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.5, -0.5, -0.5, 0.0, 0.0, -1.0, 0.5, 0.5, -0.5, 0.0, 0.0,
			-1.0, 0.5, 0.5, -0.5, 0.0, 0.0, -1.0, -0.5, 0.5, -0.5, 0.0, 0.0, -1.0, -0.5, -0.5, -0.5, 0.0,
			0.0, -1.0,

			-0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, -0.5, 0.5, 0.0, 0.0, 1.0, 0.5, 0.5, 0.5, 0.0, 0.0, 1.0,
			0.5, 0.5, 0.5, 0.0, 0.0, 1.0, -0.5, 0.5, 0.5, 0.0, 0.0, 1.0, -0.5, -0.5, 0.5, 0.0, 0.0, 1.0,

			-0.5, 0.5, 0.5, -1.0, 0.0, 0.0, -0.5, 0.5, -0.5, -1.0, 0.0, 0.0, -0.5, -0.5, -0.5, -1.0, 0.0,
			0.0, -0.5, -0.5, -0.5, -1.0, 0.0, 0.0, -0.5, -0.5, 0.5, -1.0, 0.0, 0.0, -0.5, 0.5, 0.5, -1.0,
			0.0, 0.0,

			0.5, 0.5, 0.5, 1.0, 0.0, 0.0, 0.5, 0.5, -0.5, 1.0, 0.0, 0.0, 0.5, -0.5, -0.5, 1.0, 0.0, 0.0,
			0.5, -0.5, -0.5, 1.0, 0.0, 0.0, 0.5, -0.5, 0.5, 1.0, 0.0, 0.0, 0.5, 0.5, 0.5, 1.0, 0.0, 0.0,

			-0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.5, -0.5, -0.5, 0.0, -1.0, 0.0, 0.5, -0.5, 0.5, 0.0, -1.0,
			0.0, 0.5, -0.5, 0.5, 0.0, -1.0, 0.0, -0.5, -0.5, 0.5, 0.0, -1.0, 0.0, -0.5, -0.5, -0.5, 0.0,
			-1.0, 0.0,

			-0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 0.5, -0.5, 0.0, 1.0, 0.0, 0.5, 0.5, 0.5, 0.0, 1.0, 0.0,
			0.5, 0.5, 0.5, 0.0, 1.0, 0.0, -0.5, 0.5, 0.5, 0.0, 1.0, 0.0, -0.5, 0.5, -0.5, 0.0, 1.0, 0.0,
		];

		// configure cube VAO
		this._cubeVAO = gl.createVertexArray()!;
		let VBO = gl.createBuffer()!;

		gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		gl.bindVertexArray(this._cubeVAO);

		// position attribute
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 6 * 4, 0 * 4);
		gl.enableVertexAttribArray(0);
		// normal attribute
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 6 * 4, 3 * 4);
		gl.enableVertexAttribArray(1);
	}

	public render(camera: Camera): void {
		gl.useProgram(this._program);

		this.setVec3("light.position", new Vector3(0, 1, -2));
		this.setVec3("viewPos", camera.position);

		// light properties
		let lightColor = new Vector3(1, 1, 1);
		let diffuseColor = lightColor.multiply(new Vector3(0.5, 0.5, 0.5));
		let ambientColor = diffuseColor.multiply(new Vector3(0.5, 0.5, 0.5));
		this.setVec3("light.ambient", ambientColor);
		this.setVec3("light.diffuse", diffuseColor);
		this.setVec3("light.specular", new Vector3(1, 1, 1));

		// material properties
		this.setVec3("material.ambient", new Vector3(1, 0.5, 0.3));
		this.setVec3("material.diffuse", new Vector3(1, 0.5, 0.3));
		this.setVec3("material.specular", new Vector3(0.5, 0.5, 0.5));
		this.setFloat("material.shininess", 32);

		// view/projection transformations
		this.setMat4("projection", camera.projectionMatrix);
		this.setMat4("view", camera.transformMatrix);

		this.setMat4("model", Matrix4x4.identity());

		// render the cube
		gl.bindVertexArray(this._cubeVAO);
		gl.drawArrays(gl.TRIANGLES, 0, 36);
	}
}
