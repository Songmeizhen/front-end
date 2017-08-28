<?php
header("Content-Type:text/html;charset=utf8");
/*
**********************************************
	Author:	song
	Date:	2017-8-27

	usage:
			weibo.php?act=add&content=xxx	添加一条
				返回：{error:0, id: 新添加内容的ID, time: 添加时间}
			
			weibo.php?act=get_page_count	获取页数
				返回：{count:页数}
			
			weibo.php?act=get&page=1		获取一页数据
				返回：[{id: ID, content: "内容", time: 时间戳, acc: 顶次数, ref: 踩次数}, {...}, ...]
			
			weibo.php?act=acc&id=12&a=1|2	顶某一条数据，一个账号只能顶一次，a=1顶，a=2，删除
				返回：{error:0}
			
			weibo.php?act=ref&id=12&a=1|2	踩某一条数，一个账号只能踩一次，a=1踩，a=2，删除
				返回：{error:0}
				
			weibo.php?act=del&id=12			删除一条数据，如果删除人和发表人不一样，则不能删除
				成功返回：删除成功 
				失败返回：这不是你的微博
			weibo.php?act=usName            输出登录名
				成功返回：用户名
				失败返回：1
			weibo.php?act=acMsg             输出点赞信息，防止重复点赞
				返回：{data:[用户点过赞的微博ID]}
			weibo.php?act=acMsg             输出踩信息，防止重复踩
				返回：{data:[用户踩过的微博ID]}
			weibo.php?act=exit              退出登陆
				返回：{error:0}
	
	注意：	服务器所返回的时间戳都是秒（JS是毫秒）
**********************************************
*/

//创建数据库之类的
$db=@mysql_connect('localhost', 'root', '') or @mysql_connect('localhost', 'root', 'admin');

mysql_query("set names 'utf8'");
mysql_query('CREATE DATABASE s_ajax');

mysql_select_db('zns_ajax');
//创建微博表
$sql1= <<< END
CREATE TABLE  `s_ajax`.`weibo` (
`ID` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`content` TEXT NOT NULL ,
`time` INT NOT NULL ,
`acc` INT NOT NULL ,
`ref` INT NOT NULL
) CHARACTER SET utf8 COLLATE utf8_general_ci
END;

mysql_query($sql1);
//创建级联微博和用户点赞数据中间表
$sql2= <<< END
CREATE TABLE  `s_ajax`.`middle` (
`imid` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`uid` TEXT NOT NULL ,
`wid` INT NOT NULL ,
foreign key middle_uid_key(uid) references us(id) on delete cascade,
foreign key middle_wid_key(wid) references weibo(ID) on delete cascade
) CHARACTER SET utf8 COLLATE utf8_general_ci
END;

mysql_query($sql2);
//创建级联微博和用户踩数据中间表
$sql3= <<< END
CREATE TABLE  `s_ajax`.`middler` (
`imid` INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
`uid` TEXT NOT NULL ,
`wid` INT NOT NULL ,
foreign key middler_uid_key(uid) references us(id) on delete cascade,
foreign key middler_wid_key(wid) references weibo(ID) on delete cascade
) CHARACTER SET utf8 COLLATE utf8_general_ci
END;

mysql_query($sql3);

//正式开始

