import React, { useEffect, useRef } from "react";
import * as ld from "ludu-engine";

export default function Viewport() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;

		const resizeCanvas = () => {
			if (canvas && container) {
				const width = container.clientWidth;
				const height = container.clientHeight;
				ld.Renderer.resize(width, height);
			}
		};

		// Initial resize
		resizeCanvas();

		// Create a ResizeObserver to watch the container for size changes
		const resizeObserver = new ResizeObserver(resizeCanvas);

		if (container) {
			resizeObserver.observe(container);
		}

		// Clean up
		return () => {
			if (container) {
				resizeObserver.unobserve(container);
			}
		};
	}, []);

	return (
		<div className="w-full h-full" ref={containerRef}>
			<canvas
				id="__APP__"
				ref={canvasRef}
				tabIndex={1}
				style={{
					outline: "none",
					width: "100%",
					height: "100%",
				}}
			></canvas>
		</div>
	);
}
