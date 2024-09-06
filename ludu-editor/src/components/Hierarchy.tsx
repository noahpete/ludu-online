import React, { useContext, useEffect, useState } from "react";
import MyPanel from "./MyPanel";
import GameContext from "src/contexts/GameContext";

import * as ld from "ludu-engine";

export default function Hierarchy() {
	const context = useContext(GameContext);

	const traverseEntities = (entity: ld.Entity): any => {
		const children = entity.children;
	};

	useEffect(() => {
		if (!ld.Application?.activeScene?.root) return;
	}, []);

	return (
		<MyPanel title="HIERARCHY">
			<div className="text-[var(--text-light)] p-2">
				<ul>
					{ld.Application.activeScene?.root?.children.map((child, index) => {
						return (
							<li
								key={index}
								onClick={() => {
									context?.setSelectedEntity(child);
								}}
							>
								{child.name}
							</li>
						);
					})}
				</ul>
			</div>
		</MyPanel>
	);
}
