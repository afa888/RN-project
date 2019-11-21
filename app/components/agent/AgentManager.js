import React, {Component} from 'react';
import {
    StyleSheet, View, Text, ImageBackground, Image,
    TouchableOpacity, ScrollView, SafeAreaView,
    DeviceEventEmitter, Alert
} from "react-native";
import {MainTheme, textTitleColor} from "../../utils/AllColor";
import {getStoreData} from "../../http/AsyncStorage";
import TXToastManager from "../../tools/TXToastManager";
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

    // 充值
    onRechange = () => {
    }

    // 提款
    onDraw = () => {

    }

    // 转账
    onTransfer = () => {
    }

    createAgentBtn() {
        let shortcutOperations = [
            {
                icon: require('../../static/img/agent/administer_icon_yqjl.png'),
                title: '邀请记录',
                handler: this.onRechange,
            },
            {
                icon: require('../../static/img/agent/administer_icon_tdgl.png'),
                title: '团队管理',
                handler: this.onDraw,
            },
            {
                icon: require('../../static/img/agent/administer_icon_yjls.png'),
                title: '佣金流水',
                handler: this.onTransfer,
            },
            {
                icon: require('../../static/img/agent/administer_icon_tkjl.png'),
                title: '提款记录',
                handler: this.onTransfer,
            },
        ];
        return (
            <View style={styles.shortcutContainer}>
                {
                    shortcutOperations.map(item =>
                        <TouchableOpacity style={styles.shortcutItem} onPress={item.handler}>
                            <Image source={item.icon} style={styles.iconBtn}/>
                            <Text style={styles.shortcutTitle}> {item.title} </Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    }

    createQr = () => {
        return (
            <View style={{position: 'relative', top: -30,}}>
                <Text style={styles.cotentTitle}>邀请方式</Text>
                <View style={styles.qrView}>
                    <View style={styles.qrImageView}/>
                    <View style={{
                        height: 120, flex: 1, marginLeft: 6
                    }}>
                        <Text style={styles.tgText}>推广链接：<Text
                            style={{color: MainTheme.DarkGrayColor}}>dfsfsdfsdfdsfsdsdfs</Text></Text>
                        <Text style={styles.tgwaText}>推广链接：<Text
                            style={{color: MainTheme.DarkGrayColor}}>dfsfsdfsdfdsfsdsdfs</Text></Text>
                    </View>
                </View>
                <Text style={styles.cotentTitle}>长安二维码可保存邀请图至相册，点击推广链接或推广文案复制到剪贴板\n</Text>
            </View>)
    }

    render() {
        return (<SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: MainTheme.BackgroundColor}}>

                    <View style={{
                        height: 220,
                        width: DeviceValue.windowWidth,
                        backgroundColor: MainTheme.specialTextColor,
                        alignItems: 'center'
                    }}>
                        <Text style={[styles.agentTitle, {
                            width: DeviceValue.windowWidth,
                            marginLeft: 15,
                            marginTop: 15
                        }]}>欢迎您</Text>
                        <View style={styles.agentTitle}><Text style={[styles.agentTitle, {fontSize: 22}]}>￥234344</Text></View>
                        <Text style={[styles.agentTitle, {margin: 15}]}>未接佣金</Text>
                        <View style={styles.titleView}>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle18]}>白金代理</Text>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle18]}>白金代理</Text>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle18]}>白金代理</Text>
                        </View>
                        <View style={styles.titleView}>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle14]}>白金代理</Text>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle14]}>白金代理</Text>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle14]}>白金代理</Text>
                        </View>
                    </View>
                    {this.createAgentBtn()}
                    {this.createQr()}

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
        backgroundColor: MainTheme.BackgroundColor,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        top: -40,
        position: 'relative',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: MainTheme.DivideLineColor,
    },
    shortcutItem: {
        width: 60,
        alignItems: 'center',
    },
    iconBtn: {
        width: 40,
        height: 40
    },
    shortcutTitle: {
        fontSize: 14,
        color: MainTheme.DarkGrayColor,
    },
    agentTitle: {
        color: MainTheme.commonButtonTitleColor
    },
    titleView: {
        width: DeviceValue.windowWidth - 50,
        height: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    fontSizeTitle18: {
        fontSize: 18
    },
    fontSizeTitle14: {
        fontSize: 14
    },
    cotentTitle: {marginLeft: 12, color: MainTheme.TextTitleColor,marginRight:12},
    qrView: {
        flexDirection: 'row',
        marginRight: 15,
        marginLeft: 15,
        marginTop: 6,
        marginBottom: 6,
        height: 120
    },
    tgText: {
        height: 28,
        borderRadius: 4,
        borderColor: MainTheme.theme_color,
        borderWidth: 0.5,
        justifyContent: 'center',
        padding: 2,
        color: MainTheme.theme_color
    },
    tgwaText: {
        height: 86,
        borderRadius: 4,
        borderColor: MainTheme.theme_color,
        borderWidth: 0.5,
        justifyContent: 'center',
        padding: 2,
        marginTop: 6,
        color: MainTheme.theme_color

    },
    qrImageView: {
        width: 120, height: 120, borderRadius: 4, padding: 1,
        borderColor: MainTheme.theme_color, backgroundColor: 'blue',
        borderWidth: 0.5,
    }
});
