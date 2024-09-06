import React, { useContext, useEffect, useState } from "react";
import MyPanel from "./MyPanel";
import GameContext from "src/contexts/GameContext";

import * as ld from "ludu-engine";
import TransformProperties from "./TransformProperties";
import CameraProperties from "./CameraProperties";
import { CameraComponent, TransformComponent } from "ludu-engine/src/scene/components";

export default function Properties() {
	const context = useContext(GameContext);

	useEffect(() => {}, []);

	return (
		<MyPanel title="PROPERTIES">
			<div className="text-[var(--text-light)]">
				{context?.selectedEntity?.components.map((component, index) => {
					switch (component.type) {
						case "transform":
							return (
								<TransformProperties
									key={index}
									transformComponent={component as TransformComponent}
									hasScale={!component.parent.hasComponentType("camera")}
								/>
							);

						case "camera":
							return (
								<CameraProperties key={index} cameraComponent={component as CameraComponent} />
							);

						default:
							break;
					}
				})}
			</div>
		</MyPanel>
	);
}
