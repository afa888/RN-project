import React, { Component } from 'react';
import {
    StyleSheet, View, Text, ImageBackground, Image,
    TouchableOpacity, ScrollView, SafeAreaView,
    DeviceEventEmitter, Alert
} from "react-native";
import {MainTheme, textTitleColor, CircleGoldColor, theme_color, BarBlueColor} from "../../utils/AllColor";
import {getStoreData} from "../../http/AsyncStorage";
import TXToastManager from "../../tools/TXToastManager";
import DeviceValue from "../../utils/DeviceValue";
import QRCode from 'react-native-qrcode';
import {Rect, Polygon, Circle, Ellipse, Radar, Pie, Line, Bar, Scatter, Funnel} from 'react-native-tcharts'

export default class AgentManager extends Component<Props> {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: <View
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}> 代理管理</Text></View>,
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
                        }} />
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
                    <TouchableOpacity style={{ width: 28, height: 48, alignItems: 'center' }} onPress={() => {
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
                                }} />
                            <Text style={{ color: textTitleColor, fontSize: 8, marginTop: 2 }}>规则介绍</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {};
    }


    componentWillUnmount() {
    };

    // 邀请记录
    onInviteRecord = () => {
        this.props.navigation.navigate("AgentInviteRecorder");
    }

    // 团队管理
    onTeamManage = () => {

    }

    // 佣金流水
    onRewardFlow = () => {
        this.props.navigation.navigate("AgentRewardRecorder");
    }

    // 提款记录
    onDrawRecord = () => {
        this.props.navigation.navigate("AgentWithdrawalRecorder");
    }

    createAgentBtn() {
        let shortcutOperations = [
            {
                icon: require('../../static/img/agent/administer_icon_yqjl.png'),
                title: '邀请记录',
                handler: this.onInviteRecord,
            },
            {
                icon: require('../../static/img/agent/administer_icon_tdgl.png'),
                title: '团队管理',
                handler: this.onTeamManage,
            },
            {
                icon: require('../../static/img/agent/administer_icon_yjls.png'),
                title: '佣金流水',
                handler: this.onRewardFlow,
            },
            {
                icon: require('../../static/img/agent/administer_icon_tkjl.png'),
                title: '提款记录',
                handler: this.onDrawRecord,
            },
        ];
        return (
            <View style={styles.shortcutContainer}>
                {
                    shortcutOperations.map(item =>
                        <TouchableOpacity style={styles.shortcutItem} onPress={item.handler}>
                            <Image source={item.icon} style={styles.iconBtn} />
                            <Text style={styles.shortcutTitle}> {item.title} </Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    }

    createQr = () => {
        return (
            <View style={{ position: 'relative', top: -30, }}>
                <Text style={styles.cotentTitle}>邀请方式</Text>
                <View style={styles.qrView}>
                    <View style={styles.qrImageView}>
                        <QRCode
                            value={'https://www.twblogs.net/a/5b88ad4d2b71775d1cddbe19/zh-cn'}
                            size={115}
                            bgColor="white"
                            fgColor="black"/>
                    </View>

                    <View style={{
                        height: 120, flex: 1, marginLeft: 6
                    }}>
                        <Text style={styles.tgText}>推广链接：<Text
                            style={{color: MainTheme.DarkGrayColor}}>dfsfsdfsdfdsfsdsdfs</Text></Text>
                        <Text style={styles.tgwaText}>推广文案：<Text
                            style={{color: MainTheme.DarkGrayColor}}>dfsfsdfsdfdsfsdsdfs</Text></Text>

                    </View>
                </View>
                <Text style={[styles.cotentTitle, {height: 40}]}>长安二维码可保存邀请图至相册，点击推广链接或推广文案复制到剪贴板</Text>
            </View>)
    }

    createPie = () => {
        let option = {
            title: {},
            legend: {},
            color: [MainTheme.specialTextColor, CircleGoldColor], //饼图颜色
            series: [{
                name: '',
                type: 'pie',
                radius: [40, 80], //饼图半径暂支持数字
                data: [10, 20], //饼图占用数据
            }]
        }
        return (<View>

            <View style={{
                backgroundColor: 'white',
                height: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 15,
                paddingRight: 15
            }}>
                <Text style={{marginLeft: 5, color: textTitleColor}}>团队组成</Text>

                <TouchableOpacity onPress={() => {
                    // this.props.goMoreGame('navigate')
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: MainTheme.DarkGrayColor, fontSize: 10}}>详情</Text>
                        <Image source={require('../../static/img/arrow_more.png')}
                               style={{
                                   resizeMode: 'contain',
                                   width: 12,
                                   height: 12,
                                   marginLeft: 6
                               }}/>
                    </View>
                </TouchableOpacity>
            </View>
            <Pie
                option={option}
                height={160}
                width={200}
            />
        </View>)
    }

    createBar = () => {
        const option = {
            title: {
                text: 'ECharts demo'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };;
        return (<View>

            <View style={{
                backgroundColor: 'white',
                height: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 15,
                paddingRight: 15
            }}>
                <Text style={{marginLeft: 5, color: textTitleColor}}>团队组成</Text>

                <TouchableOpacity onPress={() => {
                    // this.props.goMoreGame('navigate')
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: MainTheme.DarkGrayColor, fontSize: 10}}>详情</Text>
                        <Image source={require('../../static/img/arrow_more.png')}
                               style={{
                                   resizeMode: 'contain',
                                   width: 12,
                                   height: 12,
                                   marginLeft: 6
                               }}/>
                    </View>
                </TouchableOpacity>
            </View>

        </View>)
    }

    render() {

        return (<SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: MainTheme.BackgroundColor}}>
                    <ImageBackground source={require('../../static/img/agent/dlgl_bg.png')}
                                     resizeMode='cover' style={styles.bgImagbg}>
                        <Text style={[styles.agentTitle, styles.welcomTitle]}>欢迎您</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}><Text
                            style={[styles.agentTitle, {fontSize: 22, marginLeft: 40}]}>￥234344</Text><TouchableOpacity
                            style={[styles.agentTitle, styles.takeMonyView]}><Text
                            style={[styles.agentTitle, {fontSize: 10}]}>提取佣金</Text></TouchableOpacity></View>
                        <Text style={[styles.agentTitle, {margin: 8}]}>未结佣金</Text>
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
                    </ImageBackground>
                    {this.createAgentBtn()}
                    {this.createQr()}
                    <View style={{
                        width: DeviceValue.windowWidth,
                        height: 1000,
                        backgroundColor: MainTheme.BackgroundColor
                    }}>
                        {this.createPie()}
                        {this.createBar()}
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
        height: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 3
    },
    fontSizeTitle18: {
        fontSize: 18
    },
    fontSizeTitle14: {
        fontSize: 14
    },

    cotentTitle: {marginLeft: 12, color: MainTheme.TextTitleColor, marginRight: 12},

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
        borderColor: MainTheme.theme_color,
        borderWidth: 0.5, alignItems: 'center', justifyContent: 'center'
    }
    ,
    bgImagbg: {
        height: 200,
        width: DeviceValue.windowWidth,
        backgroundColor: MainTheme.specialTextColor,
        alignItems: 'center',
    },
    welcomTitle: {
        width: DeviceValue.windowWidth,
        marginLeft: 15,
        marginTop: 10,
        fontSize: 8
    },
    takeMonyView: {
        borderColor: 'white',
        borderWidth: 0.8,
        borderRadius: 15,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 6,
        paddingLeft: 6,
        marginLeft: 3,
    }
});
