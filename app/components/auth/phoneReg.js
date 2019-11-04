import React, {Component} from 'react';
import {Alert, DeviceEventEmitter, Image, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import CheckBox from 'react-native-check-box'
import {CAGENT, WEBNUM} from "../../utils/Config";
import {Reg_phone_validate, send_code_validate} from "../../utils/Validate";
import CountDown from "./countDown";
import http from "../../http/httpFetch";
import {setLoginStore} from "./changeLoginStatus";
import {TXAlert} from "../../tools/TXAlert";
import TXToastManager from "../../tools/TXToastManager";
import DeviceValue from "../../utils/DeviceValue";
export default class PhoneRegister extends Component<Props> {
    constructor(props){
        super(props);
        this.state = {
            _referralCode:'', //推荐码
            _mobileNo:'', //手机号
            _imgcode:'', //验证码
            isChecked: true, //开户协议
            codeSending: false //验证码发送
        }
    }
    changeValue(type,val){
        this.setState({
            [type]: val
        })
    }
    sendImgCode(){
        let params = {
            cagent: CAGENT, //代理号
            mobileNo: this.state._mobileNo, //手机号
        };
        if(!send_code_validate(params.mobileNo)) return;
        http.post('Mobile/sendMessageCodeMobile',params,true).then( res => {
            if(res.status === 10000){
                this.changeSendingStatus();
            }
            TXAlert(res.msg);
        });
    }
    changeSendingStatus(){
        this.setState((prevState) =>({ codeSending: !prevState.codeSending }));
    }
    openDialog() {
        DeviceEventEmitter.emit('openDialog', true);
    }
    register(){
        const {_referralCode,_mobileNo,_imgcode,isChecked} = this.state;
        let params = {
            referralCode: _referralCode, //推荐码
            mobileNo: _mobileNo, //手机号
            imgcode: _imgcode, //验证码
            proxyname:'', // 代理
            isMobile: 1, //类型
            terminal: DeviceValue.terminal, //类型
            cagent: CAGENT, //代理号
            src: WEBNUM //网站识别号
        };
        if(!isChecked){
            Alert.alert('是否同意用户协议','',[],{ cancelable: true });
            this.setState({ isChecked: true });
            return;
        }
        if(!Reg_phone_validate(params)) return;
        http.post('register/registerUser',params, true).then( res => {
            if(res.status === 10000){
                let oData = res.data;
                // 存储登录信息
                oData.mobileNo = _mobileNo;
                setLoginStore(oData);
                this.props.router.navigate('Home');
            }
            TXToastManager.show(res.msg);
        })
    }
    render() {
        const { _referralCode,_mobileNo,_imgcode,isChecked,codeSending } = this.state;
        return(
            <View>
                <View style={styles.regItem}>
                    <Image
                        source={require('../../static/img/reg_tjm.png')}
                        style={styles.count_img}/>
                    <TextInput
                        style={styles.count_text}
                        underlineColorAndroid='transparent'
                        placeholder="推荐码（非必填）"
                        maxLength={15}
                        value={ _referralCode }
                        onChangeText={(val) => this.changeValue('_referralCode',val.trim())}
                    />
                </View>
                <View style={styles.regItem}>
                    <Image
                        source={require('../../static/img/reg_phone.png')}
                        style={styles.count_img}/>
                    <TextInput
                        style={styles.count_text}
                        underlineColorAndroid='transparent'
                        placeholder="请输入手机号"
                        maxLength={11}
                        keyboardType='numeric'
                        value={ _mobileNo }
                        onChangeText={(val) => this.changeValue('_mobileNo',val.trim())}
                    />
                </View>
                <View style={styles.regItem}>
                    <Image
                        source={require('../../static/img/reg_verifycode.png')}
                        style={styles.count_img}/>
                    <TextInput
                        style={styles.count_text}
                        underlineColorAndroid='transparent'
                        placeholder="请输入验证码"
                        maxLength={4}
                        keyboardType='numeric'
                        value={ _imgcode }
                        onChangeText={(val) => this.changeValue('_imgcode',val.trim())}
                    />
                    <TouchableOpacity style={{
                        position: 'absolute',
                        right: 0,
                        top: 6,
                        width: 110,
                        height: 36,
                        backgroundColor: codeSending ? '#b1b1b1' : '#cda469',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 3
                    }}>
                        { codeSending ?
                            <CountDown _openSendCode={() => this.changeSendingStatus()}/> :
                            <Text
                                style={{ color: '#fff' }}
                                onPress={() => this.sendImgCode()}
                            >发送验证码</Text>
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.regItem}>
                    <CheckBox
                        style={{flex: 0.5}}
                        checkBoxColor={'#cda469'}
                        uncheckedCheckBoxColor={'#cda469'}
                        onClick={()=>{ this.setState({ isChecked:!isChecked }) }}
                        isChecked={isChecked}
                    />
                    <Text>我已届满合法博彩年龄,且同意各项
                        <Text onPress={() => this.openDialog()} style={{color: '#cda469'}}> "开户协议" </Text>
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.register()}
                        style={styles.reg_button}
                    >
                        <Text style={{color: 'white'}}>立即注册</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    regItem:{
        height: 50,
        paddingLeft:20,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:0.8,
        borderBottomColor:'#d3d3d3'
    },
    count_img: {
        resizeMode: 'contain',
        width: 20,
        height: 22,
    },
    count_text: {
        height: 40,
        width: 300,
        marginLeft: 12
    },
    reg_button: {
        height: 46,
        width: 320,
        backgroundColor: '#cda469',
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    }
});
