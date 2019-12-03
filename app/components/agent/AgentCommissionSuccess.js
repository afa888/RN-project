import React, {Component} from 'react';
import {
    StyleSheet, View, Text, ImageBackground, Image,
    TouchableOpacity, ScrollView, SafeAreaView,
    DeviceEventEmitter, Alert, Button
} from "react-native";
import {
    MainTheme,
    textTitleColor,
    CircleGoldColor,
    theme_color,
    BarBlueColor,
    AgentRedColor,
    AgentBlueColor,
} from "../../utils/AllColor";
import {getStoreData} from "../../http/AsyncStorage";
import TXToastManager from "../../tools/TXToastManager";
import DeviceValue from "../../utils/DeviceValue";
import {MarqueeHorizontal} from "react-native-marquee-ab";
import {CAGENT} from "../../utils/Config";
import http from "../../http/httpFetch";
import AndroidNativeGameActiviy from "../../customizeview/AndroidIosNativeGameActiviy";

let isJoin = false
export default class AgentCommissionSuccess extends Component<Props> {

    static navigationOptions = ({navigation}) => {

        return {
            headerTitle: (
                MainTheme.renderCommonTitle('提交成功')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: (
                <View/>
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            agentData: {},

        };
    }

    componentDidMount() {
        DeviceEventEmitter.emit('userInfoChanged',{needFresh:true});//通知代理首页数据有变更，需要刷新
    }


    _onShowCustomer = () => {
        this.props.navigation.navigate('CustomerService')
    }

    render() {
        return (<View style={{flex: 1, alignItems: 'center'}}>

                <Image source={require('../../static/img/agent/administer_icon_succes.png')} style={styles.iconBtn}/>

                <View style={styles.itemView}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                        style={styles.touchWitherView}>
                        <Text style={{fontSize: 14, color: theme_color}}>返回首页</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this._onShowCustomer();
                        }}
                        style={styles.touchView}>
                        <Text style={[styles.agentTitle, {fontSize: 14}]}>咨询客服</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    itemView: {
        width: DeviceValue.windowWidth,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 8,
    },


    itemtTileColorText: {
        width: DeviceValue.windowWidth - 30,
        color: MainTheme.GrayColor,
        fontSize: 12,
        height: 60,
        marginTop: 12
    }
    ,

    touchView: {
        alignItems: 'center', marginTop: 30, justifyContent: 'center',
        backgroundColor: theme_color, height: 40, width: DeviceValue.windowWidth / 2 - 40
    },
    touchWitherView: {
        alignItems: 'center',
        marginTop: 30,
        justifyContent: 'center',
        backgroundColor: 'white',
        height: 40,
        width: DeviceValue.windowWidth / 2 - 40,
        borderRadius: 6,
        borderColor: theme_color,
        borderWidth: 0.7
    },
    agentTitle: {
        color: MainTheme.commonButtonTitleColor
    },
    iconBtn: {
        width: DeviceValue.windowWidth - 80,
        height: (DeviceValue.windowWidth - 80) * (705 / 840),
        marginTop: 100
    },
});
