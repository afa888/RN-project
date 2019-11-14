import React, { Component } from 'react';
import {
    StyleSheet, View, Alert, Text,
    Image, TouchableOpacity, ScrollView,
    Platform, BackHandler, DeviceEventEmitter
} from "react-native";
import MainTheme from "../../../utils/AllColor";
import { loginOutDo } from "../../auth/changeLoginStatus";
import http from "../../../http/httpFetch";
import { RN_VERSION } from "../../../utils/Config";
import TXToastManager from "../../../tools/TXToastManager";
import AndroidIosNativeGameActiviy from "../../../customizeview/AndroidIosNativeGameActiviy";
import { getStoreData } from "../../../http/AsyncStorage";
import DeviceValue from "../../../utils/DeviceValue";

const PERSON_SETTING_BG_COLOR = '#F2F2F2';

export default class PersonSetting extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('用户信息')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: (
                <View />
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            realName: '',
            mobile: '',
            weixin: '',
            qq: '',
            reg_date: '',
            login_time: '',
            mobileStatus: '',
            uid: '',
            version: 0
        };
    }

    componentWillMount() {
        // 获取版本
        AndroidIosNativeGameActiviy.getVersion().then((andriodVersionCode) => {
            this.setState({ version: andriodVersionCode })
        });
        // 获取用户信息
        this.refreshUserInfo();
        // 监听用户信息变化
        this.listener = DeviceEventEmitter.addListener('bindSuccess', this.refreshUserInfo.bind(this));//必须绑定this 否则会找不到 this
    }
    componentWillUnmount() {
        this.listener.remove();//删除订阅
    }

    /**
     * 退出事件处理
     */
    logOut() {
        Alert.alert('温馨提示', '退出账户，是否继续？', [
            { text: '取消', onPress: () => console.log('Cancel loginOut') },
            {
                text: '确定', onPress: () => {
                    http.post('logout.do', {}, true).then(res => {
                        if (res.status === 10000) {
                            loginOutDo()
                        }
                        TXToastManager.show(res.msg);
                    })
                }
            },
        ]);
    }
    /**
     * 设置手机号
     */
    setPhone = () => {
        if (this.state.mobileStatus === '未认证') {
            this.props.navigation.navigate('BindPhoneNumScreen')
        } else {
            return false;
        }
    };
    /**
     * 获取用户信息
     */
    refreshUserInfo() {
        getStoreData('userInfoState').then((userInfo) => {
            console.log(userInfo);
            let { userName, realname, mobile, weixin, qq, reg_date, login_time, mobileStatus, uid } = userInfo;
            this.setState({
                userName: userName,
                realName: realname,
                mobile: mobile,
                weixin: weixin,
                qq: qq,
                reg_date: reg_date,
                login_time: login_time,
                mobileStatus: mobileStatus == '0' ? '未认证' : '已认证',
                uid: uid
            })
        })
    }

    /**
     * 修改/设置微信号
     */
    changeWechat = () => {
        this.props.navigation.navigate('ContactSetting', {
            title: this.state.weixin == '' ? '设置微信号' : '修改微信号',
            type: 2,
            uid: this.state.uid,
        });
    }

    /**
     * 修改/设置QQ号
     */
    changeQQNumber = () => {
        this.props.navigation.navigate('ContactSetting', {
            title: this.state.qq == '' ? '设置QQ号' : '修改QQ号',
            type: 3,
            uid: this.state.uid,
        });
    }

    render() {
        const { userName, realName, mobile, weixin, qq, reg_date, login_time, mobileStatus } = this.state;

        return (
            <ScrollView style={styles.container}>
                {/* 空白分隔 */}
                <View style={[styles.blankStyle, { height: 15 }]} />
                {/* 用户名 */}
                <View style={styles.item}>
                    <Text>用户名</Text>
                    <Text style={styles.detailText}>{userName}</Text>
                </View>
                {/* 空白分隔 */}
                <View style={styles.blankStyle} />
                {/* 真实姓名 */}
                <View style={styles.item}>
                    <Text style={{ flex: 1 }}>真实姓名</Text>
                    <Text style={styles.detailText} >{realName || '未设置'}</Text>
                    {
                        (realName === '' || realName == undefined) ?
                            < Image source={require('../../../static/img/arrow_more.png')}
                                style={styles.arrowStyle} /> : null
                    }
                </View>
                {/* 手机号 */}
                <View style={[styles.item, { paddingVertical: 0 }]}>
                    <Text>手机号</Text>
                    <TouchableOpacity onPress={() => { this.setPhone() }}>
                        <View style={styles.itemDetail}>
                            <Text style={styles.detailText}>{`${mobile.slice(0, 3)}****${mobile.slice(7, 11)}(${mobileStatus})`}</Text>
                            {
                                (mobileStatus === '未认证') ?
                                    <Image source={require('../../../static/img/arrow_more.png')}
                                        style={styles.arrowStyle} /> : <Text />
                            }
                        </View>
                    </TouchableOpacity>
                </View>
                {/* 微信号 */}
                <View style={[styles.item, { paddingVertical: 0 }]}>
                    <Text>微信号</Text>
                    <TouchableOpacity onPress={this.changeWechat}>
                        <View style={styles.itemDetail}>
                            <Text style={styles.detailText}>{weixin || '未设置'}</Text>
                            <Image source={require('../../../static/img/arrow_more.png')}
                                style={styles.arrowStyle} />
                        </View>
                    </TouchableOpacity>
                </View>
                {/* QQ号 */}
                <View style={[styles.item, { paddingVertical: 0 }]}>
                    <Text>QQ号</Text>
                    <TouchableOpacity onPress={this.changeQQNumber}>
                        <View style={styles.itemDetail}>
                            <Text style={styles.detailText}>{qq || '未设置'}</Text>
                            <Image source={require('../../../static/img/arrow_more.png')}
                                style={styles.arrowStyle} />
                        </View>
                    </TouchableOpacity>
                </View>
                {/* 空白分隔 */}
                <View style={styles.blankStyle} />
                {/* 注册时间 */}
                <View style={styles.item}>
                    <Text>注册时间</Text>
                    <Text style={styles.detailText}>{reg_date}</Text>
                </View>
                {/* 登录时间 */}
                <View style={styles.item}>
                    <Text>最后登录时间</Text>
                    <Text style={styles.detailText}>{login_time}</Text>
                </View>
                {/* <View style={styles.item}>
                    <Text >版本信息</Text>
                    <Text style={styles.detailText}>{RN_VERSION+"-"+this.state.version}></Text>
                </View> */}
                {/* 退出登录按钮 */}
                {/* <TouchableOpacity onPress={() => this.logOut()} style={styles.login_out_button} >
                    <Text style={{ color: MainTheme.SubmitTextColor }}>退出登录</Text>
                </TouchableOpacity> */}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        lineHeight: 60,
        fontSize: 16,
        paddingLeft: 16
    },

    container: {
        flex: 1,
        backgroundColor: PERSON_SETTING_BG_COLOR
    },

    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: MainTheme.BackgroundColor,
        borderBottomWidth: 0.5,
        borderBottomColor: PERSON_SETTING_BG_COLOR,
    },

    login_out_button: {
        height: 40,
        width: DeviceValue.windowWidth - 45,
        alignSelf: 'center',
        backgroundColor: MainTheme.SpecialColor,
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },

    blankStyle: {
        height: 10,
        width: DeviceValue.windowWidth,
        backgroundColor: PERSON_SETTING_BG_COLOR,
    },

    itemDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },

    detailText: {
        color: MainTheme.GrayColor,
        fontSize: 14,
    },

    arrowStyle: {
        resizeMode: 'contain',
        width: 14,
        height: 14,
        marginLeft: 10,
    },
});
