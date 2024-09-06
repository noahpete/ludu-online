import { CameraComponent } from "ludu-engine/src/scene/components";
import React from "react";
import InputDropdown from "./InputDropdown";

export default function CameraProperties({
	cameraComponent,
}: {
	cameraComponent: CameraComponent;
}) {
	return (
		<>
			<div id="upper" className="p-2">
				<div id="type" className="flex">
					<p>Type</p>
					<div className="ml-auto">{/* <InputDropdown /> */}</div>
				</div>
			</div>
			<div className="w-full h-1 bg-[var(--background-secondary)]"></div>
		</>
	);
}
