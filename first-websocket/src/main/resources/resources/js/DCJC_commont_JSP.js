/**
 * <b>功能名：</b>自动生成jsp页面中头部、主体、模态框、刷新等功能<br>
 * <b>说明：</b>调用DCJC_HTML_FU加上点后，选择好对应的方法<br>
 * <b>著作权：</b> Copyright (C) 2017 JINCHAN CORPORATION<br>
 * <b>修改履历：</b>
 *
 * @author 2017年12月16日 宁鑫
 */
var DCJC_HTML_FU = {};

/**
 * 设置css方法
 * @param {Object} targetObj 创建标签
 * @param {Object} cssObj    css样式对象
 * creater:宁鑫
 */
DCJC_HTML_FU.cssNX = function(targetObj, cssObj) {
	var str = targetObj.getAttribute("style") ? targetObj.getAttribute("style") : "";
	for(var i in cssObj) {
		str += i + ":" + cssObj[i] + ";";
	}
	targetObj.style.cssText = str;
}

/**
 * 生成style内部链接css
 * @param {Object} cssObj 出入数组需要加入的样式，“类名{}”
 * creator 宁鑫
 * 2017-05-13
 */
DCJC_HTML_FU.styleNX = function(cssObj) {
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
DCJC_HTML_FU.evil = function(fn) {
	var Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
	//20171024 wangfeiyan bug331 start
	//console.log(fn);
	//20171024 wangfeiyan bug331 end
	if(fn.substr(0, 1) == "=") {
		fn = fn.substr(1);
	}
	return new Fn('return ' + fn)();
}

/**
 * 把div插入之后
 * @param {String} newEl
 * @param {String} targetEl
 * @description ==>>newEl:新div  targetEl:想要把新div插入到那个div后面
 */
DCJC_HTML_FU.insertAfter = function(newEl, targetEl) {

	var parentEl = targetEl.parentNode;

	if(parentEl.lastChild == targetEl) {
		parentEl.appendChild(newEl);
	} else {
		parentEl.insertBefore(newEl, targetEl.nextSibling);
	}
}

/**
 *  刷新显示
 * @param {Object} incomingData
 * @description 传入入一个对象==>>flag: 1是显示刷新，0为隐藏掉刷新，createId: 需要刷新的作用域的ID名称 
 */
DCJC_HTML_FU.createCancelPlot = function(incomingData) {
	//function createCancelPlot(incomingData) {
	var childDiv;
	if(incomingData.createId) {
		childDiv = document.getElementById(incomingData.createId).children;
	} else {
		childDiv = document.getElementById("page_subject_div").children;
	}
	
	if(incomingData.flag) {
		for(let i = 0; i < childDiv.length; i++) {
			childDiv[i].classList.add("dis_none");
			childDiv[i].classList.add("z_index_999");
		}
		var plotModel = document.createElement("div"); //.addClass("sk-circle")
		plotModel.classList.add("sk-circle");
		for(let i = 0; i < 12; i++) {
			var temDiv = document.createElement("div");
			temDiv.className = "sk-circle" + i + " sk-child";
			plotModel.appendChild(temDiv);
		}
		if(incomingData.createId) {
			document.getElementById(incomingData.createId).appendChild(plotModel);
		} else {
			document.getElementById("page_subject_div").appendChild(plotModel);
		}
	} else {
		for(let i = 0; i < childDiv.length; i++) {
			childDiv[i].classList.remove("dis_none");
		}
		document.getElementsByClassName("sk-circle")[0].remove();
	}
}

/**
 * 页面头部查询
 * @param {Object} afferentJson
 * @description  传入一个对象==>>addHeadDivId: "想要加入到哪里的div的id名称", modelName: "给要建立的模块建立一个名字", modelContent: (对象{Object})==>> flag: 1为input框，2为select下拉框 ,placeholder:"提示文字，如果是input框",vModel:"v-model",
 * "vChange":"v-on:change",
 * 
 */
DCJC_HTML_FU.createHeadQuery = function(afferentJson) {
	//function createHeadQuery(afferentJson) {
	var modelDiv = document.createElement("div"); //创建模块
	modelDiv.className = "base-line panel-search pad-12 relative clearfix"; //给模块添加class
	modelDiv.id = "page_head_content_id";
	var modelDivName = document.createElement("div"); //创建模块名称的div
	modelDivName.classList.add("line-title"); //给创建模块名称的div添加class
	modelDivName.innerText = afferentJson.modelName; //从外面传入模块名称
	modelDiv.appendChild(modelDivName); //把模块名称添加到模块中
	var queryModelMinDiv = document.createElement("div"); //创建放置搜索框的div
	queryModelMinDiv.className = "pull-left search"; //给放置搜索的div添加class
	var queryModelContentLen = afferentJson.modelContent.length; //一共需要创造的查询条件
	if(queryModelContentLen > 0) {
		//循环创建input元素
		for(let i = 0; i < queryModelContentLen; i++) {
			var temUl = document.createElement("ul");
			//如果有两行，执行添加下列class
			if(i > 2) {
				temUl.classList.add("mar-top-12");
			}
			var temNameLi = document.createElement("li");
			temNameLi.className = "text-right mar-right-4";
			temNameLi.innerText = afferentJson.modelContent[i].queryCaseName; //查询条件名称
			temUl.appendChild(temNameLi);
			var temCaseLi = document.createElement("li");
			//根据条件所需要的创建出input或者select
			if(afferentJson.modelContent[i].flag == 1) { //创建input
				let temInput = document.createElement("input");
				temInput.classList.add("form-control");
				temInput.setAttribute("placeholder", afferentJson.modelContent[i].placeholder); //input框提示
				temInput.setAttribute("v-model", afferentJson.modelContent[i].vModel); //vue的data值（v-model）
				temInput.setAttribute("v-on:change", afferentJson.modelContent[i].vChange); //监听值得变化方法
				temInput.setAttribute("type", "text");
				temInput.setAttribute("autocomplete", "off");
				if(afferentJson.modelContent[i].keyupEnter) { //键的回车键方法
					temInput.setAttribute("v-on:keyup.enter", afferentJson.modelContent[i].keyupEnter);
				}
				if(afferentJson.modelContent[i].readonly) {
					temInput.setAttribute("readonly", afferentJson.modelContent[i].readonly);
					temInput.classList.add("Wdate");
					temInput.classList.add("timeReadonly");
				}
				temCaseLi.appendChild(temInput);
			} else if(afferentJson.modelContent[i].flag == 2) { //创建select
				let temSelect = document.createElement("select");
				temSelect.className = "select form-control";
				temSelect.setAttribute("v-model", afferentJson.modelContent[i].vModel); //vue的data值（v-model）
				if(afferentJson.modelContent[i].vChange) { //监听值得变化方法
					temSelect.setAttribute("v-on:change", afferentJson.modelContent[i].vChange);
				}
				let temOptionDefault = document.createElement("option");
				temOptionDefault.setAttribute("selected", "selected");
				temOptionDefault.setAttribute("value", "");
				temOptionDefault.innerText = "请选择";
				temSelect.appendChild(temOptionDefault);
				let temOptionMainBody = document.createElement("option");
				temOptionMainBody.setAttribute("v-for", "item of " + afferentJson.modelContent[i].vFor); //vue中v-for
				if (afferentJson.modelContent[i].vText) {
					temOptionMainBody.setAttribute("v-text", "item." + afferentJson.modelContent[i].vText);
					temOptionMainBody.setAttribute(":value", "item." + afferentJson.modelContent[i].vValue);
				} else {
					temOptionMainBody.setAttribute("v-text", "item"); //vue的data值（v-text）					
					temOptionMainBody.setAttribute(":value", "item"); //vue的data值（选中的值）
				}
				temSelect.appendChild(temOptionMainBody);
				temCaseLi.appendChild(temSelect);
				
			}
			temUl.appendChild(temCaseLi);
			queryModelMinDiv.appendChild(temUl);
		}
		modelDiv.appendChild(queryModelMinDiv);
		//创建查询和清除按钮
		let modelBtnDiv = document.createElement("div");
		modelBtnDiv.className = "pull-right btn-query-group";
		let modelFindBtn = document.createElement("a");
		modelFindBtn.className = "btn btn-blue wid-100 mar-right-10";
		modelFindBtn.innerText = "查询";
		modelFindBtn.setAttribute("v-on:click", afferentJson.modelFindBtnFu); //vue中methods的按钮点击方法
		modelBtnDiv.appendChild(modelFindBtn);
		let modelResetBtn = document.createElement("a");
		modelResetBtn.className = "btn btn-blue wid-100";
		modelResetBtn.innerText = "重置";
		modelResetBtn.setAttribute("v-on:click", afferentJson.modelResetBtnFu); //vue中methods的按钮点击方法
		modelBtnDiv.appendChild(modelResetBtn);
		modelDiv.appendChild(modelBtnDiv);
	}
	document.getElementById(afferentJson.addHeadDivId).insertBefore(modelDiv, document.getElementById(afferentJson.addHeadDivId).getElementsByTagName("div")[0]); //插入到父元素的第一个位置上
}

/**
 * 页面的主体表格内容
 * @param {Object} afferentJson
 */
DCJC_HTML_FU.pageSubjectTables = function(afferentJson) {
	//function pageSubjectTables(afferentJson) {
	let pageSubjectDiv = document.createElement("div");
	pageSubjectDiv.className = "base-line pad-12 mar-top-12 mar-bottom-12";
	pageSubjectDiv.id = "page_subject_div";

	let pageSubjectBtnDiv = document.createElement("div");
	let pageSubjectBtnContentLen = afferentJson.btnContent.length;
	if(pageSubjectBtnContentLen > 0) {
		for(let i = 0; i < pageSubjectBtnContentLen; i++) {
			let temBtnA = document.createElement("a");
			temBtnA.className = "btn btn-blue max-wid-110 mar-right-10";
			temBtnA.innerText = afferentJson.btnContent[i].btnName;
			temBtnA.setAttribute("v-on:click", afferentJson.btnContent[i].btnFu);
			pageSubjectBtnDiv.appendChild(temBtnA);
		}
		pageSubjectDiv.appendChild(pageSubjectBtnDiv);
	}
	let tableDiv = document.createElement("div"); //放置表格的div
	tableDiv.className = "drop-down div-scroll";
	tableDiv.id = "table_div";
	let tableStyleDiv = document.createElement("table"); //表格table标签
	tableStyleDiv.className = "table table-condensed table-striped table-bordered mar-top-12 text-center";
	tableStyleDiv.id = "dcjc_table_id";
	let tableThead = document.createElement("thead"); //table头部行
	let tableTr = document.createElement("tr");
	let tableTdNameLen = afferentJson.pageSubjectTable.tdTitleName.length;
	for(let i = 0; i < tableTdNameLen; i++) {
		let tableTd = document.createElement("td");
		tableTd.innerText = afferentJson.pageSubjectTable.tdTitleName[i];
		tableTr.appendChild(tableTd);
	}
	tableThead.appendChild(tableTr);
	tableStyleDiv.appendChild(tableThead);
	let tableTbody = document.createElement("tbody"); //表格主体部分
	tableTbody.className = "text-nowrap text-center";
	let tableTrBody = document.createElement("tr");
	//	tableTrBody.setAttribute("v-for", afferentJson.pageSubjectTable.trBodyVforFu);
	tableTrBody.setAttribute("v-for", "(index,item) in " + afferentJson.pageSubjectTable.trBodyVforFu);
	//	let vForContentLen = afferentJson.pageSubjectTable.trBodyVforFu.indexOf(" ");
	//	let vForContent = afferentJson.pageSubjectTable.trBodyVforFu.substring(0, vForContentLen);
	//	let judgeInt = vForContent.indexOf(",");
	//	if (judgeInt > 0) {
	//		let cutString = vForContent.substring(judgeInt+1, vForContent.length-1);
	//		vForContent = cutString;
	//	}
	if(afferentJson.pageSubjectTable.tdTitleName[0] == "操作") { //如果第一列是有操作按钮
		if(afferentJson.pageSubjectTable.vForDotContent) { //当有对应的参数值时
			if(afferentJson.pageSubjectTable.vForDotContent.length === tableTdNameLen - 1) {
				if(afferentJson.pageSubjectTable.tdUpdateDelBtn.tdUpdateFu) {
					var tableTdABodyUpdate = document.createElement("a"); //修改a标签
					tableTdABodyUpdate.className = "glyphicon glyphicon-pencil mar-right-4";
					tableTdABodyUpdate.setAttribute("v-on:click", afferentJson.pageSubjectTable.tdUpdateDelBtn.tdUpdateFu);
				}
				if(afferentJson.pageSubjectTable.tdUpdateDelBtn.tdDelFu) {
					var tableTdABodyDel = document.createElement("a"); //删除a标签
					tableTdABodyDel.className = "glyphicon glyphicon-remove mar-right-4";
					tableTdABodyDel.setAttribute("v-on:click", afferentJson.pageSubjectTable.tdUpdateDelBtn.tdDelFu);
				}
				for(let i = 0; i < tableTdNameLen; i++) {
					let tableTdBody = document.createElement("td");
					if(i == 0) {
						if(afferentJson.pageSubjectTable.tdUpdateDelBtn.tdUpdateFu) {
							tableTdBody.appendChild(tableTdABodyUpdate);
						}
						if(afferentJson.pageSubjectTable.tdUpdateDelBtn.tdDelFu) {
							tableTdBody.appendChild(tableTdABodyDel);
						}
					} else {
						//						tableTdBody.setAttribute("v-text", vForContent + "." + afferentJson.pageSubjectTable.vForDotContent[i - 1]);
						tableTdBody.setAttribute("v-text", "item." + afferentJson.pageSubjectTable.vForDotContent[i - 1]);
					}
					tableTrBody.appendChild(tableTdBody);
				}
			} else {
				console.log("您的vForDotContent元素跟列名不对等-2");
			}

		} else {
			for(let i = 0; i < tableTdNameLen; i++) {
				let tableTdBody = document.createElement("td");
				//				tableTdBody.setAttribute("v-text", vForContent);
				tableTdBody.setAttribute("v-text", "item");
				tableTrBody.appendChild(tableTdBody);
			}
		}

	} else { //没有操作按钮，直接显示表格内容
		if(afferentJson.pageSubjectTable.vForDotContent) { //当有对应的参数值时
			if(afferentJson.pageSubjectTable.vForDotContent.length === tableTdNameLen) {
				for(let i = 0; i < tableTdNameLen; i++) {
					let tableTdBody = document.createElement("td");
					tableTdBody.setAttribute("v-text", vForContent + "." + afferentJson.pageSubjectTable.vForDotContent[i]);
					tableTrBody.appendChild(tableTdBody);
				}
			} else {
				console.log("您的vForDotContent元素跟列名不对等-3");
			}
		} else {
			for(let i = 0; i < tableTdNameLen; i++) {
				let tableTdBody = document.createElement("td");
				tableTdBody.setAttribute("v-text", vForContent);
				tableTrBody.appendChild(tableTdBody);
			}
		}
	}
	tableTbody.appendChild(tableTrBody); //把所有tr添加到tbody标签中
	tableStyleDiv.appendChild(tableTbody); //把tbody添加到table标签中
	tableDiv.appendChild(tableStyleDiv); //把table添加到管理table的div中
	pageSubjectDiv.appendChild(tableDiv); //把管理table的div添加到主体页面中
	//创建管理分页的div
	let managePagingDiv = document.createElement("div");
	managePagingDiv.className = "mar-top-12 clearfix";
	//创建label标签
	let labelDiv = document.createElement("label");
	labelDiv.className = "mar-0";
	let labelString = "当前第<span v-text='" + afferentJson.managePagingContent.currentPage + "'></span>页 / 共<span v-text='" + afferentJson.managePagingContent.awPage + "'></span>页 / 共<span v-text='" + afferentJson.managePagingContent.awRow + "'></span>条数据";
	labelDiv.innerHTML = labelString;
	managePagingDiv.appendChild(labelDiv);
	let pagingUpDownPageDiv = document.createElement("div");
	pagingUpDownPageDiv.className = "pull-right pageCorlor";
	let aTagHome = document.createElement("a");
	aTagHome.className = "mar-right-5";
	aTagHome.href = "javascript:void(0);";
	aTagHome.setAttribute("v-on:click", afferentJson.managePagingContent.homePage);
	aTagHome.innerText = "首页";
	pagingUpDownPageDiv.appendChild(aTagHome);
	let aTagUpPage = document.createElement("a");
	aTagUpPage.className = "mar-right-5";
	aTagUpPage.href = "javascript:void(0);";
	aTagUpPage.setAttribute("v-on:click", afferentJson.managePagingContent.upPage);
	aTagUpPage.innerText = "上一页";
	pagingUpDownPageDiv.appendChild(aTagUpPage);
	let aTagDownPage = document.createElement("a");
	aTagDownPage.className = "mar-right-5";
	aTagDownPage.href = "javascript:void(0);";
	aTagDownPage.setAttribute("v-on:click", afferentJson.managePagingContent.downPage);
	aTagDownPage.innerText = "下一页";
	pagingUpDownPageDiv.appendChild(aTagDownPage);
	let aTagEndPage = document.createElement("a");
	aTagEndPage.className = "mar-right-5";
	aTagEndPage.href = "javascript:void(0);";
	aTagEndPage.setAttribute("v-on:click", afferentJson.managePagingContent.endPage);
	aTagEndPage.innerText = "尾页";
	pagingUpDownPageDiv.appendChild(aTagEndPage);
	let spanTagStr = document.createElement("span");
	spanTagStr.className = "mar-right-5";
	spanTagStr.innerText = "当前";
	pagingUpDownPageDiv.appendChild(spanTagStr);
	let pagingSelectTag = document.createElement("select");
	pagingSelectTag.className = "form-control select wid-50 mar-right-5";
	pagingSelectTag.setAttribute("v-model", afferentJson.managePagingContent.selectContent.selectVmodel);
	pagingSelectTag.setAttribute("v-on:change", afferentJson.managePagingContent.selectContent.selectVonChange);
	let pagingOpton = document.createElement("option");
	pagingOpton.setAttribute("v-for", "(index,item) in " + afferentJson.managePagingContent.selectContent.optionVfor);
	pagingOpton.setAttribute("v-text", "index+1");
	pagingOpton.setAttribute("value", "{{ index+1 }}");
	pagingSelectTag.appendChild(pagingOpton);
	pagingUpDownPageDiv.appendChild(pagingSelectTag);
	let pagingSpanEnd = document.createElement("span");
	pagingSpanEnd.innerText = "页";
	pagingUpDownPageDiv.appendChild(pagingSpanEnd);
	managePagingDiv.appendChild(pagingUpDownPageDiv);
	pageSubjectDiv.appendChild(managePagingDiv);

	DCJC_HTML_FU.insertAfter(pageSubjectDiv, document.getElementById("page_head_content_id"));
}

DCJC_HTML_FU.pageSubjectTablesNew = function(afferentJson) {
	//创建主体div并有边框线
	let pageSubjectDiv = document.createElement("div");
	pageSubjectDiv.className = "base-line pad-12 mar-top-12 mar-bottom-12";
	pageSubjectDiv.id = "page_subject_div";
	//创建设置管理按钮的div
	let pageSubjectBtnDiv = document.createElement("div");
	//要创建几个按钮
	let pageSubjectBtnContentLen = afferentJson.btnContent.length;
	if(pageSubjectBtnContentLen > 0) {
		for(let i = 0; i < pageSubjectBtnContentLen; i++) {
			//创建按钮
			let temBtnA = document.createElement("a");
			temBtnA.className = "btn btn-blue max-wid-110 mar-right-10";
			temBtnA.innerText = afferentJson.btnContent[i].btnName;
			temBtnA.setAttribute("v-on:click", afferentJson.btnContent[i].btnFu);
			//按钮权限管理设置
			if(afferentJson.btnContent[i].btnCif) {
				let tempCifTag = document.createElement("c:if");
				tempCifTag.setAttribute("test", afferentJson.btnContent[i].btnCif);
			} else {
				pageSubjectBtnDiv.appendChild(temBtnA);
			}
		}
		pageSubjectDiv.appendChild(pageSubjectBtnDiv);
	}
	let tableDiv = document.createElement("div"); //放置表格的div
	tableDiv.className = "drop-down div-scroll";
	tableDiv.id = "table_div";
	//创建table标签
	let tableTag = document.createElement("table");
	tableTag.className = "table table-condensed table-striped table-bordered mar-top-12 text-center";
	if(afferentJson.pageSubjectTable.tableTagId) {
		tableTag.id = afferentJson.pageSubjectTable.tableTagId;
	}
	//创建表格头
	let theadTag = document.createElement("thead");
	//创建表格tr
	let theadTrTag = document.createElement("tr");
	//根据列名创建表格头部的td
	for(let i = 0; i < afferentJson.pageSubjectTable.theadTdName.length; i++) {
		let tmpTheadTd = document.createElement("td");
		if(afferentJson.pageSubjectTable.theadTdType) {
			if(i < afferentJson.pageSubjectTable.theadTdType.tdType) {
				if(afferentJson.pageSubjectTable.theadTdType.tdFu) {
					tmpTheadTd.setAttribute("v-if", afferentJson.pageSubjectTable.theadTdType.tdFu[i]);
				}
				tmpTheadTd.innerText = afferentJson.pageSubjectTable.theadTdName[i];
				if(afferentJson.pageSubjectTable.theadTdType.cIfFu) { //如果需要权限限制
					let tmpTheadTdCif = document.createElement("c:if");
					tmpTheadTdCif.setAttribute("test", afferentJson.pageSubjectTable.theadTdType.cIfFu);
					tmpTheadTdCif.appendChild(tmpTheadTd);
					theadTrTag.appendChild(tmpTheadTdCif);
				} else { //没有权限限制				
					theadTrTag.appendChild(tmpTheadTd);
				}
			} else {
				tmpTheadTd.innerText = afferentJson.pageSubjectTable.theadTdName[i];
				theadTrTag.appendChild(tmpTheadTd);
			}
		} else {
			tmpTheadTd.innerText = afferentJson.pageSubjectTable.theadTdName[i];
			theadTrTag.appendChild(tmpTheadTd);
		}
	}
	//把表格头部列名加入到talbe表格thead标签中
	theadTag.appendChild(theadTrTag);
	//把thead标签添加到表格中去
	tableTag.appendChild(theadTag);
	//创建tbody
	let tbodyTag = document.createElement("tbody");
	//创建tbody中的tr
	let tbodyTrTag = document.createElement("tr");
	tbodyTrTag.setAttribute("v-for", "(index,item) in " + afferentJson.pageSubjectTable.tbodyTrVforFu);
	//创建tbody中的td
	for(let i = 0; i < afferentJson.pageSubjectTable.theadTdName.length; i++) {
		let tbodyTdTag = document.createElement("td");
		if(afferentJson.pageSubjectTable.theadTdType) {
			if(i < afferentJson.pageSubjectTable.theadTdType.tdType) {
				tbodyTdTag.setAttribute("v-if", afferentJson.pageSubjectTable.theadTdType.tdFu[i]);
				//修改小笔
				if(afferentJson.pageSubjectTable.theadTdType.updateBtnFu && Number(afferentJson.pageSubjectTable.theadTdType.updateBtnFu.updateTdNub) - 1 == i) {
					let tbodyTdTagAUpdate = document.createElement("a");
					tbodyTdTagAUpdate.className = "glyphicon glyphicon-pencil mar-right-4";
					tbodyTdTagAUpdate.setAttribute("v-on:click", afferentJson.pageSubjectTable.theadTdType.updateBtnFu.updateFu);
					if(afferentJson.pageSubjectTable.theadTdType.updateBtnFu.cIfUpdateFu) {
						let cIfTag = document.createElement("c:if");
						cIfTag.setAttribute("test", afferentJson.pageSubjectTable.theadTdType.updateBtnFu.cIfUpdateFu);
						cIfTag.appendChild(tbodyTdTagAUpdate);
						tbodyTdTag.appendChild(cIfTag);
					} else {
						tbodyTdTag.appendChild(tbodyTdTagAUpdate);
					}
				}
				//删除×
				if(afferentJson.pageSubjectTable.theadTdType.delBtnFu && Number(afferentJson.pageSubjectTable.theadTdType.delBtnFu.delTdNub) - 1 == i) {
					let tbodyTdTagADel = document.createElement("a");
					tbodyTdTagADel.className = "glyphicon glyphicon-remove mar-right-4";
					tbodyTdTagADel.setAttribute("v-on:click", afferentJson.pageSubjectTable.theadTdType.delBtnFu.delFu);
					if(afferentJson.pageSubjectTable.theadTdType.delBtnFu.cIfDelFu) {
						let cIfTag = document.createElement("c:if");
						cIfTag.setAttribute("test", afferentJson.pageSubjectTable.theadTdType.delBtnFu.cIfDelFu);
						cIfTag.appendChild(tbodyTdTagADel);
						tbodyTdTag.appendChild(cIfTag);
					} else {
						tbodyTdTag.appendChild(tbodyTdTagADel);
					}
				}
				//自定义
				if(afferentJson.pageSubjectTable.theadTdType.customATagClassname && Number(afferentJson.pageSubjectTable.theadTdType.customATagClassname.aTagTdNub) - 1 == i) {
					let tbodyTdTagACustom = document.createElement("a");
					tbodyTdTagACustom.className = afferentJson.pageSubjectTable.theadTdType.customATagClassname.aTagClassName;
					tbodyTdTagACustom.setAttribute("v-on:click", afferentJson.pageSubjectTable.theadTdType.customATagClassname.aTagFu);
					if(afferentJson.pageSubjectTable.theadTdType.customATagClassname.cIfCustomFu) {
						let cIfTag = document.createElement("c:if");
						cIfTag.setAttribute("test", afferentJson.pageSubjectTable.theadTdType.customATagClassname.cIfCustomFu);
						cIfTag.appendChild(tbodyTdTagACustom);
						tbodyTdTag.appendChild(cIfTag);
					} else {
						tbodyTdTag.appendChild(tbodyTdTagACustom);
					}
				}

				if(afferentJson.pageSubjectTable.theadTdType.cIfFu) { //如果需要权限限制
					let tmpTheadTdCif = document.createElement("c:if");
					tmpTheadTdCif.setAttribute("test", afferentJson.pageSubjectTable.theadTdType.cIfFu);
					tmpTheadTdCif.appendChild(tbodyTdTag);
					tbodyTrTag.appendChild(tmpTheadTdCif);
				} else { //没有权限限制
					tbodyTrTag.appendChild(tbodyTdTag);
				}

			} else {
				let tbodyTdTag = document.createElement("td");
				if(afferentJson.pageSubjectTable.tdBodyContent) {
					tbodyTdTag.setAttribute("v-text", "item." + afferentJson.pageSubjectTable.tdBodyContent[i - afferentJson.pageSubjectTable.theadTdType.tdType]);
				} else {
					tbodyTdTag.setAttribute("v-text", "item");
				}
				if(afferentJson.pageSubjectTable.tbodyTdVonClickFu) {
					tbodyTdTag.setAttribute("v-on:click", afferentJson.pageSubjectTable.tbodyTdVonClickFu)
				}
				tbodyTrTag.appendChild(tbodyTdTag);
			}
		} else {
			let tbodyTdTag = document.createElement("td");
			if(afferentJson.pageSubjectTable.tdBodyContent) {
				tbodyTdTag.setAttribute("v-text", "item." + afferentJson.pageSubjectTable.tdBodyContent[i - afferentJson.pageSubjectTable.theadTdType.tdType]);
			} else {
				tbodyTdTag.setAttribute("v-text", "item");
			}
			if(afferentJson.tbodyTdVonClickFu) {
				tbodyTdTag.setAttribute("v-on:click", afferentJson.pageSubjectTable.tbodyTdVonClickFu)
			}
			tbodyTrTag.appendChild(tbodyTdTag);
		}
		tbodyTag.appendChild(tbodyTrTag);
	}
	tableTag.appendChild(tbodyTag);
	//把表格添加到表格div中
	tableDiv.appendChild(tableTag);
	//添加到主体页面里
	pageSubjectDiv.appendChild(tableDiv);
	//创建管理分页的div
	let managePagingDiv = document.createElement("div");
	managePagingDiv.className = "mar-top-12 clearfix";
	if (afferentJson.managePagingContent.isShowVif) {
		managePagingDiv.setAttribute("v-if", afferentJson.managePagingContent.isShowVif);
	}
	//创建label标签
	let labelDiv = document.createElement("label");
	labelDiv.className = "mar-0";
	let labelString = "当前第<span v-text='" + afferentJson.managePagingContent.currentPage + "'></span>页 / 共<span v-text='" + afferentJson.managePagingContent.awPage + "'></span>页 / 共<span v-text='" + afferentJson.managePagingContent.awRow + "'></span>条数据";
	labelDiv.innerHTML = labelString;
	managePagingDiv.appendChild(labelDiv);
	let pagingUpDownPageDiv = document.createElement("div");
	pagingUpDownPageDiv.className = "pull-right pageCorlor";
	let aTagHome = document.createElement("a");
	aTagHome.className = "mar-right-5";
	aTagHome.href = "javascript:void(0);";
	aTagHome.setAttribute("v-on:click", afferentJson.managePagingContent.homePage);
	aTagHome.innerText = "首页";
	pagingUpDownPageDiv.appendChild(aTagHome);
	let aTagUpPage = document.createElement("a");
	aTagUpPage.className = "mar-right-5";
	aTagUpPage.href = "javascript:void(0);";
	aTagUpPage.setAttribute("v-on:click", afferentJson.managePagingContent.upPage);
	aTagUpPage.innerText = "上一页";
	pagingUpDownPageDiv.appendChild(aTagUpPage);
	let aTagDownPage = document.createElement("a");
	aTagDownPage.className = "mar-right-5";
	aTagDownPage.href = "javascript:void(0);";
	aTagDownPage.setAttribute("v-on:click", afferentJson.managePagingContent.downPage);
	aTagDownPage.innerText = "下一页";
	pagingUpDownPageDiv.appendChild(aTagDownPage);
	let aTagEndPage = document.createElement("a");
	aTagEndPage.className = "mar-right-5";
	aTagEndPage.href = "javascript:void(0);";
	aTagEndPage.setAttribute("v-on:click", afferentJson.managePagingContent.endPage);
	aTagEndPage.innerText = "尾页";
	pagingUpDownPageDiv.appendChild(aTagEndPage);
	let spanTagStr = document.createElement("span");
	spanTagStr.className = "mar-right-5";
	spanTagStr.innerText = "当前";
	pagingUpDownPageDiv.appendChild(spanTagStr);
	let pagingSelectTag = document.createElement("select");
	pagingSelectTag.className = "form-control select wid-50 mar-right-5";
	pagingSelectTag.setAttribute("v-model", afferentJson.managePagingContent.selectContent.selectVmodel);
	pagingSelectTag.setAttribute("v-on:change", afferentJson.managePagingContent.selectContent.selectVonChange);
	let pagingOpton = document.createElement("option");
	pagingOpton.setAttribute("v-for", "(index,item) in " + afferentJson.managePagingContent.selectContent.optionVfor);
	pagingOpton.setAttribute("v-text", "index+1");
	pagingOpton.setAttribute("value", "{{ index+1 }}");
	pagingSelectTag.appendChild(pagingOpton);
	pagingUpDownPageDiv.appendChild(pagingSelectTag);
	let pagingSpanEnd = document.createElement("span");
	pagingSpanEnd.innerText = "页";
	pagingUpDownPageDiv.appendChild(pagingSpanEnd);
	managePagingDiv.appendChild(pagingUpDownPageDiv);
	pageSubjectDiv.appendChild(managePagingDiv);

	DCJC_HTML_FU.insertAfter(pageSubjectDiv, document.getElementById("page_head_content_id"));

}

/**
 * 模态框方法
 * @param {Object} afferentJson
 */
DCJC_HTML_FU.createModelFrame = function(afferentJson) {
	//function createModelFrame(afferentJson) {
	document.getElementById(afferentJson.insertModelBodyDivId).className = "dis_none";
	//创建form
	let formGlobal = document.createElement("form");
	formGlobal.className = afferentJson.fromClassName;
	//创建最外层的div并赋值属性元素
	let modelDiv = document.createElement("div");
	modelDiv.className = "modal no-top fade bs-example-modal-lg";
	modelDiv.id = afferentJson.modelDivId;
	modelDiv.tabIndex = "-1";
	modelDiv.role = "dialog";
	modelDiv.setAttribute("aria-labelledby", "myLargeModalLabel");
//	if (afferentJson.nestModel) {
//	} else {
//						
//	}
	modelDiv.setAttribute("data-backdrop", "static");

	//创建第二层div
	let modelSecondDiv = document.createElement("div");
	modelSecondDiv.className = "modal-dialog modal-lg";
	if (afferentJson.nestModel) {
		modelSecondDiv.style.top = afferentJson.nestModel.modelTop + "%";
		modelSecondDiv.style.width = afferentJson.nestModel.modelWidth + "%";
	} else {
		modelSecondDiv.style.top = "10%";
		modelSecondDiv.style.width = "30%";
		modelDiv.setAttribute("aria-hidden", "true");
	}
	//创建第三层content内容div
	let modelContentDiv = document.createElement("div");
	modelContentDiv.className = "modal-content";
	//创建头部模态div
	let modelHeadDiv = document.createElement("div");
	modelHeadDiv.className = "modal-header";
	//创建头部×的a标签
	let modelCloseImgATag = document.createElement("a");
	modelCloseImgATag.className = "close";
	modelCloseImgATag.setAttribute("data-dismiss", "modal");
	let modelColseSpanTag = document.createElement("span");
	modelColseSpanTag.setAttribute("aria-hidden", "true");
	modelColseSpanTag.setAttribute("v-on:click", afferentJson.modelHeadContent.colseFu);
	modelColseSpanTag.innerHTML = "&times;";
	modelCloseImgATag.appendChild(modelColseSpanTag);
	let modelColseSpanTwoTag = document.createElement("span");
	modelColseSpanTwoTag.className = "sr-only";
	modelColseSpanTwoTag.innerText = "Close";
	modelCloseImgATag.appendChild(modelColseSpanTwoTag);
	//把删除×添加到头部div中
	modelHeadDiv.appendChild(modelCloseImgATag);
	//创建头部名称
	let modelHeadName = document.createElement("h4");
	modelHeadName.className = "modal-title text-center";
	modelHeadName.innerText = afferentJson.modelHeadContent.headName;
	//把头部名称也就是模态框名称添加到头部div中
	modelHeadDiv.appendChild(modelHeadName);
	//把头部模态div添加到第三层content内容div中
	modelContentDiv.appendChild(modelHeadDiv);
	//模态框body内容
	let modelBodyDiv = document.createElement("div");
	modelBodyDiv.className = "modal-body pad-12";
	modelBodyDiv.id = "model_body_div_id";
	if(afferentJson.insertModelBodyFlag) {
		//创建模态框body下一层的部分，有天蓝边
		let modelBodyNextDiv = document.createElement("div");
		modelBodyNextDiv.className = "bor_sol_1_blue_b4c";
		modelBodyNextDiv.innerHTML = document.getElementById(afferentJson.insertModelBodyDivId).innerHTML;
		modelBodyDiv.appendChild(modelBodyNextDiv);
	} else {
		modelBodyDiv.innerHTML = document.getElementById(afferentJson.insertModelBodyDivId).innerHTML;
	}
	//把model主体加入到model内容中
	modelContentDiv.appendChild(modelBodyDiv);
	//创建model管理按钮div-确定和关闭或者取消
	let modelFootDiv = document.createElement("div");
	modelFootDiv.className = "modal-footer";
	//创建管理按钮div中的确定或保存按钮
	if(afferentJson.modelBtnContent.saveBtn) {
		let modelFootAFagSave = document.createElement("a");
		modelFootAFagSave.className = "btn btn-primary wid-100";
		modelFootAFagSave.innerText = afferentJson.modelBtnContent.saveBtn.saveName;
		if(afferentJson.modelBtnContent.saveBtn.saveFu) {
			modelFootAFagSave.setAttribute("v-on:click", afferentJson.modelBtnContent.saveBtn.saveFu);
		}
		modelFootDiv.appendChild(modelFootAFagSave);
	}
	if(afferentJson.modelBtnContent.cancelBtn) {
		let modelFootAFagCancel = document.createElement("a");
		modelFootAFagCancel.className = "btn btn-default wid-100";
		modelFootAFagCancel.innerText = afferentJson.modelBtnContent.cancelBtn.cancelName;
		if(afferentJson.modelBtnContent.cancelBtn.cancelFu) {
			modelFootAFagCancel.setAttribute("v-on:click", afferentJson.modelBtnContent.cancelBtn.cancelFu);
		}
		modelFootAFagCancel.setAttribute("data-dismiss", "modal");
		modelFootDiv.appendChild(modelFootAFagCancel);
	}
	//把底部按钮div加入到第三层content内容中
	modelContentDiv.appendChild(modelFootDiv);
	//把第三层content内容添加到第二层div中
	modelSecondDiv.appendChild(modelContentDiv);
	//把第二层div加入到最外层div里
	modelDiv.appendChild(modelSecondDiv);
	//把最外层div加入到form里
	formGlobal.appendChild(modelDiv);
	document.getElementById(afferentJson.addModelDivId).appendChild(formGlobal);
	if(afferentJson.nestModel) {
		
	}

}

/**
 * 创建表格
 * @param {Object} afferentJson
 * @description  
 */
DCJC_HTML_FU.createTableFu = function(afferentJson) {

	//创建table表格
	let tableTag = document.createElement("table");
	tableTag.className = "table table-condensed table-striped table-bordered mar-top-12 text-center";
	if(afferentJson.tableTagId) {
		tableTag.id = afferentJson.tableTagId;
	}
	//创建表格头
	let theadTag = document.createElement("thead");
	//创建表格tr
	let theadTrTag = document.createElement("tr");
	//根据列名创建表格头部的td
	for(let i = 0; i < afferentJson.theadTdName.length; i++) {
		let tmpTheadTd = document.createElement("td");
		if(afferentJson.theadTdType) {
			if(i < afferentJson.theadTdType.tdType) {
				tmpTheadTd.setAttribute("v-if", afferentJson.theadTdType.tdFu[i]);
				tmpTheadTd.innerText = afferentJson.theadTdName[i];
				if(afferentJson.theadTdType.cIfFu) { //如果需要权限限制
					let tmpTheadTdCif = document.createElement("c:if");
					tmpTheadTdCif.setAttribute("test", afferentJson.theadTdType.cIfFu);
					tmpTheadTdCif.appendChild(tmpTheadTd);
					theadTrTag.appendChild(tmpTheadTdCif);
				} else { //没有权限限制				
					theadTrTag.appendChild(tmpTheadTd);
				}
			} else {
				tmpTheadTd.innerText = afferentJson.theadTdName[i];
				theadTrTag.appendChild(tmpTheadTd);
			}
		} else {
			tmpTheadTd.innerText = afferentJson.theadTdName[i];
			theadTrTag.appendChild(tmpTheadTd);
		}
	}
	//把表格头部列名加入到talbe表格thead标签中
	theadTag.appendChild(theadTrTag);
	//把thead标签添加到表格中去
	tableTag.appendChild(theadTag);
	//创建tbody
	let tbodyTag = document.createElement("tbody");
	//创建tbody中的tr
	let tbodyTrTag = document.createElement("tr");
	tbodyTrTag.setAttribute("v-for", "(index,item) in " + afferentJson.tbodyTrVforFu);
	//创建tbody中的td
	for(let i = 0; i < afferentJson.theadTdName.length; i++) {
		let tbodyTdTag = document.createElement("td");
		if(afferentJson.theadTdType) {
			if(i < afferentJson.theadTdType.tdType) {
				tbodyTdTag.setAttribute("v-if", afferentJson.theadTdType.tdFu[i]);
				//修改小笔
				if(afferentJson.theadTdType.updateBtnFu && Number(afferentJson.theadTdType.updateBtnFu.updateTdNub) - 1 == i) {
					let tbodyTdTagAUpdate = document.createElement("a");
					tbodyTdTagAUpdate.className = "glyphicon glyphicon-pencil mar-right-4";
					tbodyTdTagAUpdate.setAttribute("v-on:click", afferentJson.theadTdType.updateBtnFu.updateFu);
					if(afferentJson.theadTdType.updateBtnFu.cIfUpdateFu) {
						let cIfTag = document.createElement("c:if");
						cIfTag.setAttribute("test", afferentJson.theadTdType.updateBtnFu.cIfUpdateFu);
						cIfTag.appendChild(tbodyTdTagAUpdate);
						tbodyTdTag.appendChild(cIfTag);
					} else {
						tbodyTdTag.appendChild(tbodyTdTagAUpdate);
					}
				}
				//删除×
				if(afferentJson.theadTdType.delBtnFu && Number(afferentJson.theadTdType.delBtnFu.delTdNub) - 1 == i) {
					let tbodyTdTagADel = document.createElement("a");
					tbodyTdTagADel.className = "glyphicon glyphicon-remove mar-right-4";
					tbodyTdTagADel.setAttribute("v-on:click", afferentJson.theadTdType.delBtnFu.delFu);
					if(afferentJson.theadTdType.delBtnFu.cIfDelFu) {
						let cIfTag = document.createElement("c:if");
						cIfTag.setAttribute("test", afferentJson.theadTdType.delBtnFu.cIfDelFu);
						cIfTag.appendChild(tbodyTdTagADel);
						tbodyTdTag.appendChild(cIfTag);
					} else {
						tbodyTdTag.appendChild(tbodyTdTagADel);
					}
				}
				//自定义
				if(afferentJson.theadTdType.customATagClassname && Number(afferentJson.theadTdType.customATagClassname.aTagTdNub) - 1 == i) {
					let tbodyTdTagACustom = document.createElement("a");
					tbodyTdTagACustom.className = afferentJson.theadTdType.customATagClassname.aTagClassName;
					tbodyTdTagACustom.setAttribute("v-on:click", afferentJson.theadTdType.customATagClassname.aTagFu);
					if(afferentJson.theadTdType.customATagClassname.cIfCustomFu) {
						let cIfTag = document.createElement("c:if");
						cIfTag.setAttribute("test", afferentJson.theadTdType.customATagClassname.cIfCustomFu);
						cIfTag.appendChild(tbodyTdTagACustom);
						tbodyTdTag.appendChild(cIfTag);
					} else {
						tbodyTdTag.appendChild(tbodyTdTagACustom);
					}
				}

				if(afferentJson.theadTdType.cIfFu) { //如果需要权限限制
					let tmpTheadTdCif = document.createElement("c:if");
					tmpTheadTdCif.setAttribute("test", afferentJson.theadTdType.cIfFu);
					tmpTheadTdCif.appendChild(tbodyTdTag);
					tbodyTrTag.appendChild(tmpTheadTdCif);
				} else { //没有权限限制
					tbodyTrTag.appendChild(tbodyTdTag);
				}

			} else {
				let tbodyTdTag = document.createElement("td");
				if(afferentJson.tdBodyContent) {
					tbodyTdTag.setAttribute("v-text", "item." + afferentJson.tdBodyContent[i - afferentJson.theadTdType.tdType]);
				} else {
					tbodyTdTag.setAttribute("v-text", "item");
				}
				if(afferentJson.tbodyTdVonClickFu) {
					tbodyTdTag.setAttribute("v-on:click", afferentJson.tbodyTdVonClickFu)
				}
				tbodyTrTag.appendChild(tbodyTdTag);
			}
		} else {
			let tbodyTdTag = document.createElement("td");
			if(afferentJson.tdBodyContent) {
				tbodyTdTag.setAttribute("v-text", "item." + afferentJson.tdBodyContent[i - afferentJson.theadTdType.tdType]);
			} else {
				tbodyTdTag.setAttribute("v-text", "item");
			}
			if(afferentJson.tbodyTdVonClickFu) {
				tbodyTdTag.setAttribute("v-on:click", afferentJson.tbodyTdVonClickFu)
			}
			tbodyTrTag.appendChild(tbodyTdTag);
		}
		tbodyTag.appendChild(tbodyTrTag);
	}
	tableTag.appendChild(tbodyTag);
	DCJC_HTML_FU.insertAfter(tableTag, document.getElementById(afferentJson.insertDivAfterId));
}

/**
 * 操作提示框
 * @param {Object} alertJson
 * @description {Object} ==>>"titles":"提示框名称", "content": "提示框要提示的内容", "btnLeft": "左边按钮名称", "btnRight": "右边按钮名称", "confirm": function() "左边按钮方法", "cancel": function() "右边按钮方法"
 */
DCJC_HTML_FU.pcAlert = function(alertJson) {
	var overall = document.createElement("div"), //模态框div--有内容的框架
		titleDiv = document.createElement("div"), //标题栏div
		modalDialog = document.createElement("div"), //模态框黑色div
		content = document.createElement("p"), //模态框内容
		body = document.getElementsByTagName("body")[0],
		btnDiv = document.createElement("div"), //按钮部分的div
		btnLeft = document.createElement("div"), //确定按钮div
		btnRight = document.createElement("div"), //取消按钮div
		textNode = document.createTextNode(alertJson.content ? alertJson.content : "确定删除吗？"), //映射内容
		title = document.createTextNode(alertJson.titles ? alertJson.titles : "操作提示："), //映射标题
		btnConfirm = document.createTextNode(alertJson.btnLeft ? alertJson.btnLeft : "确定"), //左边按钮内容
		btnAbolish = document.createTextNode(alertJson.btnRight ? alertJson.btnRight : "取消"); //右边按钮内容

	/*----控制样式----*/
	//黑色遮罩样式
	DCJC_HTML_FU.cssNX(modalDialog, {
		"position": "fixed",
		"left": "0",
		"right": "0",
		"top": "0",
		"bottom": "0",
		"background": "#000000",
		"overflow": "hidden",
		"filter": "alpha(opacity=50)",
		"-moz-opacity": "0.5",
		"-khtml-opacity": "0.5",
		"opacity": "0.5",
	});
	//模态框样式
	DCJC_HTML_FU.cssNX(overall, {
		"position": "fixed",
		"left": "0",
		"right": "0",
		"top": "28%",
		"width": "16%",
		"border-radius": "6px",
		"margin": "0 auto",
		"background-color": "#FFFFFF",
		"font-size": "16px",
		"box-shadow": "0 5px 15px rgba(0,0,0,.5)",
		"z-index": "9999",
		"transition": "transform 3s ease-out",
	});
	//模态框标题栏样式
	DCJC_HTML_FU.cssNX(titleDiv, {
		"color": "#000",
		"font-family": "inherit",
		"padding": "10px",
		"font-size": "14px",
		"border-bottom": "1px solid #e5e5e5",
		"text-align": "left",
		"letter-spacing": "2px",
	});
	//模态框内容样式
	DCJC_HTML_FU.cssNX(content, {
		"text-align": "center",
		"letter-spacing": "2px",
		"padding": "30px",
		"font-family": "inherit",
		"font-size": "18px",
		"margin": "0px",
		"line-height": 1.1,
    	"color": "inherit",
	});
	//模态框按钮样式
	DCJC_HTML_FU.cssNX(btnDiv, {
		"display": "flex",
		"border-top": "1px solid #e5e5e5",
		"border-radius": "10px",
		"padding": "15px",
		"justify-content": "center",
	});
	//模态框左边按钮样式
	DCJC_HTML_FU.cssNX(btnLeft, {
		"width": "120px",
		"background-color": "#337ab7",
		"border": "1px solid #2e6da4",
		"color": "#FFFFFF",
		"cursor": "pointer",
		"padding": "6px 12px",
		"border-radius": "4px",
		"text-align": "center",
		"margin-left": "5px",
		"font-size": "14px",
		"font-weight": "400",
		"line-height": "1.42857143",
		"white-space": "nowrap",
		"vertical-align": "middle",
	});
	//模态框右边按钮样式
	DCJC_HTML_FU.cssNX(btnRight, {
		"width": "120px",
		"background-color": "#FFFFFF",
		"border": "1px solid #CCCCCC",
		"cursor": "pointer",
		"padding": "6px 12px",
		"border-radius": "4px",
		"text-align": "center",
		"margin-left": "25px",
		"font-size": "14px",
		"font-weight": "400",
		"line-height": "1.42857143",
		"white-space": "nowrap",
		"vertical-align": "middle",
	});
	//当鼠标在左边按钮上时样式变化
	btnLeft.onmouseover = function() {
		btnLeft.style.backgroundColor = "#204d74";
		btnLeft.style.border = "1px solid #122b40";
	}
	//当鼠标移出左边按钮时样式变化
	btnLeft.onmouseout = function() {
		btnLeft.style.backgroundColor = "#337ab7";
		btnLeft.style.border = "1px solid #2e6da4";
	}
	//当鼠标在右边按钮上时样式变化
	btnRight.onmouseover = function() {
		btnRight.style.backgroundColor = "#F9F8ED";
		btnLeft.style.border = "1px solid #F9F8ED";
	}
	//当鼠标在右边按钮上时样式变化
	btnRight.onmouseout = function() {
		btnRight.style.backgroundColor = "#FFFFFF";
		btnLeft.style.border = "1px solid #CCCCCC";

	}
	// 内部结构套入
	titleDiv.appendChild(title); //把设置的标题加入到模态框标题栏中
	content.appendChild(textNode); //把设置的内容加入到模态框内容中
	btnLeft.appendChild(btnConfirm); //把设置的左边按钮内容加入到按钮中
	btnRight.appendChild(btnAbolish); //把设置的右边按钮内容加入到按钮中
	body.appendChild(modalDialog); //把遮罩层加入到body中
	overall.appendChild(titleDiv); //把标题栏加入到模态框中
	overall.appendChild(content); //把内容加入到模态框中
	overall.appendChild(btnDiv); //把按钮布局加入到模态框中
	btnDiv.appendChild(btnLeft); //把左边按钮加入到按钮布局中
	btnDiv.appendChild(btnRight); //把右边按钮加入到按钮布局中
	// 整体显示到页面内
	document.getElementsByTagName("body")[0].appendChild(overall);
	//确定后执行下面方法
	btnLeft.onclick = function() {
		modalDialog.parentNode.removeChild(modalDialog);
		overall.parentNode.removeChild(overall);
		if(alertJson.confirm && typeof alertJson.confirm == "function") {
			alertJson.confirm(true);
		}
	}
	//取消绑定点击事件删除标签
	btnRight.onclick = function() {
		modalDialog.parentNode.removeChild(modalDialog);
		overall.parentNode.removeChild(overall);
		if(alertJson.cancel && typeof alertJson.cancel == "function") {
			alertJson.cancel(false);
		}
	}
}

/**
 * 成功模态框
 */
DCJC_HTML_FU.pcAlertSucceed = function(alertJson) {
	var overall = document.createElement("div"), //模态框div--有内容的框架
		modalDialog = document.createElement("div"), //模态框黑色div
		content = document.createElement("h3"), //模态框内容
		body = document.getElementsByTagName("body")[0],
		textNode = document.createTextNode(alertJson.content); //映射内容

	/*----控制样式----*/
	//黑色遮罩样式
	DCJC_HTML_FU.cssNX(modalDialog, {
		"position": "fixed",
		"left": "0",
		"right": "0",
		"top": "0",
		"bottom": "0",
		"background": "#000000",
		"overflow": "hidden",
		"filter": "alpha(opacity=50)",
		"-moz-opacity": "0.5",
		"-khtml-opacity": "0.5",
		"opacity": "0.5",
	});
	//模态框样式
	DCJC_HTML_FU.cssNX(overall, {
		"position": "fixed",
		"left": "0",
		"right": "0",
		"top": "28%",
		"width": "300px",
		"border-radius": "6px",
		"margin": "0 auto",
		"background-color": "#FFFFFF",
		"font-size": "16px",
		"box-shadow": "0 5px 15px rgba(0,0,0,.5)",
		"z-index": "9999",
		"transition": "transform 3s ease-out",
	});
	
	//模态框内容样式
	DCJC_HTML_FU.cssNX(content, {
		"text-align": "center",
		"letter-spacing": "1px",
		"padding": "30px",
		"font-family": "inherit",
		"font-size": "18px",
		"margin": "0px",
		"line-height": 1.1,
		"color": "#7f7f7f",
	    "font-weight": "normal",
	});
	content.appendChild(textNode); //把设置的内容加入到模态框内容中
	body.appendChild(modalDialog); //把遮罩层加入到body中
	overall.appendChild(content); //把内容加入到模态框中
	// 整体显示到页面内
	document.getElementsByTagName("body")[0].appendChild(overall);
	setTimeout(function(){
		modalDialog.parentNode.removeChild(modalDialog);
		overall.parentNode.removeChild(overall);
	}, alertJson.showTime ? alertJson.showTime : 2000);
}