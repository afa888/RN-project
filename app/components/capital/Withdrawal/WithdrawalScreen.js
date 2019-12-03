import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, 
    View, Button, Alert, Image,StatusBar,
    Modal,
    TouchableHighlight,
    TextInput
} from 'react-native';
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
import {category_group_divide_line_color} from "../../../utils/AllColor"
import DeviceValue from '../../../utils/DeviceValue'
import Password from 'react-native-password-pay'
import {money_validate} from "../../../utils/Validate";
var TimerMixin = require('react-timer-mixin');

let screenWidth = Dimensions.get('window').width;
let dialogWidth = screenWidth-80;

export default class WithdrawalScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {

        return {
          title: '提款',
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
        this.state = {minWithdrawMoney:'100',maxWithdrawMoney:'500000',modalVisible: false,bank:'',cardNum:'',wallet:'0.00',money:'',cardid:'',password:'',markingQuantity:'',userQuantity:'',withdrawConfig:'',withdrawFee:'',withdrawManageFee:''};
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

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }

    checkDrawMoney () {
        http.post('User/selectWithdrawConfig', null,true).then((res) => {
            if (res && res.status === 10000) {
                let oData = res.data;
                this.setState({markingQuantity:String(oData.markingQuantity),userQuantity:String(oData.userQuantity),
                    withdrawConfig:String(oData.withdrawConfig),withdrawFee:String(oData.withdrawFee),
                    withdrawManageFee:String(oData.withdrawManageFee),minWithdrawMoney:String(oData.minWithdrawMoney),
                    maxWithdrawMoney:String(oData.maxWithdrawMoney)});
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
        if(parseInt(this.state.markingQuantity) > parseInt(this.state.userQuantity) && (parseInt(this.state.withdrawFee) > 0 || parseInt(this.state.withdrawManageFee)>0 )){
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

    _onCheckWithdrawal = () => {
        if(this.state.money.length == 0){
            TXToastManager.show('请输入取款金额为100~500000元');
        }else if(!money_validate(this.state.money)){
            TXToastManager.show('请输入正确的提现金额');
        }
        else if(parseInt(this.state.money)<100 || parseInt(this.state.money)>500000){
            TXToastManager.show('请输入取款金额为100~500000元');
        }else {
            this.setModalVisible(true);
        }
        
    }

    _onShowCustomer  = () => {
         this.props.navigation.navigate('CustomerService')
    }


    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    onClose() {
        this.setState({modalVisible: false});
    }

    render() {
        let denominator = parseInt(this.state.markingQuantity);
        let element = parseInt(this.state.userQuantity);
        let proportion;
        let showP;
        if (denominator == 0 || isNaN(denominator)) {
            proportion = 0.99999;
            showP = '100 %';
        }
        else if(denominator <= element) {
            proportion = 0.99999;
            showP = '100 %';
        }else {
            proportion = (element * 1.0) / (denominator * 1.0);

            showP = proportion * 100 + '%';
        }

        let des = '单笔限额' + this.state.minWithdrawMoney + '-' + this.state.maxWithdrawMoney + '元'

        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>

            <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {this.setModalVisible(false)}}
                >
                    <TouchableOpacity style={{flex:1}} onPress={this.onClose.bind(this)}>
                    <View style={styles.container}>
                        <View style={styles.innerContainer}>
                            <View style={{borderTopLeftRadius: 10,borderTopRightRadius: 10,height:128,width:DeviceValue.windowWidth - 40,backgroundColor:MainTheme.theme_color}}>
                                <View style={{marginTop:20,flexDirection:'row',justifyContent:'center'}}>
                                    <View style={{marginLeft:10,width:100}}>
                                        <Text style={{color:MainTheme.SubmitTextColor,fontSize:14}}>提款金额</Text>
                                    </View>
                                    <View style={{marginRight:10,width:DeviceValue.windowWidth - 160,alignItems:'flex-end'}}>
                                        <Text  style={{color:MainTheme.SubmitTextColor,fontSize:14}}>￥{this.state.money}</Text>
                                    </View>
                                </View>

                                <View style={{marginTop:20,flexDirection:'row',justifyContent:'center'}}>
                                    <View style={{marginLeft:10,width:100}}>
                                        <Text style={{color:MainTheme.SubmitTextColor,fontSize:14}}>提款至银行</Text>
                                    </View>
                                    <View style={{marginRight:10,width:DeviceValue.windowWidth - 160,alignItems:'flex-end'}}>
                                        <Text  style={{color:MainTheme.SubmitTextColor,fontSize:14}}>{this.state.bank}</Text>
                                    </View>
                                </View>

                                <View style={{marginTop:20,flexDirection:'row',justifyContent:'center'}}>
                                    <View style={{marginLeft:10,width:100}}>
                                        <Text style={{color:MainTheme.SubmitTextColor,fontSize:14}}>提款卡号</Text>
                                    </View>
                                    <View style={{marginRight:10,width:DeviceValue.windowWidth - 160,alignItems:'flex-end'}}>
                                        <Text  style={{color:MainTheme.SubmitTextColor,fontSize:14}}>{this.state.cardNum}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{borderBottomLeftRadius: 10,borderBottomRightRadius: 10,height:140,width:DeviceValue.windowWidth - 40,backgroundColor:MainTheme.backgroundColor}}>
                                <View style={{marginTop:10,paddingLeft:10,backgroundColor:MainTheme.backgroundColor,width:120}}>
                                    <Text style={{color:MainTheme.DarkGrayColor}}>输入提款密码</Text>
                                </View>
                                <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>

                                    <View style={{width:180,height:45}}>
                                     <Password maxLength={4}
                                               onChange={(value)=> {
                                                   console.log('输入的密码：',value)
                                                   if (value.length == 4) {
                                                    this.onClose();
                                                    this.setState({password:value});
                                                    this.timer = setTimeout(
                                                      () => { this._onCommitWithdrawal(); },
                                                      500
                                                    );
                                                    
                                                   }
                                               }}
                                     />
                                    </View>
                                </View>
                                <View style={{paddingTop:10,justifyContent:'center',flexDirection: 'row',height:50}}>
                                    <Text style={{fontSize:10,color:'#8B8B8B'}}>忘记密码，请联系</Text>
                                    <Text style={{fontSize:10,color:'red'}} onPress={this._onShowCustomer}> 在线客服 </Text>
                                </View>
                                
                            </View>
                        </View>
                    </View>
                    </TouchableOpacity>
                </Modal>

            <View style={{flex:1}}>

                <View style={{height:Dimensions.get('window').height,alignItems: 'center',backgroundColor:MainTheme.backgroundColor}}>
                
                <View style ={{backgroundColor:MainTheme.backgroundColor,width:Dimensions.get('window').width,padding:20,height:140}}>
                    <View style={{borderRadius:10,borderWidth:0.5,borderColor:MainTheme.theme_color,alignItems: 'center',paddingTop:20,height:100,width:Dimensions.get('window').width - 40,backgroundColor:MainTheme.theme_color}}>
                        <View style={{paddingLeft:15,paddingTop:5,width: Dimensions.get('window').width - 40, height: 80}}>
                            <Text style={{color:'#ffffff',fontSize:16,fontWeight:'bold'}}>{this.state.bank}</Text>
                            <Text style={{color:'#ffffff',paddingTop:20,fontSize:16}}>{this.state.cardNum}</Text>
                        </View>
                    </View>
                </View>

                <View style={{paddingTop:10,height:35,width:Dimensions.get('window').width}}>
                    <Text style={{paddingLeft:20,color:MainTheme.DarkGrayColor}}>打码量</Text>
                </View>
                
                <View style={{height:70,width:Dimensions.get('window').width,paddingLeft:20,paddingRight:20,flexDirection:'column'}}>
                    <View style={{height:30,flexDirection:'row'}}>
                        <View style={{height:30,width:DeviceValue.windowWidth - 83}}></View>
                        <ImageBackground style={{ flex: 1,width:58,height:30}} resizeMode='cover'
                            source={require('../../../static/img/drawing_icon_dm02.png')} >
                            <View style={{paddingLeft:5,paddingRight:5,paddingBottom:7,width:58,height:30,alignItems:'center',justifyContent:'center'}}>
                                <Text adjustsFontSizeToFit={true} minimumFontScale={0.01} style={{color:MainTheme.commonButtonTitleColor}}>{showP}</Text>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={{height:10,flexDirection:'row'}}>
                        <View style={{flex:0,height:10,width:(DeviceValue.windowWidth - 40) * proportion,backgroundColor:'red'}}></View>
                        <View style={{height:10,width:(DeviceValue.windowWidth - 40) * (1 - proportion),backgroundColor:category_group_divide_line_color}}></View>
                    </View>
                    <View style={{height:30,flexDirection:'row'}}>
                        <Text style={{color:MainTheme.GrayColor}}>{this.state.userQuantity} / {this.state.markingQuantity}</Text>
                        
                    </View>
                </View>



                <TXInput label="钱包余额"  labelTextStyle={{color:MainTheme.textTitleColor}} textInputStyle={{color:MainTheme.specialTextColor}}  isUpdate={false} textAlign='right'  value={this.state.wallet || ''}/>

                <TXInput label="￥" labelTextStyle={{color:MainTheme.textTitleColor,fontSize:20}} forbiddenDot={true} keyboardType = 'numeric'  placeholder="请输入提款金额" textAlign='right' onChange={(value) => this._onChange('money', value)} value={this.state.money || ''}/>
                <View style={{paddingTop:15,paddingLeft:10,flexDirection: 'column',justifyContent:'center',height:35,width:Dimensions.get('window').width}}>
                    <Text style={{fontSize:12,color:MainTheme.GrayColor}}>{des}</Text>
                </View>
                
                {MainTheme.renderCommonSubmitButton(this._onCheckWithdrawal.bind(this),'立即提款')}
                <View style={{paddingTop:20,paddingLeft:10,flexDirection: 'row',height:50,width:Dimensions.get('window').width}}>
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
    container: {
        flex: 1,
        padding: 20,
        paddingTop:120,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    innerContainer: {
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#fff',

    },
    btnContainer:{
        width:dialogWidth,
        borderTopWidth:1,
        borderTopColor:'#777',
        alignItems:'center'
    },
    inputtext:{
        width:dialogWidth-20,
        margin:10,
    },
    hidemodalTxt: {
        marginTop:10,
    },
  contentContainer: {
    paddingVertical: 0
  }
});

