//点击导入按钮,使files触发点击事件,然后完成读取文件的操作
$("#fileImport").click(function () {
    $("#files").click();
})
var video=new Array();//全部鼠标事件
function fileImport() {
    //获取读取文件的File对象
    var selectedFile = document.getElementById('files').files[0];
    if(selectedFile){//如果有选择文件，避免undefined报错
	    var name = selectedFile.name;//读取选中文件的文件名
	    var size = selectedFile.size;//读取选中文件的大小
	    console.log("文件名:"+name);
	    console.log("大小:"+(size/1024).toFixed(2)+"kb");
	    if((size/1024).toFixed(2)>5120){//限制文件大小5M
	    	console.log("录像文件过大，请重新选择");
	    	return false;
	    }
	    for(var name_length in name){}//获取文件名长度
		if(name[name_length-3]=='.'&&name[name_length-2]=='a'&&name[name_length-1]=='v'&&name[name_length]=='f'){
			var reader = new FileReader();//这是核心,读取操作就是由它完成.
		    reader.readAsBinaryString(selectedFile);//读取文件的内容,也可以读取文件的URL
		    reader.onload = function () {
		    	reset();
		        //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
		        // console.log(this.result);
		        var board=new Array();//雷的分布
		        var number=5;//字符读取进度
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
			        }
			        number++;
			        while(this.result[number]!='|'){//时间戳结束标志
			        	timestamp+=this.result[number];
			        	// console.log(this.result[number]);
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
			        	if(size>0){
			        		video[size].path=video[size-1].path+Math.pow((Math.pow(video[size].x-video[size-1].x,2)+Math.pow(video[size].y-video[size-1].y,2)),0.5);
			        	}
			        	else{
			        		video[size].path=0;
			        	}
			        	if(video[size].sec<0)break;
			        	for(var i=0;i<8;++i){
			        		events[i]=this.result[number++].charCodeAt();
			        	}
			        	size++;
			        }//events时间读取完成
			        // console.log(video);
			        
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
			        if(window.orientation == 0 || window.orientation == 180){
			        	if(level==3){//高级录像首次播放屏幕自适应
							document.getElementsByTagName("meta")[1]["content"]=('width=device-width, initial-scale=1, user-scalable=no, minimum-scale='+$(window).width()/640+', maximum-scale='+$(window).width()/640+'');
						}
			        }
			        start_avf(video);
			        video_invalid=false;


			        // var curx=cury=-1;
			        // for(var i=0;i<size;i++){
			        // 	if(video[i].mouse==1&&video[i].x==curx&&video[i].y==cury)continue;
			        // 	curx=video[i].x;
			        // 	cury=video[i].y;
			        // 	if(video[i]==1){console.log("mv");}
			        // 	else if(video[i]==3){console.log("lc");}
			        // 	else if(video[i]==5){console.log("lr");}
			        // 	else if(video[i]==9){console.log("rc");}
			        // 	else if(video[i]==17){console.log("rr");}
			        // 	else if(video[i]==33){console.log("mc");}
			        // 	else if(video[i]==65){console.log("mr");}
			        // 	console.log((video[i].x/16+1)+"  "+(video[i].y/16+1)+"  "+video[i].x+video[i].y);
			        // }
			    


			     //    for(var i=0;i<container.rows;i++){
				    // 	var board_play=new Array();
				    //     for(var j=0;j<container.columns;j++){
				    //     	board_play.push(board[i*container.rows+j]);
				    //     }
				    //     console.log(board_play);
				    // }       
			        
			    }
		    }
		}else{
			console.log("录像格式错误，请重新选择");
		}
	}else{
		log("请选择一个录像文件");
	}
}

var direction = "onorientationchange" in window ? "orientationchange" : "resize";
// 代码中监测旋转是用了onorientationchange 函数
// 但是在一些APP或游戏内嵌页面会有该函数不会执行
// orientation获取不到的情况
// 所以如果是内嵌页建议使用resize事件
// 检查宽高变化来检测屏幕是否旋转
window.addEventListener(direction,resize,false);
function resize() {
    document.getElementsByTagName("meta")[1]["content"]=('width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0');
}
