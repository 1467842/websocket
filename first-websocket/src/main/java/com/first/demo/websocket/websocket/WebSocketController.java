package com.first.demo.websocket.websocket;

import com.alibaba.fastjson.JSONObject;
import com.first.demo.file.exception.BusinessException;
import com.first.demo.file.util.AppWebServiceUtil;
import com.first.demo.file.util.HttpResult;
import com.first.demo.file.util.ParamBean;
import com.first.demo.websocket.conf.JcmesConstants;
import com.first.demo.websocket.utils.CoordinateAnalysisUtil;
import com.first.demo.websocket.utils.RestHttpUtil;
import com.first.demo.websocket.websocket.util.MessageUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-04
 * Time: 上午11:04
 */
@RestController
@Slf4j
public class WebSocketController {
    @Autowired
    private MessageUtil messageUtil;
    @Autowired
    private RestHttpUtil restHttpUtil;
//    @Autowired
//    SchedulingVehiclePresentStatusService vehiclePresentStatusService;
//    @Autowired
//    VehicleTerminalService vehicleTerminalService;
//    @Autowired
//    SchedulingDeliveryTimeStatusService deliveryTimeStatusService;
//    @Autowired
//    SchedulingRailConstructionService railConstructionService;

    private ConcurrentHashMap<String,Date> concurrentHashMap = new ConcurrentHashMap();

//    /**
//     * <b>说明：</b>推送发货单<br>
//     *
//     * @param： String strJson
//     * @param： String key
//     * @return： String 状态码、加密信息
//     * <b>修改履历：</b><li>YYYY/MM/DD 姓名 改修案件名
//     * *@author：2018-04-12 李鑫然
//     */
//    @PostMapping("/PushDelivery")
//    public String pushDelivery(String strJson, String key) throws BusinessException {
//        //解密
//        PushDeliveryInfo pushDeliveryInfo = AppWebServiceUtil.analysisJson(ParamBean.getInstance().setStrJson(strJson).setKey(key), PushDeliveryInfo.class);
//        //操作发货单信息
//        HttpResult result = deliveryTimeStatusService.operatingDeliveryInfo(pushDeliveryInfo);
//        SocketMessage socketMessage = new SocketMessage();
//        //存入推送发货单消息码
//        socketMessage.setMessageType(MessageType.SOCKET_PUSH_DEVLIVERY);
//        socketMessage.setData(result);
//        //查询车辆绑定终端唯一标识
//        String accountId = vehicleTerminalService.queryUniquenessByVehicleId(pushDeliveryInfo.getVehicleId());
//        if (!StringUtil.isEmpty(accountId)) {
//            //发送消息给终端
//            messageUtil.sendMessage(accountId, JSONObject.toJSONString(socketMessage));
//            // TODO: 2018/5/8  发送消息给PC地图
//            messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//        } else {
//            // TODO: 2018/5/8  发送消息给PC地图
//            messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//        }
//        return JSONObject.toJSONString(result);
//    }
//
//
//    /**
//     * <b>说明：</b>推送工程信息<br>
//     *
//     * @param： String strJson
//     * @param： String key
//     * @return： String 状态码、加密信息
//     * <b>修改履历：</b><li>YYYY/MM/DD 姓名 改修案件名
//     * <li>YYYY/MM/DD 姓名 改修案件名
//     * *@author：2018-05-05 李鑫然
//     */
//    @PostMapping("/updateProjectInfo")
//    public String updateProjectInfo(String strJson, String key) throws BusinessException {
//        HttpResult result = new HttpResult();
//        //存入本方法未解密的参数
//        result.setStrJson(strJson);
//        result.setKey(key);
//        SocketMessage socketMessage = new SocketMessage();
//        //存入消息码
//        socketMessage.setMessageType(MessageType.SOCKET_UPDATE_PROJECT_INFO);
//        socketMessage.setData(result);
//        // app订阅/user/{uuid}/message
//        // TODO: 2018/5/5 发送消息给地图
//        messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//        List<String> uniquenessList = null;
//        //解密
//        PushProject projectInfo = AppWebServiceUtil.analysisJson(ParamBean.getInstance().setStrJson(strJson).setKey(key), PushProject.class);
//        if (projectInfo == null || projectInfo.getProjects().size() == 0) {
//            result.setCode(JcmesConstants.SCHEDULING_MAP_300);
//            result.setMessage(JcmesConstants.executeFail);
//            return JSONObject.toJSONString(result);
//        }
//        //遍历
//        for (Project project : projectInfo.getProjects()) {
//            //加密
//            result = AppWebServiceUtil.encryption(project);
//            socketMessage.setData(result);
//            //批量查询车辆对应终端唯一标识
//            uniquenessList = vehicleTerminalService.queryUniquenesssByVehicleIds(project.getVehicleIds());
//            if (uniquenessList.size() > 0) {
//                //遍历
//                for (String accountId : uniquenessList) {
//                    //发送消息给终端
//                    messageUtil.sendMessage(accountId, JSONObject.toJSONString(socketMessage));
//                }
//                result.setCode(JcmesConstants.SCHEDULING_MAP_200);
//                result.setMessage(JcmesConstants.executeOK);
//            }
//        }
//        return JSONObject.toJSONString(result);
//    }

