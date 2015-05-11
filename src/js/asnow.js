var requestAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


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

    (function() {
     function snow(){

          var self = {};
	        var canvas = null;
          var context = null;
          var bufferCanvas = null;
          var bufferCanvasContext = null;
          var flakeArray = [];
          var flakeTimer = null;
          var maxFlakes = 50;
          var animateStart;

          function Flake(){
               //The Math.random() function returns a floating-point, pseudo-random number in the range [0, 1)
               this.x = Math.round(Math.random() * context.canvas.width);
               //console.log(this.x);
               this.y = -10;
               this.drift = Math.random()*2 - 1;
               this.speed = Math.round(Math.random() * 1 + 1);
               this.width = (Math.random() * 3) + 2;
               this.height = this.width;
          }



          function oval(context, x, y, r)
               {
                   context.save();
                   context.beginPath();
                   context.translate(x, y);
                   context.arc(0, 0, r, 0, 2*Math.PI, false);
                   context.closePath();
                   context.restore();
               }

          self.init = function(){
          	canvas = document.getElementById("canvas2");
               context = canvas.getContext("2d");
               canvas.width = window.innerWidth;
               canvas.height = window.innerHeight;
               self.start();               
          }

          self.start = function(){
            flakeTimer = setInterval(addFlake, 1000);
            Draw();
            animateStart = requestAnimFrame(animate);

          }

          self.stop = function(){
            window.cancelAnimFrame(animateStart);
            clearInterval(flakeTimer);
            blank();

          }

          function Update(){
               for(var i = 0; i < flakeArray.length; i ++){
                    if (flakeArray[i].y < context.canvas.height){
                         flakeArray[i].y += flakeArray[i].speed;
                         if (flakeArray[i].y + flakeArray[i].width > context.canvas.height){
                              flakeArray[i].y = -10;
                         }
                    }

                    if (flakeArray[i].x < context.canvas.width){
                         flakeArray[i].x += flakeArray[i].drift;
                         if(flakeArray[i].x > context.canvas.width){
                              flakeArray[i].x = 10;
                         }
                    }
               }
          }

          function Draw(){
               context.save();
               blank();
               //add snow 
               for (var i = 0; i < flakeArray.length; i++) {
     
                    oval(context, flakeArray[i].x, flakeArray[i].y, flakeArray[i].width);
                    context.fillStyle = "#ffffff";
                    context.shadowBlur=10;
                    context.globalAlpha = 0.8;
                    context.shadowColor="#ffffff";

                    context.fill();
                    //console.log(flakeArray[i]);
               };

               context.restore();
          }

          function addFlake(){
               flakeArray[flakeArray.length] = new Flake();
               if (flakeArray.length >= maxFlakes){
                    clearInterval(flakeTimer);
               }
          }

          function blank(){
               context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          }

          function animate(){
               Update();
               Draw();
               animateStart = requestAnimFrame(animate);
          }

          return self;
     }

     window.snow = snow;

})();

(function(){

  var button = document.getElementById("snow-toggle");
  var body = document.getElementById('content');
  var s = snow();
  s.init();

  button.addEventListener("click", function(e){

    if(this.value == "stop-snow"){
      s.stop();
      this.value = "start-snow";
      this.innerHTML = "Start Snow";
      body.classList.add("sunny");
    } else {
      s.start();
      this.value = "stop-snow";
      this.innerHTML = "Stop Snow";
      body.classList.remove("sunny");
    }
  })

})();



