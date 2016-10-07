  /*
  * faiColorPickerAlp
  *
  * @ 2016.07.30
  * @ guojc
  * @ Maintained by: faiColorPicker  "X:\dev-svn\guojc\src\res\site\js\comm\faiui.src.js"
  * @ (function draggableAlpha)refer to: https://github.com/bgrins/spectrum
  *
  */
//一级颜色面板
(function($){
   /*
    *     @ base                :           @jQuery Selector 注册激活插件的DOM元素 例如: $("BO").faiColorPicker() . 则base就是表示 $("BO")
    *     @ target              :           @jQuery Selector 表示该颜色插件作用的目标,如果不设置,默认和base一样,自己作用自己,(作用于激活插件的DOM元素). 如果设置了, 就是插件激活者设置的DOM元素 (jQuery选择器,不能是原生JavaScript DOM Element)
    *
    *     @ baseattr            :           @string 表示激活插件的DOM元素改变的属性, 默认改变背景色
    *     @ targetattr          :           @string 表示被作用DOM元素改变的属性,默认是改变背景色. 如果你传入一个"border-color", 那么它就会作用于改变target元素的 border-color
    *
    *     @ advance             :           @boolean 是否开启高级颜色选择功能,默认true,传入布尔值 false 则不会有高级颜色选择功能
    *     @ showInTop           :           @boolean 是否是 iframe 中的元素注册了插件? 默认为false.
    *
    *     @ onchange            :           @function 选择颜色时的回调函数                onchange(1.hex; 2.rgb; 3.rgba+hex; 4.rgba+rgb)
    *     @ inputHexStatus      :           @function 二级选择器input选中回调，return两个值：状态值（1、2），颜色值（hex）   简易文本
    *     @ onShowStatus        :           @function return一个值：状态值（1、0）   简易文本
    *
    *
    */
    $.fn.faiColorPickerAlp = function(options){

        var defaultOption =     {
            base                :           this,
            target              :           this,    //颜色的获取，暂时改为传参数
            // target              :           this.find('.fkEditor-tool-icon'), //简易文本实例

            baseattr            :           "background-color",
            targetattr          :           "background-color",

            col1                :           ["#FCC02E","#FED835","#FFEB3C","#FFF176","#FFF59C",""],
            col2                :           ["#F67C01","#FB8C00","#FFA727","#FFB74E","#FFCC80","#FFFFFF"],
            col3                :           ["#E64A19","#F5511E","#FE5722","#FF8A66","#FFAB91","#DEDEDE"],
            col4                :           ["#D81B43","#EB1D4E","#EB4165","#F1627E","#FB879E","#A9A9A9"],
            col5                :           ["#8E24AA","#9C28B1","#AA47BC","#B968C7","#CF93D9","#4B4B4B"],
            col6                :           ["#512DA7","#5D35B0","#673BB7","#7986CC","#9EA8DB","#353535"],
            col7                :           ["#1F87E8","#2097F3","#42A5F6","#64B5F6","#90CAF8","#212121"],
            col8                :           ["#008781","#029688","#26A59A","#80CBC4","#B2DFDC","#000000"],
            col9                :           ["#05A045","#4CB050","#83C683","#A5D6A7","#C8E6CA",""],

            advance             :           true,
            showInTop           :           false,
            showStatus          :           0,          //简易文本：消失、出现，延时状态值
            // onShowStatus        :           function(sta){console.log(sta)},
            onShowStatus        :           $.noop,     //简易文本：消失、出现，延时状态值

            onchange            :           $.noop,
            inputHexStatus      :           $.noop,
            top                 :           0,
            left                :           0

        };
        options =  $.extend({}, defaultOption , options);

        //根据情况决定选择器. 该插件有可能被 iframe中的元素激活
        if(options.showInTop)
            options.$$ = Fai.top.$;
        else
            options.$$ = $;

        //进入插件初始化，兼容火狐的event
        options.base.bind('click',BuildingfaiColorPicker({ options: options , $$:options.$$ }));
    };

    //构建颜色选择模版
    function BuildingfaiColorPicker(opt){
            //兼容火狐，给火狐注册event事件，阻止其冒泡至body
            if($.browser.mozilla){
                var $E = function(){var c=$E.caller; while(c.caller)c=c.caller; return c.arguments[0]};
                __defineGetter__("event", $E);
            }

            var event = window.event || arguments.callee.caller.arguments[0];
            if (event.stopPropagation) { 
                event.stopPropagation();    //for Mozilla and Opera 
            } 
            else if (window.event) { 
                window.event.cancelBubble = true;   //for IE 
            }

            var $$ = opt.$$;
            var options = opt.options;

            //先移除之前创建的 .faiColorPicker 面板
            $$(".J_faiColorPickerAlp").remove();
            $$(".J_advanceColorPicker").remove();

            //构建 faiColorPicker 默认颜色部分
            var randomId = 'faiColorPicker' + Math.floor(Math.random()*1000);
            var template = ""
                         + '<div class="J_faiColorPickerAlp fk-colorPickerAlp" id="'+ randomId + '">'

            //构建 faiColorPicker 选择颜色部分
                template +=     '<div class="fk-colorPicker-colorcol J_colorPicker_colorcol">';
            for(var colnum = 1, list ; colnum < 10 ; colnum++){
                list = options["col"+colnum];

                template +=         '<div class="col">'
                         +              '<div class="col-color"><div style="background-color:'+ list[0] +'"></div></div>'
                         +              '<div class="col-color"><div style="background-color:'+ list[1] +'"></div></div>'
                         +              '<div class="col-color"><div style="background-color:'+ list[2] +'"></div></div>'
                         +              '<div class="col-color"><div style="background-color:'+ list[3] +'"></div></div>'
                         +              '<div class="col-color"><div style="background-color:'+ list[4] +'"></div></div>'
                         +              '<div class="col-color"><div style="background-color:'+ list[5] +'"></div></div>'
                         +          '</div>'
            }
                template +=     '</div>';

            //构建最近使用颜色
            var arrColor =  showRecentColor();
            var arrColorLength = arrColor.length;
            if(arrColorLength != 0){
                template +=     '<div class="fk-colorPicker-recent J_colorPicker_colorcol">';
            for(var i = 0; i<arrColorLength; i++)
                template +=         '<div class="col-color"><div style="background-color:'+ arrColor[i] +'"></div></div>';
                template +=     '</div>';
            }
                

            //构建 faiColorPicker 默认颜色部分，透明条
                template +=     '<div class="fk-colorPicker-clearcolor">'
                         +          '<div class="f-original-color-bg">'
                         +              '<div class="J_original_color f-original-color" style="background-color:transparent;"></div>'
                         +          '</div>'
                         +          '<div class="J_sp_alpha fk-sp-alpha">'
                         +              '<div class="J_sp_alpha_inner fk-sp-alpha-inner" style="background: linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0));">'
                         +                  '<div class="J_sp_alpha_handle fk-sp-alpha-handle" style="left: 0px;"></div>'
                         +              '</div>'
                         +          '</div>'
                         +      '</div>';

            //整体构建完成
                template += '</div>';

            //格式化样式.
            $$("body").append(template);

            //最后一行特殊处理，二级颜色选择器入口
            if(options.advance){
                $$(".J_colorPicker_colorcol>.col").last().children().last().children().addClass('col-color-last').html('<span class="J_coloradvance_btn f-coloradvance-btn"></span>');
            }
            $$(".col-color:eq(5)").addClass('J_original_clear f-original-clear');
            
            /* ---- 弹出面板显示位置 ---- */
            var top,left;
            //计算面板的top left;
            if(options.showInTop){
                if($$(".formDialog").offset()) {
                    var line = $$(".formDialog:last").offset();
                    left = options.left + line.left + options.base.offset().left + options.base.width() / 2 -12;
                    top = options.top + line.top + options.base.offset().top + options.base.height() / 2 + 27;
                }else {
                    left = options.left + options.base.offset().left + options.base.width() / 2 -12;
                    top = options.top + options.base.offset().top + options.base.height() / 2 +15;
                }
            }else{
                // 不在iframe中生成. showInTop 为false 时
                left = options.left + options.base.offset().left + options.base.width() / 2 -12;
                top = options.top + options.base.offset().top + options.base.height() / 2 -22;
                if($(window).height() - top < 272 )
                    top = top - 212;
                if($(window).width() - left < 206 )
                    left = left - 241;
            }

            // $$(".J_faiColorPickerAlp").css({
            //         "left"   :left,
            //         "top"    :top,
            //         "z-index":9999
            // }).show();

            //判断是否有最近使用颜色，调整色板的高度
            var height = "190px";
            if(arrColorLength != 0){
                height = "235px";
            }

            // $$(".J_faiColorPickerAlp").css({
            //         "left"   :left,
            //         "top"    :top,
            //         "width"  :"225px",
            //         "z-index":9999
            // }).show().animate({
            //     "height"    :height
            // });
            $$(".J_faiColorPickerAlp").css({
                    "left"   :left,
                    "top"    :top,
                    "height" :height,
                    "z-index":9999
            }).show();

            //防止点击面板时事件冒泡
            $$('.J_faiColorPickerAlp').click(function(e){ e.stopPropagation() });
            $$('.J_faiColorPickerAlp').find("#faiColorPicker-hidden").focus();

            //简易文字：点击其它区域，保持编辑下选中的状态
            var prefixCss = "",
                thisBrowser = navigator.userAgent.toLowerCase();

            if(/msie/.test(thisBrowser)) // ie
                prefixCss = '-ms-';
            else if(/chrome/.test(thisBrowser) || /safari/.test(thisBrowser) || /yandex/.test(thisBrowser)) // webkit group (safari, chrome, yandex)
                prefixCss = '-webkit-';
            else if(/mozilla/.test(thisBrowser)) // firefox
                prefixCss = '-moz-';
            else if(/opera/.test(thisBrowser)) // opera
                prefixCss = '-o-';
            else if(/konqueror/.test(thisBrowser)) // konqueror
                prefixCss = '-khtml-';
            else 
                prefixCss = '';
            // 给元素增加属性 unselectable
            $$(".J_faiColorPickerAlp")
                .css(prefixCss+"user-select","none")
                .addClass("unselectable")
                .attr("unselectable","on")
                .on("selectstart mousedown",false);

            //简易文本，改状态
            options.showStatus = 1;
            //给Panel上的元素绑定事件
            BindEvent(options);
    }

    //绑定事件入口.写在这里
    function BindEvent(options){
            var $$ = options.$$,
                originalColor = options.target.css(options.targetattr);

            $$(".J_original_color").css("background-color",originalColor);
            // 当默认颜色是透明的则加上透明图标
            if(isTransparent(originalColor)) {
                $$(".J_sp_alpha_inner").css("background","linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0))");
            }else{
                //初始化透明导航条
                $$(".J_sp_alpha_inner").css("background","linear-gradient(to right, " + RgbatoRgb(originalColor) + ", " + RgbtoRgba(originalColor,0) + ")");
                //初始化透明色
                $$(".col-color:eq(5)").addClass('J_original_clear f-original-clear');
            }
            //透明度，滑块的位置
            if(isRgba(originalColor)){
                var alp = getAlp(originalColor);
                $('.J_sp_alpha_handle').css('left',160 * (1-alp) +"px");
            }
            
            //为Panel上的元素绑定对应的事件. 这段很长..
            //:not(:last)，透明色、高级颜色选择入口，屏蔽mouseenter事件
            $$(".col-color:not(:eq(5))")       .unbind("click",        PickerColor)         .bind("click",{ $$:$$, elm:options.target, targetattr:options.targetattr, onchange:options.onchange, onclick:options.onclick                     },       PickerColor);
            $$(".col-color:not(:last,:eq(5))") .unbind("mouseenter",   MouseEnterColor)     .bind("mouseenter",{ $$:$$, elm:options.target, targetattr:options.targetattr, onmousein:options.onmousein, onchange:options.onchange                 },       MouseEnterColor);
            //$$(".J_faiColorPickerAlp")         .unbind("mouseleave",   MouseLeaveColor)     .bind("mouseleave",{ $$:$$, elm:options.target, targetattr:options.targetattr, onchange:options.onchange                                              },       MouseLeaveColor);
            $$(".J_colorPicker_colorcol")         .unbind("mouseleave",   MouseLeaveColor)     .bind("mouseleave",{ $$:$$, elm:options.target, targetattr:options.targetattr, onchange:options.onchange                                              },       MouseLeaveColor);
            $$(".J_original_clear")            .unbind("click",        ResetColor)          .bind("click",{ $$:$$, elm:options.target, targetattr:options.targetattr, onchange:options.onchange ,onreset:options.onreset,onclick:options.onclick },       ResetColor);
            $$(".J_original_clear")            .unbind("mouseenter",   MouseEnterResetColor).bind("mouseenter",{ $$:$$, elm:options.target, targetattr:options.targetattr, onchange:options.onchange ,onreset:options.onreset                     },         MouseEnterResetColor);
            $$(".J_coloradvance_btn")          .unbind("click",        AdvancePanel)        .bind("click",{ $$:$$, elm:options.target, targetattr:options.targetattr, base:options.base, baseattr :options.baseattr, onchange:options.onchange, inputHexStatus:options.inputHexStatus, showStatus:options.showStatus,onShowStatus:options.onShowStatus},     AdvancePanel);
            $$(".J_sp_alpha")                  .unbind("touchstart mousedown",draggableAlpha).bind("touchstart mousedown",{ $$:$$, elm:options.target, targetattr:options.targetattr, onmousein:options.onmousein, onchange:options.onchange     },draggableAlpha);
            $$("body")                         .unbind("click",        HideColorPanel)      .bind("click",{ $$:$$, elm:options.target, targetattr:options.targetattr, onchange:options.onchange, showStatus:options.showStatus,onShowStatus:options.onShowStatus },        HideColorPanel);
            

            //如果是showInTop 模式, 也就是说, 如果这个面板是被 iframe 中 JSP内的元素所激活的, 则以下面板消失的事件只是优化一下体验...
            if(options.showInTop) {
                $("body")             .unbind("click",      HideColorPanel)     .bind("click",      { $$:$$, elm: options.target, targetattr: options.targetattr, onchange:options.onchange             }, HideColorPanel);
                var panel = $$('.faiColorPicker');
                panel.mouseout(function(){ panel.attr("mouseIn", 0); })
                     .mouseover(function(){ panel.attr("mouseIn", 1); })
                     .focusout(function(){
                    // 不在区域内才关闭
                            if(panel.attr("mouseIn") == 1){
                                // 由于其他元素没有焦点，因此重新把焦点设到input，以便再接受focusout事件
                                panel.find("#faiColorPicker-hidden").focus();
                                return;
                            }
                            panel.remove();
                    //closeColorPanel();
                });
            }
    }

    //鼠标 click 点击的颜色块, 则会触发该函数
    function PickerColor(event){
        event.stopPropagation();

        var $$  = event.data.$$;
        var color = $$(this).find("div").css("background-color");
            color = RgbtoHex(color);

        //同时主题颜色中的色值也要发生变化
        $$(".J_original_color").css("background-color",color);
        // 面板中当前透明度颜色恢复成默认颜色
        $$(".J_sp_alpha_inner").css("background","linear-gradient(to right, " + RgbatoRgb(color) + ", " + HextoRgba(color,0) + ")");
        //点击选中，保持放大状态
        $('.col-color').removeClass('current-col-color');
        $(this).addClass('current-col-color');

        //onchange 回调
        event.data.onchange.apply(event.data.elm,[color]);
        event.data.elm.css('background-color',color);
        setRecentColor(color);
    }

    //重置颜色按钮, 则会触发该函数
    function ResetColor(event){
        event.stopPropagation();

        var $$ = event.data.$$;

        $$(".J_original_color").css("background-color","transparent");

        $$('.J_faiColorPickerAlp').remove();
        //onchange回调
        event.data.onchange.apply(event.data.elm,["transparent","transparent"]);
        event.data.elm.css('background-color',"transparent");
    }
    //鼠标进入透明宽
    function MouseEnterResetColor(event){
        //event.stopPropagation(); //ken 2016427修改   原因阻止冒泡会导致父节点的mouseover失效,所以要除去
        var $$ = event.data.$$;
        $$(".J_original_color").css("background-color","transparent");                 
        $$(".J_sp_alpha_inner").css("background","linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0))");
        //滑块位置设为0
        $$('.J_sp_alpha_handle').css({
            "left": "0px"
        }); 

        //onchange回调
        // event.data.onchange.apply(event.data.elm,["transparent"]);
    }

    //鼠标 mouseenter 到颜色块, 则会触发该函数.
    var vbHoverOutAction;   //mouseenter 延时优化
    function MouseEnterColor(event){
        var $$ = event.data.$$,
        color = $(this).find("div").css("background-color");
        color = RgbtoHex(color);
        
        clearTimeout( vbHoverOutAction );
        vbHoverOutAction = setTimeout(function(){
            $$(".J_original_color").css("background-color",color);
            $$(".J_sp_alpha_inner").css("background","linear-gradient(to right, " + HextoRgb(color) + ", " + HextoRgba(color) + ")");
            //滑块位置设为0
            $$('.J_sp_alpha_handle').css({
                "left": "0px"
            });
        },350);

        //onchange 回调
        //event.data.onchange.apply(event.data.elm,[color]);
    }
    //鼠标 mouseleave 到控件面板，就变回初始的颜色
    function MouseLeaveColor(event){
        clearTimeout( vbHoverOutAction );
        var atFirstColor = event.data.elm.css(event.data.targetattr),
            $$ = event.data.$$;
        if(atFirstColor){
            if(isTransparent(atFirstColor)) {
                $$(".J_original_color").css("background-color",atFirstColor);
                $$(".J_sp_alpha_inner").css("background","linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0))");
            }else{
                // 面板中当前颜色恢复成默认颜色
                $$(".J_original_color").css("background-color",atFirstColor);
                // 面板中当前透明度颜色恢复成默认颜色
                $$(".J_sp_alpha_inner").css("background","linear-gradient(to right, " + RgbatoRgb(atFirstColor) + ", " + HextoRgba(atFirstColor,0) + ")");
            }
        }

        //透明度，滑块的位置
        if(isRgba(atFirstColor)){
            var alp = getAlp(atFirstColor);
            $('.J_sp_alpha_handle').css('left',160 * (1-alp) +"px");
        }

    }
    //隐藏整个面板
    function HideColorPanel(event){
        event.stopPropagation();
        var $$ = event.data.$$;
        $$(".J_faiColorPickerAlp").remove();

        event.data.onShowStatus(event.data.showStatus);
        setTimeout(function(){
            event.data.showStatus = 0;
        },300);
    }
    //高级面板功能, 调用fai.src.js中的 Fai.popupwindow
    function AdvancePanel(event) {
        event.stopPropagation();

        var $$ = event.data.$$,
            atFirstColor = event.data.elm.css(event.data.targetattr);

        //简易文本，进入就回调
        event.data.inputHexStatus('1',atFirstColor);

        //记录一级选择器的位置，赋给二级颜色选择器
        var top = $$(".J_faiColorPickerAlp").offset().top-26,    //-12，调整位置，不遮住简易文本的文字
            left = $$(".J_faiColorPickerAlp").offset().left-8;   //+50，调整位置，不遮住简易文本的文字
        $$(".J_faiColorPickerAlp").remove();

        $$("body").append("<div class='J_advanceColorPicker'></div>"); 

        if(isTransparent(atFirstColor)) {
            atFirstColor = 'FFFFFF';
        }else{
            //rgba,先装换成rgb\hex
            atFirstColor = RgbtoHex(atFirstColor);
        }
        
        $(".J_advanceColorPicker").faiColorPickerAdven({
            flat: true,
            color: atFirstColor,
            onHide: function (colpkr) {
                $$(".J_advanceColorPicker").remove();
                // event.data.onShowStatus(event.data.showStatus);
                // setTimeout(function(){
                //     event.data.showStatus = 0;
                // },300);
                return false;
            },
            onShow: function (colpkr) {
                return false;
            },
            //简易文本三种状态
            // inputHexFocus: function (status,hex) {
            //     event.data.inputHexStatus(status,"#"+hex);
            // },
            inputHexChange: function (status,hex) {
                event.data.inputHexStatus(status,"#"+hex);
            },
            //blur状态暂时不回调
            // inputHexBlur: function (status,hex) {
            //     event.data.inputHexStatus([status,"#"+hex]);
            // },
            onChange: function (hsb, hex, rgb) {
                //回调
                event.data.onchange("#"+hex);
                event.data.elm.css('background-color',"#"+hex);
                //更新最近使用的颜色
                setRecentColor("#"+hex);

                event.stopPropagation();
            }
        });

        //二级选择器位置
        $(".J_colorPickerAdven").css({
            top: top,
            left: left
        });

        //简易文字：点击其它区域，保持编辑下选中的状态
        var prefixCss = "",
            thisBrowser = navigator.userAgent.toLowerCase();

        if(/msie/.test(thisBrowser)) // ie
            prefixCss = '-ms-';
        else if(/chrome/.test(thisBrowser) || /safari/.test(thisBrowser) || /yandex/.test(thisBrowser)) // webkit group (safari, chrome, yandex)
            prefixCss = '-webkit-';
        else if(/mozilla/.test(thisBrowser)) // firefox
            prefixCss = '-moz-';
        else if(/opera/.test(thisBrowser)) // opera
            prefixCss = '-o-';
        else if(/konqueror/.test(thisBrowser)) // konqueror
            prefixCss = '-khtml-';
        else 
            prefixCss = '';
        
        // 给元素增加属性 unselectable；
        $$(".J_colorpicker_color,.J_colorpicker_brt,.J_colorpicker_hex label")
            .css(prefixCss+"user-select","none")
            .addClass("unselectable")
            .attr("unselectable","on")
            .on("selectstart mousedown",false);
    }
    
    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggableAlpha(event,onmove,onstart,onstop) {
        //透明色，透明度条不能拖动
        var originalColor = event.data.elm.css(event.data.targetattr);
        if(isTransparent(originalColor)){
            return;
        }
        event.stopPropagation();
        var $$ = event.data.$$,
            element = $$(this),
            event = event,
            onchange = event.data.onchange,
            elm = event.data.elm,
            targetattr = event.data.targetattr,

            onmove = onmove || function () {},
            onstart = onstart || function () {},
            onstop = onstop || function () {},
            doc = document,
            dragging = false,
            offset = {},
            maxHeight = 0,
            maxWidth = 0;

        var duringDragEvents = {};
            duringDragEvents["selectstart"] = prevent,
            duringDragEvents["dragstart"] = prevent,
            duringDragEvents["touchmove mousemove"] = move,
            duringDragEvents["touchend mouseup"] = stop;

        var rightclick = (event.which) ? (event.which == 3) : (event.button == 2);

        if (!rightclick && !dragging) {
            if (onstart.apply(element, arguments) !== false) {
                dragging = true;
                maxHeight = $(element).height();
                // maxWidth = $(element).width()-18;
                maxWidth = $(element).width()-10;
                offset = $(element).offset();

                $(doc).bind(duringDragEvents);
                $(doc.body).addClass("sp-dragging");

                move(event);

                prevent(event);
            }
        }

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {

                var t0 = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches[0],
                    pageX = t0 && t0.pageX || e.pageX,
                    pageY = t0 && t0.pageY || e.pageY,

                    dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth)),
                    dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                // 移动滑块的位置
                element.find('.J_sp_alpha_handle').css({
                    "left": dragX + "px"
                });
                //获取、计算透明度180-20=160
                var alp = (160-element.find('.J_sp_alpha_handle').position().left)/160;
                var color = RgbtoRgba($(".J_original_color").css("background-color"),alp);

                //改变.J_original_color的颜色值透明度
                $(".J_original_color").css("background-color",color);

            }
        }

        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");

                // Wait a tick before notifying observers to allow the click event
                // to fire in Chrome.
                setTimeout(function() {
                    onstop.apply(element, arguments);
                }, 0);
            }
            dragging = false;

            $$(".J_faiColorPickerAlp").unbind("mouseleave", MouseLeaveColor);
            $$(".col-color").mouseenter(function(){
                $$(".col-color").unbind("mouseleave",MouseLeaveColor).bind("mouseleave",{ $$:$$, elm:elm, targetattr:targetattr, onchange:onchange},MouseLeaveColor);
            });

            var alp = (160-element.find('.J_sp_alpha_handle').position().left)/160;
            //消除负值的一点误差
            alp = alp < 0 ? 0:alp;
            var color = RgbtoRgba($(".J_original_color").css("background-color"),alp);
            onchange.apply(elm,[RgbatoRgb(color),color]);
            event.data.elm.css('background-color',color);
        }
    }


    //工具函数
    //localStorage
    var canLocalStorageSet = window.localStorage && window.localStorage.setItem, // 检测localStorage是否可用
        canLocalStorageGet = window.localStorage && window.localStorage.getItem,
        getItem = function(){},
        setItem = function(){};

    if(canLocalStorageGet){
        getItem = function(key){
            return window.localStorage.getItem(key);
        };
    }
    if(canLocalStorageSet){
        setItem = function(key, value){
            return window.localStorage.setItem(key, value);
        };
    }

    //最近使用的颜色，从localStorage读出来
    function showRecentColor(){
        if(getItem('faiColorPickerAlp') == null){
            return '';
        }else{
            var arrColor = JSON.parse(getItem('faiColorPickerAlp'));
            return arrColor;
        }
    }
    //最近使用的颜色，写进localStorage
    function setRecentColor(colorHex){
        if(getItem('faiColorPickerAlp') == null){
            var arrColor = new Array(colorHex);
            setItem('faiColorPickerAlp',JSON.stringify(arrColor));
        }else{
            var arrColor = JSON.parse(getItem('faiColorPickerAlp'));
            //若有重复项，则不存
            for(var i = 0;i < arrColor.length; i++){
                if(arrColor[i] == colorHex){
                    return;
                }
            }
            //等于9，先删除最后一项，再在前增加一项
            if(arrColor.length == 9){
                arrColor.pop();
                arrColor.unshift(colorHex);
                setItem('faiColorPickerAlp',JSON.stringify(arrColor));
            }else{
                arrColor.unshift(colorHex);
                setItem('faiColorPickerAlp',JSON.stringify(arrColor));
            }
            
        }
    }

    //Rgb转Hex  将Rgb格式的字符串"rgb(255,255,100)"  转化为 Hex 字符串形式 "#105450"
    /**
     * @return {string}
     */
    function RgbtoHex(rgb){
        if(/#/g.test(rgb)) return rgb;

        rgb = (rgb.replace(/[rgba\(\)]/g,"")).split(",");  //[r,g,b]

        var hex = ["#"];
        for(var i=0 ,hexpart; i<3; i++){
            hexpart = parseInt(rgb[i]).toString(16);
            if(hexpart.length===1)
                hexpart = "0" + hexpart;
            hex.push(hexpart);
        }
        return hex.join("");
    }
    //Hex转Rgb  将Hex格式的字符串 "#005623" 这种类型的字符串, 转化为 Rgb 字符串形式 "rgb(12,255,2)";
    /**
     * @return {string}
     */
    function HextoRgb(hex){
        if(/rgb/gi.test(hex)) return hex;

        hex = parseInt(hex.substring(1),16);     // #012345 -> 012345
        var rgb = [ 'rgb(',hex >> 16,',',(hex & 0x00FF00) >> 8,',',(hex & 0x0000FF),')' ];
        return rgb.join("");

    }
    //Hex转Rgba
    /**
     * @return {string}
     */
    function HextoRgba(hex,alp){
        if(/rgba/gi.test(hex)) return hex;
        var alp = alp || 0;

        hex = parseInt(hex.substring(1),16);     // #012345 -> 012345
        var rgba = [ 'rgba(',hex >> 16,',',(hex & 0x00FF00) >> 8,',',(hex & 0x0000FF),',',alp,')' ];
        return rgba.join("");

    }
    //Rgb转Rgba
    /**
     * @return {string}
     */
    function RgbtoRgba(rgb,alp){
        var alp = alp || 0;

        return HextoRgba(RgbtoHex(rgb),alp);

    }

    //Rgba转Rgb
    /**
     * @return {string}
     */
    function RgbatoRgb(rgba){
        //注：rgba的格式为rgba(0,0,0,0.1)
        // if(/rgb/gi.test(rgba)) return rgba;
        if(/#/g.test(rgba)) return rgba;
        var arr = rgba.split("(")[1].split(")")[0].split(",");
        var r = arr[0],
            g = arr[1],
            b = arr[2];
            // a = arr[3];
        return "rgb(" + r + "," + g + "," + b +")";
    }

    // 判断是否是透明
    function isTransparent(color) {
        if(!!color && color.replace(/\s/g, "") == "rgba(0,0,0,0)" || color == "transparent") {
            return true;
        }

        return false;
    };

    // 判断是否是rgba颜色
    function isRgba(color) {
        if(/rgba/gi.test(color)) {
            return true;
        }

        return false;
    };

    //获取rgba的alp
    function getAlp(color){
        var arr = color.split("(")[1].split(")")[0].split(",");
        var a = arr[3];
        return a;
    }

})(jQuery);


 /*
 * faiColorPickerAdven
 *
 * @ 2016.07.30
 * @ guojc
 * @ Maintained by: ColorPicker  "X:\dev-svn\guojc\src\res\flyer\js\comm\jquery\plugins\jquery-color-picker.src.js"
 *
 */
 //二级颜色选择器
