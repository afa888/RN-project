import React, { Component } from 'react';
import { navigation } from "react-navigation";
import {
    SafeAreaView, Text,
    Image, View,
    TouchableOpacity, StyleSheet
} from "react-native";

import MainTheme from '../../utils/AllColor';
import TXInput from "../../tools/TXInput"
import TXToastManager from "../../tools/TXToastManager"
import http from "../../http/httpFetch";
import httpBaseManager from '../../http/httpBaseManager'

export default class AgentCommissionExtract extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('佣金提取')
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
        this.state={bank:''};
    }

    componentDidMount () {
        const {agentData,bankInfo} = this.props.navigation.state.params;
        let bankStr = bankInfo.bankName + '(' + bankInfo.cardNum.substring(bankInfo.cardNum.length - 4) + ')';
        this.setState({agentData:agentData,bank:bankStr});
    }

    /**
    * 咨询在线客服
    */
    onlineSupport = () => {
        const { navigation } = this.props;
        navigation.navigate('CustomerService');
    }

    onCommitWithdrawal = () => {
        const {agentData} = this.props.navigation.state.params;
        let params = {amount:agentData.outstandingCommissions,commissionBeginDate:agentData.commissionBeginDate,
            commissionEndDate:agentData.commissionEndDate,settlementType:'0'};// 0 提现到银行卡， 1 转存到钱包
        http.post('agency/withdrawlCommission', params).then(res => {
            console.log(res);
            if (res) {
                TXToastManager.show(res.msg);
                if (res.status === 10000) {
                    //重新查询用户信息
                    httpBaseManager.queryUserInfo();
                    //关闭当前界面并显示成功界面 防止返回时又回到次界面
                    this.props.navigation.replace('AgentCommissionSuccess');
                }
            }else {
                TXToastManager.netError();
            }
        }).catch(err => {
            console.error(err)
        });
    }

    render() {
        const {agentData} = this.props.navigation.state.params
        if (agentData) {
            let term = agentData.commissionBeginDate + ' ~ ' + agentData.commissionEndDate;
            return (
                <View style={styles.mainContainer}>
                    <TXInput label="提取佣金" isUpdate={false} textInputStyle={{color:MainTheme.specialTextColor}}  textAlign='right'  value={agentData.outstandingCommissions}/>
                    <TXInput label="计佣周期" isUpdate={false}  textAlign='right'  value={term} />
                    <TXInput label="提取类型" isUpdate={false}  textAlign='right'  value='提现到银行卡' />
                    <TXInput label="银行卡号" isUpdate={false}  textAlign='right'  value={this.state.bank} />
                    <View style={styles.tips}>
                        <Text style={{fontSize:12,color:MainTheme.GrayColor}}>将佣金提现到银行卡，需先提交平台审核，完成审核后将于X个工作日内存入您提供的银行卡账户内，若有任何疑问，请联系<Text onPress={this.onlineSupport} style={{color:MainTheme.specialTextColor}} > 在线客服 </Text></Text>
                        
                    </View>

                    {MainTheme.renderCommonSubmitButton(this.onCommitWithdrawal,'确认提交')}
                </View>
            )
        }else {
            return (
                <View></View>
                )
        }
        
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor:MainTheme.backGroundColor,
    },
    tips:{
        marginTop:10,
        marginLeft:20,
        marginRight:20,
    }
});

