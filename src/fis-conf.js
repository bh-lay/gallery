
//启用插件 
fis.hook('relative'); 

fis.match('*.psd',{
	release: false
});
//让所有文件，都使用相对路径。 
fis.match('**', {
  relative: true
});