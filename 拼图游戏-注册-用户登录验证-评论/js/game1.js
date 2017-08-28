	/*
	 *JavaScript Document
	 *Author:	song
	 *Date:	2017-8-27
	 *功能：游戏界面操作实现
	 *
	 */
	 /*清除并设置默认样式*/



	window.onload=function () {
		//获取所有需要用到的拼图方块对象并存入数组,获取开始按钮
		var oP=[];
		var oBt=document.getElementById("start");
        for(var i=1;i<10;i++){
            var term="p"+i;
            eval( "var oP"+i+"=document.getElementById(term);");
            eval( "var sr=oP"+i);
            oP.push(sr);
        }

		//将拼图方块对应的背景图片位置存入数组
        var arr=new Array(8);
        	arr[0]=[0,0];
        	arr[1]=[160,0];
        	arr[2]=[320,0];
        	arr[3]=[0,130];
        	arr[4]=[160,130];
        	arr[5]=[320,130];
        	arr[6]=[0,260];
        	arr[7]=[160,260];
        	arr[8]=[320,260];
		
		//通过随机图片位置打乱所有拼图方块
        function  disOrder(){
			for(var q=9;q>0;q--){
            	var j=Math.floor(q*Math.random());
            	oP[(q-1)].style.left=arr[j][0]+'px';
            	oP[(q-1)].style.top=arr[j][1]+'px';
            	arr.splice(j,1);
        	}
		}
		
		//添加事件监听的函数
        function myAddEvent(obj,ev,fn){
            if(obj.attachEvent){
                obj.attachEvent('on'+ev,fn);
            }
            else{
                obj.addEventListener(ev,fn,false);
            }
        }
		
		//点击事件发生后的回调函数，如果拼图方块在没有图案的方块四周则可以转换位置，否则不行
		function  pull(i){
			var tmpl=0,tmpt=0;
            if ((oP[i].offsetLeft==oP[8].offsetLeft)
			&&(Math.abs(oP[i].offsetTop-oP[8].offsetTop)==130))
            {
                tmpl=oP[8].offsetTop;
                oP[8].style.top=oP[i].offsetTop+"px";
                oP[i].style.top=tmpl+"px";
            }else if((oP[i].offsetTop == oP[8].offsetTop)
			&&(Math.abs(oP[i].offsetLeft-oP[8].offsetLeft)==160))
            {
                tmpt=oP[8].offsetLeft;
                oP[8].style.left=oP[i].offsetLeft+"px";
                oP[i].style.left=tmpt+"px";
            }else{
                alert("我周围都是图片，动不了")
                 }
        }
		
       //点击开始按钮，则打乱图片
        oBt.onclick=function () {
            disOrder();
        }

		//给所有拼图方块加上点击事件监听并设置回调函数
        myAddEvent(oP[0],'click',function(){pull(0)});
        myAddEvent(oP[1],'click',function(){pull(1)});
        myAddEvent(oP[2],'click',function(){pull(2)});
        myAddEvent(oP[3],'click',function(){pull(3)});
        myAddEvent(oP[4],'click',function(){pull(4)});
        myAddEvent(oP[5],'click',function(){pull(5)});
        myAddEvent(oP[6],'click',function(){pull(6)});
        myAddEvent(oP[7],'click',function(){pull(7)});
        myAddEvent(oP[8],'click',function(){pull(8)});
        
		
 }

