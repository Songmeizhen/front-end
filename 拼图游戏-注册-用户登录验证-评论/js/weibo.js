// JavaScript Document ;


//引入angular控制器
	var app=angular.module("PlayComment",[]);
	app.controller("weibo",function($scope,$http){
    
//功能函数开始	
	//获取用户名信息
	function getUs(){
		$http.get('php/weibo1.php',{
		params:{act:"usName"}
		}).success(function(res){
			$scope.usMsg=res;
			if($scope.usMsg==1){
			   $scope.usMsg="未登陆";
			}
		}).error(function(){
			alert("错误！")
		});
	}
	
	//获取动态页面数
	function setPages(){
		$http.get('php/weibo1.php',{
		params:{act:'get_page_count'}
		}).success(function(json){
				markPage(json.count);
		}).error(function(){
				alert('错误');
		});
	}
	
	//根据用户操作设置页面索引状态
	function markPage(cur){
		$scope.pages=[];
		for(var i=1;i<=cur;i++){
			if(i==$scope.curPage){
				$scope.pages.push({num:i,className:"active"})
			}else{
				$scope.pages.push({num:i,className:""})
			}
		}
	}
	
	//输出整页数据，保存首页数据
	 function putPage(p){
		  $http.get('php/weibo1.php',{
			  params:{act:'get',page:p}
			  }).success(function(arr){
				  $scope.replies=arr;
				  if($scope.curPage==1){
				  $scope.replies1=arr
				  }
			  }).error(function(){
				  alert('错误');
			  });
		  }
			  
	//点赞和踩的控制，登陆人才可以点赞和踩，点奇数次增加1，点偶数次取消
	  function taste(id,type,msg){
		  if($scope.usMsg!='未登陆'){
	//获取用户点赞或踩的信息
			  $http.get('php/weibo1.php',{
				  params:{act:msg}
			  }).success(function(res){
				  $scope.data=[];
				  $scope.data=$scope.data.concat(res.data);
				  $scope.a=false;
				  for(var j=0;j<$scope.data.length;j++){
					  if($scope.data[j]==id){
					  $scope.a=true ;
					  }
				  }
				  $scope.a=!$scope.a;
				  var b;
					  if($scope.a){
						  b=1;
					  }else{
						  b=2;
					  }
	//更新用户点赞或踩的信息
			  $http.get('php/weibo1.php',{
				  params:{act:type,id:id,a:b}
				  }).success(function(res){
					  for(var i=0;i<$scope.replies.length;i++){
						  if(id==$scope.replies[i].id&&$scope.a){
						  $scope.replies[i][type]+=1;
						  }else if(id==$scope.replies[i].id&&!$scope.a){
							  $scope.replies[i][type]-=1;
						  }
					  }
				  }).error(function(){
					  alert('错误');
				  });
			   });		
		   }else{
			  alert("请先登陆!");
		   }
	   }
	//功能函数结束
		  
	//初始化页面信息
	$scope.curPage=1;
	$scope.replies=[];	
	$scope.usMsg=="未登陆";
	$scope.usEx="退出登陆";
	setPages();
	putPage(1);
	getUs();
			  
	 //切换页面
    $scope.switchPage=function(p){
		$scope.curPage=p;
		markPage($scope.pages.length);
		putPage(p);
	}
	
	//登陆才可提交评论，提交评论并显示，在提交评论时把回复加在首页，同时更新所有数据。
	$scope.submitM=function(){
		if($scope.usMsg!='未登陆'){
			$http.get('php/weibo1.php',{
			params:{act:"add",content:$scope.inputText}
			}).success(function(json){
				$scope.replies1.unshift({
					id: json.id,
					content:$scope.inputText,
					time: json.time,
					acc:0,
					ref:0
				});
				$scope.inputText="";
				setPages();
				putPage($scope.curPage);
			}).error(function(){
					alert('错误');
			});
		 }else{
			 alert("请先登陆！")
		 }
	}
	
	//提交删除请求，更新页面数据
	$scope.fnDe=function(id){
		$http.get('php/weibo1.php',{
			 params:{act:"del",id:id}
		}).success(function(res){
			 setPages();
			 putPage($scope.curPage);
			 alert(res);
		}).error(function(){
			 alert('错误');
		});
	}
	
	//点击未登陆可以跳转到登陆页面
	$scope.fnUs=function(){
		if($scope.usMsg=="未登陆"){
			location.href="signin1.html"
		}else{
			return false;
		}
	}
	
	//点赞和踩提交
	$scope.fnAc=function(id){
		taste(id,"acc","acMsg");
	}
	$scope.fnRe=function(id){
		taste(id,"ref","reMsg");
	}
	
	
	//退出登陆，清空session		
	$scope.fnEx=function(){
		$http.get('php/weibo1.php',{
			params : {act:"exit"}
		}).success(function(){
			$scope.usMsg = '未登陆';
			alert("已退出登陆")
		});
	}
	//控制结束
	})