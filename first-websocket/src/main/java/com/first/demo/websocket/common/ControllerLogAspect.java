package com.first.demo.websocket.common;

import com.first.demo.file.util.JsonUtil;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;

/**
 * <b>功能名: </b>统一日志<br>
 * <b>说明: </b>统一日志处理类<br>
 * <b>著作权: </b> Copyright (C) 2017 DCJINCHAN CORPORATION<br>
 * <b>修改履历: </b>
 *
 * @author 2018-05-07 郑志辉
 */
@Aspect
@Component
@Slf4j
public class ControllerLogAspect {
    @Pointcut("execution(public * com.first.demo.websocket.controller.*.*(..))")
    public void webLog() {
    }

    @Before("webLog()")
    public void deBefore(JoinPoint joinPoint) {
        // 接收到请求，记录请求内容
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        // 记录下请求内容
        log.info("URL : " + request.getRequestURL().toString());
        log.info("HTTP_METHOD : " + request.getMethod());
        log.info("IP : " + request.getLocalAddr());
        log.info("CLASS_METHOD : " + joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName());
        log.info("ARGS : " + Arrays.toString(joinPoint.getArgs()));

    }

    @AfterReturning(returning = "ret", pointcut = "webLog()")
    public void doAfterReturning(Object ret) {
        // 处理完请求，返回内容
        log.info("方法的返回值 : " + JsonUtil.parseJsonString(ret));
    }

    //后置异常通知
    @AfterThrowing("webLog()")
    public void throwss(JoinPoint jp) {
//        System.out.println("方法异常时执行.....");
    }

    //后置最终通知,final增强，不管是抛出异常或者正常退出都会执行
    @After("webLog()")
    public void after(JoinPoint jp) {
//        System.out.println("方法最后执行.....");
    }

    //环绕通知,环绕增强，相当于MethodInterceptor
    @Around("webLog()")
    public Object arround(ProceedingJoinPoint pjp) throws Throwable {
        return pjp.proceed();
    }
}