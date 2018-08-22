package com.first.demo.file.util;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.first.demo.file.config.MessageConstant;
import com.first.demo.file.exception.BusinessException;
import org.apache.commons.lang.NullArgumentException;

import java.util.List;
import java.util.UUID;

/**
 * app接口工具
 *
 * @author
 */
public class AppWebServiceUtil {
    /**
     * 解析并解密字符串请求报文
     *
     * @param paramBean
     * @return net.sf.json.JSONObject 对象
     */
    public static <T> T analysisJson(ParamBean paramBean, Class<T> tClass) throws BusinessException {
        return JSONObject.toJavaObject(decode(paramBean), tClass);
    }

    /**
     * 解析并解密字符串请求报文
     *
     * @param paramBean
     * @return net.sf.json.JSONObject 对象
     */
    public static <T> List<T> analysisJsonList(ParamBean paramBean, Class<T> tClass) throws BusinessException {
        return JSONArray.parseArray(decode(paramBean).toJSONString(), tClass);
    }

    public static JSON decode(ParamBean paramBean) throws BusinessException {
        if (StringUtil.isEmpty(paramBean)) {
            throw new BusinessException(MessageConstant.JSON_DECODE_PARAM_ERROR, new NullArgumentException("paramBean"));
        }
        if (StringUtil.isEmpty(paramBean.getStrJson())) {
            throw new BusinessException(MessageConstant.JSON_DECODE_PARAM_ERROR, new NullArgumentException("strJson"));
        }
//        if (StringUtil.isEmpty(paramBean.getKey())) {
//            throw new BusinessException(MessageConstant.JSON_DECODE_PARAM_ERROR, new NullArgumentException("key"));
//        }
        // 获取加密json串
        String strJson = paramBean.getStrJson();
        JSONObject param = JSONObject.parseObject(strJson);
        // 解密json串
//        strJson = String2JsonUtil.str2Json(strJson);
//         将json串转换为json对象
//        JSONObject jsonObj = null;
//        try {
//            jsonObj = JSONObject.parseObject(strJson);
//        } catch (JSONException e) {
//            throw new BusinessException(MessageConstant.JSON_DECODE_ERROR, e);
//        }

//        if (!jsonObj.containsKey("itemID")) {
//            throw new BusinessException(MessageConstant.JSON_DECODE_PARAM_ERROR, new NullArgumentException("itemID"));
//        }

        // 校验参数合法性
//        if (!checkParam(jsonObj.toString(), jsonObj.getString("itemID"), paramBean.getKey())) {
//            throw new BusinessException(MessageConstant.JSON_DECODE_ERROR, new InvalidParameterException("itemID"));
//        }
        return (JSON) JSON.parse(param.get("data").toString());
    }

    /**
     * 校验报文合法性 验证相应的key 是否合法
     */
    private static boolean checkParam(String jsonStr, String itemId, String key) {
        String dd = String.format("Json:%s   ItemID:%s  Key:%s", jsonStr, itemId, Config.KEY_STR);
        // MD5
        String Key = MD5Util.md5s(dd).toUpperCase();
        if (Key.equals(key)) {
            return true;
        }
        return false;
    }
    ////////////////////////////////////////////////////////////////////////////////

    /**
     * app请求
     *
     * @return
     */
    public static HttpResult encryption(Object data) throws BusinessException {
        JSONObject jsonMap = new JSONObject();
        String itemId = UUID.randomUUID().toString().replace("-", "").toUpperCase();
        jsonMap.put("itemID", itemId);
        if (data instanceof JSONObject || data instanceof JSONArray) {
            jsonMap.put("data", data);
        } else if (data instanceof String){
            jsonMap.put("data", JSON.parse(data.toString()));
        }else {
            jsonMap.put("data", JsonUtil.parseJsonString(data));
        }
        return getJsonToEncrypt(jsonMap, itemId);
    }

    /**
     * 加密字符串响应报文 该方法不直接使用
     */
    @SuppressWarnings("static-access")
    private static HttpResult getJsonToEncrypt(JSONObject mp, String itemId) throws BusinessException {
//        String strJson = "";
//        String Key = "";
        String jsonStr = mp.toString();

//        String jsonSec = null;
//        // 将JSON进行3DES加密
//        String dd = String.format("Json:%s   ItemID:%s  Key:%s", jsonStr, itemId, Config.KEY_STR);
//        ThreeDesUtil tdu = null;
//        tdu = new ThreeDesUtil(Config.KEY_STR, Config.IV_STR);
//        jsonSec = tdu.desEncrypt(jsonStr);
//        try {
//            // UrlEncode
//            strJson = URLEncoder.encode(jsonSec, "UTF-8");
//        } catch (UnsupportedEncodingException e) {
//            throw new BusinessException(MessageConstant.URL_ENCODE_ERROR, e);
//        }

        // MD5
//        Key = MD5Util.md5s(dd).toUpperCase();
        // System.out.println("key:" + Key.toLowerCase());
        HttpResult httpResult = new HttpResult();
        httpResult.setStrJson(jsonStr);
//        httpResult.setKey(Key);
        return httpResult;
    }

}
