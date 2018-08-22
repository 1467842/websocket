package com.first.demo.websocket.websocket;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-11
 * Time: 下午4:48
 */
public interface MessageType {
    /**
     * 发送gps信息
     */
    String SOCKET_SEND_GPS = "SOCKET_SEND_GPS";

    /**
     * 推送发货单
     */
    String SOCKET_PUSH_DEVLIVERY = "SOCKET_PUSH_DEVLIVERY";

    /**
     * 推送作废发货单
     */
    String SOCKET_INVALID_DEVLIVERY = "SOCKET_INVALID_DEVLIVERY";

    /**
     * 推送离线发货单时间状态
     */
    String SOCKET_OFFLINE_INVALID_DEVLIVERY = "SOCKET_OFFLINE_DELIVERY_TIME_STAUTS";

    /**
     * 发货单时间状态
     */
    String SOCKET_DELIVERY_TIME_STAUTS = "SOCKET_DELIVERY_TIME_STAUTS";


    /**
     * socket断开连接
     */
    String SOCKET_DISCONNECT = "SOCKET_DISCONNECT";

    /**
     * 车辆解绑
     */
    String VEHICLE_UNTIE = "VEHICLE_UNTIE";

    /**
     * 车辆绑定
     */
    String VEHICLE_BINDING = "VEHICLE_BINDING";

    /**
     * 签收发货单
     */
    String SIGN_DELIVERY = "SIGN_DELIVERY";

    /**
     * 推送修改后的发货单信息
     */
    String SOCKET_PUSH_UPDATE_DEVLIVERY = "SOCKET_PUSH_UPDATE_DEVLIVERY";

    /**
     * 推送修改后的工地围栏
     */
    String SOCKET_UPDATE_RAIL_CONSTRUCTION = "SOCKET_UPDATE_CONSTRUCTION";

    /**
     * 推送修改后的工程信息
     */
    String SOCKET_UPDATE_PROJECT_INFO = "SOCKET_UPDATE_PROJECT_INFO";

    /**
     * 推送修改后的车辆信息
     */
    String SOCKET_UPDATE_VEHICLE_INFO = "SOCKET_UPDATE_VEHICLE_INFO";

    /**
     * 推送新增计划信息
     */
    String SOCKET_INSERT_PLANINFO_INFO = "SOCKET_INSERT_PLAN_INFO";

    /**
     * 推送修改计划信息
     */
    String SOCKET_UPDATE_PLANINFO_INFO = "SOCKET_UPDATE_PLAN_INFO";

    /**
     * 推送修改司机信息
     */
    String SOCKET_UPDATE_DRIVER_INFO = "SOCKET_UPDATE_DRIVER_INFO";

    /**
     * 推送发货单完成消息
     */
    String SOCKET_DELIVERY_STATUS_FINISH="SOCKET_DELIVERY_STATUS_FINISH";

}
