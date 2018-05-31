"use strict";//js真的很严格

//全局变量
var gameover=false;//游戏结束标志
var firstclick=true;//第一次点击
var leftClick=false;//鼠标左键
var rightClick=false;//鼠标右键
var left_count=0;//左键次数
var right_count=0;//右键次数
var double_count=0;//双击次数
var ces_count=0;//有效点击次数
var right_invalid=false;//消除双击带右键
var left_invalid=false;//消除双击带左键
var right_minus=true;//保证left_count只能减一次
var video_invalid=true;//判断是否读取过录像文件并记录数据
var reset_begin=false;//判断重开开始计时的时间

function Container(d,e,f){
	this.rows=d;//行
	this.columns=e;//列
	this.bombNumber=f;//总雷数
	this.childObject=new Array();//block
	this.html=null;
	this.minenumber=f;//剩余雷数
	this.level=1;
}

Container.prototype.init=function(level){
	reset();
	// console.log("newgame");
	gameover=false;
	firstclick=true;
	leftClick=false;
	rightClick=false;
	left_invalid=false;
	right_invalid=false;
	left_count=0;
	right_count=0;
	double_count=0;
	ces_count=0;
	right_minus=true;
	var exist=document.getElementById("container");
	if(exist!=null){
		if(document.getElementById("mouse_point")){
			$("div#mouse_point").remove();
		}
		document.getElementById("video_control").style.display="none";
		var parent=document.getElementById("container");
		var grandparent=document.getElementById("containers");
		for(var i=0;i<this.rows*this.columns;i++){
			parent.removeChild(parent.childNodes[0]);//移除block
		}
		if(level==3){//高级
			parent.style="width:480px;height:256px;";
			grandparent.style="width:498px;height:362px;";
			document.getElementById("top").style="width:482px;";
			document.getElementById("mine").style="width:636px;";
			document.getElementById("menu").style="width:498px;";
			document.getElementById("mark").style="width:486px;";
			document.getElementById("mark_span").style="width:486px;";
			document.getElementById("video_control").style="margin-top:374px;margin-left:132px;";
			this.rows=16;
			this.columns=30;
			this.bombNumber=99;
			this.level=3;
		}else if(level==2){//中级
			parent.style="width:256px;height:256px;";
			grandparent.style="width:274px;height:362px;";
			document.getElementById("top").style="width:258px;";
			document.getElementById("mine").style="width:412px;";
			document.getElementById("menu").style="width:274px;";
			document.getElementById("mark").style="width:262px;";
			document.getElementById("mark_span").style="width:262px;";
			document.getElementById("video_control").style="margin-top:374px;margin-left:0px;";
			this.rows=16;
			this.columns=16;
			this.bombNumber=40;
			this.level=2;
		}else if(level==1){//初级
			parent.style="width:128px;height:128px;";
			grandparent.style="width:146px;height:234px;";
			document.getElementById("top").style="width:130px;";
			document.getElementById("mine").style="width:284px;";
			document.getElementById("menu").style="width:146px;";
			document.getElementById("mark").style="width:134px;";
			document.getElementById("mark_span").style="width:134px;";
			document.getElementById("video_control").style="margin-top:336px;margin-left:0px;";
			this.rows=8;
			this.columns=8;
			this.bombNumber=10;
			this.level=1;
		}
		this.childObject.splice(0,this.childObject.length);
		for(var i=0;i<this.rows*this.columns;i++){
			var f=new Block("block",i);
			this.childObject.push(f);
			document.getElementById("container").appendChild(f.html);
			var img=document.createElement("img");
			document.getElementById(i).appendChild(img);
		}
	}else{
		this.html=document.createElement("div");
		this.html.id="container";
		for(var i=0;i<this.rows*this.columns;i++){
			var f=new Block("block",i);
			this.childObject.push(f);
			this.html.appendChild(f.html);
		}
	}
	change_top_image("face","face_normal");
	change_top_count("mine_count",this.bombNumber);
	change_top_count("time_count",0);
	this.minenumber=this.bombNumber;
};

