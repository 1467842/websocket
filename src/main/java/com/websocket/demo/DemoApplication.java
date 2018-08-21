package com.websocket.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Date;

@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
//        checkConnection();
//        while(true){
//            try {
//                Thread.sleep(100033);
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
//        }

    }

//    /**
//     * <b>说明：</b>定时器<br>
//     * @param：
//     * @return：
//     * <b>修改履历：</b><li>YYYY/MM/DD 姓名 改修案件名
//     * *@author：2018-06-08 李鑫然
//     */
//    @Scheduled(cron = "0/10 * * * * *")
//    public static void checkConnection() {
//        Date currentDate = new Date();// new Date()为获取当前系统时间
//
//        System.out.print("当前时间:"+currentDate);


        //遍历map
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
}
