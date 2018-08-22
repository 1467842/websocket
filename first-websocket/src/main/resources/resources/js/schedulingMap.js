/**
 * Created by lenovo on 2018/3/3.
 */
$(function () {
    schedulingMap();
})

function schedulingMap() {

    //时间控件
    function wdateFun(){
        $('.Wdate').datetimepicker({
            lang: 'ch',
            timepicker: false,
            format: 'Y-m-d',
            scrollInput: false,
        });
    }
    /**
     * 全局变量
     */
    let map,//地图
        marker,//marker标记点
        geocoder, //通过地址返回标记点
        returnPolyline,
        polygon,//围栏
        onePlanAllCarArr = [],//当前工地的所有的   marker  车辆
        newWorkLngLat,
        newViaPoint = [],
        initializationAllCarMarkerArr = [],//默认初始化出的所有车辆 marker
        findAllPlanCarArrayMarker=[],//
        findAllConstructionMarker= [],//默认初始化出的站点marker
        siteEnclosureArray = [],
        allConstructionPolygon = [],//初始化的所有的工地的围栏
        findAllConstructionMarkerByPlanNumber = [],//存放根据计划编号查询到的marker
        planMapPolylineByPlanNumberArr = [],//点击计划编号  生成的路线 存放数组
        clickFencingBtnWLMarker = [],//点击围栏按钮生成的围栏marker
        clickCarNumberMarkerArr = [],//点击计划单里面的车辆编号生成的marker
        allConstructionPolygonByCarNumber=[],//点击计划单里面的车辆编号生成的围栏
        centerPlan = [],
        drawDriving,//根据计划编号查询地图信息--->返回的路线
        newLine,//新增一条路线
        siteToSiteReachRoute = [],

        compileRailPolyEditorNew = [],//nx
        newWorkLngLatObj,//nx
        newBiaodianName,//nx

        SettingCenterOfMap = [];//记录地图中心点   默认显示的中心点

    let WebSocketCarMarker = [];//多个工地marker

    // let URL_ADDRESS = 'http://121.42.157.58:8180/';
    // let URL_ADDRESS_SOCKEt = 'ws://121.42.157.58:8180/';

    // let URL_ADDRESS = 'http://192.168.1.117:8080/';
    // let URL_ADDRESS_SOCKEt = 'ws://192.168.1.117:8080/';

    // let URL_ADDRESS = 'http://127.0.0.1:80/'
    let URL_ADDRESS = 'http://39.105.121.125:80/'
    let URL_ADDRESS_SOCKEt = 'ws://39.105.121.125:80/';

    // let URL_ADDRESS = 'http://192.168.1.249:8080/'
    // let URL_ADDRESS_SOCKEt = 'ws://192.168.1.249:8080/';
    let updatePolygon;
    var vm = new Vue({
        el: "#schedulingMap",
        data: {
            findGCList:{
                pageIndex:'1',
                pageSize:'10',
                flag:'1',
                projectName:'',
            },
            searchPlanAll:'',//围栏的模糊查询内容
            searchPlanLine:'',//路线的模糊查询内容
            executeResultMessage:'',//消息提示内容
            temperature: '',//天气情况
            pm25: '',//PM2.5情况
            weatherPicture:'',//天气情况图片路径
            controlTitleFlag: true,//确定当前是否限行的标识
            confirmRoute: false,//点击路线工程选择完成后出现
            confirmEnclosure: false,//点击围栏工程选择完成后出现
            trafficRestrictionFirst:'',//限行
            trafficRestrictionLast:'',//限行
            mapResult:'',//初始化时获取到的页面所有的地图上显示的数据
            findAllPlanList:'',//查询出所有发货单列表
            planDetails:{//根据计划编号查到计划详情
                list:[],//主要数据
                enclosureMes:'',//当前计划的围栏信息
                pageNum:'',//页数
                pages:'',//条数
                totalPages:''
            },
            planDetailsByCarNumber:{//根据车辆编号查询计划详情
                expectedToArriveTime:'',
            },
            planDetailsByCarNumberRoute:'',//根据车辆编号查询车辆地图信息
            engineeringList:'',//工程围栏---工程列表
            engineeringMessage:{},//工程围栏---单独工程的详细信息
            planEnclosureProjectId:{//模态框点击确定按钮时回传后台的ID对象
                projectId:''
            },
            engineeringMessageIndex:'',//工程围栏---单独工程围栏下标
            engineeringEnclosureById:'',//单独的围栏信息--工程
            engineeringListOrLine:'',//工程线路----工程列表
            engineeringLineMessage:'',//工程线路---单独工程线路
            engineeringLineIndex:'',//工程线路---单独工程线路下标
            engineeringLineStartAndEnd:'',//根据工程ID查询到的线路起始点坐标
            engineeringLineUpdateObj:{//修改路线回传后台的对象
                schedulingProjectPathId:'',//线路ID
                name:'',//线路名称
                content:'',//途经点
                distance:'',//直线距离
                traceLength:'',//路线长度
                modityUserId:'',//用户的ID
                pathType:'',//此路线是去程还是回程
                version:''//版本
            },
            estimate:'',//计算车辆多长时间后可以到达---->  小于一小时的情况
            estimateBig:[],//计算车辆多长时间后可以到达---->  大于一小时的情况
            availableCarArr:[],//可用车辆数组
            disableCarArr:[],//停用车辆数组
            WebSocketCarArr:[],//传回的所有车辆
            newPolygon:{},
            newPlanPolygon:{
                type:2,
                projectId:'',
                name:'',
                center:[],
                content:'',
                createUserId:1,
                vehicleIdList:[]
            },
            updatePlanPolygon:{//修改围栏的对象
                schedulingRailConstructionId:'',
                name:'',
                center:'',
                type:'2',
                content:'',
                version:'',
                modityUserId:'1',
                vehicleIdList:[]
            },
            searchForMapByCarNumber:{ //点击搜索按钮  查询对应发货单信息和定位车辆信息
                vehicleId:'',//车辆ID
                vehicleNumber:''//车辆编号
            },
            planCarNumberListByProjectionID:[],//记录根据工程ID查询到的当前工程下的车辆ID集合
            map_new_rail_compile_lnglat:[],
            map_new_rail_compile_lnglat_str:'',
            planPolygonFlag:'',//确定是新增还是修改的标识
            polygonIsShowFlag:true,
            findPlanCarId:{
                carNumber:'',
            },
            findPlanByCarID:{
                vehicleNum:'',
                flag:'0',
            },
            findAllPlanListMessage:{//点击计划列表按钮  ---查询所有发货单列表
                pageIndex:'1',
                pageSize:'10'
            },
            engineeringLineById:{//根据工程ID查询规划线路的起始点
                projectID:'',
            },
            queryRouteByVehicleID:{//根据车辆ID  查询车辆轨迹
                vehicleID:'',
                deliveryID:''
            },
            insertPlanPolyLieByNumber:{//新增路线对象
                name:'',//路线名称
                locationId:'',//站点ID
                projectId:'',//工程ID
                locationFenceId:'',//站点围栏ID
                projectFenceId:'',//工程围栏ID
                content:'',//路线
                distance:'',//直线距离
                traceLength:'',//路线长度
                createUserId:'',//创建人ID
                pathType:'',//0
            },
            updatePlanPolyLieByNumber:{//修改路线对象
                schedulingProjectPathId:'',//路线ID
                name:"",//路线名称
                content:'',//途径点
                distance:'',//直线距离
                traceLength:'',//路线距离
                modityUserId:'',//操作人ID
                pathType:'',//
                version:'',//版本
            },
            planPloyLineInsertOrUpdateFlag:'',//区分线路是新增还是修改
            searchLineByLineID:{//根据路线ID查询路线信息
                lineID:''
            },
            searchLineByLineIDMessage:{},//根据路线ID查询出的详细信息
            updatePlanPolyLieContent:'',//修改路线中心点信息
            planAndEngineeringByCarNumberForMap:{},//点击任务单里面的车辆编号接受到的地图信息
            currentPlanNumberId:'',//点击的当前的任务的ID

            engineeringForMessage:{ //新增发货单信息  -> 对象
                deliveryId:'',//发货单ID
                vehicleId:'',//车辆ID
                projectId:'',//工程ID
                planNumber:'',//计划编号
                signTheState:'',//退剩状态
                number:'',//车辆编号
                productionQuantity:'',//发货方量
                driverName:'',//司机姓名
                driverPhone:'',//司机电话
                speed:'',//速度
                deliverVehicleStatus:'',//发货单时间状态
                deliveryTime:'',//发货时间
                timeOut:'',//出站时间
                deliverVehicleStatus:'',//去途预计时间
                constructionTimeIn:'',//到达工地时间
                waitTimeLonger:'',//等待时长
                dischargeStartTime:'',//卸货开始时间
                unloadTimeLonger:'',//卸料时长
                expectedToArriveTime:'',//回途预计时间
                connectStatus:''// 车辆在线状态
            },
            planDetailedMessage:{ //计划的详情
                constructionSite:'',//施工部位
                applicantQuantity:'',//申请方量
                pouringMethod:'',//浇筑方式
                contructAddress:'',//施工地址
                planStatus:'',//计划状态
                deliverySupplyQuantity:0,//以供方量
                projectName:'',//工程名称
                projectId:'',//工程ID
                productDemandName:'',//产品名称
                planNumber:'',//计划编号
                vehicle:0,//车次
                deliveryVehicleList:[],//发货单列表
            },
            insertCarMessage:{  //新绑定一辆车
                schedulingProductionVehicleId:'',//车辆ID
                vehicleNumber:'',//车辆编号
                plateNumber:'',//车牌号
                carNorm:'',//车辆规格
                signTheState:'',//车辆剩退情况
                vehicleId:''//车辆ID
            },
            invoiceTimeMessage:'',//发货单时间状态信息----->  信息推送--用
            invoiceTimeForGPSMessage:'',//GPS 时间状态信息----->  GPS消息---用
            insertNewPlan:'',//发货单信息---->   收到发货单信息--->新插入一条发货单信息
            showPlanMessageFlag:false,//消息的显示和隐藏
            planListClickPlanNumber:'',//点击计划时的发货单编号
            engineeringInformation:[],//点击计划时获取当前计划下的发货单列表
            findVehicleList:[],//初始化车辆列表
            taskUpProjectionFlag:true,//工程详情的上拉  标识
            isFirstCarStatusFlag:[],//是否调用车辆在线状态的方法
            mapProjectNameCurrentPage:1,//当前第几页
            mapProjectNameTotalPages:'',//总页数
            mapProjectNameTotalElements:'',//数据总条数
            isReset: 0,//nx
            isSaveLngLat: 1,//nx
            newLngLat: [],//nx
            findAllCarNum: [],//nx
            isShowSearchResult: 0,//nx
            searchFrameContent: "",//nx
            // searchFrameContentData: [],//nx
            selectCarObj: {},//nx
            isOptionShow: 1,//nx
            isNoShowModel: 0,//nx

            searchCarMessageByCarNumber:{//车辆编号模糊查询用
                vehicleId:'',//车辆ID
                vehicleNumber:''//车辆编号
            },
            engineeringListForInit:[],//初始化所有工程信息
            engineeringForInit:{
                projectPlanList:[],//工程下的计划列表
                projectName:'',//工程名称
                projectId:'',//工程ID
                engineeringCarSum:0,
            },
            markerClickFirstFlag:false,
            oneNewMessageShow:'',//提示消息
            newMessageFlag:false,
            loadFlagModalup:false,
            isNewPlanPolygon:false,
            planInvoiceByCarNumber:{},

            /*车辆统计查询条件*/
            statisticsObj:{
                vehicleId:"",//车辆编号
                startTime:'',//开始时间
                endTime:'',//结束时间
                pageNumber: 1,
                pageSize:"10",
            },
            /*车辆满载率查询条件*/
            statisticsObjLoadRate:{
                vehicleId:"",//车辆编号
                startTime:'',//开始时间
                endTime:'',//结束时间
                pageNumber: 1,
                pageSize:"10",
            },
            /*运输数据分析*/
            statisticsObjDataAnalysis:{
                vehicleId:"",//车辆编号
                startTime:'',//开始时间
                endTime:'',//结束时间
                pageNumber: 1,
                pageSize:"10",
            },
            statisticsVehicleNumber:'',

            statisticsResList:[],
            mapProjectNameCurrentPageFn:1,//当前第几页
            mapProjectNameTotalPagesFn:'',//总页数
            mapProjectNameTotalElementsFn:'',//数据总条数

            statisticsResListLoadRate:[],//满载率
            mapProjectNameCurrentPageFnLoadRate:1,//当前第几页
            mapProjectNameTotalPagesFnLoadRate:'',//满载率总页数
            mapProjectNameTotalElementsFnLoadRate:'',//数据总条数

            statisticsResListDataAnalysis:[],//运输数据分析
            mapProjectNameCurrentPageFnDataAnalysis:1,
            mapProjectNameTotalPagesFnDataAnalysis:'',
            mapProjectNameTotalElementsFnDataAnalysis:'',

            dataStatisticsHideFlag:1,//数据统计显示flag
        },
        ready: function () {
            initMap();
            this.findMapAllSearch();//初始化所有围栏 车辆
            this.findPlanList();//初始化发货单列表
            this.searchCarList();//初始化所有车辆
            this.getWeatherInfo();//初始化天气
            setPlanListContentHeight();//初始化页面的计划列表高度
            IsNetworkConnection();//网络连接后重连
            setMapCenterOrCity();//初始化地图上定位的控件
            this.carLimitLineMessage();//初始化限行
            this.findEngineeringMessage();//初始化全部工程信息
            wdateFun();
        },
        computed: {
            searchFrameContentData: function() {
                var search = this.searchFrameContent;
                if(search) {
                    if (this.mapResult.productionVehicleBeans){
                        return this.mapResult.productionVehicleBeans.filter(function(val) {
                            return Object.keys(val).some(function(key) {
                                return String(val[key]).toLowerCase().indexOf(search) > -1;
                            });
                        });
                    }
                }
                return this.mapResult.productionVehicleBeans;
            }
        },
        watch: {
            searchFrameContent: function() {
                if(vm.searchFrameContent) {
                    if(this.isOptionShow == 1) {
                        this.selectCarObj = {};
                        vm.isShowSearchResult = 1;
                    } else if(this.isOptionShow == 0){}
                } else {
                    this.selectCarObj = {};
                    vm.isShowSearchResult = 0;
                }
            }
        },
        methods: {
            dataStatisticsFun:function(showFlag){
                vm.dataStatisticsHideFlag = showFlag;
                if (showFlag == 2){
                    setTimeout(function () {
                        wdateFun();
                    },300);
                    vm.statisticsServerFnllLoadRate(); //满载率
                }else if(showFlag == 3){
                    setTimeout(function () {
                        wdateFun()
                    },300)
                    vm.statisticsServerDataAnalysis(); //数据分析
                }else{
                    setTimeout(function () {
                        wdateFun()
                    },300)
                    vm.statisticsServerFn();
                }
            },
            /**
             * 车辆统计查询
             */
            findCarStatisticsFn:function() {
                if (vm.statisticsVehicleNumber){
                    vm.mapResult.productionVehicleBeans.forEach((c)=>{
                        if (vm.statisticsVehicleNumber == c.number) {
                            vm.statisticsObj.vehicleId = c.schedulingProductionVehicleId;
                        }
                    })
                }
                vm.statisticsServerFn();
            },
            /**
             * 查询方法
             */
            statisticsServerFn:function(){
              $.ajax({
                  url: URL_ADDRESS+'scheduleMap/findDeliveryTimeStatusStatistics',
                  type: 'post',
                  data: httpEncode(JSON.stringify(vm.statisticsObj)),
                  success: function(data) {
                      if (JSON.parse(data).code == 200){
                          let result = decryptByDESModeCBCzhang(data);
                          vm.statisticsResList = JSON.parse(result).list;
                          vm.mapProjectNameCurrentPageFn = JSON.parse(result).pageNum;
                          vm.mapProjectNameTotalPagesFn = JSON.parse(result).pages;
                          vm.mapProjectNameTotalElementsFn = JSON.parse(result).total;
                      }
                  },
                  error:function () {
                      
                  }
              })
            },
            /**
             * 满载率
             */
            statisticsServerFnllLoadRate:function(){
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findDeliveryTimeStatusStatistics',
                    type: 'post',
                    data: httpEncode(JSON.stringify(vm.statisticsObjLoadRate)),
                    success: function(data) {
                        if (JSON.parse(data).code == 200){
                            let result = decryptByDESModeCBCzhang(data);
                            vm.statisticsResListLoadRate = JSON.parse(result).list;
                            vm.mapProjectNameCurrentPageFnLoadRate = JSON.parse(result).pageNum;
                            vm.mapProjectNameTotalPagesFnLoadRate = JSON.parse(result).pages;
                            vm.mapProjectNameTotalElementsFnLoadRate = JSON.parse(result).total;
                        }
                    },
                    error:function () {

                    }
                })
            },
            /**
             * 运输数据分析
             */
            statisticsServerDataAnalysis:function () {
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findTransportStatistics',
                    type: 'post',
                    data: httpEncode(JSON.stringify(vm.statisticsObjDataAnalysis)),
                    success: function(data) {
                        if (JSON.parse(data).code == 200){
                            let result = decryptByDESModeCBCzhang(data);
                            vm.statisticsResListDataAnalysis = JSON.parse(result).list;
                            vm.mapProjectNameCurrentPageFnDataAnalysis = JSON.parse(result).pageNum;
                            vm.mapProjectNameTotalPagesFnDataAnalysis = JSON.parse(result).pages;
                            vm.mapProjectNameTotalElementsFnDataAnalysis = JSON.parse(result).total;
                        }
                    },
                    error:function () {}
                })
            },
            /**
             * 查询条件重置
             */
            resetStatisticsFn:function(){
                vm.statisticsObj.startTime = ''//开始时间
                vm.statisticsObj.endTime = ''; //结束时间
                vm.statisticsObjDataAnalysis.startTime = "";
                vm.statisticsObjDataAnalysis.endTime = "";
                vm.statisticsObjLoadRate.startTime = "";
                vm.statisticsObjLoadRate.endTime = "";
            },
            /**
             * 关闭统计模态
             */
            closeStatisticsFn:function(){
                vm.resetStatisticsFn();
            },
            /**
             * 满载率分页
             * @param flag
             */
            clickPageTypeMapFnLoadRate:function (flag) {
                if(flag == 0) { //返回首页
                    if (this.mapProjectNameCurrentPageFnLoadRate != 1){
                        this.mapProjectNameCurrentPageFnLoadRate = 1;
                        vm.statisticsObjLoadRate.pageNumber = this.mapProjectNameCurrentPageFnLoadRate;
                        vm.statisticsServerFnllLoadRate();
                    }
                } else if(flag == 1) { //上一页
                    if(this.mapProjectNameCurrentPageFnLoadRate == 1) {
                        this.mapProjectNameCurrentPageFnLoadRate = 1;
                    } else {
                        this.mapProjectNameCurrentPageFnLoadRate--;
                        vm.statisticsObjLoadRate.pageNumber = this.mapProjectNameCurrentPageFnLoadRate;
                        vm.statisticsServerFnllLoadRate();
                    }
                } else if(flag == 2) { //下一页
                    if(this.mapProjectNameCurrentPageFnLoadRate == this.mapProjectNameTotalPagesFnLoadRate ) {
                        this.mapProjectNameCurrentPageFnLoadRate = this.mapProjectNameTotalPagesFnLoadRate;
                    } else {
                        this.mapProjectNameCurrentPageFnLoadRate++;
                        vm.statisticsObjLoadRate.pageNumber = this.mapProjectNameCurrentPageFnLoadRate;
                        vm.statisticsServerFnllLoadRate();
                    }
                }else if(flag == 4){
                    vm.statisticsObjLoadRate.pageNumber = this.mapProjectNameCurrentPageFnLoadRate;
                    vm.statisticsServerFnllLoadRate();
                }else { //尾页
                    if (this.mapProjectNameCurrentPageFnLoadRate != this.mapProjectNameTotalPagesFnLoadRate){
                        this.mapProjectNameCurrentPageFnLoadRate = this.mapProjectNameTotalPagesFnLoadRate;
                        vm.statisticsObjLoadRate.pageNumber = this.mapProjectNameCurrentPageFnLoadRate;
                        vm.statisticsServerFnllLoadRate();
                    }
                }
            },
            /**
             * 分页
             * @param flag
             */
            clickPageTypeMapFn:function(flag){
                if(flag == 0) { //返回首页
                    if (this.mapProjectNameCurrentPageFn != 1){
                        this.mapProjectNameCurrentPageFn = 1;
                        vm.statisticsObj.pageNumber = this.mapProjectNameCurrentPageFn;
                        vm.statisticsServerFn();
                    }
                } else if(flag == 1) { //上一页
                    if(this.mapProjectNameCurrentPageFn == 1) {
                        this.mapProjectNameCurrentPageFn = 1;
                    } else {
                        this.mapProjectNameCurrentPageFn--;
                        vm.statisticsObj.pageNumber = this.mapProjectNameCurrentPageFn;
                        vm.statisticsServerFn();
                    }
                } else if(flag == 2) { //下一页
                    if(this.mapProjectNameCurrentPageFn == this.mapProjectNameTotalPagesFn ) {
                        this.mapProjectNameCurrentPageFn = this.mapProjectNameTotalPagesFn;
                    } else {
                        this.mapProjectNameCurrentPageFn++;
                        vm.statisticsObj.pageNumber = this.mapProjectNameCurrentPageFn;
                        vm.statisticsServerFn();
                    }
                }else if(flag == 4){
                    vm.statisticsObj.pageNumber = this.mapProjectNameCurrentPageFn;
                    vm.statisticsServerFn();
                }else { //尾页
                    if (this.mapProjectNameCurrentPageFn != this.mapProjectNameTotalPagesFn){
                        this.mapProjectNameCurrentPageFn = this.mapProjectNameTotalPagesFn;
                        vm.statisticsObj.pageNumber = this.mapProjectNameCurrentPageFn;
                        vm.statisticsServerFn();
                    }
                }
            },
            /**
             * 运输数据分析
             * @param flag
             */
            clickPageTypeMapFnDataAnalysis:function(flag){
                if(flag == 0) { //返回首页
                    if (this.mapProjectNameCurrentPageFnDataAnalysis != 1){
                        this.mapProjectNameCurrentPageFnDataAnalysis = 1;
                        vm.statisticsObjDataAnalysis.pageNumber = vm.mapProjectNameCurrentPageFnDataAnalysis;
                        vm.statisticsServerDataAnalysis();
                    }
                } else if(flag == 1) { //上一页
                    if(this.mapProjectNameCurrentPageFnDataAnalysis == 1) {
                        this.mapProjectNameCurrentPageFnDataAnalysis = 1;
                    } else {
                        this.mapProjectNameCurrentPageFnDataAnalysis--;
                        vm.statisticsObjDataAnalysis.pageNumber = vm.mapProjectNameCurrentPageFnDataAnalysis;
                        vm.statisticsServerDataAnalysis();
                    }
                } else if(flag == 2) { //下一页
                    if(this.mapProjectNameCurrentPageFnDataAnalysis == this.mapProjectNameTotalPagesFnDataAnalysis ) {
                        this.mapProjectNameCurrentPageFnDataAnalysis = this.mapProjectNameTotalPagesFnDataAnalysis;
                    } else {
                        this.mapProjectNameCurrentPageFnDataAnalysis++;
                        vm.statisticsObjDataAnalysis.pageNumber = vm.mapProjectNameCurrentPageFnDataAnalysis;
                        vm.statisticsServerDataAnalysis();
                    }
                }else if(flag == 4){
                    vm.statisticsObjDataAnalysis.pageNumber = vm.mapProjectNameCurrentPageFnDataAnalysis;
                    vm.statisticsServerDataAnalysis();
                }else { //尾页
                    if (this.mapProjectNameCurrentPageFnDataAnalysis != this.mapProjectNameTotalPagesFnDataAnalysis){
                        this.mapProjectNameCurrentPageFnDataAnalysis = this.mapProjectNameTotalPagesFnDataAnalysis;
                        vm.statisticsObjDataAnalysis.pageNumber = vm.mapProjectNameCurrentPageFnDataAnalysis;
                        vm.statisticsServerDataAnalysis();
                    }
                }
            },
            /**
             * 围栏---路线  模糊查询
             * @param flag
             */
            cacheFindAllDriver:function (flag) {
                if (flag == 2){//路线
                    vm.findGCList.flag = 1;
                    vm.findGCList.projectName = vm.searchPlanLine;
                    vm.allEngineeringLine();
                }else{//围栏
                    vm.findGCList.flag = 0;
                    vm.findGCList.projectName = vm.searchPlanAll;
                    vm.mapProjectNameCurrentPage = 1;
                    vm.showEnclosureModal();
                }
            },
            /**
             * 消息的显示和隐藏
             */
            planMessageHideOrShow:function () {
                if (vm.oneNewMessageShow) {
                    if (vm.showPlanMessageFlag){
                        vm.planMessageBox(-60);
                        vm.showPlanMessageFlag = false;
                    }else{
                        vm.planMessageBox(20);
                        vm.showPlanMessageFlag = true;
                    }
                }else{
                    vm.showMessageModal('当前没有新消息!');
                }
            },
            /**
             * 控制消息块的显示和隐藏
             */
            planMessageBox:function (px) {
                $('.newMessage').animate({
                    top:px+'px',
                },200)
            },
            /**
             * 消息的提示
             * @param top
             * @param but
             * @param time
             */
            messageIsHideOrShow:function (top,but,time,mes) {
                vm.newMessageFlag = true;
                vm.oneNewMessageShow = mes;
                vm.planMessageBox(top);
                setTimeout(function () {
                    vm.planMessageBox(but);
                    vm.newMessageFlag = false;
                },time);
            },
            /**
             * 发货单列表的显示隐藏
             * @param flag
             */
            closeInvoiceListForPlan:function(flag){
                if (flag == false){
                    vm.getEngineeringList();
                }else{
                    vm.setPositionBot(0);
                }
            },
            /**
             * 工地marker的点击事件
             */
            markerClickListener:function () {
                let projectId;
                for (let i = 0;i<WebSocketCarMarker.length;i++){
                    AMap.event.addListener(WebSocketCarMarker[i], 'click', function (e) {
                        projectId = WebSocketCarMarker[i].getExtData();
                        vm.setPositionRight(10,projectId);
                    });
                }
            },
            /**
             * 获取发货单列表的高度,初始化隐藏
             */
            getEngineeringList:function(){
                let height = $('.invoiceListForPlan').height();
                vm.setPositionBot(-height);
            },

            /**
             * 计划的点击事件
             * @param planNumber
             */
            planMessageClick:function(planNumber,index,nextIndex){
                if(typeof nextIndex == "undefined") {
                    if (vm.findAllPlanList.planList[index].deliveryVehicleList.length != 0){
                        vm.planListClickPlanNumber = planNumber;
                        vm.engineeringInformation = [];
                        for(let i = 0;i<vm.findAllPlanList.planList[index].deliveryVehicleList.length;i++){
                            vm.engineeringForMessage = {};
                            vm.engineeringForMessage.driverName = vm.findAllPlanList.planList[index].deliveryVehicleList[i].driverName;
                            vm.engineeringForMessage.driverPhone = vm.findAllPlanList.planList[index].deliveryVehicleList[i].driverPhone;
                            vm.engineeringForMessage.number = vm.findAllPlanList.planList[index].deliveryVehicleList[i].number;
                            vm.engineeringForMessage.plateNumber = vm.findAllPlanList.planList[index].deliveryVehicleList[i].plateNumber;
                            vm.engineeringForMessage.productionQuantity = vm.findAllPlanList.planList[index].deliveryVehicleList[i].productionQuantity;
                            vm.engineeringForMessage.vehicleId = vm.findAllPlanList.planList[index].deliveryVehicleList[i].vehicleId;
                            vm.engineeringForMessage.vehicleStatus = vm.findAllPlanList.planList[index].deliveryVehicleList[i].vehicleStatus;
                            vm.engineeringForMessage.connectStatus = vm.findAllPlanList.planList[index].deliveryVehicleList[i].connectStatus;
                            vm.engineeringForMessage.constructionTimeIn = vm.findAllPlanList.planList[index].deliveryVehicleList[i].constructionTimeIn;
                            vm.engineeringForMessage.deliverVehicleStatus = vm.findAllPlanList.planList[index].deliveryVehicleList[i].deliverVehicleStatus;
                            vm.engineeringForMessage.deliveryTime = vm.findAllPlanList.planList[index].deliveryVehicleList[i].deliveryTime;
                            vm.engineeringForMessage.dischargeStartTime = vm.findAllPlanList.planList[index].deliveryVehicleList[i].dischargeStartTime;
                            vm.engineeringForMessage.dischargeEndTime = vm.findAllPlanList.planList[index].deliveryVehicleList[i].dischargeEndTime;
                            vm.engineeringForMessage.expectedToArriveTime = vm.findAllPlanList.planList[index].deliveryVehicleList[i].expectedToArriveTime;
                            vm.engineeringForMessage.productionQuantity = vm.findAllPlanList.planList[index].deliveryVehicleList[i].productionQuantity;
                            vm.engineeringForMessage.signTheState = vm.findAllPlanList.planList[index].deliveryVehicleList[i].signTheState;
                            vm.engineeringForMessage.speed = vm.findAllPlanList.planList[index].deliveryVehicleList[i].speed;
                            vm.engineeringForMessage.timeOut = vm.findAllPlanList.planList[index].deliveryVehicleList[i].timeOut;
                            vm.engineeringForMessage.unloadTimeLonger = vm.timeFormatConversion(vm.findAllPlanList.planList[index].deliveryVehicleList[i].unloadTimeLonger);
                            vm.engineeringForMessage.waitTimeLonger = vm.timeFormatConversion(vm.findAllPlanList.planList[index].deliveryVehicleList[i].waitTimeLonger);
                            vm.engineeringForMessage.deliveryId = vm.findAllPlanList.planList[index].deliveryVehicleList[i].deliveryId;
                            vm.engineeringInformation.push(vm.engineeringForMessage);
                        }
                        vm.setPositionBot(0);
                    }else{
                        vm.showMessageModal("当前计划暂无发货单")
                    }
                } else {
                    vm.engineeringInformation = [];
                    vm.engineeringInformation.push(vm.findAllPlanList.planList[index].deliveryVehicleList[nextIndex]);
                }
            },
            /**
             * 点击查询车辆编号模糊查询
             * nx
             */
            clickSearchFuzzyResults: function(carObj) {
                this.selectCarObj = {};
                vm.isShowSearchResult = 0;
                vm.isOptionShow = 0;
                this.selectCarObj = carObj;
                this.searchFrameContent = carObj.number;
                $("#select_input").focus();
            },
            /**
             * 点击向上
             * nx
             */
            contentUp: function(ev) {

            },
            /**
             * 点击向下
             * nx
             */
            contentDown: function(ev) {
                if(ev.keyCode === 8) {
                    this.isOptionShow = 1;
                    this.selectCarObj = {};
                }
            },
            /**
             * 点击回车
             * nx
             */
            contentEnter: function(ev) {
                if(this.isShowSearchResult == 0 && this.selectCarObj.planNumber) {
                    this.planMessageClick(this.selectCarObj.planNumber,this.selectCarObj.index,this.selectCarObj.nextIndex);
                    $("#select_input").blur();
                } else if(this.searchFrameContent) {
                    vm.showMessageModal("没有选择搜索内容");
                } else {
                    vm.showMessageModal("没有填写搜索内容");
                }
            },
            /**
             * 点击放大镜
             */
            clickZoom: function() {
                vm.inputSearchOnBlur()
                if(this.selectCarObj.number || vm.searchFrameContent) {
                    vm.clickZoomByCarNumber();
                }else{
                    vm.showMessageModal("请输入车辆编号");
                }
            },
            /**
             *
             */
            clickZoomByCarNumber:function(){
                vm.searchForMapByCarNumber.vehicleNumber = '';
                vm.searchForMapByCarNumber.vehicleId = '';
                $("#select_input").blur();
                let flag = false;
                this.mapResult.productionVehicleBeans.forEach((c)=>{
                    if (c.number == vm.searchFrameContent) {
                        vm.searchForMapByCarNumber.vehicleNumber = c.number;
                        vm.searchForMapByCarNumber.vehicleId = c.schedulingProductionVehicleId;
                        vm.setMapCenterByCarNumber(vm.searchForMapByCarNumber.vehicleId);
                        vm.getEngineeringByCarNumber(vm.searchForMapByCarNumber);
                        flag = true;
                        return;
                    }
                })
                if (flag == false){
                    vm.showMessageModal("没有匹配的车辆信息");
                }
            },
            /**
             * 根据车辆信息查询发货单信息
             * @param obj
             */
            getEngineeringByCarNumber:function(obj){
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findDeliveryByVehicleId',
                    type: 'post',
                    data: httpEncode(JSON.stringify(obj)),
                    success: function(data) {
                        if (JSON.parse(data).code == 200){
                            let result = decryptByDESModeCBCzhang(data);
                            vm.engineeringInformation = [];
                            vm.engineeringForMessage = {};
                            vm.engineeringForMessage.driverName = JSON.parse(result).driverName;
                            vm.engineeringForMessage.driverPhone = JSON.parse(result).driverPhone;
                            vm.engineeringForMessage.number = JSON.parse(result).vehicleNumber;
                            vm.engineeringForMessage.plateNumber = JSON.parse(result).plateNumber;
                            vm.engineeringForMessage.productionQuantity = JSON.parse(result).productionQuantity;
                            vm.engineeringForMessage.vehicleId = vm.searchForMapByCarNumber.vehicleId;
                            vm.engineeringForMessage.vehicleStatus = JSON.parse(result).vehicleStatus;
                            vm.engineeringForMessage.connectStatus = JSON.parse(result).connectStatus;
                            vm.engineeringForMessage.constructionTimeIn = JSON.parse(result).constructionTimeIn;
                            vm.engineeringForMessage.deliverVehicleStatus = JSON.parse(result).deliverVehicleStatus;
                            vm.engineeringForMessage.deliveryTime = JSON.parse(result).deliveryTime;
                            vm.engineeringForMessage.dischargeStartTime = JSON.parse(result).dischargeStartTime;
                            vm.engineeringForMessage.dischargeEndTime = JSON.parse(result).dischargeEndTime;
                            vm.engineeringForMessage.expectedToArriveTime = JSON.parse(result).expectedToArriveTime;
                            vm.engineeringForMessage.productionQuantity = JSON.parse(result).productionQuantity;
                            vm.engineeringForMessage.signTheState = JSON.parse(result).signTheState;
                            vm.engineeringForMessage.speed = JSON.parse(result).speed;
                            vm.engineeringForMessage.timeOut = JSON.parse(result).timeOut;
                            vm.engineeringForMessage.unloadTimeLonger = vm.timeFormatConversion(JSON.parse(result).unloadTimeLonger);
                            vm.engineeringForMessage.waitTimeLonger = vm.timeFormatConversion(JSON.parse(result).waitTimeLonger);
                            vm.engineeringForMessage.deliveryId = JSON.parse(result).deliveryId;
                            vm.engineeringInformation.push(vm.engineeringForMessage);
                            Vue.nextTick(function () {
                                vm.setPositionBot(0);
                            })
                        }else{
                            vm.engineeringInformation = [];
                            vm.engineeringForMessage = {};
                            vm.getEngineeringList();
                        }
                    },
                });
            },
            /**
             * 车辆搜索失去焦点事件
             */
            inputSearchOnBlur:function(){
                $('#select_input').blur(function () {
                    $('#map_search_result').hide();
                })
            },
            /**
             * 发货单列表
             * @param bot
             */
            setPositionBot:function (bot) {
                $('.invoiceListForPlan').animate({
                    bottom:bot+'px',
                },200)
            },
            /**
             * 点击工地marker
             * @param bot
             */
            setPositionRight:function (r,projectId) {
                let proID = projectId;
                vm.engineeringForInit.engineeringCarSum = 0;
                if (vm.engineeringListForInit && vm.engineeringListForInit.projectInfoBeans){
                    vm.engineeringListForInit.projectInfoBeans.forEach((p)=>{
                        if (p.projectId == projectId) {
                            vm.engineeringForInit.projectPlanList = p.projectPlanList;
                            vm.engineeringForInit.projectName = p.projectName;
                            vm.engineeringForInit.projectId = p.projectId;
                            if (vm.engineeringForInit.projectPlanList){
                                for (let i = 0;i<vm.engineeringForInit.projectPlanList.length;i++){
                                    vm.engineeringForInit.engineeringCarSum += vm.engineeringForInit.projectPlanList[i].projectDeliveryList.length ;
                                }
                            }
                        }
                    })
                }
                $('.engineeringMessageClickMarker').animate({
                    right:r+'px',
                },350)
            },
            /**
             * 工程详情信息的上拉关闭  下拉打开
             */
            takeUpProjectMessage:function (planNumber) {
                $('.'+planNumber+'taskDownProjectionMes').stop(true, false).slideToggle(200);
                if (!vm.taskUpProjectionFlag){
                    $('.'+planNumber+'taskDownProjectionImg').attr('src','img/top-la.svg');
                    vm.taskUpProjectionFlag = true;
                }else{
                    $('.'+planNumber+'taskDownProjectionImg').attr('src','img/bottom-la.svg');
                    vm.taskUpProjectionFlag = false;
                }
            },
            /**
             * 路线  围栏模糊查询的重置按钮
             */
            addReset:function () {
                vm.searchPlanAll = '';
                vm.searchPlanLine = '';
            },
            /**
             * 点击车辆定位标识  设置地图的中心点为当前点击的车辆
             * @param carNumber 车辆编号
             */
            setMapCenterByCarNumber:function (carID) {
                let pos = vm.getMarkerPosition(carID);
                setMapCenter(pos);
            },
            /**
             * 传入一个唯一标识   获取到的marker的位置
             * @param number 唯一标识
             * @returns {*} 返回位置
             */
            getMarkerPosition:function (number) {
                let pos;
                if (markerArray.length != 0 && markerArray != []){
                    markerArray.forEach((marker)=>{
                        if (marker.getExtData() == number){
                            pos = marker.getPosition();
                        }
                    });
                }
                return pos;
            },
            /**
             *
             * 提示模态框
             * @param msg
             */
            showMessageModal: function(msg) {
                vm.executeResultMessage = msg;
                $("#executeResultMessageForm").modal("show");
                setTimeout(function() {
                    $("#executeResultMessageForm").modal("hide");
                }, 2000);
            },
            /**
             * 默认显示当前站点围栏  工地围栏   车辆位置
             */
            findMapAllSearch:function(){
                $('#waitAnimate').modal('show');
                var param = '{"flag":"0"}';
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findMapAllSearch',
                    type: 'post',
                    data: httpEncode(param),
                    success: function(data) {
                        let resultData = JSON.parse(data);
                        if (resultData.code == 200){
                            setTimeout(function () {
                                let result = decryptByDESModeCBCzhang(data);
                                vm.mapResult = JSON.parse(result);
                                SettingCenterOfMap = vm.mapResult.companyConstructionBean.arrayCompanyCenter;//记录一个中心点
                                setMapCenter(SettingCenterOfMap);
                                new Promise(()=>{
                                    return Promise.resolve(map);
                                }).then(initMarker(4,vm.mapResult.companyConstructionBean.arrayCompanyCenter,vm.mapResult.companyConstructionBean.name,vm.mapResult.companyConstructionBean.companyId,1,false,false))//站点的marker
                                    .then(setFencing(2,vm.mapResult.companyConstructionBean.arrayCompanyContent,'#000000',0))//站点的围栏
                                    .then(vm.constructionMarker(vm.mapResult.projectConstructionBeanList))//工地的marker
                                    .then(vm.constructionSite(vm.mapResult.projectConstructionBeanList))//工地的围栏
                                    .then(vm.multipleVehiclesCarMarker(vm.mapResult.productionVehicleBeans));//所有车辆的marker
                            },100);
                        }
                        Vue.nextTick(function(){
                            $('#waitAnimate').modal('hide');
                        })
                    },
                    error:function (data) {
                        //vm.showMessageModal("地图初始化错误!");
                    }
                });
            },
            /**
             * 多个工地的围栏
             * @param arr
             */
            constructionSite:function (arr) {
                for (let i = 0,max = arr.length ;i < max; i++){
                    setFencing(1,arr[i].arrayProjectContent,'#0000ff',arr[i].projectId);
                }
            },
            /**
             * 多个工地的marker
             * @param arr
             */
            constructionMarker:function(arr){
                for (let i=0,max = arr.length;i<max;i++){
                    initMarker(2,arr[i].arrayProjectCenter,arr[i].name,arr[i].projectId,2,false,true);
                }
                vm.markerClickListener();
            },
            /**
             * 当前站点------工地的   所有车辆的marker
             */
            multipleVehiclesCarMarker:function (carArr) {
                vm.isFirstCarStatusFlag = [];
                if (carArr != [] && carArr.length != 0){
                    for (let i = 0,max = carArr.length;i<max;i++) {
                        vm.isFirstCarStatusFlag.push({
                            carID:carArr[i].schedulingProductionVehicleId,
                            carStatus:true
                        });
                        let carInfoMarker = {
                            position: [Number(carArr[i].lngAmap), Number(carArr[i].latAmap)],
                            carNum: carArr[i].number,
                            angleCar:0,
                            extData:carArr[i].schedulingProductionVehicleId
                        }
                        initCar(carArr[i].connectStatus,carInfoMarker);
                        if (carArr[i].connectStatus == 1){ //在线
                            vm.isFirstCarStatusFlag[i].carStatus = false;
                            vm.isFirstCarStatusFlag[i].carID = carArr[i].schedulingProductionVehicleId;
                        }
                    }
                }
                markerClick();
            },
            /**
             *内容区的显示和隐藏
             * @param clazz
             */
            contentIsShowOrHide: function (clazz) {
                if ($(clazz).is(':hidden')) { //显示
                    if (clazz == '.plansList' || clazz == '.carList'){
                        vm.readMapForPlanAll();  //重新读取地图信息 并显示出来
                    }
                    if (clazz == '.routePlanning' || clazz == '.fencePlanning'){
                        vm.clearFindMapAllSearchForMap();//清空初始化出的覆盖物
                    }
                    $(clazz).animate({
                        'width': '350px'
                    }, 200).show().siblings().animate({
                        'width': '0px'
                    }, 200).hide();
                } else {   //隐藏
                    if (clazz == '.routePlanning' || clazz == '.fencePlanning' || clazz =='.carList' || clazz =='.plansList'){
                        vm.readMapForPlanAll();  //重新读取地图信息 并显示出来
                    }
                    $(clazz).animate({
                        'width': '0px'
                    }, 200, function () {
                        $(this).hide();
                    });
                }
            },
            /**
             * 侧边控制按钮的点击
             * @param flag
             */
            informationDisplayOrHide: function (flag,mes,otherID) {
                if (flag == 1) {
                    vm.contentIsShowOrHide('.messageList');
                } else if (flag == 2) {
                    vm.contentIsShowOrHide('.plansList');
                } else if (flag == 3) {
                    vm.contentIsShowOrHide('.planMessage');
                    vm.findPlanDataByPlanNumber(mes);
                    vm.clearFindMapAllSearchForMap();//清空初始化出的覆盖物
                } else if (flag == 4) {
                    vm.engineeringLineMessage = '';
                    vm.contentIsShowOrHide('.routePlanning');
                    // vm.clearMapForLine();//清除路线
                } else if (flag == 5) {
                    vm.engineeringMessage = {};
                    vm.confirmEnclosure = false;
                    vm.contentIsShowOrHide('.fencePlanning');
                } else if (flag == 6) {
                    vm.contentIsShowOrHide('.carList');
                    if(vm.isNoShowModel) {
                        vm.isNoShowModel = 0;
                    } else {
                        vm.isNoShowModel = 1;
                        vm.searchCarList();
                    }
                } else if (flag == 7) {
                    vm.currentPlanNumberId = otherID;
                    vm.contentIsShowOrHide('.planCarMessage');
                    vm.findPlanDataByCarNumber(mes);
                    vm.findPlanDataByCarNumberForRoute(mes);
                    vm.clearFindMapAllSearchForMap();//清空初始化出的覆盖物
                }else if (flag == 8) {
                    $('#showEngineeringModalStatistics').modal('show')
                    vm.statisticsServerFn();
                }
            },
            /**
             * 重新读取初始化的地图围栏  marker信息  并显示出来
             */
            readMapForPlanAll:function(){
                if (findAllConstructionMarker !== []){
                    for (let i = 0,max = findAllConstructionMarker.length;i<max;i++) {
                        findAllConstructionMarker[i].show();
                    }
                }
                //站点的围栏
                if (siteEnclosureArray !== []){
                    for (let i = 0,max = siteEnclosureArray.length;i<max;i++) {
                        siteEnclosureArray[i].show();
                    }
                }
                //初始化的工地的marker
                if (WebSocketCarMarker !== []) {
                    for (let i = 0,max = WebSocketCarMarker.length;i<max;i++) {
                        WebSocketCarMarker[i].show();
                    }
                }
                //初始化的工地的围栏
                if (allConstructionPolygon !== []) {
                    for (let i = 0,max = allConstructionPolygon.length;i<max;i++) {
                        allConstructionPolygon[i].show();
                    }
                }
                //初始化的所有车辆的marker
                if(initializationAllCarMarkerArr !== []){
                    for (let i= 0;i<initializationAllCarMarkerArr.length;i++){
                        initializationAllCarMarkerArr[i].show();
                    }
                }
            },
            /**
             * 清除地图覆盖物--->点击计划列表按钮
             */
            clearFindMapAllSearchForMap:function () {
                if (findAllConstructionMarker !== []){
                    for (let i = 0,max = findAllConstructionMarker.length;i<max;i++) {
                        findAllConstructionMarker[i].hide();
                    }
                }
                //站点的围栏
                if (siteEnclosureArray !== []){
                    for (let i = 0,max = siteEnclosureArray.length;i<max;i++) {
                        siteEnclosureArray[i].hide();
                    }
                }
                //初始化的工地的marker
                if (WebSocketCarMarker !== []) {
                    for (let i = 0,max = WebSocketCarMarker.length;i<max;i++) {
                        WebSocketCarMarker[i].hide();
                    }
                }
                //初始化的工地的围栏
                if (allConstructionPolygon !== []) {
                    for (let i = 0,max = allConstructionPolygon.length;i<max;i++) {
                        allConstructionPolygon[i].hide();
                    }
                }
                //初始化的所有车辆的marker
                if(initializationAllCarMarkerArr !== []){
                    for (let i= 0;i<initializationAllCarMarkerArr.length;i++){
                        initializationAllCarMarkerArr[i].hide();
                    }
                }
            },
            /**
             * 查询所有车辆------>所有车辆
             */
            searchCarList:function(){
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findVehicleList',
                    type: 'post',
                    success: function(data) {
                        let res = JSON.parse(data);
                        if (res.code == 200 ){
                            setTimeout(function () {
                                let resultData = decryptByDESModeCBCzhang(data);
                                vm.findVehicleList = JSON.parse(resultData);
                            },100);
                        }else{
                            if(vm.isNoShowModel) {
                                vm.showMessageModal("未查询到数据!")
                            }
                        }
                    },
                    error:function (data) {
                        // vm.showMessageModal("车辆初始化错误!")
                    }
                });
            },
            /**
             * 对车辆根据可用和停用进行分类
             */
            alassificationCar:function (allCarArr) {
                if (allCarArr != []){
                    for (let i = 0,max = allCarArr.list.length;i<max;i++){
                        if (allCarArr.list[i].vehicleStatus == 1){
                            vm.availableCarArr.push(allCarArr.list[i]);
                        }else{
                            vm.disableCarArr.push(allCarArr.list[i]);
                        }
                    }
                }
            },
            /**
             * 查询所有的工程------线路用
             */
            allEngineeringLine:function(){
                vm.findGCList.flag = 1;
                vm.findGCList.pageIndex = vm.mapProjectNameCurrentPage ;
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findProjectList',
                    type: 'post',
                    data: httpEncode(JSON.stringify(vm.findGCList)),
                    success: function(data) {
                        let res = JSON.parse(data);
                        if (res.code == 200){
                            let resultData = decryptByDESModeCBCzhang(data);
                            vm.engineeringListOrLine = JSON.parse(resultData);
                            vm.mapProjectNameCurrentPage = vm.engineeringListOrLine.pageNum;
                            vm.mapProjectNameTotalPages = vm.engineeringListOrLine.pages;
                            vm.mapProjectNameTotalElements = vm.engineeringListOrLine.totalPages;
                        }
                    }
                });
            },
            /**
             * 查询所有发货单列表
             */
            findPlanList:function(){
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findPlanList',
                    type: 'post',
                    success: function(data) {
                        let res = JSON.parse(data);
                        if (res.code == 200){
                            let resultData = decryptByDESModeCBCzhang(data);
                            vm.findAllPlanList = JSON.parse(resultData);
                            if (vm.findAllPlanList && vm.findAllPlanList.planList.length != 0){
                                for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                                    vm.findAllPlanList.planList[i].deliverySupplyQuantity = vm.isPlanDetailsByCarNumber(vm.findAllPlanList.planList[i].deliverySupplyQuantity);
                                }
                            }
                        }
                    },
                    error:function (data) {
                        // vm.showMessageModal("发货单初始化错误!")
                    }
                });
            },
            /**
             * 初始化所有工程信息
             */
            findEngineeringMessage:function () {
                $.ajax({
                    url:URL_ADDRESS+'scheduleMap/findProjectInfoList',
                    type:'post',
                    success:function (data) {
                        let res = decryptByDESModeCBCzhang(data);
//                        //console.log(res);
                        vm.engineeringListForInit = JSON.parse(decryptByDESModeCBCzhang(data));
                    },
                    error:function (data) {

                    }
                })
            },
            /**
             * 根据计划编号查询发货单详细信息
             */
            findPlanDataByPlanNumber:function(mes){
                if (vm.findAllPlanList.planList.length !== 0 && vm.findAllPlanList.planList !== []){
                    for (let i = 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].planNumber == mes){
                            vm.planDetails.list = [];
                            vm.planDetails.list.push(vm.findAllPlanList.planList[i]);
                        }
                    }
                }
            },

            /**
             * 根据车辆编号查询计划信息
             */
            findPlanDataByCarNumber:function(mes){
                vm.findPlanCarId.carNumber = mes;
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findPlanDataByCarNumber',
                    type: 'post',
                    data: httpEncode(JSON.stringify(vm.findPlanCarId)),
                    success: function(data) {
                        let res = JSON.parse(data);
                        if (res.code == 200){
                            var resultData = decryptByDESModeCBCzhang(data);
                            vm.planDetailsByCarNumber = JSON.parse(resultData);
                            vm.planDetailsByCarNumber.productionQuantity = vm.isPlanDetailsByCarNumber(vm.planDetailsByCarNumber.productionQuantity);
                        }
                    }
                });
            },
            /**
             * 判断发货量是否是小数
             */
            isPlanDetailsByCarNumber:function (num) {
                if (num != ''){
                    let arr = num.split(".");
                    if (arr[1] == "00"){
                        num = arr[0];
                    }
                    return parseFloat(num).toFixed(1);
                }else{
                    num = 0;
                    return num;
                }
            },
            /**
             * 根据车辆编号----->查询车辆的路线
             */
            findPlanDataByCarNumberForRoute:function (mes) {
                vm.clearFindMapAllSearchForMap();
                vm.findPlanByCarID.vehicleNum = mes;
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findVehicleSearch',
                    type: 'post',
                    data: httpEncode(JSON.stringify(vm.findPlanByCarID)),
                    success: function(data) {
                        let res = JSON.parse(data);
                        if (res.code == 200){
                            let resultData = decryptByDESModeCBCzhang(data);
                            vm.planDetailsByCarNumberRoute = JSON.parse(resultData).productionVehicleBeans[0];
                            vm.planAndEngineeringByCarNumberForMap = JSON.parse(resultData);
                            let arr = [];
                            arr.push(vm.planDetailsByCarNumberRoute.lngAmap);
                            arr.push(vm.planDetailsByCarNumberRoute.latAmap);
                            onePlanAllCarArr = [];
                            let flag = vm.isCurrentCarMarkerForMap(vm.planDetailsByCarNumberRoute.number);
                            if (flag){
                                initMarker(7,arr,vm.planDetailsByCarNumberRoute.number,3,4);
                            }
                            initMarker(7,vm.planAndEngineeringByCarNumberForMap.projectConstructionBean.arrayProjectCenter,vm.planAndEngineeringByCarNumberForMap.projectConstructionBean.name,2,2);
                            initMarker(7,vm.planAndEngineeringByCarNumberForMap.companyConstructionBean.arrayCompanyCenter,vm.planAndEngineeringByCarNumberForMap.companyConstructionBean.name,1,1);
                            setFencing(7,vm.planAndEngineeringByCarNumberForMap.projectConstructionBean.arrayProjectContent,"#0000ff",0);
                            setFencing(7,vm.planAndEngineeringByCarNumberForMap.companyConstructionBean.arrayCompanyContent,"#000000",0);
                        }
                    }
                });
            },
            /**
             * 点击车辆编号   判断里面  GPS信息生成的marker里面有没有当前的车辆marker
             * @param carNumber
             * @returns {boolean}
             */
            isCurrentCarMarkerForMap:function (carNumber) {
                if (markerArray.length != 0){
                    for (let i = 0,max = markerArray.length;i<max;i++){
                        if (markerArray[i].getExtData() == carNumber){ //里面有这个marker  不新建
                            return false;
                        }else{    //没有这个marker   新建一个marker
                            return true;
                        }
                    }
                }else{
                    return true;
                }
            },
            /**
             * 天气  PM2.5
             * @param oCity
             */
            getWeatherInfo: function (oCity) {
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findWeatherInfo',
                    type: 'post',
                    success: function(data) {
                        var resultData = JSON.parse(data);
                        if (resultData.code == 200){
                            var result = decryptByDESModeCBCzhang(data);
                            //console.log(result);
                            var first = JSON.parse(result).realTimeTemperature.indexOf(')');
                            var last = JSON.parse(result).realTimeTemperature.indexOf('(');
                            vm.pm25 = JSON.parse(result).pm25; // pm2.5
                            vm.weatherPicture = JSON.parse(result).dayPictureUrl;//天气图片
                            vm.temperature = JSON.parse(result).realTimeTemperature; // 天气温度
                        }
                    },
                    error:function (data) {
                        // vm.showMessageModal("天气情况初始化错误!")
                    }
                });
            },
            /**
             * 传入的所有计划中车辆的预计时间进行转化
             * @param arr
             * @returns {*}
             */
            timeReturnFormat:function (arr) {
                if (arr != []){
                    for (let i = 0, max = arr.length;i<max;i++){
                        for (let j = 0, maxJ = arr[i].productionDeliveryBeans.length; j<maxJ;j++){
                            arr[i].productionDeliveryBeans[j].expectedToArriveTime = formatDateTime(arr[i].productionDeliveryBeans[j].expectedToArriveTime);
                        }
                    }
                    return arr;
                }
            },
            /**
             * 单个车辆预计到达时间的转化
             * @param time
             * @returns {*}
             */
            carEstimateTime:function(time){
                let thisTime = new Date().getTime();
                if ((((time - thisTime)/1000)/60).toFixed(0) > 60){
                    vm.estimate = (((((time - thisTime)/1000)/60).toFixed(0))/60).toFixed(2);
                    vm.estimateBig = vm.estimate.split('.');
                }else{
                    vm.estimate = (((time - thisTime)/1000)/60).toFixed(0);
                }
            },
            /**
             * 车辆限行
             */
            carLimitLineMessage:function(){
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findVehicleLimiter',
                    type: 'post',
                    success: function(data) {
                        var resultData = JSON.parse(data);
                        if (resultData.code == 200){
                            let result = decryptByDESModeCBCzhang(data);
                            if (JSON.parse(result).limitLine){
                                vm.trafficRestrictionFirst = JSON.parse(result).limitLine.substr(0, 1);
                                vm.trafficRestrictionLast = JSON.parse(result).limitLine.substr(-1);
                                vm.controlTitleFlag = true;
                            }else{
                                vm.controlTitleFlag = false;
                            }
                        }
                    },
                    error:function (data) {
                        // vm.showMessageModal("车辆限行初始化错误!")
                    }
                });
            },
            /**
             * 查看车辆轨迹----点击查看轨迹-----查看车辆轨迹
             */
            seeCarTrajectory:function (vehicleID) {
                vm.queryRouteByVehicleID.vehicleID = vehicleID;
                vm.queryRouteByVehicleID.deliveryID = vm.currentPlanNumberId;
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findVehicleTrajectory',
                    type: 'post',
                    data: httpEncode(JSON.stringify(vm.queryRouteByVehicleID)),
                    success: function(data) {
                        let res = JSON.parse(data);
                        if (res.code == 200){
                            let resultData = decryptByDESModeCBCzhang(data);
                            setCarTrackBackPath(2,JSON.parse(resultData)[0].trajectory);
                        }else if(res.code == 300){
                            vm.showMessageModal(res.message);
                        }
                    }
                });
            },
            /**
             * 关闭当前操作框
             * @param clazz
             */
            closeThis: function (clazz) {
                $(clazz).hide();
                if (clazz == '.fencePlanning'){
                    vm.readMapForPlanAll();
                }
                vm.isNoShowModel = 0;
            },
            /**
             * 打开路线工程模态框
             */
            showEngineeringModal: function () {
                $('#showEngineeringModal').modal('show');
                vm.addReset();
                vm.allEngineeringLine();
            },
            /**
             * 打开围栏工程模态框
             */
            showEnclosureModal: function () {
                $('#showEnclosureModal').modal('show');
                vm.loadFlagModalup = false;
                vm.findGCList.flag = 0;
                vm.findGCList.pageIndex = vm.mapProjectNameCurrentPage ;
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findProjectList',
                    type: 'post',
                    data: httpEncode(JSON.stringify(vm.findGCList)),
                    success: function(data) {
                        let res = JSON.parse(data);
                        if (res.code == 200){
                            let resultData = decryptByDESModeCBCzhang(data);
                            //console.log(resultData);
                            vm.engineeringList = JSON.parse(resultData);
                            vm.mapProjectNameCurrentPage = vm.engineeringList.pageNum;
                            vm.mapProjectNameTotalPages = vm.engineeringList.pages;
                            vm.mapProjectNameTotalElements = vm.engineeringList.totalPages;
                        }else if (res.code == 300){
                            vm.showMessageModal("没有查询到相关数据!");
                        }
                        Vue.nextTick(function () {
                            vm.loadFlagModalup = true;
                        })
                    },
                    error:function (data) {
                        // vm.showMessageModal("工程读取失败!")
                    }

                });
            },
            /**
             * 关闭工程模态框
             * @param flag  标识->关闭的是那个模态框
             */
            engineeringModelClose:function(flag){
                vm.addReset();
                if (flag == 1){//围栏
                    vm.mapProjectNameCurrentPage = 1;
                    vm.findGCList.projectName = '';
                }
            },
            /**
             * 路线模态框的确定
             */
            determineTheProject: function () {
                vm.confirmRoute = true;
                vm.engineeringLineMessage = vm.engineeringListOrLine.list[vm.engineeringLineIndex];
                vm.clearMapForPloyInChoiceBtn();
                if (vm.engineeringLineMessage.lineID == ""){  //没有路线ID的情况下
                    vm.planPloyLineInsertOrUpdateFlag = 1;//新增
                    vm.findLineStartingPoint(); //根据工程ID查询路线信息
                }else{ //有路线的情况下
                    vm.findLineInfoById()// 根据路线ID查询路线信息
                    vm.planPloyLineInsertOrUpdateFlag = 2;//修改
                }
            },
            /**
             * 有路线ID的情况下  根据路线ID查询路线信息
             */
            findLineInfoById:function () {
                vm.searchLineByLineID.lineID = vm.engineeringLineMessage.lineID;
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findLineInfoById',
                    type: 'post',
                    data: httpEncode(JSON.stringify(vm.searchLineByLineID)),
                    success: function(data) {
                        let res = decryptByDESModeCBCzhang(data);
                        vm.searchLineByLineIDMessage = JSON.parse(res);
                        let lineArr = [];
                        if (res) {
                            if (vm.searchLineByLineIDMessage.arrayLineContent && vm.searchLineByLineIDMessage.arrayLineContent.length > 0) {
                                vm.searchLineByLineIDMessage.arrayLineContent.forEach(function(lc) {
                                    lineArr.push(new AMap.LngLat(lc[0], lc[1]));
                                });
                            }
                            lineArr.unshift(new AMap.LngLat(vm.searchLineByLineIDMessage.arrayCompanyCenter[0], vm.searchLineByLineIDMessage.arrayCompanyCenter[1]));
                            lineArr.push(new AMap.LngLat(vm.searchLineByLineIDMessage.arrayProjectCenter[0], vm.searchLineByLineIDMessage.arrayProjectCenter[1]));

                        } else {
                            lineArr.unshift(new AMap.LngLat(vm.searchLineByLineIDMessage.arrayCompanyCenter[0], vm.searchLineByLineIDMessage.arrayCompanyCenter[1]));
                            lineArr.push(new AMap.LngLat(vm.searchLineByLineIDMessage.arrayProjectCenter[0], vm.searchLineByLineIDMessage.arrayProjectCenter[1]));
                        }
                        newLine = SetPlanDriving(lineArr,function (arr) {
                            let lineArr = arr;
                            vm.updatePlanPolyLieContent = '';
                            lineArr.forEach(function (mnpcl) {
                                vm.updatePlanPolyLieContent += mnpcl.lng + "," + mnpcl.lat + ";";
                            })
                        });
                    }
                });
            },
            /**
             * 路线模态框关闭
             */
            closeDriverNameModal:function(){
                $("#showEngineeringModal").modal('hide');
            },
            /**
             * 根据工程ID查询线路的起始点
             */
            findLineStartingPoint:function () {
                vm.engineeringLineById.projectID = vm.engineeringLineMessage.projectID;
                $.ajax({
                    url: URL_ADDRESS+'scheduleMap/findLineStartingPoint',
                    type: 'post',
                    data: httpEncode(JSON.stringify(vm.engineeringLineById)),
                    success: function(data) {
                        let res = JSON.parse(data);
                        if (res.code == 200){
                            let resultData = decryptByDESModeCBCzhang(data);
                            vm.engineeringLineStartAndEnd = JSON.parse(resultData);
                            vm.engineeringLineMessage.lineName = vm.engineeringLineStartAndEnd.projectConstructionBean.name;
                            newLine = SetPlanDriving([new AMap.LngLat(vm.engineeringLineStartAndEnd.companyConstructionBean.arrayCompanyCenter[0],vm.engineeringLineStartAndEnd.companyConstructionBean.arrayCompanyCenter[1]) ,new AMap.LngLat(vm.engineeringLineStartAndEnd.projectConstructionBean.arrayProjectCenter[0],vm.engineeringLineStartAndEnd.projectConstructionBean.arrayProjectCenter[1])],function (arr) {
                                if (arr !== [] && arr.length !== 0) {
                                    let Line = arr;
                                    vm.engineeringLineUpdateObj.content = '';
                                    Line.forEach(function(mnrcl) {
                                        vm.engineeringLineUpdateObj.content += mnrcl.lng + "," + mnrcl.lat + ";";
                                    });
                                }
                            });
                        }
                    }
                });
            },
            /**
             * 路线模态框的保存按钮
             */
            saveOrUpdatePlanLine:function () {
                if(vm.planPloyLineInsertOrUpdateFlag == 1){     //新增路线
                    vm.insertPlanPolyLieByNumber.content = vm.engineeringLineUpdateObj.content;
                    vm.insertPlanPolyLieByNumber.name = vm.engineeringLineMessage.projectName;
                    vm.insertPlanPolyLieByNumber.locationId = vm.engineeringLineStartAndEnd.companyConstructionBean.companyId;
                    vm.insertPlanPolyLieByNumber.projectId = vm.engineeringLineMessage.projectID;
                    vm.insertPlanPolyLieByNumber.locationFenceId = vm.engineeringLineStartAndEnd.companyConstructionBean.schedulingCompanyConstructionId;
                    vm.insertPlanPolyLieByNumber.projectFenceId = vm.engineeringLineStartAndEnd.projectConstructionBean.schedulingRailConstructionId;
                    vm.insertPlanPolyLieByNumber.distance = 100;
                    vm.insertPlanPolyLieByNumber.traceLength = 100;
                    vm.insertPlanPolyLieByNumber.createUserId = "1";
                    vm.insertPlanPolyLieByNumber.pathType = "0";
                    $.ajax({
                        url: URL_ADDRESS+'scheduleMap/insertProjectLine',
                        type: 'post',
                        data: httpEncode(JSON.stringify(vm.insertPlanPolyLieByNumber)),
                        success: function(data) {
                            let res = JSON.parse(data);
                            if (res.code == 200){
                                vm.showMessageModal(res.message);
                            }else if (res.code == 300){
                                vm.showMessageModal(res.message);
                            }
                        }
                    });
                }else if (vm.planPloyLineInsertOrUpdateFlag == 2){     //修改
                    vm.updatePlanPolyLieByNumber.content = vm.updatePlanPolyLieContent;
                    vm.updatePlanPolyLieByNumber.name = vm.searchLineByLineIDMessage.lineName;
                    vm.updatePlanPolyLieByNumber.schedulingProjectPathId = vm.searchLineByLineIDMessage.schedulingProjectPathId;
                    vm.updatePlanPolyLieByNumber.distance = vm.searchLineByLineIDMessage.distance;
                    vm.updatePlanPolyLieByNumber.traceLength = vm.searchLineByLineIDMessage.traceLength;
                    vm.updatePlanPolyLieByNumber.modityUserId = '1';
                    vm.updatePlanPolyLieByNumber.pathType = '0';
                    vm.updatePlanPolyLieByNumber.version = vm.searchLineByLineIDMessage.version;
                    $.ajax({
                        url: URL_ADDRESS+'scheduleMap/updateProjectLineById',
                        type: 'post',
                        data: httpEncode(JSON.stringify(vm.updatePlanPolyLieByNumber)),
                        success: function(data) {
                            let res = JSON.parse(data);
                            if (res.code == 200){
                                vm.showMessageModal(res.message);
                            }else if (res.code == 300){
                                vm.showMessageModal(res.message);
                            }
                        }
                    });
                }
                $('.routePlanning').hide();
                vm.clearMapForLine();//清除地图上的路线
                vm.findMapAllSearch();
            },

            /**
             * 2018/4/25
             * 重置按钮---新添加功能
             * nx-start
             */
            /**
             * 计算是否在围栏内
             * @param {Object} obj
             * @defaultvalue 需要传的参数为：polygones： 这是围栏对象， myMarker：这是需要计算的覆盖物是否进入围栏了， 返回值为true是进入围栏，false是没有在围栏内
             */
            isContainsRail: function(obj) {
                return obj.polygones.contains(obj.myMarker.getPosition());
            },
            listenMouse: function() {
                clickFencingBtnWLMarker[0].on('mouseup',(e)=>{
                    vm.isNewPlanPolygon = false;
                    if(vm.isContainsRail({
                            polygones: compileRailPolyEditorNew[0],
                            myMarker: clickFencingBtnWLMarker[0]
                        })) {
                        if(vm.planPolygonFlag == 1) {
                            vm.newLngLat = [e.lnglat.getLng(), e.lnglat.getLat()];
                            vm.engineeringEnclosureById.arrayProjectCenter = [e.lnglat.getLng(), e.lnglat.getLat()];
                        } else {
                            centerPlan = [e.lnglat.getLng(), e.lnglat.getLat()];
                        }
                        vm.isSaveLngLat = 1;
                    } else {
                        if(vm.planPolygonFlag == 1) {
                            vm.newLngLat = [e.lnglat.getLng(), e.lnglat.getLat()];
                            vm.engineeringEnclosureById.arrayProjectCenter = [e.lnglat.getLng(), e.lnglat.getLat()];
                        } else {
                            centerPlan = [e.lnglat.getLng(), e.lnglat.getLat()];
                        }
                        vm.isSaveLngLat = 0;
                    };
                    vm.isReset = 1;
                })
            },
            /**
             * 2018/4/25
             * 重置按钮---新添加功能
             * nx-end
             */
            /**
             * 通过工程ID  找到当前工程下的车辆集合
             * @param projectID 功臣ID
             * @returns {Array}  返回的车辆集合
             */

            getPlanListForCarNumberList:function (projectID) {
                let arr = [];
                if(vm.findAllPlanList.planList.length != 0 && vm.findAllPlanList.planList != []){
                    vm.findAllPlanList.planList.forEach((project)=>{
                        if (project.projectId == projectID){
                            if (project.deliveryVehicleList.length != 0 && project.deliveryVehicleList != []){
                                project.deliveryVehicleList.forEach((car)=>{
                                    arr.push(car.vehicleId);
                                })
                            }
                        }
                    })
                }
                return arr;
            },
            /**
             * 围栏模态框的确定
             */
            enclosureTheProject: function () {
                vm.polygonIsShowFlag = false;
                if (vm.engineeringMessageIndex || vm.engineeringMessageIndex == 0){
                    vm.clearMapForPloyInChoiceBtn();//点击选择按钮---清空地图上的围栏信息
                    vm.confirmEnclosure = true;
                    vm.engineeringMessage = vm.engineeringList.list[vm.engineeringMessageIndex];
                    vm.planEnclosureProjectId.projectID = vm.engineeringMessage.projectID;
                    vm.planCarNumberListByProjectionID = vm.getPlanListForCarNumberList(vm.engineeringMessage.projectID);
                    $.ajax({
                        url: URL_ADDRESS+'scheduleMap/findProjectConstructionByProjectId',
                        type: 'post',
                        data: httpEncode(JSON.stringify(vm.planEnclosureProjectId)),
                        success: function(data) {
                            let resultData = JSON.parse(data);
                            if (resultData.code == 200) { //修改围栏
                                vm.isNewPlanPolygon = false;
                                var result = decryptByDESModeCBCzhang(data);
                                vm.engineeringEnclosureById = JSON.parse(result);
                                map.setCenter(vm.engineeringEnclosureById.arrayProjectCenter);
                                map.setZoom(18);
                                initMarker(6,vm.engineeringEnclosureById.arrayProjectCenter,vm.engineeringEnclosureById.name,vm.engineeringEnclosureById.projectId,2,true,false);
                                /**
                                 * 2018/4/25
                                 * 重置按钮---新添加功能
                                 * nx-start
                                 */
                                newBiaodianName = vm.engineeringEnclosureById.name;
                                vm.newLngLat = vm.engineeringEnclosureById.arrayProjectCenter;
                                //newWorkLngLatObj = new AMap.LngLat(vm.engineeringEnclosureById.arrayProjectCenter[0], vm.engineeringEnclosureById.arrayProjectCenter[1]);
                                /**
                                 * 2018/4/25
                                 * 重置按钮---新添加功能
                                 * nx-end
                                 */
                                updatePolygon = setFencing(3,vm.engineeringEnclosureById.arrayProjectContent,'#0000ff');
                                updatePolygon .open();
                                vm.planPolygonFlag = 1;
                            }else if(resultData.code == 210){ //新增围栏
                                vm.isNewPlanPolygon = true;
                                positionReturnCoordinate(vm.engineeringMessage.contructAddress,function (arr) {
                                    let defaultArr = [116.287149,39.858427];
                                    let defaultCoordinate;
                                    let defaultLng;
                                    if (typeof arr == 'undefined'){
                                        arr = defaultArr;
                                        defaultLng = new AMap.LngLat(arr[0], arr[1]);
                                        defaultCoordinate = vm.defaultEnclosure(defaultLng); //传入中心点坐标  生成一个默认的围栏坐标
                                        map.setCenter(defaultLng);
                                        centerPlan = defaultLng;
                                    }else{
                                        centerPlan = arr;
                                        map.setCenter(centerPlan);
                                        defaultCoordinate = vm.defaultEnclosure(centerPlan); //传入中心点坐标  生成一个默认的围栏坐标
                                    }
                                    //console.log(defaultCoordinate);
                                    map.setZoom(18);
                                    initMarker(6,arr,vm.engineeringMessage.projectName,vm.engineeringMessage.projectID,2,true,false);
                                    vm.newPolygon = setFencing(4,defaultCoordinate,"#0000ff",0);//生成一个默认的围栏
                                    vm.newPolygon.open();
                                    /**
                                     * 2018/4/25
                                     * 重置按钮---新添加功能
                                     * nx-start
                                     */
                                    newBiaodianName = vm.engineeringMessage.projectName;
                                    // vm.newLngLat = defaultArr;
                                    /**
                                     * 2018/4/25
                                     * 重置按钮---新添加功能
                                     * nx-end
                                     */
                                });
                                vm.planPolygonFlag = 2;//新增围栏
                            }
                            /**
                             * 2018/4/25
                             * 重置按钮---新添加功能
                             * nx-start
                             */
                            vm.isReset = 1;
                            /**
                             * 2018/4/25
                             * 重置按钮---新添加功能
                             * nx-end
                             */
                            Vue.nextTick(function () {
                                $('#showEnclosureModal').modal('hide');
                            })
                        }
                    });
                }else{
                    vm.showMessageModal("请先选中工程!");
                }
            },
            /**
             * 2018/4/25
             * 重置按钮---新添加功能
             * nx-start
             */
            resetPlanPolygon: function() {
                if(vm.isReset == 1) {
                    vm.clearMapForPloyInChoiceBtn();
                    vm.isSaveLngLat = 1;
                    newWorkLngLatObj = {};
                    if(vm.planPolygonFlag == 1) {
                        newWorkLngLatObj = new AMap.LngLat(vm.newLngLat[0], vm.newLngLat[1]);
                        initMarker(6,vm.newLngLat,newBiaodianName,2,2,true,false);
                        let defaultCoordinate = vm.defaultEnclosure(newWorkLngLatObj);
                        updatePolygon = setFencing(4,defaultCoordinate,"#0000ff",0);//生成一个默认的围栏
                        updatePolygon.open();
                        vm.planPolygonFlag = 1;
                    } else {
                        //console.log(centerPlan);
                        newWorkLngLatObj = new AMap.LngLat(centerPlan[0], centerPlan[1]);
                        initMarker(6,centerPlan,newBiaodianName,0,2,true,false);
                        let defaultCoordinate = vm.defaultEnclosure(newWorkLngLatObj); //传入中心点坐标  生成一个默认的围栏坐标
                        vm.newPolygon = setFencing(4,defaultCoordinate,"#0000ff",0);//生成一个默认的围栏
                        vm.newPolygon.open();
                        vm.planPolygonFlag = 2;//新增围栏
                    }
                    vm.listenMouse();
                } else {
                    vm.showMessageModal("很遗憾，没有坐标");
                }
            },
            /**
             * 2018/4/25
             * 重置按钮---新添加功能
             * nx-end
             */
            /**
             * 点击围栏里面的选择按钮  清空地图围栏信息
             */
            clearMapForPloyInChoiceBtn:function () {
                map.clearMap(updatePolygon);
                map.clearMap(vm.newPolygon);
            },
            /**
             * 清除地图的路线
             */
            clearMapForLine:function () {
                map.clearMap(newLine);
            },
            /**
             * 删除地图上的覆盖物
             * @param obj 对比的对象
             * @param coverArr 覆盖物的数组
             */
            deleteCoverForMap:function (id,coverArr) {
                if (coverArr.length != 0){
                    coverArr.forEach((c,cIndex)=>{
                        if (c.getExtData() == id.vehicleId) {
                            c.setMap(null);
                            coverArr.splice(cIndex,1);
                        }
                    })
                }
            },
            /**
             * 保存围栏
             */
            savePlanPolygon:function () {
                //2018-4-25-nx-修改-start
                if(vm.isSaveLngLat == 1) {
                    //2018-4-25-nx-修改-end
                    if (vm.planPolygonFlag == 1){
                        updatePolygon.on('end',function(data){ //编辑围栏结束后 -> 返回的坐标点数组
                            vm.map_new_rail_compile_lnglat = data.target.Qi.path;
                            vm.map_new_rail_compile_lnglat_str = "";
                            vm.map_new_rail_compile_lnglat.forEach(function(mnrcl) {
                                vm.map_new_rail_compile_lnglat_str += mnrcl.lng + "," + mnrcl.lat + ";";
                            });
                        })
                        updatePolygon.close();
                        vm.updatePlanPolygon.center = vm.engineeringEnclosureById.arrayProjectCenter.toString();
                        vm.updatePlanPolygon.content = vm.map_new_rail_compile_lnglat_str;
                        vm.updatePlanPolygon.schedulingRailConstructionId = vm.engineeringEnclosureById.schedulingRailConstructionId;
                        vm.updatePlanPolygon.name = vm.engineeringEnclosureById.name;
                        vm.updatePlanPolygon.version = vm.engineeringEnclosureById.version;
                        vm.updatePlanPolygon.vehicleIdList = vm.planCarNumberListByProjectionID;
                        $.ajax({
                            url: URL_ADDRESS+'scheduleMap/updateProjectConstructionById',
                            type: 'post',
                            data: httpEncode(JSON.stringify(vm.updatePlanPolygon)),
                            success: function(data) {
                                vm.showMessageModal("修改成功");
                            },
                            error:function (data) {
                                vm.showMessageModal("未知错误!")
                            }
                        });
                        $('.fencePlanning').hide();
                        map.remove(updatePolygon);
                    }else if (vm.planPolygonFlag == 2){   //新增
                        vm.newPolygon.on('end',function(data){ //编辑围栏结束后 -> 返回的坐标点数组
                            vm.map_new_rail_compile_lnglat = data.target.Qi.path;
                            vm.map_new_rail_compile_lnglat_str = "";
                            vm.map_new_rail_compile_lnglat.forEach(function(mnrcl) {
                                vm.map_new_rail_compile_lnglat_str += mnrcl.lng + "," + mnrcl.lat + ";";
                            });
                        })
                        vm.newPolygon.close();
                        vm.newPlanPolygon.projectId = vm.engineeringMessage.projectID;
                        vm.newPlanPolygon.name = vm.engineeringMessage.projectName;
                        vm.newPlanPolygon.center = centerPlan.toString();
                        vm.newPlanPolygon.content = vm.map_new_rail_compile_lnglat_str;
                        vm.newPlanPolygon.vehicleIdList = vm.planCarNumberListByProjectionID;
                        $.ajax({
                            url: URL_ADDRESS+'scheduleMap/insertProjectConstruction',
                            type: 'post',
                            data: httpEncode(JSON.stringify(vm.newPlanPolygon)),
                            success: function(data) {
                                vm.showMessageModal("新增成功");
                            },
                            error:function (data) {
                                vm.showMessageModal("未知错误!")
                            }
                        });
                        $('.fencePlanning').hide();
                        map.remove(vm.newPolygon);
                        vm.newPolygon = [];
                    }
                    vm.isReset = 1;
                    //2018-4-25-nx-修改-start
                    vm.clearMapForPloyInChoiceBtn();
                    clickFencingBtnWLMarker[0].setMap(null);
                    clickFencingBtnWLMarker = [];
                    vm.findMapAllSearch();
                } else {
                    vm.showMessageModal("定位中心点没有在围栏内");
                }
                //2018-4-25-nx-修改-end
                vm.polygonIsShowFlag = true;
            },
            /**
             * 选定选中的一个围栏工程
             * @param index
             */
            selectedProject: function (flag,index) {
                if (flag == 1){//路线的
                    clickHighlightChange(".enclosureProjectLine", index);
                    vm.engineeringLineIndex = index;
                }else if(flag == 2){//围栏的
                    vm.engineeringMessageIndex = index;
                    clickHighlightChange(".enclosureProject", index);
                }
            },

            /**
             * 一个默认的初始化围栏
             * @param obj
             * @returns {Array}
             */
            defaultEnclosure:function(obj){
                //console.log(obj);
                let rail = [];
                rail.push([obj.lng + 0.003, obj.lat]);
                rail.push([obj.lng, obj.lat - 0.003]);
                rail.push([obj.lng - 0.003, obj.lat]);
                rail.push([obj.lng, obj.lat + 0.003]);
                return rail;
            },
            /**
             * 车辆在线 - 离线消息   socket消息
             */
            carStatusUpdate:function (flag,vehicleId,arr) {
                if (arr != [] && arr.length != 0){
                    for (let i = 0,max = arr.length;i<max;i++){
                        if (arr[i].getExtData() == vehicleId){
                            let icon = createCarIcon(flag);
                            arr[i].setIcon(icon);
                        }
                    }
                }
            },
            /**
             * 当车辆断开链接   更新计划列表 中车辆的在线离线状态
             * @param obj
             */
            updatePlanListCarStatusOpen:function (vehicleId,flag) {
                if (vm.findAllPlanList.planList){
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        for (let j = 0,max=vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<max;j++){
                            if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].vehicleId == vehicleId){
                                vm.findAllPlanList.planList[i].deliveryVehicleList[j].connectStatus = flag;
                            }
                        }
                    }
                }
            },
            /**
             * 当车辆断开链接   更新发货单表 中车辆的在线离线状态
             * @param obj
             */
            updateDeliveryCarStatusOpen:function (vehicleId,flag) {
                if (vm.engineeringInformation){
                    let newConnectStatus;
                    vm.engineeringInformation.forEach((e,index)=>{
                        if (e.vehicleId == vehicleId){
                            newConnectStatus = flag;
                            vm.engineeringInformation.$set(index,{
                                expectedToArriveTime:vm.engineeringInformation[index].expectedToArriveTime,
                                deliverVehicleStatus:vm.engineeringInformation[index].deliverVehicleStatus,
                                deliveryId : vm.engineeringInformation[index].deliveryId,
                                number : vm.engineeringInformation[index].number,
                                driverName :vm.engineeringInformation[index].driverName,
                                driverPhone:vm.engineeringInformation[index].driverPhone,
                                plateNumber:vm.engineeringInformation[index].plateNumber,
                                productionQuantity:vm.engineeringInformation[index].productionQuantity,
                                vehicleId:vm.engineeringInformation[index].vehicleId,
                                vehicleStatus:vm.engineeringInformation[index].vehicleStatus,
                                connectStatus:newConnectStatus,
                                constructionTimeIn:vm.engineeringInformation[index].constructionTimeIn,
                                deliveryTime:vm.engineeringInformation[index].deliveryTime,
                                dischargeStartTime:vm.engineeringInformation[index].dischargeStartTime,
                                dischargeEndTime:vm.engineeringInformation[index].dischargeEndTime,
                                signTheState:vm.engineeringInformation[index].signTheState,
                                speed:vm.engineeringInformation[index].speed,
                                timeOut:vm.engineeringInformation[index].timeOut,
                                unloadTimeLonger:vm.engineeringInformation[index].unloadTimeLonger,
                                waitTimeLonger:vm.engineeringInformation[index].waitTimeLonger
                            })
                        }
                    })
                }
            },
            /**
             * 离线后再次上线消息 ---  发货单
             * @param obj  信息
             */
            updateDeliveryVehicleCarStatus:function (obj) {
                if (vm.engineeringInformation){
                    vm.engineeringInformation.forEach((e,index)=>{
                        if (e.deliveryId == obj.deliveryId){
                            vm.engineeringInformation.$set(index,{
                                expectedToArriveTime:vm.engineeringInformation[index].expectedToArriveTime,
                                deliverVehicleStatus:obj.status, //状态
                                deliveryId : vm.engineeringInformation[index].deliveryId,
                                number : vm.engineeringInformation[index].number,
                                driverName :vm.engineeringInformation[index].driverName,
                                driverPhone:vm.engineeringInformation[index].driverPhone,
                                plateNumber:vm.engineeringInformation[index].plateNumber,
                                productionQuantity:vm.engineeringInformation[index].productionQuantity,//发货方量
                                vehicleId:vm.engineeringInformation[index].vehicleId,
                                vehicleStatus:vm.engineeringInformation[index].vehicleStatus,
                                connectStatus:vm.engineeringInformation[index].connectStatus,
                                constructionTimeIn:obj.timeIn ? obj.timeIn : vm.engineeringInformation[index].constructionTimeIn,//进工地
                                deliveryTime:vm.engineeringInformation[index].deliveryTime,
                                dischargeStartTime:obj.loadingStartTime ? obj.loadingStartTime : vm.engineeringInformation[index].dischargeStartTime,//卸料开始
                                dischargeEndTime:obj.loadingEndTime ? obj.loadingEndTime : vm.engineeringInformation[index].dischargeEndTime,//卸料结束
                                signTheState:vm.engineeringInformation[index].signTheState,
                                speed:vm.engineeringInformation[index].speed,
                                timeOut:obj.timeOut,//出站
                                unloadTimeLonger: vm.returnCalculationCompleteTime(obj.loadingStartTime.substring(11,16),obj.loadingEndTime.substring(11,16)) ? vm.returnCalculationCompleteTime(obj.loadingStartTime.substring(11,16),obj.loadingEndTime.substring(11,16)) : vm.engineeringInformation[index].unloadTimeLonger,//start  end,
                                waitTimeLonger:vm.returnCalculationCompleteTime(obj.timeIn.substring(11,16),obj.loadingStartTime.substring(11,16)) ? vm.returnCalculationCompleteTime(obj.timeIn.substring(11,16),obj.loadingStartTime.substring(11,16)) : vm.engineeringInformation[index].waitTimeLonger//start  end
                            })
                        }
                    })
                }
            },
            /**
             * 离线后重新上线 --- 计划列表
             * @param obj
             */
            updatePlanCarStatusForMessage:function (obj) {
                if (vm.findAllPlanList.planList){
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].planNumber == obj.planNumber){
                            for (let j = 0,max=vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<max;j++){
                                if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliveryId == obj.deliveryId){
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].signTheState = obj.signTheState;
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].timeOut = obj.timeOut;//出站时间
                                    // vm.findAllPlanList.planList[i].deliveryVehicleList[j].signTheState = obj.constructionTimeIn;//出工地时间
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].dischargeStartTime = obj.loadingStartTime;//卸料开始时间
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].dischargeEndTime = obj.loadingEndTime;//卸料完成时间
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].constructionTimeIn = obj.timeIn;//进工地时间
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliverVehicleStatus = obj.status;//状态
                                    if (obj.timeIn != '' && obj.loadingStartTime != ''){
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].waitTimeLonger = vm.returnCalculationCompleteTime(obj.timeIn.substring(11,16),obj.loadingStartTime.substring(11,16));//start  end
                                    }else{
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].waitTimeLonger = '';
                                    }
                                    if (obj.loadingStartTime != '' && obj.loadingEndTime != ''){
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].unloadTimeLonger = vm.returnCalculationCompleteTime(obj.loadingStartTime.substring(11,16),obj.loadingEndTime.substring(11,16));//start  end
                                    }else{
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].unloadTimeLonger = '';
                                    }
                                }
                            }
                        }
                    }
                }
            },
            /**
             * 修改发货单信息  --修改发货单列表里面的发货单信息
             * @param obj
             */
            updateDeliveryForMessage:function(obj){
                if (vm.engineeringInformation){
                    vm.engineeringInformation.forEach((e,index)=>{
                        let newDeliveryQuantity;
                        let newDeliveryVehicleStatus;
                        if (e.deliveryId == obj.deliveryId){
                            newDeliveryQuantity = obj.deliveryQuantity; //发货方量
                            newDeliveryVehicleStatus = obj.deliveryVehicleStatus;
                            vm.engineeringInformation.$set(index,{
                                expectedToArriveTime:vm.engineeringInformation[index].expectedToArriveTime,
                                deliverVehicleStatus:newDeliveryVehicleStatus,
                                deliveryId : vm.engineeringInformation[index].deliveryId,
                                number : obj.carNumber,
                                driverName :obj.driverName,
                                driverPhone:obj.driverPhone,
                                plateNumber:vm.engineeringInformation[index].plateNumber,
                                productionQuantity:newDeliveryQuantity,//发货方量
                                vehicleId:obj.vehicleId,
                                vehicleStatus:vm.engineeringInformation[index].vehicleStatus,
                                connectStatus:vm.engineeringInformation[index].connectStatus,
                                constructionTimeIn:vm.engineeringInformation[index].constructionTimeIn,
                                deliveryTime:obj.deliveryTime,
                                dischargeStartTime:vm.engineeringInformation[index].dischargeStartTime,
                                signTheState:vm.engineeringInformation[index].signTheState,
                                speed:vm.engineeringInformation[index].speed,
                                timeOut:vm.engineeringInformation[index].timeOut,
                                unloadTimeLonger:vm.engineeringInformation[index].unloadTimeLonger,
                                waitTimeLonger:vm.engineeringInformation[index].waitTimeLonger
                            })
                            if (obj.deliveryStatus == 20){
                                vm.engineeringInformation.splice(index,1);
                            }
                        }
                    })
                }
            },
            /**
             * 修改发货单信息  --修改计划列表里面的发货单信息
             * @param obj
             */
            updatePlanDeliveryForMessage:function (obj) {
                if (vm.findAllPlanList.planList){ //     deliverySupplyQuantity
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].planNumber == obj.planNumber){
                            for (let j = 0,max=vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<max;j++){
                                if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliveryId == obj.deliveryId){
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliverVehicleStatus = obj.deliveryVehicleStatus;
                                    if (Number(vm.findAllPlanList.planList[i].deliveryVehicleList[j].productionQuantity) > Number(obj.deliveryQuantity)){
                                        vm.findAllPlanList.planList[i].deliverySupplyQuantity = parseFloat(vm.findAllPlanList.planList[i].deliverySupplyQuantity) - (parseFloat(vm.findAllPlanList.planList[i].deliveryVehicleList[j].productionQuantity) - parseFloat(obj.deliveryQuantity))
                                    }else{
                                        vm.findAllPlanList.planList[i].deliverySupplyQuantity = parseFloat(vm.findAllPlanList.planList[i].deliverySupplyQuantity) + (parseFloat(obj.deliveryQuantity) - parseFloat(vm.findAllPlanList.planList[i].deliveryVehicleList[j].productionQuantity))
                                    }
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].productionQuantity = obj.deliveryQuantity;
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].number = obj.carNumber;
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliveryTime = obj.deliveryTime;
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].driverName = obj.driverName;
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].driverPhone = obj.driverPhone;
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].vehicleId = obj.vehicleId;
                                    if (obj.deliveryStatus == 20){
                                        vm.findAllPlanList.planList[i].deliveryVehicleList.splice(j,1);
                                    }
                                }
                            }
                        }
                    }
                }
            },
            /**
             * 修改发货单消息  工程信息里方量的变化
             * @param obj
             */
            updateEngineeringMessage:function(obj){
                if (vm.engineeringListForInit){
                    vm.engineeringListForInit.projectInfoBeans.forEach((project)=>{
                        if (project.projectId == obj.projectId){
                            project.projectPlanList.forEach((pro)=>{
                                if (pro.planNumber == obj.planNumber){
                                    pro.projectDeliveryList.forEach((plan)=>{
                                        plan.deliverVehicleStatus = obj.deliveryVehicleStatus;
                                        plan.deliveryAllquantity = obj.deliveryQuantity;
                                        plan.shortNumber = obj.carNumber;
                                    })
                                }
                            })
                        }
                    })
                }
                if (vm.engineeringForInit){
                    if(vm.engineeringForInit.projectId == obj.projectId){
                        vm.engineeringForInit.projectDeliveryList.forEach((p)=>{
                            if (p.planNumber == obj.planNumber){
                                p.projectDeliveryList.forEach((c)=>{
                                    if (c.deliveryId == obj.deliveryId){
                                        c.deliveryAllquantity = obj.deliveryQuantity;
                                    }
                                })
                            }
                        })
                    }
                }
            },
            /**
             * 隐藏地图上的覆盖物
             * @param arr 存放覆盖物的数组
             */
            hideMapForMarker:function(arr){
                if (arr != [] && arr.length != 0){
                    arr.forEach((mar)=>{
                        mar.hide();
                    })
                }
            },
            /**
             * 当状态为10的时候   计算出卸料时长
             * @param flag 状态
             * @param obj 信息
             */
            calculationUnloadingTime:function(flag,obj){
                if (vm.findAllPlanList.planList){
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].planNumber == obj.planNumber){
                            for (let j = 0,max=vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<max;j++){
                                if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliveryId == obj.deliveryId){
                                    //console.log("卸料时长")
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliverVehicleStatus = obj.status;
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].dischargeEndTime = obj.currentTime;
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].unloadTimeLonger = vm.returnCalculationCompleteTime(vm.findAllPlanList.planList[i].deliveryVehicleList[j].dischargeStartTime.substring(11,16),obj.currentTime.substring(11,16));
                                }
                            }
                        }
                    }
                }
                if (vm.engineeringInformation){
                    vm.engineeringInformation.forEach((e,index)=>{
                        if (e.deliveryId == obj.deliveryId) {
                            //console.log("发货单  卸料时长")
                            vm.engineeringInformation.$set(index,{
                                expectedToArriveTime:vm.engineeringInformation[index].expectedToArriveTime,
                                deliverVehicleStatus:vm.engineeringInformation[index].deliverVehicleStatus,
                                deliveryId : vm.engineeringInformation[index].deliveryId,
                                deliverVehicleStatus : obj.status,
                                number : vm.engineeringInformation[index].number,
                                driverName :vm.engineeringInformation[index].driverName,
                                driverPhone:vm.engineeringInformation[index].driverPhone,
                                plateNumber:vm.engineeringInformation[index].plateNumber,
                                productionQuantity:vm.engineeringInformation[index].productionQuantity,//发货方量
                                vehicleId:vm.engineeringInformation[index].vehicleId,
                                vehicleStatus:vm.engineeringInformation[index].vehicleStatus,
                                connectStatus:vm.engineeringInformation[index].connectStatus,
                                constructionTimeIn:vm.engineeringInformation[index].constructionTimeIn,
                                deliveryTime:vm.engineeringInformation[index].deliveryTime,
                                dischargeStartTime:vm.engineeringInformation[index].dischargeStartTime,
                                signTheState:vm.engineeringInformation[index].signTheState,
                                speed:vm.engineeringInformation[index].speed,
                                timeOut:vm.engineeringInformation[index].timeOut,
                                unloadTimeLonger:vm.returnCalculationCompleteTime(e.dischargeStartTime.substring(11,16),obj.currentTime.substring(11,16)),
                                waitTimeLonger:vm.engineeringInformation[index].waitTimeLonger,
                                dischargeEndTime:obj.currentTime
                            })
                        }
                    })
                }
                vm.getPlansForCarMessage(flag,obj);
            },
            /**
             * 发货单完成手动回站消息
             * @param obj
             */
            invoiceCompleteBackStation:function(obj){
                if (vm.findAllPlanList.planList){
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].planNumber == obj.planNumber){
                            for (let j = 0,max=vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<max;j++){
                                if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliveryId == obj.deliveryId){
                                    vm.findAllPlanList.planList[i].deliveryVehicleList.splice(j,1);
                                }
                            }
                        }
                    }
                }
                if (vm.engineeringInformation){
                    vm.engineeringInformation.forEach((e,index)=>{
                        if (e.deliveryId == obj.deliveryId) {
                            vm.engineeringInformation.splice(index,1);
                        }
                    })
                }
            },
            /**
             * 计算出卸料时长  并返回
             * @param start
             * @param end
             * @returns {*}
             */
            returnCalculationCompleteTime:function(start,end){
                let timeLength;
                let startArr = start.split(':');
                let endArr = end.split(':');
                if (Number(endArr[0]) - Number(startArr[0]) > 0 && Number(endArr[1]) - Number(startArr[1]) > 0){
                    timeLength = (Number(endArr[0]) - Number(startArr[0]) * 60) + (Number(endArr[1]) - Number(startArr[1]));
                    return timeLength;
                }else if(Number(endArr[0]) - Number(startArr[0]) == 0 && Number(endArr[1]) - Number(startArr[1]) > 0){
                    timeLength = Number(endArr[1]) - Number(startArr[1]);
                    return timeLength;
                }else if (Number(endArr[0]) - Number(startArr[0]) == 1 && Number(endArr[1]) - Number(startArr[1]) < 0){
                    timeLength = (Number(endArr[1]) + 60) - Number(startArr[1]);
                    return timeLength;
                }else if (Number(endArr[0]) - Number(startArr[0]) > 1 && Number(endArr[1]) - Number(startArr[1]) < 0){
                    timeLength = ((Number(endArr[0]) - 1) - Number(startArr[0]) * 60) + (Number(endArr[1]) + 60) - Number(startArr[1]);
                    return timeLength;
                }else if(Number(endArr[0]) == Number(startArr[0])  && Number(endArr[1]) == Number(startArr[1])){
                    timeLength = 0;
                    return timeLength;
                }
            },
            /**
             * 读取发货单时间状态信息   读取到对应的车辆信息   当进入工地  或出 工地时对工程信息进行显示
             * @param obj
             */
            getPlansForCarMessage:function (flag,obj) {
                if (flag == 5) {
                    vm.insertNewEngineering(obj);
                }else{
                    if(vm.engineeringListForInit) {
                        vm.engineeringListForInit.projectInfoBeans.forEach((pro)=>{
                            pro.projectPlanList.forEach((p)=>{
                                if (p.planNumber == obj.planNumber){
                                    p.projectDeliveryList.forEach((car)=>{
                                        if (car.deliveryId == obj.deliveryId){
                                            car.deliverVehicleStatus = obj.status;
                                        }
                                    })
                                }
                            })
                        })
                    }
                }
            },
            /**
             * 工程列表新增一条数据
             */
            insertNewEngineering:function(obj){
                let delivery = {
                    deliverVehicleStatus:'',
                    deliveryAllquantity:'',
                    deliveryId:'',
                    shortNumber:'',
                    signTheState:'',
                    vehicleId:''
                }
                let isInsertFlag = false;
                if (vm.findAllPlanList.planList){
                    vm.findAllPlanList.planList.forEach((plan)=>{
                        if (plan.planNumber == obj.planNumber){
                            plan.deliveryVehicleList.forEach((del)=>{
                                if(del.deliveryId == obj.deliveryId){
                                    //console.log("进入")
                                    delivery.deliverVehicleStatus = obj.status;
                                    delivery.deliveryAllquantity = del.productionQuantity;
                                    delivery.deliveryId = obj.deliveryId;
                                    delivery.shortNumber = del.number;
                                    delivery.vehicleId = del.vehicleId;
                                }
                            })
                        }
                    })
                }
                if(vm.engineeringListForInit) {
                    vm.engineeringListForInit.projectInfoBeans.forEach((pro)=>{
                        pro.projectPlanList.forEach((p)=>{
                            if (p.planNumber == obj.planNumber){
                                if (p.projectDeliveryList.length == 0) {
                                    isInsertFlag = true;
                                }else{
                                    p.projectDeliveryList.forEach((car)=>{
                                        if (car.deliveryId == obj.deliveryId){
                                            isInsertFlag = false;
                                            return;
                                        }else{
                                            isInsertFlag = true;
                                        }
                                    })
                                }
                            }
                            if (isInsertFlag) {
                                p.projectDeliveryList.push(delivery);
                                vm.updateEngineeringSum(pro.projectId,1);
                            }
                        })
                    })
                }
            },

            /**
             * 对当前的工程车辆总数增加
             * @param projectId
             */
            updateEngineeringSum:function (projectId,flag) {
                //console.log(projectId,flag);
                if (vm.engineeringForInit.projectId == projectId){
                    if (flag == 1){
                        vm.engineeringForInit.engineeringCarSum += 1;
                    }else{
                        vm.engineeringForInit.engineeringCarSum -= 1;
                    }
                }
            },
            /**
             * 读取发货单信息   当车辆离开工地时  更新工程里的车辆信息
             * @param obj  车辆信息
             */
            setPlansForCarMessage:function (obj) {
                if(vm.engineeringListForInit){
                    vm.engineeringListForInit.projectInfoBeans.forEach((pro)=>{
                        pro.projectPlanList.forEach((p)=>{
                            p.projectDeliveryList.forEach((project,index)=>{
                                if (project.deliveryId == obj.deliveryId) {
                                    p.projectDeliveryList.splice(index,1);
                                    vm.updateEngineeringSum(pro.projectId,0);
                                }
                            })
                        })
                    })
                }
            },
            /**
             * 发货单时间状态----消息---信息修改
             */
            updatePlanForTime:function (flag,obj) {
                if (vm.findAllPlanList.planList){
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].planNumber == obj.planNumber){
                            for (let j = 0,max=vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<max;j++){
                                if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliveryId == obj.deliveryId){
                                    //console.log("更新时间")
                                    if(flag == 4){//去途中
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].timeOut = obj.currentTime;
                                        //console.log("出站时间:",obj.currentTime);
                                    }else if(flag == 6){//卸料
                                        //console.log("进入卸料赋值")
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].dischargeStartTime = obj.currentTime;
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].waitTimeLonger =vm.returnCalculationCompleteTime(vm.findAllPlanList.planList[i].deliveryVehicleList[j].constructionTimeIn.substring(11,16),obj.currentTime.substring(11,16));//start  end
                                        vm.getPlansForCarMessage(flag,obj);
                                    }else if(flag == 5){//到达工地
                                        if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].constructionTimeIn == ""){
                                            vm.findAllPlanList.planList[i].deliveryVehicleList[j].constructionTimeIn = obj.currentTime;
                                        }
                                        vm.getPlansForCarMessage(flag,obj);
                                    }else { //状态为  0  1  2  3  直接改变状态
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliverVehicleStatus = obj.status;
                                    }
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliverVehicleStatus = obj.status;
                                }
                            }
                        }
                    }
                }
            },
            /**
             * 发货单时间状态  更新发货单列表的数据
             * @param flag  状态值
             * @param obj 内容
             */
            updateDeliveryListForMessage:function(flag,obj){
                if (vm.engineeringInformation){
                    vm.engineeringInformation.forEach((e,index)=>{
                        let newDischargeStartTime;
                        let newDeliverVehicleStatus;
                        let newConstructionTimeIn;
                        let newTimeOut;
                        let newWaitTimeLonger;
                        if (e.deliveryId == obj.deliveryId){
                            if(flag == 4){//去途中
                                newTimeOut = obj.currentTime;
                                newDeliverVehicleStatus = obj.status;
                                newDischargeStartTime = vm.engineeringInformation[index].dischargeStartTime;
                                newConstructionTimeIn = vm.engineeringInformation[index].constructionTimeIn;
                                newWaitTimeLonger = vm.engineeringInformation[index].waitTimeLonger;
                            } else if(flag == 5){ // 到达工地
                                if (vm.engineeringInformation[index].constructionTimeIn == ""){
                                    newConstructionTimeIn = obj.currentTime;
                                }else{
                                    newConstructionTimeIn = vm.engineeringInformation[index].constructionTimeIn;
                                }
                                newDeliverVehicleStatus = obj.status;
                                newDischargeStartTime = vm.engineeringInformation[index].dischargeStartTime;
                                newTimeOut = vm.engineeringInformation[index].timeOut;
                                newWaitTimeLonger = vm.engineeringInformation[index].waitTimeLonger;
                            }else if(flag == 6){//卸料
                                newDischargeStartTime = obj.currentTime; //卸料开始时间
                                newDeliverVehicleStatus = obj.status;
                                newTimeOut = vm.engineeringInformation[index].timeOut;
                                newConstructionTimeIn = vm.engineeringInformation[index].constructionTimeIn; //到达工地时间
                                if (vm.engineeringInformation[index].constructionTimeIn && obj.currentTime){
                                    newWaitTimeLonger =vm.returnCalculationCompleteTime(vm.engineeringInformation[index].constructionTimeIn.substring(11,16),obj.currentTime.substring(11,16));//start  end
                                }
                            }else{ // 状态为 0 1 2 3  的时候改变状态
                                newDeliverVehicleStatus = obj.status;
                                newDischargeStartTime = vm.engineeringInformation[index].dischargeStartTime;
                                newTimeOut = vm.engineeringInformation[index].timeOut;
                                newConstructionTimeIn = vm.engineeringInformation[index].constructionTimeIn;
                                newWaitTimeLonger =vm.engineeringInformation[index].waitTimeLonger;
                            }
                            vm.engineeringInformation.$set(index,{
                                expectedToArriveTime:vm.engineeringInformation[index].expectedToArriveTime,
                                deliverVehicleStatus:newDeliverVehicleStatus,
                                deliveryId : vm.engineeringInformation[index].deliveryId,
                                number : vm.engineeringInformation[index].number,
                                driverName :vm.engineeringInformation[index].driverName,
                                driverPhone:vm.engineeringInformation[index].driverPhone,
                                plateNumber:vm.engineeringInformation[index].plateNumber,
                                productionQuantity:vm.engineeringInformation[index].productionQuantity,
                                vehicleId:vm.engineeringInformation[index].vehicleId,
                                vehicleStatus:vm.engineeringInformation[index].vehicleStatus,
                                connectStatus:vm.engineeringInformation[index].connectStatus,
                                constructionTimeIn:newConstructionTimeIn,
                                deliveryTime:vm.engineeringInformation[index].deliveryTime,
                                dischargeStartTime:newDischargeStartTime,
                                dischargeEndTime:vm.engineeringInformation[index].dischargeEndTime,
                                signTheState:vm.engineeringInformation[index].signTheState,
                                speed:vm.engineeringInformation[index].speed,
                                timeOut:newTimeOut,
                                unloadTimeLonger:vm.engineeringInformation[index].unloadTimeLonger,
                                waitTimeLonger:newWaitTimeLonger
                            })
                        }
                    })
                }
            },
            /**
             * GPS消息   更新预计时间
             * @param flag
             * @param obj
             */
            updateEngineeringMesForMessage:function (flag,obj) {
                if(vm.findAllPlanList){
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].planNumber == obj.planNumber){
                            for (let j = 0,max=vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<max;j++){
                                if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliveryId == obj.deliveryId){
                                    //console.log("更新预计")
                                    if(flag == 4){//去途中
                                      //console.log("状态4   预计时间");
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].expectedToArriveTime = vm.timeFormatConversion(obj.predictTime);
                                        if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].speed){
                                            vm.findAllPlanList.planList[i].deliveryVehicleList[j].speed = (Number(obj.speed)*3.6).toFixed(0);
                                        }else{
                                            vm.findAllPlanList.planList[i].deliveryVehicleList[j].speed = vm.findAllPlanList.planList[i].deliveryVehicleList[j].speed ;
                                        }
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliverVehicleStatus = obj.status;
                                    }else if(flag == 7){ //回途中
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].expectedToArriveTime = vm.timeFormatConversion(obj.predictTime);
                                        if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].speed){
                                            vm.findAllPlanList.planList[i].deliveryVehicleList[j].speed = (Number(obj.speed)*3.6).toFixed(0);
                                        }else{
                                            vm.findAllPlanList.planList[i].deliveryVehicleList[j].speed = vm.findAllPlanList.planList[i].deliveryVehicleList[j].speed ;
                                        }
                                        vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliverVehicleStatus = obj.status;
                                        // vm.setPlansForCarMessage(obj); //回途中 将工地里的车辆减1
                                    }
                                }
                            }
                        }
                    }
                }
                if (vm.engineeringInformation){
                    vm.engineeringInformation.forEach((e,index)=>{
                        if (e.deliveryId == obj.deliveryId){
                            //console.log(12)
                            let newExpectedToArriveTime;
                            let newDeliverVehicleStatus;
                            let newSpeed = 0;
                            if(flag == 4){ //去途中
                                newExpectedToArriveTime = vm.timeFormatConversion(obj.predictTime);
                                newDeliverVehicleStatus = obj.status;
                                if (obj.speed){
                                    newSpeed = (Number(obj.speed)*3.6).toFixed(0);
                                }else{
                                    newSpeed = 0;
                                }
                                //console.log(e.expectedToArriveTime , obj.predictTime);
                            }else if (flag == 7){ //回途
                                newExpectedToArriveTime = vm.timeFormatConversion(obj.predictTime);
                                newDeliverVehicleStatus = obj.status;
                                if (obj.speed){
                                    newSpeed = (Number(obj.speed)*3.6).toFixed(0);
                                }else{
                                    newSpeed = 0;
                                }
                                //console.log(e.expectedToArriveTime);
                            }
                            vm.engineeringInformation.$set(index,{
                                expectedToArriveTime:newExpectedToArriveTime,
                                deliverVehicleStatus:newDeliverVehicleStatus,
                                deliveryId : vm.engineeringInformation[index].deliveryId,
                                number : vm.engineeringInformation[index].number,
                                driverName :vm.engineeringInformation[index].driverName,
                                driverPhone:vm.engineeringInformation[index].driverPhone,
                                plateNumber:vm.engineeringInformation[index].plateNumber,
                                productionQuantity:vm.engineeringInformation[index].productionQuantity,
                                vehicleId:vm.engineeringInformation[index].vehicleId,
                                vehicleStatus:vm.engineeringInformation[index].vehicleStatus,
                                connectStatus:vm.engineeringInformation[index].connectStatus,
                                constructionTimeIn:vm.engineeringInformation[index].constructionTimeIn,
                                deliveryTime:vm.engineeringInformation[index].deliveryTime,
                                dischargeStartTime:vm.engineeringInformation[index].dischargeStartTime,
                                dischargeEndTime:vm.engineeringInformation[index].dischargeEndTime,
                                signTheState:vm.engineeringInformation[index].signTheState,
                                speed:newSpeed,
                                timeOut:vm.engineeringInformation[index].timeOut,
                                unloadTimeLonger:vm.engineeringInformation[index].unloadTimeLonger,
                                waitTimeLonger:vm.engineeringInformation[index].waitTimeLonger
                            })
                        }
                    })
                }
            },
            /**
             * 接收到发货单时间状态   回站  状态时  实时的删除掉当前这条数据
             */
            removePlanListForCar:function (obj) {
                //console.log("当前的状态-->",obj.status,'回站状态');
                if (vm.engineeringInformation) {
                    vm.engineeringInformation.forEach((e,index)=>{
                        if (e.deliveryId == obj.deliveryId){
                            //console.log("发货单列表的移除");
                            vm.engineeringInformation.splice(index,1);
                        }
                    })
                }
                if (vm.findAllPlanList.planList && vm.findAllPlanList.planList !== []){
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].planNumber == obj.planNumber){
                            if (vm.findAllPlanList.planList[i].deliveryVehicleList !== []){
                                for (let j = 0,max=vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<max;j++){
                                    if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliveryId == obj.deliveryId){
                                        vm.findAllPlanList.planList[i].deliveryVehicleList.splice(j,1);
                                    }
                                }
                            }
                        }
                    }
                }
            },
            /**
             * 作废发货单信息   socket信息
             * @param obj 发货单信息
             */
            toVoidPlanFoMessage:function(obj){
                //console.log("进入作废发货单信息");
                if (vm.findAllPlanList.planList && vm.findAllPlanList.planList !== []) {
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].deliveryVehicleList != []){
                            for (let j = 0,max=vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<max;j++){
                                if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].deliveryId == obj){
                                    //console.log(vm.findAllPlanList.planList[i].deliveryVehicleList[j].productionQuantity);
                                    vm.findAllPlanList.planList[i].deliverySupplyQuantity = vm.findAllPlanList.planList[i].deliverySupplyQuantity - vm.findAllPlanList.planList[i].deliveryVehicleList[j].productionQuantity;//以供方量
                                    vm.findAllPlanList.planList[i].vehicle -= 1;//车次
                                    vm.findAllPlanList.planList[i].deliveryVehicleList.splice(j,1);
                                }
                            }
                        }
                    }
                }
                if (vm.engineeringInformation){
                    vm.engineeringInformation.forEach((p,pIndex)=>{
                        if (p.deliveryId == obj){
                            vm.engineeringInformation.splice(pIndex,1);
                        }
                    })
                }
            },
            /**
             * 签收状态信息  socket签收状态信息
             * @param obj
             */
            signInStatusOfPlanForMessage:function (obj) {
                //console.log("进入签收状态信息");
                if (vm.findAllPlanList && vm.findAllPlanList.planList && vm.findAllPlanList.planList.deliveryVehicleList){
                    //console.log("签收");
                    vm.findAllPlanList.planList.forEach((plan)=>{
                        if (plan.planNumber == obj.planNumber){
                            plan.deliverySupplyQuantity += obj.signQuantity ;
                            plan.deliveryVehicleList.forEach((delivery)=>{
                                if (delivery.deliveryId == obj.deliveryId) {
                                    delivery.signTheState= obj.signTheState;
                                }
                            })
                        }
                    })
                }
                if (vm.engineeringInformation){
                    vm.engineeringInformation.forEach((e,index)=>{
                        if (e.deliveryId == obj.deliveryId){
                            // e.signTheState = obj.signTheState;
                            vm.engineeringInformation.$set(index,{
                                expectedToArriveTime:vm.engineeringInformation[index].expectedToArriveTime,
                                deliverVehicleStatus:vm.engineeringInformation[index].deliverVehicleStatus,
                                deliveryId : vm.engineeringInformation[index].deliveryId,
                                number : vm.engineeringInformation[index].number,
                                driverName :vm.engineeringInformation[index].driverName,
                                driverPhone:vm.engineeringInformation[index].driverPhone,
                                plateNumber:vm.engineeringInformation[index].plateNumber,
                                productionQuantity:vm.engineeringInformation[index].productionQuantity,
                                vehicleId:vm.engineeringInformation[index].vehicleId,
                                vehicleStatus:vm.engineeringInformation[index].vehicleStatus,
                                connectStatus:vm.engineeringInformation[index].connectStatus,
                                constructionTimeIn:vm.engineeringInformation[index].constructionTimeIn,
                                deliveryTime:vm.engineeringInformation[index].deliveryTime,
                                dischargeStartTime:vm.engineeringInformation[index].dischargeStartTime,
                                dischargeEndTime:vm.engineeringInformation[index].dischargeEndTime,
                                signTheState:obj.signTheState,
                                speed:vm.engineeringInformation[index].speed,
                                timeOut:vm.engineeringInformation[index].timeOut,
                                unloadTimeLonger:vm.engineeringInformation[index].unloadTimeLonger,
                                waitTimeLonger:vm.engineeringInformation[index].waitTimeLonger
                            })
                        }
                    })
                }
            },
            /**
             * 修改工程信息消息   socket修改功工程信息消息
             * @param obj 消息内容
             */
            updateEngineeringForMessage:function(obj){
                //console.log("进入修改工程信息消息");
                if (vm.findAllPlanList && vm.findAllPlanList.planList){
                    vm.findAllPlanList.planList.forEach((plan)=>{
                        obj.projects.forEach((pro)=>{
                            if (plan.projectId == pro.projectId) {
                                plan.contructAddress = pro.contructAddress;
                                plan.projectName = pro.projectName;
                            }
                        })
                    })
                }
            },
            /**
             * 修改工地围栏  工程名称
             * @param obj
             */
            updateEngineeringMarkerForMessage:function(obj){
                if (WebSocketCarMarker){
                    WebSocketCarMarker.forEach((marker,index)=>{
                        if (marker.getExtData() == obj.projectId) {
                            initMarker(2,marker.getPosition(),obj.projectName,obj.projectId,2,false,true);
                            WebSocketCarMarker.splice(index,1);
                        }
                    })
                }
            },
            /**
             * 修改工程列表里面工程名称
             * @param obj
             */
            updateEngineeringListForMessage:function(obj){
                if (vm.engineeringListForInit){
                    vm.engineeringListForInit.projectInfoBeans.forEach((project)=>{
                        if (project.projectId == obj.projectId){
                            project.projectName = obj.projectName;
                        }
                    })
                }
            },
            /**
             * 修改显示的工程信息的工程名称
             * @param obj
             */
            updateEngineeringMessageForMessage:function(obj){
                if (vm.engineeringForInit){
                    if (vm.engineeringForInit.projectId == obj.projectId){
                        vm.engineeringForInit.projectName = obj.projectName;
                    }
                }
            },
            /**
             * 修改车辆信息   socket 修改车辆消息
             * @param obj 车辆信息
             */
            updateAllCarForMessage:function (obj) {
                if (vm.findVehicleList){
                    vm.findVehicleList.forEach((car)=>{
                        if (car.schedulingProductionVehicleId == obj.vehicleId){
                            car.vehicleNumber = obj.carNumber;
                            car.plateNumber = obj.plateNumber;
                            car.carNorm = obj.carNorm;
                        }
                    })
                }
                vm.updateInvoiceCarForMessage(obj);
            },
            /**
             * 修改发货单车辆信息  socket修改车辆信息
             * @param obj 车辆信息
             */
            updateInvoiceCarForMessage:function(obj) {
                //console.log("进入修改发货单车辆信息")
                //console.log(vm.engineeringInformation);
                if (vm.findAllPlanList && vm.findAllPlanList.planList) {
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].deliveryVehicleList != []){
                            for (let j = 0,max=vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<max;j++){
                                if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].vehicleId == obj.vehicleId){
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].plateNumber = obj.plateNumber;
                                    vm.findAllPlanList.planList[i].deliveryVehicleList[j].number = obj.carNumber;
                                }
                            }
                        }
                    }
                }
                if (vm.engineeringInformation){
                    vm.engineeringInformation.forEach((e,index)=>{
                        if (e.vehicleId == obj.vehicleId){
                            // e.number = obj.carNumber;
                            vm.engineeringInformation.$set(index,{
                                expectedToArriveTime:vm.engineeringInformation[index].expectedToArriveTime,
                                deliverVehicleStatus:vm.engineeringInformation[index].deliverVehicleStatus,
                                deliveryId : vm.engineeringInformation[index].deliveryId,
                                number : obj.carNumber,
                                driverName :vm.engineeringInformation[index].driverName,
                                driverPhone:vm.engineeringInformation[index].driverPhone,
                                plateNumber:vm.engineeringInformation[index].plateNumber,
                                productionQuantity:vm.engineeringInformation[index].productionQuantity,
                                vehicleId:vm.engineeringInformation[index].vehicleId,
                                vehicleStatus:vm.engineeringInformation[index].vehicleStatus,
                                connectStatus:vm.engineeringInformation[index].connectStatus,
                                constructionTimeIn:vm.engineeringInformation[index].constructionTimeIn,
                                deliveryTime:vm.engineeringInformation[index].deliveryTime,
                                dischargeStartTime:vm.engineeringInformation[index].dischargeStartTime,
                                signTheState:obj.signTheState,
                                speed:vm.engineeringInformation[index].speed,
                                timeOut:vm.engineeringInformation[index].timeOut,
                                unloadTimeLonger:vm.engineeringInformation[index].unloadTimeLonger,
                                waitTimeLonger:vm.engineeringInformation[index].waitTimeLonger
                            })
                        }
                    })
                }
                vm.updateMarkerForMessage(obj);
            },
            /**
             * 修改地图车辆信息   socket修改车辆信息
             * @param obj 车辆信息
             */
            updateMarkerForMessage:function(obj){
                //console.log("进入修改地图车辆信息");
                if (markerArrayLabel){
                    markerArrayLabel.forEach((marker)=>{
                        if (marker.getExtData() == obj.vehicleId) {
                            let markerSpan = document.createElement("div");// 车辆marker标识
                            markerSpan.className = 'markerLabel';
                            markerSpan.innerHTML = obj.carNumber;
                            marker.setContent(markerSpan);
                        }
                    })
                }
            },
            /**
             * 发货单信息    新增一条发货单   插入列表
             * @param obj
             */
            insertNewPlanForList:function (obj) {
                if (vm.findAllPlanList && vm.findAllPlanList.planList){
                    for (let i= 0,max = vm.findAllPlanList.planList.length;i<max;i++){
                        if (vm.findAllPlanList.planList[i].planNumber == obj.planNumber){
                            vm.findAllPlanList.planList[i].vehicle = Number(vm.findAllPlanList.planList[i].vehicle);
                            vm.findAllPlanList.planList[i].vehicle ++;
                            vm.findAllPlanList.planList[i].deliverySupplyQuantity = Number(vm.findAllPlanList.planList[i].deliverySupplyQuantity) + Number(obj.deliveryQuantity);
                            vm.findAllPlanList.planList[i].deliveryVehicleList.push({
                                driverName : obj.driverName,
                                driverPhone : obj.driverPhone,
                                number : obj.carNumber,
                                plateNumber : '',
                                productionQuantity : '',
                                vehicleId : obj.vehicleId,
                                vehicleStatus : '',
                                connectStatus : obj.connectStatus,
                                constructionTimeIn : '',
                                deliverVehicleStatus : obj.deliveryVehicleStatus,
                                deliveryTime : obj.deliveryTime,
                                dischargeStartTime :'',
                                dischargeEndTime : '',
                                expectedToArriveTime : '',
                                productionQuantity : obj.deliveryQuantity,
                                signTheState : '',
                                speed : '',
                                timeOut : '',
                                unloadTimeLonger : '',
                                waitTimeLonger : '',
                                deliveryId : obj.deliveryId,
                            });
                        }
                    }
                }
            },
            /**
             * 发货单列表  新增发货单信息
             * @param obj  传入的信息
             */
            insertDeliveryForList:function(obj){
                if (vm.planListClickPlanNumber == obj.planNumber){
                    vm.engineeringInformation.push({
                        driverName : obj.driverName,
                        driverPhone : obj.driverPhone,
                        number : obj.carNumber,
                        plateNumber : '',
                        productionQuantity : '',
                        vehicleId : obj.vehicleId,
                        vehicleStatus : '',
                        connectStatus : obj.connectStatus,
                        constructionTimeIn : '',
                        deliverVehicleStatus : obj.deliveryVehicleStatus,
                        deliveryTime : obj.deliveryTime,
                        dischargeStartTime :'',
                        dischargeEndTime : '',
                        expectedToArriveTime : '',
                        productionQuantity : obj.deliveryQuantity,
                        signTheState : '',
                        speed : '',
                        timeOut : '',
                        unloadTimeLonger : '',
                        waitTimeLonger : '',
                        deliveryId : obj.deliveryId,
                    });
                }
            },
            /**
             * 新建计划信息   socket信息
             * @param obj 新建计划
             */
            createNewPlanForMessage:function(obj){
                if (obj.plans.length != 0) {
                    obj.plans.forEach((p)=>{
                        vm.planDetailedMessage.planNumber = p.planNumber;//计划编号
                        vm.planDetailedMessage.constructionSite = p.constructionSite;//施工部位
                        vm.planDetailedMessage.applicantQuantity = p.applicantQuantity;//申请方量
                        vm.planDetailedMessage.pouringMethod = p.pouringMethod;//浇筑方式
                        vm.planDetailedMessage.contructAddress = p.contructAddress;//施工地址
                        vm.planDetailedMessage.planStatus = p.planStatus;//计划状态
                        vm.planDetailedMessage.deliverySupplyQuantity = p.deliverySupplyQuantity;//已供方量
                        vm.planDetailedMessage.projectName = p.projectName;//工程名称
                        vm.planDetailedMessage.projectId = p.projectId;//工程ID
                        vm.planDetailedMessage.productDemandName = p.productDemandName;//产品名称
                        vm.planDetailedMessage.planNumber = p.planNumber;//计划编号
                        vm.planDetailedMessage.vehicle = p.vehicle;//车次
                        vm.planDetailedMessage.startTime = p.startTime;//要求发货时间
                        //console.log(vm.planDetailedMessage);
                        if (vm.findAllPlanList && vm.findAllPlanList.planList){
                            //console.log(vm.findAllPlanList)
                            vm.findAllPlanList.planList.push(vm.planDetailedMessage);
                        }
                    })
                }
            },
            /**
             * 新增计划    工程列表增加对应的计划
             * @param obj
             */
            createNewPlanForMessageToEngineerList:function(obj){
                if (vm.engineeringListForInit.projectInfoBeans.length != 0){
                    vm.engineeringListForInit.projectInfoBeans.forEach((eng)=>{
                        if (eng.projectId == obj.plans[0].projectId){
                            eng.projectPlanList.push({
                                constructionSite:obj.plans[0].constructionSite,
                                planNumber:obj.plans[0].planNumber,
                                suppliedQuantity:obj.plans[0].deliverySupplyQuantity,
                                unloadingSpeed:0,
                                projectDeliveryList:[],
                            })
                        }
                    })
                }
            },

            /**
             * 当计划完成归档时   删除工程列表中当前计划
             * @param obj
             */
            updateEngineeringListForMessageInDel:function(obj){
                if (vm.engineeringListForInit.projectInfoBeans.length != 0){
                    vm.engineeringListForInit.projectInfoBeans.forEach((eng)=>{
                        if (eng.projectId == obj.projectId){
                            if (eng.projectPlanList.length != 0){
                                eng.projectPlanList.forEach((plan,index)=>{
                                    if (plan.planNumber == obj.planNumber && obj.planStatus == 20){
                                        eng.projectPlanList.splice(index,1);
                                    }
                                })
                            }
                        }
                    })
                }
            },
            /**
             * 当计划完成归档时   删除工程列表中当前显示的对应计划
             * @param obj
             */
            updateEngineeringForMessageInDel:function(obj){
                if (vm.engineeringForInit){
                    if (vm.engineeringForInit.projectId == obj.projectId){
                        if (vm.engineeringForInit.projectPlanList.length != 0){
                            vm.engineeringForInit.projectPlanList.forEach((plan,index)=>{
                                if (plan.planNumber == obj.planNumber && obj.planStatus == 20){
                                    vm.engineeringForInit.projectPlanList.splice(index,1);
                                }
                            })
                        }
                    }
                }
            },
            /**
             * 修改计划信息   socket信息
             * @param obj 修改的信息
             */
            updatePlanForMessage:function (obj) {
                //console.log(obj);
                if (vm.findAllPlanList && vm.findAllPlanList.planList){
                    vm.findAllPlanList.planList.forEach((plan,index)=>{
                        if (plan.planNumber == obj.planNumber){
                            if (obj.planStatus == 20){
                                vm.findAllPlanList.planList.splice(index,1);
                            }else{
                                //console.log("进入")
                                plan.planNumber = obj.planNumber;//计划编号
                                plan.constructionSite = obj.constructionSite;//施工部位
                                plan.applicantQuantity = parseFloat(obj.applicantQuantity).toFixed(1);//申请方量
                                plan.pouringMethod = obj.pouringMethod;//浇筑方式
                                plan.contructAddress = obj.contructAddress;//施工地址
                                plan.planStatus = obj.planStatus;//计划状态
                                plan.deliverySupplyQuantity = parseFloat(plan.deliverySupplyQuantity).toFixed(1);//已供方量
                                plan.projectName = obj.projectName;//工程名称
                                plan.projectId = obj.projectId;//工程ID
                                plan.productDemandName = obj.productDemandName;//产品名称
                                plan.vehicle = plan.vehicle;//车次
                                plan.startTime = plan.startTime;//要求发货时间
                                vm.projectIsHideOrShowForPlan(obj.projectId);
                            }
                        }
                    })
                }
            },
            /**
             * 根据计划ID  查看当前地图上有没有对应的围栏
             * @param projectId
             */
            projectIsHideOrShowForPlan:function(projectId){
                //console.log(projectId);
                if (allConstructionPolygon){
                    allConstructionPolygon.forEach((e)=>{
                        if (projectId != e.getExtData()){
                            vm.planEnclosureProjectId.projectID = projectId;
                            //console.log(projectId, vm.planEnclosureProjectId.projectId);
                            $.ajax({
                                url: URL_ADDRESS + 'scheduleMap/findProjectConstructionByProjectId',
                                type: 'post',
                                data: httpEncode(JSON.stringify(vm.planEnclosureProjectId)),
                                success: function (data) {
                                    var result = decryptByDESModeCBCzhang(data);
                                    //console.log(result);
                                }
                            });
                        }
                    })
                }
            },
            /**
             * 新增绑定车辆消息   socket新绑定信息
             * @param obj 车辆信息
             */
            insertCarForMessage:function (obj) {
                //console.log("新绑定车辆信息");
                vm.insertCarMessage = {};
                vm.insertCarMessage.vehicleNumber = obj.carNumber;
                vm.insertCarMessage.carNorm = obj.carNorm;
                vm.insertCarMessage.plateNumber = obj.plateNumber;
                vm.insertCarMessage.vehicleId = obj.vehicleId;
                vm.insertCarMessage.schedulingProductionVehicleId = obj.vehicleId;
                initCar(0,{
                        position:[Number(obj.longitude), Number(obj.latitude)],
                        carNum: obj.carNumber,
                        angleCar: 0,
                        extData:obj.vehicleId
                    }
                );
                vm.findVehicleList.push(vm.insertCarMessage);
            },
            /**
             * 解除绑定车辆信息  socket解绑车辆信息
             * @param obj 车辆信息
             */
            deleteCarForMessage:function(obj){
                if (vm.findVehicleList){
                    vm.findVehicleList.forEach((car,carIndex)=>{
                        if (car.schedulingProductionVehicleId == obj.vehicleId){
                            vm.findVehicleList.splice(carIndex,1);
                        }
                    })
                }
                if (vm.isFirstCarStatusFlag){
                    vm.isFirstCarStatusFlag.forEach((c,index)=>{
                        if (c.carID == obj.vehicleId){
                            vm.isFirstCarStatusFlag.splice(index,1);
                        }
                    })
                }
                vm.deleteCoverForMap(obj,markerArray);
                vm.deleteCoverForMap(obj,markerArrayLabel);
            },
            /**
             * 修改发货单里面司机信息   socket信息
             * @param obj 修改的司机信息
             */
            updatePlanDriverMesForMessage:function (obj) {
                //console.log(obj);
                for (let i = 0,planMax = vm.findAllPlanList.planList.length;i<planMax;i++){
                    for (let j = 0,planDeliveryMax = vm.findAllPlanList.planList[i].deliveryVehicleList.length;j<planDeliveryMax;j++){
                        for (let k = 0,objMax = obj.vehicleId.length;k<objMax;k++){
                            //console.log(vm.findAllPlanList.planList[i].deliveryVehicleList[j].vehicleId,obj.vehicleId[k]);
                            if (vm.findAllPlanList.planList[i].deliveryVehicleList[j].vehicleId == obj.vehicleId[k]){
                                //console.log(2)
                                vm.findAllPlanList.planList[i].deliveryVehicleList[j].driverName = obj.driverName;
                                vm.findAllPlanList.planList[i].deliveryVehicleList[j].driverPhone = obj.driverPhone;
                            }
                        }
                    }
                }
                if (vm.engineeringInformation){
                    vm.engineeringInformation.forEach((e,index)=>{
                        obj.vehicleId.forEach((v)=>{
                            if (e.vehicleId == v){
                                vm.engineeringInformation.$set(index,{
                                    expectedToArriveTime:vm.engineeringInformation[index].expectedToArriveTime,
                                    deliverVehicleStatus:vm.engineeringInformation[index].deliverVehicleStatus,
                                    deliveryId : vm.engineeringInformation[index].deliveryId,
                                    number : vm.engineeringInformation[index].number,
                                    driverName :obj.driverName,
                                    driverPhone:obj.driverPhone,
                                    plateNumber:vm.engineeringInformation[index].plateNumber,
                                    productionQuantity:vm.engineeringInformation[index].productionQuantity,
                                    vehicleId:vm.engineeringInformation[index].vehicleId,
                                    vehicleStatus:vm.engineeringInformation[index].vehicleStatus,
                                    connectStatus:vm.engineeringInformation[index].connectStatus,
                                    constructionTimeIn:vm.engineeringInformation[index].constructionTimeIn,
                                    deliveryTime:vm.engineeringInformation[index].deliveryTime,
                                    dischargeStartTime:vm.engineeringInformation[index].dischargeStartTime,
                                    signTheState:vm.engineeringInformation[index].signTheState,
                                    speed:vm.engineeringInformation[index].speed,
                                    timeOut:vm.engineeringInformation[index].timeOut,
                                    unloadTimeLonger:vm.engineeringInformation[index].unloadTimeLonger,
                                    waitTimeLonger:vm.engineeringInformation[index].waitTimeLonger
                                })
                            }
                        })
                    })
                }
            },
            /**
             * GPS  传回的预计到达时间  进行格式的转化
             * @param time
             * @returns {number}
             */
            timeFormatConversion:function (time) {
                if (time != null && time != ''){
                    let newTime = time/60;
                    return newTime.toFixed(0);
                }
            },
            /**
             * 接收GPS消息  移动车辆
             * @param json 传入的GPS信息
             * @param markerArr 车辆marker的数组
             * @param markerArrLabel  车辆markerLabel数组
             */
            carMoveToForMap:function (json,markerArr,markerArrLabel) {
                try {
                    if (json){
                        let carInfoMarker = {
                            position: [Number(JSON.parse(json).longitude), Number(JSON.parse(json).latitude)],
                            carNum: JSON.parse(json).carNum,
                            angleCar:JSON.parse(json).bearing,
                            extData:JSON.parse(json).vehicleId
                        }
                        if (markerArr.length == 0) {
                            //initCar(0,carInfoMarker);
                        } else if (markerArr.length > 0) {
                            var iNowCar = 0;
                            markerArr.forEach(function (car, index) {
                                if (car.getExtData() == JSON.parse(json).vehicleId) {
                                    if (JSON.parse(json).longitude != car.getPosition().lng && JSON.parse(json).latitude != car.getPosition().lat) {
                                        if (Number(car.getPosition().lng)- Number(JSON.parse(json).longitude) != 0 && Number(car.getPosition().lat) - Number(JSON.parse(json).latitude) != 0){
                                            var lnglat = new AMap.LngLat(Number(car.getPosition().lng), Number(car.getPosition().lat));
                                            var mi = lnglat.distance([Number(JSON.parse(json).longitude), Number(JSON.parse(json).latitude)]);// 计算在
                                            // //console.log(mi);
                                            if(mi > 10){
                                                var speed = mi / sleepTime * 3600 / 1000;//终点坐标
                                                //console.log("走到这里---",mi);
                                                var toLL = new AMap.LngLat(Number(JSON.parse(json).longitude), Number(JSON.parse(json).latitude));
                                                if(Object.is(speed,0) == false){
                                                    car.moveTo(toLL, speed);
                                                    markerArrLabel[index].moveTo(toLL, speed);
                                                }
                                                car.getPosition().lng = Number(JSON.parse(json).longitude);
                                                car.getPosition().lat = Number(JSON.parse(json).latitude);
                                            }
                                        }
                                    }
                                    iNowCar = 1;
                                }
                            });
                            if (iNowCar == 0) {
                                //console.log("%c","color:red",markerArr.length);
                                //initCar(0,carInfoMarker);
                            }
                        }
                    }
                }catch (e){
                    //TODO handle the exception
                }
            },
            /**
             * 分页
             */
            clickPageTypeMap:function (flag) {
                if(flag == 0) { //返回首页
                    if (this.mapProjectNameCurrentPage != 1){
                        this.mapProjectNameCurrentPage = 1;
                        vm.showEnclosureModal();
                    }
                } else if(flag == 1) { //上一页
                    if(this.mapProjectNameCurrentPage == 1) {
                        this.mapProjectNameCurrentPage = 1;
                    } else {
                        this.mapProjectNameCurrentPage--;
                        vm.showEnclosureModal();
                    }
                } else if(flag == 2) { //下一页
                    if(this.mapProjectNameCurrentPage == this.mapProjectNameTotalPages ) {
                        this.mapProjectNameCurrentPage = this.mapProjectNameTotalPages;
                    } else {
                        this.mapProjectNameCurrentPage++;
                        vm.showEnclosureModal();
                    }
                }else if(flag == 4){
                    vm.showEnclosureModal();
                }else { //尾页
                    if (this.mapProjectNameCurrentPage != this.mapProjectNameTotalPages){
                        this.mapProjectNameCurrentPage = this.mapProjectNameTotalPages;
                        vm.showEnclosureModal();
                    }
                }
            },
        }
    });

    /**
     * 分钟转小时分钟
     * @param minutes
     * @returns {string}
     */
    function toHourMinute(minutes){
        return (Math.floor(minutes/60) + "小时" + (minutes%60).toFixed(0));
    }
    /**
     * 初始化地图
     */
    function initMap() {
        map = new AMap.Map("container", {
            resizeEnable: true,
            // center: [116.253208,39.842507],
            zoom: 17,
        });
        new AMap.TileLayer.Traffic({
            map: map,
            opacity: 1,
            interval: 600000
        });
        // map.setFeatures('道路');
    }

    /**
     * 设置地图中心点  缩放
     */
    function setMapCenter(arr){
        //console.log(arr);
        map.setCenter(arr);
        map.setZoom(17);
    }

    /**
     * 初始化页面时给计划列表赋值高度
     */
    function setPlanListContentHeight(){
        let height = $('body').height()
        $('.planListContent').css('max-height',height*0.75);
        $('.engineeringMessageClickMarker').css('max-height',height*0.75);
    }

    /**
     * 地图缩放重置图标的大小
     */
    AMap.event.addListener(map,'zoomend',function(){
        // console.log( map.getZoom());
        if ( map.getZoom() == 16){
            $('.markerlnglat').css("width", 20+'px');
        }else if (map.getZoom() == 17){
            $('.markerlnglat').css("width", 30+'px');
        }else if(map.getZoom() == 18){
            $('.markerlnglat').css("width", 40+'px');
        }
    });
    /**
     * 地图上初始化一个marker
     * @param flag 区分是哪一种类的marker
     * @param arr  marker的数组
     * @param title marker的标题
     * @param id   marker绑定的特殊的值
     * @param imgFlag marker所用的图片分区分
     * @param isDra marker是否可以拖动
     */
    function initMarker(flag,arr,title,id,imgFlag,isDra,clickFlag){
        var markerContent = document.createElement("div");// 自定义点标记内容
        var markerImg = document.createElement("img");// 点标记中的图标
        markerImg.style.width = '40px';
        markerImg.className = "markerlnglat";
        switch (imgFlag){
            case 1:
                markerImg.src = "../img/gongdiMarker.png";
                break;
            case 2:
                markerImg.src = "../img/zhandianMarker.png";
                break;
            case 3:
                markerImg.src = "../img/gc.png";
                break;
            case 4:
                markerImg.src = "../img/bc.png";
                break;
            default:
                markerImg.src = "http://vdata.amap.com/icons/b18/1/2.png";
        }
        markerContent.appendChild(markerImg);
        var markerSpan = document.createElement("span");// 点标记中的文本
        markerSpan.className = 'marker';
        markerSpan.title = title;
        markerSpan.innerHTML = title;
        markerContent.appendChild(markerSpan);
        marker = new AMap.Marker({
            map: map,
            position: arr,
            content: markerContent,
            offset: new AMap.Pixel(-10,0),
            clickable:clickFlag,//可点击
            extData:id ? id : 0,
            draggable: isDra ? true : false
        });
        if (flag == 1){ //  当前是显示的是点击计划编号显示当前计划的所有车辆的marker
            onePlanAllCarArr.push(marker)
        }else if (flag == 2){
            WebSocketCarMarker.push(marker);//多个工地的marker
        }else if(flag == 3){
            findAllPlanCarArrayMarker.push(marker);//所有车辆的marker   默认初始化
        }else if(flag == 4){
            findAllConstructionMarker.push(marker);//初始化站点的marker
        }else if (flag == 5){
            findAllConstructionMarkerByPlanNumber.push(marker);//点击计划编号查档当前计划里面的
        }else if(flag == 6){//点击围栏按钮  生成出来的marker
            //2018-4-25-nx-start
            if(clickFencingBtnWLMarker) {
                clickFencingBtnWLMarker.forEach((m) => {
                    m.setMap(null);
                });
            }
            clickFencingBtnWLMarker = [];
            //2018-4-25-nx-end
            clickFencingBtnWLMarker.push(marker);
            //console.log("新增",clickFencingBtnWLMarker);
        }else if(flag == 7){//点击任务单里面的车辆编号  生成的车辆的marker
            clickCarNumberMarkerArr.push(marker);
        }else if (flag == 100){//默认初始化加载出来的所以后车辆
            initializationAllCarMarkerArr.push(marker);
        }
        if(isDra) {
            vm.listenMouse();
        }
    }
    /**
     * 绘制围栏
     * @param {Object} fencingLngLatArray
     * @param {Object} fencingCol
     * @description   fencingLngLatArray: 围栏的经纬度，数组：[ //构建多边形经纬度坐标数组
     [116.403322, 39.920255],
     [116.410703, 39.897555],
     [116.402292, 39.892353],
     [116.389846, 39.891365]
     ]，fencingCol：围栏颜色，有默认颜色
     */
    function setFencing (flag,fencingLngLatArray, fencingCol , identifyingId){
        polygon = new AMap.Polygon({
            map:map,
            path: fencingLngLatArray,//设置多边形边界路径
            strokeColor: fencingCol, //线颜色
            strokeOpacity: 0.8, //线透明度
            strokeWeight: 3,    //线宽
            fillColor: "#f5deb3", //填充色
            fillOpacity: 0.35,//填充透明度
            strokeStyle: "dashed",
            zIndex: 99,
            extData: identifyingId ? identifyingId : 0
        });
        if (flag == 1){ //初始化所有工地的围栏
            allConstructionPolygon.push(polygon);
        }else if (flag == 7){ //点击计划单里面  车辆编号   生成的围栏信息
            allConstructionPolygonByCarNumber.push(polygon);
        }else if(flag == 2){
            siteEnclosureArray.push(polygon);
            //2018-4-25-nx-start
        } else if(flag == 3) {
            if(compileRailPolyEditorNew && compileRailPolyEditorNew.length > 0) {
                compileRailPolyEditorNew[0].setMap(null);
                compileRailPolyEditorNew = [];
            }
            compileRailPolyEditorNew.push(polygon);
        } else if(flag == 4) {
            if(compileRailPolyEditorNew && compileRailPolyEditorNew.length > 0) {
                compileRailPolyEditorNew[0].setMap(null);
                compileRailPolyEditorNew = [];
            }
            compileRailPolyEditorNew.push(polygon);
        }
        //2018-4-25-nx-end
        return new AMap.PolyEditor(map, polygon);
    }

    /**
     * 线路的规划
     * @constructor
     */
    function SetPlanDriving(path,callBack) {
        map.plugin("AMap.DragRoute", function() {
            route = new AMap.DragRoute(map, path, AMap.DrivingPolicy.LEAST_FEE); //构造拖拽导航类
            route.search(); //查询导航路径并开启拖拽导航
            route.on("complete", function(result) {
                // if(result.data.waypoints && result.data.waypoints.length == 15) {
                //     tipModalShow(vm, {
                //         resultValue: "警告：途径点已经达到上限15个"
                //     });
                // }
                if(callBack && typeof callBack == "function") {
                    newViaPoint = [];
                    result.data.waypoints.forEach(function(viaPoint) {
                        newViaPoint.push(viaPoint.location);
                        //console.log(newViaPoint);
                    });
                    callBack(newViaPoint);
                }
            });
        });
        return route;
    }

    /**
     * 绘制一条路线
     */
    function drawARoute(obj){
        drawDriving = new AMap.Driving({
            map: map,
            policy: AMap.DrivingPolicy.LEAST_DISTANCE, //初始规划路线是最短距离
            showTraffic: obj.showTraffic ? false : true, //暂时不需要实时路况
            outlineColor: obj.lineCol ? obj.lineCol : "#d1141b", //描边线的颜色
            hideMarkers: obj.isShowIcon ? true : false //是否显示起始点的图标true为隐藏
        });
        siteToSiteReachRoute.push(drawDriving);
        return drawDriving;
    }

    /**
     *
     * @param obj
     * @param callBack
     * @returns {Number|*}
     */
    function planningPath(obj,callBack){
        let lineArr = {};
        if(obj.wayObj) {
            lineArr.waypoints = obj.wayObj;
        }
        return drawDriving.search(obj.starArray, obj.endArray, lineArr, function(status, result) {
            if(callBack && typeof callBack == "function") {
                callBack(result.routes[0].distance); //运距
            }
        });
    }

    /**
     * 绘制轨迹
     * @param lineArr
     */
    function setCarTrackBackPath(flag,lineArr){
        returnPolyline = new AMap.Polyline({
            map: map,
            path: lineArr,
            strokeColor: "#076635",  //线颜色
            strokeOpacity: 0.6,     //线透明度
            strokeWeight: 5,      //线宽
            strokeStyle: "dashed",  //线样式
            strokeDasharray:[10,2,10],//线样式
            lineJoin:"round",//拐点的样式
            lineCap:"round",//拐点两头的样式
            geodesic:false,//是否绘制大地线
            isOutline:true,//线是否描边
            borderWeight:1,//描边的宽度
            outlineColor:"#ffffff"//描边的颜色
        });
        if (flag == 2){//点击任务单  计划编号  出现的路线
            planMapPolylineByPlanNumberArr.push(returnPolyline);
        }
    }

    /**
     * 通过地址返回搜索到的地址的坐标
     * @param address
     * @param callBack
     */
    function positionReturnCoordinate(address,callBack){
        geocoder = new AMap.Geocoder({
            city: "010", //城市，默认：“全国”
            radius: 1000 //范围，默认：500
        });
        //地理编码,返回地理编码结果
        geocoder.getLocation(address, function(status, result) {
            if(callBack && typeof callBack == "function") {
                if(status == 'complete' && result.info == 'OK') {
                    callBack(result.geocodes[0].location);
                    //console.log(result.geocodes[0].location);
                } else {
                    callBack(newWorkLngLat);
                    //console.log(newWorkLngLat);
                }
            }
        });
    }
    /**
     * CBC模式解密
     * @param {Object} ciphertext
     */
    function decryptByDESModeCBC(ciphertext) {
        // ciphertext = JSON.parse(ciphertext);

        // var secretKey = "4A1AA30CF30DFCC86707E9D3DF118BCF";
        // var iv = "01234567";
        //把私钥转换成16进制的字符串
        // var keyHex = CryptoJS.enc.Utf8.parse(secretKey);
        //把需要解密的数据从16进制字符串转换成字符byte数组
        // var decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyHex, {
        //     iv: CryptoJS.enc.Utf8.parse(iv),
        //     mode: CryptoJS.mode.CBC,
        //     padding: CryptoJS.pad.Pkcs7
        // });
        //以utf-8的形式输出解密过后内容
        // decrypted = decrypted.toString(CryptoJS.enc.Utf8);
        var obj = JSON.parse(ciphertext.strJson);
        decrypted = JSON.stringify(obj.data);
        return decrypted;
    }

    function decryptByDESModeCBCzhang(ciphertext) {
        ciphertext = JSON.parse(ciphertext);
        // var secretKey = "4A1AA30CF30DFCC86707E9D3DF118BCF";
        // var iv = "01234567";
        //把私钥转换成16进制的字符串
        // var keyHex = CryptoJS.enc.Utf8.parse(secretKey);
        //把需要解密的数据从16进制字符串转换成字符byte数组
        // var decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyHex, {
        //     iv: CryptoJS.enc.Utf8.parse(iv),
        //     mode: CryptoJS.mode.CBC,
        //     padding: CryptoJS.pad.Pkcs7
        // });
        //以utf-8的形式输出解密过后内容
        // decrypted = decrypted.toString(CryptoJS.enc.Utf8);
        var obj = JSON.parse(ciphertext.strJson);
        decrypted = JSON.stringify(obj.data);
        return decrypted;
    }

    /**
     * 加密
     * @param data
     * @returns {{strJson: *, key: string}}
     */
    function httpEncode(data) {
        // var secretKey = "4A1AA30CF30DFCC86707E9D3DF118BCF";
        // var iv = "01234567";
        var uuid = Math.uuidFast().replace(/-/, "");
        // var keyHex = CryptoJS.enc.Utf8.parse(secretKey);
        var param = '{"itemID":"' + uuid + '","data":' + data + '}';
        // var encrypted = CryptoJS.TripleDES.encrypt(param, keyHex, {
        //     iv: CryptoJS.enc.Utf8.parse(iv),
        //     mode: CryptoJS.mode.CBC,
        //     padding: CryptoJS.pad.Pkcs7
        // });
        // var encrypted = param;
        // var s = "Json:" + param + "   ItemID:" + uuid + "  Key:" + secretKey;
        // var dd = md5(s).toUpperCase();
        return {
            "strJson": param,
            "key": ""
        };
    }

    /**
     * 时间戳转时间格式
     * @param obj
     * @returns {string}
     */
    function formatDateTime(inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    };
    /**
     * 高亮显示一行
     * @param clazz
     * @param index
     */
    function clickHighlightChange(clazz, index) {
        $(clazz + ":even").css("background", "#D9E1F2");
        $(clazz + ":odd").css("background", "white");
        $(clazz).eq(index).css("background", "#3f9fd9");
    }

    /**
     * 获取地图的缩放
     * @param callBack
     */
    function getMapZoom(callBack){
        AMap.event.addListener(map, 'zoomend', function() {
            if(callBack && typeof callBack == "function") {
                callBack(map.getZoom());
            }
        });
    }
    /*--------------------------------------------------------------------------------------*/

    var stompClient = null;
    function connect() {
        stompClient = Stomp.client(URL_ADDRESS_SOCKEt+'mapSocket/websocket');
        //建立连接  {}用户名和密码  成功的一个回调函数
        stompClient.connect({}, function (frame) {
            stompClient.subscribe('/user/' + "XY" + '/mapMessage', function (greeting) {
                // console.log(JSON.parse(greeting.body).data);
                var carJson = decryptByDESModeCBC(JSON.parse(greeting.body).data);
                if (JSON.parse(greeting.body).messageType == 'SOCKET_SEND_GPS'){
                    // console.log("%c ========> GPS消息 <=======","color:green",carJson);//收到GPS信息   清掉地图默认加载的车辆marker
                    vm.invoiceTimeForGPSMessage = JSON.parse(carJson);
                    if (vm.invoiceTimeForGPSMessage.status == 4){ //GPS消息  改变预计时间
                        vm.updateEngineeringMesForMessage(4,vm.invoiceTimeForGPSMessage);//更新时间
                    }else if(vm.invoiceTimeForGPSMessage.status == 7){
                        vm.updateEngineeringMesForMessage(7,vm.invoiceTimeForGPSMessage);//更新时间
                    }
                    vm.carMoveToForMap(carJson,markerArray,markerArrayLabel);//移动车辆
                    vm.isFirstCarStatusFlag.forEach((c)=>{
                        if (c.carID == JSON.parse(carJson).vehicleId && c.carStatus == false){
                            vm.carStatusUpdate(0,JSON.parse(carJson).vehicleId,markerArray);
                            vm.updatePlanListCarStatusOpen(JSON.parse(carJson).vehicleId,0);
                            vm.updateDeliveryCarStatusOpen(JSON.parse(carJson).vehicleId,0);
                            c.carStatus = true;
                        }
                    })
                }else if (JSON.parse(greeting.body).messageType == 'SOCKET_DELIVERY_TIME_STAUTS'){
                    //console.log("%c ------> 发货单时间状态消息 <----------","color:red",carJson);
                    vm.invoiceTimeMessage = JSON.parse(carJson);
                    if (vm.invoiceTimeMessage.status == 0){ //状态已接单 出站
                        vm.updatePlanForTime(0,vm.invoiceTimeMessage);//更新时间  计划列表
                        vm.updateDeliveryListForMessage(0,vm.invoiceTimeMessage); //发货单列表
                    }
                    if (vm.invoiceTimeMessage.status == 1){ //状态为1  待生产
                        vm.updatePlanForTime(1,vm.invoiceTimeMessage);//更新时间  计划列表
                        vm.updateDeliveryListForMessage(1,vm.invoiceTimeMessage);//发货单列表
                    }
                    if (vm.invoiceTimeMessage.status == 2){ //状态为2 生产中
                        vm.updatePlanForTime(2,vm.invoiceTimeMessage);//更新时间 计划列表
                        vm.updateDeliveryListForMessage(2,vm.invoiceTimeMessage);//发货单列表
                    }
                    if (vm.invoiceTimeMessage.status == 3){ //状态为3 出站中
                        vm.updatePlanForTime(3,vm.invoiceTimeMessage);//更新时间 计划列表
                        vm.updateDeliveryListForMessage(3,vm.invoiceTimeMessage);// 发货单列表
                    }
                    if (vm.invoiceTimeMessage.status == 4){ //状态为4 出站
                        vm.updatePlanForTime(4,vm.invoiceTimeMessage);//更新时间 计划列表
                        vm.updateDeliveryListForMessage(4,vm.invoiceTimeMessage);// 发货单列表
                        vm.messageIsHideOrShow(20,-60,4000,JSON.parse(carJson).planNumber+' 任务发货单出站了');
                    }
                    if (vm.invoiceTimeMessage.status == 5){ //状态为5的  到达工地
                        vm.updatePlanForTime(5,vm.invoiceTimeMessage);//更新时间
                        vm.updateDeliveryListForMessage(5,vm.invoiceTimeMessage);
                        vm.messageIsHideOrShow(20,-60,4000,JSON.parse(carJson).planNumber+' 任务发货单已到达工地');
                    }
                    if (vm.invoiceTimeMessage.status == 6){ //状态为6的  卸料
                        vm.updatePlanForTime(6,vm.invoiceTimeMessage);//更新时间
                        vm.updateDeliveryListForMessage(6,vm.invoiceTimeMessage);
                        vm.messageIsHideOrShow(20,-60,4000,JSON.parse(carJson).planNumber+' 任务发货单开始卸料');
                    }
                    if (vm.invoiceTimeMessage.status == 7){ //状态为7的  回途中
                        //console.log("---状态为7---");
                        vm.setPlansForCarMessage(vm.invoiceTimeMessage);
                        vm.messageIsHideOrShow(20,-60,4000,JSON.parse(carJson).planNumber+' 任务发货单回途中');
                    }
                    if (vm.invoiceTimeMessage.status == 10){ //状态为10的  计算出卸料时长
                        vm.calculationUnloadingTime(10,vm.invoiceTimeMessage);//更新时间
                        vm.messageIsHideOrShow(20,-60,4000,JSON.parse(carJson).planNumber+' 任务发货单卸料完成');
                    }
                    if (vm.invoiceTimeMessage.status == 8){ //状态为8的时候移除发货单
                        vm.removePlanListForCar(vm.invoiceTimeMessage);//移除发货单
                        vm.setPlansForCarMessage(vm.invoiceTimeMessage);
                        if (vm.engineeringInformation.length == 0){
                            vm.getEngineeringList();
                        }
                    }
                }else if (JSON.parse(greeting.body).messageType == 'SOCKET_PUSH_DEVLIVERY'){
                    //console.log("%c ((((发货单信息)))))","color:#0000ff",carJson);
                    vm.insertNewPlanForList(JSON.parse(carJson));
                    vm.insertDeliveryForList(JSON.parse(carJson));
                    vm.messageIsHideOrShow(20,-60,4000,JSON.parse(carJson).planNumber+' 任务有新的发货单了!');
                }else if (JSON.parse(greeting.body).messageType == 'SOCKET_DISCONNECT'){
                    //console.log("%c -=-=-=已经断开连接-=-=-=","color:purple",carJson);
                    vm.carStatusUpdate(1,carJson,markerArray);
                    vm.updatePlanListCarStatusOpen(carJson,1);
                    vm.updateDeliveryCarStatusOpen(carJson,1);
                    vm.isFirstCarStatusFlag.forEach((c)=>{
                        if (c.carID == carJson){
                            c.carStatus = false;
                        }
                    })
                }else if (JSON.parse(greeting.body).messageType == 'SOCKET_INVALID_DEVLIVERY'){
                    //console.log("%c ******作废发货单信息**********","color:pink",carJson);
                    vm.toVoidPlanFoMessage(carJson);
                }else if(JSON.parse(greeting.body).messageType == 'SIGN_DELIVERY'){
                    //console.log("%c /////-签收状态消息-/////","color:red",carJson);
                    vm.signInStatusOfPlanForMessage(JSON.parse(carJson));
                }else if(JSON.parse(greeting.body).messageType == 'SOCKET_UPDATE_PROJECT_INFO'){
                    //console.log("%c 11111-修改工程信息-11111","color:red",carJson);
                    vm.updateEngineeringForMessage(JSON.parse(carJson)); //修改计划列表的工程
                    vm.updateEngineeringMarkerForMessage(JSON.parse(carJson));//修改工地围栏marker名称
                    vm.updateEngineeringListForMessage(JSON.parse(carJson));//修改工程列表的工程
                    vm.updateEngineeringMessageForMessage(JSON.parse(carJson));//修改现实的工程信息的名称
                }else if(JSON.parse(greeting.body).messageType == 'SOCKET_UPDATE_VEHICLE_INFO'){
                    //console.log("%c 22222-修改车辆信息-22222","color:red",carJson);
                    vm.updateAllCarForMessage(JSON.parse(carJson));
                }else if(JSON.parse(greeting.body).messageType == 'SOCKET_UPDATE_DRIVER_INFO'){
                    //console.log("%c 33333-修改司机信息-33333","color:red",carJson);
                    vm.updatePlanDriverMesForMessage(JSON.parse(carJson));
                }else if(JSON.parse(greeting.body).messageType == 'SOCKET_INSERT_PLAN_INFO'){
                    //console.log("%c 44444-新增计划推送-44444","color:red",carJson);
                    vm.createNewPlanForMessage(JSON.parse(carJson));
                    vm.createNewPlanForMessageToEngineerList(JSON.parse(carJson));
                }else if(JSON.parse(greeting.body).messageType == 'SOCKET_UPDATE_PLAN_INFO'){
                    //console.log("%c 55555-修改计划推送-55555","color:red",carJson);
                    vm.updatePlanForMessage(JSON.parse(carJson));
                    vm.updateEngineeringListForMessageInDel(JSON.parse(carJson));
                    vm.updateEngineeringForMessageInDel(JSON.parse(carJson));
                }else if(JSON.parse(greeting.body).messageType == 'VEHICLE_BINDING'){
                    //console.log("%c 666666-新增绑定车辆-666666","color:red",carJson);
                    vm.insertCarForMessage(JSON.parse(carJson));
                    vm.isFirstCarStatusFlag.push({
                        carID:JSON.parse(carJson).vehicleId,
                        carStatus:false //离线
                    });
                }else if(JSON.parse(greeting.body).messageType == 'VEHICLE_UNTIE'){
                    // console.log("%c 777777-解绑车辆-777777","color:red",carJson);
                    vm.deleteCarForMessage(JSON.parse(carJson));
                }else if(JSON.parse(greeting.body).messageType == 'SOCKET_OFFLINE_DELIVERY_TIME_STAUTS'){
                    //console.log("%c 88888-离线后重新上线消息-88888","color:red",carJson);
                    vm.updateDeliveryVehicleCarStatus(JSON.parse(carJson));
                    vm.updatePlanCarStatusForMessage(JSON.parse(carJson));
                }else if(JSON.parse(greeting.body).messageType == 'SOCKET_PUSH_UPDATE_DEVLIVERY'){
                    //console.log("%c 99999-修改发货单信息-99999","color:red",carJson);
                    vm.updateDeliveryForMessage(JSON.parse(carJson));
                    vm.updatePlanDeliveryForMessage(JSON.parse(carJson));
                    vm.updateEngineeringMessage(JSON.parse(carJson));
                }else if(JSON.parse(greeting.body).messageType == 'SOCKET_DELIVERY_STATUS_FINISH'){
                    // console.log("%c LLLL-返货单完成回站-LLLL","color:red",carJson);
                     vm.invoiceCompleteBackStation(JSON.parse(carJson));
                }
            });
        });
    }
    var markerArray = [],markerArrayLabel = [];// 车辆集合
    var sleepTime = 3; // 秒
    setTimeout(connect, 100);

    /**
     * 初始化车辆marker
     * @param obj 车辆对象
     */
    function initCar(flag,obj) {
        let icon = createCarIcon(flag);
        marker = new AMap.Marker({
            map: map,
            position: obj.position,
            offset: new AMap.Pixel(-20, -10),
            autoRotation: true,
            extData: obj.extData ? obj.extData : 0,
            angle: obj.angleCar,
        });
        if (flag == 0){ // 在线情况
            marker.setIcon(icon);
        }else{ // 离线情况
            marker.setIcon(icon);
        }
        markerArray.push(marker);
        var markerLabel = new AMap.Marker({
            map: map,
            position: obj.position,
            offset: new AMap.Pixel(-20, -50),
            autoRotation: false,
            extData: obj.extData ? obj.extData : 0,
            content: "<div class='markerLabel'>" + obj.carNum + "<div>",
        });
        markerArrayLabel.push(markerLabel);

        return marker;
    }

    /**
     * 车辆的点击事件
     */
    function  markerClick(){
        let carID;
        if (markerArray){
            markerArray.forEach((m)=>{
                m.on('click',function () {
                    carID = m.getExtData();
                    vm.searchForMapByCarNumber.vehicleNumber = '';
                    vm.searchForMapByCarNumber.vehicleId = '';
                    vm.mapResult.productionVehicleBeans.forEach((c)=>{
                        if (c.schedulingProductionVehicleId == carID) {
                            vm.searchForMapByCarNumber.vehicleNumber = c.number;
                            vm.searchForMapByCarNumber.vehicleId = c.schedulingProductionVehicleId;
                            vm.getEngineeringByCarNumber(vm.searchForMapByCarNumber);
                        }
                    })
                });
            })
        }
    }

    /**
     * 根据车辆状态 返回不同的icon
     * @param flag 车辆状态
     * @returns {AMap.Icon} 返回icon
     */
    function createCarIcon(flag){
        let iconSrc;
        if (flag == 0) { //在线
            iconSrc = 'img/gc.png';
        }else if (flag == 1){ //离线
            iconSrc = 'img/bc.png';
        }
        let icon = new AMap.Icon({ //在线的图标
            image : iconSrc,//24px*24px
            size: new AMap.Size(40, 20), // 图标大小
            imageSize: new AMap.Size(40, 20)
        });
        return icon;
    }
    /**
     * 页面初始化时判断是否联网   重新联网后重新尝试连接socket
     * @constructor
     */
    function IsNetworkConnection(){
        if(window.navigator.onLine==false) {
            vm.showMessageModal("您已断开网路连接,请检查网络设置!");
        }
        var EventUtil = {
            addHandler: function (element, type, handler) {
                if(element.addEventListener) {
                    element.addEventListener(type, handler, false);
                }else if (element.attachEvent) {
                    element.attachEvent("on" + type, handler);
            }else {
                    element["on" + type] = handler;
                }
            }
        };
        EventUtil.addHandler(window, "online", function () {
            vm.showMessageModal("您已重新连接网络!");
            connect()//重新请求
        });
        EventUtil.addHandler(window, "offline", function () {
            vm.showMessageModal("您已断开网路连接,请检查网络设置!");
        });
    }
    /**
     * 设置地图的当前定位的点
     */
    function setMapCenterOrCity(){
        let optionCity = "北京";
        var singleSelect1 = $('#single-select-1').citySelect({
            dataJson: cityData,
            multiSelect: false,
            whole: true,
            shorthand: true,
            search: true,
            onInit: function () {
                // map.setCity(optionCity);
            },
            onTabsAfter: function (target) {
            },
            onCallerAfter: function (target, values) {
                optionCity = `${values.name}`;
                map.setCity(optionCity);
                map.setFitView();
            }
        });
        // 单选设置城市
        singleSelect1.setCityVal(`${optionCity}市`)
    }

    function scroll(viewid,scrollid,size){
        // 获取滚动条容器
        var container = document.getElementById(scrollid);
        // 将表格拷贝一份
        var tb2 = document.getElementById(viewid).cloneNode(true);
        // 获取表格的行数
        var len = tb2.rows.length;
        // 将拷贝得到的表格中非表头行删除
        for(var i=tb2.rows.length;i>size;i--){
            // 每次删除数据行的第一行
            tb2.deleteRow(size);
        }
        // 创建一个div
        var bak = document.createElement("div");
        // 将div添加到滚动条容器中
        container.appendChild(bak);
        // 将拷贝得到的表格在删除数据行后添加到创建的div中
        bak.appendChild(tb2);
        // 设置创建的div的position属性为absolute，即绝对定于滚动条容器（滚动条容器的position属性必须为relative）
        bak.style.position = "absolute";
        // 设置创建的div的背景色与原表头的背景色相同（貌似不是必须）
        bak.style.backgroundColor = "#cfc";
        // 设置div的display属性为block，即显示div（貌似也不是必须，但如果你不希望总是显示拷贝得来的表头，这个属性还是有用处的）
        bak.style.display = "block";
        // 设置创建的div的left属性为0，即该div与滚动条容器紧贴
        bak.style.left = 0;
        // 设置div的top属性为0，初期时滚动条位置为0，此属性与left属性协作达到遮盖原表头
        bak.style.top = "0px";
        bak.style.width = "100%";
        // 给滚动条容器绑定滚动条滚动事件，在滚动条滚动事件发生时，调整拷贝得来的表头的top值，保持其在可视范围内，且在滚动条容器的顶端
        container.onscroll = function(){
            // 设置div的top值为滚动条距离滚动条容器顶部的距离值this.scrollTop+"px"
            bak.style.top = this.scrollTop+"px";
        }
    }

    /**
     * 刷新页面
     */
    function myRefresh() {
        window.location.reload();
    }

    /**
     * 区分两个时间的早晚
     * @param startTime
     * @param endTime
     * @returns {boolean}
     */
    function timeBool(startTime, endTime) {
        var startTime = startTime;
        var endTime = endTime;
        if(startTime && endTime) {
            var startTmp = startTime.split("-");
            var endTmp = endTime.split("-");
            var sd = new Date(startTmp[0], startTmp[1], startTmp[2]);
            if(endTmp[2] == 31) {
                endTmp[2] = 30;
            }
            var ed = new Date(endTmp[0], endTmp[1], endTmp[2]);
            if(sd.getTime() > ed.getTime()) {
                return false;
            } else {
                return true;
            }
        }
    }
}
