import * as ld from "./src";

const app = new ld.Application();

let camera = new ld.Entity("camera");
camera.addComponentByType("camera");
camera.setRotation(0, 0, 0);
camera.setPosition(0, 0, 4);

camera.addUpdateCallback((dt) => {
	if (ld.Input.getMouseButton(1) && ld.Input.getMouseDeltaX()) {
		camera.move(ld.Input.getMouseDeltaX() * -0.0004 * dt, 0, 0);
	}

	if (ld.Input.getMouseButton(1) && ld.Input.getMouseDeltaY()) {
		camera.move(0, ld.Input.getMouseDeltaY() * 0.0004 * dt, 0);
	}
});

let cube = new ld.Entity("cube");
cube.addComponentByType("model", { type: "cube" });
cube.setRotation(0, 0, 0);

cube.addUpdateCallback((dt) => cube.rotate(0.01 * dt, 0.02 * dt, 0));

cube.addUpdateCallback((dt) => {
	if (ld.Input.getKey("a")) {
		cube.move(-0.001 * dt, 0 * dt, 0 * dt);
	}

	if (ld.Input.getKey("d")) {
		cube.move(0.001 * dt, 0 * dt, 0 * dt);
	}
});

let light = new ld.Entity("light");
light.addComponentByType("light", { type: "point", color: new ld.Vector3(0.4, 0.4, 0.8) });
light.setPosition(-3, 0, 2);

let light2 = new ld.Entity("light2");
light2.addComponentByType("light", { type: "point", color: new ld.Vector3(0.4, 0.4, 0.4) });
light2.setPosition(3, 0, 2);

app.start();
