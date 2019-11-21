import React, {Component} from 'react';
import {
    StyleSheet, View, Text, ImageBackground, Image,
    TouchableOpacity, ScrollView, SafeAreaView,
    DeviceEventEmitter, Alert
} from "react-native";
import {MainTheme, textTitleColor} from "../../utils/AllColor";
import DeviceValue from "../../utils/DeviceValue";


export default class AgentManager extends Component<Props> {

    static navigationOptions = {
        headerTitle: <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}> 代理管理</Text></View>,
        headerLeft: (
            <TouchableOpacity onPress={() => {
                navigation.goBack()
            }}>
                <Image source={require('../../static/img/titlebar_back_normal.png')}
                       style={{
                           resizeMode: 'contain',
                           width: 20,
                           height: 20,
                           margin: 12
                       }}/>
            </TouchableOpacity>
        ),
        headerRight: (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                }}>
                <TouchableOpacity style={{width: 28, height: 48, alignItems: 'center'}} onPress={() => {
                    navigation.navigate('CustomerService')
                }}>
                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 40,
                        height: 48,
                        justifyContent: 'center'
                    }}>
                        <Image
                            source={require('../../static/img/agent/nav_icon_guize.png')}
                            style={{
                                resizeMode: 'contain',
                                width: 18,
                                height: 18,
                            }}/>
                        <Text style={{color: textTitleColor, fontSize: 8, marginTop: 2}}>规则介绍</Text>
                    </View>
                </TouchableOpacity>
            </View>
        ),
    };

    constructor(props) {
        super(props);
        this.state = {};
    }


    componentWillUnmount() {
    };
    createShortcuts() {
       /* let shortcutOperations = [
            {
                icon: require('../../static/img/UserCenter/userCenter_recharge.png'),
                title: '充值',
                handler: this.onRechange,
            },
            {
                icon: require('../../static/img/UserCenter/userCenter_draw.png'),
                title: '提款',
                handler: this.onDraw,
            },
            {
                icon: require('../../static/img/UserCenter/userCenter_transfer.png'),
                title: '转账',
                handler: this.onTransfer,
            },
        ];
        return (
            <View style={styles.shortcutContainer}>
                {
                    shortcutOperations.map(item =>
                        <TouchableOpacity style={styles.shortcutItem} onPress={item.handler} >
                            <Image source={item.icon} style={styles.shortcutIcon} />
                            <Text style={styles.shortcutTitle} > {item.title} </Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        );*/
    }

    render() {
        return (<SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: MainTheme.BackgroundColor}}>
                    <View style={{flex:1,flexDirection:'column',alignItems:'center'}}>
                    <View style={{height: 220, width:DeviceValue.windowWidth, backgroundColor: MainTheme.specialTextColor}}>

                    </View>
                    <View style={{height:98,width:DeviceValue.windowWidth-60,backgroundColor:'blue',borderRadius:6,borderColor:MainTheme.LightGrayColor}}>

                    </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    shortcutContainer: {
        marginLeft: 25,
        marginRight: 25,
        width: DeviceValue.windowWidth - 50,
        height: 100,
        bottom: -75,
        backgroundColor: MainTheme.BackgroundColor,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: MainTheme.DivideLineColor,
    },
    shortcutItem: {
        width: 60,
        alignItems: 'center',
    },
});
