//https://medium.com/@jamischarles/what-is-debouncing-2505c0648ff1
//We use debouncing to do a quick pinch click interaction
//We wait for a few milliseconds before "clicking" / pinching
//This helps with noisy input, like losing tracking of the fingers

let handpose;
let video;
let predictions = [];
let pinchTimeout;
let pinchStarted = false;
//let randColor;
//let randImg;
const timeToWait = 400; // 设置等待时间为 400 毫秒
let doo, re, mi, fa;

function preload(){
  //加载声音
  doo = loadSound("do.mp3");
  re = loadSound("re.mp3");
  mi = loadSound("mi.mp3");
  fa = loadSound("fa.mp3");

}

function setup() {
  createCanvas(880, 660); // 创建一个画布
  video = createCapture(VIDEO); // 创建一个视频捕捉对象
  video.size(1640, 880); // 设置视频捕捉对象的宽度和高度

  handpose = ml5.handpose(video, modelReady); // 创建手部识别模型

  // 设置当新的手势被检测到时，将其保存在全局变量 "predictions" 中
  handpose.on("predict", results => {
    predictions = results;
  });

  // 隐藏视频元素，只显示画布
  video.hide();

  //randColor = pickRandomColor(); // 随机选择一个颜色

}

function modelReady() {
  console.log("Model ready!"); // 手势识别模型已准备就绪
}

function draw() {
  background(255,10);
  // image(video, 0, 0, width, height); // 在画布上绘制视频帧

  // 绘制所有关键点和骨架
  drawKeypoints();
  doPinch();
}

// 执行捏合操作
function doPinch() {
  if(predictions.length > 0){ // 如果检测到手势
    for (let i = 0; i < predictions.length; i += 1) {
      const prediction = predictions[i];
      // 获取拇指和食指
      const indexF = prediction.annotations.indexFinger[3];
      const thumb = prediction.annotations.thumb[3];
      //获取中指，无名指，小指
      const middleF = prediction.annotations.middleFinger[3];
      const ringF = prediction.annotations.ringFinger[3];
      const pinky = prediction.annotations.pinky[3];


      // 绘制拇指和食指的圆形
      fill(54, 60, 81);
      noStroke();
      ellipse(indexF[0], indexF[1], 20, 20);//拇指
      fill(143, 179, 173);
      ellipse(thumb[0], thumb[1], 20, 20);
      fill(255, 215, 110);
      ellipse(middleF[0], middleF[1], 20, 20);
      fill(255, 177, 117);
      ellipse(ringF[0], ringF[1], 20, 20);
      fill(255, 122, 106);
      ellipse(pinky[0], pinky[1], 20, 20);

      // 每个手指由一个包含四组 xyz 坐标的数组表示，例如：
      // x -> thumb[0]
      // y -> thumb[1]
      // z -> thumb[2]
      // 获取拇指和食指之间的距离
      let pinchDist = dist(thumb[0], thumb[1],indexF[0], indexF[1]);//拇指和食指之间的距离
      let pinchDist2 = dist(middleF[0], middleF[1],thumb[0], thumb[1]);//拇指和中指之间的距离
      let pinchDist3 = dist(ringF[0], ringF[1],thumb[0], thumb[1]);//拇指和无名指之间的距离
      let pinchDist4 = dist(pinky[0], pinky[1],thumb[0], thumb[1]);//拇指和小指之间的距离
      console.log(thumb);
      // 摄像头的 z 位置有些嘈杂，但是这个值可以将距离与 z 位置进行比较
      let zOffset = map(thumb[2],20,-50,20,100);
      let zOffset2 = map(middleF[2],20,-150,20,120);
      let zOffset3 = map(ringF[2],20,-50,20,100); 
      let zOffset4 = map(pinky[2],20,-50,20,100);
      //console.log(zOffset,thumb[2] );

      //食指拇指捏合的pin在这里调用
      if( pinchDist < zOffset){ // 如果拇指和食指距离小于阈值，则认为捏合开始
        pinchStarted = true;
        if(pinchTimeout) clearTimeout(pinchTimeout); //如果 pinchTimeout 已经存在，则清除该计时器
        
        // 绘制捏合时的事
        // let index = Math.floor(random(images.length));
        // image(images[index], 20, 20, 1007/10, 1316/10);

      }else if(pinchStarted){ //如果手指距离大于阈值且 pinchStarted 为 true，则认为捏合结束
        pinchStarted = false; //设置 pinchStarted 为 false
        
        //start pinch timeout on release of fingers
        pinchTimeout = window.setTimeout(pinch,timeToWait);
        console.log("click");
      }

      //中指拇指捏合的pin在这里调用
      if( pinchDist2 < zOffset2){ // 如果拇指和食指距离小于阈值，则认为捏合开始
        pinchStarted = true;
        if(pinchTimeout) clearTimeout(pinchTimeout); //如果 pinchTimeout 已经存在，则清除该计时器
        
        // 绘制捏合时的事
        //

      }else if(pinchStarted){ //如果手指距离大于阈值且 pinchStarted 为 true，则认为捏合结束
        pinchStarted = false; //设置 pinchStarted 为 false
        
        //start pinch timeout on release of fingers
        pinchTimeout = window.setTimeout(pinch2,timeToWait);
        console.log("click");
      }

      //无名指拇指捏合的pin在这里调用
      if( pinchDist3 < zOffset3){ // 如果拇指和食指距离小于阈值，则认为捏合开始
        pinchStarted = true;
        if(pinchTimeout) clearTimeout(pinchTimeout); //如果 pinchTimeout 已经存在，则清除该计时器
        
        // 绘制捏合时的事
        //

      }else if(pinchStarted){ //如果手指距离大于阈值且 pinchStarted 为 true，则认为捏合结束
        pinchStarted = false; //设置 pinchStarted 为 false
        
        //start pinch timeout on release of fingers
        pinchTimeout = window.setTimeout(pinch3,timeToWait);
        console.log("click");
      }

      //小指拇指捏合的pin在这里调用
      if( pinchDist3 < zOffset4){ // 如果拇指和食指距离小于阈值，则认为捏合开始
        pinchStarted = true;
        if(pinchTimeout) clearTimeout(pinchTimeout); //如果 pinchTimeout 已经存在，则清除该计时器
        
        // 绘制捏合时的事
        //

      }else if(pinchStarted){ //如果手指距离大于阈值且 pinchStarted 为 true，则认为捏合结束
        pinchStarted = false; //设置 pinchStarted 为 false
        
        //start pinch timeout on release of fingers
        pinchTimeout = window.setTimeout(pinch4,timeToWait);
        console.log("click");
      }
      
    }

  }else{
    // 在手部跟踪丢失时，设置 pinchStarted 为 false
    //clear our click if we lose tracking of hand
    pinchStarted = false;
    if(pinchTimeout) clearTimeout(pinchTimeout);
  }
}

//食指
function pinch(){
  //do something more interesting here
  // 当捏合动作结束时，触发 pinch() 函数，这个函数可以用来实现一些更有趣的操作
  doo.play();
  //randColor = pickRandomColor();
}

//中指
function pinch2(){
  re.play();
}

//无名指
function pinch3(){
  mi.play();
}

//小指
function pinch4(){
  fa.play();
}

function pickImg(){
  let index = Math.floor(random(images.length));
  image(images[index], 20, 20, 1007/10, 1316/10);
}

// A function to draw ellipses over the detected keypoints
//该函数用于在检测到的关键点上绘制椭圆形，以可视化显示手部跟踪
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(255);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}
