import React, { Component } from 'react';
import { Platform, DeviceEventEmitter, TextInput, TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image, StatusBar } from 'react-native';
import Dimensions from 'Dimensions'
import TXInput from "../../../tools/TXInput"
import TXInputButton from "../../../tools/TXInputButton"
import http from '../../../http/httpFetch'
import { BASE_URL, CAGENT } from "../../../utils/Config";
import { getStoreData, mergeStoreData } from "../../../http/AsyncStorage";
import { NavigationActions } from 'react-navigation';
import { TXAlert } from "../../../tools/TXAlert";
import TXToastManager from "../../../tools/TXToastManager";
import "../../../utils/AllColor";
import DeviceValue from "../../../utils/DeviceValue";
import MainTheme from '../../../utils/AllColor';

let timeCount = 60
export default class BindPhoneNumScreen extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('绑定手机')
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
        this.state = { phoneNum: '', code: '', password: '', countDown: '发送验证码' };
    }

    componentDidMount() {
        getStoreData('userInfoState').then((userInfo) => {
            if (userInfo && userInfo.mobile) {
                this.setState({ phoneNum: userInfo.mobile });
            }
        });
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    };

    _onChange = (label, value) => {
        this.setState({ [label]: value });
    };

    _onGetCode = () => {
        if (this.state.phoneNum.length != 11) {
            TXToastManager.show('请输入正确手机号');
            return;
        }
        let params = { mobileNo: this.state.phoneNum };
        http.post('Mobile/sendMessageCode', params, true).then((res) => {
            if (res.status === 10000) {
                TXToastManager.show('验证码发送成功！');
                timeCount = 60;
                this.interval = setInterval(
                    () => {
                        timeCount--;
                        if (timeCount > 0) {
                            let leftTimeString = '重新获取' + String(timeCount) + '秒';
                            this.setState({ countDown: leftTimeString });
                        } else {
                            //返回上一层
                            this.setState({ countDown: '重新获取' });
                        }

                    },
                    1000
                );
            } else {
                if (!res) {
                    TXAlert('网络异常，请稍后重试');
                } else {
                    TXAlert(res.msg);
                }
            }
        }).catch(err => {
            console.error(err)
        });


    };

    _onBindPhone() {
        if (this.state.phoneNum.length == 0) {
            TXToastManager.show('请输入手机号');
        } else if (this.state.phoneNum.length != 11) {
            TXToastManager.show('手机号码必须为11位数字');
        }
        else if (this.state.code.length == 0) {
            TXToastManager.show('请输入验证码');
        } else if (this.state.code.length != 4) {
            TXToastManager.show('验证码须为4位数字');
        } else if (this.state.password.length == 0) {
            TXToastManager.show('请输入登录密码');
        } else {
            console.log('验证完成，调用接口');
            let params = { cagent: CAGENT, mobileNo: this.state.phoneNum, msgCode: this.state.code, password: this.state.password };
            http.post('Mobile/changeMobile.do', params, true, '设定中...').then((res) => {
                if (res.status === 10000) {
                    TXAlert('手机号码绑定成功！');
                    mergeStoreData('userInfoState',
                        {
                            mobileStatus: '1',
                            mobile: this.state.phoneNum
                        }).then((result) => {
                            DeviceEventEmitter.emit('bindSuccess', '手机绑定完成');
                            this.props.navigation.dispatch(NavigationActions.back());
                        });

                } else {
                    if (!res) {
                        TXAlert('网络异常，请稍后重试');
                    } else {
                        TXAlert(res.msg);
                    }
                }
            }).catch(err => {
                console.error(err)
            });
        }
    };

    _onShowCustomer = () => {
        this.props.navigation.navigate('CustomerService')
    }

    render() {
        return (
            <View style={{ height: Dimensions.get('window').height, alignItems: 'center', backgroundColor: MainTheme.BackgroundColor }}>
                <View style={{ paddingTop: 10, height: 20, width: Dimensions.get('window').width }}>

                </View>
                <TXInput textInputStyle={{ color: MainTheme.DarkGrayColor }} label="手机号" maxLength={11} keyboardType='numeric' placeholder="请输入手机号码" textAlign='right' onChange={(value) => this._onChange('phoneNum', value)} value={this.state.phoneNum || ''} />
                <TXInputButton label="验证码" maxLength={6} keyboardType='numeric' placeholder="请输入验证码" buttonbgColor={MainTheme.SpecialColor} detailTextColor='white' textAlign='right' onClick={this._onGetCode} onChange={(value) => this._onChange('code', value)} value={this.state.code || ''} buttonTitle={this.state.countDown} />
                <TXInput label="登录密码" secureTextEntry={true} maxLength={12} placeholder="请输入登录密码" textAlign='right' onChange={(value) => this._onChange('password', value)} value={this.state.password || ''} />

                <View style={{ paddingTop: 20, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this._onBindPhone()} activeOpacity={0.2} focusedOpacity={0.5} style={styles.submitButton}>
                        <Text style={{ color: MainTheme.SubmitTextColor, fontSize: 17 }}>立即绑定</Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={{ paddingTop: 20, paddingLeft: 10, flexDirection: 'column', justifyContent: 'center', width: Dimensions.get('window').width }}>
                    <Text style={{ fontSize: 10 }}>1、更换手机号后，下次登录可以使用手机号登录。</Text>
                    <View style={{ marginTop: 10, flexDirection: 'row', height: 50, width: Dimensions.get('window').width }}>
                        <Text style={{ fontSize: 10, height: 15 }}>2、如您无法自主修改手机号，请联系 </Text>
                        <Text style={{ fontSize: 10, color: MainTheme.SpecialColor, height: 15 }} onPress={this._onShowCustomer}>“在线客服” </Text>
                    </View>
                </View> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    submitButton: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: MainTheme.SpecialColor,
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
        width: DeviceValue.windowWidth - 45,
        height: 40,
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: MainTheme.SpecialColor,
    },
});
