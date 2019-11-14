import React, { Component } from 'react';


export const category_tab_checked_bg_color = "#f2f2f2";

export const category_group_divide_line_color = "#F2F2F2";

export const theme_color = '#de4938';

export const ThemeEditTextTextColor = '#666666';

export const textTitleColor = "#333333"; //一级文字
export const textHightTitleColor = "#111111"; //最重要文字
export const textThreeHightTitleColor = "#999999"; //次要文字

/**
 * 定义全局主题相关属性
 * @author Nail
**/
export class MainTheme {
    // 强调色
    static SpecialColor = theme_color;

    static specialTextColor = '#DF4B39';

	static backgroundViewColor = '#FFFFFF'; //页面默认背景

	static commonButtonBGColor = '#E94335';  //按钮button默认背景

	static commonButton2BGColor = '#EFEFF4'; // 特殊选择button 背景

	static commonButtonTitleColor = '#FFFFFF'; //button 通用文字颜色

	static tipsSpecialTextColor = '#DE4A38';
    // 浅灰色
    static LightGrayColor = '#CCCCCC';
    // 下划线 色值
    static lineBottomColor = '#eae6e4'
    // 灰色值
    static GrayColor = '#999999';
    // 深灰色
    static DarkGrayColor = '#333333';
    // 普通文本颜色
    static TextTitleColor = textTitleColor;
    // 视图的背景色
    static BackgroundColor = '#FFFFFF';
    // 提交按钮的文本的颜色
    static SubmitTextColor = '#FFFFFF';

    static theme_color = '#de4938';
    // 资金记录及投注记录页面等，盈利时的字体颜色
    static FundGreenColor = '#33CC00';
    // 通用分隔线颜色
    static DivideLineColor = '#DDD';
};

export default MainTheme;
