import p5 from "p5";
import typeface from "../assets/fonts/BlackSla.otf";

new p5((sketch) => {
  let dragging = false;
  let type;
  let textures = [];
  let quads = [];

  sketch.preload = () => {
    type = sketch.loadFont(typeface);
  };

  const createTexture = (char) => {
    let graphics = sketch.createGraphics(sketch.width / 2, sketch.height);
    graphics.fill(0, 106, 219);
    // graphics.translate(0, -graphics.height / 8);
    graphics.textFont(type);
    graphics.textAlign(graphics.CENTER, graphics.CENTER);
    let fontSize = Math.min(graphics.width, graphics.height);
    graphics.textSize(fontSize * 1.25);
    graphics.text(char, graphics.width / 2, graphics.height / 2);
    return graphics;
  };

  const setupQuads = () => {
    let w = sketch.width / 2;
    let h = sketch.height / 2;

    // Define coordinates
    quads = [
      { vertices: [-w, -h, 0, -h, 0, 0, -w, 0], centralIndex: 4 }, // Top-left quad
      { vertices: [0, -h, w, -h, w, 0, 0, 0], centralIndex: 6 }, // Top-right quad
      { vertices: [-w, 0, 0, 0, 0, h, -w, h], centralIndex: 2 }, // Bottom-left quad
      { vertices: [0, 0, w, 0, w, h, 0, h], centralIndex: 0 }, // Bottom-right quad
    ];
  };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
    sketch.background(0, 106, 219);

    // Create textures for each character
    const chars = ["Z", "O", "O"];
    chars.forEach((char) => textures.push(createTexture(char)));

    console.log(textures);

    setupQuads();
  };

  sketch.draw = () => {
    sketch.background(38, 153, 0);

    sketch.push();
    sketch.noStroke();
    quads.forEach((quad, index) => {
      if (index < textures.length) {
        sketch.texture(textures[index]);
      } else {
        sketch.noFill();
      }

      sketch.quad(
        quad.vertices[0],
        quad.vertices[1],
        quad.vertices[2],
        quad.vertices[3],
        quad.vertices[4],
        quad.vertices[5],
        quad.vertices[6],
        quad.vertices[7]
      );
    });
    sketch.pop();

    let centerX = sketch.width / 2 + quads[0].vertices[quads[0].centralIndex];
    let centerY =
      sketch.height / 2 + quads[0].vertices[quads[0].centralIndex + 1];

    sketch.fill(0);
    sketch.ellipse(
      quads[0].vertices[quads[0].centralIndex],
      quads[0].vertices[quads[0].centralIndex + 1],
      36,
      36
    );

    if (sketch.dist(sketch.mouseX, sketch.mouseY, centerX, centerY) < 18) {
      sketch.cursor(sketch.HAND);
    } else {
      sketch.cursor(sketch.ARROW);
    }

    // sketch.push();
    // sketch.fill(255); // Bright color for visibility
    // sketch.textFont(type);
    // sketch.textSize(48); // Large enough size for visibility
    // sketch.textAlign(sketch.CENTER, sketch.CENTER); // Center alignment might help
    // sketch.text(
    //   "DRAG ME",
    //   quads[0].vertices[quads[0].centralIndex],
    //   quads[0].vertices[quads[0].centralIndex + 1]
    // ); // Position at center for testing
    // sketch.pop();
  };

  sketch.mousePressed = () => {
    let ccx = sketch.width / 2 + quads[0].vertices[4];
    let ccy = sketch.height / 2 + quads[0].vertices[5];
    if (sketch.dist(sketch.mouseX, sketch.mouseY, ccx, ccy) < 18) {
      dragging = true;
    }
  };

  sketch.mouseDragged = () => {
    if (dragging) {
      let newCCX = sketch.mouseX - sketch.width / 2;
      let newCCY = sketch.mouseY - sketch.height / 2;
      quads.forEach((quad) => {
        quad.vertices[quad.centralIndex] = newCCX;
        quad.vertices[quad.centralIndex + 1] = newCCY;
      });
    }
  };

  sketch.mouseReleased = () => {
    dragging = false;
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    setupQuads();
  };
});
