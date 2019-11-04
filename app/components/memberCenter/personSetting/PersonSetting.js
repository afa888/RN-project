import React, {Component} from 'react';
import {
    StyleSheet, View, Alert, Text,
    Image, TouchableOpacity, ScrollView,
    Platform, BackHandler, DeviceEventEmitter
} from "react-native";
import {theme_color} from "../../../utils/AllColor";
import {loginOutDo} from "../../auth/changeLoginStatus";
import http from "../../../http/httpFetch";
import { RN_VERSION} from "../../../utils/Config";
import TXToastManager from "../../../tools/TXToastManager";
import AndroidIosNativeGameActiviy from "../../../customizeview/AndroidIosNativeGameActiviy";
import {getStoreData} from "../../../http/AsyncStorage";

export default class PersonSetting extends Component<Props> {
    static navigationOptions = ({navigation}) => {
        return {
            title: '个人信息',
            headerTitleStyle: {flex: 1, textAlign: 'center'},//解决android 标题不居中问题
            headerLeft: (
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Image source={require('../../../static/img/titlebar_back_normal.png')}
                           style={{
                               resizeMode: 'contain',
                               width: 20,
                               height: 20,
                               margin: 12
                           }}/>
                </TouchableOpacity>
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
            this.setState({version:andriodVersionCode})
        });
        // 获取用户信息
        this.refreshUserInfo();
        // 监听用户信息变化
        this.listener = DeviceEventEmitter.addListener('bindSuccess',this.refreshUserInfo.bind(this));//必须绑定this 否则会找不到 this
    }
    componentWillUnmount() {
        this.listener.remove();//删除订阅
    }

    /**
     * 退出事件处理
     */
    logOut() {
        Alert.alert('温馨提示', '退出账户，是否继续？', [
            {text: '取消', onPress: () => console.log('Cancel loginOut')},
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
        if(this.state.mobileStatus === '未认证'){
            this.props.navigation.navigate('BindPhoneNumScreen')
        } else {
            return false;
        }
    };
    /**
     * 获取用户信息
     */
    refreshUserInfo(){
        getStoreData('userInfoState').then((userInfo) => {
            console.log(userInfo);
            let {userName, realname, mobile, weixin, qq, reg_date, login_time, mobileStatus, uid} = userInfo;
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

    render() {
        const {userName, realName, mobile, weixin, qq, reg_date, login_time, mobileStatus, uid} = this.state;
        return (
            <ScrollView style={{flex: 1, backgroundColor: '#efeff4'}}>
                <Text style={styles.title}>
                    个人基本信息
                </Text>
                <View style={styles.item}>
                    <Text>头像</Text>
                    <Image source={require('../../../static/img/ic_launcher.png')}
                           style={{
                               resizeMode: 'contain',
                               width: 40,
                               height: 40,
                               borderRadius: 20
                           }}/>
                </View>
                <View style={styles.item}>
                    <Text>用户名</Text>
                    <Text>{userName}</Text>
                </View>
                <View style={styles.item}>
                    <Text>真实姓名</Text>
                    <Text>{realName}</Text>
                </View>
                <View style={[styles.item, {paddingVertical: 0}]}>
                    <Text>手机号</Text>
                    <TouchableOpacity onPress={() => {this.setPhone()}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 12}}>
                            <Text
                                style={{color: theme_color}}>{`${mobile.slice(0, 3)}****${mobile.slice(7, 11)}(${mobileStatus})`}</Text>
                            { (mobileStatus === '未认证') ?
                                <Image source={require('../../../static/img/arrow_more.png')}
                               style={{
                                   resizeMode: 'contain',
                                   width: 14,
                                   height: 14,
                                   marginLeft: 10
                               }}/> : <Text/>}

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.item, {paddingVertical: 0}]}>
                    <Text>微信号</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ContactSetting', {
                        title: '微信号',
                        type: 2,
                        uid: uid
                    })}>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 12}}>
                            <Text style={{color: theme_color}}>{weixin}</Text>
                            <Image source={require('../../../static/img/arrow_more.png')}
                                   style={{
                                       resizeMode: 'contain',
                                       width: 14,
                                       height: 14,
                                       marginLeft: 10
                                   }}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={[styles.item, {paddingVertical: 0}]}>
                    <Text>QQ号</Text>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ContactSetting', {
                        title: 'QQ号',
                        type: 3,
                        uid: uid
                    })}>
                        <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 12}}>
                            <Text style={{color: theme_color}}>{qq}</Text>
                            <Image source={require('../../../static/img/arrow_more.png')}
                                   style={{
                                       resizeMode: 'contain',
                                       width: 14,
                                       height: 14,
                                       marginLeft: 10
                                   }}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>
                    其他信息
                </Text>
                <View style={styles.item}>
                    <Text>注册时间</Text>
                    <Text>{reg_date}</Text>
                </View>
                <View style={styles.item}>
                    <Text>最后登录时间</Text>
                    <Text>{login_time}</Text>
                </View>
                <View style={styles.item}>
                    <Text>版本信息</Text>
                    <Text>{RN_VERSION+"-"+this.state.version}</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={() => this.logOut()}
                        style={styles.login_out_button}>
                        <Text style={{color: 'white'}}>退出登录</Text>
                    </TouchableOpacity>
                </View>
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
    item: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#c8c7cc'
    },
    login_out_button: {
        width: 320,
        height: 40,
        backgroundColor: '#cda469',
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    }
});
