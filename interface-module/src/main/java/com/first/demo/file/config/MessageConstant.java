package com.first.demo.file.config;

/**
 * <b>功能名: </b>加密消息常量<br>
 * <b>说明: </b>加密消息常量<br>
 * <b>著作权: </b> Copyright (C) 2017 DCJINCHAN CORPORATION<br>
 * <b>修改履历: </b>
 *
 * @author 2018-05-07 郑志辉
 */
public interface MessageConstant {
    String URL_ENCODE_ERROR = "URL加密异常";
    String URL_DECODE_ERROR = "URL解密异常";
    String BASE64_ENCODE_ERROR = "BASE64加密异常";
    String BASE64_DECODE_ERROR = "BASE64解密异常";
    String NO_FIND_ENCODE_MOD = "初始化加密Cipher失败,没有找到对应模式";

    String INITIALIZE_KEY_ERROR = "初始化加密key失败,无效的key字符串";

    String INITIALIZE_KEY_ENCODE_PARAM_ERROR = "初始化加密key失败,无效的key字符串或加密参数";

    String DES_ENCODE_ERROR = "3DES加密失败";
    String DES_DECODE_ERROR = "3DES解密失败";
    String STRING_TO_CHARSET_ERROR = "转换字符串编码异常";

    String JSON_DECODE_PARAM_ERROR = "解析:参数为空";
    String JSON_DECODE_ERROR = "json解析异常";

    String DEFAULT_ERROR = "服务器异常:";
}
