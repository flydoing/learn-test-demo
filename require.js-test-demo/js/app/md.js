define(function(){
	var mult=function(num1,num2){
		return num1*num2;
	}
	var divi=function(num1,num2){
		return num1/num2;
	}
	return{
		mult:mult,
		divi:divi
	};
});