import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import TXToastManager from "../../../tools/TXToastManager"
import {textThreeHightTitleColor,tipsSpecialTextColor} from "../../../utils/AllColor"
import MainTheme from "../../../utils/AllColor"
//没有支付列表显示说明
export default class NonePayList extends Component<Props> {

    render () {
        return (
            <View style={{flexDirection:'column',backgroundColor:MainTheme.backgroundViewColor,alignItems:'center',justifyContent:'center',flex:1,width:Dimensions.get('window').width}}>
                <Image source={require('../../../static/img/pic_nodate.png')}
                           style={{
                               width: 244,
                               height: 240,
                           }}/>
                <View style={{backgroundColor:MainTheme.backgroundViewColor,alignItems:'center',justifyContent:'center',height:50,flex:1,flexDirection: 'row',width:Dimensions.get('window').width}}>
                  <Text style={{fontSize:13,color:textThreeHightTitleColor,height:15}}>无可用的充值渠道，请联系</Text>
                  <View style={{width:10}}></View>
                  <Text style={{fontSize:13,color:MainTheme.tipsSpecialTextColor,height:15}} onPress={this.props.onShowCustomer}>“在线客服” </Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 0
  },
  container: {
    alignItems: 'center',
    justifyContent:'center',

  },
  flatListStyle:{
    color:'red',
    fontSize:16,
    paddingTop:5,
    backgroundColor:'#efeff4',
  }
});


