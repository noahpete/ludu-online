import React, { useCallback, useEffect, useState } from "react";
import InputSlider from "./InputSlider";

export default function TransformComponent({}: {}) {
	// Adapted from https://codesandbox.io/p/sandbox/drag-number-input-z2rnj?file=%2Fsrc%2FApp.js%3A21%2C1
	const [xPos, setXPos] = useState(0);

	return (
		<div className="">
			<div className="p-2">
				<div className="outline outline-1 outline-[var(--background-secondary)] flex pl-2">
					<p>Position</p>
					<div className="ml-auto">
						<InputSlider text="x" value={xPos} setValue={setXPos} bgColor="bg-red-500" />
					</div>
				</div>
			</div>
			<div className="w-full h-1 bg-[var(--background-secondary)]"></div>
		</div>
	);
}
