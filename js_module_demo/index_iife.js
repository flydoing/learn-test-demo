(function(window, undefined){
  //一、定义全局数据
  var Data = '';

  //二、首页JS功能
  var Index = (function(){
    var init;   //页面载入初始化操作

    //init初始化
    init = function(){
      var $doc = $(document);

      //ajax初始化数据读取
      dataAjax.initData();

      //上移
      $doc.on('click.up','.J_moveUp',function(){
        Func.moveUp($(this));
      });

      //下移
      $doc.on('click.down','.J_moveDown',function(){
        Func.moveDown($(this));
      });

      //删除
      $doc.on('click.del','.J_del',function(){
        //delJson
        Data.info.splice($('.J_del').index(this),1);
        //console.log(Data);
        Func.del($(this));
        Func.change();
      });

      //拖拽
      Fai.sort();

      //修改一行
      $doc.on('click.modify','.J_modify',function(){
        //获取当前行数据
        var data = {
          'name':Fai.encodeHtml($('.J_tr').eq($('.J_modify').index(this)).find('.J_name').text()),
          'birth':Fai.encodeHtml($('.J_tr').eq($('.J_modify').index(this)).find('.J_birth').text())
        }
        //弹窗
        Func.popShowChange(data);
        $('.J_pop_bg').css({'width':$(window).width()-150,'height':$(window).height()-70});
        $( ".J_pop_content" ).draggable({containment:'.J_pop_bg',scroll:false,cursor:'Move',handle:'.J_pop_move'});
        //addtr
        Func.changeTr($(this),$('.J_modify').index(this));
      });

      //添加一行
      $doc.on('click.add','.J_add_tr',function(){
        Func.popShow();
        $('.J_pop_bg').css({'width':$(window).width()-150,'height':$(window).height()-70});
        $( ".J_pop_content" ).draggable({containment:'.J_pop_bg',scroll:false,cursor:'Move',handle:'.J_pop_move'});
        Func.addTr();
      });

      //点击保存
      $('.J_save').click(function(){
        var data = $.toJSON(Data.info);
        alert(data);
        dataAjax.saveData(data);
      });
    };
    return {
      init : init
    };
  })();

  //三、功能模块
  var Func = (function(){
    var moveUp,         //上移
        moveDown,       //下移
        del,            //删除一行
        change,         //首、尾行无上、下移动
        popShow,        //添加一行弹窗
        popShowChange,  //修改一行弹窗
        addTr,          //增加一行
        changeTr;       //修改一行

    moveUp = function(obj){
      var $tr = $('.J_tr').eq($('.J_moveUp').index(obj));
      if ($tr.index() != 0) { 
          $tr.fadeOut('fast').fadeIn('fast');
          $tr.prev().before($tr);
          Func.change();
      } 
    };

    moveDown = function(obj){
      var len = $('.J_sorttable').find('tr').length,
          $tr = $('.J_tr').eq($('.J_moveDown').index(obj));

      if ($tr.index() != len - 1) { 
          $tr.fadeOut('fast').fadeIn('fast'); 
          $tr.next().after($tr);
          Func.change();
      } 
    };

    del = function(obj){
      var $tr = $('.J_tr').eq($('.J_del').index(obj));
      $tr.remove();
    };

    change = function(){
      $('.J_tr').removeClass('fk-first-tr fk-last-tr');
      $('.J_tr:last').addClass('fk-last-tr');
      $('.J_tr:first').addClass('fk-first-tr');
    };

    popShow = function(){
      //添加行，弹窗的出现
      var pHtml=jsHtml.popHtml();
      $('body').append(pHtml);
      //点击取消
      $('.J_pop_no').click(function(){
        $('.J_pop_bg').remove();
        $('.J_pop_content').remove();
      });
    };

    popShowChange = function(data){
      //弹窗的出现，样式
      var pHtml=jsHtml.popchangeHtml(data.name,data.birth);
      $('body').append(pHtml);
      //点击取消
      $('.J_pop_no').click(function(){
        $('.J_pop_bg').remove();
        $('.J_pop_content').remove();
      });
    };

    addTr = function(data){
      //点击确定
      $('.J_pop_yes').click(function(){
        var name = Fai.noSpace($('.J_data_name').val()),
            birth = Fai.noSpace($('.J_data_birth').val());

        if(name == ''){
          alert('姓名不能为空！');
        }else{
          //获取2数据、增加行
          var dataTr = {
            'name' : Fai.encodeHtml(name),
            'birth' : Fai.encodeHtml(birth)
          }
          //addJson
          Data.info.push(dataTr);
          //console.log(Data);
          var trHtml = jsHtml.addHtml(dataTr.name,dataTr.birth);
          $('.J_sorttable').append(trHtml);

          Func.change();
          //弹窗消失
          $('.J_pop_bg').remove();
          $('.J_pop_content').remove();
        }
      });
    };
    changeTr = function(obj,index){
      //点击确定
      $('.J_pop_yes').click(function(){
        var name = Fai.noSpace($('.J_data_name').val()),
            birth = Fai.noSpace($('.J_data_birth').val());

        if(name == ''){
          alert('姓名不能为空！');
        }else{
          //获取2数据
          var dataTr={
            'name' : name,
            'birth' : birth
          }
          //修改行
          $('.J_tr').eq(index).find('.J_name').text(dataTr.name);
          $('.J_tr').eq(index).find('.J_birth').text(dataTr.birth);
          //changeJson
          var info = Data.info;
          info[index].name=dataTr.name;
          info[index].birth=dataTr.birth;
          //console.log(Data);
          //弹窗消失
          $('.J_pop_bg').remove();
          $('.J_pop_content').remove();
        }
      });
    };

    return {
      moveUp : moveUp,
      moveDown : moveDown,
      del : del,
      change : change,
      popShow : popShow,
      popShowChange : popShowChange,
      addTr : addTr,
      changeTr : changeTr
    };
  })();

  //四、工具模块
  var Fai = (function(){
    var encodeHtml, //进行html转码
        getSubstr,  //字符串截取省略
        noSpace,    //去掉全部空格
        sort;       //拖拽弹窗

    //进行html转码
    encodeHtml = function(html){
      return html && html.replace ? (html.replace(/&/g, "&amp;").replace(/ /g, "&nbsp;").replace(/\b&nbsp;+/g, " ").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\/g, "&#92;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/\n/g, "<br/>").replace(/\r/g, "")) : html;
    };

    //字符串截取省略
    getSubstr = function(str,len){
      var str = (str.length > len) ? str.substr(0,len)+'...' : str;
      return str;
    };

    //去掉全部空格
    noSpace = function(str){
      return str.replace(/\s+/g, "");
    };

    //拖拽弹窗
    sort = function(){
      $('.J_sorttable tbody').sortable({
        delay: 1,
        cancel: '.f-head',
        stop: function(){
          Func.change();
        }
      });
    };

    return {
      encodeHtml : encodeHtml,
      getSubstr : getSubstr,
      noSpace : noSpace,
      sort : sort
    };
  })();

  //五、html组装
  var jsHtml = (function(){
    var initH,          //初始插入，tr行结构
        popHtml,        //新增一行，弹窗结构
        popchangeHtml,  //修改一行，弹窗结构
        addHtml;        //插入一行，tr行结构

    initH = function(name,birth){
      var nHtml =    "<tr class='J_tr fk-last-tr'>";
          nHtml +=      "<td class='fk-name'><span class='J_name f-name'>"+name+"</span></td>";
          nHtml +=      "<td class='fk-birth'><span class='J_birth f-birth'>"+birth+"</span></td>";
          nHtml +=      "<td class='fk-caozuo'>";
          nHtml +=         "<a class='J_del f-del'>删除</a> ";
          nHtml +=         "<a class='J_modify f-modify'>修改</a> ";
          nHtml +=         "<a class='J_moveUp f-moveUp'>上移</a> ";
          nHtml +=         "<a class='J_moveDown f-moveDown'>下移</a> ";
          nHtml +=      "</td>";
          nHtml +=   "</tr>";
      return nHtml;
    };

    popHtml = function(){
      var pHtml =        "<div class='J_pop_bg fk-pop-bg'></div>";
          pHtml +=       "<div class='J_pop_content fk-pop-content'>";
          pHtml +=         "<h4 class='J_pop_move'>添加行</h4>";
          pHtml +=         "<div class='f-pop-body'>";
          pHtml +=           "<label>姓名：</label><input type='text' class='J_data_name' value='' /><br>";
          pHtml +=           "<label>生日：</label><input type='text' class='J_data_birth' value='' />";
          pHtml +=         "<div class='f-pop-foot'>";
          pHtml +=           "<a class='J_pop_yes f-pop-yes' href='javascript:;'>确定</a>";
          pHtml +=           "<a class='J_pop_no' href='javascript:;'>取消</a>";
          pHtml +=         "</div>";
          pHtml +=       "</div>";
      return pHtml;
    };

    popchangeHtml = function(name,birth){
      var pHtml=        "<div class='J_pop_bg fk-pop-bg'></div>";
          pHtml +=      "<div class='J_pop_content fk-pop-content'>";
          pHtml +=        "<h4 class='J_pop_move'>修改行</h4>";
          pHtml +=        "<div class='f-pop-body'>";
          pHtml +=          "<label>姓名：</label><input type='text' class='J_data_name' value='"+name+"' /><br>";
          pHtml +=          "<label>生日：</label><input type='text' class='J_data_birth' value='"+birth+"' />";
          pHtml +=        "<div class='f-pop-foot'>";
          pHtml +=          "<a class='J_pop_yes f-pop-yes' href='javascript:;'>确定</a>";
          pHtml +=          "<a class='J_pop_no' href='javascript:;'>取消</a>";
          pHtml +=        "</div>";
          pHtml +=      "</div>";
      return pHtml;
    };

    addHtml = function(name,birth){
      var trHtml =         "<tr class='J_tr fk-last-tr'>";
          trHtml +=           "<td class='fk-name'><span class='J_name f-name'>"+name+"</span></td>";
          trHtml +=           "<td class='fk-birth'><span class='J_birth f-birth'>"+birth+"</span></td>";
          trHtml +=           "<td class='fk-caozuo'>";
          trHtml +=              "<a class='J_del f-del'>删除</a> ";
          trHtml +=              "<a class='J_modify f-modify'>修改</a> ";
          trHtml +=              "<a class='J_moveUp f-moveUp'>上移</a> ";
          trHtml +=              "<a class='J_moveDown f-moveDown'>下移</a> ";
          trHtml +=           "</td>";
          trHtml +=        "</tr>";
      return trHtml;
    };
    return {
      initH : initH,
      popHtml : popHtml,
      popchangeHtml : popchangeHtml,
      addHtml : addHtml
    };
  })();

  //六、ajax
  var dataAjax = (function(){
    var initData,     //进行html转码
        saveData;     //字符串截取省略

    //ajax获取初始化数据
    initData = function(){
      $.ajax({
        url: 'data.jsp',
        type: 'post',
        data: 'order=getInfo',
        success : function(data){
          Data = $.parseJSON(data);
          if(Data.success){
            $.each(Data.info,function(i,item){
              var nHtml=jsHtml.initH(item.name,item.birth);
              $('.J_sorttable').append(nHtml);
              Func.change();
            });
            Fai.sort();
          }else if(Data.success == false){
            alert(Data.info);
          }
          
        },
        error : function(err){
          alert(err);
        }
      });
    };

    //保存后异步获取返回的长度
    saveData = function(data){
      $.ajax({
        url: 'data.jsp',
        type: 'post',
        data: 'order=saveInfo&data='+data,
        success : function(data){
          data = $.parseJSON(data);
          if(data.success == true){
            alert("保存了的数目："+data.info);
          }else if(data.success == false){
            alert("保存失败了噢："+data.info);
          }
        },
        error : function(err){
          alert(err);
        }
      });
    };
    return {
      initData : initData,
      saveData : saveData
    };
  })();

  //七、执行入口
  $(function(){
    Index.init();
    //$('.J_move').css({'width':$(window).width(),'height':$(window).height(),'display':'block'});
  });
})(window);