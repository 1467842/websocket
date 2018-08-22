package com.first.demo.websocket.controller;

import com.alibaba.fastjson.JSONObject;
import com.first.demo.file.exception.BusinessException;
import com.first.demo.file.util.AppWebServiceUtil;
import com.first.demo.file.util.ParamBean;
import com.first.demo.file.util.StringUtil;
import com.first.demo.websocket.entity.User;
import com.first.demo.websocket.entity.UserForm;
import com.first.demo.websocket.entity.WebSocketDemoBean;
import com.first.demo.websocket.service.IUserService;
import org.apache.commons.lang.NullArgumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-03-30
 * Time: 下午4:01
 */
@RestController
public class UserController {

    @Autowired
    private IUserService iUserService;

    @PostMapping("/simple/list")
    @ResponseBody
    public String findUserList(String strJson, String key, HttpServletResponse response) throws Exception {
        //  指定允许其他域名访问
        response.setHeader("Access-Control-Allow-Origin", "*");

        //  响应类型
        response.setHeader("Access-Control-Allow-Methods", "POST");
        //  响应头设置
        response.setHeader("Access-Control-Allow-Headers",
                "x-requested-with,content-type");
        UserForm param = AppWebServiceUtil.analysisJson(ParamBean.getInstance().setStrJson(strJson).setKey(key), UserForm.class);
        // 业务逻辑

        // 结果
        ParamBean result = AppWebServiceUtil.encryption(iUserService.findAllUsers());
        return JSONObject.toJSONString(result);
    }

    /**
     * 测试接口
     *
     * @param username 用户姓名
     * @param age      年龄
     * @return 用户信息
     * @throws BusinessException 业务异常
     */
    @PostMapping("/test")
    public User addUser(@RequestParam(value = "key", required = false) String username, @RequestParam(value = "value", required = false) Integer age) throws
            BusinessException {
        User user = new User();
        if (StringUtil.isEmpty(username))
            throw new BusinessException("测试功能参数异常", new NullArgumentException("username"));

        int result = iUserService.insertUser(user);
        if (result > 0) {
            return user;
        }

        user.setId(0L);
        user.setName(null);
        user.setUsername(null);
        user.setBalance(null);

        return user;
    }



    @PostMapping("/selectById")
    public String selectWebSocketMessageById(String demoId) throws BusinessException {
        if (StringUtil.isEmpty(demoId)){
            throw new BusinessException("测试功能参数异常", new NullArgumentException("username"));
        }
        WebSocketDemoBean webSocketDemoBean = iUserService.selectWebSocketMessageById(demoId);
        String strJson = JSONObject.toJSONString(webSocketDemoBean);
        return strJson;
    }
}
