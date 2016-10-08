/**
 * jQuery.lwsPop.js v1.0.0
 * guojc
 * 2016/8/29
 * http://www.lwsmusic.com
 */
 /*
	cansel: 			boolean	true/false	是否显示“消失按钮”
	popType: 			string				弹窗的类型
	sureCallback: 		function			点击确定的回调函数
 */
;(function($,window,document,undefined){
	//一、定义构造函数lwsPop
	var LwsPop=function(obj,opt){
		this.$element=obj,

		this.defaults={
			cansel: true,
			popType: '',
			popText: '',
            sureCallback: function(){}
		},
		this.options=$.extend({},this.defaults,opt);
		
		if(this.options.popType == ''){
			return;

		}else if(this.options.popType == 'changeMimaHtml'){
			//创建弹窗：修改密码
			var newHtml = LwsPop.prototype.changeMimaHtml();
			$('.lws-pop-user,.lws-pop-bg').remove();
			$('body').append(newHtml);

		}else if(this.options.popType == 'checkPhoneHtml'){
			//创建弹窗：验证手机0
			var newHtml = LwsPop.prototype.checkPhoneHtml();
			$('.lws-pop-user,.lws-pop-bg').remove();
			$('body').append(newHtml);

		}else if(this.options.popType == 'checkPhoneHtml1'){
			//创建弹窗：验证手机1
			var newHtml = LwsPop.prototype.checkPhoneHtml1();
			$('.lws-pop-user,.lws-pop-bg').remove();
			$('body').append(newHtml);

		}else if(this.options.popType == 'checkPhoneHtml2'){
			//创建弹窗：验证手机2
			var newHtml = LwsPop.prototype.checkPhoneHtml2();
			$('.lws-pop-user,.lws-pop-bg').remove();
			$('body').append(newHtml);

		}else if(this.options.popType == 'popInfo'){
			//创建弹窗：验证手机2
			var newHtml = LwsPop.prototype.popInfo(this.options.popText);
			$('.lws-pop-user,.lws-pop-bg').remove();
			$('body').append(newHtml);

		}else if(this.options.popType == 'headHtml'){
			//创建弹窗：修改头像
			var newHtml = LwsPop.prototype.headHtml(this.options.cansel);
			$('.lws-pop-user,.lws-pop-bg').remove();
			$('body').append(newHtml);

		}else{
			return;
		}
		//显示弹窗
		LwsPop.prototype.showPop();
		//删除弹窗
		LwsPop.prototype.hidePop();
		//点击确定，函数回调
		LwsPop.prototype.sureCallback(this.options.sureCallback);

	};
	//二、定义lwsPop的方法
	LwsPop.prototype={
		//点击确定，回调
		sureCallback: function(callback){
			$('body').on('click','.submit-sure',function(){
				callback();
			});
		},
		//修改密码，创建弹窗html
		changeMimaHtml: function(){
			var newHtml = '';
				newHtml +=	'<div class="lws-pop-bg"></div>'

						+	'<div class="lws-pop-user">'
						+		'<div class="pop-head">'
						+			'<p><a href="javascript:;" class="head-close"></a></p>'
						+			'<h4 class="head-h4">修改密码</h4>'
						+		'</div>'

						+		'<div class="pop-main">'
						+			'<div class="form-line form-lime-warn">'
						+				'<div class="line-input">'
						+					'<input class="J_mima J_mimaYuan" placeholder="旧密码" type="password" maxlength="20">'
						+				'</div>'
						+				'<div class="line-warn">'
						+					'<span class="warn-text">密码格式不对</span>'
						+					'<span class="warn-fuhao">!</span>'
						+				'</div>'
						+			'</div>'

						+			'<div class="form-line form-lime-warn">'
						+				'<div class="line-input">'
						+					'<input class="J_mima J_mimaOld" placeholder="新密码" type="password" maxlength="20">'
						+				'</div>'
						+				'<div class="line-warn">'
						+					'<span class="warn-text">密码格式不对</span>'
						+					'<span class="warn-fuhao">!</span>'
						+				'</div>'
						+			'</div>'

						+			'<div class="form-line form-lime-warn">'
						+				'<div class="line-input">'
						+					'<input class="J_mima J_mimaNew" placeholder="确认密码" type="password" maxlength="20">'
						+				'</div>'
						+				'<div class="line-warn">'
						+					'<span class="warn-text">两次密码输入不一致</span>'
						+					'<span class="warn-fuhao">!</span>'
						+				'</div>'
						+			'</div>'
						////暂时不做验证码，临时隐藏
						// +			'<div class="form-line form-line-ma">'
						// +				'<div class="line-input form-lime-warn">'
						// +					'<input class="input-text-ma J_textMa" placeholder="验证码" type="text">'
						// +				'</div>'
						// +				'<a href="javascript:;" class="input-num-ma">623456</a>'
						// +			'</div>'
						+		'</div>'

						+		'<div class="pop-foot">'
						+			'<a href="javascript:;" class="submit-fail">确认修改密码</a>'
						+		'</div>'

						+	'</div>';

			return newHtml;
		},
		//lws-user-login-phone_201608302045
		//手机号验证0，创建弹窗html
		checkPhoneHtml: function(){
			var newHtml = '';
				newHtml +=	'<div class="lws-pop-bg"></div>'

						+	'<div class="lws-pop-user">'
						+		'<div class="pop-head">'
						+			'<p><a href="javascript:;" class="head-close"></a></p>'
						+			'<h4 class="head-h4">安全验证</h4>'
						+		'</div>'

						+		'<div class="pop-main">'
						+			'<p class="main-text">为了保护帐号安全，需要验证手机有效性</p>'
						+			'<p class="main-text">点击发送短信按钮，将会发送一条有验证码的短信至手机</p>'

						+			'<div class="main-pic">'
						+				'<img src="http://static.lwsmusic.com/lws-user-login-phone_201608302045.png" />'
						+			'</div>'

						+			'<div class="form-line form-lime-warn">'
						+				'<div class="line-input">'
						+					'<input class="J_phone" placeholder="手机号" type="text" maxlength="11">'
						+				'</div>'
						+				'<div class="line-warn">'
						+					'<span class="warn-text">手机号格式不对</span>'
						+					'<span class="warn-fuhao">!</span>'
						+				'</div>'
						+			'</div>'
						+		'</div>'

						+		'<div class="pop-foot">'
						+			'<a href="javascript:;" class="submit-fail">发送短信</a>'
						+		'</div>'

						+	'</div>';

			return newHtml;
		},
		//手机号验证1，创建弹窗html
		checkPhoneHtml1: function(){
			var newHtml = '';
				newHtml +=	'<div class="lws-pop-bg"></div>'

						+	'<div class="lws-pop-user">'
						+		'<div class="pop-head">'
						+			'<p><a href="javascript:;" class="head-close"></a></p>'
						+			'<h4 class="head-h4">安全验证</h4>'
						+		'</div>'

						+		'<div class="pop-main">'
						+			'<p class="main-text">为了保护帐号安全，需要验证手机有效性</p>'
						+			'<p class="main-text">点击发送短信按钮，将会发送一条有验证码的短信至手机</p>'

						+			'<div class="form-line">'
						+				'<div class="line-input">'
						+					'<input class="J_phone" placeholder="手机号" type="text" maxlength="11">'
						+				'</div>'
						+				'<div class="line-warn">'
						+					'<span class="warn-text">手机号格式不对</span>'
						+					'<span class="warn-fuhao">!</span>'
						+				'</div>'
						+			'</div>'
						+			'<div class="form-line form-line-ma input-num-ma-phone">'
						+				'<div class="line-input form-lime-warn">'
						+					'<input class="input-text-ma J_textMa" placeholder="验证码" type="text">'
						+				'</div>'
						+				'<a href="javascript:;" class="input-num-ma">重新发送</a>'
						+			'</div>'
						+		'</div>'

						+		'<div class="pop-foot">'
						+			'<a href="javascript:;" class="submit-fail">下一步</a>'
						+		'</div>'

						+	'</div>';

			return newHtml;
		},
		//手机号验证2，创建弹窗html
		checkPhoneHtml2: function(){
			var newHtml = '';
				newHtml +=	'<div class="lws-pop-bg"></div>'

						+	'<div class="lws-pop-user">'
						+		'<div class="pop-head">'
						+			'<p><a href="javascript:;" class="head-close"></a></p>'
						+		'</div>'

						+		'<div class="pop-main">'
						+			'<h4 class="main-h4">验证完成</h4>'
						+			'<p class="main-text">你的手机号<span>15011760780</span>已通过安全验证！</p>'
						+		'</div>'

						+	'</div>';

			return newHtml;
		},
		//提示信息，创建弹窗html
		popInfo: function(popText){
			var newHtml = '';
				newHtml +=	'<div class="lws-pop-bg"></div>'

						+	'<div class="lws-pop-user">'
						+		'<div class="pop-head">'
						+			'<p><a href="javascript:;" class="head-close"></a></p>'
						+		'</div>'

						+		'<div class="pop-main">'
						+			'<h4 class="main-h4">'+popText+'</h4>'
						+			'<p class="main-text">'+popText+'</p>'
						+		'</div>'

						+	'</div>';

			return newHtml;
		},
		//修改头像，创建弹窗html
		headHtml: function(cansel){
			var newHtml = '';
				newHtml +=	'<div class="lws-pop-bg"></div>'

						+	'<div class="lws-pop-cont">'
						+		'<div class="pop-head">'
						+			'<h4 class="head-h4">设置头像</h4>'
						+			'<a href="javascript:;" class="head-close">关闭</a>'
						+		'</div>'

						+		'<div class="pop-main">'
						+			'<div class="main-left">'
						+				'<div class="left-head head-pic"><img src="http://static.lwsmusic.com/account_default_header_201608020459.png"></div>'
						+				'<p>头像预览</p>'
						+				'<label class="change-head J_upHead" for="file">重新上传</label>'
						+				''
						+			'</div>'
						+			'<div class="main-right">'
						// +				'<div class="right-head head-pic"><img src="http://static.lwsmusic.com/account_default_header_201608020459.png"></div>'
						+				'<div class="right-head head-pic">'
						+					'<label for="file" class="upload-label">'
						+						'<input type="hidden" class="image-name">'
						+						'<input type="hidden" class="image-name">'
						+						'<img class="upload-images" src="http://static.lwsmusic.com/account_default_header_201608020459.png" alt="">'
						+					'</label>'
						+				'</div>'
						+			'</div>'
						+		'</div>'

						+		'<div class="pop-foot">';
			//是否显示取消按钮
			if(cansel){
				newHtml +=			'<div class="pop-cansel"><a href="javascript:;">取消</a></div>';
			}	
				newHtml +=			'<div class="pop-sure"><a href="javascript:;">确定</a></div>'
						+		'</div>'

						+	'</div>';

			return newHtml;
		},
		showPop: function(){
			$('.lws-pop-bg').css({display:'block'});
			$('body').scrollTop(0);
			$('html').css({overflow:'hidden'});
			// $('.lws-pop-cont').animate({opacity: 'show'}, 150);
			$('.lws-pop-user').animate({opacity: 'show'}, 150);
		},
		hidePop: function(){
			$('.head-close,.pop-cansel,.lws-pop-bg').on('click',function(){
				// $('.lws-pop-cont').animate({opacity: 'hide'}, 150,function(){
				$('.lws-pop-user').animate({opacity: 'hide'}, 150,function(){
					$('.lws-pop-bg,.lws-pop-cont').remove();
					$('html').css({overflow:'auto'});
				});
			});
		}
        
	};
	//三、插件中使用lwsPop对象创建实例并返回
	$.fn.popPlugin=function(options){
		//利用 构造函数lwsPop 创建实例
		var lwsPop=new LwsPop($(this),options);
        //直接返回实例 lwsPop
        return lwsPop;
        
	}


})(jQuery,window,document);
