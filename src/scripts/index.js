import p5 from "p5";
import typeface from "../assets/fonts/BlackSla.otf";

new p5((sketch) => {
  let dragging = null;
  let type;
  let textures = [];
  let quads = [];
  let cols = 4;
  let rows = 2;
  let letters = ["H", "I", "E", "B", "D", "R"];
  let fontSize = 480;
  let vertices = [];

  sketch.preload = () => {
    type = sketch.loadFont(typeface);
  };

  const createTexture = (char) => {
    let graphics = sketch.createGraphics(
      sketch.width / cols,
      sketch.height / rows
    );
    graphics.fill(0, 106, 219);
    graphics.textFont(type);
    graphics.textAlign(graphics.CENTER, graphics.CENTER);
    graphics.textSize(fontSize);
    graphics.text(char, graphics.width / 2, graphics.height / 2);
    return graphics;
  };

  const setupQuads = () => {
    let w = sketch.width / 2;
    let h = sketch.height / 2;
    let stepX = sketch.width / cols;
    let stepY = sketch.height / rows;

    vertices = Array(cols + 1)
      .fill()
      .map(() =>
        Array(rows + 1)
          .fill()
          .map(() => [0, 0])
      );

    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        vertices[i][j] = [i * stepX - w, j * stepY - h];
      }
    }

    quads = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let quad = {
          vertices: [
            ...vertices[i][j],
            ...vertices[i + 1][j],
            ...vertices[i + 1][j + 1],
            ...vertices[i][j + 1],
          ],
        };
        quads.push(quad);
      }
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
    sketch.background(0, 106, 219);

    // Create textures for each character
    letters.forEach((char) => textures.push(createTexture(char)));

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
      sketch.quad(...quad.vertices);
    });
    sketch.pop();

    sketch.fill(7, 0, 40);
    let pulse = sketch.map(sketch.sin(sketch.frameCount * 0.05), -1, 1, 36, 48);
    for (let i = 1; i < cols; i++) {
      for (let j = 1; j < rows; j++) {
        sketch.ellipse(vertices[i][j][0], vertices[i][j][1], pulse, pulse);
      }
    }

    let nearHandle = false;
    for (let i = 1; i < cols; i++) {
      for (let j = 1; j < rows; j++) {
        let vx = sketch.width / 2 + vertices[i][j][0];
        let vy = sketch.height / 2 + vertices[i][j][1];
        if (sketch.dist(sketch.mouseX, sketch.mouseY, vx, vy) < 18) {
          nearHandle = true;
        }
      }
    }
    sketch.cursor(nearHandle ? sketch.HAND : sketch.ARROW);

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
    for (let i = 1; i < cols; i++) {
      for (let j = 1; j < rows; j++) {
        let vx = sketch.width / 2 + vertices[i][j][0];
        let vy = sketch.height / 2 + vertices[i][j][1];
        if (sketch.dist(sketch.mouseX, sketch.mouseY, vx, vy) < 18) {
          dragging = { i, j };
          return;
        }
      }
    }
  };

  sketch.mouseDragged = () => {
    if (dragging) {
      vertices[dragging.i][dragging.j] = [
        sketch.mouseX - sketch.width / 2,
        sketch.mouseY - sketch.height / 2,
      ];
      // Update the vertices of the affected quads
      let di = dragging.i;
      let dj = dragging.j;
      if (di > 0 && dj > 0) {
        let qi = (di - 1) * rows + (dj - 1);
        quads[qi].vertices = [
          ...vertices[di - 1][dj - 1],
          ...vertices[di][dj - 1],
          ...vertices[di][dj],
          ...vertices[di - 1][dj],
        ];
      }
      if (dj > 0) {
        let qi = di * rows + (dj - 1);
        quads[qi].vertices = [
          ...vertices[di][dj - 1],
          ...vertices[di + 1][dj - 1],
          ...vertices[di + 1][dj],
          ...vertices[di][dj],
        ];
      }
      if (di > 0) {
        let qi = (di - 1) * rows + dj;
        quads[qi].vertices = [
          ...vertices[di - 1][dj],
          ...vertices[di][dj],
          ...vertices[di][dj + 1],
          ...vertices[di - 1][dj + 1],
        ];
      }
      let qi = di * rows + dj;
      quads[qi].vertices = [
        ...vertices[di][dj],
        ...vertices[di + 1][dj],
        ...vertices[di + 1][dj + 1],
        ...vertices[di][dj + 1],
      ];
    }
  };

  sketch.mouseReleased = () => {
    dragging = null;
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
    setupQuads();
  };
});
