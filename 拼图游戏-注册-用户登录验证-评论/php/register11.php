<?php
	/*
	 *Author:	song
	 *Date:	2017-8-27
	 *功能：注册新用户
	 *
	 */
	header("Content-Type:text/html;charset=utf8");
	header('Content-Type:application/json;charset=utf-8');
	
	//从客户端获取数据
	@$json=file_get_contents("php://input");
	@$result=json_decode($json,true);
	@$userName=$result['userName'];
	@$password=$result['password'];
	@$tel=$result['tel'];
	
	//从数据库获取数据
	@$mysql_server_name='localhost';
	@$mysql_username='root';
	@$mysql_password='';
	@$mysql_database='s_ajax';
	
	//与数据库建立连接
	@$con=mysql_connect($mysql_server_name,$mysql_username,$mysql_password) or die('连接出错');
	@mysql_query('set names "utf8"');
	@mysql_select_db($mysql_database,$con);
	
	//获取用户表中原数据总数
	@$num1=mysql_query("select count(*) from us",$con);
	@$num2=mysql_fetch_assoc($num1);
	$num0=$num2['count(*)'];
	
	//向数据库写入新用户数据
	@$num3="insert into us (userName,password,tel)values('$userName','$password','$tel')";
	@mysql_query($num3,$con);
	
	//获取用户表中新数据总数
	@$num4=mysql_query('select count(*) from us ',$con);
	@$num5=mysql_fetch_assoc($num4);
	$num=$num5['count(*)'];
	
	//比较新旧数据总数，如果新数组总数增加，则注册成功
	if($num>$num0){
		echo '注册成功';
	}else{
		echo '注册失败';
	}


?>