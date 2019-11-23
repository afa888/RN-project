import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Dimensions from 'Dimensions'
export const category_tab_checked_bg_color = "#f2f2f2";

export const category_group_divide_line_color = "#F2F2F2";

export const theme_color = '#de4938';

export const ThemeEditTextTextColor = '#666666';

export const textTitleColor = "#333333"; //一级文字
export const textHightTitleColor = "#111111"; //最重要文字
export const textThreeHightTitleColor = "#999999"; //次要文字
export const CircleGoldColor = '#FFCC99'
export const BarBlueColor = '#3AA1FF'

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
    //银行汇款成功界面银行信息背景颜色
    static BankTransgerBGColor = '#EB6F5A';
    //银行信息文字颜色
    static BankInfoFontColor = '#FFFFFF';


    /* ============================= 以下为一些通用控件的定义 ============================= */

    /**
     *  生成普通页面的标题
     *  使用方式：headerTitle: MainTheme.renderCommonTitle('title'),
     */
    static renderCommonTitle = (title) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={MainTheme.GlobalStyles.PageTitle}>{title}</Text>
            </View>
        );
    }

    /**
     * 生成普通页面的返回按钮
     * 使用方式：headerLeft: MainTheme.renderCommonBack(navigation),
     */
    static renderCommonBack = (navigation) => {
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={{ width: 60, height: 20, alignItems: 'center' }}
                    onPress={() => { navigation.goBack() }}>
                    <Image source={require('../static/img/titlebar_back_normal.png')}
                        style={MainTheme.GlobalStyles.PageBackImage} />
                </TouchableOpacity>
            </View>
        );
    }

    /**
    * 生成底部全屏提交通用按钮
    * 使用方式：MainTheme.renderCommonBottomSubmitButton(onPress,title),
    */
    static renderCommonBottomSubmitButton = (onPressF,title='下一步') => {
        return (
            <View style={{paddingTop:7,alignItems: 'center',height:60}}>
                <TouchableOpacity  onPress={onPressF}  activeOpacity={0.2} focusedOpacity={0.5}>
                 <View style=  {{justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width,height:53,backgroundColor:MainTheme.commonButtonBGColor}}>

                    <Text style={{color:MainTheme.commonButtonTitleColor,fontSize:20}}>{title}</Text>
                 </View>
                </TouchableOpacity>
            </View>
        );
    }

    /**
    * 生成默认提交通用按钮
    * 使用方式：MainTheme.renderCommonBottomSubmitButton(onPress,title),
    */
    static renderCommonSubmitButton = (onPressF,title='确定',paddingLeft=22.5) => {
        return (
            <View style={{paddingTop:18,alignItems: 'center',height:60}}>
                <TouchableOpacity  onPress={onPressF}  activeOpacity={0.2} focusedOpacity={0.5}>
                 <View style=  {{borderRadius:8,justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 2*paddingLeft,height:42,backgroundColor:MainTheme.commonButtonBGColor}}>

                    <Text style={{color:MainTheme.commonButtonTitleColor,fontSize:16}}>{title}</Text>
                 </View>
                </TouchableOpacity>
            </View>
        );
    }

    /**
    * 生成默认通用取消按钮
    * 使用方式：MainTheme.renderCommonBottomSubmitButton(onPress,title),
    */
    static renderCommonCancelButton = (onPressF,title='取消') => {
        return (
            <View style={{paddingTop:18,alignItems: 'center',height:60}}>
                <TouchableOpacity  onPress={onPressF}  activeOpacity={0.2} focusedOpacity={0.5}>
                    <View style=  {{borderRadius:8,borderWidth:1,borderColor:MainTheme.specialTextColor,borderStyle: 'solid',justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 45,height:40,backgroundColor:MainTheme.backgroundColor}}>

                        <Text style={{color:MainTheme.specialTextColor,fontSize:16}}>{title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    /* ============================= 以下为一些通用样式的定义 ============================= */

    /**
     *  定义一些全局的通用样式
     */
    static GlobalStyles = StyleSheet.create({
        // 页面的标题文本的样式
        PageTitle: {
            fontSize: 18,
            color: MainTheme.DarkGrayColor,
            fontWeight: 'bold',
            textAlign:'center',
        },
        // 页面的返回按钮的Image样式
        PageBackImage: {
            resizeMode: 'contain',
            width: 25,
            height: 20,
            marginLeft: 12,
        },
    });
};

export default MainTheme;
