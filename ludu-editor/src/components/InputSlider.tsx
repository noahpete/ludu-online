import React, { useCallback, useEffect, useState } from "react";

export default function InputSlider({
	text,
	value,
	setValue,
	bgColor,
}: {
	text: string;
	value: number;
	setValue: (value: number) => void;
	bgColor: string;
}) {
	const [snapshot, setSnapshot] = useState(value);
	const [startVal, setStartVal] = useState(0);

	useEffect(() => {
		const onUpdate = (event: MouseEvent) => {
			if (startVal) {
				const rate = 0.1;
				setValue(snapshot + rate * (event.clientX - startVal));
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
		(event: React.ChangeEvent<HTMLInputElement>) => setValue(parseFloat(event.target.value)),
		[]
	);

	return (
		<div className="flex">
			<span
				className={`ml-auto ${bgColor} w-6 text-center cursor-ew-resize select-none`}
				onMouseDown={onStart}
			>
				<p>{text}</p>
			</span>
			<input className="w-8 text-black text-center" value={value} onChange={onInputChange} />
		</div>
	);
}
