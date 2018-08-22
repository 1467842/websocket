package com.first.demo.file.util;

import com.first.demo.file.config.MessageConstant;
import com.first.demo.file.exception.BusinessException;
import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import javax.crypto.*;
import javax.crypto.spec.DESedeKeySpec;
import javax.crypto.spec.IvParameterSpec;
import java.io.IOException;
import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import org.apache.log4j.Logger;

public class ThreeDesUtil implements Serializable {

    public static void main(String[] args) throws Exception {
        ThreeDesUtil threeDesUtil = new ThreeDesUtil(Config.KEY_STR, Config.IV_STR);
        String c = threeDesUtil.desEncrypt("123123");
        System.out.println(c);
    }

    /**
     * @Fields serialVersionUID :1L
     */
    private static final long serialVersionUID = 1L;
    private static Key secretKey = null;// key对象
    private static IvParameterSpec ips = null;
    private static Cipher cipher = null; // 私鈅加密对象Cipher
    private static Logger log = Logger.getRootLogger();

    /**
     * 使用指定的密钥键
     *
     * @param strKey 密钥键
     */
    public ThreeDesUtil(String strKey, String iv) throws BusinessException {
        DESedeKeySpec spec = null;
        try {
            spec = new DESedeKeySpec(strKey.getBytes());
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        }
        SecretKeyFactory keyfactory = null;
        try {
            keyfactory = SecretKeyFactory.getInstance("desede");
        } catch (NoSuchAlgorithmException e) {
            throw new BusinessException(MessageConstant.NO_FIND_ENCODE_MOD, e);
        }
        try {
            secretKey = keyfactory.generateSecret(spec);
        } catch (InvalidKeySpecException e) {
            throw new BusinessException(MessageConstant.INITIALIZE_KEY_ERROR, e);
        }
        try {
            cipher = Cipher.getInstance("desede/CBC/PKCS5Padding");
        } catch (NoSuchAlgorithmException | NoSuchPaddingException e) {
            throw new BusinessException(MessageConstant.NO_FIND_ENCODE_MOD, e);
        }
        ips = new IvParameterSpec(iv.getBytes());
    }

    /**
     * 加密
     *
     * @param message
     * @return
     */
    public String desEncrypt(String message) throws BusinessException {
        String newResult = "";// 去掉换行符后的加密字符串
        //            cipher.init(Cipher.ENCRYPT_MODE, secretKey); // 设置工作模式为加密模式，给出密钥
        try {
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, ips);
        } catch (InvalidKeyException | InvalidAlgorithmParameterException e) {
            throw new BusinessException(MessageConstant.INITIALIZE_KEY_ENCODE_PARAM_ERROR, e);
        }
        byte[] mb = new byte[0];
        try {
            mb = message.getBytes("utf-8");
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        byte[] resultBytes = null;
        try {
            resultBytes = cipher.doFinal(mb); // 正式执行加密操作
        } catch (Exception e) {
            // 重新初始化加密模式
            log.error("异常------", e);
            try {
                cipher.init(Cipher.ENCRYPT_MODE, secretKey, ips);
            } catch (InvalidKeyException | InvalidAlgorithmParameterException e1) {
                throw new BusinessException(MessageConstant.INITIALIZE_KEY_ENCODE_PARAM_ERROR, e1);
            }
            try {
                resultBytes = cipher.doFinal(mb);
            } catch (IllegalBlockSizeException | BadPaddingException e1) {
                throw new BusinessException(MessageConstant.DES_ENCODE_ERROR, e1);
            }
        }
        // newResult = byteArr2HexStr(resultBytes);//16进制输出
        newResult = new BASE64Encoder().encode(resultBytes);
        newResult = filter(newResult); // 去掉加密串中的换行符
        return newResult;
    }

    /**
     * 解密函数
     *
     * @param
     * @return
     */
    public String desDecrypt(String message) throws BusinessException {
        try {
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ips);
        } catch (InvalidKeyException | InvalidAlgorithmParameterException e) {
            throw new BusinessException(MessageConstant.INITIALIZE_KEY_ENCODE_PARAM_ERROR, e);
        }
        byte[] mb = new byte[0];
        try {
            mb = new BASE64Decoder().decodeBuffer(message);
        } catch (IOException e) {
            throw new BusinessException(MessageConstant.BASE64_DECODE_ERROR, e);
        }
        byte[] resultBytes = new byte[0];
        try {
            resultBytes = cipher.doFinal(mb);
        } catch (IllegalBlockSizeException | BadPaddingException e) {
            throw new BusinessException(MessageConstant.DES_DECODE_ERROR, e);
        }
        String data = null;
        try {
            data = new String(resultBytes, "utf-8");
        } catch (UnsupportedEncodingException e) {
            throw new BusinessException(MessageConstant.STRING_TO_CHARSET_ERROR, e);
        }
        return data;
    }

    /**
     * 去掉加密字符串换行符
     *
     * @param str
     * @return
     */
    public String filter(String str) {
        String output = "";
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < str.length(); i++) {
            int asc = str.charAt(i);
            if (asc != 10 && asc != 13) {
                sb.append(str.subSequence(i, i + 1));
            }
        }
        output = new String(sb);
        return output;
    }

    // 16进制输出
    public String byteArr2HexStr(byte[] arrB) {
        int iLen = arrB.length;
        // 每个byte用两个字符才能表示，所以字符串的长度是数组长度的两倍
        StringBuffer sb = new StringBuffer(iLen * 2);
        for (int i = 0; i < iLen; i++) {
            int intTmp = arrB[i];
            // 把负数转换为正数
            while (intTmp < 0) {
                intTmp = intTmp + 256;
            }
            // 小于0F的数需要在前面补0
            if (intTmp < 16) {
                sb.append("0");
            }
            sb.append(Integer.toString(intTmp, 16));
        }
        // 最大128位
        String result = sb.toString();
        // if(result.length()>128){
        // result = result.substring(0,result.length()-1);
        // }
        return result;
    }

}