$act=$_GET['act'];
$PAGE_SIZE=6;
//session开始
@session_start();
//确认get内容
switch($act)
{
	//提交评论
	case 'add':
		
		$usId=$_SESSION["user"]["id"];
		$content=urldecode($_GET['content']);
		$time=time();
		
		$content=str_replace("\n", "", $content);
		
		$sql="INSERT INTO weibo (ID, content, time, acc, ref,uid) VALUES(0, '{$content}', {$time}, 0, 0,{$usId})";
		
		mysql_query($sql);
		
		$res=mysql_query('SELECT LAST_INSERT_ID()');
		
		$row=mysql_fetch_array($res);
		
		$id=(int)$row[0];
		
		echo "{\"error\": 0, \"id\": {$id}, \"time\": {$time}}";
		break;
	//获取页面总数
	case 'get_page_count':
		$sql="SELECT COUNT(*)/{$PAGE_SIZE}+1 FROM weibo";
		
		mysql_query($sql);
		
		$res=mysql_query($sql);
		
		$row=mysql_fetch_array($res);
		
		$count=(int)$row[0];
		
		echo "{\"count\": {$count}}";
		break;
	//获取一整页的评论信息，默认设置6条一页
	case 'get':
		$page=(int)$_GET['page'];
		if($page<1)$page=1;
		
		$s=($page-1)*$PAGE_SIZE;
		
		$sql="SELECT ID, content, time, acc, ref FROM weibo ORDER BY time DESC LIMIT {$s}, {$PAGE_SIZE}";
		
		$res=mysql_query($sql);
		
		$aResult=array();
		while($row=mysql_fetch_array($res))
		{
			$arr=array();
			array_push($arr, '"id":'.$row[0]);
			array_push($arr, '"content":"'.$row[1].'"');
			array_push($arr, '"time":'.$row[2]);
			array_push($arr, '"acc":'.$row[3]);
			array_push($arr, '"ref":'.$row[4]);
			
			array_push($aResult, implode(',', $arr));
		}
		if(count($aResult)>0)
		{
			echo '[{'.implode('},{', $aResult).'}]';
		}
		else
		{
			echo '[]';
		}
		break;
		//收到点赞并处理
	case 'acc':
		$usId=$_SESSION["user"]["id"];
		$id=(int)$_GET['id'];
		$a=(int)$_GET['a'];
		echo $a;
		if($a==1){
		$middle=mysql_query("insert into middle (wid,uid)values($id,$usId)");
				}
		if($a==2){
			mysql_query("delete from middle where wid=$id and uid=$usId");
			}
		$res=mysql_query("SELECT count(*) FROM middle WHERE wid={$id}");
		
		$row=mysql_fetch_array($res);
		
		$old=$row[0];
		
		$sql="UPDATE weibo SET acc={$old} WHERE ID={$id}";
		
		mysql_query($sql);
		
		echo '{"error":0}';
		break;
		//收到踩并处理
	case 'ref':
		$usId=$_SESSION["user"]["id"];
		$id=(int)$_GET['id'];
		$a=(int)$_GET['a'];
		echo $a;
		if($a==1){
		$middle=mysql_query("insert into middler (wid,uid)values($id,$usId)");
				}
		if($a==2){
			mysql_query("delete from middler where wid=$id and uid=$usId");
			}
		$res=mysql_query("SELECT count(*) FROM middler WHERE wid={$id}");
		
		$row=mysql_fetch_array($res);
		
		$old=$row[0];
		
		$sql="UPDATE weibo SET ref={$old} WHERE ID={$id}";
		
		mysql_query($sql);
		
		echo '{"error":0}';
		break;
		//收到删除消息并处理
	case 'del':
		$usId=$_SESSION["user"]["id"];
		$id=(int)$_GET['id'];
		$uid1=mysql_query("select uid FROM weibo WHERE ID={$id}");
		$uid2=mysql_fetch_array($uid1);
		$uid=$uid2[0];
		$sql="DELETE FROM weibo WHERE ID={$id} and uid={$usId}";
		mysql_query($sql);
		if($usId==$uid){
			echo '删除成功';
			}
			else
		{
			echo '这不是你的微博';}
		break;
		//输出用户名信息
	case 'usName':
		@$usName=$_SESSION["user"]["userName"];
		if($usName){	 		
		echo $usName;}
		else {echo "1";}
		break;
		//输出用户点赞信息
	case 'acMsg':
		$usId=$_SESSION["user"]["id"];
		@$res=mysql_query("SELECT imid,wid FROM middle WHERE uid=$usId");
		$data1=array();
			while($imids=mysql_fetch_array($res))
			{
				array_push($data1,$imids[1]);
			 }
		$data=implode(',',$data1);
		echo "{\"data\":[".$data."]}";
		break;
		//输出用户踩信息
	case 'reMsg':
		$usId=$_SESSION["user"]["id"];
		@$res=mysql_query("SELECT imid,wid FROM middler WHERE uid=$usId");
		$data1=array();
			while($imids=mysql_fetch_array($res))
			{
				array_push($data1,$imids[1]);
			 }
		$data=implode(',',$data1);
		echo "{\"data\":[".$data."]}";
		break;
		//退出登陆
	case 'exit':
		session_unset();
		session_destroy();
		echo '{"error":0}';
		break;
		
}
?>

