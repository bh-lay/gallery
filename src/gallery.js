/////////////////////////////////////////////////
//this is pic gallery
//gallery([{}],0,);
/////////////////////////////////////////

(function(global,doc,factory){
	var gallery = factory(global,doc);
	global.gallery = global.factory || gallery;

	global.define && define(function(){
		return gallery;
	});
})(window,document,function(exports){
	var gallery_tpl = __inline("tpl.html"),
		public_changeID = 0,
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
		var me = this,
			index = this.cur.index,
			mainPic = this.dom.find('.lan_img img'),
			changeDelay = 0,
			list_cntW = null,
			src = this.json[index]['cover'],
			this_changeID = ++public_changeID;

		if(this.total == 0){
			me.exist();
			return
		}	
		this.resetList();
		
		
		mainPic.stop().fadeTo(70,0);
		clearTimeout(changeDelay);
		changeDelay = setTimeout(function(){
			mainPic.attr('src',src);
			loadImg(src,{
				loadFn: function(w,h){
					me.cur.width = w;
					me.cur.height = h;
					if(this_changeID == public_changeID){
						me.fix_resize();
					}
				},
				errorFn: function(){
					console.log('gallery:','pic error !');
					me.cur.width = 40;
					me.cur.height = 40;
					if(this_changeID == public_changeID){
						me.fix_resize();
					}
				}
			});
		},100);
	};
	
	//////////////////////////////////////////////////
	function bindEvent(){
		var me = this,
			except = false;
		$(window).resize(me.resize_callback).on('keydown',me.key_callback);
		
		// bind this gallery event
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
		
		me.dom.on('click',function(e){
			var this_area = check_mouse(e);
			if(this_area == 'left'){
				me.prev()
			}else if(this_area == 'right' ){
				me.next()
			}
		}).on('mousemove',function(e){
			var this_area = check_mouse(e);
			if(except){
				me.next_btn.removeClass('active');
				me.prev_btn.removeClass('active');
			}else if(this_area == 'left'){
				me.next_btn.removeClass('active');
				me.prev_btn.addClass('active');
			}else if(this_area == 'right' ){
				me.prev_btn.removeClass('active');
				me.next_btn.addClass('active');
			}else{
				me.prev_btn.removeClass('active');
				me.next_btn.removeClass('active');
			}
		}).on('mousemove','.lan_List,.lan_exist',function(){
			except = true ;
		}).on('click','.lan_exist',function(){
			me.exist();
			return false;
		}).on('click','.lan_List_cnt a',function(){
			me.cur.index = $(this).index();
			changePic.call(me);
		});
	
	}
		
	//////////////////////////////////////////////////////
	function Gallery(json,index){
		if(!(this instanceof Gallery)){
			return new Gallery(json,index);
		}
		var me = this,
			dom_html = gallery_tpl,
			winResizeDelay,
			private_bottomH = 100;
		
		this.json = json;
		this.total = json.length;
		this.dom = $(dom_html);
		this.$list = this.dom.find('.lan_List_cnt');
		this.next_btn = this.dom.find('.lan_next');
		this.prev_btn = this.dom.find('.lan_prev');
		this.thumb_width = 88;
		this.cur = {
			index : index || 0,
			width : null,
			height : null
		};
		
		me.resize_callback = function(){
			clearTimeout(winResizeDelay);
			winResizeDelay = setTimeout(function(){
				public_winH = public_win.height(),
				public_winW = public_win.width(),
				me.fix_resize();
			},200);
		};
		me.key_callback = function(e){
			console.log('gallery:','press key !');
			var key = parseInt(e.keyCode);
			switch(key) {
				case 37:
					me.prev();
					break
				case 39:
					me.next();
					break
				case 27:
					me.exist();
					break
			}
		};

		/////////////////////////////////////////////////////
		function render_thumb(){
			var picList = '';
			for(var s = 0;s < me.total;s++){
				picList += "<a href='javascript:void(0)'><span data-src='" + me.json[s]['thumb'] + "'></span></a>";
			}
			me.$list.html(picList);
			
			me.$list.find('span').each(function(){
				var this_dom = $(this);
				var src = this_dom.attr('data-src');
				this_dom.css('backgroundImage','url(\"' + src + '\")');
			});
		}
		me.fix_resize = function(){
			var w = me.cur.width,
				h = me.cur.height,
				mainPicCnt = me.dom.find('.lan_img'),
				mainPic = mainPicCnt.find('img');
			
			if(h > public_winH - private_bottomH){
				var newH = public_winH - private_bottomH - 20;
				w = newH*w/h;
				h = newH;
			}
			if(w > public_winW-20){
				var newW = public_winW - 20;
				h = newW*h/w;
				w = newW;
			}
			var Bottom =  (public_winH + private_bottomH - h)/2,
			Left = public_winW < w ? 0 : (public_winW - w)/2;
		
			mainPicCnt.animate({
				width: w,
				height: h,
				bottom: Bottom,
				left: Left
			},100,function(){
				mainPic.stop().fadeTo(80,1);
			});
			me.resetList();
		};
		
		
		// start ////////////////////////////////////
		if(me.total == 0){
			console.log('gallery:','stop list does not exist !');
			return
		}
		$('body').append(me.dom);
		bindEvent.call(this);
		render_thumb();
		changePic.call(this);
	};
	
	Gallery.prototype = {
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
		next: function(){
			if(this.total == 1){
				return
			}
			if (this.cur.index >= this.total-1){
				this.cur.index = 0;
			}else{
				this.cur.index++;
			}
			changePic.call(this);
		},
		prev: function(){
			if(this.total == 1){
				return
			}
			if (this.cur.index <= 0){
				this.cur.index = this.total-1;
			}else{
				this.cur.index--
			}
			changePic.call(this);
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
					left: left
				},100);
			}else{
				this.$list.css('left', public_winW/2 - list_cntW/2);
			}
		}
	};
	return Gallery;
});