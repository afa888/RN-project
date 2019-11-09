import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import {NativeModules} from 'react-native';
import { NavigationActions,StackActions } from 'react-navigation';
import MainTheme from "../../../utils/AllColor"


export default class AddBankCardScreen extends Component<Props> {
    static navigationOptions = {
        
    };

    static navigationOptions = ({ navigation }) => {

        return {
            title: '添加银行卡',
            headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
            headerBackTitle:null,
            headerLeft: (
                <TouchableOpacity onPress={() => {
                        navigation.dispatch(NavigationActions.back());
                    }}>
                        <Image source={require('../../../static/img/titlebar_back_normal.png')}
                               style={{
                                   resizeMode: 'contain',
                                   width: 20,
                                   height: 20,
                                   margin: 12
                               }}/>
                    </TouchableOpacity>
            ),
        };
      };

    _onAddNewBankCard = () => {

        this.props.navigation.replace('NewBankCardScreen');
    }

    render() {
        return (
            <View style={{paddingTop:50,alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity  onPress={this._onAddNewBankCard}  activeOpacity={0.2} focusedOpacity={0.5}>
                     <View style=  {{borderRadius:10,borderWidth:1,borderColor:MainTheme.commonButtonBGColor,borderStyle: 'solid',justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 20,height:180,backgroundColor:MainTheme.backgroundViewColor}}>
                        <Image
                            source={require('../../../static/img/icon_mBank.png')}
                            style={{
                                           width: 60,
                                           height: 60,
                                       }}
                        />
                        <Text style={{color:MainTheme.commonButtonBGColor,paddingTop:10}}>点击此处新增银行卡</Text>
                     </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header_img: {
        flex: 1,
        resizeMode:'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
});
