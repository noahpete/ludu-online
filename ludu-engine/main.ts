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
camera.setRotation(0, 0, 0);
camera.setPosition(130, 0, 360);
console.log(ld.Application.activeScene.root.getChildById(camera.id));

app.start();
