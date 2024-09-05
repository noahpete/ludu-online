import React, { useEffect, useState } from "react";
import ResizeHandle from "@/components/ResizeHandle";
import { Panel, PanelGroup } from "react-resizable-panels";
import Viewport from "@/components/Viewport";
import GameContext from "@/contexts/GameContext";

import * as ld from "ludu-engine";
import MyPanel from "@/components/MyPanel";
import Hierarchy from "@/components/Hierarchy";
import Properties from "@/components/Properties";

export default function App() {
	const [app, setApp] = useState<ld.Application | null>(null);
	const [selectedEntity, setSelectedEntity] = useState<ld.Entity | null>(null);

	useEffect(() => {
		const application = new ld.Application("__APP__");
		setApp(application);

		let camera = new ld.Entity("camera");
		camera.addComponentByType("camera");
		camera.setRotation(0, 0, 0);
		camera.setPosition(0, 1, 4);

		// cube
		let cube = new ld.Entity("cube");
		cube.addComponentByType("model", { type: "cube" });
		cube.setRotation(0, 0, 0);

		cube.addUpdateCallback((dt) => cube.rotate(0.01 * dt, 0.02 * dt, 0));

		// grid
		let grid = new ld.Entity("grid");
		grid.addComponentByType("model", { type: "grid" });
		grid.rotate(-90, 0, 0);
		grid.move(-5, 0, 5);
		grid.setScale(10.0, 10.0, 1.0);

		// lights
		let light = new ld.Entity("light");
		light.addComponentByType("light", { type: "point", color: new ld.Vector3(0.4, 0.4, 0.8) });
		light.setPosition(-3, 0, 2);

		let light2 = new ld.Entity("light2");
		light2.addComponentByType("light", { type: "point", color: new ld.Vector3(0.4, 0.4, 0.4) });
		light2.setPosition(3, 0, 2);

		application.start();

		return () => {};
	}, []);

	return (
		<GameContext.Provider value={{ app, setApp, selectedEntity, setSelectedEntity }}>
			<div className="w-full h-full">
				<PanelGroup direction="horizontal">
					<Panel defaultSize={80} order={1} collapsible>
						<PanelGroup direction="vertical">
							<Panel defaultSize={70} order={1}>
								<PanelGroup direction="horizontal">
									{/* Hierarchy */}
									<Panel defaultSize={25} order={1}>
										<Hierarchy></Hierarchy>
									</Panel>
									<ResizeHandle />

									{/* Viewport */}
									<Panel defaultSize={75} order={2}>
										<div className="w-full h-full bg-[var(--background-primary)]">
											<Viewport />
										</div>
									</Panel>
								</PanelGroup>
							</Panel>
							<ResizeHandle />

							{/* Browser */}
							<Panel defaultSize={30} order={2}>
								<div id="thing" className="h-full bg-[var(--background-primary)]"></div>
							</Panel>
						</PanelGroup>
					</Panel>
					<ResizeHandle />

					{/* Properties */}
					<Panel defaultSize={20} order={2}>
						<div id="right" className="h-full bg-[var(--background-primary)]">
							<Properties />
						</div>
					</Panel>
				</PanelGroup>
			</div>
		</GameContext.Provider>
	);
}
