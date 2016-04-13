require.config({
    baseUrl:"js/app",
    paths:{
        //jquery,相对于baseUrl:"js/app"
        "jquery": "../lib/jquery-1.12.2.min",
        "as": "as",
        "md": "md",
    }
    /*
    //配置不兼容模块，deps改模块的依赖性；exports该模块外部调用时的名称
    shim:{
        "jquery.scroll":{
            deps:['jquery'],
            exports:'jQuery.fn.scroll'
        }
    }
    */
});

//可以这样写：["jquery","app/as","app/md"];
require(["jquery","as","md"],function($,as,md){

    $(function(){
        /*
        $('#add').click(function(){
            var $num1=parseInt($('#num1').val());
            var $num2=parseInt($('#num2').val());
            var res=as.add($num1,$num2);
            $('#res').val(res);
        });
        $('#sub').click(function(){
            var $num1=parseInt($('#num1').val());
            var $num2=parseInt($('#num2').val());
            var res=as.sub($num1,$num2);
            $('#res').val(res);
        });
        $('#mult').click(function(){
            var $num1=parseInt($('#num1').val());
            var $num2=parseInt($('#num2').val());
            var res=md.mult($num1,$num2);
            $('#res').val(res);
        });
        $('#divi').click(function(){
            var $num1=parseInt($('#num1').val());
            var $num2=parseInt($('#num2').val());
            var res=md.divi($num1,$num2);
            $('#res').val(res);
        });
        */
        //同样的功能，上面注释掉的太笨重了，改成下面这段
        $('button').click(function(){
            var $num1=parseInt($('#num1').val());
            var $num2=parseInt($('#num2').val());
            var $thisId=$(this).attr('id');

            switch($thisId){
                case 'add':
                    var res=as.mAdd($num1,$num2);
                    break;
                case 'sub':
                    var res=as.mSub($num1,$num2);
                    break;
                case 'mult':
                    var res=md.mult($num1,$num2);
                    break;
                case 'divi':
                    var res=md.divi($num1,$num2);
                    break;
            }

            $('#res').val(res);
        });

    });

});