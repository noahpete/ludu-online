import * as ld from "./src";

const app = new ld.Application();

let camera = new ld.Entity("camera");
camera.addComponentByType("camera");
camera.setRotation(0, 0, 0);
camera.setPosition(0, 0, 4);

let cube = new ld.Entity("cube");
cube.addComponentByType("model", { type: "cube" });
cube.setRotation(0, 0, 0);

cube.addUpdateCallback((dt) => cube.rotate(0.0 * dt, 0.01 * dt, 0));

let light = new ld.Entity("light");
light.addComponentByType("light", { type: "point", color: new ld.Vector3(0.4, 0.4, 0.8) });
light.setPosition(-3, 0, 2);

let light2 = new ld.Entity("light2");
light2.addComponentByType("light", { type: "point", color: new ld.Vector3(0.8, 0.4, 0.4) });
light2.setPosition(3, 0, 2);

// let light3 = new ld.Entity("light3");
// light3.addComponentByType("light", { type: "point" });
// light3.setPosition(-1.1, 0, -1.1);

app.start();
