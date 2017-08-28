<?php
	/*
	 *Author:	song
	 *Date:	2017-8-27
	 *功能：验证用户名与密码
	 *
	 */
	header('Content-Type: text/html; charset=utf-8');
	header('Content-Type:application/json;charset=utf-8');
	
	//从客户端获取数据
	@$message=file_get_contents("php://input");
	@$arr=json_decode($message,true);
	@$userName=$arr['userName'];
	@$password=$arr['password'];
	
	//从数据库获取数据，初始化数据库信息
	@$mysql_server_name='localhost';
	@$mysql_username='root';
	@$mysql_password='';
	@$mysql_database='s_ajax';
	
	//与数据库建立连接
	@$con=mysql_connect($mysql_server_name,$mysql_username,$mysql_password) or die('连接错误');
	@mysql_query('set names "utf8"');
	@mysql_select_db($mysql_database,$con);
	@$num1=mysql_query('select count(*) from us ',$con);
	
	//取出数据库中所有泳裤内容并储存在数组中
	@$num2=mysql_fetch_assoc($num1);
	$num=$num2['count(*)'];
	for($i=1;$i<=$num;$i++){
		$statement[$i]="select * from us where id=$i";
		@$result[$i]=mysql_query($statement[$i],$con);
		@$arr[$i]=mysql_fetch_assoc($result[$i]);
	}
	
	//将数据库中数据与用户登录数据比较
	for($j=1;$j<=$num;$j++){
		@$nameConfirm+=(int)($userName==$arr[$j]['userName']);
		@$passConfirm+=(int)(($userName==$arr[$j]['userName'])&&
		(((string)$password)===((string)$arr[$j]['password'])));
	}
	
	//得到比较结果并向客户端输出，同时保存SESSION数据
	if(@$nameConfirm==1&&@$passConfirm==1){
		echo "欢迎继续浏览!";
		@session_start();
		@$us=mysql_query("select * from us where userName='$userName'");
		@$_SESSION["user"]=mysql_fetch_assoc($us);
	} else if(@$nameConfirm==1&&@$passConfirm==0){
		echo "密码错误";
	}else{
		echo "用户名不存在";
	}


?>