Container.prototype.add_mark=function(){
	var mark=document.createElement("div");
	mark.id="mark";
	document.getElementById("containers").appendChild(mark);
	var span=document.createElement("span");
	span.id="mark_span";
	span.innerHTML="Flop";
	span.ondblclick=function(){
		var innerHTML=document.getElementById("mark_span").innerHTML;//获得元素之前的内容
		document.getElementById("mark_span").innerHTML="";//span内容置空
		var input=document.createElement('input');//创建一个input元素
		input.type='text';//为input元素添加类型
		input.value=innerHTML;//为input元素添加值
		input.ondblclick=function(){
			event.stopPropagation();//阻止冒泡传递导致再次增加input
		}
		document.getElementById("mark_span").appendChild(input);//添加子元素
		input.focus();//获得焦点
		input.onblur=function(){//设置newobj失去焦点的事件
		document.getElementById("mark_span").innerHTML=this.value ? this.value : innerHTML;
		//判断是否做了修改并使用ajax代码请求服务端将id与修改后的数据提交
  		//当触发时判断newobj的值是否为空，为空则不修改，并返回oldhtml
		}
	}
	document.getElementById("mark").appendChild(span);//添加子元素

	for(var i=0;i<container.rows*container.columns;i++){//给每个block增加img节点
		var img=document.createElement("img");
		document.getElementById(i).appendChild(img);
	}
};

Container.prototype.set_mine=function(bomb_id){
	reset();//重置时间
	console.log("新游戏布雷");
	gameover=false;
	leftClick=false;
	rightClick=false;
	var d=0;
	while(true){
		if(d>=this.bombNumber){
			break;
		}
		var e=Math.floor(Math.random()*this.rows*this.columns);
		if(e!=bomb_id&&this.childObject[e].isBomb!=true){
			this.childObject[e].isBomb=true;
			d++;
		}
	}
	for(var j=0;j<this.rows*this.columns;j++){
		var f=this.childObject[j];
		f.neighbors.up=this.childObject[j-this.columns];
		f.neighbors.right=this.childObject[j+1];
		f.neighbors.down=this.childObject[j+this.columns];
		f.neighbors.left=this.childObject[j-1];
		f.neighbors.leftUp=this.childObject[j-this.columns-1];
		f.neighbors.rightUp=this.childObject[j-this.columns+1];
		f.neighbors.leftDown=this.childObject[j+this.columns-1];
		f.neighbors.rightDown=this.childObject[j+this.columns+1];
		if(j/this.columns==0){
			f.neighbors.up=null;
			f.neighbors.leftUp=null;
			f.neighbors.rightUp=null;
		}else if(j/this.columns==this.rows-1){
			f.neighbors.down=null;
			f.neighbors.leftDown=null;
			f.neighbors.rightDown=null;
		}
		if(j%this.columns==0){
			f.neighbors.left=null;
			f.neighbors.leftUp=null;
			f.neighbors.leftDown=null;
		}else if(j%this.columns==this.columns-1){
			f.neighbors.right=null;
			f.neighbors.rightUp=null;
			f.neighbors.rightDown=null;
		}
		f.calcBombAround();
	}
	this.childObject[bomb_id].open();
};

Container.prototype.set_viedo_mine=function(board){
	reset();//重置时间
	gameover=true;
	firstclick=false;
	leftClick=false;
	rightClick=false;
	left_invalid=false;
	right_invalid=false;
	left_count=0;
	right_count=0;
	double_count=0;
	ces_count=0;
	right_minus=true;
	console.log("录像布雷");
	for(var i in board){
		if(board[i]==1){
			this.childObject[i].isBomb=true;
		}
	}
	for(var j=0;j<this.rows*this.columns;j++){
		var f=this.childObject[j];
		f.neighbors.up=this.childObject[j-this.columns];
		f.neighbors.right=this.childObject[j+1];
		f.neighbors.down=this.childObject[j+this.columns];
		f.neighbors.left=this.childObject[j-1];
		f.neighbors.leftUp=this.childObject[j-this.columns-1];
		f.neighbors.rightUp=this.childObject[j-this.columns+1];
		f.neighbors.leftDown=this.childObject[j+this.columns-1];
		f.neighbors.rightDown=this.childObject[j+this.columns+1];
		if(j/this.columns==0){
			f.neighbors.up=null;
			f.neighbors.leftUp=null;
			f.neighbors.rightUp=null;
		}else if(j/this.columns==this.rows-1){
			f.neighbors.down=null;
			f.neighbors.leftDown=null;
			f.neighbors.rightDown=null;
		}
		if(j%this.columns==0){
			f.neighbors.left=null;
			f.neighbors.leftUp=null;
			f.neighbors.leftDown=null;
		}else if(j%this.columns==this.columns-1){
			f.neighbors.right=null;
			f.neighbors.rightUp=null;
			f.neighbors.rightDown=null;
		}
		f.calcBombAround();
	}
};

