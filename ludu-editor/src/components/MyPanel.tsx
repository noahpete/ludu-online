import React from "react";

export default function MyPanel({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<div className="w-full h-full bg-[var(--background-primary)]">
			<div className="bg-[var(--background-secondary)]">
				<h1 className="text-[var(--text-light)] font-bold p-2">{title}</h1>
			</div>
			<div className="text-sm">{children}</div>
		</div>
	);
}
