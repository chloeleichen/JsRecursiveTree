window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame    || 
  window.oRequestAnimationFrame      || 
  window.msRequestAnimationFrame     || 
  function(/* function */ callback, /* DOMElement */ element){
    window.setTimeout(callback, 1000 / 60);
  };
})();

function randomSign(num){
  if (Math.random() < 0.5) {
    return -num;
  } else{
    return num;
  } 
}

function constrainer(min, max) {
  return function(n) {
    return Math.max(min, Math.min(n, max));
  };
}


(function(){

  'use strict';
  var context = null;
  var width = null;
  var height = null;
  var addSnow = true;
  var maxSnowTheta = Math.PI*1/3;
  var timer;


  var forest = function(canvasId){
    self = {};

    self.init = function(){
      var canvas = document.getElementById(canvasId);
      context = canvas.getContext("2d");
      draw();  
      window.addEventListener("resize", function(){
        canvas.classList.add("resizing");
        timer && clearTimeout(timer);
        timer = setTimeout(reDraw, 300)         
      });
    }

  function reDraw(){
          context.clearRect(0,0, width, height);
          draw();
          canvas.classList.remove("resizing");
        }

    function draw(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;   
      width = canvas.width;
      height = canvas.height;
      // context.fillStyle = "#bdc3c7";
      // context.fillRect(0, 0, width, height);
      var cWidth = width < 500? width/2: 500;
      var t = tree(width/2, height, -(Math.PI/2), 10, cWidth);
      t.draw();
    }

    return self;

  }


  var tree = function(x1I, y1I, thetaI, branchWidth0I, totalBranchLengthI){
    var that = {};

    var nBranchDivisions = 50,
    percentBranchless = 0.3,
    branchSizeFraction = 0.5,
    dThetaGrowMax = Math.PI/36,
    dThetaSplitMax = Math.PI/6,
    oddsOfBranching = 0.25,  
    lengthSoFar = 0,
    nextSectionLength;

    that.x1 = x1I;
    that.y1 = y1I;
    that.x2 = x1I;
    that.y2 = y1I;
    that.theta = thetaI;
    that.branchWidth0 = branchWidth0I;
    that.branchWidth = that.branchWidth0;
    that.totalBranchLength = totalBranchLengthI;


    that.draw = function(){ 
      if (that.branchWidth < 0.5){
        lengthSoFar = that.totalBranchLength;
      }

      while(lengthSoFar < that.totalBranchLength){
        that.branchWidth = that.branchWidth0*(1-lengthSoFar/that.totalBranchLength);
        nextSectionLength = that.totalBranchLength/nBranchDivisions;
        lengthSoFar += nextSectionLength;
        that.theta += randomSign(dThetaGrowMax);
        that.x2 = that.x1 + nextSectionLength*Math.cos(that.theta);
        that.y2 = that.y1 + nextSectionLength*Math.sin(that.theta);
        context.save();
        context.strokeStyle = "#000000";
        context.beginPath();
        context.moveTo(that.x1,that.y1);
        context.lineTo(that.x2,that.y2);
        context.lineWidth = Math.abs(that.branchWidth); 
        context.lineCap = 'round';
        context.stroke();
        context.restore();

    //branch out 
    //cache variable
    var x3 = that.x1;
    var y3 = that.y1;
    var theta3 = that.theta+randomSign(dThetaSplitMax);
    var branchWidth3 = that.branchWidth;
    var totalBranchLength3 = that.totalBranchLength*branchSizeFraction;

    if(lengthSoFar/that.totalBranchLength > percentBranchless){
     if(Math.random() < oddsOfBranching){  
      var t3 = tree(x3, y3, theta3, branchWidth3, totalBranchLength3 ); 
      t3.draw();   
    }
  }

    // add snow 
     addSnow(that.x1, that.y1, that.x2, that.y2, that.theta, that.branchWidth);

     //update cordinates 
     that.x1 = that.x2;
     that.y1 = that.y2;
   }
 }

 function addSnow( x1, y1, x2, y2, theta, branchWidth){
       //Add some snow 
     if(addSnow){
      var dx = 0,
          dy = 0,
          overlapScaling = 1.2,
          xs1, xs2, ys1, ys2,
          constrain = constrainer(0,Math.abs(branchWidth)/2);

      if(theta < - Math.PI/2){
        if (Math.abs(Math.PI + theta) < maxSnowTheta){
          var snowThickness = constrain(Math.abs(branchWidth)/2*(1-Math.abs(theta+Math.PI)/Math.PI/2));
          dx = (Math.abs(branchWidth)-snowThickness)/2*Math.cos(theta+Math.PI/2)*overlapScaling;
          dy = (Math.abs(branchWidth)-snowThickness)/2*Math.sin(theta+Math.PI/2)*overlapScaling;
          

          xs1 = x1+dx-Math.abs(branchWidth)*Math.cos(theta)/4;
          ys1 = y1+dy-Math.abs(branchWidth)*Math.sin(theta)/4;
          xs2 = x2+dx;
          ys2 = y2+dy;
        }
      }

      if(theta > -Math.PI/2){
        if(Math.abs(theta) < maxSnowTheta ){
        var snowThickness = constrain(Math.abs(branchWidth)/2*(1-Math.abs(theta)/Math.PI/2));
        dx = (Math.abs(branchWidth)-snowThickness)/2*Math.cos(theta-Math.PI/2)*overlapScaling;
        dy = (Math.abs(branchWidth)-snowThickness)/2*Math.sin(theta-Math.PI/2)*overlapScaling;

        xs1 = x1+dx-Math.abs(branchWidth)*Math.cos(theta)/4;
        ys1 = y1+dy-Math.abs(branchWidth)*Math.sin(theta)/4;
        xs2 = x2+dx;
        ys2 = y2+dy;
        }
      }

  context.save();
  context.strokeStyle="#FFFFFF";
  context.lineWidth = snowThickness;
  context.beginPath();
  context.moveTo(xs1, ys1);
  context.lineTo(xs2,ys2);
  context.stroke();
  context.restore();

    }
 }

 return that;
}


window.forest = forest;
})();

var f = forest("canvas");
f.init();
