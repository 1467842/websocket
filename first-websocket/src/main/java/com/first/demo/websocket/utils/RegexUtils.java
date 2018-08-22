package com.first.demo.websocket.utils;

/**
 * Created with IntelliJ IDEA.
 * Description: 正则表达式工具类
 *
 * @author 张立勇
 * Date: 2018/4/3
 * Time: 18:36
 */
public class RegexUtils {

    /**
     * 方法描述: 判断是否是数字，数字只能是1或者2
     *
     * @author 张立勇
     * Date: 2018-04-03
     * Time: 18:42
     *
     * @param: strNum
     *
     * @return: boolean
     */
    public static boolean isDigit(String strNum) {
        if (strNum == null){
            return false;
        }
        return strNum.matches("[0-1]{1,}");
    }
}
