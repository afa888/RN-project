import React, {Component} from 'react';
import {
    View, Text,
    Image, TouchableOpacity, ScrollView,
    ImageBackground, FlatList, DeviceEventEmitter
} from "react-native";
import FastImage from "react-native-fast-image";
import {theme_color} from "../../utils/AllColor";
import DeviceValue from "../../utils/DeviceValue";
import http from "../../http/httpFetch";
import TXToastManager from "../../tools/TXToastManager";
import {mergeStoreData} from "../../http/AsyncStorage";

export default class AssetDetailScreen extends Component<Props>{
    static navigationOptions = ({navigation}) => {
        return {
            title: '资产明细',
            headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
            headerLeft: (
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image source={require('../../static/img/titlebar_back_normal.png')}
                           style={{
                               resizeMode: 'contain',
                               width: 20,
                               height: 20,
                               margin: 12
                           }}/>
                </TouchableOpacity>
            )
        }
    };

    constructor(props){
        super(props);
        this.state = {
            totalBalance: '0.00',
            assetList:[]
        }
    }

    componentDidMount(){
        // 获取列表信息
        this.getGameList();
    }

    /**
     * 获取列表信息
     */
    getGameList() {
        http.get('transfer/transferGameList', null, true).then(res => {
            if(res.status === 10000){
                const { totalBalance, wallet, list } = res.data;
                let listItem = [{
                    balance: wallet,
                    platCode: 0,
                    platImg: require('../../static/img/ic_launcher.png'),
                    platName: '钱包余额',
                    status: 1
                }, ...list];
                this.setState({
                    totalBalance: totalBalance,
                    assetList: listItem
                })
            }
        })
    }

    /**
     * 一键回收
     */
    receiveAll(){
        http.post('transfer/oneclickrecycling',null,true).then(res => {
            if(res.status === 10000){
                const { wallet, detail } = res.data;
                let list = this.state.assetList;
                // 更新中心钱包数据
                list[0].balance = wallet;
                // 更新其他回收数据
                list.forEach( item1 => {
                    detail.forEach( item2 => {
                        if(item1.platCode === item2.platCode) {
                            item1.balance = 0;
                        }
                    })
                });
                this.setState({ assetList: list });
                // 更新本地缓存
                mergeStoreData('userInfoState',
                    { balance: wallet }).then(() => {
                    DeviceEventEmitter.emit('bindSuccess','更新钱包余额');
                });
            }
            TXToastManager.show(res.msg);
        })
    }

    /**
     * list
     * @param item
     * @param index
     * @return {*}
     */
    assetItem = ({item, index}) => {
      return(
          <View style={[{flex:1,flexDirection: 'row', justifyContent: 'space-between',
              alignItems: 'center', height:60, paddingHorizontal:10, borderBottomWidth: 1,
              borderBottomColor: '#c8c7cc'},{backgroundColor: (item.status === 0 ? '#dcdcdc' : '#fff')}]}>
              <View style={{flexDirection: 'row',alignItems: 'center'}}>
                  <FastImage
                      style={{width: 40, height:40}}
                      source={
                          item.platCode === 0 ?
                          item.platImg :
                          { uri: 'http:' + item.platImg,
                          priority: FastImage.priority.normal }
                      }
                      resizeMode={FastImage.resizeMode.cover}
                  />
                  <Text style={{marginLeft:10}}>{item.platName}</Text>
              </View>
              <Text>{this.filterMoney(item.balance)}</Text>
          </View>
      )};

    /**
     * 金额数据请精确到小数位两位
     * @param num
     */
    filterMoney = (num) => {
        if(isNaN(num)) {
            return num
        } else {
            return ((parseFloat(num) * 100) / 100).toFixed(2);
        }
    };

    render() {
        return(
            <View style={{flex:1}}>
                <ScrollView style={{flex: 1, backgroundColor: '#efeff4'}}>
                    <ImageBackground style={{ flex:1,height: 160,
                        justifyContent:'center', alignItems:'center' }}
                                     source={require('../../static/img/centertop_bg.png')}
                                     resizeMode='cover'>
                        <Text style={{fontSize: 22, fontWeight: 'bold', lineHeight: 44, color: '#fff'}}>
                            {this.filterMoney(this.state.totalBalance)}
                        </Text>
                        <Text style={{fontSize: 16, color: '#fff'}}>总资产(元)</Text>
                    </ImageBackground>
                    <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10}}>
                        <Text>资金明细</Text>
                        <TouchableOpacity onPress={ () => { this.receiveAll() }}>
                            <Text style={{paddingVertical:14, color: theme_color}}>一键回收</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={this.state.assetList}
                        extraData={this.state}
                        keyExtractor={item => item.platCode}
                        enableEmptySections={true}//数据可以为空
                        renderItem={this.assetItem}
                    />
                </ScrollView>

                <View style={{height: 60, flexDirection:'row', justifyContent:'space-around',alignItems:'center'}}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('WithdrawalScreen')}
                        style={{ width: (DeviceValue.windowWidth - 50) / 2, height: 40, alignItems: 'center',
                            justifyContent: 'center', borderRadius: 3, borderWidth: 1, borderColor: theme_color
                        }}>
                        <Text style={{color: theme_color, fontSize:18, fontWeight:'bold'}}>取 款</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('DepositManagerScreen',{isNotFromHome:true})}
                        style={{
                            width: (DeviceValue.windowWidth - 50) / 2, height: 40, backgroundColor: theme_color,
                            alignItems: 'center', justifyContent: 'center', borderRadius: 3
                        }}>
                        <Text style={{color: 'white', fontSize:18, fontWeight:'bold'}}>存 款</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}
