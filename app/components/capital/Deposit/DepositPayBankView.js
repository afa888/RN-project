import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import {Swiper,FlatList,ScrollView,RefreshControl} from 'react-native';
import TXInput from "../../../tools/TXInput"
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Tips from './DepositTipsView'
import Picker from 'react-native-picker';
import {specialTextColor} from "../../../utils/AllColor"

var payTypeList = [
    "网银转账", "支付宝", "财付通", "微信", "ATM自动柜员机", "ATM现金入款", "银行柜台"
]
//银行转账
export default class PayBank extends Component<Props> {

    constructor(props){
        super(props);
    }

    _onChange = (label, value) => {
        this.setState({ [label]: value });
    };

    _onChooseBank = ()=> {
        console.log('银行列表');
        Picker.init({
            pickerData: payTypeList,
            pickerConfirmBtnColor:[55,55,55,1],
            pickerCancelBtnColor:[88,88,88,1],
            pickerCancelBtnText:'',
            pickerConfirmBtnText:'确定',
            pickerTitleText:'银行列表',
            onPickerConfirm: data => {
                console.log(data);
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
                this.props.onChange('method',data['0']);
            }
        });
        Picker.show();
    };

    render () {
        return (
        <View style={{paddingTop:0}} >
            <TXInput label="付款方式" placeholder="网银转账" isUpdate={false} showDetail={true} textAlign='right' onClick={this._onChooseBank} value={this.props.params.method || ''}/>
            <View style={{height:10}}></View>
            <TXInput label="付款人姓名" placeholder="请输入真实姓名" textAlign='right' onChange={(value) => this.props.onChange('name', value)} value={this.props.params.name || ''}/>
            <View style={{height:10}}></View>
            <TXInput label="￥" forbiddenDot={true} labelTextStyle={{color:specialTextColor}} keyboardType = 'numeric' placeholder="单笔限额100~2000000(元)" textAlign='right' onChange={(value) => this.props.onChange('money', value)} value={this.props.params.money || ''}/>
            <View style={{paddingTop:20,alignItems: 'center',height:60}}>
                    <TouchableOpacity  onPress={() => this.props.commitRequest()}  activeOpacity={0.2} focusedOpacity={0.5}>
                     <View style=  {{borderRadius:10,borderWidth:1,borderColor:'#CFA359',borderStyle: 'solid',justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 100,height:40,backgroundColor:'#CFA359'}}>

                        <Text style={{color:'#ffffff',fontSize:17}}>下一步</Text>
                     </View>
                </TouchableOpacity>
                </View>
                <Tips onShowCustomer={this.props.onShowCustomer} />

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


