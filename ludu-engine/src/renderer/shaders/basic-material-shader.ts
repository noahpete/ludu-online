import { Camera, gl, Shader } from "..";

const vertexSource = `#version 300 es

    layout (location = 0) in vec3 a_position;
	layout (location = 1) in vec3 a_normal;
	layout (location = 2) in vec2 a_texcoord;

	out vec3 v_fragPosition;
	out vec3 v_normal;
	out vec2 v_texcoord;
	
	uniform mat4 u_model;
	uniform mat4 u_view;
	uniform mat4 u_projection;

	void main() {
		v_fragPosition = vec3(u_model * vec4(a_position, 1.0));
		v_normal = mat3(transpose(inverse(u_model))) * a_normal;
		v_texcoord = a_texcoord;
		gl_Position = u_projection * u_view * vec4(v_fragPosition, 1.0);
	}
`;

const fragmentSource = `#version 300 es

    precision highp float;

	struct Material {
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

	in vec3 v_fragPosition;
	in vec3 v_normal;
	in vec2 v_texcoord;

	#define MAX_NUMBER_LIGHTS 32

	uniform PointLight u_pointLights[MAX_NUMBER_LIGHTS];
	uniform int u_pointLightsCount;
	uniform vec3 u_viewPosition;
	uniform Material u_material;
	uniform sampler2D u_texture;

	out vec4 outColor;

	vec3 CalculatePointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir);

	void main() {
		vec3 normal = normalize(v_normal);
		vec3 viewDir = normalize(u_viewPosition - v_fragPosition);

		vec3 result = vec3(0.5) * vec3(texture(u_texture, v_texcoord));

		for (int i = 0; i < u_pointLightsCount; i++) {
			PointLight light = u_pointLights[i];
			result += CalculatePointLight(light, normal, v_fragPosition, viewDir);
		}

		outColor = vec4(result, 1.0);
		// outColor = texture(u_texture, v_texcoord);
	}

	vec3 CalculatePointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir) {
		vec3 lightDir = normalize(light.position - fragPos);
		vec3 texture = vec3(texture(u_texture, v_texcoord));

		// ambient
		vec3 ambient = light.ambient * u_material.diffuse * texture;

		// diffuse
		float diff = max(dot(normal, lightDir), 0.0);
		vec3 diffuse = light.diffuse * diff * u_material.diffuse * texture;

		// specular
		vec3 reflectDir = reflect(-lightDir, normal);
		float spec = pow(max(dot(viewDir, reflectDir), 0.0), u_material.shininess); // shininess
		vec3 specular = light.specular * spec * u_material.specular * texture;

		// attenuation
		float distance = length(light.position - fragPos);
		float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

		// combine results
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
