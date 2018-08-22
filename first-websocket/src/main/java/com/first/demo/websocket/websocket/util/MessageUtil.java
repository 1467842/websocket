package com.first.demo.websocket.websocket.util;

import com.first.demo.websocket.redis.RedisCacheUtil;
import com.first.demo.websocket.websocket.CacheConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * Created with IntelliJ IDEA.
 * Description: socket消息工具类
 * User: 郑志辉
 * Date: 2018-04-12
 * Time: 下午1:33
 */
@Component
public class MessageUtil {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private RedisCacheUtil redisCacheUtil;


    public void sendMessage(String userId, String message) {
        if (!redisCacheUtil.hasKey(CacheConstant.WEBSOCKET_ACCOUNT, userId)) {
            return;
        }
        messagingTemplate.convertAndSendToUser(userId, "/gpsMessage", message);
    }

    public void sendMapMessage(String userId, String message) {
        messagingTemplate.convertAndSendToUser(userId, "/mapMessage", message);
    }
}
