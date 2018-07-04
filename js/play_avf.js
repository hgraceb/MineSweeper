"use strict";

//点击导入按钮,使files触发点击事件,然后完成读取文件的操作
$("#fileImport").click(function () {
    $("#files").click();
})
var video=new Array();//全部鼠标事件
var number=0;//字符读取进度
var file=new Array();
function fileImport() {
    //获取读取文件的File对象
    var selectedFile = document.getElementById('files').files[0];
    if(selectedFile){//如果有选择文件，避免undefined报错
	    var name = selectedFile.name;//读取选中文件的文件名
	    var size = selectedFile.size;//读取选中文件的大小
	    console.log("文件名:"+name);
	    console.log("文件大小:"+(size/1024).toFixed(2)+"kb");
	    if((size/1024).toFixed(2)>5120){//限制文件大小5M
	    	console.log("录像文件过大，请重新选择");
	    	return false;
	    }
	    for(var name_length in name){}//获取文件名长度
		if(name[name_length-3]=='.'&&name[name_length-2]=='a'&&name[name_length-1]=='v'&&name[name_length]=='f'){
			var reader = new FileReader();//这是核心,读取操作就是由它完成.
		    reader.readAsBinaryString(selectedFile);//读取文件的内容,也可以读取文件的URL
            reader.onabort = function () {  
                console.log("中断读取....");  
            }  
            reader.onerror = function () {  
                console.log("读取异常....");  
            }  
		    reader.onload = function () {
		    	reset();
		        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
		        // console.log(this.result);
		        var board=new Array();//雷的分布
		        number=5;//字符读取进度，不要放在level定义下面
		        var level=this.result[number].charCodeAt()-2;//级别
		        var timestamp="Timestamp:";//时间戳
		        var events=new Array();//鼠标事件
		        video=new Array();
		        path=0;
		        var size=0;//鼠标事件长度
		        var realtime="";
		        var player="";//玩家标志

		        if(level==1||level==2||level==3){
		        	container.init(level);
		        	for(var i=0;i<container.rows*container.columns;i++){
		        		board[i]=0;
		        	}
			        for(var i=++number;i<number+2*container.bombNumber;i+=2)
			        {
			        	board[container.columns*(this.result[i].charCodeAt()-1)+(this.result[i+1].charCodeAt()-1)]=1;
			        	// console.log(this.result[i].charCodeAt()+' '+this.result[i+1].charCodeAt());
			        }
			        container.set_viedo_mine(board);//按录像布雷

			        while(this.result[number]!='|'){//时间戳开始标志
			        	number++;
			        	// console.log(number+':'+this.result[number].charCodeAt());
			        }

			        // console.log(this.result[number-4].charCodeAt()+'..............................');
			        if(this.result[number-4].charCodeAt()==17){//question marks
			        	document.getElementById("question").innerHTML='取消问号';
						question=true;
			        }
			        else{
			        	document.getElementById("question").innerHTML='标记问号';
						question=false;
			        }

			        number++;
			        while(this.result[number]!='|'){//时间戳结束标志
			        	timestamp+=this.result[number];
			        	// console.log(number+':'+this.result[number]);
			        	number++;
			        }//时间戳读取完成
			        // console.log(timestamp);

			        for(var i=0;i<7;i++){
			        	events[i]=0;
			        }
			        while(events[2]!=1||events[1]>1){
			        	events[0]=events[1];
			        	events[1]=events[2];
			        	events[2]=this.result[number++].charCodeAt();
			        }
			        for(var i=3;i<8;i++){
			        	events[i]=this.result[number++].charCodeAt();
			        }
			        while(true){	
			        	video[size]=new Mouse_event();
			        	video[size].mouse=events[0];
			        	video[size].rows=parseInt((events[1]*256+events[3])/16+1);
			        	video[size].columns=parseInt((events[5]*256+events[7])/16+1);
			        	video[size].x=events[1]*256+events[3];
			        	video[size].y=events[5]*256+events[7];
			        	video[size].sec=events[6]*256+events[2]-1;
			        	video[size].hun=events[4];

			        	if(size>0){//计算path
			        		video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
			        	}
			        	else{
			        		video[size].path=0;
			        	}

			        	if(video[size].sec<0)break;//出错处理
			        	for(var i=0;i<8;++i){
			        		events[i]=this.result[number++].charCodeAt();
			        	}
			        	size++;
			        }//events时间读取完成
			        
			        while(this.result[number++]!="R"){}
			        if(this.result[number]=="e"){
			        	number+=9;
			        	while(this.result[number]!="S"){
				        	realtime+=this.result[number];
				        	number++;
				        }//真实时间读取完成
			        }
			        // console.log(realtime);
			        if(this.result[number]=="S"){
			        	number+=10;
			        	while(this.result[number]!="M"){
				        	player+=this.result[number];
				        	number++;
				        }//标志读取完成
			        }
			        // console.log(player);

			        video[0].size=size;
			        video[0].realtime=realtime;
			        video[0].player=player;
			        video[0].level=level;
			        video[0].board=board;
			        start_avf(video);
			        video_invalid=false;		        
			    }
		    }
		}else if(name[name_length-3]=='.'&&name[name_length-2]=='m'&&name[name_length-1]=='v'&&name[name_length]=='f'){
			var reader = new FileReader();//这是核心,读取操作就是由它完成.
		    reader.readAsBinaryString(selectedFile);//读取文件的内容,也可以读取文件的URL
            reader.onabort = function () {  
                console.log("中断读取....");  
            }  
            reader.onerror = function () {  
                console.log("读取异常....");  
            }  
		    reader.onload = function () {
		    	reset();
		        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
		        // console.log(this.result);
		        number=0;//字符读取进度
		        video=new Array();

		        if(this.result[0].charCodeAt()==0x11&&this.result[1].charCodeAt()==0x4D){
		        	// console.log(this.result[27]);
		        	if(this.result[27]==5){//此处判断不能进行charCodeAt()操作
		        		number=74;
		        		console.log("version: Clone 0.97");
		        		read_097(this.result);//读取事件
		        		container.set_viedo_mine(video[0].board);//按录像布雷
		        		start_avf(video);//播放录像
		        		video_invalid=false;
		        	}else if(this.result[27]==6 || this.result[27]==7){
		        		number=71;
		        		console.log("version: Clone 2007");
		        		read_2007(this.result);//读取事件
		        		container.set_viedo_mine(video[0].board);//按录像布雷
		        		start_avf(video);//播放录像
		        		video_invalid=false;
		        	}else if(this.result[27]==8){
		        		number=74;
		        		console.log("version: Clone 0.97 funny mode");
		        		read_097(this.result);//读取事件
		        		container.set_viedo_mine(video[0].board);//按录像布雷
		        		start_avf(video);//播放录像
		        		video_invalid=false;
		        	}
		        }else if(this.result[0].charCodeAt()==0x00&&this.result[1].charCodeAt()==0x00){
		        	console.log("version: 0.97 hacked(headless)");
		        	number=7;//丢失部分信息的mvf文件
	        		read_097(this.result);//读取事件
	        		container.set_viedo_mine(video[0].board);//按录像布雷
	        		start_avf(video);//播放录像
	        		video_invalid=false;
		        }else{
		        	number=-1;
	        		read_pre(this.result);//读取事件
	        		container.set_viedo_mine(video[0].board);//按录像布雷
	        		start_avf(video);//播放录像
	        		video_invalid=false;
		        }

		    }
		}else{
			console.log("录像格式错误，请重新选择");
		}
	}else{
		log("请选择一个录像文件");
	}
}

