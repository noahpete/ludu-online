import * as ld from "./src";

const app = new ld.Application();

// camera
let camera = new ld.Entity("camera");
camera.addComponentByType("camera");
camera.setRotation(0, 0, 0);
camera.setPosition(0, 1, 4);

camera.addUpdateCallback((dt) => {
	let speed = 0.004;

	if (ld.Input.getKey("w")) {
		let dir = camera.worldTransform.forward;
		camera.move(-speed * dt * dir.x, -speed * dt * dir.y, -speed * dt * dir.z);
	}

	if (ld.Input.getKey("s")) {
		let dir = camera.worldTransform.forward;
		camera.move(speed * dt * dir.x, speed * dt * dir.y, speed * dt * dir.z);
	}

	if (ld.Input.getKey("a")) {
		let dir = camera.worldTransform.right;
		camera.move(-speed * dt * dir.x, -speed * dt * dir.y, -speed * dt * dir.z);
	}

	if (ld.Input.getKey("d")) {
		let dir = camera.worldTransform.right;
		camera.move(speed * dt * dir.x, speed * dt * dir.y, speed * dt * dir.z);
	}

	// mouse controls
	if (ld.Input.getMouseButton(1) && ld.Input.getMouseDeltaX()) {
		camera.move(ld.Input.getMouseDeltaX() * -0.0004 * dt, 0, 0);
	}

	if (ld.Input.getMouseButton(1) && ld.Input.getMouseDeltaY()) {
		camera.move(0, ld.Input.getMouseDeltaY() * 0.0004 * dt, 0);
	}

	if (ld.Input.getMouseDeltaX()) {
		camera.rotate(0, ld.Input.getMouseDeltaX() * -0.005 * dt, 0);
	}
});

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

app.start();
