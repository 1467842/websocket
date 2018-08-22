package com.first.demo.websocket;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-03-30
 * Time: 下午4:01
 */
@SpringBootApplication
@MapperScan("com.first.demo.websocket.mapper.**")
public class WebSocketApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebSocketApplication.class, args);
        System.out.println("【【【【【【 链接MysqlMybatisMapperXml数据库微服务 】】】】】】已启动");
    }
}
