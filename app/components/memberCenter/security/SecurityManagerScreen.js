import React, {Component} from 'react';
import {Platform,DeviceEventEmitter,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import Picker from 'react-native-picker';
import TXInput from "../../../tools/TXInput"
import http from '../../../http/httpFetch'
import {getStoreData} from "../../../http/AsyncStorage";
import httpBaseManager from '../../../http/httpBaseManager'
import { NavigationActions } from 'react-navigation';
import {TXAlert} from "../../../tools/TXAlert"
import {specialTextColor} from "../../../utils/AllColor"

export default class SecurityManagerScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {

        return {
          title: '安全设置',
          headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
          headerBackTitle:null,
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
        this.state = {password:'未设置',depositPassword:'未设置',phoneNum:'(未认证)',bankCard:'尚未绑定'};
    }

    refreshData (data) {
        getStoreData('userInfoState').then((userInfo) => {
            if (userInfo) {
                let isSetPwd = '未设置';
                if (userInfo.hasOwnProperty('password') && userInfo.password.length > 0) {
                    isSetPwd = '已设置';
                }
                let isSetDepPwd = '未设置';
                let mobileStatus = '(未认证)';
                let bankStatus = '尚未绑定';

                if (userInfo.settedqkpwd) {
                    isSetDepPwd = '已设置';
                }

                if (userInfo.mobileStatus == 1) {
                    mobileStatus = userInfo.mobile + '(已认证)'
                }

                if (userInfo.bankList && userInfo.bankList.length >0) {
                    let bankInfo = userInfo.bankList[0];

                    let bankName = bankInfo['bankName'];
                    if(bankName.length == 0)
                    {
                        bankName = '';
                    }
                    let bankNum = bankInfo['cardNum'];
                    if(bankNum.length == 0){
                        bankNum = '';
                    }
                    if (bankNum.length > 4) {
                            bankStatus = bankName + '(' + bankNum.substring(bankNum.length - 4) +')';

                    }else {
                            bankStatus = bankName;
                    }


                }

                this.setState({password:isSetPwd,depositPassword:isSetDepPwd,
                    phoneNum:mobileStatus,bankCard:bankStatus});

            }else {

            }
        });
    }

    componentDidMount (){
        this.listener = DeviceEventEmitter.addListener('bindSuccess',this.refreshData.bind(this));//必须绑定this 否则会找不到 this
        this.refreshData('')
    }

    componentWillUnmount() {
        this.listener.remove();//删除订阅
    };

    _onUpdateInfo = (type) => {
        if (type == 1) {
            //修改登录密码
            this.props.navigation.navigate('ChangeLoginPwdScreen');
        }else {
            getStoreData('userInfoState').then((userInfo) => {

            if (userInfo) {
                if(type == 2){
            //修改提款 密码
                    if (!userInfo.settedqkpwd) {
                        //尚未设置提款密码
                        this.props.navigation.navigate('SettingCapitalPwdScreen');
                    }else {
                        //修改提款密码
                        this.props.navigation.navigate('ChangeCapitalPwdScreen');
                    }
                }else if(type ==3){
                    //验证手机号码
                    if (userInfo.mobileStatus == 0) {
                        //尚未验证的需要验证下，已经验证的则无需进入
                        this.props.navigation.navigate('BindPhoneNumScreen');
                    }
                }else if(type == 4){
                    //银行卡信息
                    if (!userInfo.settedqkpwd) {
                        //尚未设置提款密码
                        this.props.navigation.navigate('SettingCapitalPwdScreen');
                    }else if(userInfo.bankList && userInfo.bankList.length == 0) {
                        //尚未绑定银行卡
                        this.props.navigation.navigate('AddBankScreen');
                    }else {
                        //已经绑定
                        this.props.navigation.navigate('BankCardInfoScreen');
                    }
                }


                }else {
                    //没有数据，直接请求基础数据
                    httpBaseManager.baseRequest();
                }
            });
        }
    }


    render() {
        const dePhoneStatus = this.state.phoneNum.indexOf('已认证') == -1 ? true : false;
        const dePhoneColor = dePhoneStatus ? specialTextColor : '#8B8B8B'
        return (
            <View style={{height:Dimensions.get('window').height,alignItems: 'center',backgroundColor:'#efeff4'}}>
                <View style={{paddingTop:10,height:40,width:Dimensions.get('window').width}}>
                    <Text style={{paddingLeft:10}}>安全设置</Text>
                </View>
                <TXInput label="登录密码" detailTextColor={specialTextColor} isUpdate={false} showDetail={true} textAlign='right' onClick={() => this._onUpdateInfo(1)} value={this.state.password || ''}/>
                <TXInput label="提款密码" detailTextColor={specialTextColor} isUpdate={false} showDetail={true} textAlign='right' onClick={() => this._onUpdateInfo(2)} value={this.state.depositPassword || ''}/>
                <TXInput label="手机号码" detailTextColor={dePhoneColor} isUpdate={false} showDetail={dePhoneStatus} textAlign='right' onClick={() => this._onUpdateInfo(3)} value={this.state.phoneNum || ''}/>
                <TXInput label="银行卡" detailTextColor={specialTextColor} isUpdate={false} showDetail={true} textAlign='right' onClick={() => this._onUpdateInfo(4)} value={this.state.bankCard || ''}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({

});
