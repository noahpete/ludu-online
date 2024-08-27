import { Camera, gl, Shader } from "..";

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
		vec3 ambient;
		vec3 diffuse;
		vec3 specular;    
		float shininess;
	}; 

	struct PointLight {
		vec3 position;

		float constant;
		float linear;
		float quadratic;

		vec3 ambient;
		vec3 diffuse;
		vec3 specular;
	};

	in vec3 FragPos;  
	in vec3 Normal; 

	#define MAX_NUMBER_LIGHTS 32
	
	uniform vec3 viewPos;
	uniform Material material;
	uniform PointLight pointLights[MAX_NUMBER_LIGHTS];

	uniform int pointLightsCount;

	vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

	void main()
	{
		vec3 norm = normalize(Normal);
		vec3 viewDir = normalize(viewPos - FragPos);

		vec3 result;
		for (int i = 0; i < pointLightsCount; i++)
			result += CalcPointLight(pointLights[i], norm, FragPos, viewDir);
		
		FragColor = vec4(result, 1.0);
	}

	vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir)
	{
		vec3 lightDir = normalize(light.position - fragPos);
		float diff = max(dot(normal, lightDir), 0.0);
		vec3 reflectDir = reflect(-lightDir, normal);
		float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
		float distance = length(light.position - fragPos);
		float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
		
		// combine results
		vec3 ambient = light.ambient * material.ambient;
		vec3 diffuse = light.diffuse * diff * material.ambient;
		vec3 specular = light.specular * spec * material.ambient;
		ambient *= attenuation;
		diffuse *= attenuation;
		specular *= attenuation;
		return (ambient + diffuse + specular);
	}
`;

export class BasicMaterialShader extends Shader {
	public constructor() {
		super("basic", vertexSource, fragmentSource);
	}
}
