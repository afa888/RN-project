import React, { Component } from 'react';
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
import { getStoreData, UserSession } from "../../http/AsyncStorage";
import TXToastManager from "../../tools/TXToastManager";
import DeviceValue from "../../utils/DeviceValue";
import QRCode from 'react-native-qrcode';
import { Rect, Polygon, Circle, Ellipse, Radar, Pie, Line, Bar, Scatter, Funnel } from 'react-native-tcharts'
import { MarqueeHorizontal } from "react-native-marquee-ab";
import { CAGENT,WEBNUM } from "../../utils/Config";
import http from "../../http/httpFetch";
import TXProgressHUB from "../../tools/TXProgressHUB";
import FastImage from 'react-native-fast-image'

export default class AgenJoinBefore extends Component<Props> {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        let isJoin = false;
        if (params !== undefined) {
            isJoin = params.isJoin == undefined ? false : params.isJoin;
        }
        return {
            headerTitle: <View
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{
                    fontSize: 18,
                    color: 'black',
                    fontWeight: 'bold'
                }}>{isJoin ? '代理规则' : '代理招募'} </Text></View>,
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
            headerRight: <View />
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            noticeData: []
            , agentData: {},
            isJoin: false,
            appLevelImagles:'',
            commissionJson:{},
        };
    }

    componentWillMount(): void {
        this.postNotice()
        this.getAgentData()
        this.agentImageData()
    }

    componentDidMount() {
        let { navigation } = this.props;
        let isJoined = navigation.getParam('isJoin', false);

        this.setState({ isJoin: isJoined });
        this.props.navigation.setParams({ isJoin: isJoined });
    }

    jionAgent = () => {
        http.post('agency/joinAgencyUser', null, true).then((res) => {
            if (res.status === 10000) {
                console.log(res)
                this.props.navigation.goBack();
                this.props.navigation.navigate('AgentManager');
            }
        }).catch(err => {
            console.error(err)
        });

    }

    getAgentData = () => {
        http.get('agency/getAgentData', null).then((res) => {
            if (res.status === 10000) {
                    this.setState({ agentData: res.data });
            }
        }).catch(err => {
            console.error(err)
        });
    }
    postNotice = () => {
        http.get('agency/commissionRecordCarousel', null).then((res) => {
            if (res.status === 10000) {
                console.log(res)
                let imgUrl = []
                if (res.data.length > 0) {
                    let index = 0
                    for (var i = 0; i < res.data.length; i++) {
                        index++
                        imgUrl.push({
                            label: index,
                            value: res.data[i].username + "提取佣金" + res.data[i].amount + "元"
                        })
                    }
                }
                console.log("jjjjjjjj")
                console.log(imgUrl)
                this.setState({ noticeData: imgUrl })

            }
        }).catch(err => {
            console.error(err)
        });
    }

    agentImageData = () => {
        let params = {terminal: DeviceValue.terminal,
            cagent: CAGENT,
            src: WEBNUM }
        http.get('agency/noLoginGetCopyPictures', params).then((res) => {
            if (res.status === 10000) {
                this.setState({ appLevelImagles: res.data.appLevelImagles,commissionJson:JSON.parse(res.data.commissionJson) })

            }
        }).catch(err => {
            console.error(err)
        });
    }

    reanderActionButton() {
        const { isJoin,appLevelImagles,commissionJson } = this.state;
        let btnTitle = isJoin ? "我的代理" : "立即加入";

        let days;
        let money;
        if (commissionJson && Object.keys(commissionJson).length > 0) {
            days = commissionJson.minCycle + '天';
            money = commissionJson.minAmount + '元';
        }else {
            days = '30天';
            money = '1000元'
        }
        return (
            <View style={{marginTop: DeviceValue.windowWidth * (3023 / 1125) * (1 / 9),justifyContent: 'center',
                    alignItems: 'center',}}>
            <TouchableOpacity onPress={this.onActionButtonPressed}>
                <View style={{
                    width: 180,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: AgentBlueColor,
                    
                }}>
                    <Text style={{ color: MainTheme.commonButtonTitleColor }}>{btnTitle}</Text>
                </View>
            </TouchableOpacity>

            <FastImage
                    style={{
                        width: DeviceValue.windowWidth - 50,
                        height: 42,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 90
                    }}
                    source={{
                        uri: appLevelImagles.startsWith('//') ? "http:" + appLevelImagles : appLevelImagles,
                        priority: FastImage.priority.normal,

                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />

            <View style={{paddingLeft:25,paddingRight:20,marginTop:610}}>
                <Text style={{color:'white',fontSize:10,lineHeight:14}}>1. 提取方式：可绑定银行卡，在满足提取条件后，直接从官网或APP个人中心未结佣金位置发起提取申请，也可以联系客服，通过线下转账方式申请提取；{'\n'}2. 提取周期：<Text style={{color:'#FDF678'}}>{days}</Text>，即从上次提取完成开始，至少需要超过<Text style={{color:'#FDF678'}}>{days}</Text>，才可以发起下次提取；{'\n'}3. 最小提佣金额：<Text style={{color:'#FDF678'}}>{money}</Text>，即本次未结佣金提取金额需大于<Text style={{color:'#FDF678'}}>{money}</Text>，才能发起提取，若小于该金额，请等待佣金累积至该金额后再次申请提取；{'\n'}4. 如有任何疑问，请咨询客服；{'\n'}5.本活动最终解释权归天下网络所有。</Text>
            </View>
            </View>
            
        );
    }

    onActionButtonPressed = () => {
        const { isJoin } = this.state;
        if (isJoin) { // 代理管理
            if (UserSession.agencyStatus == 0) {
                this.props.navigation.navigate('AgentManager');
            }
            else if (UserSession.agencyStatus == 1) {
                TXProgressHUB.show("您的代理资格已被停用！");
            }
        }
        else {
            this.jionAgent();
        }
    }

    render() {

        return (<SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, backgroundColor: MainTheme.BackgroundColor }}>
                <ImageBackground source={require('../../static/img/agent/wxdl_banner.png')}
                    resizeMode='cover' style={styles.bgImagbg}>
                    <View style={styles.noticeView}>
                        <Image source={require('../../static/img/agent/wxdl_icon_gg.png')}
                            style={{
                                resizeMode: 'contain',
                                width: 16,
                                height: 16,
                                marginLeft: 6,
                            }} />
                        {this.state.noticeData.length > 0 && <MarqueeHorizontal
                            textList={this.state.noticeData}
                            speed={60}
                            width={DeviceValue.windowWidth - 30 - 40}
                            height={25}
                            direction={'left'}
                            reverse={false}
                            bgContainerStyle={{ backgroundColor: 'transparent' }}
                            textStyle={{ fontSize: 12, marginLeft: 12, color: textTitleColor }}
                            onTextClick={(item) => {
                                alert('' + JSON.stringify(item));
                            }}
                        />}
                    </View>
                    <View style={styles.agentView}>
                        <View style={styles.agentItemView}>
                            <Text style={styles.agentTextView16}>{this.state.agentData.yesterdayAgent}
                                <Text style={styles.agentTextView10}>人</Text>
                            </Text>
                            <Text style={styles.agentTextView10}>昨日新增代理</Text>
                        </View>
                        <View style={styles.agentItemView}>
                            <Text style={styles.agentTextView16}>{this.state.agentData.totalOfCommission} <Text
                                style={styles.agentTextView10}>笔</Text></Text>
                            <Text style={styles.agentTextView10}>累积提拥笔数</Text>
                        </View>
                        <View style={styles.agentItemView}>
                            <Text style={styles.agentTextView16}> {this.state.agentData.totalAgent}<Text
                                style={styles.agentTextView10}>人</Text></Text>
                            <Text style={styles.agentTextView10}>总共服务代理</Text>
                        </View>


                    </View>
                </ImageBackground>

                <ImageBackground source={require('../../static/img/agent/wxdlbg.jpg')}
                    resizeMode='cover' style={styles.bgImg}>
                    {this.reanderActionButton()}
                </ImageBackground>

            </ScrollView>
        </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    bgImagbg: {
        width: DeviceValue.windowWidth,
        height: DeviceValue.windowWidth * (705 / 1125),


    },
    bgImg: {
        width: DeviceValue.windowWidth,
        height: DeviceValue.windowWidth * (3023 / 1125),
        alignItems: 'center'
    },
    noticeView: {
        backgroundColor: 'rgba(178,178,178,0.5)',
        height: 25,
        flexDirection: 'row',
        alignItems: 'center',
        width: DeviceValue.windowWidth,
        paddingLeft: 18,
        paddingRight: 18
    },
    agentView: {
        marginLeft: 18,
        marginRight: 18,
        // backgroundColor:'red',
        width: DeviceValue.windowWidth - 50,
        height: DeviceValue.windowWidth * (705 / 1125) * (2 / 6),
        marginTop: DeviceValue.windowWidth * (705 / 1125) * (4 / 7),
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    agentItemView: {
        width: (DeviceValue.windowWidth - 50) * (1 / 3),
        flex: 1,
        alignItems: 'center',
        // backgroundColor:'blue'
    },
    agentTextView16: { color: AgentRedColor, fontSize: 16, fontWeight: 'bold', marginRight: 2 },
    agentTextView10: { color: AgentRedColor, fontSize: 10, fontWeight: 'bold', }
});