Container.prototype.replay_video=function(){
	if(video_invalid==false){
		container.init(video[0].level);
		container.set_viedo_mine(video[0].board);
		start_avf(video);
	}else{
		console.log("录像重放错误");
	}
}

Container.prototype.reset_mine=function(){
	if(left_count!=0||gameover==true){
		if(document.getElementById("mouse_point")){
			$("div#mouse_point").remove();
		}
		change_top_count("mine_count",container.minenumber=container.bombNumber);
		reset();//重置时间
		gameover=false;
		firstclick=false;
		leftClick=false;
		rightClick=false;
		left_invalid=false;
		right_invalid=false;
		left_count=0;
		right_count=0;
		double_count=0;
		ces_count=0;
		right_minus=true;
		reset_begin=true;
		console.log("重开布雷");
		for(var i in this.childObject){
			this.childObject[i].changeStyle("block");
			this.childObject[i].isOpen=false;
			this.childObject[i].is_bv=true;
		}
	}
	else{
		console.log('重新布雷无效');
	}
};

Container.prototype.play_avf=function(video,size,realtime,player){
	var id=0;
	for(var i=0;i<size;i++){
		id=(video[i].columns-1)*container.columns+(video[i].rows-1);
		if(container.childObject[id].isBomb==false){
			container.childObject[id].open()
		}
	}
};

function Direction(){
	this.up=null;
	this.right=null;
	this.down=null;
	this.left=null;
	this.leftUp=null;
	this.rightUp=null;
	this.leftDown=null;
	this.rightDown=null;
}

function Block(className,id){
	this.neighbors=new Direction();
	this.html=null;
	this.isBomb=false;
	this.bombNumAround=-1;
	this.className=className;
	this.id=id;
	this.isOpen=false;
	this.is_bv=true;
	this.init();
}

Block.prototype.calcBombAround=function(){
	if(!this.isBomb){
		var a=0;
		for(var p in this.neighbors){
			if(typeof(this.neighbors[p])!="function"){
				if(null!=this.neighbors[p]&&this.neighbors[p].isBomb){
					a++;
				}
			}
		}
		this.bombNumAround=a;
	}
};

Block.prototype.init=function(){
	var c=this;
	this.html=document.createElement("div");

	EventUtil.addEvent(this.html,"mouseover",function(a){
		if(gameover==true){
			return false;
		}
		if(c.isOpen==false&&rightClick==false&&leftClick==true){
			if(c.getStyle()=="block"){
				c.changeStyle("opening");
			}
		}else if(rightClick==true&&leftClick==true){
			c.change_around_opening();
		}
	}
	);
	EventUtil.addEvent(this.html,"mouseout",function(a){
		if(gameover==true){
			return false;
		}
		if(c.isOpen==false&&leftClick==true&&rightClick==false){
			if(c.getStyle()=="opening"){
				c.changeStyle("block");
			}
		}else if(rightClick==true&&leftClick==true){
			c.change_around_normal();
		}
	}
	);

	EventUtil.addEvent(this.html,"mousedown",function(a){
		if(gameover==true){
			return false;
		}
		change_top_image("face","face_click");
		if(a.button==0){
			if(rightClick==true){
				left_invalid=true;
				c.change_around_opening();
			}else if(c.getStyle()=="block"){
				c.changeStyle("opening");
			}
		}else if(a.button==2){
			if(leftClick==true){
				left_invalid=true;
				c.change_around_opening();
			}else {
				right_count++;
				if(c.getStyle()=="openedBlockBomb"){
					ces_count++;
					c.changeStyle("block");
					change_top_count("mine_count",container.minenumber=container.minenumber+1);
				}else if(c.getStyle()=="block"){
					ces_count++;
					c.changeStyle("openedBlockBomb");
					change_top_count("mine_count",container.minenumber=container.minenumber-1);
				}else{
					right_invalid=true;
				}
			}
		}
	}
	);

	EventUtil.addEvent(this.html,"mouseup",function(a){
		if(gameover==true){
			return false;
		}
		if(reset_begin==true){
			reset_begin=false;
			start();
		}
		change_top_image("face","face_normal");
		if(a.button==0){
			if(rightClick==true){
				c.change_around_normal();
				double_count++;
				if(right_invalid==true&&right_minus==true){
					right_count--;
					right_minus=false;
				}
			}else if(left_invalid==false){
				left_count++;
			}
			if(c.isOpen==false&&c.getStyle()=="opening"&&rightClick==false&&c.getStyle()=="opening"){
				if(firstclick==true){
					firstclick=false;
					container.set_mine(c.id);
					start();
				}else{
					c.open();
				}
			}else if(rightClick==true&&c.isOpen==true&&c.bombNumAround>0){
				c.openaround();
			}
			left_invalid=false;
		}
		if(a.button==2){
			if(leftClick==true){
				double_count++;
				if(right_invalid==true){
					right_count--;
				}
				c.change_around_normal();
				if(c.isOpen==true&&c.bombNumAround>0){
					c.openaround();
				}
			}
			right_invalid=false;
			right_minus=true;
		}
	}
	);
	this.html.setAttribute("class","block");
	this.html.setAttribute("id",c.id);
};

