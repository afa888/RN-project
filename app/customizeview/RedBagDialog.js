import React, {Component} from 'react';
import {
    Modal,
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
    BackAndroid, TouchableOpacity, Image, ScrollView, ImageBackground, DeviceEventEmitter
} from 'react-native';
import {NavigationActions} from "react-navigation";
import {category_group_divide_line_color, category_tab_checked_bg_color, theme_color} from "../utils/AllColor";
import http from "../http/httpFetch";
import {getStoreData} from "../http/AsyncStorage";
import {BASE_URL,WEBNUM} from "../utils/Config"
import AndroidNativeGameActiviy from "./AndroidIosNativeGameActiviy";

let Dimensions = require('Dimensions');
let SCREEN_WIDTH = Dimensions.get('window').width;//宽
let SCREEN_HEIGHT = Dimensions.get('window').height;//高

let timeData
let timeNumber
export default class RedBagDialog extends Component<Props> {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            time: "",
            isVisibleTime: this.props.dialogData.diff > 0 && this.props.dialogData.status === "waiting",
        }
        timeData = new Date()
        timeNumber = parseInt(this.props.dialogData.diff);
    }

    componentWillMount() {

        if (this.props.dialogData.diff > 0 && this.props.dialogData.status === "waiting") {
            this.timeOut()
        }
    }

    formartData = (diff) => {
        const timeLeft = {
            days: 0,
            hours: 0,
            min: 0,
            sec: 0,
        };


        if (diff >= 86400) {
            timeLeft.days = Math.floor(diff / 86400);
            diff -= timeLeft.days * 86400;
        }
        if (diff >= 3600) {
            timeLeft.hours = Math.floor(diff / 3600);
            diff -= timeLeft.hours * 3600;
        }
        if (diff >= 60) {
            timeLeft.min = Math.floor(diff / 60);
            diff -= timeLeft.min * 60;
        }

        timeLeft.sec = diff;
        console.log(String(timeLeft.sec).length + " 秒的长度 ")
        if (String(timeLeft.hours).length <= 1) {
            timeLeft.hours = '0' + timeLeft.hours
        }
        if (String(timeLeft.min).length <= 1) {
            timeLeft.min = '0' + timeLeft.min
        }
        if (String(timeLeft.sec).length <= 1) {
            timeLeft.sec = '0' + timeLeft.sec
        }
        this.setState({time: timeLeft.days + "天" + timeLeft.hours + "小时" + timeLeft.min + "分" + timeLeft.sec + "秒"})
    }

    componentDidMount() {


    }

    timeOut = () => {
        this.timer = setTimeout(() => {
            console.log("把一个定时器的引用挂在this上");
            timeNumber = timeNumber - 1
            if (timeNumber === 0) {
                this.timer && clearTimeout(this.timer);
                this.setState({isVisibleTime: false})
                return
            }
            this.formartData(timeNumber)
            this.timeOut()
        }, 1000);
    }

    componentWillUnmount() {
        // 请注意Un"m"ount的m是小写

        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    clickRedBag = () => {
        getStoreData('@loginState').then((loginInfo) => {
            if (loginInfo.isLogin) {
                this.hideRedBag()
                let  baseUrl = BASE_URL.split(WEBNUM+"/");
                let url = baseUrl[0] + "Coupon?token=" + loginInfo.token
                AndroidNativeGameActiviy.openGameWith(url, "", "");
            } else {
                DeviceEventEmitter.emit('login', false); //导航到login页面
            }
        });
    }

    hideRedBag = () => {
        this.props._dialogCancle()
        this.timer && clearTimeout(this.timer);
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
                                       marginTop: SCREEN_WIDTH * 0.9 * (791 / 750) - SCREEN_WIDTH * 0.2 * (76 / 314) - 70
                                   }}/>
                            {this.state.isVisibleTime &&
                            <Text style={{color: 'white', fontSize: 16}}>{this.state.time}</Text>}
                            <TouchableOpacity onPress={() => {
                                this.clickRedBag()
                            }}>
                                <Image source={require('../static/img/btn_djqhb.png')}
                                       style={this.props.dialogData.diff > 0 && this.props.dialogData.status === "waiting" ? {
                                           resizeMode: 'contain',
                                           width: SCREEN_WIDTH * 0.2,
                                           height: SCREEN_WIDTH * 0.2 * (76 / 314),

                                       } : {
                                           resizeMode: 'contain',
                                           width: SCREEN_WIDTH * 0.2,
                                           height: SCREEN_WIDTH * 0.2 * (76 / 314),
                                           marginTop: 15
                                       }}/>
                            </TouchableOpacity>

                        </View>
                    </ImageBackground>
                    <TouchableOpacity onPress={() => {
                        this.hideRedBag()
                    }}>
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
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_WIDTH * 0.9 * (791 / 750),
        borderRadius: 8,
    },
    dialogTitleView: {
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_WIDTH * 0.9 * (791 / 750),
        flexDirection: 'column',
        alignItems: 'center',
    },


});
