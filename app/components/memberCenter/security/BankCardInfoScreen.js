import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import TXInput from "../../../tools/TXInput"
import http from '../../../http/httpFetch'
import { NavigationActions } from 'react-navigation';
import MainTheme from "../../../utils/AllColor"
import {getStoreData,mergeStoreData} from "../../../http/AsyncStorage";

export default class BankCardInfoScreen extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('银行卡')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: (
                <View />
            )
        };
      };

    constructor(props){
        super(props);
        this.state = {bankName:'',bankCard:''};
    }

    _onShowCustomer = () => {
        this.props.navigation.navigate('CustomerService');
    }

    componentDidMount () {
        getStoreData('userInfoState').then((userInfo) => {
            if (userInfo && userInfo.bankList) {
                let bankInfo = userInfo.bankList[0];
                this.setState({bankName:bankInfo.bankName,bankCard:bankInfo.cardNum});
            }
        });
    }


    render() {
        return (
            <View style={{height:Dimensions.get('window').height,alignItems: 'center',backgroundColor:'#efeff4'}}>
               <View style={{width:Dimensions.get('window').width,height:1,backgroundColor:'#B7B7B7'}}></View>
                <View style={{paddingTop:20}}>
                    <View style={{paddingTop:25,width:Dimensions.get('window').width,height:100,backgroundColor:'#fff',borderRadius:10}}>
                        <Text style={{paddingLeft:30,color:'#514b46',fontSize:17,fontWeight:'bold'}}>{this.state.bankName}</Text>
                        <Text style={{paddingTop:10,paddingLeft:30,color:'#514b46',fontSize:17,fontWeight:'bold',height:30}}>{this.state.bankCard}</Text>
                    </View>
                </View>
                <View style={{paddingTop:10,paddingLeft:10,flexDirection: 'row',justifyContent:'center',width:Dimensions.get('window').width}}>
                    <Text style={{fontSize:10,color:'#8B8B8B',height:15}}>温馨提示:如果需修改绑定银行卡信息,请联系 </Text>
                    <Text style={{fontSize:10,color:'red',height:15}} onPress={this._onShowCustomer}>在线客服</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({});
