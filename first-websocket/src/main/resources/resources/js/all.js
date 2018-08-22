/*aside.js===侧边栏===function aside*/
function init() {
	$('.user-list li>a').on(
		"click",
		function() {
			if($(this).find('span').hasClass("glyphicon-plus")) {
				$(this).find('span').addClass('glyphicon-minus').removeClass(
					'glyphicon-plus');
				$(this).parent().siblings().find("span")
					.removeClass('glyphicon-minus').addClass(
						'glyphicon-plus');
				$(this).siblings().slideDown();
				$(this).parent().siblings().find("ul").slideUp();

			} else {
				$(this).find('span').removeClass('glyphicon-minus').addClass(
					'glyphicon-plus');
				$(this).siblings().slideUp();
			}
		});
}
////禁用浏览器后退和前进按钮
//jQuery(document).ready(function() {
//	if(window.history && window.history.pushState) {
//		$(window).on('popstate', function() {　　　　　 // 当点击浏览器的 后退和前进按钮 时才会被触发， 
//			window.history.pushState('forward', null, '');
//			window.history.forward(1);
//		});
//	}
//	window.history.pushState('forward', null, ''); //在IE中必须得有这两行
//	window.history.forward(1);
//});
//去除input框空格
function inputTrim(element) {
	var value = $(element).val().trim();
	$(element).val(value);
}
//选中模态中表格内容高亮显示 -why
function clickHighlightChange(clazz, index) {
	//20170623 wanghy 需求变更-37 start
	//	$(clazz + ":even").css("background", "#f9f9f9");
	$(clazz + ":even").css("background", "#D9E1F2");
	//20170623 wanghy 需求变更-37 end
	$(clazz + ":odd").css("background", "white");
	$(clazz).eq(index).css("background", "#3f9fd9");
}
/**
 * 页面动画切换方法
 * @param *{Object} loadclass	   	加载动画下方div的类
 * @param *{Object} outsideClass 	动画加载外部标识类
 * @param *{Boolean} flag			true:显示页面隐藏动画 false:显示动画隐藏页面
 * @param  {Object} special		        显示的display样式block，flex等，如果不填默认是block
 * @param  {Boolean} zhezhao		遮罩层，如果有遮罩只判断遮罩显示隐藏
 * creater:王宏宇
 */
function animationLoadChange(loadclass, outsideClass, flag, special, zhezhao) {
	//当必要类存在时才会执行
	if(loadclass && outsideClass) {
		//获取必要类集合
		var showdiv = document.getElementsByClassName(loadclass);
		var animation = document.getElementsByClassName(outsideClass);
		if(!special) {
			special = "block";
		}
		//根据判断值进行显示隐藏
		if(zhezhao) {
			if(flag) {
				for(var i = 0; i < animation.length; i++) {
					animation[i].style.display = "none";
				}
			} else {
				for(var i = 0; i < animation.length; i++) {
					animation[i].style.display = "block";
				}
			}
		} else {
			if(flag) {
				for(var i = 0; i < animation.length; i++) {
					animation[i].style.display = "none";
				}
				for(var i = 0; i < showdiv.length; i++) {
					showdiv[i].style.display = special;
				}
			} else {
				for(var i = 0; i < animation.length; i++) {
					animation[i].style.display = "block";
				}
				for(var i = 0; i < showdiv.length; i++) {
					showdiv[i].style.display = "none";
				}
			}
		}

	}
}
/**
 * 动态添加动画加载div
 * @param *{Object} loadclass			加载动画下方div的类
 * @param *{Object} outsideClass  		动画加载外部标识类
 * @param  {Object} addClass      		样式改变类 
 * @param  {Boolean}zhezhao             遮罩层
 * @param  {Object} animationClass    	动画父类 
 * @param  {Object} animationChildClass 动画子类 
 * @param  {Number} max	         		最多显示几个动画子项
 * creater:王宏宇
 */
function animationLoad(loadclass, outsideClass, addClass, zhezhao, animationClass, animationChildClass, max) {
	//当必要类存在时才会执行
	if(loadclass && outsideClass) {
		//修改动画样式类如果没有则为空
		if(!addClass) {
			addClass = "";
		}
		//如果没有动画类显示默认动画类
		if(!animationClass) {
			animationClass = "sk-circle";
		}
		if(!animationChildClass) {
			animationChildClass = "sk-child";
		}
		//如果没有设置内层转动动画个数则设置默认值
		if(!max) {
			max = 12;
		}
		//获取所有需要加载动画loadclass类的标签
		var loadList = document.getElementsByClassName(loadclass);
		//创建外层div并添加Vue动画条件判断参数
		var marginAll;
		for(var i = 0; i < loadList.length; i++) {
			var outDiv = document.createElement("div");
			outDiv.className = outsideClass;
			if(zhezhao) {
				outDiv.style.backgroundColor = "rgba(0,0,0,0.3)";
				outDiv.style.position = "absolute";
				var height = (loadList[i].offsetHeight - 50) / 2;
				marginAll = height + "px" + " auto";
				outDiv.style.height = loadList[i].offsetHeight + "px";
				outDiv.style.width = loadList[i].offsetWidth + "px";
				outDiv.style.zIndex = "1000";
			}
			loadList[i].parentNode.insertBefore(outDiv, loadList[i]);
		}
		//获取所有外层outsideClass类的标签
		var outDivList = document.getElementsByClassName(outsideClass);
		//判断如果有需要添加的外部div则继续添加
		if(outDivList) {
			//在外层div里面创建一个内存div并设置动画类
			for(var i = 0; i < outDivList.length; i++) {
				var animationDiv = document.createElement("div")
				animationDiv.className = animationClass + " " + addClass + " " + "Animat";
				if(marginAll) {
					animationDiv.style.margin = marginAll;
				}
				outDivList[i].appendChild(animationDiv);
				var animationDivList = outDivList[i].getElementsByClassName("Animat");
				//获取所有内层animationClass类的标签
				for(var n = 0; n < max; n++) {
					var insideDiv = document.createElement("div");
					var num = n + 1;
					insideDiv.className = animationClass + num + " " + animationChildClass;
					animationDivList[0].appendChild(insideDiv);
				}
			}

		}
	}
}
/**
 * 验证非必选项并且输入值是空需要隐藏气泡时调用
 * @param *{Object} id	    验证需要的input的id
 * @param *{Object} name  验证需要的input的name
 * creater:王宏宇
 */
function emptyCheck(id, name) {
	$(id).on("focusout", function() {
		if($(this).val()) {
			$(this).attr("name", name);
		} else {
			$(this).attr("name", "");
		}
	});
}

//validate验证是否成功     tj-验证form名   Modal-新增还是修改的模态名
function validModalDismiss(tj, Modal) {
	if($(tj).valid()) {
		return true;
	} else {
		$(Modal).attr("data-dismiss", "");
		return false;
	}
}

