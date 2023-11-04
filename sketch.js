
const colorItRand = controlColor();
const controlIt = controlSphere();
let sphereRadius;
let prevClicked = {x:null, y:null};
let spheresList = []

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  // select('canvas').position(windowWidth/2 - 200, windowHeight/2 - 200);
  ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1000);
  angleMode(DEGREES);
  sphereRadius = min(width/10, height/10);
  ellipseMode(CENTER);
}

function draw() {
  clear();
  background(20);
  fill(...colorItRand());
  drawSpheres();
}

function drawSpheres() {
  push();
  controlIt(width / 2 - sphereRadius, height / 2 - sphereRadius);
  sphere(sphereRadius, 15, 15);
  pop();
  if (prevClicked.x != null && prevClicked.y != null) {
    fill(255);
    translate(prevClicked.x, prevClicked.y, 0);
    sphere(sphereRadius/4, 50, 50);
  }
}




/**
 * Description
 * @returns {void}
 */
function controlSphere() {
  let position = {x:0, y:0};
  let dir = {x: 1, y: 1}; 
  let speed = {x: 10, y: 20};
  
  return function controlIt(maxDistHor = 0, maxDistVer = 0) {
    let inc = deltaTime / 60;

    /**
     * 
     * @returns [detectHorBound, detectVerBound]
     */
    function detectBound() {
      function detectHorBound() {
        if (!(position['x'] <= maxDistHor)) {
          return [null, true];
        }
        if (!(position['x'] >= (maxDistHor) * -1)) {
          return [true, null];
        }
        return [null, null];
      }
      function detectVerBound() {
        if (!(position['y'] <= maxDistVer)) {
          return [null, true];
        }
        if (!(position['y'] >= (maxDistVer) * -1)) {
          return [true, null];
        }
        return [null, null];
      }
      return [detectHorBound, detectVerBound];
    }
    const [hor, ver] = detectBound();
    
    /**
     * Description
     * @param {Boolean} clear
     * @returns {[prevClicked.x, prevClicked.y]}
    */
   function detectClick(clear) {
     function deleteClickHistory() {
       prevClicked['x'] = null;
       prevClicked['y'] = null;
      }
      
      let result;
      function clearAndReturn() {
        result = [prevClicked['x'], prevClicked['y']];
        if(clear){
          deleteClickHistory();
        }
        return result;
      }
      
      return clearAndReturn();
    }
    
    
    function setSpeed() {
      let xDist = Math.abs(position['x'] - prevClicked['x'] );
      let yDist = Math.abs(position['y'] - prevClicked['y'] );
      
      let totalDist = Math.sqrt(xDist ** 2 + yDist ** 2);
      
      let totalTime = totalDist * inc / 10;
      speed.x = xDist / totalTime;
      speed.y = yDist / totalTime;
    }
    
    function setDir() {
      dir.x = position.x - prevClicked.x > 0 ? -1 : 1;
      dir.y = position.y - prevClicked.y > 0 ? -1 : 1;
    }
    
    function boundAndShift() {
      setSpeed();
      setDir();
    }
    
    /**
     * Description
     * @param {[any, any]} touchHorizontal
     * @param {[any, any]} touchVertical
     * @returns {void}
    */
    function shiftBall(touchHorizontal, touchVertical) {
      if (touchHorizontal[0] == true) {
        if (detectClick()[0] != null) {
          boundAndShift();
          detectClick(clear);
        } else {
          dir.x = 1;
          speed.x = 10; //Hardcoded speed
        }
      } else if (touchHorizontal[1] == true) {
        if (detectClick()[0] != null) {
          boundAndShift();
          detectClick(clear);
        } else {
          dir.x = -1;
          speed.x = 10; //Hardcoded speed
        }
      }
      if (touchVertical[0] == true) {
        if (detectClick()[1] != null) {
          boundAndShift();
          detectClick(clear);
        } else {
          dir.y = 1;
          speed.y = 10; //Hardcoded speed
        }
      } else if (touchVertical[1] == true) {
        if (detectClick()[1] != null) {
          boundAndShift();
          detectClick(clear);
        } else {
          dir.y = -1;
          speed.y = 10; //Hardcoded speed
        }
      }
      position.x+= inc * dir.x * speed.x;
      position.y += inc * dir.y * speed.y;
    }
    shiftBall(hor(), ver())
    translate(position.x, position.y, 0);
  }
}

/**
 * Returns a function with some variables as closures to keep the 
 * color states persistent, it is basically a gradient color changer
 * that can be used to change color of any p5js shape at each new frame
 * during draw loop. At each iteration the RGB values are incremented by
 * fractions to make it seem smooth. 
 * @returns {function}
 */
function controlColor() {
  // Configuration settings
  let color = [50, 50, 50];
  let rInc = 33;
  let bInc = 66;
  let gInc = 99;
  let rIncDir = 1;
  let bIncDir = 1;
  let gIncDir = 1;
  let range = [0, 100] 
  // Only work till 0, 155. 1st should be less than 2nd + multiplier * 2
  
  /**
   * Returns the next color scheme for the shape, uses closed values set
   * above as a reference. The RGB values bounce between a set range + initial
   * values, the toggle direction function is the control function. while rest
   * of the logic is used to keep incrementing the colors by fractions.
   * @returns {array[3]}
   */
  return function colorIt() {
    let inc_one = millis() / 1000 % 1 + 1;
    
    // console.log(inc_one);
    
    let multiplier = Math.random() * 6 + 2;
    
    function toggleDirection(inc, dir) {
      if (inc >= range[1] - multiplier + 1 || (dir == -1 && inc <= range[0] + multiplier + 1)) {
        return dir * -1;
      }
      return dir;
    }
    
    rIncDir = toggleDirection(rInc, rIncDir);
    bIncDir = toggleDirection(bInc, bIncDir);
    gIncDir = toggleDirection(gInc, gIncDir);
    
    if (rIncDir == 1) {
      rInc = (rInc + inc_one * multiplier * Math.random())%range[1];
    } else {
      rInc = (rInc - inc_one * multiplier * Math.random())%range[1];
    }
    
    if (bIncDir == 1) {      
      bInc = (bInc + inc_one * multiplier * Math.random())%range[1];
    } else {
      bInc = (bInc - inc_one * multiplier * Math.random())%range[1];
    }

    if (gIncDir) {
      gInc = (gInc + inc_one * multiplier * Math.random())%range[1];
    } else {
      gInc = (gInc - inc_one * multiplier * Math.random())%range[1];
    }
    
    return [color[0] + rInc, color[1] + bInc, color[2] + gInc];
  }
}


/**
 * This function is called internally by p5.js when the browser
 * window is resized. It tries to change the sphere radius with change 
 * on size of window browser.
 * @returns {void}
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true);
  sphereRadius = min(width/10, height/10);
  ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1000);
}



/**
 * This function is called internally by p5.js when the browser window
 * is resized. It tries to change the global variable {prevClicked} to
 * the mouse clicked mouse position. As WEBGL uses the center of screen
 * as origin and the mouse clicks are recorded with origin as the left corner
 * a little bit adjustment is made here.
 * @returns {void}
 */
function mouseClicked() {
  prevClicked['x'] = mouseX - width/2;
  prevClicked['y'] = mouseY - height/2;
  prevClicked['x'] += mouseX - width/2 > 0 ? - sphereRadius / 4 : sphereRadius / 4;
  prevClicked['y'] += mouseY - height/2 > 0 ? - sphereRadius / 4 : sphereRadius / 4;
}