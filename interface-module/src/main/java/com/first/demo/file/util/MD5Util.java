package com.first.demo.file.util;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Util {
    // 全局数组
    private final static String[] strDigits = {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"};

    /**
     * 16byte MD5 encoding
     *
     * @param str
     * @return
     */
    public static String md5s(String str) {
        MessageDigest digest = null;
        String md5Str = "";
        try {
            digest = MessageDigest.getInstance("MD5");
            digest.update(str.getBytes("UTF-8"));
            byte[] byteArray = digest.digest();
            md5Str = byteArrayToHexString(byteArray);
        } catch (NoSuchAlgorithmException e) {
        } catch (UnsupportedEncodingException e) {
        }
        return md5Str;
    }

    public static String byteArrayToHexString(byte[] b) {
        StringBuffer resultSb = new StringBuffer();
        for (int i = 0; i < b.length; i++) {
            resultSb.append(byteToHexString(b[i]));
        }
        return resultSb.toString();
    }

    private static String byteToHexString(byte b) {
        int n = b;
        if (n < 0) n = 256 + n;
        int d1 = n / 16;
        int d2 = n % 16;
        return strDigits[d1] + strDigits[d2];
    }

    public static byte[] byteFormHex(String inStr) {
        int length = inStr.length() / 2;
        char[] chars = inStr.toCharArray();
        byte[] bytes = new byte[length];
        for (int i = 0; i < length; i++) {
            int position = i * 2;
            //charToByte(chars[position])<<4 高位
            //charToByte(chars[position+1]) 低位
            //高位与低位进行或运算—>组成byte
            bytes[i] = (byte) (charToByte(chars[position]) << 4 | charToByte(chars[position + 1]));
        }
        return bytes;
    }

    private static byte charToByte(char c) {
        String radix16Symbol = "0123456789ABCDEF";//16进制代表符号
        //获取Char的索引值，即是该字符的值，直接转成byte，该值（int类型）此时不会超过byte类型范围
        return (byte) radix16Symbol.indexOf(c);
    }

    /**
     * @throws
     * @Description：TODO 老系统的加密
     * @Title: encode
     * @param：@param inStr
     * @param：@return
     * @return：String
     * @author lh
     * @date 2017-8-28 上午11:32:59
     */
    public static String encode(String inStr) {
        String outStr = "";
        try {
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            BASE64Encoder encoder = new BASE64Encoder();
            outStr = encoder.encode(md5.digest(inStr.getBytes("utf-8")));
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return outStr;
    }

    /**
     * @throws
     * @Description：TODO 用于将新系统密码md5编码再用base64加密一次
     * @Title: secondEncode
     * @param：@param in
     * @param：@return
     * @return：String
     * @author lh
     * @date 2017-8-28 下午1:34:44
     */
    public static String secondEncode(String inStr) {
        BASE64Encoder encoder = new BASE64Encoder();
        return encoder.encode(byteFormHex(inStr.toUpperCase()));
    }

    /**
     * @throws
     * @Description：TODO 用于将老系统密码base64加密解密，然后输出md5编码
     * @Title: decodeFirst
     * @param：@param inStr
     * @param：@return
     * @return：String
     * @author lh
     * @date 2017-8-28 下午1:40:54
     */
    public static String decodeFirst(String inStr) {
        String outStr = inStr;
        try {
            if (inStr.contains("==")) {//是md5加密的
                BASE64Decoder decoder = new BASE64Decoder();
                outStr = byteArrayToHexString(decoder.decodeBuffer(inStr));
            } else {
                System.out.println("------------非md5加密------------");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return outStr.toLowerCase();
    }

    public static void main(String[] args) {
        System.out.println(secondEncode("6954D5392DBCDE76C19260F3B1A13380"));
        System.out.println(decodeFirst("aVTVOS283nbBkmDzsaEzgA=="));
        System.out.println(md5s("ph1234"));
    }
}
