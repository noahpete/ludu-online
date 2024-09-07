import React, { useEffect, useState } from "react";
import InputSlider from "./InputSlider";
import { PerspectiveCamera } from "ludu-engine/src/renderer/perspective-camera";
import * as ld from "ludu-engine";

export default function PerspectiveCameraProperties({
	cameraComponent,
}: {
	cameraComponent: ld.CameraComponent;
}) {
	const [fov, setFov] = useState((cameraComponent.camera as PerspectiveCamera).fov || 45);

	useEffect(() => {
		const camera = cameraComponent.camera as PerspectiveCamera;
		camera.fov = fov;
	}, [fov]);

	return (
		<div>
			<div className="flex">
				<p>Field of View</p>
				<div className="ml-auto">
					<InputSlider text="" value={fov} setValue={setFov} bgColor="bg-gray-500" rate={0.01} />
				</div>
			</div>
		</div>
	);
}
