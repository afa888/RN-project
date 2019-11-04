import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import TXToastManager from "../../../tools/TXToastManager"

//没有支付列表显示说明
export default class NonePayList extends Component<Props> {

    render () {
        return (
            <View style={{backgroundColor:'#FFFFFF',alignItems:'center',justifyContent:'center',height:100,flex:1,flexDirection: 'row',width:Dimensions.get('window').width}}>
                <Image source={require('../../../static/img/icon_tanhao.png')} style={{width:13,height:13}} />
                <Text style={{fontSize:13,color:'#8B8B8B',height:15}}>没有可用支付商列表!</Text>
                <View style={{width:10}}></View>
                <Image source={require('../../../static/img/icon_kefu_xiao.png')} style={{width:13,height:13}} />
                <Text style={{fontSize:13,color:'red',height:15}} onPress={this.props.onShowCustomer}>“在线客服” </Text>

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


