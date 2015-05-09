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


(function(){

  //'use strict';
  var context = null;
  var width = null;
  var height = null;


  var forest = function(canvasId){
    self = {};

    self.init = function(){
      var canvas = document.getElementById(canvasId);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context = canvas.getContext("2d");
      width = canvas.width;
      height = canvas.height;
      var t = tree(Math.random()*width, height, -(Math.PI/2), 10, 500);
      t.draw();
    }
  return self;

  }


var tree = function(x1I, y1I, thetaI, branchWidth0I, totalBranchLengthI){
  var that = {};

    var nBranchDivisions = 50,
        percentBranchless = 0.3,
        branchSizeFraction = 0.5,
        dThetaGrowMax = Math.PI/15,
        dThetaSplitMax = Math.PI/6,
        oddsOfBranching = 0.3,  
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
    context.strokeStyle = "#000000";
    context.beginPath();
    context.moveTo(that.x1,that.y1);
    context.lineTo(that.x2,that.y2);
    context.lineWidth = Math.abs(that.branchWidth); 
    context.lineCap = 'round';
    context.stroke();

    x3 = that.x1;
    y3 = that.y1;
    theta3 = that.theta+randomSign(dThetaSplitMax);
    branchWidth3 = that.branchWidth;
    totalBranchLength3 = that.totalBranchLength*branchSizeFraction;

    if(lengthSoFar/that.totalBranchLength > percentBranchless){
       if(Math.random() < oddsOfBranching){  
        t3 = tree(x3, y3, theta3, branchWidth3, totalBranchLength3 ); 
        t3.draw();   
       }
     }
    that.x1 = that.x2;
    that.y1 = that.y2;
    }
  }

return that;
}


window.forest = forest;
})();

var f = forest("canvas");
f.init();
