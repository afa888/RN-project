import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import TXToastManager from "../../../tools/TXToastManager"
import MainTheme from "../../../utils/AllColor"
import {textThreeHightTitleColor} from "../../../utils/AllColor"

//温馨提示
export default class Tips extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <View style={{marginTop:10,paddingLeft:10,flexDirection: 'column',justifyContent:'center',width:Dimensions.get('window').width}}>
                    
                    <Text style={{fontSize:10,color:textThreeHightTitleColor,height:15}}>为确保您的款项及时到账，请您留意以下：</Text>
                    <View style={{flexDirection: 'row',height:15,width:Dimensions.get('window').width}}>
                        <Text style={{fontSize:10,color:textThreeHightTitleColor,height:15}}>1、若您支付遇到困难，可</Text>
                        <Text style={{fontSize:10,color:MainTheme.tipsSpecialTextColor,height:15}} onPress={this.props.onShowHelp}>“点此” </Text>
                        <Text style={{fontSize:10,color:textThreeHightTitleColor,height:15}}>查看存款帮助</Text>
                    </View>
                    <Text style={{fontSize:10,color:textThreeHightTitleColor,height:15}}>2、若您支付过充值遇到问题未完成支付，请重新下单；</Text>
                    <View style={{flexDirection: 'row',height:30,width:Dimensions.get('window').width}}>
                        <Text style={{fontSize:10,color:textThreeHightTitleColor,height:15}}>3、扔有问题无法解决？请联系</Text>
                        <Text style={{fontSize:10,color:MainTheme.tipsSpecialTextColor,height:15}} onPress={this.props.onShowCustomer}>“在线客服” </Text>
                        <Text style={{fontSize:10,color:textThreeHightTitleColor,height:15}}>获得帮助</Text>
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


