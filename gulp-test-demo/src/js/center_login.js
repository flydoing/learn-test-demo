/*pageFit start*/
function pageFit(doc,win,maxwidth,minwidth,font) {
  var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        if(clientWidth>=minwidth&&clientWidth<=maxwidth){
            docEl.style.fontSize = font * (clientWidth / maxwidth) + 'px';
        }
        else if(clientWidth>maxwidth){
            docEl.style.fontSize = font+'px';
        }
        else if(clientWidth<minwidth){  
            docEl.style.fontSize = font * (minwidth / maxwidth) + 'px';
        }
      };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
}
pageFit(document,window,720,320,40);
/*pageFit end*/

$(function(){
    // alert('haha');
});
