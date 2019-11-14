import React, { Component } from 'react';
import {
    Platform, DeviceEventEmitter, TouchableOpacity,
    StyleSheet, Text, View, Button, Alert, Image,
    StatusBar, ImageBackground, SafeAreaView
} from 'react-native';
import Picker from 'react-native-picker';
import TXInput from "../../../tools/TXInput";
import http from '../../../http/httpFetch';
import { getStoreData } from "../../../http/AsyncStorage";
import httpBaseManager from '../../../http/httpBaseManager';
import { NavigationActions, navigation } from 'react-navigation';
import { TXAlert } from "../../../tools/TXAlert";
import { MainTheme } from "../../../utils/AllColor";
import DeviceValue from "../../../utils/DeviceValue";

export default class SecurityManagerScreen extends Component<Props> {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            password: '未设置',
            depositPassword: '未设置',
            phoneNum: '未认证',
            bankCard: '尚未绑定'
        };
    }

    refreshData(data) {
        getStoreData('userInfoState').then((userInfo) => {
            if (userInfo) {
                let isSetPwd = '未设置';
                if (userInfo.hasOwnProperty('password') && userInfo.password.length > 0) {
                    isSetPwd = '已设置';
                }
                let isSetDepPwd = '未设置';
                let mobileStatus = '未认证';
                let bankStatus = '尚未绑定';

                if (userInfo.settedqkpwd) {
                    isSetDepPwd = '已设置';
                }

                if (userInfo.mobileStatus == 1) {
                    mobileStatus = userInfo.mobile + '已认证'
                }

                if (userInfo.bankList && userInfo.bankList.length > 0) {
                    let bankInfo = userInfo.bankList[0];

                    let bankName = bankInfo['bankName'];
                    if (bankName.length == 0) {
                        bankName = '';
                    }
                    let bankNum = bankInfo['cardNum'];
                    if (bankNum.length == 0) {
                        bankNum = '';
                    }
                    if (bankNum.length > 4) {
                        bankStatus = bankName + '(' + bankNum.substring(bankNum.length - 4) + ')';

                    } else {
                        bankStatus = bankName;
                    }


                }

                this.setState({
                    password: isSetPwd, depositPassword: isSetDepPwd,
                    phoneNum: mobileStatus, bankCard: bankStatus
                });

            } else {

            }
        });
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener('bindSuccess', this.refreshData.bind(this));//必须绑定this 否则会找不到 this
        this.refreshData('')
    }

    componentWillUnmount() {
        this.listener.remove();//删除订阅
    };

    _onUpdateInfo = (type) => {
        if (type == 1) {
            //修改登录密码
            this.props.navigation.navigate('ChangeLoginPwdScreen');
        } else {
            getStoreData('userInfoState').then((userInfo) => {

                if (userInfo) {
                    if (type == 2) {
                        //修改提款 密码
                        if (!userInfo.settedqkpwd) {
                            //尚未设置提款密码
                            this.props.navigation.navigate('SettingCapitalPwdScreen');
                        } else {
                            //修改提款密码
                            this.props.navigation.navigate('ChangeCapitalPwdScreen');
                        }
                    } else if (type == 3) {
                        //验证手机号码
                        if (userInfo.mobileStatus == 0) {
                            //尚未验证的需要验证下，已经验证的则无需进入
                            this.props.navigation.navigate('BindPhoneNumScreen');
                        }
                    } else if (type == 4) {
                        //银行卡信息
                        if (!userInfo.settedqkpwd) {
                            //尚未设置提款密码
                            this.props.navigation.navigate('SettingCapitalPwdScreen');
                        } else if (userInfo.bankList && userInfo.bankList.length == 0) {
                            //尚未绑定银行卡
                            this.props.navigation.navigate('AddBankScreen');
                        } else {
                            //已经绑定
                            this.props.navigation.navigate('BankCardInfoScreen');
                        }
                    }


                } else {
                    //没有数据，直接请求基础数据
                    httpBaseManager.baseRequest();
                }
            });
        }
    }

    onLogout = () => {
        console.log("登出");
    }

    render() {
        const dePhoneStatus = this.state.phoneNum.indexOf('已认证') == -1 ? true : false;
        const dePhoneColor = dePhoneStatus ? MainTheme.SpecialColor : MainTheme.GrayColor;
        return (
            <SafeAreaView style={styles.container}>
                <ImageBackground source={require('../../../static/img/UserCenter/securityCenter_bg.png')}
                    resizeMode='cover' style={styles.backgroundImage} >
                    <Text style={styles.title}>安全设置</Text>
                </ImageBackground>

                <TouchableOpacity style={styles.backItem} onPress={() => this.props.navigation.goBack()} >
                    <Image source={require('../../../static/img/titlebar_back_special.png')}
                        style={styles.backItemImage} />
                </TouchableOpacity>

                <TXInput
                    label="登录密码"
                    detailTextColor={MainTheme.GrayColor}
                    isUpdate={false}
                    showDetail={true}
                    textAlign='right'
                    onClick={() => this._onUpdateInfo(1)}
                    value={this.state.password || ''}
                />
                <TXInput label="提款密码"
                    detailTextColor={this.state.depositPassword === '未设置' ? MainTheme.SpecialColor : MainTheme.GrayColor}
                    isUpdate={false}
                    showDetail={true}
                    textAlign='right'
                    onClick={() => this._onUpdateInfo(2)}
                    value={this.state.depositPassword || ''}
                />
                <TXInput
                    label="手机号码"
                    detailTextColor={dePhoneColor}
                    isUpdate={false}
                    showDetail={dePhoneStatus}
                    textAlign='right'
                    onClick={() => this._onUpdateInfo(3)}
                    value={this.state.phoneNum || ''}
                />
                <TXInput label="银行卡"
                    detailTextColor={
                        this.state.bankCard.indexOf('未') == -1 ? MainTheme.GrayColor : MainTheme.SpecialColor
                    }
                    isUpdate={false}
                    showDetail={true}
                    textAlign='right'
                    onClick={() => this._onUpdateInfo(4)}
                    value={this.state.bankCard || ''}
                />
                {/* 退出登录按钮 */}
                <TouchableOpacity style={styles.logoutContainer} onPress={this.onLogout}>
                    <Text style={styles.logoutText}>退出登录</Text>
                </TouchableOpacity>
            </SafeAreaView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: MainTheme.BackgroundColor,
    },

    title: {
        flex: 1,
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10
    },

    backgroundImage: {
        height: 230,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },

    backItem: {
        position: 'absolute',
        top: Platform.OS == 'android' ? 10 : 50,
        left: 10,
    },

    backItemImage: {
        resizeMode: 'contain',
        width: 20,
        height: 20,
    },

    logoutContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 1,
        bottom: -150,
        marginLeft: 22.5,
        height: 42,
        width: DeviceValue.windowWidth - 45,
        backgroundColor: MainTheme.SpecialColor,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: MainTheme.SpecialColor,
    },

    logoutText: {
        color: MainTheme.SubmitTextColor,
        fontSize: 16,
    },
});
