package com.first.demo.websocket.common;

import com.alibaba.fastjson.JSONObject;
import com.first.demo.file.config.MessageConstant;
import com.first.demo.file.exception.BusinessException;
import com.first.demo.file.util.HttpResult;
import com.first.demo.file.util.StringUtil;
import com.first.demo.websocket.conf.JcmesConstants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;


/**
 * <b>功能名: </b>统一异常处理<br>
 * <b>说明: </b>统一异常处理类<br>
 * <b>著作权: </b> Copyright (C) 2017 DCJINCHAN CORPORATION<br>
 * <b>修改履历: </b>
 *
 * @author 2018-05-07 郑志辉
 */
@ControllerAdvice
@Slf4j
public class CommonControllerAdvice {

    /**
     * <b>说明：</b>方法的说明<br>
     *
     * @param e 异常信息
     * @return String strJson
     * <b>修改履历：</b>
     * @author ：2018-05-07 郑志辉
     */
    @ResponseBody
    @ExceptionHandler(value = {BusinessException.class, Exception.class})
    @ResponseStatus(value = HttpStatus.OK)
    public String errorHandler(Exception e) {
        HttpResult result = new HttpResult();
        // 设置响应码
        result.setCode(JcmesConstants.SCHEDULING_MAP_500);
        // 日志的消息
        String message = MessageConstant.DEFAULT_ERROR;
        // 判断是否是系统的业务异常
        if (e instanceof BusinessException) {
            BusinessException ex = (BusinessException) e;
            // 判断业务消息是否为空
            if (!StringUtil.isEmpty(ex.getBusinessMessage())) {
                message = ex.getBusinessMessage();
            }
        } else {
            if (!StringUtil.isEmpty(e.getCause().getMessage())) {
                // 获取简略异常信息
                message = e.getCause().getMessage();
            }
        }
        // 设置响应消息
        result.setMessage(message);
        // 输出日志
        log.error(message, e);
        return JSONObject.toJSONString(result);
    }
}
