import * as ld from "./src";

const app = new ld.Application();

let camera = new ld.Entity("camera");
camera.addComponent("camera", { clearColor: new ld.Vector4(0.8, 0.8, 0.8, 1.0) });
camera.setPosition(0, 1, 3);
// let cameraCtrl = new CameraController(camera);

let grid = new ld.GridModel();

let quad = new ld.QuadModel();

app.start();
