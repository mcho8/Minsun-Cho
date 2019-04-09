
/*
let num = 60;
let mx = [];
let my = [];

function setup() {
  createCanvas(720, 400);
  noStroke();
  fill(255, 153);
  for (let i = 0; i < num; i++) {
    mx.push(i);
    my.push(i);
  }
}

function draw() {
  background(237, 34, 93);

  // Cycle through the array, using a different entry on each frame.
  // Using modulo (%) like this is faster than moving all the values over.
  let which = frameCount % num;
  mx[which] = mouseX;
  my[which] = mouseY;

  for (let i = 0; i < num; i++) {
    // which+1 is the smallest (the oldest in the array)
    let index = (which + 1 + i) % num;

    //ellipse(mx[index], my[index], i, i);
  }
}
*/
//-------------------------------------------------------------

let data;
let img;

var angleX = 1.4;
var angleY = 0;

var cols, rows;
var scl = 20;
var w = 1500;
var h = 800;
var flying = 0;

var terrain;
let word, word2, word3;

var cameraX = 0;
var cameraY = 0;
var cameraZ = 0;
var zoom = 0;

var m;
var seconds;
var duration;

var divW;
//var divH;

function setup() {
  //createCanvas(1430, 790, WEBGL);
  createCanvas(windowWidth, windowHeight, WEBGL);//**
  divW = 1430/windowWidth;
  //divH = 790/windowHeight;

  cameraZ = (height / 2.0) / tan(PI * 30.0 / 180.0);

  //img = loadImage("photoEdit.jpg");
  img = loadImage("photoEditv2.jpg");

  cols = w / scl;
  rows = h / scl;

  terrain = [];
  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
  }

  data = new Array(cols);
  for (var i = 0; i < data.length; i++) {
    data[i] = 0;
  }


  m = millis();
  seconds = duration = 0;

  word = createGraphics(1000, 1000);
  word.background(255);
  word.fill(0, 68, 102);
  word.textStyle(BOLD);
  word.textAlign(LEFT);
  word.textSize(50);
  //word.text('HOW FRAGILE WE ARE', 10, 50);
  //word.text('HOW ARE WE AFFECTED BY OTHERS', 10, 110);

  word2 = createGraphics(1000, 1000);
  word2.textAlign(LEFT);
  word2.fill(0, 68, 102); // fontcolor
  word2.textSize(150);
  word2.translate(100, 0, 5);

  word3 = createGraphics(2000, 2000);
  //word3.background(250); //transparent
  word3.fill(0, 68, 102);
  word3.textStyle(BOLD);
  word3.textAlign(LEFT);
  word3.textSize(15);
  word3.text('WAVE2. GREENERY FLOW - v2. 19', 3, 1920);
  word3.text('INTERACTION BY TOUCHPAD / MOUSE', 1715, 1920);
  word3.strokeWeight(2);
  word3.stroke(0, 68, 102);
  word3.line(0, 1890, 2000, 1890); //1970
}

function draw() {
  if (mouseIsPressed) {
    seconds = (millis() - m) / 1000;
    if (seconds > 100) {
      seconds = 0;
    }
  } else {
    m = millis();
    seconds = duration;
  }

  word2.background(255);
  word2.text(int(seconds), 10, 110);

  camera(cameraX, cameraY, cameraZ, 0, 0, 0, 0, 1, 0);

  //var colorx = map(mouseX, 0, width, 30, 190);
  //var colory = map(mouseY, 0, height, 30, 190);
  var rectline = map(mouseX, 0, width, 10, 50);
  var backcolor2 = map(mouseY, 0, width, 150, 255);

  background(255); // upperSide

  push();
  rotate(-0.06);
  fill(220, backcolor2);
  //fill(246,217,29,backcolor2);//fill(42,193,173,100);
  rect(-1900, 40, 3700, 1800); //baseGrey
  pop();

  stroke(255, 204, 204, rectline);
  //rect(11, 330, 2, 2); //centerPoint
  fill(255, 204, 204, rectline); //pinkRectangular
  rect(-80, -60, 150, 150);

  wave(); //waveFunctionActivate

  rotateX((-PI / 2.2) - (cameraY / 700)); // -angleX
  rotateY((cameraX / 1700));
  texture(word2); //timer
  translate(-400, -550, -5);
  plane(500, 500);

  texture(word); //message
  translate(220, 0, 5);
  plane(500, 500);

  texture(word3); //GREENERY FLOW
  translate(920, -50);
  plane(2700, 2700);

}

