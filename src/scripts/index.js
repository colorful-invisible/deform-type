import p5 from "p5";
import typeface from "../assets/fonts/BlackSla.otf";

new p5((sketch) => {
  let dragging = null;
  let handleHovered = null;
  let type;
  let textures = [];
  let quads = [];
  let cols = 4;
  let letters = ["C", "O", "D", "E", "P", "O", "E", "T", "R", "Y"];
  let rows = Math.ceil(letters.length / cols);
  let fontSize = 360;
  let vertices = [];

  sketch.preload = () => {
    type = sketch.loadFont(typeface);
  };

  const createTexture = (char) => {
    let graphics = sketch.createGraphics(
      sketch.width / cols,
      sketch.height / rows
    );
    graphics.fill(180);
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

    // Initialize shared vertex grid
    vertices = [];
    for (let i = 0; i <= cols; i++) {
      vertices[i] = [];
      for (let j = 0; j <= rows; j++) {
        vertices[i][j] = {
          x: i * stepX - w,
          y: j * stepY - h,
        };
      }
    }

    // Create quads with vertex indices
    quads = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        quads.push({
          // Store indices to vertices
          v: [
            [i, j], // top-left
            [i + 1, j], // top-right
            [i + 1, j + 1], // bottom-right
            [i, j + 1], // bottom-left
          ],
        });
      }
    }
  };

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
    sketch.background(36);

    // Create textures for each character
    letters.forEach((char) => textures.push(createTexture(char)));

    setupQuads();
  };

  sketch.draw = () => {
    sketch.background(36);

    sketch.push();
    sketch.noStroke();
    quads.forEach((quad, index) => {
      if (index < textures.length) {
        sketch.texture(textures[index]);
      } else {
        sketch.noFill();
      }
      // Get current vertex positions from the grid
      let v0 = vertices[quad.v[0][0]][quad.v[0][1]];
      let v1 = vertices[quad.v[1][0]][quad.v[1][1]];
      let v2 = vertices[quad.v[2][0]][quad.v[2][1]];
      let v3 = vertices[quad.v[3][0]][quad.v[3][1]];
      sketch.quad(v0.x, v0.y, v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
    });
    sketch.pop();

    sketch.fill(0);
    let pulse = sketch.map(sketch.sin(sketch.frameCount * 0.05), -1, 1, 12, 24);
    // Draw handles at internal vertices (shared by 4 quads)
    for (let i = 1; i < cols; i++) {
      for (let j = 1; j < rows; j++) {
        sketch.ellipse(vertices[i][j].x, vertices[i][j].y, pulse, pulse);
      }
    }

    // Track handle hover state for cursor and drag
    handleHovered = null;
    let mouseXWebGL = sketch.mouseX - sketch.width / 2;
    let mouseYWebGL = sketch.mouseY - sketch.height / 2;
    for (let i = 1; i < cols; i++) {
      for (let j = 1; j < rows; j++) {
        if (
          sketch.dist(
            mouseXWebGL,
            mouseYWebGL,
            vertices[i][j].x,
            vertices[i][j].y
          ) < 50
        ) {
          handleHovered = { i, j };
          break;
        }
      }
      if (handleHovered) break;
    }

    // Update cursor - use grab/grabbing for better UX
    if (dragging !== null) {
      document.body.style.cursor = "grabbing";
    } else if (handleHovered) {
      document.body.style.cursor = "grab";
    } else {
      document.body.style.cursor = "default";
    }
  };

  sketch.mousePressed = () => {
    if (handleHovered) {
      dragging = { i: handleHovered.i, j: handleHovered.j };
    }
  };

  sketch.mouseDragged = () => {
    if (dragging !== null) {
      let deltaX = sketch.mouseX - sketch.pmouseX;
      let deltaY = sketch.mouseY - sketch.pmouseY;
      vertices[dragging.i][dragging.j].x += deltaX;
      vertices[dragging.i][dragging.j].y += deltaY;
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
