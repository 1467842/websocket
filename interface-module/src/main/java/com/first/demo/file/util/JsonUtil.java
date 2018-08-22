package com.first.demo.file.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.ValueFilter;

import java.text.ParseException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-16
 * Time: 下午1:39
 */
public final class JsonUtil {
    private static ValueFilter filter = (obj, s, v) -> {
        if (v == null)
            return "";
        return v;
    };

    public static void main(String[] args) {
        Map map = new HashMap();
        map.put("test", null);
        map.put("qwe", "123");
        System.out.println(parseJsonString(map));
    }

    public static Object parseJsonString(Object o) {
        if (StringUtil.isEmpty(o)) {
            return "";
        }
        return JSON.parse(JSON.toJSONString(o, filter));
    }

    public static <T> T toJavaBean(Object o, Class<T> toClass) throws Exception {
        if (StringUtil.isEmpty(o)) {
            throw new NullPointerException("对象为空");
        }
        if (o instanceof Collection) {
            throw new ParseException("传入非集合对象", 0);
        }
//        JSONObject
//        JSON.toJavaObject(JSON.toJSON(o), )
        return null;
    }
}
