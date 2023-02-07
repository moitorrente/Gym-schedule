const day = 31;
const ids = [
  "2",
  "3",
  "4",
  "8",
  "9",
  "10",
  "12",
  "13",
  "14",
  "15",
  "17",
  "19",
  "20",
  "22",
  "24",
  "26",
  "27",
  "29",
  "31",
  "33",
  "34",
];

function setup() {
  createCanvas(750, 200);
  pixelDensity(10);

  strokeWeight(0);
  fill(255, 255, 255);
  stroke(37, 99, 235);
  strokeWeight(20);
  rect(0, 0, 750, 200, 20);
  strokeWeight(0);
  stroke(0);
  noStroke();

  for (let i = 0; i < 7; i++) {
    for (let j = 0; i + j * 7 < 365; j++) {
      fill(219, 234, 254);
      // if(i+ j *7  < day) fill(255,0,122);
      ids.forEach((id) => {
        if (id == i + j * 7 + 1) fill(37, 99, 235);
      });

      rect(13 * j + 40, 13 * i + 80, 12, 12, 3);
    }
  }

  //Titulo año
  textStyle(BOLD);

  fill(219, 234, 254);
  rect(40, 20, 100, 40, 20);
  strokeWeight(7);
  textSize(32);
  fill(37, 99, 235);
  text("2023", 55, 50);

  //Días
  textSize(18);
  fill(108, 117, 125);
  text("21", 480, 35);

  strokeWeight(2);
  textSize(14);
  textStyle(NORMAL);

  text("Días", 475, 55);

  //Asistencia
  textStyle(BOLD);

  textSize(18);
  fill(108, 117, 125);
  text("61%", 570, 35);

  strokeWeight(2);
  textSize(14);
  textStyle(NORMAL);

  text("Asistencia", 555, 55);

  //Racha
  textStyle(BOLD);

  textSize(18);
  fill(108, 117, 125);
  text("4", 670, 35);

  strokeWeight(2);
  textSize(14);
  textStyle(NORMAL);

  text("Racha", 655, 55);
    save("mySVG.jpg"); // give file name

}

function draw() {
  // background(220);
}
//Mensual

const day = 31;
const ids = [
  "2",
  "3",
  "4",
  "8",
  "9",
  "10",
  "12",
  "13",
  "14",
  "15",
  "17",
  "19",
  "20",
  "22",
  "24",
  "26",
  "27",
  "29",
  "31",
  "33",
  "34",
];

function setup() {
  createCanvas(200, 200);
  pixelDensity(10);

  strokeWeight(0);
  fill(255, 255, 255);
  stroke(37, 99, 235);
  strokeWeight(20);
  rect(0, 0, 200, 200, 20);
  strokeWeight(0);
  stroke(0);
  noStroke();

  for (let i = 0; i < 7; i++) {
    for (let j = 0; i + j * 7 < 31; j++) {
      fill(219, 234, 254);
      // if(i+ j *7  < day) fill(255,0,122);
      ids.forEach((id) => {
        if (id == i + j * 7 + 1) fill(37, 99, 235);
      });

      rect(16 * j + 62, 16 * i + 65, 15, 15, 3);
    }
  }

  //Titulo año
  textStyle(BOLD);

  fill(219, 234, 254);
  rect(40, 22, 120, 30, 20);
  strokeWeight(7);
  textSize(16);
  fill(37, 99, 235);
  text("Enero 2023", 58, 42);

  //Días
  textSize(18);
  fill(108, 117, 125);
  text("21", 480, 35);

  strokeWeight(2);
  textSize(14);
  textStyle(NORMAL);

  text("Días", 475, 55);

  //Asistencia
  textStyle(BOLD);

  textSize(18);
  fill(108, 117, 125);
  text("61%", 570, 35);

  strokeWeight(2);
  textSize(14);
  textStyle(NORMAL);

  text("Asistencia", 555, 55);

  //Racha
  textStyle(BOLD);

  textSize(18);
  fill(108, 117, 125);
  text("4", 670, 35);

  strokeWeight(2);
  textSize(14);
  textStyle(NORMAL);

  text("Racha", 655, 55);
    save("mySVG.jpg"); // give file name

}

function draw() {
  // background(220);
}