function read_board(result,add){
	var w=0;//宽
	var h=0;//高
	var m=0;//雷数
	var pos=0;//雷的位置
	video[0].board=new Array();
	w=result[++number].charCodeAt();
	h=result[++number].charCodeAt();
	for(var i=0;i<w*h;i++){
		video[0].board[i]=0;
	}
	var m=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	// console.log('Width: '+w+'  Height: '+h+'  Mines: '+m);
	for(var i=0;i<m;i++){
		pos=result[++number].charCodeAt()+add+(result[++number].charCodeAt()+add)*w;
		if(pos>=w*h||pos<0){
			console.log("录像读取错误");
			return false;
		}
		video[0].board[pos]=1;
	}
	// log(video[0].board);
}

var direction = "onorientationchange" in window ? "orientationchange" : "resize";
// 代码中监测旋转是用了onorientationchange 函数
// 但是在一些APP或游戏内嵌页面会有该函数不会执行
// orientation获取不到的情况
// 所以如果是内嵌页建议使用resize事件
// 检查宽高变化来检测屏幕是否旋转
window.addEventListener(direction, function() {
    console.log('屏幕：'+window.orientation+'度');
    background_reload();
    if(window.orientation == 90 || window.orientation == -90){
    	document.getElementsByTagName("meta")[1]["content"]=('width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0');
    }
    else if(container.level==3){
    	document.getElementsByTagName("meta")[1]["content"]=('width=device-width, initial-scale=1, user-scalable=no, minimum-scale='+$(window).height()/640+', maximum-scale='+$(window).height()/640+'');
    }
},false);

