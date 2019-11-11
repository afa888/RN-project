import React, {Component} from 'react';
import {Platform,DeviceEventEmitter,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import TXInput from "../../../tools/TXInput"
import http from '../../../http/httpFetch'
import {mergeStoreData} from "../../../http/AsyncStorage";
import { NavigationActions } from 'react-navigation';
import {TXAlert} from "../../../tools/TXAlert"
import TXToastManager from "../../../tools/TXToastManager"
import MainTheme from "../../../utils/AllColor"
import {textThreeHightTitleColor} from "../../../utils/AllColor"

export default class SettingCapitalPwdScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {

        return {
          title: '设定提款密码',
          headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
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
                           }}/>
                </TouchableOpacity>
          ),
        };
      };

    constructor(props){
        super(props);
        this.state = {password:'',rePassword:''};
    }

    _onChange = (label, value) => {
        this.setState({ [label]: value });
    };

    _onSettingPWD (){
        if (this.state.password.length == 0) {
            TXToastManager.show('请输入新密码');
        }else if(this.state.password.length !=4){
            TXToastManager.show('请输入4位新密码');
        }
        else if (this.state.rePassword.length == 0) {
            TXToastManager.show('请输入确认密码');
        }else if(this.state.rePassword.length !=4){
            TXToastManager.show('请输入4位确认密码');
        }else if(this.state.password != this.state.rePassword){
            TXToastManager.show('新密码跟确认密码不相符!');
        }else {
            console.log('验证完成，调用接口');
            let params = {npassword:this.state.password,renpassword:this.state.rePassword};
            http.post('User/changeQkpwd', params,true).then((res) => {
                if (res.status === 10000) {
                    TXToastManager.show('提款密码设置成功');
                    mergeStoreData('userInfoState',
                        {
                        settedqkpwd: true,
                        bankList:[]
                    }).then((result) => {
                        DeviceEventEmitter.emit('bindSuccess','提款密码设置完成');
                        this.props.navigation.dispatch(NavigationActions.back());


                    });
                }else {
                    if (!res) {
                        TXAlert('网络异常，请稍后重试');
                    }else {
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
            <View style={{height:Dimensions.get('window').height,alignItems: 'center',backgroundColor:MainTheme.backgroundViewColor}}>
                <View style={{paddingTop:10,height:2,width:Dimensions.get('window').width}}>

                </View>
                <TXInput label="新密码" forbiddenDot={true} keyboardType = 'numeric'  secureTextEntry={true} maxLength={4} placeholder="密码必须为4位数字的组合" textAlign='right' onChange={(value) => this._onChange('password', value)} value={this.state.password || ''}/>
                <TXInput label="确认新密码" forbiddenDot={true} keyboardType = 'numeric'  secureTextEntry={true} maxLength={4} placeholder="请再次填写新密码" textAlign='right' onChange={(value) => this._onChange('rePassword', value)} value={this.state.rePassword || ''}/>
                <View style={{paddingLeft:14,paddingTop:15,flexDirection: 'row',alignItems: 'center',justifyContent:'flex-start',height:30,width:Dimensions.get('window').width}}>
                    <Text style={{fontSize:10,color:textThreeHightTitleColor}}>注:提款密码限制为</Text>
                    <Text style={{fontSize:10,color:MainTheme.tipsSpecialTextColor}}>4位数字</Text>
                </View>
                <View style={{paddingTop:20,alignItems: 'center'}}>
                    <TouchableOpacity  onPress={() => this._onSettingPWD()}  activeOpacity={0.2} focusedOpacity={0.5}>
                     <View style=  {{borderRadius:10,borderWidth:1,borderColor:MainTheme.commonButtonBGColor,borderStyle: 'solid',justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 100,height:40,backgroundColor:MainTheme.commonButtonBGColor}}>

                        <Text style={{color:MainTheme.commonButtonTitleColor,fontSize:17}}>设置</Text>
                     </View>
                </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Iuput_stype: {
        height: 100,
        backgroundColor:'#ffffff'
    },
});
