/////////////////////////////////////////////////
//this is pic gallery
//gallery([{}],0,);
/////////////////////////////////////////
function gallery(json,index){
	return new gallery.init(json,index);
}
(function(exports){
	var console = window.console||{'log':function(){}};
	
	var gallery_tpl = "<div class='lan_show'>\n\t<style>.lan_show{\r\n\twidth:100%;\r\n\theight:100%;\r\n\tposition:absolute;\r\n\tleft:0px;\r\n\ttop:0px;\r\n\ttext-align:center;\r\n\tz-index:6000;\r\n\toverflow:auto;\r\n\tcursor:pointer;\r\n\tbackground:#888;\r\n\tbackground:rgba(0,0,0,0.8);\r\n\t-moz-user-select: none;\r\n\t-webkit-user-select: none;\r\n\t-ms-user-select: none;\r\n\t-khtml-user-select: none;\r\n\tuser-select: none\r\n}\r\n.lan_img {\r\n\tposition:absolute;\r\n\tbackground:url(\"data:image/gif;base64,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\") no-repeat center center #fff;\r\n\tleft:30%;\r\n\tbottom:40%;\r\n\twidth:40%;\r\n\theight:20%;\r\n}\r\n.lan_img img {\r\n\tdisplay:block;width:100%;height:100%;background:#fff;\r\n}\r\n\r\n.lan_List{position:absolute;z-index:0;left:0px;bottom:0px;width:100%;height:88px;padding-top:28px;overflow:hidden;cursor:default}\r\n.lan_List_cnt{\r\n\tposition:relative;\r\n\theight:88px;\r\n\tmargin:0px;\r\n}\r\n.lan_List_cnt a{display:block;float:left;width:84px;height:84px;background:#333;border:2px solid #000;position:relative;}\r\n.lan_List_cnt a span{width:84px;height:84px;border:none;position:absolute;left:0px;top:0px;\r\n\tbackground-color:#333;\r\n\tbackground-size:cover;\r\n\tbackground-repeat:no-repeat;\r\n\tbackground-position:center center;\r\n\ttransition: ease-in 0.08s;\r\n\t-moz-transition-duration: ease-in 0.08s;\r\n\t-webkit-transition-duration: ease-in 0.08s;\r\n\t-o-transition-duration: ease-in 0.08s;\r\n}\r\n.lan_List_cnt a:hover{border-color:#fff;}\r\n.lan_List_cnt a span img{display:block;width:100%;height:100%}\r\n.lan_List_cnt a.cur{border-color:#000;cursor:default;z-index:10}\r\n.lan_List_cnt a.cur span{width:100px;height:100px;top:-16px;left:-8px;background-color:#666;}\r\n\r\n.lan_exist {background:#000;opacity:.4;color:#fff;cursor:pointer;font-size:20px;width:30px;height:30px;line-height:30px;position:absolute;right:5px;top:5px;border-radius:15px;z-index: 100;text-align:center;}\r\n.lan_exist:hover {opacity:1;}\r\n.lan_next, .lan_prev{\r\n\tdisplay:block;\r\n\twidth:50px;\r\n\theight:60px;\r\n\tposition:absolute;\r\n\ttop:50%;\r\n\tmargin-top:-30px;\r\n\tbackground-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAB4CAYAAAAE9le0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3NpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxOWNhZTgyMi03YTIyLTQ2OGMtODVjYy0zMzY2ZWIzOWI1YzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUMwQTVGMDQ3NUFBMTFFNUIxNDlBNTdCRUJDQjQxOUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUMwQTVGMDM3NUFBMTFFNUIxNDlBNTdCRUJDQjQxOUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MTljYWU4MjItN2EyMi00NjhjLTg1Y2MtMzM2NmViMzliNWM4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjE5Y2FlODIyLTdhMjItNDY4Yy04NWNjLTMzNjZlYjM5YjVjOCIvPiA8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);\r\n}\r\n.lan_next{\r\n\tright:30px;background-position: 0 -60px;}\r\n.lan_prev{\r\n\tleft:30px;background-position: 0 0;}\r\n.lan_next.active{background-position:-50px -60px;}\r\n.lan_prev.active{background-position:-50px 0;}</style>\n\t<div class='lan_img'>\n\t\t<div class='lan_exist'>×</div>\n\t\t<img src='' />\n\t</div>\n\t<div class='lan_List'>\n\t\t<div class='lan_List_cnt'>\n\t\t</div>\n\t</div>\n\t<div class='lan_prev' title='上一张'></div>\n\t<div class='lan_next' title='下一张'></div>\n</div>";
	
	
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
		var winResizeDelay;
		$(window).resize(function(){
			clearTimeout(winResizeDelay);
			winResizeDelay = setTimeout(function(){
				console.log('gallery:','window resizing !');
				public_winH = public_win.height(),
				public_winW = public_win.width(),
				that.resize();
			},200);
		}).on('keydown',function(e){
			if(!that.isactive){
				return
			}
			console.log('gallery:','press key !');
			var key = parseInt(e.keyCode);
			switch(key) {
				case 37:
					that.prev();
					break
				case 39:
					that.next();
					break
				case 27:
					that.exist();
					break
			}
		});
		
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
		}).on('mousemove','.lan_exist,.lan_List,.lan_to_cnt',function(){
			except = true ;
		}).on('click','.lan_exist',function(){
			that.exist();		
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
		
		this.isactive = true
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
		change_active: function(check){
			if(typeof(check) == "boolean" ){
				this.isactive = check;
			} 
		},
		exist: function(){
			this.isactive = false;
			this.dom.fadeOut(150,function(){
				$(this).remove();
			});
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