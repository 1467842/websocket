package com.first.demo.file.util;

import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * Description: 加密请求参数类
 * User: 郑志辉
 * Date: 2018-04-03
 * Time: 下午5:13
 */


public class ParamBean implements Serializable {
    private static final long serialVersionUID = 3111008960573793530L;
    private String strJson;
    private String key;
    private String messageType;

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    protected ParamBean() {

    }

    public static ParamBean getInstance() {
        return new ParamBean();
    }

    public ParamBean setStrJson(String strJson) {
        this.strJson = strJson;
        return this;
    }

    public ParamBean setKey(String key) {
        this.key = key;
        return this;
    }

    public String getStrJson() {
        return strJson;
    }

    public String getKey() {
        return key;
    }
}
