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
import QRCode from 'react-native-qrcode';
import {Rect, Polygon, Circle, Ellipse, Radar, Pie, Line, Bar, Scatter, Funnel} from 'react-native-tcharts'
import {MarqueeHorizontal} from "react-native-marquee-ab";
import {CAGENT} from "../../utils/Config";
import http from "../../http/httpFetch";

export default class AgenJoinBefore extends Component<Props> {

    static navigationOptions = ({navigation}) => {
        return {
            header: null
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            noticeData: []
            , agentData: {},
        };
    }

    componentWillMount(): void {
        this.postNotice()
        this.getAgentData()

    }

    getAgentData = () => {
        http.get('agency/getAgentData', null).then((res) => {
            if (res.status === 10000) {
                if (res.data !== null && res.data !== {})
                    this.setState({agentData: res.data})
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
                this.setState({noticeData: imgUrl})

            }
        }).catch(err => {
            console.error(err)
        });
    }


    render() {

        return (<SafeAreaView style={{flex: 1}}>
                <ScrollView style={{flex: 1, backgroundColor: MainTheme.BackgroundColor}}>
                    <ImageBackground source={require('../../static/img/agent/wxdl_banner.png')}
                                     resizeMode='cover' style={styles.bgImagbg}>
                        <View style={styles.noticeView}>
                            <Image source={require('../../static/img/agent/wxdl_icon_gg.png')}
                                   style={{
                                       resizeMode: 'contain',
                                       width: 16,
                                       height: 16,
                                       marginLeft: 6,
                                   }}/>
                            {this.state.noticeData.length > 0 && <MarqueeHorizontal
                                textList={this.state.noticeData}
                                speed={60}
                                width={DeviceValue.windowWidth - 30 - 40}
                                height={25}
                                direction={'left'}
                                reverse={false}
                                bgContainerStyle={{backgroundColor: 'transparent'}}
                                textStyle={{fontSize: 12, marginLeft: 12, color: textTitleColor}}
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

                    <ImageBackground source={require('../../static/img/agent/wxdlbg.webp')}
                                     resizeMode='cover' style={styles.bgImg}>
                        <TouchableOpacity onPress={this.componentWillUnmount()}>
                            <View style={{
                                width: 180,
                                height: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: AgentBlueColor,
                                marginTop: DeviceValue.windowWidth * (3023 / 1125) * (1 / 9)
                            }}>

                                <Text style={{color: MainTheme.commonButtonTitleColor}}>立即加入</Text>
                            </View>
                        </TouchableOpacity>

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
    agentTextView16: {color: AgentRedColor, fontSize: 16, fontWeight: 'bold',marginRight: 2},
    agentTextView10: {color: AgentRedColor, fontSize: 10, fontWeight: 'bold',}
});
