import React, {Component} from 'react';
import {Alert, SectionList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import DeviceValue from "../../../utils/DeviceValue";
import {getStoreData} from "../../../http/AsyncStorage";
import http from "../../../http/httpFetch";
import {loginOutDo} from "../../auth/changeLoginStatus";
import {TXAlert} from "../../../tools/TXAlert";
import TXToastManager from "../../../tools/TXToastManager";

const EnterItem = {
  acount: [
      {
          label:'存款',
          img: require('../../../static/img/vip_center_03.png'),
          url:'DepositManagerScreen'
      },
      {
          label:'取款',
          img: require('../../../static/img/vip_center_02.png'),
          url:'WithdrawalScreen'
      },
      {
          label:'转账',
          img: require('../../../static/img/vip_center_01.png'),
          url:'PlatformTransferScreen'
      }
  ],
   fund: [
       {
           label:'资金记录',
           img: require('../../../static/img/vip_center_04.png'),
           url:'FundRecord'
       },
       {
           label:'投注记录',
           img: require('../../../static/img/vip_center_05.png'),
           url:'BettingRecord'
       }
   ],
    other: [
        {
            label:'安全设置',
            img: require('../../../static/img/vip_center_10.png'),
            url:'SecurityManagerScreen'
        },
        {
            label:'优惠活动',
            img: require('../../../static/img/vip_center_11.png'),
            url:'Discount'
        },
        {
            label:'帮助中心',
            img: require('../../../static/img/vip_center_12.png'),
            url:'HelpScreen'
        }
    ]
};

export default class MainEntrance extends Component<Props> {

    _showDetail = (item) => {
      if (item.url === 'DepositManagerScreen') {
        this.props.route.navigate('DepositManagerScreen',{isNotFromHome:true})
      }else if(item.url === 'WithdrawalScreen'){
        getStoreData('userInfoState').then((userInfo) => {
            if (userInfo && !userInfo.settedqkpwd) {
                //尚未设置提款密码
                TXToastManager.show('请先设置提款密码');
                this.props.route.navigate('SettingCapitalPwdScreen');
            }else if(userInfo && userInfo.bankList && userInfo.bankList.length ==0){
                //还没有绑定银行卡
                TXToastManager.show('请先绑定银行卡');
                this.props.route.navigate('AddBankScreen');
            } else if (userInfo.bankList && userInfo.bankList.length >0) {
                this.props.route.navigate(item.url)
            }
        });
      }
      else {
        this.props.route.navigate(item.url)
      }

    }

    gridItem = (item) => {
        return (
            <TouchableOpacity onPress={() => {this._showDetail(item)}}>
                <View style={{
                    flex:1,
                    width: (DeviceValue.windowWidth - 50) / 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Image  style={{
                        resizeMode: 'contain',
                        width: 36,
                        height: 36
                    }}
                    source={item.img}
                    />
                    <Text style={{lineHeight:30}}>{item.label}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.title}>资金转换</Text>
                <View style={styles.main}>
                    { EnterItem.acount.map(item => this.gridItem(item) )}
                </View>
                <Text style={styles.title}>交易记录</Text>
                <View style={styles.main}>
                    { EnterItem.fund.map(item => this.gridItem(item) )}
                </View>
                <Text style={styles.title}>其他</Text>
                <View style={styles.main}>
                    { EnterItem.other.map(item => this.gridItem(item) )}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width: DeviceValue.windowWidth -30,
        height:484,
        marginTop:66,
        marginLeft:15,
        marginBottom:20,
        borderRadius:8,
        backgroundColor:'#fff',
        paddingVertical:20,
        paddingHorizontal:10
    },
    title:{
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
        lineHeight: 40
    },
    main: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100
    }
});
