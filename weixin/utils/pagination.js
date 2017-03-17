//此分页插件参照lz的代码改写的，github:https://github.com/lzuntalented/pagination-js
(function(){
	function pagination(){
		this.version = "1.0.1";
		this.author = "andyliwr";
	}
	/*默认配置*/
	var _default = {
		origin_txt : "",//文字文本
		origin_txt_list : "",//分割的文本列表
		origin_txt_split : "\n",//分割标示
		/*绘制区域参数*/
		panel: {
			width : 0,//绘制区域宽度
			height : 0,//绘制区域高度
			top: 0,//绘制区域距离顶部高度
			left: 0,//绘制区域距离左边宽度
		},
		/*单个文字配置相关*/
		font: {
			top: 2,//文字顶部留空
			left: 0,//文字左边留空
			right: 0,//文字右边留空
			bottom: 2,//文字底部留空
			index: 1,//默认当前使用的文字大小序列
		},

		/*需要计算的几种字体大小的分页信息*/
		font_size_list : [16,18,20],
		/*钩子*/
		hook_page_start: null,//开始分页计算之前
		hook_page_end: null,//结束分页计算之后
		page_draw_start: null,//单页开始绘制之前操作
	};

	/*字体尺寸*/
	var font = {
		size: 18
	}

	var panel = {
		col: Math.floor(_default.width / font.size),//列数
		row: Math.floor(_default.height / font.size),//行数
		space: 2,
	}

	var page_list = [
		{
			line: 0,
			offset : 0
		}
	];

	var font_page_list = {};

	/*初始化*/
	pagination.prototype.init = function(config){
		for(var i in config){
			if(typeof config[i] === "object"){
				if(_default[i]){
					for(var j in config[i]){
						_default[i][j] = config[i][j];
					}
					continue;
				}
			}
			_default[i] = config[i];
		}

		/*将原始字符串以换行分割成数组*/
		_default.origin_txt_list = _default.origin_txt.split(_default.origin_txt_split);

//		font.size = _default.font.size;
//		panel = {
//			col: Math.floor(_default.panel.width / font.size),//列数
//			row: Math.floor(_default.panel.height / font.size),//行数
//		}
//

		pages();
	}

	/*获取本地文件内容*/
	pagination.read_file = function(){

	}

	/*开始分页*/
	var pages = function(){
		typeof _default.hook_page_start === "function" && _default.hook_page_start(); 

		for(var len = _default.font_size_list.length , j = len - 1 ; j >= 0 ; --j){
			/*此字体尺寸的行列信息*/
			panel = {
				col: Math.floor(_default.panel.width / (_default.font.left + _default.font.right + _default.font_size_list[j])),//列数
				row: Math.floor(_default.panel.height / (_default.font.top + _default.font.bottom + _default.font_size_list[j])),//行数
			}
			console.log(panel);

			page_list = [
				{
					line: 0,
					offset : 0
				}
			];
			var i = 0;
			while(true){
				var page_cur = page_list.length - 1;
				var page = page_next(page_list[page_cur].line,page_list[page_cur].offset);
				page_list.push(page);
				if(page.line >= _default.origin_txt_list.length){
					break;
				}
			}

			font_page_list[_default.font_size_list[j]] = page_list;
		}
		console.log(font_page_list);
		typeof _default.hook_page_end === "function" && _default.hook_page_end(); 
	}

	/*获取当前分页信息*/
	pagination.prototype.get_page_list = function(){
		return page_list;
	}

	/*重置单页绘制之前的操作*/
	pagination.prototype.set_page_draw_start = function(func){
		if(typeof func === "function")
			_default.page_draw_start = func;
	}


	/*开始真实绘制下一屏*/
	function page_next(page_current,page_offset){
		/*返回结果*/
		var result = {
			line : 0,
			offset : 0,
			list : []
		}
		var str_write_list = _default.origin_txt_list;
		var total = panel.col * panel.row * 2;//字符有占一位和两位的，一行最多可绘制2倍长度
		var current = page_current;
		var total = panel.col * panel.row * 2;//字符有占一位和两位的，一行最多可绘制2倍长度
		var count = 0;
		var tag = false;

		var tmp_all_write = [];
		var isBreak = false;//检查是否正常跳出
		while(current < str_write_list.length){
			var len = str_write_list[current].length;
			var tmp_write = [];
			var str = str_write_list[current];
			var start = 0;
			if(!tag){
				start = page_offset;
				tag = true;
			}

			var tmp = 0;
			var begin = start;
			for(var i = start; i < len ; i ++ ){
				//逐个检查
				if(tmp >= panel.col * 2 - 1){
					tmp_write.push(str.substring(begin,i));
					begin = i;
					tmp = 0;
				}

				var len_char = 1;
				if(str.charCodeAt(i) > 128){
					len_char = 2;
				}

				tmp += len_char;
			}

			if(tmp > 0){
				tmp_write.push(str.substring(begin,i))
			}

			if(str == "") {
				tmp_write.push("");
			};

			var offset = 0;
			if(tmp_all_write.length + tmp_write.length > panel.row) {
				for(var i = 0 ; i < tmp_all_write.length ; i ++){
					result.list.push(tmp_all_write[i]);
				}

				for(var j = 0 ; j < tmp_write.length && j + i < panel.row ; j ++){
					offset += tmp_write[j].length;
					result.list.push(tmp_write[j]);
				}

				result.line = current;
				result.offset = offset;
				isBreak = true;
				break	;
			}

			tmp_all_write = tmp_all_write.concat(tmp_write);

			current ++;
		}
		/*未正常跳出，表示到达书尾，直接绘制*/
		if(!isBreak){
			for(var i = 0 ; i < tmp_all_write.length ; i ++){
				result.line = current;
				result.offset = 0;
				result.list.push(tmp_all_write[i]);
			}
		}

		return result;
	}

	var current_page = 0;

	pagination.prototype.re_render = function(){
		this.render(current_page);	
	};

	/*渲染页面*/
	pagination.prototype.render = function(page){
		if(page <= 0 || page >= font_page_list[_default.font_size_list[_default.font.index]].length) 
			return false ;
		ctx.clearRect(0,0,_default.width,_default.height);
		current_page = page;
		/*开始绘制画布之前的操作*/
//		ctx.save();
		typeof _default.page_draw_start === "function" && _default.page_draw_start();
//		ctx.restore();

		var list = font_page_list[_default.font_size_list[_default.font.index]][page].list;
		for(var i = 0; i < list.length;i++){
			var x = _default.font.left;
			var first_space = true;//本行第一次出现空格
			for(var j = 0; j< list[i].length ; ++j){
				if(!first_space && list[i][j] == " "){
					continue;
				}else if(first_space && list[i][j] == " "){
					first_space = false;
				}

				if(j != 0){
//					if(list[i].charCodeAt(j) > 128){
						x += (_default.font.left + _default.font_size_list[_default.font.index] +  _default.font.right)
//					}else{
//						x += (_default.font.left + Math.ceil(_default.font_size_list[_default.font.index] / 2) +  _default.font.right)
//					}
				}

//				var x = j * (_default.font.left + _default.font_size_list[_default.font.index] +  _default.font.right) + _default.font.left;

				ctx.fillText(list[i][j], 
					x ,
					(i + 1) * (_default.font.top +  _default.font_size_list[_default.font.index] +  _default.font.bottom));
			}
		}
		return true;
	}

	/*获取当前电子书的进度*/
	pagination.prototype.get_progress = function(){
		return {
			page: current_page,
			total: font_page_list[_default.font_size_list[_default.font.index]].length
		}
	}

	/*重新渲染此页*/
	pagination.prototype.reRender = function(font_index){
		if(font_index == _default.font.index){
			return ;
		}

		var list = font_page_list[_default.font_size_list[font_index]];
		var row = font_page_list[_default.font_size_list[_default.font.index]][current_page].line;
		var line = panel.row;
		/*字体尺寸变大*/
		if(font_index > _default.font.index){
			for(var i = current_page ; i < list.length ; i++ ){
				if(Math.abs(row - list[i].line) < line){
					current_page = i;
					break;
				}
			}
		}else{
			for(var i = current_page ; i >= 0; i-- ){
				if(Math.abs(row - list[i].line) < line){
					current_page = i;
					break;
				}
			}
		}
		_default.font.index = font_index;
		this.render(current_page);
	}

	/**
	 * 获取当前绘制文字的尺寸
	 */
	pagination.prototype.get_font_size = function(){
		return _default.font_size_list[_default.font.index];
	}

	window.pagination = window.pagination || new pagination();
})();