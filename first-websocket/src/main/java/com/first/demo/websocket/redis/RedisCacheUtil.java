package com.first.demo.websocket.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import javax.validation.constraints.NotNull;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-10
 * Time: 上午10:01
 */
@Component
public class RedisCacheUtil {
    @Autowired
    private StringRedisTemplate template;

    public void putHash(@NotNull String tk, @NotNull String key, @NotNull String value) {
        HashOperations<String, String, String> ops = template.opsForHash();
        ops.put(tk, key, value);
    }

    public String getHashValue(@NotNull String tk, @NotNull String key) {
        HashOperations<String, String, String> ops = template.opsForHash();
        return ops.get(tk, key);
    }

    public void removeHash(@NotNull String tk, @NotNull String key) {
        HashOperations<String, String, String> ops = template.opsForHash();
        ops.delete(tk, key);
    }

    public boolean hasKey(@NotNull String tk, @NotNull String key) {
        HashOperations<String, String, String> ops = template.opsForHash();
        return ops.hasKey(tk, key);
    }
}
