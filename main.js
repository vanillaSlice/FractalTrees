let tree;
let angleOffset = 25;

function setup() {
  createCanvas(innerWidth, innerHeight);
  colorMode(HSL);
  angleMode(DEGREES);
  tree = Tree(0);
}

function draw() {
  background(0, 0, 11.8);
  tree.draw();
}

function Tree(maxDepth) {
  const root = Branch(innerWidth / 2, innerHeight - 50, 80, 0, 0, maxDepth, 8, [255, 70, 50]);
  return {
    draw: () => root.draw()
  };
}

function Branch(x, y, length, angle, depth, maxDepth, weight, colour) {
  const children = [];
  var x1 = x - (length * sin(angle))
  var y1 = y - (length * cos(angle))
  if (depth < maxDepth - 1) {
    colour = [...colour];
    colour[0] -= 22;
    console.log(colour);
    children.push(Branch(x1, y1, length - 5, angle - angleOffset, depth + 1, maxDepth, weight - 0.65,
      colour));
    children.push(Branch(x1, y1, length - 5, angle + angleOffset, depth + 1, maxDepth, weight - 0.65,
      colour));
  }
  var drawChild = child => child.draw();
  return {
    draw: () => {
      strokeWeight(weight);
      stroke(colour);
      line(x, y, x1, y1);
      children.forEach(drawChild);
    }
  };
}

const depth = document.querySelector('.depth');
depth.addEventListener('change', () => tree = Tree(depth.value));
depth.addEventListener('input', () => tree = Tree(depth.value));

const angle = document.querySelector('.angle');
angle.addEventListener('change', () => {
  angleOffset = parseInt(angle.value);
  tree = Tree(depth.value);
});
angle.addEventListener('input', () => {
  angleOffset = parseInt(angle.value);
  tree = Tree(depth.value);
});