    /**
     * <b>说明：</b>修改司机信息<br>
     *
     * @param： String strJson
     * @param： String key
     * @return： String 状态码、加密信息
     * <b>修改履历：</b><li>YYYY/MM/DD 姓名 改修案件名
     * <li>YYYY/MM/DD 姓名 改修案件名
     * *@author：2018-05-07 李鑫然
     */
    @PostMapping("/updateDriverInfo")
    public String updateDriverInfo(String strJson, String key) throws BusinessException {
        HttpResult result = new HttpResult();
        //存入本方法未解密的参数
        result.setStrJson(strJson);
        result.setKey(key);
        SocketMessage socketMessage = new SocketMessage();
        //存入消息码
        socketMessage.setMessageType(MessageType.SOCKET_UPDATE_DRIVER_INFO);
        socketMessage.setData(result);
        // app订阅/user/{uuid}/message
        // TODO: 2018/5/5 发送消息给地图
        messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
        result.setCode(JcmesConstants.SCHEDULING_MAP_200);
        result.setMessage(JcmesConstants.executeOK);
        return JSONObject.toJSONString(result);
    }


//    /**
//     * @creator 李鑫然
//     * @create date 2018-04-12 11:27
//     * @Description:推送修改后发货单
//     */
//    @PostMapping("/PushUpdateDelivery")
//    public String PushUpdateDelivery(String strJson, String key) throws BusinessException {
//        PushDeliveryInfo pushDeliveryInfo = new PushDeliveryInfo();
//        HttpResult result = new HttpResult();
//        pushDeliveryInfo = AppWebServiceUtil.analysisJson(ParamBean.getInstance().setStrJson(strJson).setKey(key), PushDeliveryInfo.class);
//        //检查修改的发货单是否更换车辆
//        pushDeliveryInfo = deliveryTimeStatusService.queryVehicleIdDeliveryId(pushDeliveryInfo);
//        if (pushDeliveryInfo == null) {
//            result.setCode(JcmesConstants.SCHEDULING_MAP_300);
//            result.setMessage(JcmesConstants.executeFail);
//            return JSONObject.toJSONString(result);
//        }
//        //根据公司、工程ID、查询围栏、路线、发货单车辆状态
//        pushDeliveryInfo = railConstructionService.queryProjectIdByContent(pushDeliveryInfo);
//        if (pushDeliveryInfo == null) {
//            result.setCode(JcmesConstants.SCHEDULING_MAP_300);
//            result.setMessage(JcmesConstants.executeFail);
//            return JSONObject.toJSONString(result);
//        }
//        //查询车辆唯一标识
//        String accountId = vehicleTerminalService.queryUniquenessByVehicleId(pushDeliveryInfo.getVehicleId());
//        String strpushDeliveryInfo = JSONObject.toJSONString(pushDeliveryInfo);
//        result = AppWebServiceUtil.encryption(strpushDeliveryInfo);
//        SocketMessage socketMessage = new SocketMessage();
//        //作废oldAccountId 发货单，把修改后的发货单推送给accountId
//        if (!StringUtil.isEmpty(pushDeliveryInfo.getOldVehicleId())) {
//            //查询车辆唯一标识
//            String oldAccountId = vehicleTerminalService.queryUniquenessByVehicleId(pushDeliveryInfo.getOldVehicleId());
//            CoordinateAnalysisUtil.checkParamsNotNull(oldAccountId);
//            SocketMessage oldsocketMessage = new SocketMessage();
//            oldsocketMessage.setMessageType(MessageType.SOCKET_INVALID_DEVLIVERY);
//            // app订阅/user/{uuid}/message
//            //作废作废oldAccountId终端发货单
//            messageUtil.sendMessage(oldAccountId, JSONObject.toJSONString(oldsocketMessage));
//            if (!StringUtil.isEmpty(accountId)) {
//                //发送给终端的消息类型
//                socketMessage.setMessageType(MessageType.SOCKET_PUSH_DEVLIVERY);
//                socketMessage.setData(result);
//                //推送修改后的发货单给accountId
//                messageUtil.sendMessage(accountId, JSONObject.toJSONString(socketMessage));
//                socketMessage.setMessageType(MessageType.SOCKET_PUSH_UPDATE_DEVLIVERY);
//                // TODO: 2018/5/10 发送消息给PC地图
//                messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//                result.setCode(JcmesConstants.SCHEDULING_MAP_200);
//                result.setMessage(JcmesConstants.executeOK);
//            } else {
//                socketMessage.setMessageType(MessageType.SOCKET_PUSH_UPDATE_DEVLIVERY);
//                socketMessage.setData(result);
//                // TODO: 2018/5/10 发送消息给PC地图
//                messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//                result.setCode(JcmesConstants.SCHEDULING_MAP_200);
//                result.setMessage(JcmesConstants.executeOK);
//            }
//        } else {
//            socketMessage.setMessageType(MessageType.SOCKET_PUSH_UPDATE_DEVLIVERY);
//            socketMessage.setData(result);
//            if (!StringUtil.isEmpty(accountId)) {
//                //发送消息给终端
//                messageUtil.sendMessage(accountId, JSONObject.toJSONString(socketMessage));
//                // TODO: 2018/5/10 发送消息给PC地图
//                messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//                result.setCode(JcmesConstants.SCHEDULING_MAP_200);
//                result.setMessage(JcmesConstants.executeOK);
//            } else {
//                // TODO: 2018/5/10 发送消息给PC地图
//                messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//                result.setCode(JcmesConstants.SCHEDULING_MAP_200);
//                result.setMessage(JcmesConstants.executeOK);
//            }
//
//        }
//        return JSONObject.toJSONString(result);
//    }


//    /**
//     * <b>说明：</b>修改车辆信息<br>
//     *
//     * @param： String strJson
//     * @param： String key
//     * @return： String 状态码、加密信息
//     * <b>修改履历：</b><li>YYYY/MM/DD 姓名 改修案件名
//     * <li>YYYY/MM/DD 姓名 改修案件名
//     * *@author：2018-05-07 李鑫然
//     */
//    @PostMapping("/updateVehicleInfo")
//    public String updateVehicleInfo(String strJson, String key) throws BusinessException {
//        HttpResult result = new HttpResult();
//        //解密
//        Vehicle vehicle = AppWebServiceUtil.analysisJson(ParamBean.getInstance().setStrJson(strJson).setKey(key), Vehicle.class);
//        //查询车辆对应终端唯一标识
//        String accountId = vehicleTerminalService.queryUniquenessByVehicleId(vehicle.getVehicleId());
//        //存入本方法未解密的参数
//        result.setStrJson(strJson);
//        result.setKey(key);
//        SocketMessage socketMessage = new SocketMessage();
//        //存入消息码
//        socketMessage.setMessageType(MessageType.SOCKET_UPDATE_VEHICLE_INFO);
//        socketMessage.setData(result);
//        if (!StringUtil.isEmpty(accountId)) {
//            //发送消息给终端
//            messageUtil.sendMessage(accountId, JSONObject.toJSONString(socketMessage));
//            // TODO: 2018/5/5 发送消息给地图
//            messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//            result.setCode(JcmesConstants.SCHEDULING_MAP_200);
//            result.setMessage(JcmesConstants.executeOK);
//        } else {
//            // TODO: 2018/5/5 发送消息给地图
//            messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//            result.setCode(JcmesConstants.SCHEDULING_MAP_200);
//            result.setMessage(JcmesConstants.executeOK);
//        }
//        return JSONObject.toJSONString(result);
//    }


