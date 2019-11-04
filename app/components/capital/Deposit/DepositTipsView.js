import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import TXToastManager from "../../../tools/TXToastManager"

//温馨提示
export default class Tips extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <View style={{paddingTop:20,paddingLeft:10,flexDirection: 'column',justifyContent:'center',width:Dimensions.get('window').width}}>
                    <Text style={{fontSize:12,color:'#D62F27',height:18}}>温馨提示</Text>
                    <Text style={{fontSize:10,color:'#8B8B8B',height:15}}>为确保您的款项及时到账，请您留意以下内容</Text>
                    <Text style={{fontSize:10,color:'#8B8B8B',height:15}}>1.在输入您的存款金额时确保您提交的金额在限额范围之内</Text>
                    <View style={{flexDirection: 'row',height:50,width:Dimensions.get('window').width}}>
                        <Text style={{fontSize:10,color:'#8B8B8B',height:15}}>2.支付遇到困难，点击</Text>
                        <Text style={{fontSize:10,color:'red',height:15}} onPress={this.props.onShowCustomer}>“联系客服” </Text>
                        <Text style={{fontSize:10,color:'#8B8B8B',height:15}}>人员获得帮助</Text>
                    </View>
                    <View style={{height:20,backgroundColor:'#efeff4'}}></View>
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


