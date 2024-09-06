import React, { useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

export default function InputDropdown({
	options,
	selected,
	setSelected,
}: {
	options?: string[];
	selected: string;
	setSelected: (val: string) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative flex flex-col items-center w-32">
			<button
				onClick={() => setIsOpen((prev: boolean) => !prev)}
				className="bg-white bg-opacity-50 text-black pl-1 rounded-md w-full p-0.5 flex items-center border-2 border-transparent hover:border-white hover:text-white"
			>
				{selected.charAt(0).toUpperCase() + selected.slice(1)}
				{isOpen ? <FaCaretUp className="ml-auto" /> : <FaCaretDown className="ml-auto" />}
			</button>

			{isOpen && (
				<ul className="absolute mt-8 bg-white bg-opacity-50 rounded-md">
					{options?.map((option: string, index: number) => (
						<li
							key={index}
							onClick={() => {
								setIsOpen(false);
								setSelected(option);
							}}
							className=" text-black w-32 p-1 cursor-pointer hover:text-white hover:border-white border-2 border-transparent hover:rounded-md"
						>
							{option.charAt(0).toUpperCase() + option.slice(1)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