//模态提示框   vm-Vue声明   data-ajax成功后返回  Modal-新增还是修改的模态名
function tipModalShow(vm, data, Modal, time) {
	if(!time) {
		time = 2000;
	}
	vm.executeResultMessage = data.resultValue;
	$('#executeResultMessageForm').modal('show');
	setTimeout(function() {
		$('#executeResultMessageForm').modal('hide');
	}, time);
	if(Modal) {
		$(Modal).attr("data-dismiss", "modal");
	}
}
//标签模态弹框验证
function tagsModalCheck(value, vm) {
	if(value) {
		var sign = !/[@#\$%\^&\*]+/g.test(value);
		if(sign && value.length < 13) {
			if(stopspecialCharFilter(vm,value)){
				return true;
			}else{
				return false;
			}
		} else {
			vm.executeResultMessage = "输入了特殊字符或标签长度过长";
			$('#executeResultMessageForm').modal('show');
			setTimeout(function() {
				$('#executeResultMessageForm').modal('hide');
			}, 2000);
			return false;
		}
	} else {
		vm.executeResultMessage = "不能添加空标签";
		$('#executeResultMessageForm').modal('show');
		setTimeout(function() {
			$('#executeResultMessageForm').modal('hide');
		}, 2000);
		return false;
	}
}
//checkboxduo多选框最多选几个
function checkBoxModalChange(clazz, val, vm, btn) {
	var num = 0;
	$(clazz).each(function(key) {
		if($(this)[0].checked) {
			num++;
		}
	});
	if(num <= val) {
		if(btn) {
			$(btn).attr("data-dismiss", "modal");
		}
		return true;
	} else {
		vm.executeResultMessage = "选择不能超过" + val + "个";
		$('#executeResultMessageForm').modal('show');
		setTimeout(function() {
			$('#executeResultMessageForm').modal('hide');
		}, 2000);
		if(btn) {
			$(btn).attr("data-dismiss", "");
		}
		return false;
	}
}
//fail,不同用户同时操作一条或多条数据的场合的错误提示
function failModalShow(MId, choose, vm) {
	if(MId) {
		$(MId).modal('hide');
	}
	choose;
	vm.executeResultMessage = "该条数据已被删除";
	$('#executeResultMessageForm').modal('show');
	setTimeout(function() {
		$('#executeResultMessageForm').modal('hide');
	}, 2000);
}

//清除气泡
function removePop() {
	$('.error').css("display", "none");
}

function aside() {
	var myaside = {
		asideSelect: function() {

			$('.navlist li.item>a').on(
				"click",
				function() {
					if($(this).parent().find('em').hasClass(
							"glyphicon-chevron-left")) {
						$(this).parent().siblings().find('em').addClass(
							'glyphicon-chevron-left').removeClass(
							'glyphicon-chevron-down');
						$(this).parent().find('em').removeClass(
							'glyphicon-chevron-left').addClass(
							'glyphicon-chevron-down');
						$(this).parent().find('.sonlist').slideDown();
						$(this).parent().siblings().find('.sonlist')
							.slideUp();
						//20170722  生产模块  dongyunlong  start
						$('a').click(function() {
							if($(this)[0].hash != "#scanMaterial" || $(this)[0].hash != "#dynamicStorage") {
								if(typeof(omg) != "undefined") {
									clearInterval(omg);
								}
							}
						});
						//20170722  生产模块 dongyunlong  end
						// 20180326  清空动态库存管理定时器 wanghy start
                        $('a').click(function() {
                            if($(this)[0].hash != "dynamicInventory") {
                                clearDynamicInventoryTwinkleInterval();
                                clearDynamicInventoryTimeSpanReflushInterval();
                                // 20180328  清空原材采购计划定时器 wanghy start
                            }else if($(this)[0].hash != "rawMaterialPurchasePlan"){
                                clearRawMaterialPurchasePlanAdditionalPlanInterval();
                                clearRawMaterialPurchasePlanDynamicInventoryInterval();
							}
                            // 20180328  清空原材采购计划定时器 wanghy end
                        });
                        // 20180326  清空动态库存管理定时器 wanghy end
					} else {
						$(this).parent().find('em').addClass(
							'glyphicon-chevron-left').removeClass(
							'glyphicon-chevron-down');
						$(this).parent().find('.sonlist').slideUp();
					}
					$(".sidebar .active").removeClass("active");
				});
		}
	};
	myaside.asideSelect();
};

/* commen.js===公共模块===全局 function */
var glObj = {
	oSend: {}, // 各个页面传递参数时，存放数据的对象；
	oWebPath: $('[webPath]').attr('webPath'), // 网站的主路径 jsp获取；
	pageLoad: [ // 存放路由的数组；
		{
			hash: '#anKouParameter',
			pageUrl: '/anKouParameter/init',
			doFun: function() {
				anKouParameter();
			}
		}, {
			hash: '#organization',
			pageUrl: '/organization/init',
			doFun: function() {
				organization();
			}
		}, {
			hash: '#usermanger',
			pageUrl: '/usermanger/init',
			doFun: function() {
				usermanger();
			}
		}, {
			hash: '#scanMaterial',
			pageUrl: '/scanMaterial/init',
			doFun: function() {
				scanMaterial();
			}
		}, {
			hash: '#dynamicStorage',
			pageUrl: '/dynamicStorage/init',
			doFun: function() {
				dynamicStorage();
			}
		}, {
			hash: '#materialInStore',
			pageUrl: '/materialInStore/init',
			doFun: function() {
				materialInStore();
			}
		}, {
			hash: '#unitManagement',
			pageUrl: '/unitManagement/init',
			doFun: function() {
				unitManagement();
			}
		}, {
			hash: '#powermanger',
			pageUrl: '/powermanger/init',
			doFun: function() {
				powermanger();
			}
		}, {
			hash: '#pageindex',
			pageUrl: '/pageindex',
			doFun: function() {
				pageindex();
			}
		}, {
			hash: '#dailyplan',
			pageUrl: '/dailyplan/init',
			doFun: function() {
				dailyplan();
			}
		}, {
			hash: '#makecard',
			pageUrl: '/makecard/init',
			doFun: function() {
				makecard();
			}
		}, {
			hash: '#material',
			pageUrl: '/material/init',
			doFun: function() {
				material();
			}
		}, {
			hash: '#sampling',
			pageUrl: '/sampling/init',
			doFun: function() {
				sampling();
			}
		}, {
			hash: '#actor',
			pageUrl: '/actor/init',
			doFun: function() {
				sampling();
			}
		},
		{
			hash: '#checkItemType',
			pageUrl: '/checkItemType/init',
			doFun: function() {
				checkItemType();
			}
		},
		// {
		// hash : '#aio',
		// pageUrl : '/aio/init',
		// doFun : function() {
		// aio();
		// }
		// },
		// {
		// hash : '#printorder',
		// pageUrl : '/printorder/init',
		// doFun : function() {
		// printorder();
		// }
		// },

		{
			hash: '#newContract',
			pageUrl: '/newContract/init',
			doFun: function() {
				newContract();
			}
		}, {
			hash: '#purchasecontract',
			pageUrl: '/purchasecontract/init',
			doFun: function() {
				purchasecontract();
			}
		}, {
			hash: '#purchaseplan',
			pageUrl: '/purchaseplan/init',
			doFun: function() {
				purchaseplan();
			}
		}, {
			hash: '#materialInfo',
			pageUrl: '/materialInfo/init',
			doFun: function() {
				materialInfo();
			}
		}, {
			hash: '#Customer',
			pageUrl: '/Customer/init',
			doFun: function() {
				Customer();
			}
		}, {
			hash: '#Construction',
			pageUrl: '/Construction/init',
			doFun: function() {
				Construction();
			}
		}, {
			hash: '#SalesContract',
			pageUrl: '/SalesContract/init',
			doFun: function() {
				salesContract();
			}
		}, {
			hash: '#ProductionCommission',
			pageUrl: '/ProductionCommission/init',
			doFun: function() {
				ProductionCommission();
			}
		}, {
			hash: '#ProductionDesign',
			pageUrl: '/ProductionDesign/init',
			doFun: function() {
				ProductionDesign();
			}
		}, {
			hash: '#Scheduling',
			pageUrl: '/Scheduling/init',
			doFun: function() {
				Scheduling();
			}
		}, {
			hash: '#SchedulingInfo',
			pageUrl: '/SchedulingInfo/init',
			doFun: function() {
				SchedulingInfo();
			}
		}, {
			hash: '#ws',
			pageUrl: '/ws/init',
			doFun: function() {
				ws();
			}
		}, {
			hash: '#ponderation',
			pageUrl: '/ponderation/init',
			doFun: function() {
				ponderation();
			}
		}, {
			hash: '#timeSettings',
			pageUrl: '/timeSettings/init',
			doFun: function() {

			}
		}, {
			hash: '#cuowu',
			pageUrl: '/cuowu/init',
			doFun: function() {

			}
		}, {
			hash: '#positionManager',
			pageUrl: '/positionManager/init',
			doFun: function() {
				positionManager();
			}
		},
		//		{
		//			hash: '#materialRelationship',
		//			pageUrl: '/materialRelationship/init',
		//			doFun: function() {
		//				materialRelationship();
		//			}
		//		}
		{
			hash: '#newAnKou',
			pageUrl: '/newAnKou/init',
			doFun: function() {
				newAnKou();
			}
		}, {
			hash: '#mingKou',
			pageUrl: '/mingKou/init',
			doFun: function() {
				mingKou();
			}
		},
		//车辆管理	
		{
			hash: '#carManagement',
			pageUrl: '/carManagement/init',
			doFun: function() {
				carManagement();
			}
		},
		//退货记录
		{
			hash: '#returnRecord',
			pageUrl: '/returnRecord/init',
			doFun: function() {
				returnRecord();
			}
		},
		//发货监控
		{
			hash: '#deliveryMonitor',
			pageUrl: '/deliveryMonitor/init',
			doFun: function() {
				deliveryMonitor();
			}
		},
		//司机管理
		{
			hash: '#driverManagement',
			pageUrl: '/driverManagement/init',
			doFun: function() {
				driverManagement();
			}
		},
		//生产发货统计------------杨红
		{
			hash: '#productionStatistical',
			pageUrl: '/productionStatistical/init',
			doFun: function() {
				productionStatistical();
			}
		},
		{
			hash: '#stateAndGuard',
			pageUrl: '/stateAndGuard/init',
			doFun: function() {
				stateAndGuard();
			}
		},
		{
			hash: '#deliveryStatistics',
			pageUrl: '/deliveryStatistics/init',
			doFun: function() {
				deliveryStatistics();
			}
		},
		//20170808 wanghy 外协渣土页面 start
		{
			hash: '#outsideMuckWeighingStatistics',
			pageUrl: '/outsideMuckWeighingStatistics/init',
			doFun: function() {
				outsideMuckWeighingStatistics();
			}
		},
		//20170808 wanghy 外协渣土页面 end

		//20170815 dongyunlong 调度看板页面 start
		{
			hash: '#schedulingBoard',
			pageUrl: '/schedulingBoard/init',
			doFun: function() {
				schedulingBoard();
			}
		},
        //20171024 wanghy 增加质检卡口模块  end
		//20170815 dongyunlong 调度看板页面 end
		//20170928 wanghy 试块制作模块 start
        {
            
            hash: '#briquette',
            pageUrl: '/briquette/init',
            doFun: function() {
                briquette();
            }
        },
        //20170928 wanghy 试块制作模块 end
        //20171024 wanghy 增加质检卡口模块  start
        {
            hash: '#qualityChecking',
            pageUrl: '/qualityChecking/init',
            doFun: function() {
              	qualityChecking();
            }
        },
        /*20171025 yuyue 增加调整配合比模块  start*/
        {
            hash: '#adjustProportion',
            pageUrl: '/adjustProportion/init',
            doFun: function() {
            	adjustProportion();
            }
        },
        {
            hash: '#workProportion',
            pageUrl: '/workProportion/init',
            doFun: function() {
            	workProportion();
            }
        },
       /*20171025 yuyue 增加调整配合比模块  end*/
        {
            hash: '#pathRail',
            pageUrl: '/pathRail/init',
            doFun: function() {
            	pathRail();
            }
        },
        /* 20171211 xieyihong 增加机组模块 start */
        {
            hash: '#unitInfo',
            pageUrl: '/unitInfo/init',
            doFun: function() {
              	unitInfo();
            }
        },
        /* 20171211 xieyihong 增加机组模块 end */

        /* 20171211 ningxin 动态配合比 start */
        {
            hash: '#dynamicMixRatio',
            pageUrl: '/dynamicMixRatio/init',
            doFun: function() {
            	dynamicMixRatio();
            }
        },
        /* 20171211 ningxin 动态配合比 end */

        {
            hash: '#sandTestRecord',
            pageUrl: '/sandTestRecord/init',
            doFun: function() {
                sandTestRecord();
            }
        },
        {
            hash: '#testRegulation',
            pageUrl: '/testRegulation/init',
            doFun: function() {
                testRegulation();
            }
        },
        {
            hash: '#testCommissioned',
            pageUrl: '/testCommissioned/init',
            doFun: function() {
                testCommissioned();
            }
        },
        {
            hash: '#testStandard',
            pageUrl: '/testStandard/init',
            doFun: function() {
                testStandard();
            }
        },
        {
            hash: '#cementTestRecord',
            pageUrl: '/cementTestRecord/init',
            doFun: function() {
                cementTestRecord();
            }
        },
        //耗料统计------------lwd
		{
			hash: '#feedConsumption',
			pageUrl: '/feedConsumption/init',
			doFun: function() {
				feedConsumption();
			}
		},
		//李鑫然 2018/3/29 调度地图 start
        {
            hash: '#schedulingMap',
            pageUrl: '/schedulingMap/init',
            doFun: function() {
                schedulingMap();
            }
        },
		//李鑫然 2018/3/29 调度地图 end
		/* 20180202 wanghy 增加原材采购计划模块 start */
        {
            hash: '#rawMaterialPurchasePlan',
            pageUrl: '/rawMaterialPurchasePlan/init',
            doFun: function () {
                rawMaterialPurchasePlan();
            }
        },
		/* 20180202 wanghy 增加原材采购计划模块 end */
		/* 20180321 wanghy 增加动态库存管理模块 start */
        {
            hash: '#dynamicInventory',
            pageUrl: '/dynamicInventory/init',
            doFun: function () {
                dynamicInventory();
            }
        },
		/* 20180321 wanghy 增加动态库存管理模块 end */
	],
	doFun: function() { // 驱动函数；
		config();
		loadpage();
	}
};
glObj.doFun();

/* config.js===路由器===function config */
function config() {
	var oPageWrap = $('#pageWrap');
	// var webPath = glObj.oWebPath + '/resources/app';
	var webPath = glObj.oWebPath;
	var pagePath = glObj.pageLoad;
	var omg; //定时器定义
	function postionPage(hash) {
		var len = pagePath.length;

		function getIndex() {
			for(var i = 0; i < len; i++) {
				if(pagePath[i].hash === hash) {
					return i;
				}
			}
			return 8;
		}
		// 20171128 dongyunlong bug-394 start
		if(hash == "#schedulingBoard" || hash == "#pathRail" || hash == "#schedulingMap"){
			$("#aside").hide();
			$(".index-footer").hide();
		}
		// 20171128 dongyunlong bug-394 end
		var index = getIndex();
		oPageWrap.hide().html('').load(webPath + pagePath[index].pageUrl,
			function() {
				init();
				//跳转时判断如果不是原材看板页面，就清除定时器
				if(index != 3) {
					if(omg) {
						clearInterval(omg);
					}
				}
				pagePath[index].doFun();
				oPageWrap.fadeIn();
			});

	}
	var hash = location.hash;
	postionPage(hash);
	window.onhashchange = function() {
		hash = location.hash;
		postionPage(hash);
	}

};

/* loadpage.js===初始加载页面===function loadpage */
function loadpage() {
	var oHeader = $('#index-wrap #head');
	var oAside = $('#aside');
	var oPageWrap = $('#pageWrap');
	var oWebPath = glObj.oWebPath;
	//bug-400 wangfeiyan543 20180102 start
	oHeader.load(oWebPath + '/top/init', function(data) {
		oAside.load(oWebPath + '/perm/init', function() {
			aside();
		});
		// 20171027 dongyunlong 对整体页面进行优化-增加底部栏 start
		setSideBar();
	});
	//bug-400 wangfeiyan543 20180102 end
};

function setSideBar() {
	var contentHeight = $("body").height();
	$("#aside").css("min-height",contentHeight - 60);
}

var resizeId;
$(window).resize(function() {
	clearTimeout(resizeId);
	resizeId = setTimeout(function() {
		setSideBar();
	}, 10);
});
// 20171027 dongyunlong 对整体页面进行优化-增加底部栏 end

/* 保存成功提示 1秒后消失 */
/*
 * $(".save").on("click", function() { $('#modalMessage').modal('show');
 * setTimeout(function() { $('#modalMessage').modal('hide'); }, 1000); });
 */
/*
 * 可输入下拉框
 */
// $(".common-input").on("click", function() {
// var input_com = $(this); // 获取点击位置
// input_com.next().slideToggle(); // 点击后，下拉出来
// input_com.on("blur", function() {
// input_com.next().slideUp("1000");
// });
// input_com.siblings().find("tr").on("click", function() {
// var test = $(this).find("label").html();
// input_com.val(test);
// input_com.next().hide("1000");
// });
// });
/* pageindex.js===首页页面===function pageindex */
function pageindex() {

};

/* powermanger.js===权限管理===function powermanger */
function powermanger() {

};
/* sampling.js===取样===function sampling */
function sampling() {

};

/* usermanger.js===用户管理===function usermanger 王延伟 */
function usermanger() {

};

function makecard() {

};

/*==========限制一列不合并,有第一标准列和第二标准列,符合条件就合并---nx==========*/
function autoRowSpan(table, row, col, colNub, noColIndex, FirstNode, SecondaryNodal) {
	var tb = document.getElementById(table);
	var lastValue = ""; //上下对比参照变量
	var valueRow = ""; //获取到每个单元格val
	var lastStandard = ""; //根据此变量判断是否合并---参照变量
	var valueStandard = ""; //根据此变量判断是否合并---获取单元格
	var lastSecondStandard = ""; //第二个判断节点---参照变量
	var valueSecondStandard = ""; //获取变量判断比较是否合并条件
	var TempData = ""; //临时数据
	var pos = 1;
	for(var j = col; j < colNub; j++) { //此处的2为想要合并列的数量
		for(var i = row; i < tb.rows.length; i++) {
			tb.rows[i].cells[j].setAttribute('class', i + '' + j);
		}
	}
	for(var j = col; j < colNub; j++) { //tb.rows.item(0).cells.length列的数量
		if(j == noColIndex) { //不比较第一列
			continue;
		}
		for(var i = row; i < tb.rows.length; i++) {
			valueRow = tb.getElementsByClassName(i + '' + j)[0].innerHTML; //获取到每个单元格val
			valueStandard = tb.getElementsByClassName(i + '' + FirstNode)[0].innerHTML; //根据此变量判断是否合并---获取单元格
			valueSecondStandard = tb.getElementsByClassName(i + '' + SecondaryNodal)[0].innerHTML; //获取第二节点变量判断比较是否合并条件  此处的3为第二节点列
			if(valueStandard == "") { //合并后的单元格为空
				valueStandard = TempData; //给单元格为空的单元格赋值，因为单元格为空就是有合并单元格情况
			} else {
				TempData = tb.getElementsByClassName(i + '' + 1)[0].innerHTML;
			}
			if(lastStandard == valueStandard && lastValue == valueRow && valueRow != "0") {
				if(j > SecondaryNodal && lastSecondStandard == valueSecondStandard) { //第二节点合并开始列下标
					tb.getElementsByClassName(i + '' + j)[0].innerText = '';
					tb.getElementsByClassName(i + '' + j)[0].style.display = 'none';
					tb.rows[i - pos].cells[j].rowSpan = tb.rows[i - pos].cells[j].rowSpan + 1;
					pos++;
				} else if(j < SecondaryNodal + 1) { //第一节点合并最后列
					tb.getElementsByClassName(i + '' + j)[0].innerText = '';
					document.getElementsByClassName(i + '' + j)[0].style.display = 'none';
					tb.rows[i - pos].cells[j].rowSpan = tb.rows[i - pos].cells[j].rowSpan + 1;
					pos++;
				}

			} else {
				lastValue = valueRow;
				lastStandard = valueStandard
				pos = 1;
			}
		}
	}
};

function restrictRowSpan(table, row, col, colNub, noColIndex, FirstNode, SecondaryNodal, thirdlyNodal) {
	var tb = document.getElementById(table);
	var lastValue = ""; //上下对比参照变量
	var valueRow = ""; //获取到每个单元格val
	var lastStandard = ""; //根据此变量判断是否合并---参照变量
	var valueStandard = ""; //根据此变量判断是否合并---获取单元格
	var lastSecondStandard = ""; //第二个判断节点---参照变量
	var valueSecondStandard = ""; //获取变量判断比较是否合并条件
	var lastThirdlyStandard = ""; //第三个判断节点---参照变量
	var valueThirdlyStandard = ""; //获取变量判断比较是否合并条件
	var TempData = ""; //临时数据
	var pos = 1;
	for(var j = col; j < colNub; j++) { //此处的2为想要合并列的数量
		for(var i = row; i < tb.rows.length; i++) {
			tb.rows[i].cells[j].setAttribute('class', i + '' + j);
		}
	}
	for(var j = col; j < colNub; j++) { //tb.rows.item(0).cells.length列的数量
		if(j == noColIndex) { //不比较第一列
			continue;
		}
		for(var i = row; i < tb.rows.length; i++) {
			valueRow = tb.getElementsByClassName(i + '' + j)[0].innerHTML; //获取到每个单元格val
			valueStandard = tb.getElementsByClassName(i + '' + FirstNode)[0].innerHTML; //根据此变量判断是否合并---获取单元格
			valueSecondStandard = tb.getElementsByClassName(i + '' + SecondaryNodal)[0].innerHTML; //获取第二节点变量判断比较是否合并条件  此处的3为第二节点列
			valueThirdlyStandard = tb.getElementsByClassName(i + '' + thirdlyNodal)[0].innerHTML;
			if(valueStandard == "") { //合并后的单元格为空
				valueStandard = TempData; //给单元格为空的单元格赋值，因为单元格为空就是有合并单元格情况
			} else {
				TempData = tb.getElementsByClassName(i + '' + 1)[0].innerHTML;
			}
			if(j > 0) {
				//20171024 wangfeiyan bug331 start
				//console.log("这是第" + i + j + "个：" + valueStandard);
				//20171024 wangfeiyan bug331 end
			}
			if(lastStandard == valueStandard && lastValue == valueRow && valueRow != "0") {
				if(j > thirdlyNodal && lastSecondStandard == valueSecondStandard && lastThirdlyStandard == valueThirdlyStandard) {
					tb.getElementsByClassName(i + '' + j)[0].innerText = '';
					tb.getElementsByClassName(i + '' + j)[0].style.display = 'none';
					tb.rows[i - pos].cells[j].rowSpan = tb.rows[i - pos].cells[j].rowSpan + 1;
					pos++;
				} else if(j > SecondaryNodal && j < thirdlyNodal + 1 && lastSecondStandard == valueSecondStandard) { //第二节点合并开始列下标
					tb.getElementsByClassName(i + '' + j)[0].innerText = '';
					tb.getElementsByClassName(i + '' + j)[0].style.display = 'none';
					tb.rows[i - pos].cells[j].rowSpan = tb.rows[i - pos].cells[j].rowSpan + 1;
					pos++;
				} else if(j < SecondaryNodal + 1) { //第一节点合并最后列
					tb.getElementsByClassName(i + '' + j)[0].innerText = '';
					tb.getElementsByClassName(i + '' + j)[0].style.display = 'none';
					tb.rows[i - pos].cells[j].rowSpan = tb.rows[i - pos].cells[j].rowSpan + 1;
					pos++;
				}
			} else {
				lastValue = valueRow;
				lastStandard = valueStandard;
				lastThirdlyStandard = valueThirdlyStandard;
				pos = 1;
			}
		}
	}
};

function firstRowSpan(table, row, col, colNub, noColIndex, firstSpan) {
	var tb = document.getElementById(table);
	var lastValue = ""; //上下对比参照变量
	var valueRow = ""; //获取到每个单元格val	
	var lastStandard = ""; //根据此变量判断是否合并---参照变量
	var valueStandard = ""; //根据此变量判断是否合并---获取单元格
	var TempData = ""; //临时数据
	var pos = 1;
	for(var j = col; j < colNub; j++) { //此处的2为想要合并列的数量
		for(var i = row; i < tb.rows.length; i++) {
			tb.rows[i].cells[j].setAttribute('class', i + '' + j);
		}

	}
	for(var j = col; j < colNub; j++) { //tb.rows.item(0).cells.length列的数量
		if(j == noColIndex) { //不比较第一列
			continue;
		}
		for(var i = row; i < tb.rows.length; i++) {
			valueRow = tb.getElementsByClassName(i + '' + j)[0].innerHTML; //获取到每个单元格val
			valueStandard = tb.getElementsByClassName(i + '' + firstSpan)[0].innerHTML; //根据此变量判断是否合并---获取单元格

			if(valueStandard == "") { //合并后的单元格为空
				valueStandard = TempData; //给单元格为空的单元格赋值，因为单元格为空就是有合并单元格情况
			} else {
				TempData = document.getElementsByClassName(i + '' + 1)[0].innerHTML;
			}

			if(lastValue == valueRow && valueRow != "0" && valueRow != "" && lastStandard == valueStandard) {
				tb.getElementsByClassName(i + '' + j)[0].innerText = '';
				tb.getElementsByClassName(i + '' + j)[0].style.display = 'none';
				tb.rows[i - pos].cells[j].rowSpan = tb.rows[i - pos].cells[j].rowSpan + 1;
				pos++;
			} else {
				lastValue = valueRow;
				lastStandard = valueStandard
				pos = 1;
			}
		}
	}
}

function allRowSpan(table, row, col, colNub, noColIndex) {
	var tb = document.getElementById(table);
	var lastValue = ""; //上下对比参照变量
	var valueRow = ""; //获取到每个单元格val
	var TempData = ""; //临时数据
	var pos = 1;
	for(var j = col; j < colNub; j++) { //此处的2为想要合并列的数量
		for(var i = row; i < tb.rows.length; i++) {
			tb.rows[i].cells[j].setAttribute('class', i + '' + j);
		}

	}
	for(var j = col; j < colNub; j++) { //tb.rows.item(0).cells.length列的数量
		if(j == noColIndex) { //不比较第一列
			continue;
		}
		for(var i = row; i < tb.rows.length; i++) {
			valueRow = tb.getElementsByClassName(i + '' + j)[0].innerHTML; //获取到每个单元格val
			valueStandard = tb.getElementsByClassName(i + '' + j)[0].innerHTML; //根据此变量判断是否合并---获取单元格
			if(valueStandard == "") { //合并后的单元格为空
				valueStandard = TempData; //给单元格为空的单元格赋值，因为单元格为空就是有合并单元格情况
			} else if(j > 1) {
				TempData = tb.getElementsByClassName(i + '' + 1)[0].innerHTML;
			}

			if(lastValue == valueRow && valueRow != "0") {
				tb.getElementsByClassName(i + '' + j)[0].innerText = '';
				tb.getElementsByClassName(i + '' + j)[0].style.display = 'none';
				tb.rows[i - pos].cells[j].rowSpan = tb.rows[i - pos].cells[j].rowSpan + 1;
				pos++;
			} else {
				lastValue = valueRow;
				pos = 1;
			}
		}
	}
}

/**
 * 合并合并单元，有一个参照列，参照列是合并的并且前一列一样的，上下一样合并
 * @param {Object} tableId  需要合并的表格ID属性值
 * @param {Object} row      需要开始合并表格行下标
 * @param {Object} col      需要开始合并表格列下标
 * @param {Object} referCol 参照合并列
 */
function astrictBeforeMerge(tableId, row, col, referCol, maxCol) {
	var tab = document.getElementById(tableId);
	var tr = tab.rows.length;
	var td = tab.rows[0].cells.length;
	var lastValue = "";
	var valueTd = "";
	var lastFirstValue = "";
	var firstValueTd = "";
	var lastBeforeValue = "";
	var beforeValueTd = "";
	var pos = 1;
	for(let i = col; i < td; i++) {
		if(i == maxCol) {
			break;
		} else if(maxCol == "" || maxCol == null) {

		}
		for(let j = row; j < tr; j++) {
			valueTd = tab.rows[j].cells[i].innerHTML;
			if(i > 0) {
				firstValueTd = tab.rows[j].cells[referCol].innerHTML;
				beforeValueTd = tab.rows[j].cells[i - 1].innerHTML;
			}
			if(i > 0 && lastBeforeValue == beforeValueTd && lastFirstValue == firstValueTd && lastValue == valueTd) {
				tab.rows[j].cells[i].style.display = "none";
				tab.rows[j - pos].cells[i].rowSpan = tab.rows[j - pos].cells[i].rowSpan + 1;
				pos++;
			} else if(i < 1 && lastValue == valueTd) {
				tab.rows[j].cells[i].style.display = "none";
				tab.rows[j - pos].cells[i].rowSpan = tab.rows[j - pos].cells[i].rowSpan + 1;
				pos++;
			} else {
				lastValue = valueTd;
				if(i > 0) {
					lastFirstValue = firstValueTd;
					lastBeforeValue = beforeValueTd;
				}
				pos = 1;
			}
		}
	}
}

/**
 *合并合并单元，有一个参照列，参照列是合并并且有除去不参加合并单元格，那上下一样再合并
 * @param {Object} tableId  需要合并的表格ID属性值
 * @param {Object} row      需要开始合并表格行下标
 * @param {Object} col      需要开始合并表格列下标
 * @param {Object} referCol 参照合并列
 * @param {Object} dapCol   不需要合并列的下标，此处为传数组[0,1,2...]
 * creater:宁鑫
 */
function dapColMerge(tableId, row, col, referCol, maxCol, dapCol) {
	var tab = document.getElementById(tableId);
	var tr = tab.rows.length;
	var td = tab.rows[0].cells.length;
	var lastValue = "";
	var valueTd = "";
	var lastFirstValue = "";
	var firstValueTd = "";
	var dap = dapCol;
	var pos = 1;
	for(let i = col; i < td; i++) {
		/*var iSpanIndex = 0;
		var sSpanSingularValue = "";
		var sSpanEvenVaule = "";*/
		if(dap) {
			if(dap.indexOf(i) > -1) continue;
		} else {
			alert("您缺少元素！！合并单元格失败！");
			break;
		}
		if(i == maxCol) {
			break;
		}
		var iNow = 1;
		for(let j = row; j < tr; j++) {
			valueTd = tab.rows[j].cells[i].innerHTML;
			if(i > referCol) {
				firstValueTd = tab.rows[j].cells[referCol].innerHTML;
			}
			if(i > referCol && lastFirstValue == firstValueTd && lastValue == valueTd && valueTd != null) {
				var tabSpanAs = tab.rows[j - iNow].cells[i - 1].getAttribute("rowSpan");
				if(tabSpanAs > 1) {
					var tabSpaniNow = tabSpanAs;
				}
				var tabSpan = tab.rows[j].cells[i - 1].getAttribute("rowSpan");
				var tabSpanDis = tab.rows[j].cells[i - 1].style.display;
				var tabSpanValue = tab.rows[j].cells[i - 1].innerHTML;
				var iTabLeg = tabSpanValue.length;
				if(tabSpan == null && tabSpanValue && tabSpanValue.length > 1 && tabSpanDis == "") {
					tabSpaniNow = 1;
				}
				if(tabSpaniNow > 1 && tabSpan == null) {
					tab.rows[j].cells[i].style.display = "none";
					tab.rows[j - pos].cells[i].rowSpan = tab.rows[j - pos].cells[i].rowSpan + 1;
					pos++;
				} else {
					pos = 1;
				}
			} else if(i < referCol + 1 && lastValue == valueTd && valueTd != null) {
				tab.rows[j].cells[i].style.display = "none";
				tab.rows[j - pos].cells[i].rowSpan = tab.rows[j - pos].cells[i].rowSpan + 1;
				pos++;
			} else {
				var tabSpanAss = tab.rows[j - 1].cells[i - 1].getAttribute("rowSpan");
				lastValue = valueTd;
				if(i > referCol) {
					lastFirstValue = firstValueTd;
				}
				if(tabSpanAss > 1) {
					iNow++;
				}
				pos = 1;
			}
		}
	}
}

/**
 * 合并合并单元，有一个参照列，参照列是合并并且有共同合并，那上下一样再合并
 * @param {Object} tableId  需要合并的表格ID属性值
 * @param {Object} row      需要开始合并表格行下标
 * @param {Object} col      需要开始合并表格列下标
 * @param {Object} referCol 参照合并列
 * @param {Object} dapCol   不需要合并列的下标，此处为传数组[0,1,2...]
 * @param {Object} commonMergeCol 共同合并参照列
 * @param {Object} dapAstrictCol  需要跟共同合并的列。此处需要传数组[0,1,2...],不管原来的值是否上下一样，渲染出来的值都是合并的第一个值
 * creater:宁鑫
 */
function dapAstrictColMerge(tableId, row, col, maxCol, referCol, dapColl, commonMergeCol, dapAstrictCol) {
	var tab = document.getElementById(tableId);
	var tr = tab.rows.length;
	var td = tab.rows[0].cells.length;
	var lastValue = "";
	var valueTd = "";
	var lastFirstValue = "";
	var firstValueTd = "";
	var dap = dapAstrictCol;
	var dapNew = dapColl;
	var pos = 1;
	for(let i = col; i < td; i++) {
		if(dap || dapNew) {
			if(dap.indexOf(i) > -1 || dapNew.indexOf(i) > -1) continue;
		} else {
			alert("您缺少元素！！合并单元格失败！");
			break;
		}
		if(i == maxCol) {
			break;
		} else if(maxCol == "" || maxCol == null) {

		}
		for(let j = row; j < tr; j++) {
			valueTd = tab.rows[j].cells[i].innerHTML;
			if(i > referCol) {
				firstValueTd = tab.rows[j].cells[referCol].innerHTML;
			}
			if(i > referCol && lastFirstValue == firstValueTd && lastValue == valueTd && valueTd != null) {
				var tabSpan = tab.rows[j - 1].cells[i - 1].getAttribute("rowSpan");
				var tabSpanTwo = tab.rows[j].cells[i - 1].getAttribute("rowSpan");
				var tabStr = tab.rows[j - 1].cells[i - 1].style.display;
				if(tabSpan > 1 || tabStr == "none") {
					tab.rows[j].cells[i].style.display = "none";
					tab.rows[j - pos].cells[i].rowSpan = tab.rows[j - pos].cells[i].rowSpan + 1;
					if(i == commonMergeCol) {
						//20170622  ningxin   修改一下循环，兼容IE的方法   start
						for(var valIndex in dapAstrictCol) { //循环数组内的值
							if(dapAstrictCol.hasOwnProperty(valIndex)) {
								var val = dapAstrictCol[valIndex];
								tab.rows[j].cells[val].style.display = "none"; //赋值隐藏
								tab.rows[j - pos].cells[val].rowSpan = tab.rows[j - pos].cells[val].rowSpan + 1; //赋值给合并列的数量
							}
							//20170622  ningxin   修改一下循环，兼容IE的方法   end
						}
					}
					pos++;
				}

			} else if(i < referCol + 1 && lastValue == valueTd) {
				tab.rows[j].cells[i].style.display = "none";
				tab.rows[j - pos].cells[i].rowSpan = tab.rows[j - pos].cells[i].rowSpan + 1;
				pos++;
			} else {
				lastValue = valueTd;
				if(i > referCol) {
					lastFirstValue = firstValueTd;
				}
				pos = 1;
			}
		}
	}
}

/**
 * 合并合并单元，有一个参照列，参照列是合并并且有共同合并，那上下一样再合并
 * @param {Object} tableId  需要合并的表格ID属性值
 * @param {Object} row      需要开始合并表格行下标
 * @param {Object} col      需要开始合并表格列下标
 * @param {Object} referCol 参照合并列
 * @param {Object} commonMergeCol 共同合并参照列
 * @param {Object} dapAstrictCol  需要跟共同合并的列。此处需要传数组[0,1,2...],不管原来的值是否上下一样，渲染出来的值都是合并的第一个值
 * creater:宁鑫
 */

function dapAstrictColMergeNew(tableId, row, col, maxCol, referCol, commonMergeCol, dapAstrictCol) {
	var tab = document.getElementById(tableId);
	var tr = tab.rows.length;
	var td = tab.rows[0].cells.length;
	var lastValue = "";
	var valueTd = "";
	var lastFirstValue = "";
	var firstValueTd = "";
	var dap = dapAstrictCol;
	var pos = 1;
	for(let i = col; i < td; i++) {
		if(dap) {
			if(dap.indexOf(i) > -1) continue;
		} else {
			alert("您缺少元素！！合并单元格失败！");
			break;
		}
		if(i == maxCol) {
			break;
		} else if(maxCol == "" || maxCol == null) {

		}
		for(let j = row; j < tr; j++) {
			valueTd = tab.rows[j].cells[i].innerHTML;
			if(i > referCol) {
				firstValueTd = tab.rows[j].cells[referCol].innerHTML;
			}
			if(i > referCol && lastFirstValue == firstValueTd && lastValue == valueTd && valueTd != null) {
				var tabSpan = tab.rows[j - 1].cells[i - 1].getAttribute("rowSpan");
				var tabSpanTwo = tab.rows[j].cells[i - 1].getAttribute("rowSpan");
				var tabStr = tab.rows[j - 1].cells[i - 1].style.display;
				/**
				 * 添加了对本相前一个单元格的display的值
				 * 2017-06-12 宁鑫
				 */
				var tabStrTwo = tab.rows[j].cells[i - 1].style.display;
				/**
				 * 添加了从1072-1074行判断，判断同行前一列是合并的情况下要不本列的pos值恢复成初始值
				 * 2017-06-09 宁鑫  301
				 */
				if(tabSpanTwo > 1) {
					pos = 1;
				}
				if(tabSpan > 1 || tabStr == "none") {
					/**
					 * 对本相前一个单元格如果是none就合并验证
					 * 2017-06-12 宁鑫
					 */
					if(tabSpanTwo < 1 && tabStrTwo == "none") {
						tab.rows[j].cells[i].style.display = "none";
						tab.rows[j - pos].cells[i].rowSpan = tab.rows[j - pos].cells[i].rowSpan + 1;
						if(i == commonMergeCol) {
							//20170622  ningxin   修改一下循环，兼容IE的方法   start
							for(var valIndex in dapAstrictCol) { //循环数组内的值
								if(dapAstrictCol.hasOwnProperty(valIndex)) {
									var val = dapAstrictCol[valIndex];
									tab.rows[j].cells[val].style.display = "none"; //赋值隐藏
									tab.rows[j - pos].cells[val].rowSpan = tab.rows[j - pos].cells[val].rowSpan + 1; //赋值给合并列的数量
								}
								//20170622  ningxin   修改一下循环，兼容IE的方法   end
							}
						}
						pos++;
					}

				}

			} else if(i < referCol + 1 && lastValue == valueTd) {
				tab.rows[j].cells[i].style.display = "none";
				tab.rows[j - pos].cells[i].rowSpan = tab.rows[j - pos].cells[i].rowSpan + 1;
				pos++;
			} else {
				lastValue = valueTd;
				if(i > referCol) {
					lastFirstValue = firstValueTd;
				}
				pos = 1;
			}
		}
	}
}

/**
 * &&&合并合并单元，有一个参照列，有参照列是合并的并且前一列一样的，上下一样合并，有参照强迫跟随合并&&& 
 * @param {Object} oIncomingArray 传入对象值，值得内容如下oAssignIncomingArray里的注释
 * 2017-6-15
 * create 宁鑫
 */
function beforeAndAfterMerage(oIncomingArray) {
	var oAssignIncomingArray = {
		tableId: "", //传入要合并的表table的ID
		row: 0, //行开始下标
		col: 0, //列开始下标
		referCol: "", //首要合并条件参照列
		maxCol: 8, //最大合并列
		dapCol: [], //不需要合并列
		commonMergeCol: "", //第二影响列参照列
		dapAstrictCol: [], //看齐第二影响列参照列，它怎么合并这个数组里的列下标就怎么合并
	};
	var oAssignIncomingArray = oIncomingArray; //把传入对象赋值给方法相对应
	var tableId = oAssignIncomingArray.tableId, //把表ID赋值
		row = oAssignIncomingArray.row, //把开始行下标赋值
		col = oAssignIncomingArray.col, //把开始列下标赋值
		referCol = oAssignIncomingArray.referCol, //首页合并条件赋值
		maxCol = oAssignIncomingArray.maxCol, //最大行赋值
		dapCol = oAssignIncomingArray.dapCol, //不合并列数组赋值
		commonMergeCol = oAssignIncomingArray.commonMergeCol, //第二影响列赋值
		dapAstrictCol = oAssignIncomingArray.dapAstrictCol; //第二跟随合并列赋值
	var tab = document.getElementById(tableId); //获取表dom
	var tr = tab.rows.length; //表总行数
	var td = tab.rows[0].cells.length; //表总列数
	var lastValue = ""; //初始化本相对比上面的值
	var valueTd = ""; //初始化本相对比值
	var lastFirstValue = ""; //首要对比参照上值
	var firstValueTd = ""; //首要对比本相值
	var pos = 1; //初始化合并rowSpan值
	/*===合并查询对比开始，循环对比===*/
	for(let i = col; i < td; i++) { //从列开始循环
		if(dapCol) { //如果数组不合并或者跟随合并数组为真
			//跳出不合并列或者跟随合并列，不参加上下对比
			if(dapCol.indexOf(i) > -1) {
				continue;
			}
		}
		if(commonMergeCol) {
			if(dapAstrictCol.indexOf(i) > -1) {
				continue;
			}
		}
		if(i == maxCol) { //当大于最大列数的时候跳出此方法
			break;
		} else if(maxCol == "" || maxCol == null) {

		}
		/*===对表列的循环===*/
		for(let j = row; j < tr; j++) {
			valueTd = tab.rows[j].cells[i].innerHTML; //获取相应单元格内的值
			if(i > referCol) { //当列的下标大于首要参照行的时候执行的方法
				firstValueTd = tab.rows[j].cells[referCol].innerHTML; //获取相应行的参照列的值
			}
			if(i > referCol && lastFirstValue == firstValueTd && lastValue == valueTd && valueTd != null) { //当列的下表大于参照列并参照的上下对比一样并本相上下对比一样,本相不能为空
				var tabSpan = tab.rows[j - 1].cells[i - 1].getAttribute("rowSpan"); //获得本相前一行上一列的合并列数值
				var tabSpanTwo = tab.rows[j].cells[i - 1].getAttribute("rowSpan"); //获得本相前一行前一列的合并列数值
				var tabStr = tab.rows[j - 1].cells[i - 1].style.display; //获得前一行上一列的style的值
				var tabStrTwo = tab.rows[j].cells[i - 1].style.display; //获得前一行前一列的style的值
				if(tabSpanTwo > 1) { //当大于1的时候之行的方法
					//恢复初始化
					pos = 1;
				}
				if(tabSpan > 1 || tabStr == "none") { //当前一行上一列是合并列的时候或者是隐藏时候要执行的方法
					if(tabSpanTwo < 1 && tabStrTwo == "none") { //当前一行前一列不是合并列并且是隐藏的时候执行下列方法
						tab.rows[j].cells[i].style.display = "none"; //赋值隐藏
						tab.rows[j - pos].cells[i].rowSpan = tab.rows[j - pos].cells[i].rowSpan + 1; //赋值给合并列的数量
						if(i == commonMergeCol) { //如果列等于需要执行跟随合并的数组时
							for(var valIndex in dapAstrictCol) { //循环数组内的值
								if(dapAstrictCol.hasOwnProperty(valIndex)) {
									var val = dapAstrictCol[valIndex];
									tab.rows[j].cells[val].style.display = "none"; //赋值隐藏
									tab.rows[j - pos].cells[val].rowSpan = tab.rows[j - pos].cells[val].rowSpan + 1; //赋值给合并列的数量
								}
							}
						}
						pos++; //自加合并列的数量值
					}

				}

			} else if(i < referCol + 1 && lastValue == valueTd) { //列小于首要条件列并上下一样的情况下
				tab.rows[j].cells[i].style.display = "none"; //赋值隐藏
				tab.rows[j - pos].cells[i].rowSpan = tab.rows[j - pos].cells[i].rowSpan + 1; //赋值增加合并列数量值
				pos++; //自增合并列数量值
			} else {
				lastValue = valueTd; //把本相值赋值相对比值
				if(i > referCol) { //当列大于首要条件列时
					lastFirstValue = firstValueTd; //本相值赋值给相对比值
				}
				pos = 1; //恢复初始化合并数量值
			}
		}
	}
}

/**
 * 此方法作用是不能让display是block，如果是就把它变为inline-block;主要是运用在jquery validate在onkeyup中添加的方法，
 * @param {Object} domInput 需要的input,如果是validate插件一般都是传element,
 * @param {Object} str		需要的验证的id名后半部分，如果是validate插件一般是"-error"
 * creator 宁鑫
 */
function garisUbah(domInput, str) {
	var strId = domInput.name + str;
	if(document.getElementById(strId) == null) {
		return;
	}
	if(document.getElementById(strId).style.display == "block") {
		document.getElementById(strId).style.display = "inline-block";
	}
}

/**
 * 生成style内部链接css
 * @param {Object} cssObj 出入数组需要加入的样式，“类名{}”
 * creator 宁鑫
 * 2017-05-13
 */
function styles(cssObj) {
	var style = document.createElement('style');
	style.id = "styleId";
	style.type = 'text/css';
	var str = "";
	for(var i in cssObj) {
		if(cssObj.hasOwnProperty(i)) {
			str += cssObj[i] + "\n";
		}
	}
	style.innerHTML = str;
	document.getElementsByTagName("head").item(0).appendChild(style);
}

/**
 * 把字符串转变成为方法
 * @param {Object} fn 需要转换的字符串
 * creator 宁鑫
 */
function commonCreateFunction(fn) {
	var Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
	if(fn.substr(0, 1) == "=") {
		fn = fn.substr(1);
	}
	return new Fn('return ' + fn)();
}

/**
 * 刷新圆圈转
 * @param {Object} obj {
		addRefId: "",
		addBeforeDom: "",
		isShow: "",
		refreshTime: ""
	}
	@creator 宁鑫
 */
function refreshRoundNew(obj) {
	//设置传入对象
	var objs = {
		addRefId: "", //添加div的ID
		addBeforeDom: "", //想把刷新放在哪儿个div之上的class
		isShow: "", //动画是否显示
		refreshTime: "" //时间
	}
	objs = obj; //把传入的付给设置的对象
	//如果有模态框先删除
	if(document.getElementById("refreshModal")) {
		document.getElementById("refreshModal").remove();
	}
	var addAll = document.getElementById(objs.addRefId); //获取刷新dom
	var addAllStyle = getComputedStyle(addAll, false)["position"]; //设置style
	//是否存在position = "relative"
	if(addAllStyle == "static") {
		addAll.style.position = "relative";
	}
	var addAllWid = addAll.offsetWidth; //获取想要刷新的dom宽
	var addAllHei = addAll.offsetHeight; //获取想要刷新的dom高
	var windowWidth = window.screen.availHeight; //当前视口宽
	var windowHeight = window.screen.availWidth; //当前视口高
	/*console.log("wid", windowWidth, "hei", windowHeight);
	console.log("allwid", addAllWid, "allhei", addAllHei);*/
	//当刷新的dom宽小于100px时设置视口宽的百分之八十
	if(addAllWid < 100) {
		addAll.style.width = windowWidth * 0.8 + "px";
		addAllWid = windowWidth * 0.8;
	}
	//当刷新的dom高小于100px时设置视口宽的百分之二十
	if(addAllHei < 200) {
		addAll.style.height = windowHeight * 0.2 + "px";
		addAllHei = windowHeight * 0.2;
	}
	var modal = document.createElement("div"); //创建遮罩层
	modal.id = "refreshModal"; //给遮罩层设ID
	var refAll = document.createElement("div"); //创建动画div
	var addBefore = addAll.getElementsByClassName(objs.addBeforeDom)[0]; //获得隐藏dom,也就是刷新当时者，先把它隐藏
	addBefore.style.display = "none"; //隐藏
	refAll.className = "refAll"; //给创建的动画层div设置class
	modal.appendChild(refAll); //把它加入到遮罩层中
	addBefore.parentNode.insertBefore(modal, addBefore); //把模态框加入到需要刷新数据的dom之上
	/*---此循环是添加叶片---*/
	for(var i = 0; i < 12; i++) {
		var dot = document.createElement("div");
		dot.className = "circle";
		refAll.appendChild(dot);
	}
	var refAllClass = addAll.getElementsByClassName("refAll")[0]; //获取dom圆圈
	var str = getComputedStyle(refAllClass, false)["height"]; //获得高
	var dotClass = refAllClass.getElementsByClassName("circle"); //获取每个叶片
	/*---设置所有的style样式---*/
	if(str == "0px") {
		var refreshModal = "#refreshModal {position: absolute;top: 0;bottom: 0;left: 0;right: 0;background-color: rgba(0,0,0,0);}"
		var refSize = "@keyframes refSize {0%,80%,100% {transform: scale(0.0);opacity: 0.0;-webkit-transform: scale(0.0);}20% {transform: scale(0.5);opacity: 0.5;-webkit-transform: scale(0.5);}40% {transform: scale(1.0);opacity: 1.0;-webkit-transform: scale(1.0);}}";
		var refAllCla = ".refAll{width:15%;height:30%;position:absolute;}";
		var circleCla = ".circle {width: 10%;height: 10%;background-color: #3f9fd9;border-radius: 100%;position: absolute;border: 1px solid #3f9fd9;margin-right: 2px;animation: refSize 1.5s infinite ease-in-out;}";
		styles([refreshModal, refAllCla, circleCla, refSize]);
	}
	var dotLeft = refAllClass.offsetWidth / 2; //叶片的左边距
	var dotTop = refAllClass.offsetHeight / 2; //叶片的上边距
	refAllClass.style.top = addAllHei / 2 - dotTop + "px"; //转圈的上边距
	refAllClass.style.left = addAllWid / 2 - dotLeft + "px"; //转圈的左边距
	//console.log(dotLeft+"====="+dotTop);
	var stard = 0; //圆心
	var radius = (dotLeft + 20) / 2; //半径
	var avd = 360 / dotClass.length;
	var ahd = avd * Math.PI / 180;
	//设置叶片的动画效果
	for(let i in dotClass) {
		if(dotClass.hasOwnProperty(i)) {
			dotClass[i].style.left = Math.sin((ahd * i)) * radius + dotLeft + "px";
			dotClass[i].style.top = Math.cos((ahd * i)) * radius + dotTop + "px";
			dotClass[i].style.animation = "refSize infinite ease-in-out";
			dotClass[i].style.animationDuration = "1.2s";
			dotClass[i].style.animationFillMode = "both";
			dotClass[i].style.animationDelay = -i + "s";
		}
	}
	var styleID = document.getElementById("styleId"); //内部样式
	var overTime = 0; //初始化控制
	if(objs.refreshTime == null) { //如果没有特殊设置，等到20秒后就设置为请求超时
		objs.refreshTime = 20000;
	}
	if(!objs.isShow) { //如果为false,则取消刷新
		refAllClass.remove(); //删除转圈叶片
		modal.remove(); //删除遮罩层
		addBefore.style.display = ""; //让刷新数据层显示
		overTime = 1; //设置控制为1
	}
	if(overTime == 0) { //过时处理方法
		setTimeout(function() {
			refAllClass.remove();
			modal.remove();
			addBefore.style.display = "";
		}, objs.refreshTime);
	}
	setTimeout(function() {
		styleID.remove();
	}, 30000);
}

/**
 * 解决双滚动条
 * @param flag 根据flag添加类名来使双滚动消失
 * @creator wanghy
 */
function removeDoubleScroll(flag) {
	if(flag) {
		try {
			$("body").addClass("overflow-modal-status");
		} catch(e) {

		}
	} else {
		try {
			$("body").removeClass("overflow-modal-status");
		} catch(e) {

		}
	}
}
/**
 * 解决双滚动条-新通用方法
 * @param out 外部模态
 * @param in 内部模态或body
 * @creator wanghy
 */

function hiddenModalDoubleScroll(outer, inner) {
	$(outer).on('hidden.bs.modal', function() {
		if(inner != "body") {
			$(inner).css({
				'overflow-y': 'auto'
			});
			$("body").addClass("overflow-modal-status");
		} else {
			$("body").removeClass("overflow-modal-status");
		}
	});
}
/**
 * 禁用特殊技术要求通用方法
 * @param vm vue变量
 * @param value 验证的值
 * @creator wanghy
 */
function stopspecialCharFilter(vm,value){
    var pattern = new RegExp("[`~!@#$^&*()=|{}'<>/?~！@#￥……&*（）——|【】‘；：《》”“'%+ \\[\\]　\"\\\\]");  
	var specialStr = "";  
	for(var i=0;i<value.length;i++){  
		specialStr += value.substr(i, 1).replace(pattern, '');  
	}
	if(specialStr == value){  
		return true;  
	}else{
		tipModalShow(vm,{resultValue:"不能存在特殊字符"});
	    return false;
	}
}

/**
 * 解决气泡塌陷
 * @param dom 对dom进行改变样式状态使气泡固定住不掉下来-一定是ulli结构并且li中添加redstar类
 * @creator wanghy
 */
function labelAddInlineBlock(dom) {
    try{
    	$(dom).parents('li').siblings('.redstar').find('label').css("display","inline-block");
    }catch(e){
    	//20171024 wangfeiyan bug331 start
        //console.log(dom+"无效");
      //20171024 wangfeiyan bug331 end
    }
}
/**
 * 去除字符串中的空格
 * @param str 需要去掉空格的字符串 
 * is_global 应传“g”如果不传则只去除前后空格
 * @creator wanghy
 */
function Trim(str,is_global){
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    if(is_global.toLowerCase()=="g"){
        result = result.replace(/\s/g,"");
    }
    return result;
}
// 2017-10-30 优化1.0-73 start
// 整行选中 inputBox 框
function selectInputBox($this){
	var that = $($this).parents('tr').find('input');
	if(that.is(":checked")){
		that.prop("checked",false);
	}else {
		that.prop("checked",true);
	}
}
// 阻止事件冒泡
function stopEventBubbling(e){
	e.stopPropagation();
}
// 2017-10-30 优化1.0-73 end

//2017-11-10 优化1.0-47 yanghong start
function fixationTableOnTd(flag,clazz){
	$("#"+clazz).scroll(function() {
        var left = $("#"+clazz).scrollLeft(); 
        var tbodyTrs = $("#"+clazz+" table tbody tr"); 
        var theadTrs = $("#"+clazz+" table thead tr");
        tbodyTrs.each(function(i) {
        	if(flag == 1){
        		$(this).hover(function(){
            		$(this).children().eq(0).css({"background":"#CCCCCC"})
            	},function(){
            		if(i%2 == 1){
            	    	$(this).children().eq(0).css("background","#ffffff");
            	    }else{
            	    	$(this).children().eq(0).css("background","#D9E1F2");
            	    }
            	})
            	if(i%2 == 1){
                	$(this).children().eq(0).css("background","#ffffff");
                }else{
                	$(this).children().eq(0).css("background","#D9E1F2");
                }
        	}else if(flag == 2){
        		$(this).hover(function(){
            		$(this).children().eq(0).css({"background":"#CCCCCC"})
            		$(this).children().eq(1).css({"background":"#CCCCCC"})
            	},function(){
            		if(i%2 == 1){
            	    	$(this).children().eq(0).css("background","#ffffff");
            	    	$(this).children().eq(1).css("background","#ffffff");
            	    }else{
            	    	$(this).children().eq(0).css("background","#D9E1F2");
            	    	$(this).children().eq(1).css("background","#D9E1F2");
            	    }
            	})
        		setThisStyle($(this),1,left-2);
            	theadTrs.each(function(i){
                	setThisStyle($(this),1,left-2,"#4472C4");
                })
                if(i%2 == 1){
                	$(this).children().eq(0).css("background","#ffffff");
                	$(this).children().eq(1).css("background","#ffffff");
                }else{
                	$(this).children().eq(0).css("background","#D9E1F2");
                	$(this).children().eq(1).css("background","#D9E1F2");
                }
            }else{
        		$(this).children().eq(0).css("background","#ffffff");
        	}
            setThisStyle($(this),0,left-1);
        });
        theadTrs.each(function(i){
        	setThisStyle($(this),0,left-1,"#4472C4");
        })
    });
}
function fixationTableOnTdOfDelivery(flag,clazz){
	$("#"+clazz).scroll(function(){
		var left = $("#"+clazz).scrollLeft(); 
        var tbodyTrs = $("#"+clazz+" table tbody tr"); 
        var theadTrs = $("#"+clazz+" table thead tr");
        if(flag == 1){
        	theadTrs.each(function(i){
        		$(this).children().css({
        			"position": "unset",
                    "top": "unset",
                    "left": "unset",
        		});
        		setThisStyle($(this),0,left-1,"#4472C4");
            })
            tbodyTrs.each(function(i) {
            	$(this).children().css({
        			"position": "unset",
                    "top": "unset",
                    "left": "unset",
        		});
            	$(this).hover(function(){
            		$(this).children().eq(0).css({"background":"#CCCCCC"})
            	},function(){
            		if(i%2 == 1){
            	    	$(this).children().eq(0).css("background","#ffffff");
            	    }else{
            	    	$(this).children().eq(0).css("background","#D9E1F2");
            	    }
            	})
            	if(i%2 == 1){
                	$(this).children().eq(0).css("background","#ffffff");
                }else{
                	$(this).children().eq(0).css("background","#D9E1F2");
                }
            	setThisStyle($(this),0,left-1);
            })
    	}else{
    		theadTrs.each(function(i){
            	setThisStyle($(this),0,left-1,"#4472C4");
            	setThisStyle($(this),1,left-2,"#4472C4");
            })
            tbodyTrs.each(function(i) {
            	$(this).hover(function(){
            		$(this).children().eq(0).css({"background":"#CCCCCC"})
            		$(this).children().eq(1).css({"background":"#CCCCCC"})
            	},function(){
            		if(i%2 == 1){
            	    	$(this).children().eq(0).css("background","#ffffff");
            	    	$(this).children().eq(1).css("background","#ffffff");
            	    }else{
            	    	$(this).children().eq(0).css("background","#D9E1F2");
            	    	$(this).children().eq(1).css("background","#D9E1F2");
            	    }
            	})
            	if(i%2 == 1){ 
                	$(this).children().eq(0).css("background","#ffffff");
                	$(this).children().eq(1).css("background","#ffffff");
                }else{
                	$(this).children().eq(0).css("background","#D9E1F2");
                	$(this).children().eq(1).css("background","#D9E1F2");
                }
            	setThisStyle($(this),0,left-1);
            	setThisStyle($(this),1,left-2);
            })
    	}
	})
}
function setThisStyle(clazz,num,left,bg){
	clazz.children().eq(num).css({
	    "position": "relative",
	    "top": "0px",
	    "left": left,
	    "background":bg,
	});
}

//2017-11-10 优化1.0-47 end
//去空格方法-wanghy
function TrimToInput(element,is_global){
    var result = $(element).val();
    result = result.replace(/(^\s+)|(\s+$)/g,"");
    if(!is_global){
        is_global = "g";
    }
    if(is_global.toLowerCase()=="g"){
        result = result.replace(/\s/g,"");
    }
    $(element).val(result);
}
/**
 * 删除表格项 如果是最后一条数据返回上一页，否则不返回上一页
 * @param first 是否为首页
 * @param totalElements 总条数
 * @param size 一页显示的条数
 * @param page 当前页数-1
 * @param totalPages 总页数
 */
function deleteTableItemToLastPage(first,totalElements,size,page,totalPages) {
	var curPage = page;
	if (!first && (totalElements - 1)%size == 0 && (page + 1) == totalPages){
		curPage = page-1;
	}
	return curPage;
	
}

// 20180224 wanghy 增加锁定表头方法
function fixationTableOnTr(id) {
    $("#" + id).scroll(function () {
        var top = $("#" + id).scrollTop();
        var left = $("#" + id).scrollLeft();
        var theadTrs = $("#" + id + " table thead tr td");
        theadTrs.each(function () {
            $(this).css({
                "position": "relative",
                "top": top - 1,
                "left": 0,
                "background": "#4472C4",
                "z-index": 1000
            });
        })
    });
}
// 把0和非数字进行清空
function NumToInput(element) {
    var result = $(element).val();
    var num = /^\+?[1-9][0-9]*$/;
    result = result * 1;
    if(isNaN(result)|| !num.test(result)){
        result = "";
    }else if(result == 0){
        result = "";
    }
    $(element).val(result);
}
// 动态库存管理闪烁定时器
var TwinkleInterval = "";
// 动态库存管理刷新定时器
var timeSpanReflushInterval = "";
// 清空预/报警闪烁定时器
function  clearDynamicInventoryTwinkleInterval() {
    // 定时器启动要进行清空
    if (TwinkleInterval) {
        // 清空预/报警闪烁定时器
        clearInterval(TwinkleInterval);
        // 清空闪烁定时器值
        TwinkleInterval = "";
    }
}
// 清空刷新页面定时器
function  clearDynamicInventoryTimeSpanReflushInterval() {
    // 定时器启动要进行清空
    if (timeSpanReflushInterval) {
        // 清空刷新页面定时器
        clearInterval(timeSpanReflushInterval);
        // 清空刷新页面定时器值
        timeSpanReflushInterval = "";
    }
}

// 原材采购计划查询追加计划定时器
var additionalPlanInterval = "";
// 原材采购计划动态库存部分定时器
var dynamicInventoryInterval = "";
// 清空原材采购计划查询追加计划定时器
function  clearRawMaterialPurchasePlanAdditionalPlanInterval() {
    // 定时器启动要进行清空
    if (additionalPlanInterval) {
        // 清空原材采购计划查询追加计划定时器
        clearInterval(additionalPlanInterval);
        // 清空原材采购计划查询追加计划定时器值
        additionalPlanInterval = "";
    }
}
// 清空原材采购计划动态库存部分定时器
function  clearRawMaterialPurchasePlanDynamicInventoryInterval() {
    // 定时器启动要进行清空
    if (dynamicInventoryInterval) {
        // 清空原材采购计划动态库存部分定时器
        clearInterval(dynamicInventoryInterval);
        // 清空原材采购计划动态库存部分定时器值
        dynamicInventoryInterval = "";
    }
}
