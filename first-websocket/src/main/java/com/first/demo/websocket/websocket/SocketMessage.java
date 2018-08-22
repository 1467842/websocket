package com.first.demo.websocket.websocket;

import com.first.demo.file.util.HttpResult;
import lombok.Data;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-04
 * Time: 上午11:05
 */
@Data
public class SocketMessage {
    private String strJson;
    private String key;
    private String system;
    private String messageType;//协议消息类型
    private HttpResult data;//加密数据

    public SocketMessage() {
    }

    public SocketMessage(String strJson, String key, String uuid) {
        this.strJson = strJson;
        this.key = key;
    }

    public SocketMessage(String strJson, String key) {
        this.strJson = strJson;
        this.key = key;
    }

    public String getStrJson() {
        return strJson;
    }

    public void setStrJson(String strJson) {
        this.strJson = strJson;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getSystem() {
        return system;
    }

    public void setSystem(String system) {
        this.system = system;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public HttpResult getData() {
        return data;
    }

    public void setData(HttpResult data) {
        this.data = data;
    }
}
