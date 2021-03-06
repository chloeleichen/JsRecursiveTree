(function(){

  'use strict';
  var context = null;
  var contextReal;
  var width = null;
  var height = null;
  var addSnow = true;
  var maxSnowTheta = Math.PI*1/3;
  var timer;
  var nBranchDivisions;
  //var nTrees = 1;


  var forest = function(canvasId){
    self = {};

    self.init = function(){
      var canvasReal = document.getElementById(canvasId),
          convas = document.createElement('canvas');
      context = canvas.getContext("2d");
      contextReal = canvas.getContext("2d");
      draw();
      setTimeout(function(){
        canvas.classList.remove("loading");
      }, 300);
    }

    function draw(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;   
      width = canvas.width;
      height = canvas.height;
      //var ts = [];
      var cWidth = width < 500? width/2: 500;
      var nBranchDivisions = cWidth/10;
      // for (var i = 0; i < nTrees; i ++){
      //   ts[i] = tree((i+1)*width/(nTrees+1), height, -(Math.PI/2), 10, cWidth, randomSign(0.03));
      //   ts[i].draw();
      // }
      var t = tree(width/2, height, -(Math.PI/2), 10, cWidth, randomSign(0.03));
      t.draw();
      render();
    }

    function render(){
      contextReal.drawImage(canvas, 0, 0);
    }

    return self;

  }

  var tree = function(x1I, y1I, thetaI, branchWidth0I, totalBranchLengthI,dThetaGrowMaxI){
    var that = {};

    var percentBranchless = 0.3,
        branchSizeFraction = 0.5,
        // dThetaGrowMax = Math.PI/36,
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
    that.dThetaGrowMax = dThetaGrowMaxI,


    that.draw = function(){ 
      if (that.branchWidth < 0.7){
        lengthSoFar = that.totalBranchLength;
      }

      while(lengthSoFar < that.totalBranchLength){
        that.branchWidth = that.branchWidth0*(1-lengthSoFar/that.totalBranchLength);
        nextSectionLength = that.totalBranchLength/nBranchDivisions;
        lengthSoFar += nextSectionLength;
        that.theta += randomSign(that.dThetaGrowMax);
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
    var dThetaGrowMax3 = Math.PI/36;

    if(lengthSoFar/that.totalBranchLength > percentBranchless){
     if(Math.random() < oddsOfBranching){  
      var t3 = tree(x3, y3, theta3, branchWidth3, totalBranchLength3, dThetaGrowMax3); 
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