Block.prototype.changeStyle=function(a){
	// HTML DOM setAttribute() 方法
	// http://www.runoob.com/jsref/met-element-setattribute.html
	this.html.setAttribute("class",a);
	if(a=="openedBlockBomb"){
		document.getElementById(this.id).getElementsByTagName("img")[0].src="image/flag.bmp";
	}else if(a=="block"){
		document.getElementById(this.id).getElementsByTagName("img")[0].src="image/blank.bmp";
	}else if(a=="opening"){
		document.getElementById(this.id).getElementsByTagName("img")[0].src="image/opening.bmp";
	}
};

Block.prototype.change=function(a){
	this.html.setAttribute("style",a);
};

Block.prototype.change_around_opening=function(){
	if(null!=this&&typeof(this)!="undefined"&&!this.isOpen&&this.getStyle()=="block"){
		this.changeStyle("opening");
	}
	var a=new Array();
	a.push("up");
	a.push("right");
	a.push("down");
	a.push("left");
	a.push("leftUp");
	a.push("rightUp");
	a.push("leftDown");
	a.push("rightDown");
	for(var i=0;i<a.length;i++){
		var b=this.neighbors[a[i]];
		if(null!=b&&typeof(b)!="undefined"&&!b.isOpen&&b.getStyle()=="block"){
			b.changeStyle("opening");
		}
	}
};

Block.prototype.change_around_normal=function(){
	if(null!=this&&typeof(this)!="undefined"&&!this.isOpen&&this.getStyle()=="opening"){
		this.changeStyle("block");
	}
	var a=new Array();
	a.push("up");
	a.push("right");
	a.push("down");
	a.push("left");
	a.push("leftUp");
	a.push("rightUp");
	a.push("leftDown");
	a.push("rightDown");
	for(var i=0;i<a.length;i++){
		var b=this.neighbors[a[i]];
		if(null!=b&&typeof(b)!="undefined"&&!b.isOpen&&b.getStyle()=="opening"){
			b.changeStyle("block");
		}
	}
};

Block.prototype.getStyle=function(){
	var a=this.html.getAttribute("class");
	if(a==null||typeof(a)=="undefined"){
		a=this.html.getAttribute("className")
	}
	return a;
};

Block.prototype.open=function()
{
	ces_count++;
	if(this.bombNumAround==0){
		this.changeStyle("opening");
	}else if(this.bombNumAround>0){
		this.changeStyle("number");
		document.getElementById(this.id).getElementsByTagName("img")[0].src="image/"+this.bombNumAround+".bmp";
	}else{
		stop();
		this.changeStyle("firstbomb");
		document.getElementById(this.id).getElementsByTagName("img")[0].src="image/firstbomb.bmp";

		//You Lose!
		lose();
		change_top_image("face","face_cry");
	}
	this.isOpen=true;
	this.win();
	if(this.bombNumAround==0){
		var a=new Array();
		// JavaScript push() 方法
		// http://www.runoob.com/jsref/jsref-push.html
		a.push("up");
		a.push("right");
		a.push("down");
		a.push("left");
		a.push("leftUp");
		a.push("rightUp");
		a.push("leftDown");
		a.push("rightDown");
		for(var i=0;i<a.length;i++){
			var b=this.neighbors[a[i]];
			if(null!=b&&typeof(b)!="undefined"&&!b.isBomb&&!b.isOpen&&b.getStyle()!="openedBlockBomb"){
				b.open();
				ces_count--;
			}
		}
	}
};

