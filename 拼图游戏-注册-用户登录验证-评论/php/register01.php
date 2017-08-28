<?php
	/*
	 *Author:	song
	 *Date:	2017-8-27
	 *功能：判断用户名是否已注册
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
	
	//如果没有用户表，则建立一个
	$sql= <<< END
		CREATE TABLE  `s_ajax`.`us` (
		`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
		`userName` TEXT NOT NULL ,
		`password` INT NOT NULL ,
		`tel` VARCHAR(40) NOT NULL 
		) CHARACTER SET utf8 COLLATE utf8_general_ci 
END;
	@mysql_query($sql);
	
	//循环取出数据库中所有用户内容并储存在数组中
	@$num1=mysql_query("select count(*) from us",$con);
	@$num2=mysql_fetch_assoc($num1);
	$num=$num2['count(*)'];
	for($i=1;$i<=$num;$i++){
		@$statement[$i]="select * from us where id=$i";
		@$res[$i]=mysql_query($statement[$i],$con);
		@$arr[$i]=mysql_fetch_assoc($res[$i]);
	}
	
	//判断用户名是否存在，并输出判断结果
	for($j=1;$j<=$num;$j++){
		@$nameConfirm+=($userName==$arr[$j]['userName']);
	}
	if(@$nameConfirm>0){
		echo '账号存在';
	}else{
		echo '可以注册';
	}










?>