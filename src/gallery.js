/////////////////////////////////////////////////
//this is pic gallery
//gallery([{}],0,);
/////////////////////////////////////////
function gallery(json,index){
	return new gallery.init(json,index);
}
(function(exports){
	var console = window.console||{'log':function(){}};
	
	var gallery_tpl = __inline("tpl.html");
	
	
	var public_changeID = 0,
		 public_win = $(window),
		 public_winH = public_win.height(),
		 public_winW = public_win.width();
	
	//load image
	function loadImg(src,parm){
		var parm = parm||{};
		var img = new Image();
		if(parm.errorFn){
			img.onerror = function(){		
				parm.errorFn();
			}
		}
		if(parm.loadFn){
			img.onload = function(){
				parm.loadFn(img.width,img.height);
			}
		}
		if(parm.sizeFn){
			var delay = setInterval(function(){
				if(img.width>1){
					clearInterval(delay);
					parm.sizeFn(img.width,img.height);
				}
			},2)
		}
		
		img.src=src;
	};
	
	//////////////////////////////////////////////////////
	function changePic(){
		var that = this;
		if(this.total == 0){
			this.exist();
			return
		}
		var this_changeID = ++public_changeID;
		
		console.log('gallery:','change picture view !');
		
		var index = this.cur.index,
			 mainPic = this.dom.find('.lan_img img'),
			 changeDelay = 0,
			 list_cntW = null;
		
		this.resetList();
		
		var src = this.json[index]['cover'];
		
		mainPic.stop().fadeTo(70,0);
		clearTimeout(changeDelay);
		changeDelay = setTimeout(function(){
			mainPic.attr('src',src);
			loadImg(src,{
				'loadFn':function(w,h){
					that.cur.width = w;
					that.cur.height = h;
					//console.log('LOOK ME:',this_changeID , private_changeID);
					if(this_changeID == public_changeID){
						that.resize();
					}
				},
				'errorFn':function(){
					console.log('gallery:','pic error !');
					that.cur.width = 40;
					that.cur.height = 40;
					if(this_changeID == public_changeID){
						that.resize();
					}
				}
			});
		},100);
	};
	
	//////////////////////////////////////////////////
	function bindEvent(){
		var that = this;
		$(window).resize(that.resize_callback).on('keydown',that.key_callback);
		
		// bind this gallery event
		var except = false ;
		function check_mouse(event){
			var area = null;
			if(except || event.clientY > public_winH - 160){
				area = null;
				except = false;
			}else	if(event.clientX < public_winW/2){
				area = 'left';
			}else{
				area = 'right';
			}
			return area ;
		}
		
		this.dom.on('click',function(e){
			var this_area = check_mouse(e);
			if(this_area == 'left'){
				that.prev()
			}else if(this_area == 'right' ){
				that.next()
			}
		}).on('mousemove',function(e){
			var this_area = check_mouse(e);
			if(this_area == 'left'){
				that.next_btn.removeClass('active');
				that.prev_btn.addClass('active');
			}else if(this_area == 'right' ){
				that.prev_btn.removeClass('active');
				that.next_btn.addClass('active');
			}else{
				that.prev_btn.removeClass('active');
				that.next_btn.removeClass('active');
			}
		}).on('mousemove','.lan_List,.lan_to_cnt',function(){
			except = true ;
		}).on('click','.lan_exist',function(){
			that.exist();
			return false;
		}).on('click','.lan_List_cnt a',function(){
			that.cur.index = $(this).index();
			changePic.call(that);
		});
	
	}
		
	//////////////////////////////////////////////////////
	var init = function(json,index){
		console.log('gallery:','Calculate the initial parameters !');
		var dom_html = gallery_tpl;
		var this_gal = this;
		
		this.json = json;
		this.total = json.length;
		this.dom = $(dom_html);
		this.$list = this.dom.find('.lan_List_cnt');
		this.next_btn = this.dom.find('.lan_next');
		this.prev_btn = this.dom.find('.lan_prev');
		this.thumb_width = 88;
		this.cur = {
			'index' : index || 0,
			'width' : null,
			'height' : null
		};
		
		var winResizeDelay;
		this.resize_callback = function(){
			clearTimeout(winResizeDelay);
			winResizeDelay = setTimeout(function(){
				console.log('gallery:','window resizing !');
				public_winH = public_win.height(),
				public_winW = public_win.width(),
				this_gal.resize();
			},200);
		};
		this.key_callback = function(e){
			console.log('gallery:','press key !');
			var key = parseInt(e.keyCode);
			switch(key) {
				case 37:
					this_gal.prev();
					break
				case 39:
					this_gal.next();
					break
				case 27:
					this_gal.exist();
					break
			}
		};
		var private_bottomH = 120;

		

		/////////////////////////////////////////////////////
		function render_thumb(){
			var picList = '';
			for(var s = 0;s < this_gal.total;s++){
				picList += "<a href='javascript:void(0)'><span data-src='" + this_gal.json[s]['thumb'] + "'></span></a>";
			}
			this_gal.$list.html(picList);
			
			this_gal.$list.find('span').each(function(){
				var this_dom = $(this);
				var src = this_dom.attr('data-src');
				this_dom.css('backgroundImage','url(\"' + src + '\")');
			});
		}
		////////////////////////////////////////////
		this.next = function(){
			if(this.total == 1){
				return
			}
			if (this.cur.index >= this.total-1){
				this.cur.index = 0;
			}else{
				this.cur.index++;
			}
			changePic.call(this);
		};
		this.prev = function(){
			if(this.total == 1){
				return
			}
			if (this.cur.index <= 0){
				this.cur.index = this.total-1;
			}else{
				this.cur.index--
			}
			changePic.call(this);
		};
		this.resize = function(){
			var w = this_gal.cur.width,
				 h = this_gal.cur.height,
				 mainPicCnt = this_gal.dom.find('.lan_img'),
				 mainPic = mainPicCnt.find('img');
			
			if(h>public_winH-private_bottomH){
				var newH = public_winH - private_bottomH -30;
				w = newH*w/h;
				h = newH;
			}
			if(w > public_winW-200){
				var newW = public_winW - 200;
				h = newW*h/w;
				w = newW;
			}
			var Bottom =  (public_winH + private_bottomH - h)/2,
			Left = (public_winW - w)/2;
		
			(Left<0)&&(Left=0);
			mainPicCnt.animate({'width':w,'height':h,'bottom':Bottom,'left':Left},100,function(){
				mainPic.stop().fadeTo(80,1);
			});
			mainPic.css({'width':w,'height':h});
			this_gal.resetList();
		};
		
		
		// start ////////////////////////////////////
		if(this.total == 0){
			console.log('gallery:','stop list does not exist !');
			return
		}
		$('body').append(this.dom).hide().fadeIn(400);
		bindEvent.call(this);
		render_thumb();
		changePic.call(this);
	};
	
	init.prototype = {
		del: function(){
			if(this.total == 1){
				this.exist();
				return
			}else if(this.total == 2){
				this.next_btn.hide();
				this.prev_btn.hide();
			}
			
			this.dom.find('.lan_List_cnt a.cur').remove();
			this['json'].splice(this['cur']['index'],1);
			this.total--;
			this.next();
		},
		rename: function(name){
			var index = this['cur']['index'];
			var cover = this['json'][index]['cover'];
			var path_part = cover.match(/(.+\/).+$/);
			if(path_part){
				this['json'][index]['cover'] = path_part[1] + name;
			}
		},
		exist: function(){
			this.dom.fadeOut(150,function(){
				$(this).remove();
			});
			$(window).unbind('resize',this.resize_callback).unbind('keydown',this.key_callback);
			//注销自己
			for(var i in this){
				delete(this[i]);
			}
		},
		resetList: function (){
			var me = this,
				index = me.cur.index,
				list_cntW = me.thumb_width * me.total,
				left;
			this.$list.width(list_cntW);
			
			this.$list.find('a').removeClass('cur').eq(index).addClass('cur');
			if(list_cntW > public_winW){
				left = -this.thumb_width * index + (public_winW - this.thumb_width)/2;
				if(left > 0){
					left = 0;
				}
				if(list_cntW + left < public_winW){
					left = public_winW-list_cntW;
				}
				this.$list.animate({
					left,left
				},100);
			}else{
				this.$list.css('left', public_winW/2 - list_cntW/2);
			}
		}
	};
	exports.init = init;
})(gallery);