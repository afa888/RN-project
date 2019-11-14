import React, { Component } from 'react';
import { Platform, TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image, SafeAreaView } from 'react-native';
import Dimensions from 'Dimensions'
import TXInput from "../../../tools/TXInput"
import http from '../../../http/httpFetch'
import { mergeStoreData } from "../../../http/AsyncStorage";
import { NavigationActions } from 'react-navigation';
import { TXAlert } from "../../../tools/TXAlert";
import { Reg_password_validate } from "../../../utils/Validate";
import TXToastManager from "../../../tools/TXToastManager";
import { MainTheme } from "../../../utils/AllColor";
import DeviceValue from "../../../utils/DeviceValue";


export default class ChangeLoginPwdScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {

        return {
            title: '修改登录密码',
            headerTitleStyle: { flex: 1, textAlign: 'center' },//解决android 标题不居中问题
            headerLeft: (
                <TouchableOpacity onPress={() => {
                    navigation.dispatch(NavigationActions.back());
                }}>
                    <Image source={require('../../../static/img/titlebar_back_normal.png')}
                        style={{
                            resizeMode: 'contain',
                            width: 20,
                            height: 20,
                            margin: 12
                        }} />
                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = { password: '', npassword: '', renpassword: '' };
    }

    _onChange = (label, value) => {
        this.setState({ [label]: value });
    };

    _onSettingPWD() {
        if (!Reg_password_validate(this.state.password)) {
            TXToastManager.show('请输入原密码');
        }
        else if (this.state.npassword.length < 6 || this.state.npassword.length > 12) {
            TXToastManager.show('请输入6~12位新密码');
        } else if (!Reg_password_validate(this.state.npassword)) {
            TXToastManager.show('密码须位英文或数字');
        } else if (this.state.password === this.state.npassword) {
            TXToastManager.show('新旧密码不能相同');
        }
        else if (this.state.renpassword.length < 6 || this.state.renpassword.length > 12) {
            TXToastManager.show('请输入6~12位确认密码');
        } else if (!Reg_password_validate(this.state.renpassword)) {
            TXToastManager.show('密码须位英文或数字');
        } else if (this.state.npassword != this.state.renpassword) {
            TXToastManager.show('新密码跟确认密码不相符!');
        } else {
            let params = { password: this.state.password, npassword: this.state.npassword, renpassword: this.state.renpassword };
            http.post('User/changePassword', params, true, '重新设定中...').then((res) => {
                if (res.status === 10000) {
                    TXAlert('修改成功');
                    mergeStoreData('userInfoState',
                        {
                            password: this.state.npassword,
                        });
                    this.props.navigation.dispatch(NavigationActions.back());
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

    callOnlineSupport = () => {
        console.log("调用在线客服");
        this.props.navigation.navigate('CustomerService');
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.topSpacer}></View>
                <TXInput label="原密码"
                    secureTextEntry={true}
                    maxLength={12}
                    placeholder="请输入原密码"
                    textAlign='right'
                    onChange={(value) => this._onChange('password', value)}
                    value={this.state.password || ''} />
                <TXInput label="新密码"
                    secureTextEntry={true}
                    maxLength={12}
                    placeholder="密码须为6~12位英文或数字"
                    textAlign='right'
                    onChange={(value) => this._onChange('npassword', value)}
                    value={this.state.npassword || ''} />
                <TXInput label="确认密码"
                    secureTextEntry={true}
                    maxLength={12}
                    placeholder="请再次填写新密码"
                    textAlign='right'
                    onChange={(value) => this._onChange('renpassword', value)}
                    value={this.state.renpassword || ''} />

                <View style={styles.descContainer}>
                    <Text style={styles.descText}>密码须为</Text>
                    <Text style={styles.descHighlight}>6~12位英文或数字</Text>
                    <Text style={styles.descText}>且符合a~z字元或0~9</Text>
                </View>

                <View style={styles.submitContainer}>
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => this._onSettingPWD()}
                        activeOpacity={0.2}
                        focusedOpacity={0.5}>
                        <Text style={styles.submitTitle}>立即设置</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.supportContainer}>
                    <View style={styles.supportContent}>
                        <Text style={styles.supportText}>如果忘记密码，请联系</Text>
                        <TouchableOpacity onPress={this.callOnlineSupport}>
                            <Text style={styles.supportHighlight}>在线客服</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: MainTheme.BackgroundColor,
    },

    topSpacer: {
        height: 10,
        width: DeviceValue.windowWidth,
        backgroundColor: MainTheme.BackgroundColor,
    },

    Iuput_stype: {
        height: 100,
        backgroundColor: MainTheme.BackgroundColor,
    },

    descContainer: {
        paddingTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: DeviceValue.windowWidth,
    },

    descText: {
        fontSize: 10,
    },

    descHighlight: {
        fontSize: 10,
        color: MainTheme.SpecialColor,
    },

    submitContainer: {
        paddingTop: 20,
        alignItems: 'center',
    },

    submitButton: {
        borderRadius: 4,
        borderWidth: 1,
        borderColor: MainTheme.SpecialColor,
        borderStyle: 'solid',
        justifyContent: 'center',
        alignItems: 'center',
        width: DeviceValue.windowWidth - 45,
        height: 40,
        backgroundColor: MainTheme.SpecialColor,
    },

    submitTitle: {
        color: MainTheme.SubmitTextColor,
        fontSize: 17,
    },

    supportContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },

    supportContent: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    supportText: {
        fontSize: 14,
        color: MainTheme.GrayColor,
    },

    supportHighlight: {
        fontSize: 14,
        color: MainTheme.SpecialColor,
    },
});
