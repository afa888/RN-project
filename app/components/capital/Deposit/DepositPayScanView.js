import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import { ImageBackground,Swiper,FlatList,ScrollView,RefreshControl} from 'react-native';
import TXInput from "../../../tools/TXInput"
import FastImage from 'react-native-fast-image'
import Picker from 'react-native-picker';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Tips from './DepositTipsView'
import TXToastManager from "../../../tools/TXToastManager"

//扫码
export default class PayScan extends Component<Props> {

    constructor(props){
        super(props);
    }

    handleIndexChange = (index) => {
      this.props.onChange('scanSelectedIndex', index)
    }

    render () {
        var titleArr = [];
        if(this.props.params.currentPayModel.cagentPayerPOList.length > 0)
        {
            this.props.params.currentPayModel.cagentPayerPOList.map(item => {
                titleArr.push(item.paymentName);
            })
        }
        let payModel = this.props.params.currentPayModel.cagentPayerPOList[this.props.params.scanSelectedIndex];
        let des
        if (payModel.hasOwnProperty('minquota')) {//可能后台返回没有这个字段
            des = '单笔限额为'+ payModel.minquota +'~'+ payModel.maxquota +'元';
        }else {
            des = '请输入订单金额';
        }

        var imgUrl = this.props.params.currentPayModel.cagentPayerPOList[this.props.params.scanSelectedIndex].accountimg;
        return (
            <View style={{alignItems:'center'}}>
                <View style={{flexDirection: 'row',height:20,width:Dimensions.get('window').width}}>
                    <Text style={{paddingLeft:10,fontSize:10,color:'#8B8B8B',height:15}}>只能扫描支付哦, 如有疑问请联系</Text>
                    <Text style={{fontSize:10,color:'red',height:15}} onPress={this.props.onShowCustomer}>“在线客服” </Text>

                </View>

                <View style={{paddingTop:10,width:300}}>
                    <SegmentedControlTab
                        values={titleArr}
                        selectedIndex={this.props.params.scanSelectedIndex}
                        onTabPress={this.handleIndexChange}
                        />

                    <View style={{alignItems:'center',paddingTop:20}}>
                        <FastImage
                                    style={{
                                        width: 150,
                                        height: 150,
                                    }}
                                    source={{
                                        uri: imgUrl,
                                    }}
                            />
                    </View>
                </View>

                <View style={{height:10}}>
                </View>
                <TXInput label="充值金额"  forbiddenDot={true} keyboardType = 'numeric' placeholder={des} textAlign='right' onChange={(value) => this.props.onChange('money', value)} value={this.props.params.money || ''}/>
                <View style={{height:10}}>
                </View>
                <TXInput label="订单号" placeholder="请输入订单号后四位" maxLength={4} textAlign='right' onChange={(value) => this.props.onChange('orderNum', value)} value={this.props.params.orderNum || ''}/>
                <View style={{paddingTop:20,alignItems: 'center',height:60}}>
                        <TouchableOpacity  onPress={() => this.props.commitRequest()}  activeOpacity={0.2} focusedOpacity={0.5}>
                         <View style=  {{borderRadius:10,borderWidth:1,borderColor:'#CFA359',borderStyle: 'solid',justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 100,height:40,backgroundColor:'#CFA359'}}>

                            <Text style={{color:'#ffffff',fontSize:17}}>下一步</Text>
                         </View>
                    </TouchableOpacity>
                    </View>
                <Tips onShowCustomer={this.props.onShowCustomer}/>
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


