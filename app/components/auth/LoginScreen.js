import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Switch, Image, TouchableOpacity, TextInput } from 'react-native';
import http from "../../http/httpFetch";
import { BASE_URL, CAGENT } from "../../utils/Config";
import { Login_validate } from "../../utils/Validate"
import { setLoginStore } from "./changeLoginStatus";
import TXToastManager from "../../tools/TXToastManager";
import { RememberUserKey, UserNameKey, UserPwdKey } from "../../http/AsyncStorage";
import AsyncStorage from '@react-native-community/async-storage';
import MainTheme from "../../utils/AllColor";

export default class LoginScreen extends Component<Props> {
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };

    constructor(props) {
        super(props);
        this.state = {
            countName: '',
            password: '',
            passWordShow: false,
            rememberPwd: true,
            isPwdFocused: false,
            isNameFocused: false,
        };
    }

    componentWillMount() {
        this.loadAcountInfoIfNeed();
    }

    login = () => {
        const { countName, password } = this.state;
        let prams = {
            tname: countName,
            tpwd: password,
            cagent: CAGENT,
            savelogin: 1,
            isImgCode: 0,
            isMobile: 4
        };
        if (!Login_validate(countName, password)) return;
        http.post('login.do', prams, true).then(res => {
            if (res.status === 10000) {
                let oData = res.data;
                // 存储登录信息
                //添加密码保存 在安全中心需要
                oData['password'] = password;
                setLoginStore(oData);
                this.saveAccountInfo().then(() => {
                    this.props.navigation.navigate('Home');
                }).catch(() => {
                    console.error("Save Account info error.");
                    this.props.navigation.navigate('Home');
                });
            }
            TXToastManager.show(res.msg);
        }).catch((reason) => {
            console.error("Login Request Error.");
        });
    };

    saveAccountInfo = () => {
        let { countName, password, rememberPwd } = this.state;

        if (!rememberPwd) {
            countName = '';
            password = '';
        }

        return AsyncStorage.multiSet([
            [RememberUserKey, String(rememberPwd)],
            [UserNameKey, countName],
            [UserPwdKey, password],
        ]);
    }

    loadAcountInfoIfNeed() {
        AsyncStorage.getItem(RememberUserKey).then((value) => {
            let shouldRemember = true;
            if (value != undefined) {
                shouldRemember = value == 'true';
            }

            if (shouldRemember) {
                AsyncStorage.multiGet([UserNameKey, UserPwdKey])
                    .then((results) => {
                        let account = '';
                        let password = '';

                        if (results.length == 2) {
                            account = results[0][1];
                            password = results[1][1];
                        }

                        this.setState({
                            rememberPwd: shouldRemember,
                            countName: account,
                            password: password,
                        });
                    }).catch(() => {
                        console.error("Load account info error.");
                    });
            }
            else {
                this.setState({
                    rememberPwd: shouldRemember,
                });
            }
        }).catch((reason) => {
            console.error("Read remember_account_option failed:" + reason);
        });
    }

    render() {
        const { passWordShow } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, margin: 12, backgroundColor: 'white' }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Home')}>
                        <Image source={require('../../static/img/login_back.png')}
                            style={styles.header_img} />
                    </TouchableOpacity>

                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Image source={require('../../static/img/login_banner_01.png')}
                            style={styles.logo_img} />
                        <Text style={styles.logo_text}>登录</Text>

                        <View style={{
                            width: 300,
                            height: 40,
                            marginTop: 30,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}>
                            <TextInput
                                style={styles.count_text}
                                underlineColorAndroid='transparent'
                                placeholder="用户名"
                                maxLength={11}
                                value={this.state.countName}
                                onBlur={() => this.setState({ isNameFocused: false })}
                                onFocus={() => this.setState({ isNameFocused: true })}
                                onChangeText={(countName) => this.setState({ countName: countName.trim() })}
                            />
                        </View>
                        <View style={this.state.isNameFocused ? styles.divide_view_highlighted : styles.divide_view} />

                        <View style={{
                            width: 300,
                            height: 40,
                            marginTop: 10,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            position: 'relative'
                        }}>
                            <TextInput
                                style={styles.count_text}
                                secureTextEntry={passWordShow ? false : true}
                                underlineColorAndroid='transparent'
                                placeholder="密码"
                                maxLength={12}
                                value={this.state.password}
                                onBlur={() => this.setState({ isPwdFocused: false })}
                                onFocus={() => this.setState({ isPwdFocused: true })}
                                onChangeText={(password) => this.setState({ password: password.trim() })}
                            />
                            <Switch
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: 5,
                                }}
                                thumbColor={'white'}
                                ios_backgroundColor={MainTheme.GrayColor}
                                trackColor={{ false: MainTheme.GrayColor, true: MainTheme.SpecialColor }}
                                value={this.state.passWordShow}
                                onValueChange={(value) => this.setState({ passWordShow: value })}
                            />
                        </View>
                        <View style={this.state.isPwdFocused ? styles.divide_view_highlighted : styles.divide_view} />
                        <View style={styles.remember_pwd_container}>
                            <Text style={styles.remember_pwd_title}>记住密码</Text>
                            <Switch style={{}}
                                value={this.state.rememberPwd}
                                ios_backgroundColor={MainTheme.GrayColor}
                                trackColor={{ false: MainTheme.GrayColor, true: MainTheme.SpecialColor }}
                                onValueChange={(value) => this.setState({ rememberPwd: value })}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => { this.login() }}
                            style={styles.login_button}>
                            <Text style={styles.login_button_title}>登录</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.register_button}
                            onPress={() => this.props.navigation.navigate('Register')}>
                            <Text style={styles.register_button_title}>
                                注册
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
        width: 200,
        height: 60,
        resizeMode: 'contain',
        marginTop: 20,
    },
    
    pass_hide_img: {
        resizeMode: 'cover',
        width: 26,
        height: 22
    },

    logo_text: {
        fontWeight: 'bold',
        fontSize: 25,
        color: "black",
        marginTop: 40,
        textAlign: "left",
        width: 300, // 和下面的登录框的宽度保持一致
    },

    count_text: { height: 40, width: 300, marginLeft: 0 },

    login_button_title: {
        color: 'white'
    },

    register_button: {
        width: 320,
        height: 40,
        marginTop: 20,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3
    },

    register_button_title: {
        color: '#999999'
    },

    remember_pwd_container: {
        width: 300,
        height: 40,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative'
    },

    remember_pwd_title: {
        color: '#999999',
        fontSize: 15,
        flex: 1,
    },

    divide_view: {
        width: 320,
        height: 0.8,
        backgroundColor: MainTheme.GrayColor,
    },

    divide_view_highlighted: {
        width: 320,
        height: 0.8,
        backgroundColor: MainTheme.SpecialColor,
    },

    login_button: {
        width: 320,
        height: 40,
        backgroundColor: MainTheme.SpecialColor,
        marginTop: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
});