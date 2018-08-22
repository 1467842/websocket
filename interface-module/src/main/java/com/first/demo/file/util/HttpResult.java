package com.first.demo.file.util;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-03
 * Time: 下午5:06
 */
public class HttpResult extends ParamBean {
    private int code;
    private String message;

    public HttpResult() {
        super();
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
