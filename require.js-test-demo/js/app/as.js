define(function(){
	var mAdd=function(num1,num2){
		return num1+num2;
	}
	var mSub=function(num1,num2){
		return num1-num2;
	}
	return{
		mAdd:mAdd,
		mSub:mSub
	};
});

//若该模块依赖其它模块，增加一个数组参数
/*
define(['md'],function(md){
	md.mult(2,3);
});
*/
