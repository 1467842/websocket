package com.first.demo.file.util;

import com.alibaba.fastjson.JSON;
import sun.misc.BASE64Decoder;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class StringUtil {

    public static String replaceBadChar(String string) {
        String[] arr = {"=", "'", "<", ">", "&", "%"};
        String temp = string;
        for (int i = 0; i < arr.length; i++) {
            temp = temp.replace(arr[i], "");
        }
        return temp;
    }

    public static String head3ToEnd3AndDecode64(String encode64String)
            throws UnsupportedEncodingException, IOException {
        String head3 = encode64String.substring(0, 3);
        String end3 = encode64String.substring(encode64String.length() - 3, encode64String.length());
        String center = encode64String.substring(3, encode64String.length() - 3);
        StringBuffer stringBuffer = new StringBuffer().append(end3);
        stringBuffer.append(center);
        stringBuffer.append(head3);
        return new String(new BASE64Decoder().decodeBuffer(stringBuffer.toString()), "utf-8");
    }

    /**
     * 字符串的压缩
     *
     * @param str 待压缩的字符串
     * @return 返回压缩后的字符串
     * @throws IOException
     */
    public static String compress(String str) throws IOException {
        if (null == str || str.length() <= 0) {
            return str;
        }
        // 创建一个新的 byte 数组输出流
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        // 使用默认缓冲区大小创建新的输出流
        GZIPOutputStream gzip = new GZIPOutputStream(out);
        // 将 b.length 个字节写入此输出流
        gzip.write(str.getBytes());
        gzip.close();
        // 使用指定的 charsetName，通过解码字节将缓冲区内容转换为字符串
        return out.toString("ISO-8859-1");
    }

    /**
     * 字符串的解压
     *
     * @param str 对字符串解压
     * @return 返回解压缩后的字符串
     * @throws IOException
     */
    public static String unCompress(String str) throws IOException {
        if (null == str || str.length() <= 0) {
            return str;
        }
        // 创建一个新的 byte 数组输出流
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        // 创建一个 ByteArrayInputStream，使用 buf 作为其缓冲区数组
        ByteArrayInputStream in = new ByteArrayInputStream(str.getBytes("ISO-8859-1"));
        // 使用默认缓冲区大小创建新的输入流
        GZIPInputStream gzip = new GZIPInputStream(in);
        byte[] buffer = new byte[256];
        int n = 0;
        while ((n = gzip.read(buffer)) >= 0) {// 将未压缩数据读入字节数组
            // 将指定 byte 数组中从偏移量 off 开始的 len 个字节写入此 byte数组输出流
            out.write(buffer, 0, n);
        }
        // 使用指定的 charsetName，通过解码字节将缓冲区内容转换为字符串
        return out.toString("UTF-8");
    }

    /**
     * 判断一个对象是否为空
     *
     * @param object
     * @return
     * @auther szw
     * @time 2017年2月15日 下午5:30:55
     */
    public static boolean isEmpty(Object object) {
        if (object == null) {
            return true;
        } else {
            return object.toString().isEmpty();
        }
    }

    /**
     * 获取日期的年月
     *
     * @param dt
     * @return
     * @auther szw
     * @time 2017年2月23日 下午6:11:10
     */
    public static int getYearMonth(Date dt) {// 传入日期
        Calendar cal = Calendar.getInstance();
        cal.setTime(dt);// 设置时间
        int year = cal.get(Calendar.YEAR);// 获取年份
        int month = cal.get(Calendar.MONTH);// 获取月份
        return year * 100 + month;// 返回年份乘以100加上月份的值，因为月份最多2位数，所以年份乘以100可以获取一个唯一的年月数值
    }

    /**
     * 获取性别
     *
     * @param idCard
     * @return
     */
    public static String getSex(String idCard) {
        idCard = idCard.trim();
        if (idCard == null || (idCard.length() != 15 && idCard.length() != 18)) {
            return "";
        }
        if (idCard.length() == 15) {
            String lastValue = idCard.substring(idCard.length() - 1, idCard.length());
            int sex;
            if (lastValue.trim().toLowerCase().equals("x") || lastValue.trim().toLowerCase().equals("e")) {
                return "019001,男";
            } else {
                sex = Integer.parseInt(lastValue) % 2;
                return sex == 0 ? "019002,女" : "019001,男";
            }
        } else if (idCard.length() == 18) {
            String lastValue = idCard.substring(idCard.length() - 2, idCard.length() - 1);
            int sex;
            if (lastValue.trim().toLowerCase().equals("x") || lastValue.trim().toLowerCase().equals("e")) {
                return "019001,男";
            } else {
                sex = Integer.parseInt(lastValue) % 2;
                return sex == 0 ? "019002,女" : "019001,男";
            }
        } else {
            return "";
        }
    }

    public static void main(String[] args) {
        String str = addZeroToRight("1101451", 6);
        System.out.println(str);
    }

    /**
     * 检查婚姻状态是否有配偶
     *
     * @param stateCode
     * @return
     */
    public static boolean checkMarried(String stateCode) {
        String[] noState = {"未婚", "离异", "丧偶"};
        for (String item : noState) {
            if (item.equals(stateCode)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 判断是否是血缘关系的家人
     *
     * @param stateCode
     * @return
     * @auther szw
     * @time 2017年4月12日 上午10:37:52
     */
    public static boolean checkFamily(String stateCode) {
        String[] noState = {"子女", "亲兄弟", "亲姐妹", "父母"};
        for (String item : noState) {
            if (item.equals(stateCode)) {
                return true;
            }
        }
        return false;
    }


    /**
     * 检查加密bean是否有效
     *
     * @param paramBean
     * @return
     */
    public static boolean checkFormBean(ParamBean paramBean) {
        if (isEmpty(paramBean))
            return false;
        return !(isEmpty(paramBean.getKey()) || isEmpty(paramBean.getStrJson()));
    }

    /**
     * 验证是否是数字
     *
     * @param str
     * @return
     */
    public static boolean isNumber(String str) {
        Pattern pattern = Pattern.compile("[0-9]*");
        Matcher match = pattern.matcher(str);
        return match.matches();
    }

    /**
     * 检测是否是正确的关系
     *
     * @param str
     * @return
     */
    public static boolean isTrueRel(Object str) {
        if (StringUtil.isEmpty(str)) {
            return false;
        }
        String[] strings = str.toString().split(",");
        if (strings.length < 2) {
            return false;
        }
        return isNumber(strings[0]);
    }

    /**
     * 通过UUID生成32位唯一订单号
     *
     * @return
     * @auther szw
     * @time 2017年4月17日 下午7:18:40
     */
    public static String getRequestNoByUUId(String pay_type) {
        SimpleDateFormat yyMMddDateFormat = new SimpleDateFormat("yyyyMMdd");// 20170321
        int hashCodeV = UUID.randomUUID().toString().hashCode();
        if (hashCodeV < 0) {// 有可能是负数
            hashCodeV = -hashCodeV;
        }
        String todayStr = yyMMddDateFormat.format(new Date(System.currentTimeMillis()));
        // 0 代表前面补充0
        // 21 代表长度为21
        // d 代表参数为正数型
        return pay_type + todayStr + "_" + String.format("%021d", hashCodeV);
    }

    public static String addZeroToRight(String str, int strLength) {
        int strLen = str.length();
        StringBuffer sb = null;
        if (strLen == strLength)
            return str;
        while (strLen < strLength) {
            sb = new StringBuffer();
//          sb.append("0").append(str);// 左补0
            sb.append(str).append("0");//右补0
            str = sb.toString();
            strLen = str.length();
        }
        return str;
    }

    /**
     * 判断一个对象是否为空
     *
     * @param object
     * @return
     * @auther szw
     * @time 2017年2月15日 下午5:30:55
     */
    public static String getNoNull(Object object) {
        if (isEmpty(object)) {
            return "";
        }
        return object.toString();
    }

    /**
     * 判断日期是否是当天
     *
     * @param time
     * @return
     */
    public static boolean isToday(String time) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        if (time == null || "".equals(time)) {
            return false;
        }
        Date date = null;
        try {
            date = format.parse(time);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Calendar current = Calendar.getInstance();

        Calendar today = Calendar.getInstance();    //今天

        today.set(Calendar.YEAR, current.get(Calendar.YEAR));
        today.set(Calendar.MONTH, current.get(Calendar.MONTH));
        today.set(Calendar.DAY_OF_MONTH, current.get(Calendar.DAY_OF_MONTH));
        //  Calendar.HOUR——12小时制的小时数 Calendar.HOUR_OF_DAY——24小时制的小时数
        today.set(Calendar.HOUR_OF_DAY, 0);
        today.set(Calendar.MINUTE, 0);
        today.set(Calendar.SECOND, 0);

        current.setTime(date);

        if (current.after(today)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 获取code
     *
     * @param object
     * @return
     * @auther szw
     * @time 2017年2月15日 下午5:30:55
     */
    public static String getCode(Object object) {
        if (isEmpty(object)) {
            return "";
        }
        String[] arr = object.toString().split(",");
        if (arr != null) {
            return arr[0];
        }
        return "";
    }

    /**
     * 获取code后面的文本
     *
     * @param object
     * @return
     * @auther szw
     * @time 2017年2月15日 下午5:30:55
     */
    public static String getText(Object object) {
        if (isEmpty(object)) {
            return "";
        }
        String[] arr = object.toString().split(",");
        if (arr.length == 2) {
            return arr[1];
        }
        return object.toString();
    }

    /**
     * 是否是json
     *
     * @param object
     * @return
     */
    public static boolean isJson(Object object) {
        if (isEmpty(object)) {
            return false;
        }
        String s = object.toString();

        try {
            JSON.parse(object.toString());
        } catch (Exception e) {
            return false;
        }
        return true;
    }

    /**
     * 从输入流中读取数据
     *
     * @param inputStream
     * @return
     * @throws IOException
     */
    public static String readInputStreamAsString(InputStream inputStream, int length) throws IOException {
        if (inputStream != null) {
            byte[] streamBytes = new byte[length];
            inputStream.read(streamBytes);
            return new String(streamBytes, "UTF-8");
        }
        return null;
    }

    public static float getVersionCode(String s) {
        if (isEmpty(s))
            return -1;
        if (!s.contains("."))
            return Float.valueOf(s);
        String[] ids = s.split("\\.");
        String result = ids[0] + "." + ids[1] + ids[2];
        return Float.valueOf(result);
    }

    public static String getFileName(String url) {
        if (isEmpty(url)) {
            return null;
        }
        String[] temps = url.split("/");
        if (temps.length <= 1) {
            return url;
        }
        String name = temps[temps.length - 1];
        return name.split("\\.")[0];
    }
}
