package com.first.demo.websocket.utils;

import java.io.Serializable;
import java.util.List;

/**
 * 类ResultMsg.java的实现描述：通用的执行结果
 * 
 * @author zhangliyong 2017-9-28 17:24:15
 */
public class ResultMsg<T> implements Serializable {

	private static final long serialVersionUID = -2368446516546812379L;

	// 笼统的返回状态码
	private int code;
	// 成功标记
	private boolean success;
	// 操作消息
	private String message;
	// result data
	private T data;

	public ResultMsg() {
	}

	public ResultMsg(T t) {
		setSuccess(true);
		setData(t);
	}

	public ResultMsg(int code, String message) {
		setSuccess(false);
		setCode(code);
		setMessage(message);
	}

	public ResultMsg(int code, boolean isSuccess, String message, T t) {
		setSuccess(isSuccess);
		setCode(code);
		setMessage(message);
		setData(t);
	}

	public ResultMsg(int code, boolean isSuccess, String message) {
		setSuccess(isSuccess);
		setCode(code);
		setMessage(message);
	}

	public ResultMsg(boolean isSuccess, String message, T t) {
		setSuccess(isSuccess);
		setMessage(message);
		setData(t);
	}

	/**
	 * @return Result<T>
	 */
	public static <T> ResultMsg<T> create() {
		return new ResultMsg<T>();
	}

	/**
	 * 新增快速创建Result的方法
	 * 
	 * @param data
	 * @return
	 */
	public static <T> ResultMsg<T> create(T data) {
		ResultMsg<T> result = ResultMsg.create();
		result.setSuccess(true);
		result.setData(data);
		return result;
	}

	/**
	 * 接口调用成功时也需要code和message的场景
	 * 
	 * @param code
	 * @param message
	 * @param data
	 * @return
	 */
	public static <T> ResultMsg<T> success(int code, String message, T data) {
		ResultMsg<T> result = ResultMsg.create();
		result.setCode(code);
		result.setSuccess(true);
		result.setMessage(message);
		result.setData(data);
		return result;
	}

	/**
	 * 返回错误信息
	 * 
	 * @param code
	 * @param message
	 * @return
	 */
	public static <T> ResultMsg<T> fail(int code, String message, T data) {
		ResultMsg<T> result = ResultMsg.create();
		result.setCode(code);
		result.setSuccess(false);
		result.setMessage(message);
		result.setData(data);
		return result;
	}
	
	/**
	 * 返回错误信息，没有实体类的
	 * 
	 * @param code
	 * @param message
	 * @return
	 */
	public static <T> ResultMsg<T> fail(int code, String message) {
		ResultMsg<T> result = ResultMsg.create();
		result.setCode(code);
		result.setSuccess(false);
		result.setMessage(message);
		return result;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	@Override
	public String toString() {
		return "Result [code=" + code + ", success=" + success + ", message="
				+ message + ", data=" + data + "]";
	}

}
