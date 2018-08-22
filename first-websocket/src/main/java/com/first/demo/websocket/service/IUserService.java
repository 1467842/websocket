package com.first.demo.websocket.service;


import com.first.demo.file.exception.BusinessException;
import com.first.demo.websocket.entity.User;
import com.first.demo.websocket.entity.WebSocketDemoBean;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-03-30
 * Time: 下午4:01
 */
public interface IUserService {

    User findUserById(Long id);

    List<User> findAllUsers();

    int insertUser(User user) throws BusinessException;

    WebSocketDemoBean selectWebSocketMessageById(String demoId) throws BusinessException;
}
