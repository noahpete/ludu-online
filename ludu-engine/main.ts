import * as ld from "./src";

const app = new ld.Application();

// The goal: ////////////////////
// let camera = new ld.Entity("camera");
// camera.addComponent("camera", { clearColor: new ld.Vector4(0.8, 0.8, 0.8, 1.0) });
// camera.setPosition(0, 1, 3);

// let grid = new ld.GridModel();

// let quad = new ld.QuadModel();
/////////////////////////////////

let camera = new ld.Entity("camera");
camera.addComponentByType("camera");
camera.setRotation(20, 0, 0);
camera.setPosition(0, 0, -3);

let cube = new ld.Entity("cube");
cube.addComponentByType("model", { type: "cube" });
// cube.setRotation(0, 50, 0);

let light = new ld.Entity("light");
light.addComponentByType("light", { type: "point" });
light.setPosition(0.5, 1, -2);

app.start();
