//一、定义全局变量
var Data={
    data1:11,
    data2:12,
    data3:13
};

//二、首页JS功能
var Index={
    //init初始化
    init:function(){
        //显示Data的初始值
        Tool.tag('span')[0].innerText=Data.data1;
        Tool.id('spa').innerText=Data.data2;
        Tool.getByclass('spa')[0].innerText=Data.data3;
        //字符串超出截取
        Tool.id('str').innerText=Tool.getSubstr(Tool.id('str').innerText,20);
        //点击出现弹窗
        Tool.id('pop-click').onclick=function(){
            var txt1='1这是自定义的头部',
                txt2='这是自定义的内容自定义的内容自定义的内容';
            Func.popShow(txt1,txt2);
        };
    }
};

//三、功能模块
var Func={
    popShow:function(headTxt,bodyTxt){
        //弹窗的出现，样式
        $('#pop-back').css({display:'block'});
        $('html').css({overflow:'hidden'});
        $('#pop-content').animate({top: 35, opacity: 'show'}, 150);
        //弹窗内容修改
        $('.pop-head').text(headTxt);
        $('.pop-body').text(bodyTxt);
        //弹窗的关闭，样式
        $('#pop-close,#pop-back').on('click',function(){
            $('#pop-content').animate({top: -35, opacity: 'hide'}, 150,function(){
                $('#pop-back').css({display:'none'});
                $('html').css({overflow:'auto'});
            });
        });
    },
    func1:function(){},
    func2:function(){}
};

//四、工具模块
var Tool={
    //自定义获取获取tag
    tag:function(tag){
        return document.getElementsByTagName(tag);
    },
    //自定义获取id
    id:function(oId){
        return document.getElementById(oId);
    },
    //自定义获取class
    getByclass:function(sClass){
        var aResult=[];
        var aEle=document.getElementsByTagName('*');
        for(var i=0;i<aEle.length;i++){
            if(aEle[i].className==sClass){
                aResult.push(aEle[i]);
            }
        }
        return aResult;
    },
    //字符串截取省略
    getSubstr:function(str,len){
        var str=(str.length > len) ? str.substr(0,len)+'...' : str;
        return str;
    }
};

//五、执行入口
window.onload=function(){
    Index.init();
};

