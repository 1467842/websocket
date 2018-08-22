$.extend({
	//显示时间戳
	showTime:function(){
		function changeTwo(num){
			if(num<10){
				num='0'+num;
			}else{
				num=''+num;
			}
			return num;
		}
		var date=new Date();
		var year=changeTwo(date.getFullYear());
		var month=changeTwo(date.getMonth()+1);
		var day=changeTwo(date.getDate());
		var hour=changeTwo(date.getHours());
		var min=changeTwo(date.getMinutes());
		var sec=changeTwo(date.getSeconds());
		var time=year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec;
		return {
			year:year,
			month:month,
			day:day,
			hour:hour,
			min:min,
			sec:sec,
			time:time
		}
	},
	//数组排序
	arrSort:function(arr,str){
		var len=arr.length;
		function change(i,j){
			var temp=arr[i];
			arr[i]=arr[j];
			arr[j]=temp;
		}
		for(var i=0;i<len;i++){
			for(var j=i+1;j<len;j++){
				if(str=='lt'){
					if(arr[i]>arr[j]){
						change(i,j);
					}
				}
				if(str=='gt'){
					if(arr[i]<arr[j]){
						change(i,j);
					}
				}
			}
		}
		return arr;
	},
	//数组去重
	celRepeat:function(arr){
		for(var i=0;i<arr.length;i++){
			for(var j=i+1;j<arr.length;j++){
				if(arr[i]===arr[j]){
					arr.splice(j,1);
					j--;
				}
			}
		}
		return arr;
	},
	//获取一个数组中连续的最长的一列；
	getMaxLine:function (arr){
		var m=0;
		var resArr=[];
		var indexArr=[];
		var result=[];
		for(var i=0;i<arr.length;i++){
			for(var j=i+1;j<arr.length;j++){
				m++;
				if(arr[j]-arr[i]!=m){
					resArr.push(m);
					indexArr.push(i);
					m=0;
					break;
				}
			}	
		}
		function getMax(resArr){
			var maxIndex=0;
			for(var i=0;i<resArr.length;i++){
				
				if(resArr[i]>resArr[maxIndex]){
					maxIndex=i;
				}
			}
			return maxIndex;
		}
		var maxIndex=getMax(resArr);
		//console.log(maxIndex)
		var getarr=arr.splice(indexArr[maxIndex],resArr[maxIndex]);
		return getarr;
	} 
});
//填充数据方法；
$.fn.fillData=function(str,tf){
	if(typeof str==='string'){
		if(tf){
			var htmlstr=this.html();
			this.html(htmlstr+str);
		}else{
			this.html(str);
		}	
	}
	if(typeof str==='object'){
		this.append(str);
	}
	return this;
};
// 选项卡切换；
$.fn.changeTab=function(thtype,fn){
	
	var me=this;
	me[0].fn=fn;
	this.on(thtype,function(){
		var iNow=me.index(this);
		if(typeof me[0].fn=='function'){
			me[0].fn(iNow);
		}
		
	});
	return this;
};
// 元素拖动；
$.fn.dragMove=function(mfn,podom,endfn){
	this[0].mfn=mfn;
	this[0].endfn=endfn;
	var me=this;
	this.on('mousedown',function(ev){
		var oEvent=ev||window.event;
		oEvent.stopPropagation();
		var disx=oEvent.clientX-me.offset().left;
		var disy=oEvent.clientY-me.offset().top;
		//console.log(disx,disy);
		$(document).on('mousemove',function(ev){
			var oEvent=ev||window.event;
			var ox=oEvent.clientX-disx;
			var oy=oEvent.clientY-disy;
			//console.log(ox,oy);
			if(typeof me[0].mfn==='function'){
				if(typeof podom!='undefined'){
					ox-=$(podom).offset().left;
					oy-=$(podom).offset().top;
				}
				me[0].mfn&&me[0].mfn(ox,oy);
			}
			return false;
		});
		$(document).on('mouseup',function(){
			
			$(document).off();
			me[0].endfn&&me[0].endfn();
			return false;
			
		});
		
	});
	return this;
}
// 元素3d查看；
$.fn.rotMove=function(fn){
	this[0].fn=fn;
	var me=this;
	this.on('mousedown',function(ev){
		var oEvent=ev||window.event;
		var ox=oEvent.clientX;
		var oy=oEvent.clientY;
		
		$(document).on('mousemove',function(ev){
			var oEvent=ev||window.event;
			var disx=oEvent.clientX-ox;
			var disy=oEvent.clientY-oy;
			me[0].fn(disx,disy);

			ox=oEvent.clientX;
			oy=oEvent.clientY;
			return false;
		});
		$(document).on('mouseup',function(){
			$(document).off();
			return false;
		});
		return false;
	})

}
//下拉菜单
$.fn.selectElm=function(oList,fn){
	this[0].fn=fn;
	var me=this;
	var tf=false;
	oList.css({
		position:'absolute',
		left:-1,
		top:this.outerHeight()
	});
	this.on('click',function(ev){
		var oEvent=ev||window.event;
		tf=!tf;
		if(tf){
			oList.show();
		}else{
			oList.hide();
			me[0].fn&&me[0].fn(oEvent.target);
		};
	})
	return this;
}


$.fn.openActive = function(activeSel) {
    activeSel = activeSel || ".active";

    var c = this.attr("class");

    this.find(activeSel).each(function(){
        var el = $(this).parent();
        while (el.attr("class") !== c) {
            if(el.prop("tagName") === 'UL') {
                el.show();
            } else if (el.prop("tagName") === 'LI') {
                el.removeClass('tree-closed');
                el.addClass("tree-opened");
            }

            el = el.parent();
        }
    });

    return this;
}
//树状图插件；
$.fn.openActive = function(activeSel) {
    activeSel = activeSel || ".active";

    var c = this.attr("class");

    this.find(activeSel).each(function(){
        var el = $(this).parent();
        while (el.attr("class") !== c) {
            if(el.prop("tagName") === 'UL') {
                el.show();
            } else if (el.prop("tagName") === 'LI') {
                el.removeClass('tree-closed');
                el.addClass("tree-opened");
            }

            el = el.parent();
        }
    });

    return this;
}
$.fn.treemenu = function(options) {
    options = options || {};
    options.delay = options.delay || 0;
    options.openActive = options.openActive || false;
    options.activeSelector = options.activeSelector || "";

    this.addClass("treemenu");
    this.find("> li").each(function() {
        e = $(this);
        var subtree = e.find('> ul');
        var button = e.find('span').eq(0).addClass('toggler');

        if( button.length == 0) {
            var button = $('<span>');
            button.addClass('toggler');
            e.prepend(button);
        } else {
            button.addClass('toggler');
        }

        if(subtree.length > 0) {
            subtree.hide();

            e.addClass('tree-closed');

            e.find(button).click(function() {
                var li = $(this).parent('li');
                li.find('> ul').slideToggle(options.delay);
                li.toggleClass('tree-opened');
                li.toggleClass('tree-closed');
                li.toggleClass(options.activeSelector);
            });

            $(this).find('> ul').treemenu(options);
        } else {
            $(this).addClass('tree-empty');
        }
    });

    if (options.openActive) {
        this.openActive(options.activeSelector);
    }

    return this;
}

