import React, {Component} from 'react';
import DeviceValue from "../../../utils/DeviceValue";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
export default class MidBalanceShow extends Component<Props> {
    constructor(props){
        super(props)
    }

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

    render(){
        const { wallet, totalBalance, router } = this.props;
        return(
            <View style={{
                width: DeviceValue.windowWidth -12,
                height:100,
                marginLeft: 6,
                backgroundColor:'#fff',
                position:'absolute',
                bottom:-50,
                borderRadius:50,
                flexDirection:'row',
                alignItems:'center',
            }}>
                <View style={{flex:1,alignItems:'center',borderRightColor:'#cda469',borderRightWidth:1}}>
                    <Text style={styles.balanceText}>￥ {this.filterMoney(wallet)}</Text>
                    <Text>钱包余额(元)</Text>
                </View>
                <TouchableOpacity style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center'}}
                                  onPress={() => {router.navigate('AssetDetailScreen')}}>
                    <View style={{alignItems:'center'}}>
                        <Text style={styles.balanceText}>￥ {this.filterMoney(totalBalance)}</Text>
                        <Text>总资产(元)</Text>
                    </View>
                    <Image source={require('../../../static/img/arrow_more.png')}
                           style={{
                               resizeMode: 'contain',
                               width: 20,
                               height: 20,
                               marginLeft: 20
                           }}/>
            </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    balanceText:{
        fontWeight: 'bold',
        color: '#cda469',
        fontSize:18
    }
});
