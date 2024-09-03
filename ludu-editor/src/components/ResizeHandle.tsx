import { PanelResizeHandle } from "react-resizable-panels";

export default function ResizeHandle() {
	return (
		<PanelResizeHandle>
			<div className="bg-[var(--background-secondary)] h-full p-0.5"></div>
		</PanelResizeHandle>
	);
}
