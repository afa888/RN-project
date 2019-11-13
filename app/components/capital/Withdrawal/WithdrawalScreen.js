import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import { ImageBackground , ScrollView} from 'react-native';
import TXInput from "../../../tools/TXInput"
import http from '../../../http/httpFetch'
import {getStoreData} from "../../../http/AsyncStorage";
import { NavigationActions } from 'react-navigation';
import httpBaseManager from '../../../http/httpBaseManager'
import {TXAlert} from "../../../tools/TXAlert"
import TXToastManager from "../../../tools/TXToastManager"
import MainTheme from "../../../utils/AllColor"

export default class WithdrawalScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {

        return {
          title: '取款',
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
        this.state = {bank:'',cardNum:'',wallet:'0.00',money:'',cardid:'',password:'',markingQuantity:'',userQuantity:'',withdrawConfig:'',withdrawFee:'',withdrawManageFee:''};
    }

    componentDidMount () {
        getStoreData('userInfoState').then((userInfo) => {
            if (userInfo && !userInfo.settedqkpwd) {
                //尚未设置提款密码
                TXToastManager.show('请先设置提款密码');
                return this.props.navigation.replace('SettingCapitalPwdScreen');
            }else if(userInfo && userInfo.bankList && userInfo.bankList.length ==0){
                //还没有绑定银行卡
                TXToastManager.show('请先绑定银行卡');
                return this.props.navigation.navigate('AddBankScreen');
            } else if (userInfo.bankList && userInfo.bankList.length >0) {
            let bankInfo = userInfo.bankList[0];
            let wallet = userInfo.balance;
            if (wallet.length == 0) {
                wallet = '0.00';
            }
            this.setState({bank:bankInfo.bankName,cardNum:bankInfo.cardNum,wallet:wallet,cardid:bankInfo.id});
          }
        });
        //获取手续费
        this.checkDrawMoney();
    }

    checkDrawMoney () {
        http.post('User/selectWithdrawConfig', null,true).then((res) => {
            if (res && res.status === 10000) {
                let oData = res.data;
                this.setState({markingQuantity:String(oData.markingQuantity),userQuantity:String(oData.userQuantity),withdrawConfig:String(oData.withdrawConfig),withdrawFee:String(oData.withdrawFee),withdrawManageFee:String(oData.withdrawManageFee)});
            }else {
                if (!res) {
                    TXAlert('网络异常，请稍后重试');
                    this.props.navigation.dispatch(NavigationActions.back());
                }else {
                    TXAlert(res.msg);
                }
            }
        }).catch(err => {
            console.error(err)
        });
    }

    _onChange = (label, value) => {
        this.setState({ [label]: value });
    };

    _onDrawFeeAlert = (showMeg) => {
        Alert.alert('温馨提示', showMeg, [{
                        text: '取消', onPress: () => {

                        }
                    },{
                        text: '确定', onPress: () => {
                            this._onRequestWithDrawal();
                        }
                    }], {cancelable: false});
    }

    _onRequestWithDrawal = () => {
        let params = {cardid:this.state.cardid,credit:this.state.money,password:this.state.password};

        http.post('User/WithDraw', params,true).then((res) => {
            if (res && res.status === 10000) {
                httpBaseManager.queryBalance();//重新查询钱包余额
                this.props.navigation.dispatch(NavigationActions.back());
                TXAlert('提交成功！请等待管理员审核');
            }else {
                if (res && res.msg) {
                    TXAlert(res.msg);
                }else {
                    TXAlert('网络异常，请稍后重试');
                }
            }
        }).catch(err => {
            console.error(err)
        });
    }

