package com.first.demo.websocket.websocket.conf;

import com.alibaba.fastjson.JSONObject;
import com.first.demo.file.exception.BusinessException;
import com.first.demo.file.util.StringUtil;
import com.first.demo.websocket.conf.JcmesConstants;
import com.first.demo.websocket.redis.RedisCacheUtil;
import com.first.demo.websocket.websocket.CacheConstant;
import com.first.demo.websocket.websocket.Constants;
import com.first.demo.websocket.websocket.SocketMessage;
import com.first.demo.websocket.websocket.util.MessageUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptorAdapter;
import org.springframework.stereotype.Component;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-09
 * Time: 上午11:41
 */
@Component
@Slf4j
public class PresenceChannelInterceptor extends ChannelInterceptorAdapter {
    @Autowired
    private RedisCacheUtil redisCacheUtil;

    @Autowired
    MessageUtil messageUtil;

    @Override
    public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(message);
        // ignore non-STOMP messages like heartbeat messages
        if (sha.getCommand() == null) {
            return;
        }
        String url = sha.getSessionAttributes().get(Constants.SKEY_URL).toString();
        if (url.equalsIgnoreCase("gpsSocket")) {
            //这里的sessionId和accountId对应HttpSessionIdHandshakeInterceptor拦截器的存放key
            String accountId = sha.getSessionAttributes().get(Constants.SKEY_ACCOUNT_ID).toString();
            String carId = sha.getSessionAttributes().get(Constants.SKEY_CAR_ID).toString();
            String sessionId = sha.getSessionId();
            //判断客户端的连接状态
            switch (sha.getCommand()) {
                case CONNECT:
                    connect(accountId, carId);
                    break;
                case SUBSCRIBE:
                    subscribe(accountId, sessionId);
                    break;
                case DISCONNECT:
                    disconnect(accountId, sessionId);
                    break;
                default:
                    break;
            }
        }
    }

    private void subscribe(String accountId, String sessionId) {
        redisCacheUtil.putHash(CacheConstant.WEBSOCKET_CURRENT_ID, accountId, sessionId);
    }

    //连接成功
    private void connect(String accountId, String carId) {
        log.debug(" STOMP Connect [accountId: " + accountId + "]");
        //存放至ehcache
        redisCacheUtil.putHash(CacheConstant.WEBSOCKET_ACCOUNT, accountId, carId);

    }

    //断开连接
    private void disconnect(String accountId, String sessionId) {
        String oldId = redisCacheUtil.getHashValue(CacheConstant.WEBSOCKET_CURRENT_ID, accountId);
        if (!StringUtil.getNoNull(oldId).equals(sessionId)) {
            redisCacheUtil.putHash(CacheConstant.WEBSOCKET_CURRENT_ID, accountId, sessionId);
            return;
        }
        log.debug("STOMP Disconnect [sessionId: " + accountId + "]");
        SocketMessage socketMessage = null;
        try {
            //更改车辆当前连接状态为断开
//            socketMessage = vehicleTerminalService.VehicleTerminalOffLine(accountId);
        } catch (BusinessException e) {
            log.error(JcmesConstants.executeAbnormal, e);
        }
        if (socketMessage != null) {
            messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
        }
        redisCacheUtil.removeHash(CacheConstant.WEBSOCKET_ACCOUNT, accountId);
    }
}
