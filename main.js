/*=================================
=            Variables            =
=================================*/

// Variables to hold value of X and Y coordinates of right wrist
var rightWristX = "";
var rightWristY = "";
var rightWristScore = "";

// Variable to create canvas to hold video
var canvas = "";

// Variable to create video to detect to show camera output
var video = "";

// Variable to integrate Posenet model
var poseNet = "";

// Variables to hold the X and Y coordinates of the paddel used by the player
var paddle2 =10,paddle1=10;
var paddle1X = 10,paddle1Height = 110;
var paddle2Y = 685,paddle2Height = 70;
var paddle1Y;

// Variables to hold the score of the player and computer
var score1 = 0, score2 =0;
var  playerscore =0;
var pcscore =0;

// Variable to code the ball
var ball = {
    x:350/2,
    y:480/2,
    r:20,
    dx:3,
    dy:3
}

// Variables to hold audio
var ball_touch_padel_audio = "";
var missed_audio = "";

/*======  End of Variables  ======*/


/*=================================
=          Loading Page           =
=================================*/

// Before the page loads
function preload()
{
  ball_touch_padel_audio = loadSound("ball_touch_padel.wav");
  missed_audio = loadSound("missed.wav");
}

// While the page loads
function setup(){
  canvas =  createCanvas(700,600);
  canvas.parent('canvas');

  video = createCapture(VIDEO);
  video.size(260,664);
  video.parent('game_console');

  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

// Function to confirm Posenet has been integrated in the website
function modelLoaded()
{
  console.log('Model Loaded!');
}

/*======  End of Loading Page ======*/


/*=================================
=             Posenet             =
=================================*/

//Function to initialize Posenet model
function gotPoses(results)
{
  if(results.length > 0)
  {
    console.log(results);
    rightWristX = results[0].pose.wrist.x;
    rightWristY = results[0].pose.wrist.y;
    rightWristScore = results[0].pose.keypoints[10].score;
    console.log("Right Wrist Score = " + rightWristScore);
  }
}

// Function to create boxes for Posenet model to detect body parts in
function draw(){

 background(0); 

 fill("black");
 stroke("black");
 rect(680,0,20,700);

 fill("black");
 stroke("black");
 rect(0,0,20,700);
 
   paddleInCanvas();
 
   fill(250,0,0);
   stroke(0,0,250);
   strokeWeight(0.5);
   paddle1Y = mouseY; 
   rect(paddle1X,paddle1Y,paddle1,paddle1Height,100);
   
   
    fill("#FFA500");
    stroke("#FFA500");
   paddle2y =ball.y-paddle2Height/2;  rect(paddle2Y,paddle2y,paddle2,paddle2Height,100);
    
    midline();
    
   drawScore();
   
   models();
   
    move();

    if(rightWristScore > 0.2)
    {
      fill(250,0,0);
      stroke(0,0,250);
      circle(rightWristX, rightWristY, 20);
    }
}

/*======  End of Posenet  ======*/

/*=================================
=         Start and Reset         =
=================================*/

// Function to reset the game
function reset(){
   ball.x = width/2+100,
   ball.y = height/2+100;
   ball.dx=3;
   ball.dy =3;
   
}

/*======  End of Start and Reset  ======*/


/*=================================
=             Display             =
=================================*/

// Function to draw the middle line of the game area
function midline(){
    for(i=0;i<480;i+=10) {
    var y = 0;
    fill("white");
    stroke(0);
    rect(width/2,y+i,10,480);
    }
}

// Function to create the area to show the score of the game
function drawScore(){
    textAlign(CENTER);
    textSize(20);
    fill("white");
    stroke(250,0,0)
    text("Player:",100,50)
    text(playerscore,140,50);
    text("Computer:",500,50)
    text(pcscore,555,50)
}

// Function to put models
function models(){
    textSize(18);
    fill(255);
    noStroke();
    text("Width:"+width,135,15);
    text("Speed:"+abs(ball.dx),50,15);
    text("Height:"+height,235,15)
}

// Function to put the paddles
function paddleInCanvas(){
  if(mouseY+paddle1Height > height){
    mouseY=height-paddle1Height;
  }
  if(mouseY < 0){
    mouseY =0;
  }  
}

/*======  End of Display  ======*/


/*=================================
=           Game Code             =
=================================*/

function move(){
  fill(50,350,0);
  stroke(255,0,0);
  strokeWeight(0.5);
  ellipse(ball.x,ball.y,ball.r,20)
  ball.x = ball.x + ball.dx;
  ball.y = ball.y + ball.dy;
  if(ball.x+ball.r>width-ball.r/2){
      ball.dx=-ball.dx-0.5;       
  }
 if (ball.x-2.5*ball.r/2< 0){
 if (ball.y >= paddle1Y&& ball.y <= paddle1Y + paddle1Height) {
   ball.dx = -ball.dx+0.5;
   playerscore++;
 }
 else{
   pcscore++;
   reset();
   navigator.vibrate(100);
 }
}
if(pcscore ==4){
   fill("#FFA500");
   stroke(0)
   rect(0,0,width,height-1);
   fill("white");
   stroke("white");
   textSize(25)
   text("Game Over!☹☹",width/2,height/2);
   text("Reload The Page!",width/2,height/2+30)
   noLoop();
   pcscore = 0;
}
  if(ball.y+ball.r > height || ball.y-ball.r <0){
      ball.dy =- ball.dy;
  }   
}

/*======  End of Game Code  ======*/