    _onCommitWithdrawal = () => {
        var showMeg;
        if(this.state.money.length == 0){
            Alert.alert('请输入取款金额为100~500000元');
        }else if(parseInt(this.state.money)<100 || parseInt(this.state.money)>500000){
            Alert.alert('请输入取款金额为100~500000元');
        }else if(this.state.password.length != 4){
            Alert.alert('请输入4位提款密码');
        }else if(parseInt(this.state.markingQuantity) > parseInt(this.state.userQuantity) && (parseInt(this.state.withdrawFee) > 0 || parseInt(this.state.withdrawManageFee)>0 )){
            showMeg = '未完成打码量，提款将收取' + this.state.withdrawConfig + '%的费率，且今日提款次数过多，提款将收取' + this.state.withdrawFee + '%的手续费和' + this.state.withdrawManageFee +'元的行政费，是否继续提款?';
            this._onDrawFeeAlert(showMeg);
        }else if(parseInt(this.state.markingQuantity) > parseInt(this.state.userQuantity)){
            showMeg = '未完成打码量，提款将收取' + this.state.withdrawConfig + '%的费率,是否继续提款？';

            this._onDrawFeeAlert(showMeg);

        }else if(parseInt(this.state.withdrawFee) > 0 || parseInt(this.state.withdrawManageFee)>0){
            showMeg = '今日提款次数过多，提款将收取' + this.state.withdrawFee + '%的手续费和' + this.state.withdrawManageFee + '元的行政费，是否继续提款？';
            this._onDrawFeeAlert(showMeg);
        }else {
            this._onRequestWithDrawal();
        }
    };

    _onShowCustomer  = () => {
         this.props.navigation.navigate('优惠')
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={{flex:1}}>

                <View style={{height:Dimensions.get('window').height,alignItems: 'center',backgroundColor:MainTheme.backgroundColor}}>
                
                <View style={{alignItems: 'center',paddingTop:20,height:100,width:Dimensions.get('window').width,backgroundColor:'#fff'}}>
                    <View style={{backgroundColor:MainTheme.theme_color,paddingLeft:15,paddingTop:20,width: 240, height: 100}}>
                        <Text style={{color:'#ffffff',fontSize:16,fontWeight:'bold'}}>{this.state.bank}</Text>
                        <Text style={{color:'#ffffff',paddingTop:15,fontSize:12}}>{this.state.cardNum}</Text>
                    </View>
                </View>


                <View style={{paddingTop:10,height:35,width:Dimensions.get('window').width}}>
                    <Text style={{paddingLeft:10}}>打码量信息</Text>
                </View>
                <TXInput label="要求打码量" isUpdate={false} buttonFontSize={10} textAlign='right' onChange={(value) => this._onChange('markingQuantity', value)} value={this.state.markingQuantity+'  ' || ''}/>
                <TXInput label="完成打码量" isUpdate={false} textAlign='right' onChange={(value) => this._onChange('userQuantity', value)} value={this.state.userQuantity+'  ' || ''}/>
                <View style={{paddingTop:10,height:35,width:Dimensions.get('window').width}}>
                    <Text style={{paddingLeft:10}}>取款信息</Text>
                </View>
                <TXInput label="取款金额" forbiddenDot={true} keyboardType = 'numeric'  placeholder="单笔限额100~500000(元)" textAlign='right' onChange={(value) => this._onChange('money', value)} value={this.state.money || ''}/>
                <TXInput label="取款密码"  placeholder="请输入取款密码" textAlign='right' secureTextEntry={true} maxLength={4} onChange={(value) => this._onChange('password', value)} value={this.state.password || ''}/>
                <View style={{paddingTop:20,alignItems: 'center'}}>
                    <TouchableOpacity  onPress={() => this._onCommitWithdrawal()}  activeOpacity={0.2} focusedOpacity={0.5}>
                     <View style=  {{borderRadius:10,borderWidth:1,borderColor:'#CFA359',borderStyle: 'solid',justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 100,height:40,backgroundColor:'#CFA359'}}>

                        <Text style={{color:'#ffffff',fontSize:17}}>下一步</Text>
                     </View>
                </TouchableOpacity>
                </View>
                <View style={{paddingTop:15,paddingLeft:10,flexDirection: 'column',justifyContent:'center',height:35,width:Dimensions.get('window').width}}>
                    <Text style={{fontSize:12,color:'#D62F27'}}>温馨提示</Text>
                </View>

                <View style={{paddingLeft:10,flexDirection: 'row',height:50,width:Dimensions.get('window').width}}>
                    <Text style={{fontSize:10,color:'#8B8B8B'}}>若您在取款过程中遇到困难，请您随时联系我们的</Text>
                    <Text style={{fontSize:10,color:'red'}} onPress={this._onShowCustomer}> 在线客服 </Text>
                    <Text style={{fontSize:10,color:'#8B8B8B'}}>来获取帮助</Text>
                </View>

            </View>

            </View>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 0
  }
});

