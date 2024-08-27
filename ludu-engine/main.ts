import * as ld from "./src";

const app = new ld.Application();

let camera = new ld.Entity("camera");
camera.addComponentByType("camera");
camera.setRotation(20, 0, 0);
camera.setPosition(0, 0, -3);

let cube = new ld.Entity("cube");
cube.addComponentByType("model", { type: "cube" });
// cube.setRotation(0, 0, 0);

let light = new ld.Entity("light");
light.addComponentByType("light", { type: "point" });
light.setPosition(0.5, 1, -2);

let light2 = new ld.Entity("light2");
light2.addComponentByType("light", { type: "point" });
light2.setPosition(-0.5, 1, -1);

app.start();
