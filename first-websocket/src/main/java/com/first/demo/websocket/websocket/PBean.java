package com.first.demo.websocket.websocket;

import lombok.Data;

/**
 * Created with IntelliJ IDEA.
 * Description:
 * User: 郑志辉
 * Date: 2018-04-13
 * Time: 上午11:03
 */
@Data
public class PBean {
    private Integer pageSize;
    private Integer pageIndex;
    private String sectionId;
    private Long totalPage;
}
