package com.first.demo.websocket.conf;


import javax.swing.*;

/**
 * <b>说明：</b>车载终端常量定义文件<<br>
 * <b>著作权：</b> Copyright (C) 2017 DCJINCHAN CORPORATION<br>
 * <b>修改履历：</b><li>YYYY/MM/DD 姓名 改修案件名
 * <li>YYYY/MM/DD 姓名 改修案件名
 *
 * @author 2018/5/4  李鑫然
 */

public interface JcmesConstants {
    /**
     * 插入数据异常
     */
    String INSERT_USER_ERROR = "插入数据异常";

    /**
     * 查询数据异常
     */
    String SELECT_USER_ERROR = "查询数据异常";

    /**
     * 修改数据异常
     */
    String UPDATE_USER_ERROR = "修改数据异常";

    /**
     * 刪除数据异常
     */
    String DELETE_USER_ERROR = "刪除数据异常";

    /**
     * 接口对接异常
     */
    String THIRD_INTERFACE_ERROR = "接口对接异常";

    /**
     * 接口对接异常
     */
    String VEHICLE_POSSESSION = "车辆已被绑定";

    /**
     * 成功
     */
    String executeOK = "OK";

    /**
     * 失败
     */
    String executeFail = "Fail";

    /**
     * 异常
     */
    String executeAbnormal = "异常";

    /**
     * 没有查询到数据
     */
    String NO_DATA = "没有查询到数据";
    /**
     * 查询数据库失败
     */
    String SELECT_DATEBASE_ERROR = "查询数据库失败";

    /**
     * Form参数异常
     */
    String PARAM_ERROR = "传入参数错误";

    /**
     * 成功
     */
    int SCHEDULING_MAP_200 = 200;
    /**
     * 查询成功
     */
    int SCHEDULING_MAP_201 = 201;
    /**
     * 更新成功
     */
    int SCHEDULING_MAP_202 = 202;
    /**
     * 删除成功，请先删除对应{0}的数据才能删除{1}数据
     */
    int SCHEDULING_MAP_203 = 203;
    /**
     * 新增成功
     */
    int SCHEDULING_MAP_204 = 204;
    /**
     * 没有数据
     */
    int SCHEDULING_MAP_210 = 210;
    /**
     * 失败
     */
    int SCHEDULING_MAP_300 = 300;
    /**
     * 查询失败
     */
    int SCHEDULING_MAP_301 = 301;
    /**
     * 更新失败
     */
    int SCHEDULING_MAP_302 = 302;
    /**
     * 删除失败，请先删除对应{0}的数据才能删除{1}数据
     */
    int SCHEDULING_MAP_303 = 303;
    /**
     * 新增失败
     */
    int SCHEDULING_MAP_304 = 304;
    /**
     * 加密失败
     */
    int SCHEDULING_MAP_305 = 305;
    /**
     * 解密失败
     */
    int SCHEDULING_MAP_306 = 306;

    /**
     * 异常
     */
    int SCHEDULING_MAP_500 = 500;

}
