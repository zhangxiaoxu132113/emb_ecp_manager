window.onload = init;
function changeBG(){
	var search_bt = document.getElementById("search_bt");
	search_bt.onclick = function(){
		var canvas = document.getElementById("bg_canvas");
		var context = canvas.getContext("2d");
			
		var context = canvas.getContext("2d");
		for(var shape=0;shape<20;shape++){
			drawCircle(canvas,context)
		}
	}
}




function init(){
	
	var canvas = document.getElementById("bg_canvas");

	if(canvas.getContext){
		var context = canvas.getContext("2d");
		for(var shape=0;shape<15;shape++){
			/*drawSquare(canvas,context);*/
			drawCircle(canvas,context)
		}
	}else{
		alert("sorry ,your brower have not canvas!");
	}
	
}

function drawSquare(canvas,context){
	//获取要绘制的矩形的宽度的随机数
	var w = Math.floor(Math.random() * 40);
	//
	var x = Math.floor(Math.random() * (canvas.width));
	var y = Math.floor(Math.random() * (canvas.height));
	
	
	context.fillStyle = "lightblue";
	context.fillRect(x,y,w,w);
	
}

function drawCircle(canvas,context){
	var radius = Math.floor(Math.random() * 25);
	var x = Math.floor(Math.random() * (canvas.width-25));
	var y = Math.floor(Math.random() * (canvas.height-20));
	
	context.beginPath();
	context.arc(x,y,radius,0,degressToRadians(360),true);
	
	/*context.fillStyle = "#FFFAB3";*/
	context.fillStyle = "lightblue";
	context.fill();
}

function degressToRadians(degrees){
	return (degrees * Math.PI)/180;
}


