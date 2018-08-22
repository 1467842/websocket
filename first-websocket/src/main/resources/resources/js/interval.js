var timehf="60000";//hf
var M="";
var s="";
var startTime="";
//判断是否该 
var ruleTime=false;
//得到当前时间
function getTimesHF() {
	var day = new Date();
	//获取时
	var H = day.getHours();
	// 20171208 dongyunlong bug-467 start
	if(H.toString().length == 1){
		H = "0" + H;
	}
	// 20171208 dongyunlong bug-467 end
	//获取分
	 M = day.getMinutes();
	 //获取秒
	  s=day.getSeconds();
	 //转成String
	 var mm=M+"";
	 //判断时间
	 if(mm.length==1){
			CurrentDate = H + ":0"+ M;	 
	 }else{
			CurrentDate = H + ":"+ M;	 
	 }

	return CurrentDate;
}

//定时器方法
function time(){
    /**
     * <b>功能名：</b>初始化查询规则<br>
     * <b>说明：</b>初始化查询规则<br>
     * <b>著作权：</b> Copyright (C) 2017 JINCHAN CORPORATION<br>
     * <b>修改履历：</b>2017年8月6日 胡烽
     * @author 2017年8月6日 胡烽
     */
        $.ajax({
            url: glObj.oWebPath + '/prscheduleing/initRule',
            data: {ruleId:null},
            type: 'POST',
            success: function(data) {
            	var timeHM=getTimesHF();
            	if(data){
                		startTime=data;
                		var abs=parseInt(M);
                		abs=abs%15;
                		timehf=((15-abs)*60000+1000)-s*1000;
                		if(data==timeHM){
                			ruleTime=true;
                		}else{
                			ruleTime=false;	
                		}
                		clearInterval(interval);
                		interval=setInterval("time()",timehf); 
            		
            		
            	}
            }
        })
    
}
time();
//定时器执行
var interval;
	try 
	{ 
		interval=setInterval("time()",timehf); 
	} 
	catch (e) 
	{ 
		//20171024 wangfeiyan bug331 start
		//console.log("报错了");
		//20171024 wangfeiyan bug331 end
	}
