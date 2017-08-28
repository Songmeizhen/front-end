	/* 
	 *JavaScript DocumenDocument  
	 *Author: song
	 *Date:	2017-8-27
	 *功能：	登陆界面信息确认，登陆成功跳转到评论界面，注册可跳转到注册界面
	 *
	 */
	
	
	
	window.onload=function(){
		
		//创建ajax对象的函数,做兼容性判断
		function createAjax(){
			var ajax=null;
			try{
				ajax=new XMLHttpRequest();
			   }catch(e)
			   {try{
					 ajax=new ActiveXObject("Msxml2.XMLHTTP");	
					}
				catch(e)
			   {try{
					 ajax=new ActiveXObject("Microsoft.XMLHTTP");
					}
				catch(e)
			   {alert(ajax);
			   }
			   }
			   }
		    return ajax;
		}
		
		//点击登陆后向服务器传输数据判断是否跳转					
		function connect(){
			//取出输入的数据并转为JSON
			var user=document.getElementById("userName").value,
				pass=document.getElementById("password").value,
				postStr={"userName":user,"password":pass},
			    data=JSON.stringify(postStr);
			//与服务器建立连接
				ajax.open('post','php/signin1.php',true);
				ajax.setRequestHeader("Content-type","application/json; charset=utf-8");
				ajax.send(data);
			//连接成功则跳转，负责保持页面并清空输入数据
			ajax.onreadystatechange=function(){
				if(ajax.readyState==4){
					if(ajax.status==200){
						var  resp=ajax.responseText;
							 alert(resp)
						if(resp=="欢迎继续浏览!"){
							location.href="Comment.html";
						}else if(resp=="密码错误"){
							document.getElementById('password').value="";
						}else{
							document.getElementById('userName').value="";
							document.getElementById('password').value="";
						}
					}
				}
			}
			}
			
			//记住密码，保存用户登陆数据在COOKIE里
		function setCookie(){
			//获取用户输入
			var user=document.getElementById("userName").value,
			    pass=document.getElementById("password").value,
			    oDate=new Date();
			oDate.setDate(oDate.getDate()+14);
			document.cookie = user+'='+pass+';expires='+oDate;
		}
					
			//通过COOCIE找到用户名及其记住的密码自动输入密码
		function getCookie(user){
			var  arr=document.cookie.split('; '),
			     arr2=[];
			//将COOKIE分割保存在数组中
			for(var i=0;i<arr.length;i++){
				arr2.push(arr[i].split("="));
			}
			//自动输入密码
			for(var k=0;k<arr.length;k++){
				if(user==arr2[k][0]){
					document.getElementById("password").value=arr2[k][1];
				}						
			}
		}
										
		//初始化AJAX和操作按钮，在点击保存密码时保存
		var ajax=createAjax(),			
		    oCK=document.getElementById('check'),
		    oSub=document.getElementById('sub'),
		    oU=document.getElementById("userName");
		oCK.onclick=function(){
			if(oCK.checked==true){
				setCookie();
			}else{
				oCK.cheched=false;
			}
		}
		
		//用户名输入完毕，用户输入框失去焦点时，自动补全密码
		oU.onblur=function(){
			var user=oU.value;
				getCookie(user);
		}
		
		//点击登陆后验证
		oSub.onclick=connect;

}