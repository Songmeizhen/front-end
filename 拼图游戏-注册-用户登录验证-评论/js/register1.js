	
	/*
	 *JavaScript Document
	 *Author:	song
	 *Date:	2017-8-27
	 *功能：判断用户名是否已注册
	 *
	 */
	  
	  window.onload=function(){
		  //创建三种正则表达式分别验证用户名密码手机号格式
           var reU=/^[a-zA-Z]\w{5,17}$/,
               reP=/^\S{6,16}$/,
               reT=/^(0\d{2,3}-)?\d{7,11}$/;
 		  
		  //获取表单和按钮对象
           var oUser=document.getElementById("userName"),
               oPsw1=document.getElementById("password1"),
               oPsw2=document.getElementById("password2"),
               oTel=document.getElementById("tel"),
			   oSub=document.getElementById('sub');
			   
			   
			//通过正则表达式验证输入格式的函数
            function  checkFormat(key,id,re ) {
                var index=key.value;
                if(re.test(index)){
                	document.getElementById(id).innerHTML="格式正确";
                }else{
                    document.getElementById(id).innerHTML="格式错误";
                }
            }
			
			//创建并返回AJAX对象的函数
            function createAjax(){
                var ajax=null;
                try{
                    ajax=new XMLHttpRequest();
                   }catch(e)
				   {try{ 
				   		ajax=new ActiveXObject("Msxml2.XMLHTTP");
					   }catch(e){
                       	ajax=new ActiveXObject("Microsoft.XMLHTTP");
                       			}
                   }
                return ajax;
            }
			
			//与服务器建立连接，成功后执行回调函数
            function connect(target,fn){
			//获取输入内容
                var user=document.getElementById("userName").value,
                    pass=document.getElementById("password1").value,
                    tel=document.getElementById("tel").value,
                    postStr={
                    "userName":user,
                    "password":pass,
                    "tel":tel
                };
			//内容转码发送给服务器
				var data=JSON.stringify(postStr);
				ajax.open('post',target,true);
				ajax.setRequestHeader("Content-type","application/json; charset=utf-8");
                ajax.send(data);
			//执行回调函数
				ajax.onreadystatechange=fn;
			}

		  
		  //创建AJAX对象
		   var ajax=createAjax();
		  //当用户名格式正确且用户名失去焦点时通过AJAX验证用户名是否存在
            oUser.onblur=function(){
                checkFormat(oUser,"sure1",reU);
				if(reU.test(oUser.value))
				{	connect('php/register01.php',function()
					{if(ajax.readyState==4)
                	{if(ajax.status==200)
					{var resp=ajax.responseText;
					document.getElementById("sure1").innerHTML=resp;
					}
					}
					}      
					);               
				}else{
					return false;
				}
			}
			
			//点击注册按钮，返回注册结果，只有当表单输入正确且用户名不存在时可以注册
		  oSub.onclick=function(){
			  if((document.getElementById("sure1").innerText=='可以注册')
				  &&(document.getElementById("sure1").innerText!='账号存在')
				  &&(document.getElementById("sure3").innerText=="密码正确")
				  &&(document.getElementById('sure4').innerText=="格式正确"))
			  {
			  connect('php/register11.php',function()
				  {	if(ajax.readyState==4)
					  {	if(ajax.status==200)
					  {	var resp=ajax.responseText;
						  alert(resp);
						  if(resp=='注册成功')
						  {	location.href='signin1.html'
						  }else{
							  return false;
							   }
					  }
					  }
				  }
			  );
			  }else{
			  alert('输入出现问题不能注册')
				   }
		  }
		  
			//密码区失去焦点时验证输入格式，判断两次密码输入是否一致
            oPsw1.onblur=function(){
                checkFormat(oPsw1,"sure2",reP);
            }
            oPsw2.onblur=function(){
                if(oPsw2.value==oPsw1.value){
                    document.getElementById("sure3").innerHTML="密码正确";
                }else{
                    document.getElementById("sure3").innerHTML="密码错误";
                }
            }
			//验证电话号码格式
            oTel.onblur=function(){
                checkFormat(oTel,"sure4",reT);
            }
		//onload结束	
	}