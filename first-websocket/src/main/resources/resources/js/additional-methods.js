//0和非0开头的整数
jQuery.validator.addMethod("diyTrim", function(value, element, param) {
	//	console.log("value:"+value);
	//	console.log("之后:"+value.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, ''));
	return this.optional(element) || value.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
}, "A method about replacing space");

//0和非0开头的整数
jQuery.validator.addMethod("positiveInt", function(value, element) {
	return this.optional(element) || /^(0|[1-9][0-9]*)$/.test(value);
}, "Positive Integer only please");
//非0的正整数-why
jQuery.validator.addMethod("noZeroNum", function(value, element) {
	return this.optional(element) || /^[1-9]\d*$/.test(value);
}, "Positive Integer only please");
//非零开头的最多带两位小数的数字
jQuery.validator.addMethod("priceNorm", function(value, element) {
	return this.optional(element) || /^([1-9][0-9]*)+(.[0-9]{1,4})?$/i.test(value);
}, "Nonzero at the beginning of most number with two decimal places");
//百分比
jQuery.validator.addMethod("percent", function(value, element) {
	//	return this.optional(element) ||  /^\S{1,99}$/i.test(value);
	return this.optional(element) || /^[0-9]((?=\d)\d)?(\.[\d]{0,1})?$/.test(value);
}, "Cannot over 99");
//手机号
jQuery.validator.addMethod("phoneNum", function(value, element) {
	return this.optional(element) || /^1[34578]\d{9}$/.test(value);
}, "Invalid phone number");
//只允许字母和符号
jQuery.validator.addMethod("letterswithbasicpunc", function(value, element) {
	return this.optional(element) || /^[a-z-.,()'\"\s]+$/i.test(value);
}, "Letters or punctuation only please");
//字母、数字、空格或下划线
jQuery.validator.addMethod("alphanumeric", function(value, element) {
	return this.optional(element) || /^\w+$/i.test(value);
}, "Letters, numbers, spaces or underscores only please");
//字母、数字下划线
jQuery.validator.addMethod("pwd", function(value, element) {
	return this.optional(element) || /^[\@A-Za-z0-9\_]{6,24}$/i.test(value);
}, "格式错误");
////允许 汉字+字母+特殊符号
//jQuery.validator.addMethod("test", function(value, element) {
//	return this.optional(element) || /^(?![0-9]+$)[\u4E00-\u9FA5-.-0-9A-Za-z]|[0-9A-Za-z-.]{1,30}$/.test(value);
//}, "Letters, numbers only please");

//不能纯数字
jQuery.validator.addMethod("allnumber", function(value, element) {
	return this.optional(element) || /^.*[^\d].*$/i.test(value);
}, "Cannot input numbers only");
////不能全角
//jQuery.validator.addMethod", function(value, element) {
//	return this.optional(element) ||("icon /[^\uFF00-\uFFFF]/i.test(value);
//}, "Cannot input numbers only");
//只允许字母
jQuery.validator.addMethod("lettersonly", function(value, element) {
	return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please");
//车牌号
jQuery.validator.addMethod("carNum", function(value, element) {
	return this.optional(element) || /^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]{5}$/i.test(value);
}, "Format your car number");
//非空
jQuery.validator.addMethod("basicValid", function(value, element) {
	var check = false;
	if(/[\s*]/g.test(value)) {
		check = false;
	} else {
		check = true;
	}
	return this.optional(element) || check;
}, "Please remove space");
//身份证号判断
jQuery.validator.addMethod("IDCard", function(value, element) {
	var check;
	var length = value.length;
	var isIDCard1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
	var isIDCard2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
	if(length == 15) {
		check = isIDCard1.test(value);
	} else if(length == 18) {
		check = isIDCard2.test(value);
	} else {
		check = false;
	}
	return this.optional(element) || check;
}, "Please remove space");
//身份证号判断
jQuery.validator.addMethod("IDCardNum", function(value, element) {
	return this.optional(element) || isIdCardNo(value);
}, "格式错误");
//增加身份证验证
//增加身份证验证 杨红  start
/*20171106 1.0优化标准-30 杨红 */
function isIdCardNo(num) {
    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    var varArray = new Array();
    var intValue;
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;
    // initialize
    if ((intStrLen != 15) && (intStrLen != 18)) {
        return false;
    }
    // check and set value
    for (i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }

    if (intStrLen == 18) {
        //check date
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
            return false;
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
            return false;
        }
    }
    else {        //length is 15
        //check date
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
            return false;
        }
    }
    return true;
}
function isDate6(sDate) {
    if (!/^[0-9]{6}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    if (year < 1700 || year > 2500) return false
    if (month < 1 || month > 12) return false
    return true
}

function isDate8(sDate) {
    if (!/^[0-9]{8}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year < 1700 || year > 2500) return false
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
    if (month < 1 || month > 12) return false
    if (day < 1 || day > iaMonthDays[month - 1]) return false
    return true
}
//增加身份证验证 杨红  end
//是否是数字
jQuery.validator.addMethod("isNum", function(value, element) {
	var num = /^([1-9]\d|\d)$/;
	return this.optional(element) || (num.test(value));
}, "Please write num");
//最多有两位小数的三位正整数
jQuery.validator.addMethod("charnum", function(value, element) {
	var num = /^[0-9]+(.[0-9]{0,2})?$/;
	var flag=false;
	//20170630 wanghy bug-386 start
//	if(value) {
		if(value < 1000 && num.test(value) && value>0) {
			flag=true;
		} else {
			flag=false;
		}
//	} else {
//		flag=true;
//	}
	//20170630 wanghy bug-386 end
	return this.optional(element) || flag;
}, "Please write charnum");
jQuery.validator.addMethod("charnums", function(value, element) {
	return this.optional(element) || /^[0-9]+(.[0-9]{0,2})?$/.test(value) && value < 1000;
}, "Positive Integer only please");
//最多有两位小数的四位正整数
jQuery.validator.addMethod("TwoNumTwoChar", function(value, element) {
	var num = /^[0-9]+(.[0-9]{0,2})?$/;
	var flag;
	if(value < 100 && num.test(value)) {
		flag = true;
	} else {
		flag = false;
	}
	return this.optional(element) || flag;
}, "Please write charnum");
//最多有两位小数的五位正整数
jQuery.validator.addMethod("FiveNumTwoChar", function(value, element) {
	var num = /^[0-9]+(.[0-9]{0,2})?$/;
	var flag;
	if(value < 100000 && num.test(value)) {
		flag = true;
	} else {
		flag = false;
	}
	return this.optional(element) || flag;
}, "Please write charnum");
jQuery.validator.addMethod("charnums", function(value, element) {
	return this.optional(element) || /^[0-9]+(.[0-9]{0,2})?$/.test(value) && value < 1000;
}, "Positive Integer only please");

//最多有一位小数的五位正整数
jQuery.validator.addMethod("FiveNumOneChar", function(value, element) {
	var num = /^(0|[1-9][0-9]*)+(.[0-9]{0,1})?$/;
	var flag;
	if(value < 100000 && num.test(value)) {
		flag = true;
	} else {
		flag = false;
	}
	return this.optional(element) || flag;
}, "Please write charnum");
//最多有一位小数的三位正整数
jQuery.validator.addMethod("ThreeNumOneChar", function(value, element) {
	var num = /^(0|[1-9][0-9]*)+(.[0-9]{0,1})?$/;
	var flag;
	if(value < 1000 && num.test(value)) {
		flag = true;
	} else {
		flag = false;
	}
	return this.optional(element) || flag;
}, "Please write charnum");
//三位正整数-仓位
jQuery.validator.addMethod("MaxThree", function(value, element) {
	var num = /^(0|[1-9][0-9]*)$/;
	var flag;
	if(value < 1000 && num.test(value) && value > 0) {
		flag = true;
	} else {
		flag = false;
	}
	return this.optional(element) || flag;
}, "Please write charnum");
//结束时间不能早于开始时间
jQuery.validator.addMethod("dateCheck", function() {
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	if(startTime.length > 0 && endTime.length > 0) {
		/*var startTmp = startTime.split("-");
		var endTmp = endTime.split("-");
		var sd = new Date(startTmp[0], startTmp[1], startTmp[2]);
		if(endTmp[2] == 31) {
			endTmp[2] = 30;
		}
		var ed = new Date(endTmp[0], endTmp[1], endTmp[2]);*/
        var sd = new Date(startTime);
        var ed = new Date(endTime);
        // 20180322 wanghy 开始时间如果等于结束时间也是通过的 start
		if(sd.getTime() > ed.getTime()) {
            // 20180322 wanghy 开始时间如果等于结束时间也是通过的 end
			return false;
		} else {
			return true;
		}
	//20171016 wanghy 修改时间实时验证 start
	}else{
	    return true;
	}
	//20171016 wanghy 修改时间实时验证 end
}, "Please write endTime after startTime");
//修改结束时间不能早于开始时间
jQuery.validator.addMethod("updateCheck", function() {
	var startTime = $("#startTimeUp").val();
	var endTime = $("#endTimeUp").val();
	if(startTime.length > 0 && endTime.length > 0) {
/*		var startTmp = startTime.split("-");
		var endTmp = endTime.split("-");
		var sd = new Date(startTmp[0], startTmp[1], startTmp[2]);
		if(endTmp[2] == 31) {
			endTmp[2] = 30;
		}
		var ed = new Date(endTmp[0], endTmp[1], endTmp[2]);*/
        var sd = new Date(startTime);
        var ed = new Date(endTime);
		if(sd.getTime() > ed.getTime()) {
			return false;
		} else {
			return true;
		}
	}
}, "Please write startTime");
//20170811 wanghy 修改计划完成时间验证机制 start
//添加结束时间不能早于开始时间(带小时分钟)-why
jQuery.validator.addMethod("addCheckTime", function(value, element) {
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	var flag = true;
	if(startTime && endTime) {
		/*var startTmp = startTime.split("-");
		var startTmp2 = startTmp[2].split(" ");
		var startTmp3 = startTmp2[1].split(":");
		var endTmp = endTime.split("-");
		var endTmp2 = endTmp[2].split(" ");
		var endTmp3 = endTmp2[1].split(":");
		var sd = new Date(startTmp[0], startTmp[1], startTmp2[0], startTmp3[0], startTmp3[1]);
		if(endTmp2[0] == 31) {
			endTmp2[0] = 30;
		}
		var ed = new Date(endTmp[0], endTmp[1], endTmp2[0], endTmp3[0], endTmp3[1]);*/
    var sd = new Date(startTime);
    var ed = new Date(endTime);
		if(sd.getTime() > ed.getTime()) {
			flag = false;
		} else {
			flag = true;
		}
	}
	return this.optional(element) || flag;
}, "Please write startTime");
//修改结束时间不能早于开始时间(带小时分钟)-why
jQuery.validator.addMethod("updateCheckTime", function(value, element) {
	var startTime = $("#startTimeup").val();
	var endTime = $("#endTimeup").val();
	var flag = true;
	if(startTime && endTime) {
		/*var startTmp = startTime.split("-");
		var startTmp2 = startTmp[2].split(" ");
		var startTmp3 = startTmp2[1].split(":");
		var endTmp = endTime.split("-");
		var endTmp2 = endTmp[2].split(" ");
		var endTmp3 = endTmp2[1].split(":");
		if(endTmp2[0] == 31) {
			endTmp2[0] = 30;
		}
		var sd = new Date(startTmp[0], startTmp[1], startTmp2[0], startTmp3[0], startTmp3[1]);
		var ed = new Date(endTmp[0], endTmp[1], endTmp2[0], endTmp3[0], endTmp3[1]);*/
        var sd = new Date(startTime);
        var ed = new Date(endTime);
		if(sd.getTime() > ed.getTime()) {
			flag = false;
		} else {
			flag = true;
		}
	}
	return this.optional(element) || flag;
}, "Please write startTime");
//20170811 wanghy 修改计划完成时间验证机制 end
//开始时间>=当前时间-nx
jQuery.validator.addMethod("dateContrastes", function() {
	var startTime = $("#startTime").val();
	var nowTime = getNowFormatDate();
	if(startTime.length > 0) {
	/*	var startTmp = startTime.split("-");
		var nowTmp = nowTime.split("-");
		var sd = new Date(startTmp[0], startTmp[1], startTmp[2]);
		if(nowTmp[2] == 31) {
			nowTmp[2] = 30;
		}
		var now = new Date(nowTmp[0], nowTmp[1], nowTmp[2]);*/
        var sd = new Date(startTime);
        var now = new Date(nowTime);
		if(sd.getTime() < now.getTime()) {
			return false;
		} else {
			return true;
		}
	}
}, "Please write startTime after nowTime");
//结束时间>=当前时间-why
jQuery.validator.addMethod("dateContrastesEnd", function() {
	var endTime = $("#endTime").val();
	var nowTime = getNowDate();
	if(endTime.length > 0) {
/*		var endTmp = endTime.split("-");
		var nowTmp = nowTime.split("-");
		var sd = new Date(endTmp[0], endTmp[1], endTmp[2]);
		if(nowTmp[2] == 31) {
			nowTmp[2] = 30;
		}
		var now = new Date(nowTmp[0], nowTmp[1], nowTmp[2]);*/
        var sd = new Date(startTime);
        var now = new Date(nowTime);
		if(sd.getTime() < now.getTime()) {
			return false;
		} else {
			return true;
		}
	}
}, "Please write endTime after nowTime");
//结束时间是否是原先时间
jQuery.validator.addMethod("dateContrasteNew", function() {
	var newTime = $("#endTimeUp").val();
	var oldTime = $("#endTimeUp").attr("ephemeral");
	if(newTime.length > 0 && oldTime.length > 0) {

        var sd = new Date(newTime);
        var ed = new Date(oldTime);
		if(sd.getTime() < ed.getTime()) {
			return false;
		} else {
			return true;
		}
	}

}, "Please write endTime after startTime");

//当前时间yyyy-MM-dd    -nx
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var strMonth = date.getMonth() + 1;
	var strDate = date.getDate();
	if(strMonth >= 1 && strMonth <= 9) {
		strMonth = "0" + strMonth;
	}
	if(strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + strMonth + seperator1 + strDate;
	return currentdate;
}
//获取当前时间yyyy-MM-dd    -why
function getNowDate() {
	var day = new Date();
	var CurrentDate = "";
	var Year = day.getFullYear();
	var Month = day.getMonth() + 1;
	var Day = day.getDate();
	CurrentDate += Year + "-";
	if(Month >= 10) {
		CurrentDate += Month + "-";
	} else {
		CurrentDate += "0" + Month + "-";
	}
	if(Day >= 10) {
		CurrentDate += Day;
	} else {
		CurrentDate += "0" + Day;
	}
	return CurrentDate;
}

jQuery.validator.addMethod("remoteusermanger", function(value, element) {
	var oWebPath = glObj.oWebPath;
	var checkTF;
	$.ajax({
		type: "post",
		url: glObj.oWebPath + '/users/selectName',
		async: false,
		dataType: "json",
		data: {
			username: value,
		},
		success: function(data) {
			checkTF = data;
		}
	});
	return checkTF;
}, "Positive Integer only please");
//仓位 根据仓位名称查询条数，做唯一验证
jQuery.validator.addMethod("findCountByLacationName", function(value, element) {
	var oWebPath = glObj.oWebPath;
	var checkTF;
	$.ajax({
		type: "post",
		url: glObj.oWebPath + '/locationinfo/findCountByLacationName',
		async: false,
		dataType: "json",
		data: {
			locationName: value,
		},
		success: function(data) {
			checkTF = data;
		}
	});
	return checkTF;
}, "Positive Integer only please");
//驾驶证失效日期不能早于驾驶证签发日期-why
jQuery.validator.addMethod("driverEndTime", function(value, element) {
	var flag;
	var startTime = $(element).parents(".credentials").find("input[name='driverStartTime']").val();
	var endTime = value;
	if(startTime && endTime) {
		//
        var sd = new Date(startTime);
        var ed = new Date(endTime);
		if(sd.getTime() > ed.getTime()) {
			flag = false;
		} else {
			flag = true;
		}
	}
	return this.optional(element) || flag;
}, "Please write startTime");

//资格证失效日期不能早于资格证签发日期-why
jQuery.validator.addMethod("certifiedEndTime", function(value, element) {
	var flag;
	var startTime = $(element).parents(".credentials").find("input[name='certifiedStartTime']").val();
	var endTime = value;
	if(startTime && endTime) {
		// var startTmp = startTime.split("-");
		// var endTmp = endTime.split("-");
		// var sd = new Date(startTmp[0], startTmp[1], startTmp[2]);
		// if(endTmp[2] == 31) {
		// 	endTmp[2] = 30;
		// }
		// var ed = new Date(endTmp[0], endTmp[1], endTmp[2]);
        var sd = new Date(startTime);
        var ed = new Date(endTime);
		if(sd.getTime() > ed.getTime()) {
			flag = false;
		} else {
			flag = true;
		}
	}
	return this.optional(element) || flag;
}, "Please write startTime");

//联系方式11位纯数字-why
jQuery.validator.addMethod("telNum", function(value, element) {
	var flag;
	var temp = /^(0|[1-9][0-9]*)$/.test(value);
	if(temp && value.length == 11) {
		flag = true;
	} else {
		flag = false;
	}
	return this.optional(element) || flag;
}, "格式错误");
//手机号码格式验证
jQuery.validator.addMethod("phoneNumber", function(value, element) {
	// 20171120 dongyunlong 1.0优化 start
	return this.optional(element) || /^1[34578]\d{9}$/.test(value);
	// 20171120 dongyunlong 1.0优化 end
	}, "格式错误");
//驾驶证编号12位纯数字-why
jQuery.validator.addMethod("driverCardNum", function(value, element) {
	var flag;
	var temp = /^(0|[1-9][0-9]*)$/.test(value);
	if(temp && value.length == 12) {
		flag = true;
	} else {
		flag = false;
	}
	return this.optional(element) || flag;
}, "Positive Integer only please");
//从业资格证号验证19位纯数字-why
jQuery.validator.addMethod("qualification", function(value, element) {
	var flag;
	var temp = /^(0|[1-9][0-9]*)$/.test(value);
	if(temp && value.length == 19) {
		flag = true;
	} else {
		flag = false;
	}
	return this.optional(element) || flag;
}, "Positive Integer only please");
//司机姓名唯一验证方法
jQuery.validator.addMethod("driverName", function(value, element) {
	var oWebPath = glObj.oWebPath;
	var checkTF;
	$.ajax({
		type: "post",
		url: glObj.oWebPath + urlPath,
		async: false,
		dataType: "json",
		data: {

		},
		success: function(data) {
			checkTF = data;
		}
	});
	return checkTF;
}, "Positive Integer only please");
//车牌号码唯一验证方法
jQuery.validator.addMethod("plateNumberCheck", function(value, element) {
	var oWebPath = glObj.oWebPath;
	var checkTF;
	var data = {
		plateNumber: value,
	};
	if($("#oldPlateNumber").val()) {
		data = {
			plateNumber: value,
			oldPlateNumber: $("#oldPlateNumber").val(),
		}
	}
	$.ajax({
		type: "post",
		url: glObj.oWebPath + '/vehicle/checkCarNameUse',
		async: false,
		dataType: "json",
		data:data,
		success: function(data) {
			checkTF = data;
		}
	});
	return checkTF;
}, "Positive Integer only please");
//特殊字符的验证   杨红
jQuery.validator.addMethod("specialCharFilter", function(value, element) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}'<>/?~！@#￥……&*（）——|【】‘；：《》”“'%+ \\[\\]　\"\\\\]");
    var specialStr = "";
    for(var i=0;i<value.length;i++){
         specialStr += value.substr(i, 1).replace(pattern, '');
    }

    if( specialStr == value){
        return true;
    }

    return false;
});
//20170727 wanghy 车牌验证 start
//车牌号码验证  -why
jQuery.validator.addMethod("carPlateNumber", function(value, element) {
	if(value){
		var flag=/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(value);
		if(flag){
			return true;
		}else{
			return false;
		}
	}
}, "格式错误");
//20170727 wanghy 车牌验证 end
//手机号重复验证  YH1.0 - 63 zhangyj start
jQuery.validator.addMethod("phoneCheck", function(value, element) {
    var oWebPath = glObj.oWebPath;
    var checkTF;
    var data = {
            newUserPhone: value,
    };
    if($("#originalUserPhone").val()) {
        data = {
            newUserPhone: value,
            originalUserPhone: $("#originalUserPhone").val(),
        }
    }
    $.ajax({
        type: "post",
        url: glObj.oWebPath + '/users/checkUserPhone',
        async: false,
        dataType: "json",
        data:data,
        success: function(data) {
            checkTF = data;
        }
    });
    return checkTF;
}, "Positive Integer only please");
//手机号重复验证  YH1.0 - 63 zhangyj end

//2018/3/16  yanghong  start
jQuery.validator.addMethod("isIntGtZero", function(value, element) {
    value=parseInt(value);
    return this.optional(element) || value>0;
}, "必须大于0");
//2018/3/16  yanghong  end