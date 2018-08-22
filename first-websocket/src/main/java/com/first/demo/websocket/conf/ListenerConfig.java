package com.first.demo.websocket.conf;

import com.first.demo.websocket.websocket.conf.StompSubscribeEventListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-10
 * Time: 下午7:15
 */
@Configuration
public class ListenerConfig {
    @Bean
    public StompSubscribeEventListener applicationStartListener() {
        return new StompSubscribeEventListener();
    }
}
