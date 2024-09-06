import React, { useCallback, useEffect, useState } from "react";

export default function InputSlider({
	text,
	value,
	setValue,
	bgColor,
	rate = 0.01,
}: {
	text: string;
	value: number;
	setValue: (value: number) => void;
	bgColor: string;
	rate: number;
}) {
	// Adapted from https://codesandbox.io/p/sandbox/drag-number-input-z2rnj?file=%2Fsrc%2FApp.js%3A21%2C1

	const [snapshot, setSnapshot] = useState(value);
	const [startVal, setStartVal] = useState(0);

	useEffect(() => {
		const onUpdate = (event: MouseEvent) => {
			if (startVal) {
				setValue(parseFloat((snapshot + rate * (event.clientX - startVal)).toFixed(2)));
			}
		};

		const onEnd = () => {
			setStartVal(0);
		};

		document.addEventListener("mousemove", onUpdate);
		document.addEventListener("mouseup", onEnd);

		return () => {
			document.removeEventListener("mousemove", onUpdate);
			document.removeEventListener("mouseup", onEnd);
		};
	}, [startVal, setValue, snapshot]);

	const onStart = useCallback(
		(event: React.MouseEvent) => {
			setStartVal(event.clientX);
			setSnapshot(value);
		},
		[value]
	);

	const onInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			// Parse and round to 2 decimal places before setting the value
			const parsedValue = parseFloat(parseFloat(event.target.value).toFixed(2));
			setValue(isNaN(parsedValue) ? 0 : parsedValue);
		},
		[setValue]
	);

	return (
		<div className="flex m-0.5">
			<span
				className={`ml-auto ${bgColor} px-2 text-center cursor-ew-resize select-none rounded-l-md`}
				onMouseDown={onStart}
			>
				<p>{text}</p>
			</span>
			<input
				className="w-12 text-black text-center bg-white bg-opacity-50 rounded-r-md hover:text-white border-2 border-transparent hover:border-white"
				value={value.toFixed(2)}
				onChange={onInputChange}
			/>
		</div>
	);
}
