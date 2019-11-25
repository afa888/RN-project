import React, { Component } from 'react';
import {
    Modal,
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
    BackAndroid, TouchableOpacity, Image, ScrollView, Alert
} from 'react-native';
import { NavigationActions } from "react-navigation";
import { category_group_divide_line_color, category_tab_checked_bg_color, theme_color } from "../utils/AllColor";
import { CalendarList, Calendar } from "react-native-calendars";
import { MainTheme } from "../utils/AllColor";

let Dimensions = require('Dimensions');
let SCREEN_WIDTH = Dimensions.get('window').width;//宽
let SCREEN_HEIGHT = Dimensions.get('window').height;//高


export default class CalendarDialog extends Component<Props> {

    // 构造
    constructor(props) {
        super(props);
    }


    static defaultProps = {
        _dialogVisible: false,
    }

    render() {
        const { pastScrollRange, currentData, maxDate, minDate } = this.props;
        // onPress事件直接与父组件传递进来的属性挂接
        return (
            <Modal
                visible={this.props._dialogVisible}
                transparent={true}
                onRequestClose={() => {
                }} //如果是Android设备 必须有此方法
            >
                <View style={styles.bg}>
                    <View style={styles.dialog}>
                        <View style={styles.dialogTitleView}>
                            <Text style={styles.dialogTitle}>
                                {this.props._dialogTitle}
                            </Text>
                            <TouchableOpacity onPress={this.props._dialogCancle}>
                                <Image source={require('../static/img/login_x.png')}
                                    style={{
                                        resizeMode: 'contain',
                                        width: 15,
                                        height: 15,
                                        margin: 12
                                    }} />
                            </TouchableOpacity>
                        </View>
                        <CalendarList current={currentData}
                            pastScrollRange={pastScrollRange || 1}
                            futureScrollRange={0}
                            minDate={minDate}
                            maxDate={maxDate || currentData}
                            theme={{
                                textDisabledColor: MainTheme.GrayColor,
                                dayTextColor: MainTheme.DarkGrayColor,
                                textSectionTitleColor: MainTheme.DarkGrayColor,
                                todayTextColor: MainTheme.SpecialColor,
                            }}
                            onDayPress={(days) => {
                                this.props.onDayPress(days)
                            }}
                        />
                    </View>
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
    },
    dialog: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.8,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    dialogTitleView: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.04,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    dialogTitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#000000',
        marginLeft: 12,
    },
});
