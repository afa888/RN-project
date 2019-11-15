import React, {Component} from 'react';
import {
    Modal,
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
    BackAndroid, TouchableOpacity, Image, ScrollView, ImageBackground
} from 'react-native';
import {NavigationActions} from "react-navigation";
import {category_group_divide_line_color, category_tab_checked_bg_color, theme_color} from "../utils/AllColor";

let Dimensions = require('Dimensions');
let SCREEN_WIDTH = Dimensions.get('window').width;//宽
let SCREEN_HEIGHT = Dimensions.get('window').height;//高


export default class ModalDialog extends Component<Props> {

    // 构造
    constructor(props) {
        super(props);
    }


    static defaultProps = {
        _dialogTitle: '公告',
        _dialogContent: '',
        _dialogLeftBtnTitle: '取消',
        _dialogRightBtnTitle: '确定',
        _dialogVisible: false,
    }

    render() {
        // onPress事件直接与父组件传递进来的属性挂接
        return (
            <Modal
                visible={this.props._dialogVisible}
                transparent={true}
                onRequestClose={() => {
                }} //如果是Android设备 必须有此方法
            >
                <View style={styles.bg}>
                    <ImageBackground style={styles.dialog}
                                     source={require('../static/img/hb_background.png')}
                                     resizeMode='contain'>
                        <View style={styles.dialogTitleView}>
                            <Image source={require('../static/img/text_dsps.png')}
                                   style={{
                                       resizeMode: 'contain',
                                       width: SCREEN_WIDTH * 0.2,
                                       height: SCREEN_WIDTH * 0.2 * (76 / 314),
                                       marginTop: SCREEN_WIDTH * 0.8 * (791 / 750) - SCREEN_WIDTH * 0.2 * (76 / 314) - 60

                                   }}/>
                            {<Text style={{color: 'white', fontSize: 16}}>1天99小时14分20秒</Text>}
                            <TouchableOpacity onPress={this.props._dialogCancle}>
                                <Image source={require('../static/img/btn_djqhb.png')}
                                       style={{
                                           resizeMode: 'contain',
                                           width: SCREEN_WIDTH * 0.2,
                                           height: SCREEN_WIDTH * 0.2 * (76 / 314),
                                       }}/>
                            </TouchableOpacity>

                        </View>
                    </ImageBackground>
                    <TouchableOpacity onPress={this.props._dialogCancle}>
                        <Image source={require('../static/img/hb_back.png')}
                               style={{
                                   resizeMode: 'contain',
                                   width: 25,
                                   height: 25,
                               }}/>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    bg: {  //全屏显示 半透明 可以看到之前的控件但是不能操作了
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(52,52,52,0.5)',  //rgba  a0-1  其余都是16进制数
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    dialog: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_WIDTH * 0.8 * (791 / 750),
        borderRadius: 8,
    },
    dialogTitleView: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_WIDTH * 0.8 * (791 / 750),
        flexDirection: 'column',
        alignItems: 'center',
    },
    dialogTitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#000000',
        marginLeft: 12,
    },
    dialogContentView: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.27,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogContent: {
        textAlign: 'left',
        fontSize: 13,
        margin: 12,
    },
    dialogBtnView: {
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_HEIGHT * 0.04,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',


    },
    dialogBtnViewItem: {
        width: 60,
        height: SCREEN_HEIGHT * 0.03,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme_color,
        borderRadius: 3,
        marginRight: 8
    },
    leftButton: {
        fontSize: 18,
        color: '#007AFF',
        borderBottomLeftRadius: 8,
    },
    rightButton: {

        fontSize: 12,
        color: 'white',
        borderBottomRightRadius: 8,
    }
});
