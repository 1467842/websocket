package com.first.demo.websocket.service.impl;

import com.first.demo.file.exception.BusinessException;
import com.first.demo.websocket.conf.JcmesConstants;
import com.first.demo.websocket.entity.User;
import com.first.demo.websocket.entity.WebSocketDemoBean;
import com.first.demo.websocket.mapper.IUserMapper;
import com.first.demo.websocket.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-03-30
 * Time: 下午4:01
 */
@Service
@Transactional
public class UserServiceImpl implements IUserService {

    @Autowired
    IUserMapper iUserDao;
//    @Autowired
//    IUserDao iUserDao;

    @Override
    public User findUserById(Long id) {
        return iUserDao.findUserById(id);
    }

    @Override
    public List<User> findAllUsers() {
        return iUserDao.findAllUsers();
    }

    @Override
    public int insertUser(User user) throws BusinessException {
        int result = 0;
        try {
            result = iUserDao.insertUser(user);
        } catch (Exception e) {
            throw new BusinessException(JcmesConstants.INSERT_USER_ERROR, e);
        }
        return result;
    }

    @Override
    public WebSocketDemoBean selectWebSocketMessageById(String demoId) throws BusinessException {
        return iUserDao.selectWebSocketMessageById(demoId);
    }
}