/**
 * <b>功能名：</b>Session Check<br>
 * <b>说明：</b>Session 过期 Check<br>
 * <b>著作权：</b> Copyright (C) 2017 JINCHAN CORPORATION<br>
 * <b>修改履历：</b>
 * 
 * @author 2017/04/25 张旭
 *
 */
$.ajaxSetup({
    complete: function(XMLHttpReqest, textStatus) {	
		var contentType = XMLHttpReqest.getResponseHeader('sessionstatus');
		if (contentType == 'timeout') {
			$('.relogin').modal('show');
		}
		
    }
});