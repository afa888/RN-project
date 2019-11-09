import React, { Component } from 'react';
import { Alert, DeviceEventEmitter, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CheckBox from 'react-native-check-box'
import { CAGENT, WEBNUM } from "../../utils/Config";
import { Reg_phone_validate, send_code_validate } from "../../utils/Validate";
import CountDown from "./countDown";
import http from "../../http/httpFetch";
import { setLoginStore } from "./changeLoginStatus";
import { TXAlert } from "../../tools/TXAlert";
import TXToastManager from "../../tools/TXToastManager";
import DeviceValue from "../../utils/DeviceValue";
import MainTheme from "../../utils/AllColor";

export default class PhoneRegister extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            _referralCode: '', //推荐码
            _mobileNo: '', //手机号
            _imgcode: '', //验证码
            isChecked: true, //开户协议
            codeSending: false, //验证码发送
            isPhoneFocused: false,  // 手机号码是否获得焦点
            isCodeFocused: false,   // 短信验证码是否获得焦点
        }
    }
    changeValue(type, val) {
        this.setState({
            [type]: val
        })
    }
    sendImgCode() {
        let params = {
            cagent: CAGENT, //代理号
            mobileNo: this.state._mobileNo, //手机号
        };
        if (!send_code_validate(params.mobileNo)) return;
        http.post('Mobile/sendMessageCodeMobile', params, true).then(res => {
            if (res.status === 10000) {
                this.changeSendingStatus();
            }
            TXAlert(res.msg);
        });
    }
    changeSendingStatus() {
        this.setState((prevState) => ({ codeSending: !prevState.codeSending }));
    }
    openDialog() {
        DeviceEventEmitter.emit('openDialog', true);
    }
    register() {
        const { _referralCode, _mobileNo, _imgcode, isChecked } = this.state;
        let params = {
            referralCode: _referralCode, //推荐码
            mobileNo: _mobileNo, //手机号
            imgcode: _imgcode, //验证码
            proxyname: '', // 代理
            isMobile: 1, //类型
            terminal: DeviceValue.terminal, //类型
            cagent: CAGENT, //代理号
            src: WEBNUM //网站识别号
        };
        if (!isChecked) {
            Alert.alert('是否同意用户协议', '', [], { cancelable: true });
            this.setState({ isChecked: true });
            return;
        }
        if (!Reg_phone_validate(params)) return;
        http.post('register/registerUser', params, true).then(res => {
            if (res.status === 10000) {
                let oData = res.data;
                // 存储登录信息
                oData.mobileNo = _mobileNo;
                setLoginStore(oData);
                this.props.router.navigate('Home');
            }
            TXToastManager.show(res.msg);
        })
    }

    gotoLogin() {
        this.props.router.navigate('LoginService');
    }

    render() {
        const { _referralCode, _mobileNo, _imgcode, isChecked, codeSending } = this.state;
        return (
            <View>
                <TextInput
                    style={[styles.count_text, this.state.isPhoneFocused && styles.count_text_hilighted]}
                    underlineColorAndroid='transparent'
                    placeholder="手机号码"
                    maxLength={11}
                    keyboardType='numeric'
                    value={_mobileNo}
                    autoFocus={true}
                    onBlur={() => this.setState({ isPhoneFocused: false })}
                    onFocus={() => this.setState({ isPhoneFocused: true })}
                    onChangeText={(val) => this.changeValue('_mobileNo', val.trim())}
                />
                <View style={styles.regItem}>
                    <TextInput
                        style={[styles.count_text, this.state.isCodeFocused && styles.count_text_hilighted]}
                        underlineColorAndroid='transparent'
                        placeholder="短信验证码"
                        maxLength={4}
                        keyboardType='numeric'
                        value={_imgcode}
                        onBlur={() => this.setState({ isCodeFocused: false })}
                        onFocus={() => this.setState({ isCodeFocused: true })}
                        onChangeText={(val) => this.changeValue('_imgcode', val.trim())}
                    />
                    <TouchableOpacity style={{
                        position: 'absolute',
                        right: 0,
                        top: 18,
                        width: 80,
                        height: 25,
                        backgroundColor: codeSending ? MainTheme.GrayColor : MainTheme.SpecialColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 3
                    }}>
                        {codeSending ?
                            <CountDown _openSendCode={() => this.changeSendingStatus()} /> :
                            <Text
                                style={{ color: MainTheme.SubmitTextColor, fontSize: 9 }}
                                onPress={() => this.sendImgCode()}
                            >发送验证码</Text>
                        }
                    </TouchableOpacity>
                </View>
                <View style={{
                    marginTop: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <CheckBox
                        checkBoxColor={MainTheme.SpecialColor}
                        uncheckedCheckBoxColor={MainTheme.SpecialColor}
                        onClick={() => { this.setState({ isChecked: !isChecked }) }}
                        isChecked={isChecked}
                    />
                    <Text style={{ marginLeft: 5 }}>我已届满合法博彩年龄且同意
                        <Text onPress={() => this.openDialog()} style={{ color: MainTheme.SpecialColor }}> 开户协议 </Text>
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.register()}
                        style={styles.reg_button}
                    >
                        <Text style={{ color: MainTheme.SubmitTextColor }}>立即注册</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.gotoLogin()}
                        style={styles.login_button}
                    >
                        <Text style={{ color: MainTheme.GrayColor }}>已有账号</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    regItem: {
        height: 50,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },

    count_img: {
        resizeMode: 'contain',
        width: 20,
        height: 22,
    },

    count_text: {
        height: 40,
        width: 320,
        marginLeft: 5,
        borderBottomWidth: 0.8,
        borderBottomColor: MainTheme.GrayColor,
    },

    count_text_hilighted: {
        borderBottomColor: MainTheme.SpecialColor,
    },

    reg_button: {
        height: 46,
        width: 320,
        backgroundColor: MainTheme.SpecialColor,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },

    login_button: {
        height: 46,
        width: 320,
        backgroundColor: '#EEEEEE',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        borderWidth: 0.1,
        borderColor: '#999999',
    },
});
