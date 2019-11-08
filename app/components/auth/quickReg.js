import React, { Component } from 'react';
import { Alert, DeviceEventEmitter, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import CheckBox from 'react-native-check-box'
import { BASE_URL, CAGENT, WEBNUM } from "../../utils/Config";
import { Reg_quick_validate } from "../../utils/Validate";
import http from "../../http/httpFetch";
import { setLoginStore } from "./changeLoginStatus";
import TXToastManager from "../../tools/TXToastManager";
import DeviceValue from "../../utils/DeviceValue";
import MainTheme from "../../utils/AllColor";

export default class QuickRegister extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            _referralCode: '', //推荐码
            _userName: '', //用户名
            _passWord: '', //密码
            _mobileNo: '', //手机号
            _imgcode: '', //验证码
            isChecked: true, //开户协议
            imgCodeUrl: '', // 图形验证码
            isNameFocused: false,   // 用户名是否获得焦点
            isPwdFocused: false,    // 密码是否获得焦点
            isPhoneFocused: false,  // 手机号是否获得焦点
            isVCodeFocused: false,  // 验证码是否获得焦点
        }
    }
    componentWillMount() {
        this.ImgCodeUrl();
    }
    changeValue(type, val) {
        this.setState({
            [type]: val
        })
    }
    ImgCodeUrl() {
        let src = BASE_URL + 'validateCode?timesp' + (new Date()).valueOf();
        this.setState({ imgCodeUrl: src })
    }
    openDialog() {
        DeviceEventEmitter.emit('openDialog', true);
    }
    register() {
        const { _referralCode, _userName, _passWord, _mobileNo, _imgcode, isChecked } = this.state;
        let params = {
            referralCode: _referralCode, //推荐码
            userName: _userName, //用户名
            passWord: _passWord, //密码
            repassWord: _passWord, //确认密码
            mobileNo: _mobileNo, //手机号
            imgcode: _imgcode, //验证码
            realName: '会员', //真实姓名
            proxyname: '', // 代理
            isMobile: 1, //类型
            terminal: DeviceValue.terminal, //类型
            cagent: CAGENT, //代理号
            src: WEBNUM, //网站识别号
        };
        if (!isChecked) {
            Alert.alert('是否同意用户协议', '', [], { cancelable: true });
            this.setState({ isChecked: true });
            return;
        }
        if (!Reg_quick_validate(params)) return;
        http.post('register/register', params, true).then(res => {
            if (res.status === 10000) {
                let oData = res.data;
                // 存储登录信息
                //添加密码保存 在安全中心需要
                oData['password'] = _passWord;
                setLoginStore(oData);
                this.props.router.navigate('Home');
            } else {
                this.ImgCodeUrl();
            }
            TXToastManager.show(res.msg);
        });
    }

    gotoLogin() {
        this.props.router.navigate('LoginService');
    }

    render() {
        const { _referralCode, _userName, _passWord, _mobileNo, _imgcode, isChecked } = this.state;
        return (
            <View>
                <TextInput
                    style={[styles.count_text, this.state.isNameFocused && styles.count_text_hilighted]}
                    underlineColorAndroid='transparent'
                    placeholder="用户名"
                    maxLength={11}
                    value={_userName}
                    autoFocus={true}
                    onBlur={() => this.setState({ isNameFocused: false })}
                    onFocus={() => this.setState({ isNameFocused: true })}
                    onChangeText={(val) => this.changeValue('_userName', val.trim())}
                />
                <TextInput
                    style={[styles.count_text, this.state.isPwdFocused && styles.count_text_hilighted]}
                    underlineColorAndroid='transparent'
                    secureTextEntry={true}
                    placeholder="密码"
                    maxLength={12}
                    value={_passWord}
                    onBlur={() => this.setState({ isPwdFocused: false })}
                    onFocus={() => this.setState({ isPwdFocused: true })}
                    onChangeText={(val) => this.changeValue('_passWord', val.trim())}
                />
                <TextInput
                    style={[styles.count_text, this.state.isPhoneFocused && styles.count_text_hilighted]}
                    underlineColorAndroid='transparent'
                    placeholder="手机号"
                    maxLength={11}
                    keyboardType='numeric'
                    value={_mobileNo}
                    onBlur={() => this.setState({ isPhoneFocused: false })}
                    onFocus={() => this.setState({ isPhoneFocused: true })}
                    onChangeText={(val) => this.changeValue('_mobileNo', val.trim())}
                />
                <View style={styles.regItem}>
                    <TextInput
                        style={[styles.count_text, this.state.isVCodeFocused && styles.count_text_hilighted]}
                        underlineColorAndroid='transparent'
                        placeholder="验证码"
                        maxLength={4}
                        keyboardType='numeric'
                        value={_imgcode}
                        onBlur={() => this.setState({ isVCodeFocused: false })}
                        onFocus={() => this.setState({ isVCodeFocused: true })}
                        onChangeText={(val) => this.changeValue('_imgcode', val.trim())}
                    />
                    <TouchableOpacity
                        onPress={() => this.ImgCodeUrl()}
                        style={{ position: 'absolute', right: 0, top: 4 }}>
                        <Image
                            source={{ uri: this.state.imgCodeUrl }}
                            style={{ width: 120, height: 40, }} />
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
                    <Text style={{marginLeft:5}}>我已届满合法博彩年龄且同意
                        <Text onPress={() => this.openDialog()} style={{ color: MainTheme.SpecialColor}}> 开户协议 </Text>
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.register()}
                        style={styles.reg_button}
                    >
                        <Text style={{ color: 'white' }}>立即注册</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.gotoLogin()}
                        style={styles.login_button}
                    >
                        <Text style={{ color: '#999999' }}>已有账号</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

function createStyle() {
    let style = StyleSheet.create({});

    style.regItem = {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    };

    style.count_img = {
        resizeMode: 'contain',
        width: 20,
        height: 22,
    };

    style.count_text = {
        height: 40,
        width: 320,
        marginLeft: 5,
        borderBottomWidth: 0.8,
        borderBottomColor: MainTheme.GrayColor,
    };

    style.count_text_hilighted = {
        borderBottomColor: MainTheme.SpecialColor,
    }

    style.reg_button = {
        height: 46,
        width: 320,
        backgroundColor: MainTheme.SpecialColor,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    };

    style.login_button = {
        height: 46,
        width: 320,
        backgroundColor: '#EEEEEE',
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        borderWidth: 0.1,
        borderColor: '#999999',
    };

    return style;
}

const styles = StyleSheet.create({
    regItem: {
        height: 50,
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
