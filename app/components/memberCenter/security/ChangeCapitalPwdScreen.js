import React, { Component } from 'react';
import { Platform, DeviceEventEmitter, TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image, SafeAreaView } from 'react-native';
import Dimensions from 'Dimensions'
import TXInput from "../../../tools/TXInput"
import http from '../../../http/httpFetch'
import { mergeStoreData } from "../../../http/AsyncStorage";
import { NavigationActions } from 'react-navigation';
import { TXAlert } from "../../../tools/TXAlert"
import { Reg_password_validate } from "../../../utils/Validate"
import TXToastManager from "../../../tools/TXToastManager"
import { MainTheme } from "../../../utils/AllColor";
import DeviceValue from "../../../utils/DeviceValue";

export default class ChangeCapitalPwdScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('设定提款密码')
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
        this.state = { password: '', npassword: '', renpassword: '' };
    }

    _onChange = (label, value) => {
        this.setState({ [label]: value });
    };

    _onSettingPWD() {
        if (this.state.password.length != 4) {
            TXToastManager.show('请输入4位原密码');
        }
        else if (this.state.npassword.length != 4) {
            TXToastManager.show('请输入4位新密码');
        } else if (this.state.password === this.state.npassword) {
            TXToastManager.show('新旧密码不能相同');
        }
        else if (this.state.renpassword.length != 4) {
            TXToastManager.show('请输入4位确认密码');
        } else if (this.state.npassword != this.state.renpassword) {
            TXToastManager.show('新密码跟确认密码不相符!');
        } else {
            let params = { password: this.state.password, npassword: this.state.npassword, renpassword: this.state.renpassword };
            http.post('User/changeQkpwd', params, true, '设定中...').then((res) => {
                if (res.status === 10000) {
                    TXToastManager.show('修改成功！');
                    this.props.navigation.dispatch(NavigationActions.back());
                } else {
                    if (!res) {
                        TXAlert('修改失败！');
                    } else {
                        TXAlert(res.msg);
                    }
                }
            }).catch(err => {
                console.error(err)
            });
        }
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ paddingTop: 10, height: 20, width: DeviceValue.windowWidth }}></View>
                <TXInput label="原密码" forbiddenDot={true} keyboardType='numeric' secureTextEntry={true} maxLength={4} placeholder="请输入原密码" textAlign='right' onChange={(value) => this._onChange('password', value)} value={this.state.password || ''} />
                <TXInput label="新密码" forbiddenDot={true} keyboardType='numeric' secureTextEntry={true} maxLength={4} placeholder="密码须为4位数字的组合" textAlign='right' onChange={(value) => this._onChange('npassword', value)} value={this.state.npassword || ''} />
                <TXInput label="确认密码" forbiddenDot={true} keyboardType='numeric' secureTextEntry={true} maxLength={4} placeholder="请再次填写新密码" textAlign='right' onChange={(value) => this._onChange('renpassword', value)} value={this.state.renpassword || ''} />
                <View style={{ paddingTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, width: DeviceValue.windowWidth }}>
                    <Text style={{ fontSize: 10 }}>提款密码须为</Text>
                    <Text style={{ fontSize: 10, color: MainTheme.SpecialColor }}>4位数字</Text>
                    <Text style={{ fontSize: 10 }}>且符合0~9字元</Text>
                </View>
                <View style={{ paddingTop: 20, alignItems: 'center' }}>
                    <TouchableOpacity style={styles.submitButton} onPress={() => this._onSettingPWD()} activeOpacity={0.2} focusedOpacity={0.5}>
                        <Text style={{ color: MainTheme.SubmitTextColor, fontSize: 17 }}>立即设置</Text>
                    </TouchableOpacity>
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

    Iuput_stype: {
        height: 100,
        backgroundColor: '#ffffff'
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
});
