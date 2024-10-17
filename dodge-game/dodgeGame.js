// -----------------------------------------------
// Experiment made in 2015 as a student.
// 
// Very improvable code. Do NOT take as reference.
// -----------------------------------------------y

$(document).ready(function(){
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
    
    
    canvas.width  = window.innerWidth;
    canvas.height  = window.innerHeight;
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	
    var fps = 60;
	
    var maxRad = 25;
    var minRad = 15;
    var minSpeed = 500;
    var maxSpeed = 1000;
    var speedMultiplier = 1.01;
    
    var initBalls = Math.round(w*10/1800);
    var numBalls = Math.round(w*15/1800);
    
    var pBall;
    var posx;
    var posy;
    var points = 0;
    var balls = [];

    var c1 = 0;
    var c2 = 0;
    
    var t1;
    var t2;
    var frameDuration = 0;
	
    
    document.onmousemove = readMouseMove;
    document.onmouseover = readMouseMove;
    document.onmouseup = init;
    
	function init() // ================ INIT ==============
	{
        t1= new Date().getTime();
        t2= new Date().getTime();
        posx = w/2;
        posy = h/2;
        points = 0;
        balls = [];
        
        pBall = new Ball(posx, posy, 20, 0, '#ccff00');
        
        // FPS control =========================================
		if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, 1000/fps);
        if(typeof game_loop2 != "undefined") clearInterval(game_loop2);
        game_loop2 = setInterval(counter, 1000);
        if(typeof game_loop3 != "undefined") clearInterval(game_loop3);
        game_loop3 = setInterval(addNewBall, 5*1000);
        
        for(i=0;i<initBalls;i++){
            balls.push(new Ball((Math.random()*w)-w, (Math.random()*h)-h, Math.random()*(maxRad-minRad)+minRad, Math.random()*(maxSpeed-minSpeed)+minSpeed, rgb2hex(200,200,200)));
        }
	}
	init();
    
    
	//==================PAINT==================================
	function paint()
	{
		eraseCanvas();
		
        pBall.posx = posx;
        pBall.posy = posy;
        drawBall(pBall);
        
        t1= new Date().getTime();
        frameDuration=t1-t2;
        t2 = new Date().getTime();
        
        for(i=0;i<balls.length;i++){
            balls[i].posx += balls[i].speed * frameDuration/1000;
            balls[i].posy += balls[i].speed * frameDuration/1000;
            
            if(balls[i].posx>w+balls[i].rad) {
                balls[i].posx-=w+balls[i].rad*2;
                balls[i].posy= Math.random()*h;
            }
            if(balls[i].posy>h+balls[i].rad){
                balls[i].posy-=h+balls[i].rad*2;
                balls[i].posx= Math.random()*w;
            } 
            
            drawBall(balls[i]);
            
        }
        
        for(i=0;i<balls.length;i++){
            if(check_collision(pBall,balls[i])){
                
                if(typeof game_loop != "undefined") clearInterval(game_loop);
                if(typeof game_loop2 != "undefined") clearInterval(game_loop2);
                if(typeof game_loop3 != "undefined") clearInterval(game_loop3);
                
                ctx.shadowBlur=10;
                ctx.shadowColor='#ffffff';
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.font = "50px Arial";
                ctx.fillText("Click to restart",w/2,h/2);
                ctx.font = "30px Arial";
                ctx.fillText("Score: "+points,w/2,h/2+70);
            }
        }

        c1++;
        
        //Text
        ctx.shadowBlur=10;
        ctx.shadowColor='#ffffff';
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "30px Arial";
        ctx.fillText("Time: "+points,w/2,50);
                
        //Text
        ctx.shadowBlur=10;
        ctx.shadowColor='#888888';
        ctx.fillStyle = "#888888";
        ctx.textAlign = "right";
        ctx.font = "15px Arial";
        ctx.fillText("Balls: "+ balls.length +"    FPS: "+c2,w-5,h-5);
        
        
        
		
	}
    
	function readMouseMove(e){
        if(e.clientX < w) posx=e.clientX;
        if(e.clientY < h) posy=e.clientY;
        
    }
    function eraseCanvas(){
        ctx.fillStyle = "#111111";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "#111111";
		ctx.strokeRect(0, 0, w, h);
    }
    
    function Ball(posx,posy,rad,speed,color){
        this.posx = posx;
        this.posy = posy;
        this.rad = rad;
        this.speed = speed;
        this.color = color;
    }
    
    function drawBall(b){
        ctx.beginPath();
        ctx.arc(b.posx, b.posy, b.rad,0,2*Math.PI);
        ctx.fillStyle = b.color;
        ctx.shadowBlur=15;
        ctx.shadowColor='#ccff00';
        ctx.fill();
    }
    function counter(){
        points ++;
        c2=c1;
        c1=0;
        increaseSpeed();
    }
    function increaseSpeed(){
        for(i=0;i<balls.length;i++){
            balls[i].speed *= speedMultiplier;
        }
    }
    
    function addNewBall(){
        if(balls.length<numBalls){
            balls.push(new Ball((Math.random()*w)-w, (Math.random()*h)-h, Math.random()*(maxRad-minRad)+minRad, Math.random()*(maxSpeed-minSpeed)+minSpeed, rgb2hex(200,200,200) ));
        }
        console.log(balls.length);
    }
    
    function rgb2hex(red, green, blue){
        var decColor =0x1000000+ blue + 0x100 * green + 0x10000 *red ;
        return '#'+decColor.toString(16).substr(1);
    }

	function check_collision(ball1, ball2){
		var ball1 = ball1;
        var ball2=ball2;
		var d1 = Math.abs(ball1.posx - ball2.posx);
        var d2 = Math.abs(ball1.posy-ball2.posy);
        var h = Math.sqrt(d1*d1+d2*d2);
        if(Math.round(h)<(ball1.rad + ball2.rad)){
            return true;
        }else{
            return false;
        }
	}
	
})