Block.prototype.openaround=function()
{
	var count=0;
	var flag=false;
	var a=new Array();
	a.push("up");
	a.push("right");
	a.push("down");
	a.push("left");
	a.push("leftUp");
	a.push("rightUp");
	a.push("leftDown");
	a.push("rightDown");
	for(var i=0;i<a.length;i++)
	{
		var b=this.neighbors[a[i]];
		if(null!=b&&typeof(b)!="undefined"&&!b.isOpen&&b.getStyle()=="openedBlockBomb")
			count++;
	}
	if(count==this.bombNumAround){
		for(var i=0;i<a.length;i++){
			var b=this.neighbors[a[i]];
			if(null!=b&&typeof(b)!="undefined"&&!b.isOpen&&b.getStyle()!="openedBlockBomb"&&b.getStyle()!="bomb"){
				b.open();
				ces_count--;
				flag=true;
			}
		}
		if(flag==true){
			ces_count++;
		}
	}
};

function lose()
{
	gameover=true;
	var parent=document.getElementById("container");
	for(var i=0;i<container.childObject.length;i++){
		if(container.childObject[i].html.className=="block"&&container.childObject[i].isBomb==true){
			parent.childNodes[i].className="bomb";
			document.getElementById(i).getElementsByTagName("img")[0].src="image/bomb.bmp";
		}else if(container.childObject[i].html.className=="openedBlockBomb"&&container.childObject[i].isBomb==false){
			parent.childNodes[i].className="bomb";
			document.getElementById(i).getElementsByTagName("img")[0].src="image/wrongflag.bmp";
		}
	}
	write_counters();
}

Block.prototype.win=function(){
	var type=document.getElementById('container').getElementsByTagName("div");
	var count=0;
	for(var i=0;i<type.length;i++){
		var a=type[i].className;
		if(a=="opening"||a=="number")
			count++;
	}
	if(count==container.rows*container.columns-container.bombNumber){
		// alert("You Win!");
		stop();
		change_top_image("face","face_sunglasses");
		gameover=true;
		console.log("You Win!");
		var parent=document.getElementById("container");
		for(var i=0;i<container.childObject.length;i++){
			if(container.childObject[i].html.className=="block"){
				parent.childNodes[i].className="openedBlockBomb";
				document.getElementById(i).getElementsByTagName("img")[0].src="image/flag.bmp";
			}
		}
		write_counters();
	}
}

var EventUtil=new Object;
// addEventListener() 方法
// http://www.runoob.com/js/js-htmldom-eventlistener.html
EventUtil.addEvent=function(a,b,c){
	if(a.addEventListener){
		a.addEventListener(b,c,false);
	}else if(a.attachEvent){
		a.attachEvent("on"+b,c);
	}else{
		a["on"+b]=c;
	}
};
EventUtil.removeEvent=function(a,b,c){
	if(a.removeEventListener){
		a.removeEventListener(b,c,false);
	}else if(a.detachEvent){
		a.detachEvent("on"+b,c);
	}else{
		a["on"+b]=null;
	}
};

document.onmousedown=function() { 
	if(gameover==false){
		if(event.button==0){
		// console.log("leftdown");
		leftClick=true;
		} 
		if(event.button==2){
		// console.log("rightdown");
		rightClick=true;
		} 
	}
}
document.onmouseup=function() { 
	if(gameover==false){
		if(event.button==0){
		// console.log("leftup");
		leftClick=false;
		} 
		if(event.button==2){
		// console.log("rightup");
		rightClick=false;
		} 
	}
}
document.onkeydown=function(event){
  var e = event || window.event || arguments.callee.caller.arguments[0];
  if(e){ 
     if(e.keyCode==113){//F2 
     	container.init(0);
     }else if(e.keyCode==49){//1
     	container.init(1);
     }else if(e.keyCode==50){//2
     	container.init(2);
     }else if(e.keyCode==51){//3
     	container.init(3);
     }else if(e.keyCode==114){//F3
     	container.reset_mine();
     }else if(e.keyCode==116){//F5
     	$("#files").click();
     }else if(e.keyCode==115){//F4
     	container.replay_video();
     }
  }    
}

//界面初始化
var container=new Container(8,8,10);
container.init(1);
document.getElementById("containers").appendChild(container.html);
document.getElementById("container").style="width:128px;height:128px;";
container.add_mark();
