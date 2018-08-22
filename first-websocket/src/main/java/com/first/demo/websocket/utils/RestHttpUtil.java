package com.first.demo.websocket.utils;

import com.first.demo.file.util.HttpResult;
import com.first.demo.file.util.ParamBean;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.concurrent.ListenableFuture;
import org.springframework.util.concurrent.ListenableFutureCallback;
import org.springframework.web.client.AsyncRestTemplate;
import org.springframework.web.client.RestTemplate;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-12
 * Time: 下午5:35
 */
@Component
@Slf4j
public class RestHttpUtil {
    @Autowired
    RestTemplate restTemplate;
    @Autowired
    AsyncRestTemplate asyncRestTemplate;

    public <T> T post(String url, ParamBean param, Class<T> tClass) {
        HttpHeaders headers = new HttpHeaders();
        MediaType type = MediaType.parseMediaType("application/x-www-form-urlencoded; charset=UTF-8");
        headers.setContentType(type);
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("strJson", param.getStrJson());
        map.add("key", param.getKey());
        HttpEntity<MultiValueMap<String, String>> formEntity = new HttpEntity<>(map, headers);
        return restTemplate.postForEntity(url, formEntity, tClass, formEntity).getBody();
    }

    public <T> void post(String url, HttpResult param, Class<T> tClass, ListenableFutureCallback<ResponseEntity<T>> callback) {
        HttpHeaders headers = new HttpHeaders();
        MediaType type = MediaType.parseMediaType("application/x-www-form-urlencoded; charset=UTF-8");
        headers.setContentType(type);
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("strJson", param.getStrJson());
        map.add("key", param.getKey());
        HttpEntity<MultiValueMap<String, String>> formEntity = new HttpEntity<>(map, headers);
        ListenableFuture<ResponseEntity<T>> listenableFuture = asyncRestTemplate.postForEntity(url, formEntity, tClass, formEntity);
        listenableFuture.addCallback(callback);
    }
}
