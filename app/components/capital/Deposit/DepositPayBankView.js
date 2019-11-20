import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import {Swiper,FlatList,ScrollView,RefreshControl} from 'react-native';
import TXInput from "../../../tools/TXInput"
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Tips from './DepositTipsView'
import Picker from 'react-native-picker';
import MainTheme from "../../../utils/AllColor"
import {textTitleColor,textThreeHightTitleColor} from "../../../utils/AllColor"

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
        console.log('支付方式');
        Picker.init({
            pickerData: payTypeList,
            pickerConfirmBtnColor:[222,73,56,1],
            pickerCancelBtnColor:[88,88,88,1],
            pickerCancelBtnText:'',
            pickerConfirmBtnText:'确定',
            pickerTitleText:'支付方式',
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

    //是否申请彩金
    handleIndexChange = (applay) => {
      this.props.onChange('handsel', applay)
    }

    render () {
        let payModel = this.props.payModel;
        let des = '单笔限额100~2000000(元)';
        if (payModel && payModel.hasOwnProperty('minquota') && payModel.hasOwnProperty('maxquota')) {
                des = '单笔限额为'+ payModel.minquota +'~'+ payModel.maxquota +'(元)';
            }
        return (
        <View style={{paddingTop:0}} >
            <TXInput label="付款方式" placeholder="网银转账" isUpdate={false} showDetail={true} textAlign='right' onClick={this._onChooseBank} value={this.props.params.method || ''}/>
            <View style={{height:10}}></View>
            <TXInput label="真实姓名" maxLength={10} placeholder="请输入真实姓名" textAlign='right' onChange={(value) => this.props.onChange('name', value)} value={this.props.params.name || ''}/>
            <View style={[styles.inputViewStyle,{flexDirection:'row'}]}>
                <Text style={{paddingTop:10,fontSize:14,color: '#514b46',height:30,width:Dimensions.get('window').width - 120}}>申请彩金</Text>
                <View style={{paddingTop:10,flx:1,flexDirection:'row',justifyContent:'flex-end'}}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this.handleIndexChange.bind(this, 0)}>
                        <View style={{paddingLeft:10,flexDirection:'row',alignItems:'center'
                        }}>

                        {this.props.params.handsel == 0 ? <Image source= {require('../../../static/img/recharge_icon_yes.png')}
                                    style={{height:12,width:12}}
                                /> : <Image source= {require('../../../static/img/recharge_icon_no.png')}
                                    style={{height:12,width:12}}
                        />}

                        <Text style={{paddingLeft:5,color:textThreeHightTitleColor}}>是</Text>
                        </View>

                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this.handleIndexChange.bind(this, 1)}>
                        <View style={{paddingLeft:10,flexDirection:'row',alignItems:'center'
                        }}>

                        {this.props.params.handsel == 1 ? <Image source= {require('../../../static/img/recharge_icon_yes.png')}
                                    style={{height:12,width:12}}
                                /> : <Image source= {require('../../../static/img/recharge_icon_no.png')}
                                    style={{height:12,width:12}}
                        />}

                        <Text style={{paddingLeft:5,color:textThreeHightTitleColor}}>否</Text>
                        </View>

                    </TouchableOpacity>
                </View>
            </View>

            <View style={{height:10}}></View>
            <TXInput label="￥" forbiddenDot={true} labelTextStyle={{color:textTitleColor,fontSize:20}} keyboardType = 'numeric' placeholder={des} textAlign='right' onChange={(value) => this.props.onChange('money', value)} value={this.props.params.money || ''}/>
            <View style={{paddingTop:20,alignItems: 'center',height:60}}>
                    <TouchableOpacity  onPress={() => this.props.commitRequest()}  activeOpacity={0.2} focusedOpacity={0.5}>
                     <View style=  {{borderRadius:10,justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 100,height:40,backgroundColor:MainTheme.commonButtonBGColor}}>

                        <Text style={{color:MainTheme.commonButtonTitleColor,fontSize:17}}>下一步</Text>
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
  },
  inputViewStyle:{
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderColor: '#eae6e4',
            marginVertical: 5,
            borderBottomWidth: 0.5,
            backgroundColor: '#fff'
          }
});


