import p5 from "p5";
import typeface from "../assets/fonts/BlackSla.otf";

new p5((sk) => {
  let draggedHandle = null;
  let hoveredHandle = null;
  let font;
  let textures = [];
  let gridVertices = [];

  const cols = 4;
  const letters = ["D", "E", "F", "O", "R", "M", "T", "Y", "P", "E"];
  const rows = Math.ceil(letters.length / cols);
  const fontSize = 360;
  const handleSize = 24;

  sk.preload = () => {
    font = sk.loadFont(typeface);
  };

  const createTexture = (char) => {
    const graphics = sk.createGraphics(sk.width / cols, sk.height / rows);
    graphics.fill(180);
    graphics.textFont(font);
    graphics.textAlign(graphics.CENTER, graphics.CENTER);
    graphics.textSize(fontSize);
    graphics.text(char, graphics.width / 2, graphics.height / 2);
    return graphics;
  };

  const setupGrid = () => {
    const stepX = sk.width / cols;
    const stepY = sk.height / rows;
    const offsetX = sk.width / 2;
    const offsetY = sk.height / 2;

    gridVertices = [];
    for (let col = 0; col <= cols; col++) {
      gridVertices[col] = [];
      for (let row = 0; row <= rows; row++) {
        gridVertices[col][row] = {
          x: col * stepX - offsetX,
          y: row * stepY - offsetY,
        };
      }
    }
  };

  sk.setup = () => {
    sk.createCanvas(sk.windowWidth, sk.windowHeight, sk.WEBGL);
    letters.forEach((char) => textures.push(createTexture(char)));
    setupGrid();
  };

  sk.draw = () => {
    sk.background(36);

    // Draw textured quads
    sk.noStroke();
    let textureIndex = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (textureIndex < textures.length) {
          sk.texture(textures[textureIndex]);
          const topLeft = gridVertices[col][row];
          const topRight = gridVertices[col + 1][row];
          const bottomRight = gridVertices[col + 1][row + 1];
          const bottomLeft = gridVertices[col][row + 1];
          sk.quad(
            topLeft.x,
            topLeft.y,
            topRight.x,
            topRight.y,
            bottomRight.x,
            bottomRight.y,
            bottomLeft.x,
            bottomLeft.y
          );
        }
        textureIndex++;
      }
    }

    // Draw handles
    sk.fill(0);
    const pulse = sk.map(sk.sin(sk.frameCount * 0.05), -1, 1, 12, 24);
    for (let col = 1; col < cols; col++) {
      for (let row = 1; row < rows; row++) {
        const vertex = gridVertices[col][row];
        sk.ellipse(vertex.x, vertex.y, pulse, pulse);
      }
    }

    // Update hovered handle
    hoveredHandle = null;
    const mouseX = sk.mouseX - sk.width / 2;
    const mouseY = sk.mouseY - sk.height / 2;
    for (let col = 1; col < cols; col++) {
      for (let row = 1; row < rows; row++) {
        const vertex = gridVertices[col][row];
        if (sk.dist(mouseX, mouseY, vertex.x, vertex.y) < handleSize) {
          hoveredHandle = { col, row };
          break;
        }
      }
      if (hoveredHandle) break;
    }

    // Update cursor
    if (draggedHandle) {
      document.body.style.cursor = "grabbing";
    } else if (hoveredHandle) {
      document.body.style.cursor = "grab";
    } else {
      document.body.style.cursor = "default";
    }
  };

  sk.mousePressed = () => {
    if (hoveredHandle) {
      draggedHandle = { col: hoveredHandle.col, row: hoveredHandle.row };
    }
  };

  sk.mouseDragged = () => {
    if (draggedHandle) {
      const deltaX = sk.mouseX - sk.pmouseX;
      const deltaY = sk.mouseY - sk.pmouseY;
      gridVertices[draggedHandle.col][draggedHandle.row].x += deltaX;
      gridVertices[draggedHandle.col][draggedHandle.row].y += deltaY;
    }
  };

  sk.mouseReleased = () => {
    draggedHandle = null;
  };

  sk.windowResized = () => {
    sk.resizeCanvas(sk.windowWidth, sk.windowHeight);
    setupGrid();
  };
});
