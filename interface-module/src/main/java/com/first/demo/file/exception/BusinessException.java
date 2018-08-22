package com.first.demo.file.exception;

/**
 * <b>功能名: </b>业务异常类<br>
 * <b>说明: </b>业务异常类<br>
 * <b>著作权: </b> Copyright (C) 2017 DCJINCHAN CORPORATION<br>
 * <b>修改履历: </b>
 *
 * @author 2018-05-07 郑志辉
 */
public class BusinessException extends RuntimeException {
    private static final long serialVersionUID = 7271441932893099878L;

    /**
     * 业务消息
     */
    private String businessMessage;

    /**
     * 业务异常构造
     *
     * @param businessMessage 业务消息
     * @param message         异常消息
     * @param cause           异常对象
     */
    public BusinessException(String businessMessage, String message, Throwable cause) {
        super(message, cause);
        this.businessMessage = businessMessage;
    }

    /**
     * 业务异常构造
     *
     * @param businessMessage 业务消息
     * @param cause           异常对象
     */
    public BusinessException(String businessMessage, Throwable cause) {
        super(cause);
        this.businessMessage = businessMessage;
    }

    public String getBusinessMessage() {
        return businessMessage;
    }

    public void setBusinessMessage(String businessMessage) {
        this.businessMessage = businessMessage;
    }
}
