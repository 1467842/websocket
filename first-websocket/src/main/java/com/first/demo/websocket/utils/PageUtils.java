package com.first.demo.websocket.utils;

import lombok.Getter;
import lombok.Setter;

/**
 * Created with IntelliJ IDEA.
 * Description: 分页工具类
 *
 * @author 张立勇
 * Date: 2018/4/10
 * Time: 9:44
 */
@Getter
@Setter
public class PageUtils<T> {
    // 总条数
    private long totalPages;
    // 总页数
    private int pages;
    // 当前页
    private int pageNum;
    // 分页数据
    private T list;
}