    /**
     * <b>说明：</b>新增计划信息<br>
     *
     * @param： String strJson
     * @param： String key
     * @return： String 状态码、加密信息
     * <b>修改履历：</b><li>YYYY/MM/DD 姓名 改修案件名
     * <li>YYYY/MM/DD 姓名 改修案件名
     * *@author：2018-05-08 李鑫然
     */
    @PostMapping("/insertPlanInfo")
    public String insertPlanInfo(String strJson, String key) throws BusinessException {
        HttpResult result = new HttpResult();
        //存入本方法未解密的参数
        result.setStrJson(strJson);
        result.setKey(key);
        SocketMessage socketMessage = new SocketMessage();
        //存入消息码
        socketMessage.setMessageType(MessageType.SOCKET_INSERT_PLANINFO_INFO);
        socketMessage.setData(result);
        // app订阅/user/{uuid}/message
        // TODO: 2018/5/5 发送消息给地图
        messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
        result.setCode(JcmesConstants.SCHEDULING_MAP_200);
        result.setMessage(JcmesConstants.executeOK);
        return JSONObject.toJSONString(result);
    }


//    /**
//     * <b>说明：</b>修改计划信息<br>
//     *
//     * @param： String strJson
//     * @param： String key
//     * @return： String 状态码、加密信息
//     * <b>修改履历：</b><li>YYYY/MM/DD 姓名 改修案件名
//     * <li>YYYY/MM/DD 姓名 改修案件名
//     * *@author：2018-05-08 李鑫然
//     */
//    @PostMapping("/updatePlanInfo")
//    public String updatePlanInfo(String strJson, String key) throws BusinessException {
//        HttpResult result = new HttpResult();
//        SocketMessage socketMessage = new SocketMessage();
//        //存入本方法未解密的参数
//        result.setStrJson(strJson);
//        result.setKey(key);
//        socketMessage.setData(result);
//        socketMessage.setMessageType(MessageType.SOCKET_UPDATE_PLANINFO_INFO);
//        // app订阅/user/{uuid}/message
//        // TODO: 2018/5/5 发送消息给地图
//        messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//        ReceivePlanInfo receivePlanInfo = AppWebServiceUtil.analysisJson(ParamBean.getInstance().setStrJson(strJson).setKey(key), ReceivePlanInfo.class);
//        //批量查询和该计划有关联的终端
//        List<String> uniquenessList = vehicleTerminalService.queryUniquenesssByVehicleIds(receivePlanInfo.getVehicleId());
//        if (!StringUtil.isEmpty(uniquenessList) && uniquenessList.size() > 0) {
//            PushPlanInfo pushPlanInfo = new PushPlanInfo();
//            pushPlanInfo.setConstructionSite(receivePlanInfo.getConstructionSite());
//            pushPlanInfo.setContructAddress(receivePlanInfo.getContructAddress());
//            pushPlanInfo.setPouringMethod(receivePlanInfo.getPouringMethod());
//            pushPlanInfo.setProductDemandName(receivePlanInfo.getProductDemandName());
//            pushPlanInfo.setProjectName(receivePlanInfo.getProjectName());
//            //加密
//            result = AppWebServiceUtil.encryption(pushPlanInfo);
//            socketMessage.setData(result);
//            //存入消息码
//            socketMessage.setMessageType(MessageType.SOCKET_UPDATE_PLANINFO_INFO);
//            if (uniquenessList.size() > 0) {
//                //遍历
//                for (String accountId : uniquenessList) {
//                    //发送消息给终端
//                    messageUtil.sendMessage(accountId, JSONObject.toJSONString(socketMessage));
//                }
//            }
//        }
//        result.setCode(JcmesConstants.SCHEDULING_MAP_200);
//        result.setMessage(JcmesConstants.executeOK);
//        return JSONObject.toJSONString(result);
//    }


//    /**
//     * @creator 李鑫然
//     * @create date 2018-04-12 11:27
//     * @Description:推送作废发货单信息
//     */
//    @PostMapping("/InvalidDelivery")
//    public String invalidDelivery(String strJson, String key) throws BusinessException {
//        PushDeliveryInfo pushDeliveryInfo = AppWebServiceUtil.analysisJson(ParamBean.getInstance().setStrJson(strJson).setKey(key), PushDeliveryInfo.class);
//        //消除发货单时间状态记录
//        HttpResult result = deliveryTimeStatusService.deleteDelivery(pushDeliveryInfo.getDeliveryId());
//        //查询车辆绑定终端唯一标识
//        String accountId = vehicleTerminalService.queryUniquenessByVehicleId(pushDeliveryInfo.getVehicleId());
//        SocketMessage socketMessage = new SocketMessage();
//        //存入作废发货单消息码
//        socketMessage.setMessageType(MessageType.SOCKET_INVALID_DEVLIVERY);
//        socketMessage.setData(result);
//        if (!StringUtil.isEmpty(accountId)) {
//            //发送消息给终端
//            messageUtil.sendMessage(accountId, JSONObject.toJSONString(socketMessage));
//            // TODO: 2018/5/9 发送PC地图消息
//            messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//        } else {
//            // TODO: 2018/5/9 发送PC地图消息
//            messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//        }
//
//        return JSONObject.toJSONString(result);
//    }
//
//    /**
//     * <b>说明：</b>定时器<br>
//     * @param：
//     * @return：
//     * <b>修改履历：</b><li>YYYY/MM/DD 姓名 改修案件名
//     * *@author：2018-06-08 李鑫然
//     */
//    @Scheduled(cron = "0/10 * * * * *")
//    public void checkConnection() {
//        Date currentDate = new Date();// new Date()为获取当前系统时间
//        //遍历map
//        for (String accountId : concurrentHashMap.keySet()) {
//            Date date = concurrentHashMap.get(accountId);
//            //当前系统时间-这条accountid 赋值时间 >10s，则识为断开连接
//            if (currentDate.getTime() - date.getTime() > 10 * 1000) {
//                SocketMessage socketMessage = null;
//                try {
//                    //更改车辆当前连接状态为断开
//                    socketMessage = vehicleTerminalService.VehicleTerminalOffLine(accountId);
//                } catch (BusinessException e) {
//                    log.error(JcmesConstants.executeAbnormal, e);
//                }
//                if (socketMessage != null) {
//                    messageUtil.sendMapMessage("XY", JSONObject.toJSONString(socketMessage));
//                    concurrentHashMap.remove(accountId);
//                }
//            }
//        }
//    }
//    @MessageMapping("/gpsReceive")
//    // 发送的订阅路径为/user/{userId}/message
//    // /user/路径是默认的一个，如果想要改变，必须在config 中setUserDestinationPrefix
//    public void gpsReceive(@Payload ParamBean paramBean, @Header("simpSessionAttributes") Map headers) throws BusinessException {
//
////        if (!StringUtil.checkFormBean(paramBean)) {
////            return;
////        }
//        if (paramBean.getMessageType() != null) {
//            int count = 0;
//            //接收发货时间状态信息
//            if (paramBean.getMessageType().equals("SOCKET_DELIVERY_TIME_STAUTS")) {
//                HttpResult result = new HttpResult();
//                SchedulingDeliveryTimeStatus sdts = new SchedulingDeliveryTimeStatus();
//                sdts = AppWebServiceUtil.analysisJson(paramBean, SchedulingDeliveryTimeStatus.class);
//                SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
//                String time = df.format(new Date());//为获取当前系统时间
//                sdts.setCurrentTime(time);
//                //记录发货单状态
//                count = deliveryTimeStatusService.updateDeliveryTimeStatusService(sdts.getStatus(), sdts.getDeliveryId(),sdts.getCurrentTime());
//                if (count == 1) {
//                    String customerId = StringUtil.getNoNull(headers.get("customerid"));
//                    HttpResult httpResult = AppWebServiceUtil.encryption(sdts);
//                    SocketMessage socketMessage = new SocketMessage();
//                    socketMessage.setMessageType(MessageType.SOCKET_DELIVERY_TIME_STAUTS);
//                    socketMessage.setData(httpResult);
//                    messageUtil.sendMapMessage(customerId, JSONObject.toJSONString(socketMessage));
//                }
//            }
//        } else {
//            //接收终端GPS定位信息
//            LocationForm locationForm = AppWebServiceUtil.analysisJson(paramBean, LocationForm.class);
//            if (locationForm != null) {
//                if (!StringUtil.isEmpty(locationForm.getVehicleId())) {
//                    if (locationForm.getLatitude() != null || locationForm.getLongitude() != null) {
//                        //更新车辆Gps信息
//                        int count = vehiclePresentStatusService.vehicleGpsInfo(locationForm);
//                        if (count != 1) {
//                            log.info("GPS信息更新失败");
//                        }
//                    }
//                }
//
//            }
//            String customerId = StringUtil.getNoNull(headers.get("customerid"));
//            String accountId = StringUtil.getNoNull(headers.get("accountid"));
//            concurrentHashMap.put(accountId, new Date(System.currentTimeMillis()));
//            String strLocationForm = JSONObject.toJSONString(locationForm);
//            HttpResult httpResult = AppWebServiceUtil.encryption(strLocationForm);
//            SocketMessage socketMessage = new SocketMessage();
//            socketMessage.setMessageType(MessageType.SOCKET_SEND_GPS);
//            socketMessage.setData(httpResult);
//            messageUtil.sendMapMessage(customerId, JSONObject.toJSONString(socketMessage));
//        }
//
//    }

    @MessageMapping("/mapReceive")
    // 发送的订阅路径为/user/{userId}/message
    // /user/路径是默认的一个，如果想要改变，必须在config 中setUserDestinationPrefix
    public void mapReceive(@Payload ParamBean paramBean, @Header("simpSessionAttributes") Map headers) throws
            Exception {
        //方法用于点对点测试
//        messageUtil.sendMessage(test.getUserId(), JSONObject.toJSONString(httpResult));
    }
}
