import { CameraComponent } from "ludu-engine/src/scene/components";
import React, { useEffect, useState } from "react";
import InputDropdown from "./InputDropdown";
import { PerspectiveCamera } from "ludu-engine/src/renderer/perspective-camera";
import * as ld from "ludu-engine";

export default function CameraProperties({
	cameraComponent,
}: {
	cameraComponent: CameraComponent;
}) {
	const [cameraType, setCameraType] = useState<string>(cameraComponent.camera.type);

	// Effect to handle camera type changes
	useEffect(() => {
		if (cameraType === "perspective") {
			cameraComponent.switchToPerspective();
		} else if (cameraType === "orthographic") {
			cameraComponent.switchToOrthographic();
		}

		ld.Renderer.camera = cameraComponent.camera;
	}, [cameraType]);

	return (
		<>
			<div id="upper" className="p-2">
				<div id="type" className="flex">
					<p>Type</p>
					<div className="ml-auto">
						<InputDropdown
							options={["perspective", "orthographic"]}
							selected={cameraType}
							setSelected={setCameraType}
						/>
					</div>
				</div>
			</div>
			<div className="w-full h-1 bg-[var(--background-secondary)]"></div>
		</>
	);
}
