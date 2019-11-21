import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar,ScrollView} from 'react-native';
import Dimensions from 'Dimensions'
import TXInput from "../../../tools/TXInput"
import { NavigationActions } from 'react-navigation';
import MainTheme from "../../../utils/AllColor"
import {ThemeEditTextTextColor} from "../../../utils/AllColor"

let timeCount = 59*60+59

export default class DepositBankTransferScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};

        return {
          title: '网银转账',
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
        this.state = {leftTime:'59分59秒',allTimeCount:59*60+59};
    }

    componentDidMount() {
        this.interval=setInterval(
          () => {
                    timeCount--;
                    if (timeCount > 0) {
                        let leftTimeString = String(parseInt(timeCount / 60))+'分'+ String(timeCount % 60) +'秒';
                        this.setState({leftTime:leftTimeString});
                    }else {
                        //返回上一层
                        this.props.navigation.navigate.goBack();
                    }

                },
          1000
        );
      }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    };


    commitRequest = (type)=> {
        let message;
        if (type === 1) {
            message = '提交成功，系统审核通过后，将会及时到账，请确保您的通讯畅通，以便客服与您联系。'
        }else if(type === 2){
            message = '您是否确定取消订单?' + '\n' + '若已完成支付,取消订单将会造成资金无法入账。'
        }

        Alert.alert('温馨提示', message, [{
                        text: '确定', onPress: () => {
                            this.props.navigation.goBack();
                        }
                    },{
                        text: '取消', onPress: () => {

                        }
                    }], {cancelable: false});


    };

    render() {
        const { params } = this.props.navigation.state;
        const payMethod = params.transferType;
        const money = params.transferAmount + '(元)';
        const orderNum = params.orderNumber;
        const orderTime = params.orderTime;
        const cagentBankCardEntity = params.cagentBankCardEntity;


        return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={{alignItems: 'center',backgroundColor:MainTheme.backgroundColor,height:750}}>
                
                <View style={{paddingTop:10}}>
                    <View style={{paddingTop:30,width:Dimensions.get('window').width-40,height:200,backgroundColor:MainTheme.BankTransgerBGColor,borderRadius:10}}>
                        <Text style={{paddingLeft:20,color:MainTheme.BankInfoFontColor,fontSize:17}}>{cagentBankCardEntity.bankname}</Text>
                        <View style={[styles.Text_style,{paddingTop:10,backgroundColor:ThemeEditTextTextColor}]}>
                            <Text style={{color:MainTheme.BankInfoFontColor}}>{cagentBankCardEntity.cardno}</Text>
                        </View>
                        <Text style={{paddingTop:10,paddingLeft:20,color:MainTheme.BankInfoFontColor,fontSize:17,height:40}}>开户名：{cagentBankCardEntity.realname}</Text>
                        <Text style={{paddingLeft:20,color:MainTheme.BankInfoFontColor,fontSize:17,height:30}}>开户行：{cagentBankCardEntity.bankaddress}</Text>
                    </View>
                    <View style={{paddingTop:10}}>
                        <Text style={{color:MainTheme.GrayColor,fontSize:10}}>小提示: 点击银行卡各项信息可直接复制到剪贴板</Text>
                    </View>
                </View>

                <View style={{paddingTop:20,width:Dimensions.get('window').width - 20}}>
                    <TXInput label="存款金额" value={money} textAlign='right' isUpdate={false} textInputStyle={{color:MainTheme.BankTransgerBGColor}} />
                    <TXInput label="下单时间" value={orderTime} textAlign='right' isUpdate={false}/>
                    <TXInput label="订单编号" value={orderNum} textAlign='right' isUpdate={false}  textInputStyle={{color:MainTheme.BankTransgerBGColor}}/>
                    <TXInput label="订单失效时间" value={this.state.leftTime} textAlign='right' isUpdate={false} />
                </View>
                <View style={{paddingTop:20,paddingLeft:10,flexDirection: 'column',justifyContent:'center',width:Dimensions.get('window').width - 20}}>
                    <Text style={{fontSize:12,color:'#D62F27',height:18}}>温馨提示</Text>
                    <Text style={{fontSize:10,color:'#8B8B8B',height:15}}>1.请注意『备注』中填写订单编号。若没有备注，将影响您的到帐时间。</Text>
                    <Text numberOfLines={5} style={{fontSize:10,color:'#8B8B8B',height:50}}>2.以上银行帐号限本次存款使用，帐号不定期更换！每次存款前请依照本页所显示的银行帐号入款。如入款至已过期帐号，公司无法查收，恕不负责！</Text>

                </View>

                <View style={{paddingTop:20,alignItems: 'center',height:60}}>
                    <TouchableOpacity  onPress={() => {this.commitRequest(1)}}  activeOpacity={0.2} focusedOpacity={0.5}>
                     <View style=  {{borderRadius:10,justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 100,height:40,backgroundColor:MainTheme.commonButtonBGColor}}>

                        <Text style={{color:MainTheme.commonButtonTitleColor,fontSize:17}}>完成存款</Text>
                     </View>
                    </TouchableOpacity>
                </View>

                {MainTheme.renderCommonSubmitButton(this._onCommitWithdrawal.bind(this,1),'完成存款')}
                {MainTheme.renderCommonCancelButton(this.commitRequest.bind(this,2),'取消订单')}

            </View>
            <View style={{height:34}}></View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    Iuput_stype: {
        height: 100,
        backgroundColor:'#ffffff'
    },
    Text_style: {
        height: 40,
        fontSize:17,
        paddingLeft:20,
        marginTop:10,
        textAlignVertical: 'center',
        ...Platform.select({
        ios: { lineHeight: 40},
        android: {}
        })
    },
    TextW_style: {
        height: 40,
        fontSize:17,
        paddingLeft:5,
        color:'#535353',
        backgroundColor:'#FFFFFF',
        textAlignVertical: 'center',
        ...Platform.select({
        ios: { lineHeight: 40},
        android: {}
        })
    },
    TextG_style: {
        height: 40,
        fontSize:17,
        color:'#535353',
        textAlignVertical: 'center',
        ...Platform.select({
        ios: { lineHeight: 40},
        android: {}
        })
    },
    contentContainer: {
        paddingVertical: 0,
        backgroundColor:'#efeff4'
    }
});
