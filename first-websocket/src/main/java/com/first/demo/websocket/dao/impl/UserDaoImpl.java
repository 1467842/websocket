package com.first.demo.websocket.dao.impl;

import com.first.demo.websocket.dao.IUserDao;
import com.first.demo.websocket.entity.User;
import com.first.demo.websocket.entity.WebSocketDemoBean;
import com.first.demo.websocket.mapper.IUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-03-30
 * Time: 下午4:01
 */
@Repository
public class UserDaoImpl implements IUserDao {

    @Autowired
    private IUserMapper iUserMapper;

    @Override
    public User findUserById(Long id) {
        return iUserMapper.findUserById(id);
    }

    @Override
    public List<User> findAllUsers() {
        return iUserMapper.findAllUsers();
    }

    @Override
    public int insertUser(User user) {
        return iUserMapper.insertUser(user);
    }

    @Override
    public WebSocketDemoBean selectWebSocketMessageById(String demoId) {
        return iUserMapper.selectWebSocketMessageById(demoId);
    }
}
