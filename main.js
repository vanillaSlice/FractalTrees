/*
 * Elements 
 */

const controls = document.querySelector('.controls');
const depthControl = controls.querySelector('#depth');
const angleControl = controls.querySelector('#angle');
const rootLengthControl = controls.querySelector('#root-length');
const shorterChildControl = controls.querySelector('#shorter-child');
const rootWeightControl = controls.querySelector('#root-weight');
const thinnerChildControl = controls.querySelector('#thinner-child');
const rootColourControl = controls.querySelector('#root-colour');
const multiColouredControl = controls.querySelector('#multi-coloured');
const scaleControl = controls.querySelector('#scale');
const resetContol = controls.querySelector('.reset');
const closeControlsButton = controls.querySelector('.close');

/*
 * Properties 
 */
const backgroundColour = [0, 0, 11.8];
const minDepth = 1;
const maxDepth = 15;
const defaultDepth = 11;
const minAngle = 0;
const maxAngle = 360;
const defaultAngle = 30;
const minRootLength = 1;
const maxRootLength = 200;
const defaultRootLength = 170;
const lengthMultiplier = 0.75; // used to determine child branch length
const defaultShorterChild = true;
const minRootWeight = 1;
const maxRootWeight = 30;
const defaultRootWeight = 1;
const weightMultiplier = 0.9; // used to determine child branch weight
const defaultThinnerChild = true;
const defaultRootColour = '#ff81e6';
const defaultMultiColoured = true;
const hueMultiplier = 0.75; // used to determine child branch colour
const minScale = 0.1;
const maxScale = 2;
const defaultScale = 1;
let controlsOpen = true;

/*
 * Functions 
 */

function setup() {
  createCanvas(innerWidth, innerHeight);
  colorMode(HSL);
  angleMode(DEGREES);
  drawTree();
}

const drawTree = debounce(() => {
  background(backgroundColour);
  translate(width / 2, height);
  scale(parseFloat(scaleControl.value));
  const currentDepth = 0;
  const maxDepth = parseInt(depthControl.value);
  const angle = parseInt(angleControl.value);
  const length = parseInt(rootLengthControl.value);
  const shorterChild = shorterChildControl.checked;
  const weight = parseInt(rootWeightControl.value);
  const thinnerChild = thinnerChildControl.checked;
  const [hue, saturation, lightness] = hexToHsl(rootColourControl.value);
  const multiColoured = multiColouredControl.checked;
  branch(currentDepth, maxDepth, angle, length, shorterChild,
    weight, thinnerChild, hue, saturation, lightness, multiColoured);
}, 100);

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    const context = this;
    const args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  }
}

function hexToHsl(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}

function branch(currentDepth, maxDepth, angle, length, shorterChild, weight,
  thinnerChild, hue, saturation, lightness, multiColoured) {
  strokeWeight(weight);
  stroke(hue, saturation, lightness);
  line(0, 0, 0, -length);
  translate(0, -length);
  if (currentDepth < maxDepth - 1) {
    currentDepth++;
    if (shorterChild) {
      length *= lengthMultiplier;
    }
    if (thinnerChild) {
      weight *= weightMultiplier;
    }
    if (multiColoured) {
      hue *= hueMultiplier;
    }
    push();
    rotate(angle);
    branch(currentDepth, maxDepth, angle, length, shorterChild, weight,
      thinnerChild, hue, saturation, lightness, multiColoured);
    pop();
    push();
    rotate(-angle);
    branch(currentDepth, maxDepth, angle, length, shorterChild, weight,
      thinnerChild, hue, saturation, lightness, multiColoured);
    pop();
  }
}

function updateDepth() {
  if (depthControl.value < minDepth) {
    depthControl.value = minDepth;
  } else if (depthControl.value > maxDepth) {
    depthControl.value = maxDepth;
  } else {
    depthControl.value = Math.round(depthControl.value);
  }
  drawTree();
}

function updateAngle() {
  if (angleControl.value < minAngle) {
    angleControl.value = minAngle;
  } else if (angleControl.value > maxAngle) {
    angleControl.value = maxAngle;
  } else {
    angleControl.value = Math.round(angleControl.value);
  }
  drawTree();
}

function updateRootLength() {
  if (rootLengthControl.value < minRootLength) {
    rootLengthControl.value = minRootLength;
  } else if (rootLengthControl.value > maxRootLength) {
    rootLengthControl.value = maxRootLength;
  } else {
    rootLengthControl.value = Math.round(rootLengthControl.value);
  }
  drawTree();
}

function updateRootWeight() {
  if (rootWeightControl.value < minRootWeight) {
    rootWeightControl.value = minRootWeight;
  } else if (rootWeightControl.value > maxRootWeight) {
    rootWeightControl.value = maxRootWeight;
  } else {
    rootWeightControl.value = Math.round(rootWeightControl.value);
  }
  drawTree();
}

function updateRootColour() {
  const validColour = /^#[0-9A-F]{6}$/i.test(rootColourControl.value);
  if (!validColour) {
    rootColourControl.value = defaultRootColour;
  }
  drawTree();
}

function updateScale() {
  if (scaleControl.value < minScale) {
    scaleControl.value = minScale;
  } else if (scaleControl.value > maxScale) {
    scaleControl.value = maxScale;
  }
  drawTree();
}

function reset() {
  depthControl.value = defaultDepth;
  angleControl.value = defaultAngle;
  rootLengthControl.value = defaultRootLength;
  shorterChildControl.checked = defaultShorterChild;
  rootWeightControl.value = defaultRootWeight;
  thinnerChildControl.checked = defaultThinnerChild;
  rootColourControl.value = defaultRootColour;
  multiColouredControl.checked = defaultMultiColoured;
  scaleControl.value = defaultScale;
  drawTree();
}

function closeControls() {
  if (controlsOpen) {
    const lastLi = controls.querySelector('ul li:last-child');
    controls.style.transform = `translateY(-${lastLi.offsetTop}px)`;
    closeControls.textContent = 'Open Controls';
  } else {
    controls.style.transform = 'translateY(0px)';
    closeControls.textContent = 'Close Controls';
  }
  controlsOpen = !controlsOpen;
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
  drawTree();
}

/*
 * Event listeners 
 */

depthControl.addEventListener('change', updateDepth);
angleControl.addEventListener('change', updateAngle);
rootLengthControl.addEventListener('change', updateRootLength);
shorterChildControl.addEventListener('change', drawTree);
rootWeightControl.addEventListener('change', updateRootWeight);
thinnerChildControl.addEventListener('change', drawTree);
rootColourControl.addEventListener('change', updateRootColour);
multiColouredControl.addEventListener('change', drawTree);
scaleControl.addEventListener('change', updateScale);
resetContol.addEventListener('click', reset);
closeControlsButton.addEventListener('click', closeControls);