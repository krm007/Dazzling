window.onload=function(){
    var E = window.wangEditor;
    var editor = new E('#editor');
    // 监控变化，同步更新到 textarea
    var $qtitle = document.getElementById('qtitle');
    editor.customConfig.onchange = function (html) {
      $qtitle.innerHTML=html;
    }
    //开启图片上传并设置处理图片的服务器接口地址
    editor.customConfig.uploadImgServer = '/upload';
    //设置上传的图片名称
    editor.customConfig.uploadFileName = 'editimages';
    editor.create();
}