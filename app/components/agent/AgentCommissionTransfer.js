import React, {Component} from 'react';
import {
    StyleSheet, View, Text, ImageBackground, Image,
    TouchableOpacity, ScrollView, SafeAreaView,
    DeviceEventEmitter, Alert, Button
} from "react-native";
import {
    MainTheme,
    textTitleColor,
    CircleGoldColor,
    theme_color,
    BarBlueColor,
    AgentRedColor,
    AgentBlueColor,
} from "../../utils/AllColor";
import {getStoreData} from "../../http/AsyncStorage";
import DeviceValue from "../../utils/DeviceValue";
import {MarqueeHorizontal} from "react-native-marquee-ab";
import {CAGENT} from "../../utils/Config";
import http from "../../http/httpFetch";
import AndroidNativeGameActiviy from "../../customizeview/AndroidIosNativeGameActiviy";
import TXToastManager from "../../tools/TXToastManager";
import httpBaseManager from '../../http/httpBaseManager'

let isJoin = false
export default class AgentCommissionTransfer extends Component<Props> {

    static navigationOptions = ({navigation}) => {

        return {
            headerTitle: (
                MainTheme.renderCommonTitle('佣金转存')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: (
                <View/>
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            agentData: null,
            wallet:0,

        };
    }

    componentWillMount(): void {
        this.getUserInfo();

    }

    componentDidMount() {
        getStoreData('userInfoState').then((userInfo) => {
          this.setState({wallet:userInfo.balance});
      });
    }

    /*
        http://192.168.107.144:400/JJF/agency/withdrawlCommission
    */

    withdrawlCommission = () => {
        const {agentData} = this.props.navigation.state.params;
        let params = {amount:agentData.outstandingCommissions,commissionBeginDate:agentData.commissionBeginDate,
            commissionEndDate:agentData.commissionEndDate,settlementType:'1'};// 0 提现到银行卡， 1 转存到钱包
        http.post('agency/withdrawlCommission', params, true).then((res) => {
            if (res.status === 10000) {
                httpBaseManager.queryUserInfo();//关闭当前界面并显示成功界面 防止返回时又回到次界面
                this.props.navigation.replace('AgentCommissionSuccess');

            } else {
                TXToastManager.show('申请失败')
            }
        }).catch(err => {
            console.error(err)
        });

    }

    getUserInfo = () => {
        http.post('User/getUserInfo', null, true).then((res) => {
            if (res.status === 10000) {
                if (res.data !== undefined && res.data !== null && res.data !== {})
                    this.setState({agentData: res.data})
            }
        }).catch(err => {
            console.error(err)
        });

    }

    _onShowCustomer = () => {
        this.props.navigation.navigate('CustomerService')
    }

    render() {
        if (this.state.agentData) {
            let {outstandingCommissions, commissionBeginDate, commissionEndDate, allExtractedCommissions} = this.state.agentData
            let allEx = allExtractedCommissions.toFixed(2);
        return (<View style={{flex: 1, alignItems: 'center'}}>
                <View style={styles.itemView}>
                    <Text style={styles.itemTitleText}>转存金额</Text>
                    <Text style={styles.itemtTileThemeColorText}>{outstandingCommissions}</Text>
                </View>
                <View style={styles.devidelineView}/>
                <View style={styles.itemView}>
                    <Text style={styles.itemTitleText}>计拥周期</Text>
                    <Text style={styles.itemtTileGrayColorText}>{commissionBeginDate}~{commissionEndDate}</Text>
                </View>
                <View style={styles.devidelineView}/>
                <View style={styles.itemView}>
                    <Text style={styles.itemTitleText}>提取类型</Text>
                    <Text style={styles.itemtTileGrayColorText}>转存到中心钱包</Text>
                </View>
                <View style={styles.devidelineView}/>
                <View style={styles.itemView}>
                    <Text style={styles.itemTitleText}>当前余额</Text>
                    <Text style={styles.itemtTileGrayColorText}>{this.state.wallet}</Text>
                </View>
                <View style={styles.devidelineView}/>

                <Text
                    style={styles.itemtTileColorText}>将佣金提现到钱包余额，需先提交平台审核，审核完成后将立即转入您的中心钱包，可直接用于游戏，且不要求打码量，若有任何疑问，请联系<Text
                    style={{fontSize: 12, color: 'red'}} onPress={this._onShowCustomer}> 在线客服 </Text>
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        this.withdrawlCommission();
                    }}
                    style={styles.touchView}>
                    <Text style={[styles.agentTitle, {fontSize: 14}]}>确认提交</Text>
                </TouchableOpacity>
            </View>
        )
        }else {
            return null
        }
        
    }
}

const styles = StyleSheet.create({

    itemView: {
        width: DeviceValue.windowWidth,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 8,
    },
    itemTitleText: {
        width: DeviceValue.windowWidth / 2 - 15,
        textAlign: 'left',
        color: MainTheme.TextTitleColor
    },
    itemtTileThemeColorText: {width: DeviceValue.windowWidth / 2 - 30, textAlign: 'right', color: theme_color}
    ,
    itemtTileGrayColorText: {width: DeviceValue.windowWidth / 2 - 30, textAlign: 'right', color: MainTheme.GrayColor}
    ,
    itemtTileColorText: {
        width: DeviceValue.windowWidth - 30,
        color: MainTheme.GrayColor,
        fontSize: 12,
        height: 60,
        marginTop: 12
    }
    ,
    devidelineView: {
        marginLeft: 15,
        marginRight: 15,
        height: 0.7,
        width: DeviceValue.windowWidth - 30,
        backgroundColor: MainTheme.DivideLineColor,
        marginTop: 5
    },
    touchView: {
        alignItems: 'center', justifyContent: 'center', marginTop: 30,
        backgroundColor: theme_color, height: 40, width: DeviceValue.windowWidth - 40
    },
    agentTitle: {
        color: MainTheme.commonButtonTitleColor
    },
});
