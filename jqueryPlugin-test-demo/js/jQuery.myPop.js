//jQuery.MyPop.js
;(function($){
	//一、定义构造函数MyPop
	var MyPop=function(obj,opt){
		this.$element=obj,

		this.defaults={
			'headTxt':'这是默认的头部内容',
			'bodyTxt':'这是默认的主体内容默认的主体内容默认的主体内容默认的主体内容',
            'headBg':'white',
            'bodyBg':'white',
            'footBg':'white'
		},
		this.options=$.extend({},this.defaults,opt);
	};
	//二、定义MyPop的方法
	MyPop.prototype={
        //方法 popTxt：自定义弹窗内容
		popTxt:function(){
			//弹窗的出现，样式
			$('#pop-back').css({display:'block'});
			$('html').css({overflow:'hidden'});
			$('#pop-content').animate({top: 15, opacity: 'show'}, 150);
			$('#pop-close,#pop-back').on('click',function(){
				$('#pop-content').animate({top: -15, opacity: 'hide'}, 150,function(){
					$('#pop-back').css({display:'none'});
					$('html').css({overflow:'auto'});
				});
			});
			//自定义弹窗的内容
			this.$element.children('.pop-head').text(this.options.headTxt);
			this.$element.children('.pop-body').text(this.options.bodyTxt);
			//返回 this.$element=obj, 保持链式操作
			return this.$element;
		},
        //方法 popBgcolor：自定义弹窗的背景色
        popBgcolor:function(){
            $('.pop-head').css({background:this.options.headBg});
            $('.pop-body').css({background:this.options.bodyBg});
            $('.pop-foot').css({background:this.options.footBg});
            return this.$element;
        }
	};
	//三、插件中使用MyPop对象创建实例并返回
	$.fn.popPlugin=function(options){
		//利用 构造函数MyPop 创建实例
		var myPop=new MyPop($(this),options);
        //直接返回实例 myPop
        return myPop;

		//调用实例的方法 popTxt() ，并返回
		// return myPop.popTxt();
        
	}

})(jQuery);

//
;(function($,window,document,undefined){
    //
})(jQuery,window,document);