function wave() {

  var px = int(map(mouseX, 0, width, 0, cols));
  var dy = 1 * (pmouseY - mouseY);

  if (px > 0 && px < data.length) {

    data[px] += dy;

  }
  for (var i = 0; i < data.length - 1; i++) {
    data[i] *= 0.999;
  }
  data[data.length - 1] *= 0.999;

  //var xoff = 0;
  var xoff = (map(mouseX, 0, width, 0, cols) / 10);
  for (var x = cols - 1; x >= 0; x--) {
    //flying += 0.00005;
    if (mouseIsPressed) {
      flying += 0;
    } else {
      flying += 0.00009;
    }
    var yoff = flying;
    for (var y = rows - 1; y >= 0; y--) {
      if (y > 0) {
        terrain[x][y] = terrain[constrain(x, 0, cols - 1)][y - 1];
      } else {
        //var size = 1 * (pmouseY - mouseY);
        //terrain[x][y] = map(noise(xoff, yoff), 0, 1, -(seconds * 20) - 1, (seconds * 20) + 200 + size);
        terrain[x][y] = data[x] + map(noise(xoff, yoff), 0, 1, -(seconds * 20) - 1, (seconds * 20) + 200);
      }
      yoff += 0.1;
      //yoff += data[y + 20]; //?//
    }
    xoff += 0.1;

  }

  translate((width / 2) - (width / 2), (height / 2) - (height / 2.5));
  rotateX(PI / 2.2);
  rotateY(0);
  scale((0.6 + zoom)/divW);
  translate(-w / 2, -h / 2);

  for (var y = 0; y < rows - 1; y++) {
    texture(img);
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols - 1; x++) {
      vertex((x) * scl, y * scl, terrain[x][y], map(x, 0, cols, 0, 1), map(y, 0, rows, 0, 1));
      vertex((x) * scl, (y + 1) * scl, terrain[x][y + 1], map(x, 0, cols, 0, 1), map(y + 1, 0, rows, 0, 1));
      vertex((x + 1) * scl, (y + 1) * scl, terrain[x + 1][y + 1], map(x + 1, 0, cols, 0, 1), map(y + 1, 0, rows, 0, 1));
      vertex((x + 1) * scl, (y) * scl, terrain[x + 1][y], map(x + 1, 0, cols, 0, 1), map(y, 0, rows, 0, 1));
      vertex((x) * scl, (y) * scl, terrain[x][y], map(x, 0, cols, 0, 1), map(y, 0, rows, 0, 1));
    }
    endShape();
  }

  // if(keyIsPressed === true){
  //  save('GreeneryFlow2.jpg');
  // }

//   if(keyIsPressed === true){
//   if (key === 's') {
//     saveCanvas('GreeneryFlowV2', 'jpg');
//   }
// }

}

function keyTyped() {
  if (key === 's') {
    saveCanvas('GreeneryFlowV2', 'jpg');
  }

}

function keyPressed() {

  if (keyCode === UP_ARROW & cameraY > -300) {
    cameraY -= 40;
    zoom -= 0.01;
  } else if (keyCode === DOWN_ARROW & cameraY < 80) {
    cameraY += 40;
    zoom += 0.01;
  }
  if (keyCode === LEFT_ARROW & cameraX > -200) {
    cameraX -= 40;
    zoom += 0.1;
  } else if (keyCode === RIGHT_ARROW & cameraX < 80) {
    cameraX += 40;
    zoom -= 0.1;
  }
}

// function mouseMoved() {
//   var px = (map(mouseX, 0, width, 0, cols)); //position
//   var dy = 3 * (pmouseY - mouseY); //quantity (wave depth)
//
//   if (px > 0 && px < data.length) {
//     data[px] += dy;
//   }
//   for (var i = 1; i < 50; i++) {
//     if (px - i >= 0) {
//       data[px - i] += dy / (i + 1);
//     }
//     if (px + i < data.length) {
//       data[px + i] += dy / (i + 1);
//     }
//   }
//   for (var i = 0; i < data.length - 1; i++) {
//     data[i] *= 0.9;
//   }
//   data[data.length - 1] *= 0.9;
// }
