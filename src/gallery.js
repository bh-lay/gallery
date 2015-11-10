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
			$mainPic = this.dom.find('.lan_img img'),
			changeDelay,
			src = this._data[index]['cover'],
			this_changeID = ++public_changeID;

		if(this._data.length == 0){
			me.exist();
			return
		}	
		resetList.call(me);
		
		$mainPic.stop().fadeTo(70,0);
		clearTimeout(changeDelay);
		changeDelay = setTimeout(function(){
			loadImg(src,{
				loadFn: function(w,h){
					me.cur.width = w;
					me.cur.height = h;
					$mainPic.attr('src',src);
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
		$(window).resize(me._resize_callback).on('keydown',me._key_callback);
		
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
	function resetList(){
		var me = this,
			index = me.cur.index,
			$items = this.$list.find('a'),
			thumb_width = $items.eq(0).outerWidth(),
			list_cntW = thumb_width * me._data.length,
			left;
		this.$list.width(list_cntW);
		
		$items.removeClass('cur').eq(index).addClass('cur');
		if(list_cntW > public_winW){
			left = public_winW/2 - thumb_width * (index + .5);
			if(left > 10){
				left = 10;
			}
			if(left < public_winW - list_cntW - 10){
				left = public_winW - list_cntW - 10;
			}
			this.$list.animate({
				left: left
			},100);
		}else{
			this.$list.css('left', public_winW/2 - list_cntW/2);
		}
	}
	function render_thumb(){
		var picList = '';
		for(var s = 0;s < me._data.length;s++){
			picList += "<a href='javascript:void(0)'><span style='background-image:url(" + me._data[s]['thumb'] + ")'></span></a>";
		}
		me.$list.html(picList);
	}
	//////////////////////////////////////////////////////
	function Gallery(data,index){
		if(!(this instanceof Gallery)){
			return new Gallery(data,index);
		}
		var me = this,
			winResizeDelay,
			private_bottomH = 100;
		
		this._data = data;
		this.dom = $(gallery_tpl);
		this.$list = this.dom.find('.lan_List_cnt');
		this.next_btn = this.dom.find('.lan_next');
		this.prev_btn = this.dom.find('.lan_prev');
		this.cur = {
			index : index || 0,
			width : null,
			height : null
		};
		
		me._resize_callback = function(){
			clearTimeout(winResizeDelay);
			winResizeDelay = setTimeout(function(){
				public_winH = public_win.height(),
				public_winW = public_win.width(),
				me.fix_resize();
			},200);
		};
		me._key_callback = function(e){
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
		
		// start ////////////////////////////////////
		if(me._data.length == 0){
			console.log('gallery:','stop list does not exist !');
			return
		}
		$('body').append(me.dom);
		bindEvent.call(me);
		render_thumb.call(me);
		changePic.call(me);
	};
	
	Gallery.prototype = {
		fix_resize: function(){
			var me = this,
				w = me.cur.width,
				h = me.cur.height,
				maxWidth = public_winW - 20,
				maxHeight = public_winH - private_bottomH - 20,
				mainPicCnt = me.dom.find('.lan_img'),
				mainPic = mainPicCnt.find('img');
			
			if(h > maxHeight){
				w = maxHeight*w/h;
				h = maxHeight;
			}
			if(w > maxWidth){
				h = maxWidth*h/w;
				w = maxWidth;
			}
		
			mainPicCnt.animate({
				width: w,
				height: h,
				top: (public_winH - private_bottomH - h)/2,
				left: (public_winW - w)/2
			},100,function(){
				mainPic.stop().fadeTo(80,1);
			});
			resetList.call(me);
		},
		next: function(){
			if(this._data.length == 1){
				return
			}
			if (this.cur.index >= this._data.length-1){
				this.cur.index = 0;
			}else{
				this.cur.index++;
			}
			changePic.call(this);
		},
		prev: function(){
			if(this._data.length == 1){
				return
			}
			if (this.cur.index <= 0){
				this.cur.index = this._data.length-1;
			}else{
				this.cur.index--
			}
			changePic.call(this);
		},
		exist: function(){
			this.dom.fadeOut(150,function(){
				$(this).remove();
			});
			$(window).unbind('resize',this._resize_callback).unbind('keydown',this._key_callback);
			//注销自己
			for(var i in this){
				delete(this[i]);
			}
		}
	};
	return Gallery;
});