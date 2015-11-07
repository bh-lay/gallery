
//启用插件 
fis.hook('relative'); 

fis.match('*.psd',{
	release: false
});
fis.match('gallery.css',{
	release: false
});
fis.match('loading.gif',{
	release: false
});
fis.match('tpl.html',{
	release: false
});
fis.match('view_skin.png',{
	release: false
});
//让所有文件，都使用相对路径。 
fis.match('**', {
  relative: true
});