function read_pre(result){//0.97clone
	video[0]=new Array();

	var w=0;//宽
	var h=0;//高
	var m=0;//雷数
	var pos=0;//雷的位置
	var has_name=false;
	video[0].board=new Array();
	w=result[++number].charCodeAt();
	h=result[++number].charCodeAt();
	for(var i=0;i<w*h;i++){
		video[0].board[i]=0;
	}
	var m=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	// console.log('Width: '+w+'  Height: '+h+'  Mines: '+m);
	for(var i=0;i<m;i++){
		pos=result[++number].charCodeAt()+(result[++number].charCodeAt())*w;
		if(pos>=w*h||pos<0){
			console.log("录像读取错误");
			return false;
		}
		video[0].board[pos]=1;
	}
	// log(video[0].board);

	if(result[++number].charCodeAt()){//question marks
		console.log("Marks: on");
		document.getElementById("question").innerHTML='取消问号';
		question=true;
	}else{
    	document.getElementById("question").innerHTML='标记问号';
		question=false;
    }
	var c=result[++number].charCodeAt();
	var now=++number;
	var filesize=result.length;
	var after_events;
	var last=result[result.length-1];
	if(last.charCodeAt()){
		if(result[result.length-13==' ']&&result[result.length-12==' ']&&result[result.length-11==' ']){
			after_events=filesize-113;
			has_name=true;
			console.log("Version: Clone 0.76");
		}else{
			after_events=filesize-13;
			has_name=false;
			console.log("Version: Clone <=0.75");
		}
	}else{
		after_events=filesize-125;
		has_name=true;
		console.log("Version: Clone <=0.96");
	}
	if(w==8 && h==8) video[0].level=1;
	else if(w==16 && h==16) video[0].level=2;
	else if(w==30 && h==16) video[0].level=3;
	else {
		video=new Array();
		return false;
	}
	container.init(video[0].level);

	// console.log('now:'+now);
	// console.log('filesize:'+filesize);
	// console.log('after_events:'+after_events);

	number=after_events-1;
	var score_sec=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var score_ths=result[++number].charCodeAt()*10;
	console.log('Time: '+score_sec+'.'+score_ths);

	video[0].player=new Array();

	if(has_name)
	{
		number=after_events+2;
		for(var i=0;i<100;i++)
		{
			video[0].player+=result[++number];
		}
	}
	console.log('Player: '+video[0].player);
	number=now-1;
	var e=new Array();
	var size=0;
	while(now<after_events){
		if(size>0)video[size]=new Array();
		for(var k=0;k<8;k++){
			e[k]=result[++number].charCodeAt();
		}
						
		video[size].sec=e[0];
		video[size].ths=e[1]*10;

		if(size>0 && 
		(video[size].sec<video[size-1].sec || 
		(video[size].sec==video[size-1].sec && video[size].ths<video[size-1].ths))) 
		{
			break;
		}
		if(video[size].sec>score_sec ||
		(video[size].sec==score_sec && video[size].ths>score_ths))
		{
			break;
		}
		
		video[size].lb=e[2]&0x01;
		video[size].mb=e[2]&0x02;
		video[size].rb=e[2]&0x04;
		video[size].x=parseInt(e[3]*256+e[4]);
		video[size].y=parseInt(e[5]*256+e[6]);
		video[size++].weirdness_bit=e[7];
		now+=8;
	}
	// console.log(now);
	video[size].lb=video[size].mb=video[size].rb=0;
	video[size].x=video[size-1].x;
	video[size].y=video[size-1].y;
	video[size].sec=video[size-1].sec;
	video[size].ths=video[size-1].ths;
	++size;
	video[0].size=size;
	// log(video);



	//第一事件
	if(video[0].lb)video[0].mouse=3;//lc
	else if(video[0].rb)video[0].mouse=9;//rc
	else if(video[0].mb)video[0].mouse=33;//mc
	else video[0].mouse=1;//mv
	video[0].rows=parseInt(video[0].x/16)+1;
	video[0].columns=parseInt(video[0].y/16)+1;

	var temp=video;
	size=0;
	video=new Array();
	video[0]=temp[0];
	video[0].hun=video[0].ths;
	video[0].path=0;
	video[0].realtime=score_sec+score_ths/1000;

	for(var i=1;i<temp[0].size;++i){
		if(temp[i].x!=temp[i-1].x||temp[i].y!=temp[i-1].y){
			video[++size]=new Array();
			video[size].mouse=1;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;//mvf精度为1ms，与avf播放兼容要/10,精准到1ms没啥意义。。
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(!temp[i].lb&&temp[i-1].lb){
			video[++size]=new Array();
			video[size].mouse=5;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(!temp[i].rb&&temp[i-1].rb){
			video[++size]=new Array();
			video[size].mouse=17;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(!temp[i].mb&&temp[i-1].mb){
			video[++size]=new Array();
			video[size].mouse=65;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(temp[i].lb&&!temp[i-1].lb){
			video[++size]=new Array();
			video[size].mouse=3;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(temp[i].rb&&!temp[i-1].rb){
			video[++size]=new Array();
			video[size].mouse=9;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(temp[i].mb&&!temp[i-1].mb){
			video[++size]=new Array();
			video[size].mouse=33;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
	}
	video[0].size=size+1;//mvf没有sec=-1的结束标志，与avf播放兼容要size+1
	// console.log(video);
}

function read_2007(result){//0.97clone
	video[0]=new Array();

	var mouth=result[number].charCodeAt();
	var day=result[++number].charCodeAt();
	var year=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var hour=result[++number].charCodeAt();
	var min=result[++number].charCodeAt();
	var sec=result[++number].charCodeAt();
	var level=result[++number].charCodeAt();

	container.init(level);

	var mode=result[++number].charCodeAt();
	var score_ths=(result[++number].charCodeAt())*65536+(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var score_sec=parseInt(score_ths/1000);
	score_ths%=1000;
	if(result[++number].charCodeAt()){//question marks
		console.log("Marks: on");
		document.getElementById("question").innerHTML='取消问号';
		question=true;
	}else{
    	document.getElementById("question").innerHTML='标记问号';
		question=false;
    }
	// console.log('Timestamp: '+year+'-'+mouth+'-'+day+' '+hour+':'+min+':'+sec);
	// console.log('Level: '+level+'  Score:'+score_sec+'.'+three_char(score_ths));
	var mode_names=new Array("","classic","density","UPK","cheat");
	console.log("Mode: "+mode_names[mode]);
	read_board(result,-1);

	var len=result[++number].charCodeAt();//标识长度
	video[0].player=new Array();
	for(var i=0;i<len;i++){
		video[0].player+=result[++number];//此处不能进行charCodeAt()操作
	}
	console.log('Player: '+video[0].player);

	var leading=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var num1=Math.sqrt(leading);
	var num2=Math.sqrt(leading+1000.0);
	var num3=Math.sqrt(num1+1000.0);
	var num4=Math.sqrt(num2+1000.0);
	var mult=100000000;
	var s=new Array();
	var byte=new Array();
	var bit=new Array();
	var cur=0;
	var e=new Array();
	s+=sprintf(parseInt(Math.round(Math.abs(Math.cos(num3+1000.0)*mult))));//格式化数字为%8d
	s+=sprintf(parseInt(Math.round(Math.abs(Math.sin(Math.sqrt(num2))*mult))));
	s+=sprintf(parseInt(Math.round(Math.abs(Math.cos(num3)*mult))));
	s+=sprintf(parseInt(Math.round(Math.abs(Math.sin(Math.sqrt(num1)+1000.0)*mult))));
	s+=sprintf(parseInt(Math.round(Math.abs(Math.cos(num4)*mult))));
	s+=sprintf(parseInt(Math.round(Math.abs(Math.sin(num4)*mult))));
	// log(s);
	if(s[48])s[48]=0;//这句好像有点多余？？还是另有用处
	cur=0;
	for(var i=0;i<=9;++i){
		for(var j=0;j<48;++j){
			if(s[j]==i)
			{
				byte[cur]=parseInt(j/8);//此处剧毒，原c文件中byte[]为int型，js需增加parseInt操作
				bit[cur++]=1<<(j%8);
			}
		}
	}

	video[0].size=(result[++number].charCodeAt())*65536+(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	// console.log('size'+video[0].size);
	for(var i=0;i<video[0].size;i++){
		for(var k=0;k<6;k++){
			e[k]=result[++number].charCodeAt();
		}
		if(i>0)video[i]=new Array();
		video[i].rb=apply_perm(0,byte,bit,e);
		video[i].mb=apply_perm(1,byte,bit,e);
		video[i].lb=apply_perm(2,byte,bit,e);
		video[i].x=video[i].y=video[i].ths=video[i].sec=0;
		for(j=0;j<11;++j)
		{
			video[i].x|=(apply_perm(14+j,byte,bit,e)<<j);
			video[i].y|=(apply_perm(3+j,byte,bit,e)<<j);
		}
		for(j=0;j<22;++j) video[i].ths|=(apply_perm(25+j,byte,bit,e)<<j);
		video[i].sec=parseInt(video[i].ths/1000);
		video[i].ths%=1000;
		video[i].x-=32;
		video[i].y-=32;
	}
	// for(var i=0;i<video[0].size;i++){
		// log(video);
	// }
	
	//第一事件
	if(video[0].lb)video[0].mouse=3;//lc
	else if(video[0].rb)video[0].mouse=9;//rc
	else if(video[0].mb)video[0].mouse=33;//mc
	else video[0].mouse=1;//mv
	video[0].rows=parseInt(video[0].x/16)+1;
	video[0].columns=parseInt(video[0].y/16)+1;

	var temp=video;
	var size=0;
	video=new Array();
	video[0]=temp[0];
	video[0].hun=video[0].ths;
	video[0].path=0;
	video[0].realtime=score_sec+score_ths/1000;
	video[0].level=level;

	for(var i=1;i<temp[0].size;++i){
		if(temp[i].x!=temp[i-1].x||temp[i].y!=temp[i-1].y){
			video[++size]=new Array();
			video[size].mouse=1;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;//mvf精度为1ms，与avf播放兼容要/10,精准到1ms没啥意义。。
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(!temp[i].lb&&temp[i-1].lb){
			video[++size]=new Array();
			video[size].mouse=5;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(!temp[i].rb&&temp[i-1].rb){
			video[++size]=new Array();
			video[size].mouse=17;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(!temp[i].mb&&temp[i-1].mb){
			video[++size]=new Array();
			video[size].mouse=65;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(temp[i].lb&&!temp[i-1].lb){
			video[++size]=new Array();
			video[size].mouse=3;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(temp[i].rb&&!temp[i-1].rb){
			video[++size]=new Array();
			video[size].mouse=9;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(temp[i].mb&&!temp[i-1].mb){
			video[++size]=new Array();
			video[size].mouse=33;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
	}
	video[0].size=size+1;//mvf没有sec=-1的结束标志，与avf播放兼容要size+1
	// console.log(video);
}

function read_097(result){//0.97clone
	video[0]=new Array();

	var mouth=result[number].charCodeAt();
	var day=result[++number].charCodeAt();
	var year=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var hour=result[++number].charCodeAt();
	var min=result[++number].charCodeAt();
	var sec=result[++number].charCodeAt();
	var level=result[++number].charCodeAt();

	container.init(level);

	var mode=result[++number].charCodeAt();
	var score_sec=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var score_ths=result[++number].charCodeAt()*10;
	var bbbv=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var solved_bbbv=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var lcl=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var dcl=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var rcl=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	if(result[++number].charCodeAt()){//question marks
		console.log("Marks: on");
		document.getElementById("question").innerHTML='取消问号';
		question=true;
	}else{
    	document.getElementById("question").innerHTML='标记问号';
		question=false;
    }
	// console.log('Timestamp: '+year+'-'+mouth+'-'+day+' '+hour+':'+min+':'+sec);
	// console.log('Level: '+level+'  Score:'+score_sec+'.'+three_char(score_ths));
	var mode_names=new Array("","classic","density","UPK","cheat");
	console.log("Mode: "+mode_names[mode]);
	// console.log('3BV:'+bbbv+'  Solved3BV:'+solved_bbbv);
	// console.log('LeftClicks:'+lcl+'  RightClicks:'+rcl+'  DoubleClicks:'+dcl);
	read_board(result,-1);

	var len=result[++number].charCodeAt();//标识长度
	video[0].player=new Array();
	for(var i=0;i<len;i++){
		video[0].player+=result[++number];//此处不能进行charCodeAt()操作
	}
	console.log('Player: '+video[0].player);

	var leading=(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	var num1=Math.sqrt(leading);
	var num2=Math.sqrt(leading+1000.0);
	var num3=Math.sqrt(num1+1000.0);
	var mult=100000000;
	var s=new Array();
	var byte=new Array();
	var bit=new Array();
	var cur=0;
	var e=new Array();
	s+=sprintf(parseInt(Math.round(Math.abs(Math.cos(num3+1000.0)*mult))));//格式化数字为%8d
	s+=sprintf(parseInt(Math.round(Math.abs(Math.sin(Math.sqrt(num2))*mult))));
	s+=sprintf(parseInt(Math.round(Math.abs(Math.cos(num3)*mult))));
	s+=sprintf(parseInt(Math.round(Math.abs(Math.sin(Math.sqrt(num1)+1000.0)*mult))));
	s+=sprintf(parseInt(Math.round(Math.abs(Math.cos(Math.sqrt(num2+1000.0))*mult))));
	if(s[40])s[40]=0;
	cur=0;
	// console.log(s);
	for(var i=0;i<=9;++i){
		for(var j=0;j<40;++j){
			if(s[j]==i)
			{
				byte[cur]=parseInt(j/8);//此处剧毒，原c文件中byte[]为int型，js需增加parseInt操作
				bit[cur++]=1<<(j%8);
			}
		}
	}

	video[0].size=(result[++number].charCodeAt())*65536+(result[++number].charCodeAt())*256+result[++number].charCodeAt();
	// console.log('size:'+video[0].size);
	for(var i=0;i<video[0].size;i++){
		for(var k=0;k<5;k++){
			e[k]=result[++number].charCodeAt();
		}
		if(i>0)video[i]=new Array();
		video[i].rb=apply_perm(0,byte,bit,e);
		video[i].mb=apply_perm(1,byte,bit,e);
		video[i].lb=apply_perm(2,byte,bit,e);
		video[i].x=video[i].y=video[i].ths=video[i].sec=0;
		for(j=0;j<9;++j)
		{
			video[i].x|=(apply_perm(12+j,byte,bit,e)<<j);
			video[i].y|=(apply_perm(3+j,byte,bit,e)<<j);
		}
		for(j=0;j<7;++j) video[i].ths|=(apply_perm(21+j,byte,bit,e)<<j);
		video[i].ths*=10;
		for(j=0;j<10;++j) video[i].sec|=(apply_perm(28+j,byte,bit,e)<<j);
	}
	// for(var i=0;i<video[0].size;i++){
		// log(video);
	// }
	
	//第一事件
	if(video[0].lb)video[0].mouse=3;//lc
	else if(video[0].rb)video[0].mouse=9;//rc
	else if(video[0].mb)video[0].mouse=33;//mc
	else video[0].mouse=1;//mv
	video[0].rows=parseInt(video[0].x/16)+1;
	video[0].columns=parseInt(video[0].y/16)+1;

	var temp=video;
	var size=0;
	video=new Array();
	video[0]=temp[0];
	video[0].hun=video[0].ths;
	video[0].path=0;
	video[0].realtime=score_sec+score_ths/1000;
	video[0].level=level;

	for(var i=1;i<temp[0].size;++i){
		if(temp[i].x!=temp[i-1].x||temp[i].y!=temp[i-1].y){
			video[++size]=new Array();
			video[size].mouse=1;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;//mvf精度为1ms，与avf播放兼容要/10,精准到1ms没啥意义。。
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(!temp[i].lb&&temp[i-1].lb){
			video[++size]=new Array();
			video[size].mouse=5;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(!temp[i].rb&&temp[i-1].rb){
			video[++size]=new Array();
			video[size].mouse=17;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(!temp[i].mb&&temp[i-1].mb){
			video[++size]=new Array();
			video[size].mouse=65;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(temp[i].lb&&!temp[i-1].lb){
			video[++size]=new Array();
			video[size].mouse=3;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(temp[i].rb&&!temp[i-1].rb){
			video[++size]=new Array();
			video[size].mouse=9;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
		if(temp[i].mb&&!temp[i-1].mb){
			video[++size]=new Array();
			video[size].mouse=33;
			video[size].sec=temp[i].sec;
			video[size].hun=temp[i].ths/10;
			video[size].x=temp[i].x;
			video[size].y=temp[i].y;
			video[size].rows=parseInt(temp[i].x/16)+1;
			video[size].columns=parseInt(temp[i].y/16)+1;
			video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
		}
	}
	video[0].size=size+1;//mvf没有sec=-1的结束标志，与avf播放兼容要size+1
	// console.log(video);
}

function apply_perm(num,byte,bit,event){
	return (event[byte[num]]&bit[num])?1:0;
}

function sprintf(num) {//格式化数字为%8d,返回值为字符串型（影响不大？）
	var add=8-num.toString().length;//直接放for循环会出错
	for(var i=0;i<add;i++){
		num='0'+num;
	}
	return num;
}