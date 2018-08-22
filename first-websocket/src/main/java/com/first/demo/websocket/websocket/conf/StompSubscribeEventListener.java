package com.first.demo.websocket.websocket.conf;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-09
 * Time: 上午11:43
 */
@Slf4j
@Component
public class StompSubscribeEventListener implements ApplicationListener<SessionSubscribeEvent> {
    @Override
    public void onApplicationEvent(SessionSubscribeEvent sessionSubscribeEvent) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(sessionSubscribeEvent.getMessage());
        //这里的sessionId对应HttpSessionIdHandshakeInterceptor拦截器的存放key
        // String sessionId = headerAccessor.getSessionAttributes().get(Constants.SESSIONID).toString();
        ;
//        Map header = (Map) headerAccessor.getMessageHeaders().get("simpSessionAttributes");
//        headerAccessor.setHeader(Constants.SKEY_ACCOUNT_ID, header.get("accountid"));
        log.info("stomp Subscribe : " + headerAccessor.getMessageHeaders() + "--");
    }
}
