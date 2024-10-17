// -----------------------------------------------
// Experiment made in 2015 as a student.
// 
// Very improvable code. Do NOT take as reference.
// -----------------------------------------------

$(document).ready(function(){
	var canvas = $("#canvas")[0];
    var ctx = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height  = window.innerHeight;
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	
    
    function getRequestAnimationFrame() {
        return window.requestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.oRequestAnimationFrame ||
               window.msRequestAnimationFrame ||
               function (callback){window.setTimeout(enroute, 1000/60);};
    }
    
    var fpAnimationFrame = getRequestAnimationFrame();
    
    
    var txtpos = 50;
	
	var posx = w/2;
    var posy = h/2;
    
    var side = 50;
    var speed = 100;
    
	var kDOWN = false;
    var kUP = false;
    var kRIGHT = false;
    var kLEFT = false;

    var frames1 = 0;
    var frames2 = 0;
    var t1 = new Date().getTime();
    var t2 = new Date().getTime();
    var t3 = t1;
    var frameDuration=0;
    
    
    var ship = {
        x: (w/2)-500,
        y: (h/2)-400,
        rot: 0,
        accR: 3, // per second
        acc: 700, // per second
        velx: 300, // per second
        vely: 0, // per second
        pointsX: [30,-20,-20],
        pointsY: [0,+15,-15],
        
    };
    var planet1 = {
        x: w/2,
        y: h/2,
        r: (Math.random()*200)+10 
    };
    var fr = 0;
    var atm = planet1.r*4; //atm radius
    
    
    init();
	function init()	{
		ctx.shadowBlur=0;
        ctx.fillStyle = "#111111";
		ctx.fillRect(0, 0, w, h);
        
        fpAnimationFrame(paint);
	}
	
	function paint()
	{
        
        eraseCanvas();
        
        //FPS
        frames1++;
        t1= new Date().getTime();
        frameDuration=t1-t2;
        t2 = new Date().getTime();
        if((t1-t3)>1000){
            t3=t1;
            frames2=frames1;
            frames1=0;
        }
        
        
        updateShip(ship);
        
        //angle variation
        var sum = (Math.atan2(ship.vely,ship.velx))-(ship.rot);
        if(sum<= -(Math.PI)){
            sum+=2*Math.PI;
        }if(sum>=Math.PI){
            sum-=2*Math.PI;
        }
        // Gravity calculation
        var ang1 = Math.atan2((ship.y - planet1.y),(ship.x - planet1.x));
        var dist = (ship.y - planet1.y)/Math.sin(ang1);
        var gravity =  planet1.r *(planet1.r*20/dist)/100;
        
        //Friction calculation
        if( dist<(atm)){
            fr = (1-(dist-(planet1.r))/(atm-planet1.r));
        }else{fr=0}
        
        
        //AUTOROTACION
        if( dist<atm){
            ship.rot += (0.2*sum) * (1-(dist-(planet1.r))/(atm-planet1.r));
        }
        // console.log((1-(dist-(planet1.r))/(atm-planet1.r)));
        
        
        //FRICTION
        if( dist<(atm)){
            ship.velx *= (1-(0.009*fr));
            ship.vely *= (1-(0.009*fr)) ;
        }
        

        // Vel variation and colision
        if(dist>(planet1.r+10)){
            ship.velx -= Math.cos(ang1) *  gravity ;
            ship.vely -= Math.sin(ang1) *  gravity;
        }else{
            ship.x = planet1.x + (planet1.r+10)*Math.cos(ang1);
            ship.y = planet1.y + (planet1.r+10)*Math.sin(ang1);
        }
        
        
        
        //KEYS
        if(kUP){
            ship.velx += ship.acc*Math.cos(ship.rot)*frameDuration/1000;
            ship.vely += ship.acc*Math.sin(ship.rot)*frameDuration/1000;
        }
        if(kDOWN){
            ship.velx -= ship.acc*Math.cos(ship.rot)*frameDuration/1000;
            ship.vely -= ship.acc*Math.sin(ship.rot)*frameDuration/1000;
        }
        if(kRIGHT){
            ship.rot+=ship.accR*frameDuration/1000;
            //ship.rot += ship.accR*frameDuration/1000+(0.5*sum * ((Math.sqrt(Math.pow(ship.velx,2)+Math.pow(ship.velx,2)))/1000));
        }
        if(kLEFT){
            ship.rot-=ship.accR*frameDuration/1000;
            //ship.rot += -ship.accR*frameDuration/1000+(0.5*sum * ((Math.sqrt(Math.pow(ship.velx,2)+Math.pow(ship.velx,2)))/1000));
        }
        
        drawCircle(planet1.x,planet1.y,planet1.r);
        
        drawShip(ship);
        
		
        
        //TITLE
        ctx.shadowBlur=10;
        ctx.shadowColor='#555555';
        ctx.fillStyle = "#555555";
        ctx.textAlign = "left";
        ctx.font = "30px Arial";
        
        
        ctx.fillText("Gravity: "+Math.round(100*gravity)/100, 20,txtpos+30);
        ctx.fillText("AirFriction: "+ Math.round(100*fr)/100, 20,txtpos+60);
        
        ctx.textAlign = "center";
        ctx.font = "20px Arial";
        ctx.fillText("Use the keyboard to control the ship", w/2,50);
        ctx.fillText("Refresh to randomize the planet", w/2,70);
        showFPS(frames2);
        
        
        fpAnimationFrame(paint);
        
	}
	
	
    
    function showFPS(frames2){
        ctx.shadowBlur=10;
        ctx.shadowColor='#ffffff';
        ctx.fillStyle = "#888888";
        ctx.textAlign = "right";
        ctx.font = "15px Arial";
        ctx.fillText("   FPS: "+frames2,w-10,h-10);
    }
    
    function drawShip(ship){
        ctx.shadowBlur=10;
        ctx.shadowColor='white';
        ctx.beginPath();
        ctx.moveTo(ship.x+(ship.pointsX[0]*Math.cos(ship.rot)-ship.pointsY[0]*Math.sin(ship.rot)), ship.y+(ship.pointsX[0]*Math.sin(ship.rot)+ship.pointsY[0]*Math.cos(ship.rot)));
        for(i=1;i<ship.pointsX.length;i++){
            ctx.lineTo(ship.x+(ship.pointsX[i]*Math.cos(ship.rot)-ship.pointsY[i]*Math.sin(ship.rot)), ship.y+(ship.pointsX[i]*Math.sin(ship.rot)+ship.pointsY[i]*Math.cos(ship.rot)));
        }
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
    }
    function updateShip(ship){
        ship.x += ship.velx*frameDuration/1000;
        ship.y += ship.vely*frameDuration/1000;
        if(ship.rot>Math.PI){
            ship.rot-=2*Math.PI;
        }
        if(ship.rot< -(Math.PI)){
            ship.rot+=2*Math.PI;
        }
    }
    
    
    function counter(){
        frames2=frames1;
        frames1=0;
    }
    
	function readMouseMove(e){
        posx=e.clientX;
        posy=e.clientY;
    }
    
    function eraseCanvas(){
        ctx.shadowBlur=0;
        ctx.fillStyle = "#111111";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "#111111";
		ctx.strokeRect(0, 0, w, h);
    }
    function drawCircle(posx,posy,rad){
        //Draw circle
        ctx.shadowBlur=(atm);
        ctx.shadowColor='#ff9900';
        ctx.beginPath();
        ctx.arc(posx,posy,rad,0,2*Math.PI);
        ctx.fillStyle = '#ff9900';
        ctx.fill();
        //ctx.lineWidth = 5;
        //ctx.stroke();
    }
    
    
    
	//KEYBOARD CONTROL
	$(document).keydown(function(e){
		var key = e.which;
		if(key == "38") kUP = true;  //UP
        if(key == "40") kDOWN = true;  //DOWN
		if(key == "39") kRIGHT = true;  //RIGHT
        if(key == "37") kLEFT = true;   //LEFT
	})
    $(document).keyup(function(e){
		var key = e.which;
		if(key == "38") kUP = false;  //UP
        if(key == "40") kDOWN = false;  //DOWN
		if(key == "39") kRIGHT = false;  //RIGHT
        if(key == "37") kLEFT = false;   //LEFT
	})
	
	
})