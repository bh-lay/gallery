/////////////////////////////////////////////////
//this is pic gallery
//gallery([{}],0,);
/////////////////////////////////////////
function gallery(json,index){
	return new gallery.init(json,index);
}
(function(exports){
	var console = window.console||{'log':function(){}};
	
	var gallery_tpl = ["<div class='lan_show'>",
		"<div class='lan_img'>",
			"<div class='lan_exist'>×</div>",
			"<img src='' />",
		"</div>",
		"<div class='lan_List'>",
			"<div class='lan_List_cnt'>",
			"</div>",
		"</div>",
		"<div class='lan_prev' title='上一张'></div>",
		"<div class='lan_next' title='下一张'></div>",
	"</div>"].join('');

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

	var init = function(json,index){
		console.log('gallery:','Calculate the initial parameters !');
		var dom_html = gallery_tpl;
		var this_gal = this;
		
		this.isactive = true
		this.json = json;
		this.total = json.length;
		this.dom = $(dom_html);
		this.cur = {
			'index' : index || 0,
			'width' : null,
			'height' : null
		};
		
		console.log('gallery:','define global variable');
		var private_win = $(window),
			 private_winH = private_win.height(),
			 private_winW = private_win.width(),
			 private_bottomH = 160,
			 private_changeID = 0,
			 private_list_cnt = this.dom.find('.lan_List_cnt'),
			 private_next_btn = this.dom.find('.lan_next'),
			 private_prev_btn = this.dom.find('.lan_prev');
		
		//////////////////////////////////////////////////
		function bindEvent(){
			console.log('gallery:','bind some events !');
			var winResizeDelay;
			$(window).resize(function(){
				clearTimeout(winResizeDelay);
				winResizeDelay = setTimeout(function(){
					console.log('gallery:','window resizing !');
					private_winH = private_win.height(),
					private_winW = private_win.width(),
					this_gal.resize();
				},200);
			}).on('keydown',function(e){
				if(!this_gal.isactive){
					return
				}
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
			});
			
			// bind this gallery event
			var except = false ;
			function check_mouse(event){
				var area = null;
				if(except || event.clientY > private_winH - 160){
					area = null;
					except = false;
				}else	if(event.clientX < private_winW/2){
					area = 'left';
				}else{
					area = 'right';
				}
				return area ;
			}
			
			this_gal.dom.on('click',function(e){
				var this_area = check_mouse(e);
				if(this_area == 'left'){
					this_gal.prev()
				}else if(this_area == 'right' ){
					this_gal.next()
				}
			}).on('mousemove',function(e){
				var this_area = check_mouse(e);
				if(this_area == 'left'){
					private_next_btn.removeClass('active');
					private_prev_btn.addClass('active');
				}else if(this_area == 'right' ){
					private_prev_btn.removeClass('active');
					private_next_btn.addClass('active');
				}else{
					private_prev_btn.removeClass('active');
					private_next_btn.removeClass('active');
				}
			}).on('mousemove','.lan_exist,.lan_List,.lan_to_cnt',function(){
				except = true ;
			}).on('click','.lan_exist',function(){
				this_gal.exist();		
			}).on('click','.lan_List_cnt a',function(){
				this_gal.cur.index = $(this).index();
				changePic();
			});
		
		}
		/////////////////////////////////////////////////////
		function render_thumb(){
			var picList = '';
			for(var s = 0;s < this_gal.total;s++){
				picList += "<a href='javascript:void(0)'><span data-src='" + this_gal.json[s]['thumb'] + "'></span></a>";
			}
			private_list_cnt.html(picList);
			
			
			
			console.log('gallery:','loading thumbnail!');
			private_list_cnt.find('span').each(function(){
				var this_dom = $(this);
				var src = this_dom.attr('data-src');
		//		console.log(src);
	//			loadImg(src,{'loadFn':function(w,h){
					//this_dom.html('<img src="' + src + '" />');
		//			this_dom.html('<img src="' + src + '" />');
					this_dom.css('backgroundImage','url(\"' + src + '\")');
		//		}});
			});
		}
		///////////////////////////////////////////////////////
		function resize(){
			var w = this_gal.cur.width,
				 h = this_gal.cur.height,
				 mainPicCnt = this_gal.dom.find('.lan_img'),
				 mainPic = mainPicCnt.find('img');
			
			if(h>private_winH-private_bottomH){
				var newH = private_winH - private_bottomH -30;
				w = newH*w/h;
				h = newH;
			}
			if(w > private_winW-200){
				var newW = private_winW - 200;
				h = newW*h/w;
				w = newW;
			}
			var Bottom =  (private_winH + private_bottomH - h)/2,
			Left = (private_winW - w)/2;
		
			(Left<0)&&(Left=0);
			mainPicCnt.animate({'width':w,'height':h,'bottom':Bottom,'left':Left},100,function(){
				mainPic.stop().fadeTo(80,1);
			});
			mainPic.css({'width':w,'height':h});
		}
		/////////////////////////////////////////////////////
		function resetList(){
			var index = this_gal.cur.index;
			
			list_cntW = 88*this_gal.total;
			private_list_cnt.width(list_cntW);
			
			private_list_cnt.find('a').removeClass('cur').eq(index).addClass('cur');
			if(list_cntW > private_winW){
				var marginLeft = parseInt(private_list_cnt.css('marginLeft')) + private_winW/2-private_list_cnt.find('.cur').offset().left-44;
				if(marginLeft > 0){
					marginLeft = 0;
				}
				if(list_cntW + marginLeft < private_winW){
					marginLeft = private_winW-list_cntW;
				}
				private_list_cnt.animate({'marginLeft':marginLeft},80);
			}else{
				private_list_cnt.css({'marginLeft' : private_winW/2 - list_cntW/2},80);
			}
		}
		//////////////////////////////////////////////////////
		function changePic(){
			if(this_gal.total == 0){
				this_gal.exist();
				return
			}else if(this_gal.total == 1){
				private_next_btn.hide();
				private_prev_btn.hide();
			//	return
			}
			var this_changeID = ++private_changeID;
			
			console.log('gallery:','change picture view !');
			
			var index = this_gal.cur.index,
				 mainPic = this_gal.dom.find('.lan_img img'),
				 changeDelay = 0,
				 list_cntW = null;
			
			resetList();
			
			var src = this_gal.json[index]['cover'];
			
			mainPic.stop().fadeTo(70,0);
			clearTimeout(changeDelay);
			changeDelay = setTimeout(function(){
				mainPic.attr('src',src);
				loadImg(src,{
					'loadFn':function(w,h){
						this_gal.cur.width = w;
						this_gal.cur.height = h;
						//console.log('LOOK ME:',this_changeID , private_changeID);
						if(this_changeID == private_changeID){
							resize();
						}
					},
					'errorFn':function(){
						console.log('gallery:','pic error !');
						this_gal.cur.width = 40;
						this_gal.cur.height = 40;
						if(this_changeID == private_changeID){
							resize();
						}
					}
				});
			},100);
		};
		

		// start ////////////////////////////////////
		if(this.total == 0){
			console.log('gallery:','stop list does not exist !');
			return
		}
		$('body').append(this.dom).hide().fadeIn(400);
		bindEvent();
		render_thumb();
		changePic();
		this.exist = function(){
			this.isactive = false;
			this.dom.fadeOut(150,function(){
				$(this).remove();
			});
		};
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
			changePic();
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
			changePic();
		};
		
		this.resize = function(){
			resize()
		};
	};
	
	init.prototype = {
		'prev' : function prev(){
			this.prev();
		},
		'next' : function next(){
			this.next();
		},
		'exist' : function (){
			this.exist();
		},
		'del' : function(){
			if(this.total == 1){
				this.exist();
				return
			}
			this.dom.find('.lan_List_cnt a.cur').remove();
			this['json'].splice(this['cur']['index'],1);
			this.total--;
			this.next();
		},
		'rename' : function(name){
			var index = this['cur']['index'];
			var cover = this['json'][index]['cover'];
			var path_part = cover.match(/(.+\/).+$/);
			if(path_part){
				this['json'][index]['cover'] = path_part[1] + name;
			}
		},
		'change_active':function(check){
			if(typeof(check) == "boolean" ){
				this.isactive = check;
			} 
		}
	};
	exports.init = init;
})(gallery);