
const colorItRand = colorChange();
const translateIt = moveIt();
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
  translateIt(width / 2 - sphereRadius, height / 2 - sphereRadius);
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
function windowResized() {
  resizeCanvas(windowWidth, windowHeight, true);
  sphereRadius = min(width/10, height/10);
  ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1000);
}


function mouseClicked() {
  prevClicked['x'] = mouseX - width/2;
  prevClicked['y'] = mouseY - height/2;
  prevClicked['x'] += mouseX - width/2 > 0 ? - sphereRadius / 4 : sphereRadius / 4;
  prevClicked['y'] += mouseY - height/2 > 0 ? - sphereRadius / 4 : sphereRadius / 4;
}


/**
 * Description
 * @returns {void}
 */
function moveIt() {
  let position = {x:0, y:0};
  let dir = {x: 1, y: 1}; // 1 means right, 1 means down, -1 means left, -1 means up.
  //Normally, the direction vector should have equal magnitudes of pointers.
  let speed = {x: 10, y: 20}; // Sets the ball speed in horizontal and vertical direction
  
  return function translateIt(maxDistHor = 0, maxDistVer = 0) {
    let inc = deltaTime / 60;

    /**
     * Description
     * detectHorBound (function) @ returns [any, any]
     * [0] --> left
     * [1] --> right 
     * detectVerBound (function) @ returns [any, any]
     * [0] --> bottom
     * [1] --> up
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
     * @param {[any, any]} hor_result
     * @param {[any, any]} ver_result
     * @returns {void}
    */
    function shiftBall(hor_result, ver_result) {
      if (hor_result[0] == true) {
        if (detectClick()[0] != null) {
          boundAndShift();
          detectClick(clear);
        } else {
          dir.x = 1;
          speed.x = 10; //Hardcoded speed
        }
      } else if (hor_result[1] == true) {
        if (detectClick()[0] != null) {
          boundAndShift();
          detectClick(clear);
        } else {
          dir.x = -1;
          speed.x = 10; //Hardcoded speed
        }
      }
      if (ver_result[0] == true) {
        if (detectClick()[1] != null) {
          boundAndShift();
          detectClick(clear);
        } else {
          dir.y = 1;
          speed.y = 10; //Hardcoded speed
        }
      } else if (ver_result[1] == true) {
        if (detectClick()[1] != null) {
          boundAndShift();
          detectClick(clear);
        } else {
          dir.y = -1;
          speed.y = 10; //Hardcoded speed
        }
      }
      // console.log(inc, dir.x, speed.x, position.x, maxDistHor);
      // console.log(inc, dir.y, speed.y, position.y, maxDistVer);
      position.x+= inc * dir.x * speed.x;
      position.y += inc * dir.y * speed.y;
    }
    // console.log(setSlope());
    shiftBall(hor(), ver())
    // console.log(position.x, position.y, maxDistHor, maxDistVer);
    translate(position.x, position.y, 0);
  }
}

/**
 * Description
 * @returns {function}
 */
function colorChange() {
  // Configuration ( a lot of configuration )
  let color = [50, 50, 50];
  let rInc = 33;
  let bInc = 66;
  let gInc = 99;
  let rIncDir = 1;
  let bIncDir = 1;
  let gIncDir = 1;
  let range = [0, 100] // Only work till 0, 155. 1st should be less than 2nd + multiplier * 2

  /**
   * Description
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

    // console.log(color[0] + rInc, color[1] + bInc, color[2] + gInc);
    return [color[0] + rInc, color[1] + bInc, color[2] + gInc];
  }
}