(function ($) {
  var faiColorPickerAdven = function () {
    var
      ids = {},
      inAction,
      charMin = 65,
      visible,
      tpl = '<div class="J_colorPickerAdven fk-colorPickerAdven">'+
              '<div class="J_colorpicker_color fk-colorpicker-color"><div><div></div></div></div>'+
              '<div class="J_colorpicker_brt fk-colorpicker-brt"><div></div></div>'+
              '<div style="display:none;" class="J_colorpicker_new_color fk-colorpicker-new-color"></div>'+
              '<div style="display:none;" class="J_colorpicker_current_color fk-colorpicker-current-color"></div>'+
              '<div class="J_colorpicker_hex fk-colorpicker-hex">'+
                  '<label>输入色值#</label><input type="text" maxlength="6" size="6"/>'+
              '</div>'+
              '<div style="display:none;" class="colorpicker_rgb_r colorpicker_field">'+
                  '<input type="text" maxlength="3" size="3" /><span></span>'+
              '</div><div style="display:none;" class="colorpicker_rgb_g colorpicker_field">'+
                  '<input type="text" maxlength="3" size="3" /><span></span>'+
              '</div><div style="display:none;" class="colorpicker_rgb_b colorpicker_field">'+
                  '<input type="text" maxlength="3" size="3" /><span></span>'+
              '</div>'+
              '<div style="display:none;" class="colorpicker_hsb_h colorpicker_field">'+
                  '<input type="text" maxlength="3" size="3" /><span></span>'+
              '</div>'+
              '<div style="display:none;" class="colorpicker_hsb_s colorpicker_field">'+
                  '<input type="text" maxlength="3" size="3" /><span></span>'+
              '</div>'+
              '<div style="display:none;" class="colorpicker_hsb_b colorpicker_field">'+
                  '<input type="text" maxlength="3" size="3" /><span></span>'+
              '</div>'+
              '<div class="J_colorpicker_submit"></div>'+
            '</div>',
      
      defaults = {
        eventName: 'click',
        onShow: function () {},
        onBeforeShow: function(){},
        onHide: function () {},
        onChange: function () {},
        onSubmit: function () {},
        inputHexFocus: function () {},
        inputHexChange: function () {},
        inputHexBlur: function () {},
        color: 'ff0000',
        livePreview: true,
        flat: false
      },
      fillRGBFields = function  (hsb, cal) {
        var rgb = HSBToRGB(hsb);
        $(cal).data('colorpicker').fields
          .eq(1).val(rgb.r).end()
          .eq(2).val(rgb.g).end()
          .eq(3).val(rgb.b).end();
      },
      fillHSBFields = function  (hsb, cal) {
        $(cal).data('colorpicker').fields
          .eq(4).val(hsb.h).end()
          .eq(5).val(hsb.s).end()
          .eq(6).val(hsb.b).end();
      },
      fillHexFields = function (hsb, cal) {
        $(cal).data('colorpicker').fields
          .eq(0).val(HSBToHex(hsb)).end();
      },
      initHexFields = function (hex, cal){
        $(cal).data('colorpicker').fields
          .eq(0).val((hex.indexOf('#') > -1) ? hex.substring(1) : hex).end();
      },
      setSelector = function (hsb, cal) {
        var lt = HSBToLeftTop(hsb);
        $(cal).data('colorpicker').selectorIndic.css({
          'left' : lt.left,
          'top' : lt.top
        });
      },
      setBrt = function (hsb, cal) {
        $(cal).data('colorpicker').brt.parent().css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: hsb.s, b: 100}));
        $(cal).data('colorpicker').brt.css('left', parseInt(173 - 164 * hsb.b/100, 10));
      },
      setCurrentColor = function (hsb, cal) {
        $(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
      },
      setNewColor = function (hsb, cal) {
        $(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
      },
      keyDown = function (ev) {
        ev.stopPropagation();
      },
      keyUp = function (ev) {
        ev.stopPropagation();
        var pressedKey = ev.charCode || ev.keyCode || -1;
        /*if ((pressedKey > charMin && pressedKey <= 90) || pressedKey == 32) {
          return false;
        }*/
        if(pressedKey == 17){
            return;
        }
        if ((pressedKey < 48 || pressedKey > 57) && (pressedKey < 65 || pressedKey > 70) && (pressedKey < 96 || pressedKey > 105) &&  pressedKey != 8) {
          $(this).val(this.value.replace(/[^0-9^a-f^A-F]/g,''));
          //return false;
        }
       /*if(this.value.length == 6 && pressedKey != 8){
            return false;
        }*/

        var cal = $(this).parent().parent(), col;
        var hexStr = "";
        if (cal.data('colorpicker').livePreview === true) {
          var hsb = HexToHSB(fixHex(this.value));
          var rgb = HexToRGB(fixHex(this.value));
          cal.data('colorpicker').fields
          .eq(1).val(rgb.r).end()
          .eq(2).val(rgb.g).end()
          .eq(3).val(rgb.b).end()
          .eq(4).val(hsb.h).end() 
          .eq(5).val(hsb.s).end()
          .eq(6).val(hsb.b); 
          // change.apply(this);

          if (this.parentNode.className.indexOf('_hex') > 0) {
            hexStr = fixHex(this.value);
            cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
          } else if (this.parentNode.className.indexOf('_hsb') > 0) {
            cal.data('colorpicker').color = col = fixHSB({
              h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
              s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
              b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
            });
          } else {
            cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
              r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
              g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
              b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
            }));
          }
          if (ev && !hexStr) {
            fillRGBFields(col, cal.get(0));
            fillHexFields(col, cal.get(0));
            fillHSBFields(col, cal.get(0));
          }
          setSelector(col, cal.get(0));
          setBrt(col, cal.get(0));
          setNewColor(col, cal.get(0));
          hexStr = hexStr ? hexStr : HSBToHex(col);

          //inputHexChange,简易文字
          cal.data('colorpicker').inputHexChange.apply(cal,['2',hexStr]);

        }
      },
      change = function (ev) {
        var cal = $(this).parent().parent(), col;
        var hexStr = "";
        if (this.parentNode.className.indexOf('_hex') > 0) {
          hexStr = fixHex(this.value);
          cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
        } else if (this.parentNode.className.indexOf('_hsb') > 0) {
          cal.data('colorpicker').color = col = fixHSB({
            h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
            s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
            b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
          });
        } else {
          cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
            r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
            g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
            b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
          }));
        }
        if (ev && !hexStr) {
          fillRGBFields(col, cal.get(0));
          fillHexFields(col, cal.get(0));
          fillHSBFields(col, cal.get(0));
        }
        setSelector(col, cal.get(0));
        setBrt(col, cal.get(0));
        setNewColor(col, cal.get(0));
        hexStr = hexStr ? hexStr : HSBToHex(col);
        cal.data('colorpicker').onChange.apply(cal, [col, hexStr, HSBToRGB(col)]);

      },
      blur = function (ev) {
        var cal = $(this).parent().parent(), col;
        cal.data('colorpicker').fields.parent().removeClass('fk-colorpicker-focus');

        //inputHexBlur,简易文字
        var hexStr = "";
        if (this.parentNode.className.indexOf('_hex') > 0) {
          hexStr = fixHex(this.value);
          cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
        } else if (this.parentNode.className.indexOf('_hsb') > 0) {
          cal.data('colorpicker').color = col = fixHSB({
            h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
            s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
            b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
          });
        } else {
          cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
            r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
            g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
            b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
          }));
        }
        cal.data('colorpicker').inputHexBlur.apply(cal,['3',hexStr]);
      },
      focus = function () {
        //inputHexFocus,简易文字
        var cal = $(this).parent().parent(), col;
        var hexStr = "";
        if (this.parentNode.className.indexOf('_hex') > 0) {
          hexStr = fixHex(this.value);
          cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
        } else if (this.parentNode.className.indexOf('_hsb') > 0) {
          cal.data('colorpicker').color = col = fixHSB({
            h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
            s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
            b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
          });
        } else {
          cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
            r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
            g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
            b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
          }));
        }
        cal.data('colorpicker').inputHexFocus.apply(cal,['1',hexStr]);

        charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
        $(this).parent().parent().data('colorpicker').fields.parent().removeClass('fk-colorpicker-focus');
        $(this).parent().addClass('fk-colorpicker-focus');
      },
      downIncrement = function (ev) {
        var field = $(this).parent().find('input').focus();
        var current = {
          el: $(this).parent().addClass('colorpicker_slider'),
          max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
          y: ev.pageY,
          field: field,
          val: parseInt(field.val(), 10),
          preview: $(this).parent().parent().data('colorpicker').livePreview          
        };
        $(document).bind('mouseup', current, upIncrement);
        $(document).bind('mousemove', current, moveIncrement);
      },
      moveIncrement = function (ev) {
        ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val + ev.pageY - ev.data.y, 10))));
        if (ev.data.preview) {
          change.apply(ev.data.field.get(0), [true]);
        }
        return false;
      },
      upIncrement = function (ev) {
        change.apply(ev.data.field.get(0), [true]);
        ev.data.el.removeClass('colorpicker_slider').find('input').focus();
        $(document).unbind('mouseup', upIncrement);
        $(document).unbind('mousemove', moveIncrement);
        return false;
      },
      /*****brightness start*****/
      downBrt = function (ev) {
        var current = {
          cal: $(this).parent(),
          x: $(this).offset().left
        };
        current.preview = current.cal.data('colorpicker').livePreview;
        ev.data = {'cal': current.cal, 'x' : current.x, 'preview':current.preview};
        change.apply(
          ev.data.cal.data('colorpicker')
            .fields
            .eq(6)
            .val(parseInt(100*(173 - Math.max(9,Math.min(173,(ev.pageX - ev.data.x))))/164, 0))
            .get(0),
          [ev.data.preview]
        );
        $(document).bind('mouseup', current, upBrt);
        $(document).bind('mousemove', current, moveBrt);
      },
      moveBrt = function (ev) {
        // change.apply(
        //   ev.data.cal.data('colorpicker')
        //     .fields
        //     .eq(6)
        //     .val(parseInt(100*(173 - Math.max(9,Math.min(173,(ev.pageX - ev.data.x))))/164, 0))
        //     .get(0),
        //   [ev.data.preview]
        // );

        //优化：moveBrt的过程不回调，upBrt再回调
        var cal = ev.data.cal, col;
        var hexStr = "";

        var currentObj = ev.data.cal.data('colorpicker').fields.eq(6).val(parseInt(100*(173 - Math.max(9,Math.min(173,(ev.pageX - ev.data.x))))/164, 0)).get(0);

        if (currentObj.parentNode.className.indexOf('_hex') > 0) {
          hexStr = fixHex(currentObj.value);
          cal.data('colorpicker').color = col = HexToHSB(fixHex(currentObj.value));
        } else if (currentObj.parentNode.className.indexOf('_hsb') > 0) {
          cal.data('colorpicker').color = col = fixHSB({
            h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
            s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
            b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
          });
        } else {
          cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
            r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
            g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
            b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
          }));
        }
        if (ev && !hexStr) {
          fillRGBFields(col, cal.get(0));
          fillHexFields(col, cal.get(0));
          fillHSBFields(col, cal.get(0));
        }
        setSelector(col, cal.get(0));
        setBrt(col, cal.get(0));
        setNewColor(col, cal.get(0));

        return false;
      },
      upBrt = function (ev) {
        fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
        fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
        $(document).unbind('mouseup', upBrt);
        $(document).unbind('mousemove', moveBrt);
        
        //upBrt才触发回调，提高性能
        change.apply(
          ev.data.cal.data('colorpicker')
            .fields
            .eq(6)
            .val(parseInt(100*(173 - Math.max(9,Math.min(173,(ev.pageX - ev.data.x))))/164, 0))
            .get(0),
          [ev.data.preview]
        );

        return false;
      },
      /*****brightness end*****/
      /*****hue and saturation start *****/
      getSatInCircle = function(ev){
        var x = ev.pageX - ev.data.pos.left - 91,
            y = ev.pageY - ev.data.pos.top - 91;
        return Math.sqrt(x*x+y*y);
      },
      getHueInCircle = function(ev){
        var x = ev.pageX - ev.data.pos.left - 91,
            y = ev.pageY - ev.data.pos.top - 91;
        var arc = Math.round(Math.atan2(y,x)*180/Math.PI);
        if(y<0){
          arc += 360;
        }
        return arc;
      },
      downSelector = function (ev) {
        var current = {
          cal: $(this).parent(),
          pos: $(this).offset()
        };
        current.preview = current.cal.data('colorpicker').livePreview;
        ev.data = {'cal': current.cal, 'pos' : current.pos, 'preview':current.preview};
        change.apply(
          ev.data.cal.data('colorpicker')
            .fields
            .eq(4)
            .val(parseInt(getHueInCircle(ev),0))
            .end()
            .eq(5)
            .val(parseInt(100*getSatInCircle(ev)/91, 0))
            .get(0),
          [ev.data.preview]
        );
        $(document).bind('mouseup', current, upSelector);
        $(document).bind('mousemove', current, moveSelector);
      },
      moveSelector = function (ev) {
        change.apply(
          ev.data.cal.data('colorpicker')
            .fields
            .eq(4)
            .val(parseInt(getHueInCircle(ev),0))
            .end()
            .eq(5)
            .val(parseInt(100*getSatInCircle(ev)/91, 0))
            .get(0),
          [ev.data.preview]
        );
        return false;
      },
      upSelector = function (ev) {
        fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
        fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
        $(document).unbind('mouseup', upSelector);
        $(document).unbind('mousemove', moveSelector);
        return false;
      },
      /*****hue and saturation end *****/
      enterSubmit = function (ev) {
        $(this).addClass('fk-colorpicker-focus');
      },
      leaveSubmit = function (ev) {
        $(this).removeClass('fk-colorpicker-focus');
      },
      clickSubmit = function (ev) {
        var cal = $(this).parent();
        var col = cal.data('colorpicker').color;
        cal.data('colorpicker').origColor = col;
        setCurrentColor(col, cal.get(0));
        cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el);
      },
      show = function (ev) {
        var cal = $('#' + $(this).data('colorpickerId'));
        cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
        var pos = $(this).offset();
        var viewPort = getViewport();
        var top = pos.top + this.offsetHeight;
        var left = pos.left;
        if (top + 176 > viewPort.t + viewPort.h) {
          top -= this.offsetHeight + 176;
        }
        if (left + 356 > viewPort.l + viewPort.w) {
          left -= 356;
        }
        cal.css({left: left + 'px', top: top + 'px'});
        if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)]) != false) {
          cal.show();
        }
        $(document).bind('mousedown', {cal: cal}, hide);
        return false;
      },
      hide = function (ev) {
        if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
          if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)]) != false) {
            ev.data.cal.hide();
          }
          $(document).unbind('mousedown', hide);
        }
      },
      isChildOf = function(parentEl, el, container) {
        if (parentEl == el) {
          return true;
        }
        if (parentEl.contains) {
          return parentEl.contains(el);
        }
        if ( parentEl.compareDocumentPosition ) {
          return !!(parentEl.compareDocumentPosition(el) & 16);
        }
        var prEl = el.parentNode;
        while(prEl && prEl != container) {
          if (prEl == parentEl)
            return true;
          prEl = prEl.parentNode;
        }
        return false;
      },
      getViewport = function () {
        var m = document.compatMode == 'CSS1Compat';
        return {
          l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
          t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
          w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
          h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
        };
      },
      fixHSB = function (hsb) {
        return {
          h: Math.min(360, Math.max(0, hsb.h)),
          s: Math.min(100, Math.max(0, hsb.s)),
          b: Math.min(100, Math.max(0, hsb.b))
        };
      }, 
      fixRGB = function (rgb) {
        return {
          r: Math.min(255, Math.max(0, rgb.r)),
          g: Math.min(255, Math.max(0, rgb.g)),
          b: Math.min(255, Math.max(0, rgb.b))
        };
      },
      fixHex = function (hex) {
        var len = 6 - hex.length;
        if (len > 0) {
          var o = [];
          for (var i=0; i<len; i++) {
            o.push('0');
          }
          o.push(hex);
          hex = o.join('');
        }
        return hex;
      }, 
      HexToRGB = function (hex) {
        var hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
        return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
      },
      HexToHSB = function (hex) {
        return RGBToHSB(HexToRGB(hex));
      },
      RGBToHSB = function (rgb) {
        var hsb = {
          h: 0,
          s: 0,
          b: 0
        };
        var min = Math.min(rgb.r, rgb.g, rgb.b);
        var max = Math.max(rgb.r, rgb.g, rgb.b);
        var delta = max - min;
        hsb.b = max;
        if (max != 0) {
          
        }
        hsb.s = max != 0 ? 255 * delta / max : 0;
        if (hsb.s != 0) {
          if (rgb.r == max) {
            hsb.h = (rgb.g - rgb.b) / delta;
          } else if (rgb.g == max) {
            hsb.h = 2 + (rgb.b - rgb.r) / delta;
          } else {
            hsb.h = 4 + (rgb.r - rgb.g) / delta;
          }
        } else {
          hsb.h = -1;
        }
        hsb.h *= 60;
        if (hsb.h < 0) {
          hsb.h += 360;
        }
        hsb.s *= 100/255;
        hsb.b *= 100/255;
        return hsb;
      },
      HSBToRGB = function (hsb) {
        var rgb = {};
        var h = Math.round(hsb.h);
        var s = Math.round(hsb.s*255/100);
        var v = Math.round(hsb.b*255/100);
        if(s == 0) {
          rgb.r = rgb.g = rgb.b = v;
        } else {
          var t1 = v;
          var t2 = (255-s)*v/255;
          var t3 = (t1-t2)*(h%60)/60;
          if(h==360) h = 0;
          if(h<60) {rgb.r=t1; rgb.b=t2; rgb.g=t2+t3}
          else if(h<120) {rgb.g=t1; rgb.b=t2; rgb.r=t1-t3}
          else if(h<180) {rgb.g=t1; rgb.r=t2; rgb.b=t2+t3}
          else if(h<240) {rgb.b=t1; rgb.r=t2; rgb.g=t1-t3}
          else if(h<300) {rgb.b=t1; rgb.g=t2; rgb.r=t2+t3}
          else if(h<360) {rgb.r=t1; rgb.g=t2; rgb.b=t1-t3}
          else {rgb.r=0; rgb.g=0; rgb.b=0}
        }
        return {r:Math.round(rgb.r), g:Math.round(rgb.g), b:Math.round(rgb.b)};
      },
      RGBToHex = function (rgb) {
        var hex = [
          rgb.r.toString(16),
          rgb.g.toString(16),
          rgb.b.toString(16)
        ];
        $.each(hex, function (nr, val) {
          if (val.length == 1) {
            hex[nr] = '0' + val;
          }
        });
        return hex.join('');
      },
      HSBToHex = function (hsb) {
        return RGBToHex(HSBToRGB(hsb));
      },
      HSBToLeftTop = function(hsb){
        var lt = {};
        var hudu = (2*Math.PI / 360)*hsb.h, r = hsb.s;
        if(r>83){r = 83;}
        var y = Math.sin(hudu)*r+91, x = Math.cos(hudu)*r+91;
        lt.left = x;
        lt.top = y;
        return lt;
      },
      restoreOriginal = function () {
        var cal = $(this).parent();
        var col = cal.data('colorpicker').origColor;
        cal.data('colorpicker').color = col;
        fillRGBFields(col, cal.get(0));
        fillHexFields(col, cal.get(0));
        fillHSBFields(col, cal.get(0));
        setSelector(col, cal.get(0));
        setBrt(col, cal.get(0));
        setNewColor(col, cal.get(0));
      };
    return {
      init: function (opt) {
        var hexStr = "";
        opt = $.extend({}, defaults, opt||{});
        if (typeof opt.color == 'string') {
            hexStr = opt.color;
            opt.color = HexToHSB(opt.color);
        } else if (opt.color.r != undefined && opt.color.g != undefined && opt.color.b != undefined) {
          opt.color = RGBToHSB(opt.color);
        } else if (opt.color.h != undefined && opt.color.s != undefined && opt.color.b != undefined) {
          opt.color = fixHSB(opt.color);
        } else {
          return this;
        }
        return this.each(function () {
          if (!$(this).data('colorpickerId')) {
            var options = $.extend({}, opt);
            options.origColor = opt.color;
            var id = 'collorpicker_' + parseInt(Math.random() * 1000);
            $(this).data('colorpickerId', id);
            var cal = $(tpl).attr('id', id);
            if (options.flat) {
              cal.appendTo(this).show();
              $(document).bind('mousedown', {cal: cal}, hide);
            } else {
              cal.appendTo(document.body);
            }
            options.fields = cal
                      .find('input')
                        .bind('keyup', keyUp)
                        .bind('change', change)
                        .bind('blur', blur)
                        .bind('focus', focus)
                        .bind('keydown', keyDown);
            cal
              .find('span').bind('mousedown', downIncrement).end()
              .find('>div.J_colorpicker_current_color').bind('click', restoreOriginal);
            options.selector = cal.find('div.J_colorpicker_color').bind('mousedown', downSelector);
            cal.find('div.J_colorpicker_color').on('click',function(e){
                e.stopPropagation();
            });
            options.selectorIndic = options.selector.find('div div');
            options.el = this;
            options.brt = cal.find('div.J_colorpicker_brt div');
            cal.find('div.J_colorpicker_brt').bind('mousedown', downBrt);
            options.newColor = cal.find('div.J_colorpicker_new_color');
            options.currentColor = cal.find('div.J_colorpicker_current_color');
            cal.data('colorpicker', options);
            cal.find('div.J_colorpicker_submit')
              .bind('mouseenter', enterSubmit)
              .bind('mouseleave', leaveSubmit)
              .bind('click', clickSubmit);
            fillRGBFields(options.color, cal.get(0));
            fillHSBFields(options.color, cal.get(0));
            //hex值不一定相同，原本是fee166会变成fee266
            hexStr ? initHexFields(hexStr, cal.get(0)) : fillHexFields(options.color, cal.get(0));
            
            setBrt(options.color, cal.get(0));
            setSelector(options.color, cal.get(0));
            setCurrentColor(options.color, cal.get(0));
            setNewColor(options.color, cal.get(0));
            if (options.flat) {
              cal.css({
                position: 'relative',
                display: 'block'
              });
            } else {
              $(this).bind(options.eventName, show);
            }
          }
        });
      },
      showPicker: function() {
        return this.each( function () {
          if ($(this).data('colorpickerId')) {
            show.apply(this);
          }
        });
      },
      hidePicker: function() {
        return this.each( function () {
          if ($(this).data('colorpickerId')) {
            $('#' + $(this).data('colorpickerId')).hide();
          }
        });
      },
      setColor: function(col) {
        var hexStr = "";
        if (typeof col == 'string') {
          hexStr = col;
          col = HexToHSB(col);
        } else if (col.r != undefined && col.g != undefined && col.b != undefined) {
          col = RGBToHSB(col);
        } else if (col.h != undefined && col.s != undefined && col.b != undefined) {
          col = fixHSB(col);
        } else {
          return this;
        }
        return this.each(function(){
          if ($(this).data('colorpickerId')) {
            var cal = $('#' + $(this).data('colorpickerId'));
            cal.data('colorpicker').color = col;
            cal.data('colorpicker').origColor = col;
            fillRGBFields(col, cal.get(0));
            fillHSBFields(col, cal.get(0));
            //hex值不一定相同，原本是fee166会变成fee266
            hexStr ? initHexFields(hexStr, cal.get(0)) : fillHexFields(options.color, cal.get(0));

            setBrt(col, cal.get(0));
            setSelector(col, cal.get(0));
            setCurrentColor(col, cal.get(0));
            setNewColor(col, cal.get(0));
          }
        });
      }
    };
  }();
  $.fn.extend({
    faiColorPickerAdven: faiColorPickerAdven.init,
    faiColorPickerAdvenHide: faiColorPickerAdven.hidePicker,
    faiColorPickerAdvenShow: faiColorPickerAdven.showPicker,
    faiColorPickerAdvenSetColor: faiColorPickerAdven.setColor
  });
})(jQuery);
