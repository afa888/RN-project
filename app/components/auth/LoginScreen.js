import React, {Component} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Alert, Image, TouchableOpacity, TextInput } from 'react-native';
import http from "../../http/httpFetch";
import {BASE_URL, CAGENT} from "../../utils/Config";
import { Login_validate } from "../../utils/Validate"
import {setLoginStore} from "./changeLoginStatus";
import TXToastManager from "../../tools/TXToastManager";

export default class LoginScreen extends Component<Props> {
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };
    constructor(props) {
        super(props);
        this.state = {
            countName: '',
            password: '',
            passWordShow: false
        };
    }
    login = () => {
        const {countName,password} = this.state;
        let prams = {
            tname: countName,
            tpwd: password,
            cagent: CAGENT,
            savelogin: 1,
            isImgCode: 0,
            isMobile:4
        };
        if(!Login_validate(countName,password)) return;
        http.post('login.do', prams, true).then(res => {
            if(res.status === 10000){
                let oData = res.data;
                // 存储登录信息
                //添加密码保存 在安全中心需要
                oData['password'] = password;
                setLoginStore(oData);
                this.props.navigation.navigate('Home');
            }
            TXToastManager.show(res.msg);
        });

    };

    render() {
        const { passWordShow } = this.state;
        return (
            <SafeAreaView style={{flex:1}}>
                <View style={{flex: 1, margin: 12, backgroundColor: 'white'}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                    <Image source={require('../../static/img/login_back.png')}
                           style={styles.header_img}/>
                </TouchableOpacity>

                <View style={{flex: 1, alignItems: 'center'}}>
                    <Image source={require('../../static/img/login_banner_01.png')}
                           style={styles.logo_img}/>
                    <Text style={styles.logo_text}>账号登录</Text>

                    <View style={{
                        width: 300,
                        height: 40,
                        marginTop: 40,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Image
                            source={require('../../static/img/login_username.png')}
                            style={styles.count_img}/>
                        <TextInput
                            style={styles.count_text}
                            underlineColorAndroid='transparent'
                            placeholder="请输入手机号/用户名"
                            maxLength={11}
                            value={ this.state.countName }
                            onChangeText={(countName) => this.setState({countName: countName.trim()})}
                        />
                    </View>
                    <View style={styles.divide_view}/>

                    <View style={{
                        width: 300,
                        height: 40,
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        position:'relative'
                    }}>
                        <Image
                            source={require('../../static/img/login_pwd.png')}
                            style={styles.count_img}/>
                        <TextInput
                            style={styles.count_text}
                            secureTextEntry={passWordShow ? false : true}
                            underlineColorAndroid='transparent'
                            placeholder="请输入密码"
                            maxLength={12}
                            value={ this.state.password }
                            onChangeText={(password) => this.setState({password: password.trim()})}
                        />
                        <TouchableOpacity style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: 5
                        }}
                                          onPress={() => this.setState({passWordShow: !passWordShow})}>
                            <Image source={passWordShow ? require('../../static/img/login_eye_01.png') : require('../../static/img/login_eye_02.png')}
                                   style={styles.pass_hide_img}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.divide_view}/>
                    <TouchableOpacity
                        onPress={() => { this.login() }}
                        style={styles.login_button}>
                        <Text style={{color: 'white'}}>登录</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.register_button}
                        onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={{color: 'gray'}}>
                            快速注册
                        </Text>
                    </TouchableOpacity>
                </View>


            </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    header_img: {
        resizeMode: 'cover',
        width: 15,
        height: 15,
        margin: 10
    },
    count_img: {
        resizeMode: 'contain',
        width: 20,
        height: 22,
    },

    logo_img: {
        width: 250,
        height: 90,
        resizeMode: 'contain',
        marginTop: 40,
    },
    pass_hide_img: {
        resizeMode: 'cover',
        width: 26,
        height: 22
    },
    logo_text: {fontWeight: 'bold', fontSize: 21, color: "black"},
    count_text: {height: 40, width: 300, marginLeft: 12},
    divide_view: {width: 320, height: 0.8, backgroundColor: '#d3d3d3'},
    login_button: {
        width: 320,
        height: 40,
        backgroundColor: '#cda469',
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },
    register_button: {
        width: 320,
        height: 40,
        marginTop: 40,
        alignItems: 'flex-end',

    },

});
