import p5 from "p5";
import { mediaPipe } from "./mediaPipe";
import { initializeWebcamCapture } from "./cameraUtils";
import { getMappedLandmarks } from "./landmarksHandler";

new p5((sketch) => {
  let webcamFeed;

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
    sketch.background(255, 0, 0);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.textSize(300);

    webcamFeed = initializeWebcamCapture(sketch, mediaPipe);
  };

  sketch.draw = () => {
    sketch.push();
    sketch.scale(-1, 1);
    sketch.tint(0, 0, 255);
    sketch.image(
      webcamFeed,
      -webcamFeed.scaledWidth,
      0,
      webcamFeed.scaledWidth,
      webcamFeed.scaledHeight
    );
    sketch.pop();

    // Reference
    // https://developers.google.com/static/mediapipe/images/solutions/hand-landmarks.png

    const landmarksIndex = [0, 4, 8, 12, 16, 20];

    const landmarks = getMappedLandmarks(
      sketch,
      mediaPipe,
      webcamFeed,
      landmarksIndex
    );

    // LANDMARKS COORDINATES
    const wristX = landmarks.LM0X;
    const wristY = landmarks.LM0Y;
    const thumbX = landmarks.LM4X;
    const thumbY = landmarks.LM4Y;
    const indexX = landmarks.LM8X;
    const indexY = landmarks.LM8Y;
    const middleX = landmarks.LM12X;
    const middleY = landmarks.LM12Y;
    const ringX = landmarks.LM16X;
    const ringY = landmarks.LM16Y;
    const pinkyX = landmarks.LM20X;
    const pinkyY = landmarks.LM20Y;

    sketch.fill(255, 0, 0);
    sketch.noStroke();
    sketch.ellipse(indexX, indexY, 20, 20);

    const distanceTI = sketch.dist(thumbX, thumbY, indexX, indexY);
    if (distanceTI < 100) {
      sketch.fill(255);
      sketch.text("A", thumbX, thumbY);
    }
  };
});
