import React, { useCallback, useEffect, useState } from "react";
import InputSlider from "./InputSlider";
import { TransformComponent } from "ludu-engine/src/scene/components";

export default function TransformProperties({
	transformComponent,
	hasScale = true,
}: {
	transformComponent: TransformComponent;
	hasScale: boolean;
}) {
	const [position, setPosition] = useState({
		x: transformComponent.localTransform.position.x,
		y: transformComponent.localTransform.position.y,
		z: transformComponent.localTransform.position.z,
	});

	const [rotation, setRotation] = useState({
		x: transformComponent.localTransform.rotation.x,
		y: transformComponent.localTransform.rotation.y,
		z: transformComponent.localTransform.rotation.z,
	});

	const [scale, setScale] = useState({
		x: transformComponent.localTransform.scale.x,
		y: transformComponent.localTransform.scale.y,
		z: transformComponent.localTransform.scale.z,
	});

	useEffect(() => {
		setPosition({
			x: transformComponent.localTransform.position.x,
			y: transformComponent.localTransform.position.y,
			z: transformComponent.localTransform.position.z,
		});

		setRotation({
			x: transformComponent.localTransform.rotation.x,
			y: transformComponent.localTransform.rotation.y,
			z: transformComponent.localTransform.rotation.z,
		});

		setScale({
			x: transformComponent.localTransform.scale.x,
			y: transformComponent.localTransform.scale.y,
			z: transformComponent.localTransform.scale.z,
		});
	}, [transformComponent.localTransform]);

	// Update the transformComponent's position and state when a slider changes
	const handlePositionChange = (axis: "x" | "y" | "z", value: number) => {
		setPosition((prev) => ({ ...prev, [axis]: value }));
		transformComponent.localTransform.position[axis] = value;
	};

	const handleRotationChange = (axis: "x" | "y" | "z", value: number) => {
		setRotation((prev) => ({ ...prev, [axis]: value }));
		transformComponent.localTransform.rotation[axis] = value;
	};

	const handleScaleChange = (axis: "x" | "y" | "z", value: number) => {
		setScale((prev) => ({ ...prev, [axis]: value }));
		transformComponent.localTransform.scale[axis] = value;
	};

	return (
		<div className="">
			<div className="p-2 relative">
				{/* Position */}
				<div className="outline outline-1 outline-[var(--background-secondary)] flex pl-2">
					<p>Position</p>
					<div className="ml-auto flex">
						<InputSlider
							text="x"
							value={position.x}
							setValue={(value: number) => handlePositionChange("x", value)}
							bgColor="bg-red-500"
							rate={0.01}
						/>
						<InputSlider
							text="y"
							value={position.y}
							setValue={(value: number) => handlePositionChange("y", value)}
							bgColor="bg-green-500"
							rate={0.01}
						/>
						<InputSlider
							text="z"
							value={position.z}
							setValue={(value: number) => handlePositionChange("z", value)}
							bgColor="bg-blue-500"
							rate={0.01}
						/>
					</div>
				</div>

				{/* Rotation */}
				<div className="outline outline-1 outline-[var(--background-secondary)] flex pl-2">
					<p>Rotation</p>
					<div className="ml-auto flex">
						<InputSlider
							text="x"
							value={rotation.x}
							setValue={(value: number) => handleRotationChange("x", value)}
							bgColor="bg-red-500"
							rate={0.1}
						/>
						<InputSlider
							text="y"
							value={rotation.y}
							setValue={(value: number) => handleRotationChange("y", value)}
							bgColor="bg-green-500"
							rate={0.1}
						/>
						<InputSlider
							text="z"
							value={rotation.z}
							setValue={(value: number) => handleRotationChange("z", value)}
							bgColor="bg-blue-500"
							rate={0.1}
						/>
					</div>
				</div>

				{/* Scale */}
				{hasScale ? (
					""
				) : (
					<div className="absolute opacity-60 bg-[var(--background-primary)] z-10 w-full h-6 select-none"></div>
				)}
				<div className="outline outline-1 outline-[var(--background-secondary)] flex pl-2">
					<p>Scale</p>
					<div className="ml-auto flex">
						<InputSlider
							text="x"
							value={scale.x}
							setValue={(value: number) => handleScaleChange("x", value)}
							bgColor="bg-red-500"
							rate={0.01}
						/>
						<InputSlider
							text="y"
							value={scale.x}
							setValue={(value: number) => handleScaleChange("y", value)}
							bgColor="bg-green-500"
							rate={0.01}
						/>
						<InputSlider
							text="z"
							value={scale.x}
							setValue={(value: number) => handleScaleChange("z", value)}
							bgColor="bg-blue-500"
							rate={0.01}
						/>
					</div>
				</div>
			</div>
			<div className="w-full h-1 bg-[var(--background-secondary)]"></div>
		</div>
	);
}
