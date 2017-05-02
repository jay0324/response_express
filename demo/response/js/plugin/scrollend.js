/* how to call it (with a 1000ms timeout):
$(window).scrollEnd(function(){
    alert('stopped scrolling');
}, 1000);
*/

$.fn.scrollEnd = function(callback, timeout) {          
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};