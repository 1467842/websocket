package com.first.demo.websocket.utils;

import com.alibaba.fastjson.JSONObject;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 * <b>功能名：</b>坐标点转换成double数组的工具类<br>
 * <b>说明：</b><br>
 * <b>著作权：</b> Copyright (C) 2017 JINCHAN CORPORATION<br>
 * <b>修改履历：
 * 
 * @author 2017/9/16 张立勇
 *
 */
/**
 * Created with IntelliJ IDEA.
 * Description: 坐标点转换成double数组的工具类
 *
 * @author 张立勇
 * Date: 2018-04-04
 * Time: 10:40
 */
public class CoordinateAnalysisUtil {

	/**
	 * 方法描述: String转换成String数组
	 *
	 * @author 张立勇
	 * Date: 2018-04-04
	 * Time: 10:41
	 *
	 * @param: str
	 *
	 * @return: java.util.List<java.lang.Double[]>
	 */
	public static List<Double[]> stringToStringArray(String str) {
		//把一组坐标点拆分成String类型的数组,
		//PS:坐标格式:["40.0424270001","116.6330180001"] 根据逗号(;)拆分
		if (str != null && !str.equals("")) {
			String[] arrayStrings =  str.split(";");
			List<Double[]> listContent = new ArrayList<Double[]>();
			for (int i = 0; i < arrayStrings.length; i++) {
				Double[] arrayContent = CoordinateAnalysisUtil.stringToDoubleArray(arrayStrings[i]);
				listContent.add(arrayContent);
			}
			return listContent;
		}
		return null;
		
	}
	
	/**
	 * 方法描述: String转换成double数组
	 *
	 * @author 张立勇
	 * Date: 2018-04-04
	 * Time: 10:41
	 *
	 * @param: str
	 *
	 * @return: java.lang.Double[]
	 */
	public static Double[] stringToDoubleArray(String str) {
		//把单个的一组坐标点拆分成String类型的数组,
		//PS:坐标格式:40.0424270001,116.6330180001 根据逗号(,)拆分
		//定义double类型数组，长度为2,一组坐标经纬度，拆分成经度、纬度，2个长度就够了
		if (str != null && !str.equals("")) {
			String[] arrayString = str.split(",");
			Double[] arrayDouble = new Double[2];
			arrayDouble[0] = Double.parseDouble(arrayString[0]);
			arrayDouble[1] = Double.parseDouble(arrayString[1]);
			return arrayDouble;
		}
		return null;
	}

	/**
	 * 方法描述: 通过json的key获取value
	 *
	 * @author 张立勇
	 * Date: 2018-04-08
	 * Time: 17:22
	 *
	 * @param: param
	 * @param: key
	 *
	 * @return: java.lang.String
	 */
	public static String jsonToString(String param,String key){
		JSONObject jsonObject = JSONObject.parseObject(param);
		String value = jsonObject.getString(key);
		return value;
	}

	/**
	 * 方法描述: 检查参数是否为空
	 *
	 * @author 张立勇
	 * Date: 2018-04-11
	 * Time: 17:36
	 *
	 * @param: errorMessage
	 * @param: params
	 *
	 */
	public static void checkParamsNotNull(String errorMessage,Object... params) {
		if (params != null && params.length > 0) {
			for (Object element : params) {
				if (element == null) {
					throw new IllegalArgumentException(errorMessage);
				}
			}
		}
	}

	/**
	 * 方法描述: 跨域请求处理方法
	 *
	 * @author 张立勇
	 * Date: 2018-04-08
	 * Time: 15:00
	 *
	 * @param: response
	 *
	 */
	public static void crossDomainRequest(HttpServletResponse response){
		/*** 解决跨域问题 ***/
		//  指定允许其他域名访问  
		response.setHeader("Access-Control-Allow-Origin", "*");
		//  响应类型  
		response.setHeader("Access-Control-Allow-Methods", "POST");
		//  响应头设置 
		response.setHeader("Access-Control-Allow-Headers","x-requested-with,content-type");
	}

}
