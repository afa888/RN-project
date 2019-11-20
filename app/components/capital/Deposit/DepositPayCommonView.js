import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import { ImageBackground,Swiper,FlatList,ScrollView,RefreshControl} from 'react-native';
import TXInput from "../../../tools/TXInput"
import FastImage from 'react-native-fast-image'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import NonePayList from './DepositNonePayListView'
import Tips from './DepositTipsView'
import MainTheme from "../../../utils/AllColor"
import {textTitleColor} from "../../../utils/AllColor"

//常规支付
export default class DepositPayCommonView extends Component<Props> {

    constructor(props){
        super(props);
    }

    //此函数用于为给定的item生成一个不重复的key
  //若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标index。
  _keyExtractor = (item, index) => index;
  _keyTypeExtractor = (item, index) => 100 + index;

  itemClick(item, index) {
    this.props.onChange('money', item);
  }

  _renderItem = ({item, index}) => {
    let selected = this.props.params.money == String(item) ? true : false;
    let bgcolor =  selected ? MainTheme.commonButtonBGColor : MainTheme.commonButton2BGColor;
    let textColor = selected ? MainTheme.commonButtonTitleColor : textTitleColor;
    return (
        <View style={{padding:5}}>
            <View style={{width: Dimensions.get('window').width / 4 -10,
                backgroundColor: bgcolor,justifyContent:'center',
                height: 30}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this.itemClick.bind(this, item, index)}>
                    <View style={{paddingLeft:10,flexDirection:'row',alignItems:'center'
                    }}>

                        <Text style={{paddingLeft:10,color: textColor}}>{String(item)}</Text>
                    </View>

                </TouchableOpacity>
            </View>
        </View>


    );
  }

  _renderTypeItem = ({item, index}) => {

    let choosed = this.props.params.payTypeSelectedIndex == index;
    let bgcolor =  choosed ? MainTheme.commonButtonBGColor : MainTheme.commonButton2BGColor;
    let textColor = choosed ? MainTheme.commonButtonTitleColor : textTitleColor;
    return (
        <View style={{padding:5}}>
            <View style={{width: 60,
                backgroundColor: bgcolor,justifyContent:'center',
                height: 25}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this.handleIndexChange.bind(this, index)}>
                    <View style={{paddingLeft:10,flexDirection:'row',alignItems:'center'
                    }}>
                    <Text style={{color:textColor}}>{String(item)}</Text>
                    </View>

                </TouchableOpacity>
            </View>
        </View>


    );
  }

  handleIndexChange = (index) => {
      this.props.onChange('money', '')
      this.props.onChange('payTypeSelectedIndex', index)
    }

    render () {

        if (this.props.params.currentPayModel.cagentPayerPOList.length == 0) {
            //没有配置支付列表
            return (
                <View style={{flex:1,justifyContent:'center'}}>
                    <NonePayList onShowCustomer={this.props.onShowCustomer} />
                </View>

            );
        }else {

            let selectedItemIndex = this.props.params.payTypeSelectedIndex;
            //支付方式标题
            let titleArr = [];
            if(this.props.params.currentPayModel.cagentPayerPOList.length > 0)
            {
                let count = 1;
                this.props.params.currentPayModel.cagentPayerPOList.map(item => {
                    titleArr.push('支付' + String(count));
                    count++;
                })
            }
            let segWidth = titleArr.length * 60;
            let amountsArr = this.props.params.currentPayModel.cagentPayerPOList[selectedItemIndex].amounts;
            let des = '请输入充值金额';
            let payModel = this.props.params.currentPayModel.cagentPayerPOList[selectedItemIndex];
            if (payModel.hasOwnProperty('minquota') && payModel.hasOwnProperty('maxquota')) {
                des = '单笔限额为'+ payModel.minquota +'~'+ payModel.maxquota +'元';
            }
            return (
                <View style={{flex:1,justifyContent:'center'}}>
                    <View style={{paddingTop:0,height:25,width:Dimensions.get('window').width}}>
                        <Text style={{paddingLeft:10}}>支付渠道</Text>
                    </View>
                    <FlatList
                        style={styles.flatListStyle}
                        data={titleArr}
                        listKey = {'type'}
                        keyExtractor={this._keyTypeExtractor}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                          //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。
                          //如果你的行高是固定的，getItemLayout用起来就既高效又简单.
                          //注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中
                        getItemLayout={(data, index) => ( {length: 44, offset: (44 + 1) * index, index} )}
                        renderItem={this._renderTypeItem}
                    />


                    <View style={{paddingTop:10,height:35,width:Dimensions.get('window').width}}>
                        <Text style={{paddingLeft:10}}>存款金额</Text>
                    </View>
                        <View>
                            {(amountsArr && amountsArr.length > 0) ?
                            <FlatList
                                numColumns={4}
                                style={styles.flatListStyle}
                              data={this.props.params.currentPayModel.cagentPayerPOList[selectedItemIndex].amounts}
                              listKey = {'money'}
                              keyExtractor={this._keyExtractor}
                              //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。
                              //如果你的行高是固定的，getItemLayout用起来就既高效又简单.
                              //注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中
                              getItemLayout={(data, index) => ( {length: 44, offset: (44 + 1) * index, index} )}
                              renderItem={this._renderItem}
                            /> :
                                <View>
                                    <TXInput label="充值金额" keyboardType='numeric'  forbiddenDot={true} placeholder={des} textAlign='right' onChange={(value) => this.props.onChange('money', value)} value={this.props.params.money || ''}/>

                                </View>
                            }
                        </View>
                      
                </View>

            );
        }
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
  }
});


