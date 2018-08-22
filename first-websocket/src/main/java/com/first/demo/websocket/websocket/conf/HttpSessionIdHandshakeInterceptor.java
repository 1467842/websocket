package com.first.demo.websocket.websocket.conf;

import com.first.demo.file.util.StringUtil;
import com.first.demo.websocket.websocket.Constants;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-09
 * Time: 上午11:40
 */
public class HttpSessionIdHandshakeInterceptor extends HttpSessionHandshakeInterceptor {
    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response, WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {
        //解决The extension [x-webkit-deflate-frame] is not supported问题
        if (request.getHeaders().containsKey("Sec-WebSocket-Extensions")) {
            request.getHeaders().set("Sec-WebSocket-Extensions", "permessage-deflate");
        }
        //检查session的值是否存在
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            String url = servletRequest.getServletRequest().getRequestURI();
            if (url.contains("mapSocket")) {
                attributes.put(Constants.SKEY_URL, "mapSocket");
            } else if (url.contains("gpsSocket")) {
                attributes.put(Constants.SKEY_URL, "gpsSocket");
                String accountId = servletRequest.getServletRequest().getHeader(Constants.SKEY_ACCOUNT_ID);
                String customerId = servletRequest.getServletRequest().getHeader(Constants.SKEY_CUSTOMER_ID);
                String cardId = servletRequest.getServletRequest().getHeader(Constants.SKEY_CAR_ID);
                if (StringUtil.isEmpty(accountId) || StringUtil.isEmpty(cardId))
                    return false;
                //把accountId存放起来
                attributes.put(Constants.SKEY_ACCOUNT_ID, accountId);
                attributes.put(Constants.SKEY_CUSTOMER_ID, customerId);
                attributes.put(Constants.SKEY_CAR_ID, cardId);
            }

        }
        return super.beforeHandshake(request, response, wsHandler, attributes);
    }


    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response, WebSocketHandler wsHandler,
                               Exception ex) {
        super.afterHandshake(request, response, wsHandler, ex);
    }
}
