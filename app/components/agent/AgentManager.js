import React, {Component} from 'react';
import {
    StyleSheet, View, Text, ImageBackground, Image,
    TouchableOpacity, ScrollView, SafeAreaView, Clipboard,
    DeviceEventEmitter, Alert
} from "react-native";
import {
    MainTheme,
    textTitleColor,
    CircleGoldColor,
    theme_color,
    BarBlueColor,
    BarGreenColor,
} from "../../utils/AllColor";
import {getStoreData, LoginStateKey, UserNameKey, UserPwdKey} from "../../http/AsyncStorage";
import TXToastManager from "../../tools/TXToastManager";
import DeviceValue from "../../utils/DeviceValue";
import QRCode from 'react-native-qrcode';
import {Pie} from 'react-native-tcharts'
import http from "../../http/httpFetch";
import RedBagDialog from "../../customizeview/RedBagDialog";
import Modal from 'react-native-modalbox';
import AsyncStorage from "@react-native-community/async-storage";
import {PieChart, BarChart, Grid, XAxis} from 'react-native-svg-charts'


let userName = ''
export default class AgentManager extends Component<Props> {

    static navigationOptions = ({navigation}) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('代理管理')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
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
                        // navigation.navigate('AgenJoinBefore', {isJoin: false, isMe: false})
                        navigation.navigate('AgenJoinBefore', {isJoin: true, isMe: true});
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
    };

    constructor(props) {
        super(props);
        this.state = {
            agentData: {},
            inviteData: {},
            pieData: {},
            barData: [],
            isRedBagVisible: false,
            outstandingCommissions: 0.00,

        };
    }


    componentWillMount(): void {
        AsyncStorage.multiGet([UserNameKey, UserPwdKey])
            .then((results) => {
                console.log('用户信息');
                console.log(results)
                userName = results[0][1]

            }).catch(() => {
            console.error("Load account info error.");
        });
        this.getSelfAgentData();
        this.getInviteMethod();
        this.getTeamCompositionChart();
        this.getRecentCommissionChart();
    }






    //http://192.168.107.144:400/JJF/agency/getSelfAgentData
    getSelfAgentData = () => {
        http.post('agency/getSelfAgentData', null, true).then((res) => {
            if (res.status === 10000) {
                console.log(res)
                if (res.data !== {} || res.data !== null) {
                    this.setState({agentData: res.data, outstandingCommissions: res.data.outstandingCommissions})
                }

            }
        }).catch(err => {
            console.error(err)
        });

    }

    getTeamCompositionChart = () => {
        http.post('agency/getTeamCompositionChart', null, true).then((res) => {
            if (res.status === 10000) {
                console.log(res)
                if (res.data !== {} || res.data !== null) {
                    this.setState({pieData: res.data})
                }

            }
        }).catch(err => {
            console.error(err)
        });

    }
    //柱状图数据
    getRecentCommissionChart = () => {
        http.post('agency/getRecentCommissionChart', null, true).then((res) => {
            if (res.status === 10000) {
                console.log("柱状图数据")
                console.log(res)
                if (res.data !== [] || res.data !== null) {
                    this.setState({barData: res.data})
                }

            }
        }).catch(err => {
            console.error(err)
        });

    }

    getInviteMethod = () => {
        http.post('agency/getInviteMethod', null, true).then((res) => {
            if (res.status === 10000) {
                console.log(res)
                if (res.data !== {} || res.data !== null) {
                    this.setState({inviteData: res.data})
                }

            }
        }).catch(err => {
            console.error(err)
        });

    }

    async copyText(text) {
        Clipboard.setString(text);
        let str = await Clipboard.getString()
        TXToastManager.show('复制成功');
        // console.log(str)//我是文本
    }

    // 邀请记录
    onInviteRecord = () => {
        this.props.navigation.navigate("AgentInviteRecorder");
    }

    // 团队管理
    onTeamManage = () => {
        this.props.navigation.navigate('TeamManagerScreen');
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
                            <Image source={item.icon} style={styles.iconBtn}/>
                            <Text style={styles.shortcutTitle}> {item.title} </Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    }

    createQr = () => {
        let {inviteLink, agencyShare} = this.state.inviteData
        console.log('输出邀请')
        return (
            <View style={{position: 'relative', top: -30,}}>
                <Text style={styles.cotentTitle}>邀请方式</Text>
                <View style={styles.qrView}>
                    <View style={styles.qrImageView}>
                        {<QRCode
                            value={inviteLink}
                            size={115}
                            bgColor="white"
                            fgColor="black"/>}
                    </View>

                    <View style={{
                        height: 120, flex: 1, marginLeft: 6
                    }}>
                        <TouchableOpacity onPress={() => {
                            this.copyText(inviteLink)
                        }}>
                            <Text numberOfLines={1} style={styles.tgText}>推广链接：<Text numberOfLines={1}
                                                                                     style={{color: MainTheme.DarkGrayColor}}>{inviteLink}</Text></Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.copyText(agencyShare)
                        }}>
                            <Text style={styles.tgwaText}>推广文案：<Text
                                style={{color: MainTheme.DarkGrayColor}}>{agencyShare}</Text></Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <Text
                    style={[styles.textGray, {marginLeft: 15, marginRight: 15}]}>长按二维码可保存邀请图至相册，点击推广链接或推广文案复制到剪贴板</Text>
            </View>)
    }

    createPie = () => {
        let {directNum, teamNum, yesterdayDirectNum, weekDirectNum, yesterdayTeamNum, weekTeamNum} = this.state.pieData
        let diPercent = directNum === 0 || directNum === NaN ? 0 : (directNum / (this.state.pieData.directNum + this.state.pieData.teamNum)).toFixed(2) * 100
        let teamNumPercent = teamNum === 0 || teamNum === NaN ? 0 : (teamNum / (this.state.pieData.directNum + this.state.pieData.teamNum)).toFixed(2) * 100

        const data = [40, 60]
        const randomColor = [theme_color, CircleGoldColor]
        const pieData = data
            .filter((value) => value > 0)
            .map((value, index) => ({
                value,
                svg: {
                    fill: randomColor[index],
                    onPress: () => console.log('press', index),
                },
                key: `pie-${index}`,
            }))
        return (<View style={{position: 'relative', top: -17,}}>

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
                    this.onTeamManage();
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
            <View style={{flexDirection: 'row'}}>
                {directNum !== 0 && teamNum !== 0 ? <PieChart
                        style={styles.pieView}
                        data={pieData}/> :
                    <Image source={require('../../static/img/agent/circle.png')} style={styles.pieView}/>}
                <View style={styles.pieRightView}>
                    <View style={styles.pieRightItemView}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}><Image
                            source={require('../../static/img/administer_icon_zshy.png')}
                            style={{
                                resizeMode: 'contain',
                                width: 12,
                                height: 12,
                                marginRight: 6
                            }}/>
                            <Text style={styles.textGray}>直属会员</Text></View>
                        <Text style={styles.textGray}>{diPercent} %</Text>
                        <Text style={styles.textGray}>{directNum}人</Text>

                    </View>
                    <View style={styles.pieRightItemTwoView}>
                        <Text style={styles.textGray}>昨日+{yesterdayDirectNum}</Text>
                        <Text style={styles.textGray}>本周+{weekDirectNum}</Text>
                    </View>

                    <View style={styles.pieRightItemView}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}><Image
                            source={require('../../static/img/administer_icon_tdhy.png')}
                            style={{
                                resizeMode: 'contain',
                                width: 12,
                                height: 12,
                                marginRight: 6
                            }}/>
                            <Text style={styles.textGray}>团队会员</Text></View>
                        <Text style={styles.textGray}>{teamNumPercent}%</Text>
                        <Text style={styles.textGray}>{teamNum}人</Text>

                    </View>
                    <View style={styles.pieRightItemTwoView}>
                        <Text style={styles.textGray}>昨日+{yesterdayTeamNum}</Text>
                        <Text style={styles.textGray}>本周+{weekTeamNum}</Text>
                    </View>


                </View>
            </View>
        </View>)
    }


    createBar = () => {
        if (this.state.barData.length <= 0) {
            return
        }

        let teemNum = new Array();
        let directNum = new Array();
        let dataNum = new Array();
        for (var i = 0; i < this.state.barData.length; i++) {
            teemNum.push(0)
            teemNum.push(this.state.barData[i].teamCommissions)
            directNum.push(0)
            directNum.push(this.state.barData[i].directCommissions)
            dataNum.push(this.state.barData[i].date)
        }
        let maxDirectNum = directNum.reduce(function (a, b) {
            return b > a ? b : a;
        });
        let maxTeemNum = teemNum.reduce(function (a, b) {
            return b > a ? b : a;
        });
        let maxNum = Math.round(maxDirectNum > maxTeemNum ? maxDirectNum : maxTeemNum)//四色五入
        console.log("属猪" + Math.round(maxNum))
        console.log(teemNum)
        console.log(directNum)

        const data1 = directNum
            .map((value) => ({value}))
        const data2 = teemNum
            .map((value) => ({value}))
        const barData = [
            {
                data: data1,
                svg: {
                    fill: BarBlueColor,
                },
            },
            {
                data: data2,
            },
        ]
        return (<View style={{position: 'relative', top: -17,}}>
            <View style={{
                backgroundColor: 'white',
                height: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: 15,
                paddingRight: 15
            }}>
                <Text style={{marginLeft: 5, color: textTitleColor}}>近期佣金</Text>

                <TouchableOpacity onPress={() => {
                    // this.props.goMoreGame('navigate')
                    this.onRewardFlow()

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

            {maxNum !== 0 ?
                <View style={{flexDirection: 'row'}}>
                    <View style={{width: 30, height: 170, marginLeft: 15,}}>
                        <Text style={styles.barTextOne}>{Math.round(maxNum)}</Text>
                        <Text style={styles.barText}>{Math.round(maxNum / 5 * 4)}</Text>
                        <Text style={styles.barText}>{Math.round(maxNum / 5 * 3)}</Text>
                        <Text style={styles.barText}>{Math.round(maxNum / 5 * 2)}</Text>
                        <Text style={styles.barText}>{Math.round(maxNum / 5)}</Text>
                        <Text style={styles.barText}>0</Text>
                    </View>

                    <BarChart
                        style={styles.barView}
                        data={barData}
                        yAccessor={({item}) => item.value}
                        svg={{
                            fill: BarGreenColor,
                        }}
                        contentInset={{top: 0, bottom: 1}}
                        {...this.props}
                    >
                        <Grid/>
                    </BarChart>

                </View> : <Image source={require('../../static/img/agent/table.png')}
                                 style={styles.barBg}/>}
            {maxNum !== 0 ? <XAxis
                style={{marginLeft: 45, width: DeviceValue.windowWidth - 30 - 30, height: 20, marginTop: 6}}
                data={teemNum}
                formatLabel={(value, index) => {
                    if ((index + 1) % 2 === 0) {
                        return dataNum[(index + 1) / 2 - 1]
                    }
                }}
                contentInset={{left: 10, right: 10}}
                svg={{fontSize: 10, fill: 'black'}}
            /> : null}
            <View
                style={{
                    flexDirection: 'row',
                    width: DeviceValue.windowWidth,
                    justifyContent: 'center',
                    marginTop: 5,
                    alignItems: 'center'
                }}>

                <View style={{flexDirection: 'row', alignItems: 'center', height: 30}}>
                    <View
                        style={{
                            resizeMode: 'contain',
                            width: 8,
                            height: 8,
                            marginRight: 6,
                            backgroundColor: BarBlueColor
                        }}/>
                    <Text style={styles.textGray}>直属</Text>
                </View>
                <View
                    style={{
                        resizeMode: 'contain',
                        width: 8,
                        height: 8,
                        marginRight: 6,
                        marginLeft: 12,
                        backgroundColor: BarGreenColor
                    }}/>
                <Text style={styles.textGray}>团队</Text>
            </View>


        </View>)
    }

    onShowBank = () => {
        this.refs.modal6.close()
        let {agentData} = this.state;
        getStoreData('userInfoState').then((userInfo) => {
            if (userInfo && !userInfo.settedqkpwd) {
                //尚未设置提款密码
                TXToastManager.show('请先设置提款密码');
                this.props.navigation.navigate('SettingCapitalPwdScreen');
            } else if (userInfo && userInfo.bankList && userInfo.bankList.length == 0) {
                //还没有绑定银行卡
                TXToastManager.show('请先绑定银行卡');
                this.props.navigation.navigate('AddBankScreen');
            } else if (userInfo.bankList && userInfo.bankList.length > 0) {
                this.refs.modal6.close();
                if (parseInt(agentData.outstandingCommissions) > 0) {
                    this.props.navigation.navigate('AgentCommissionExtract', {
                        agentData: agentData,
                        bankInfo: userInfo.bankList[0]
                    })
                } else {
                    TXToastManager.show('您当前没有佣金可以提取');
                }

            }
        });

    }

    //在render函数调用前判断：如果前后state中Number不变，通过return false阻止render调用
    /*  shouldComponentUpdate(nextProps, nextState) {
          if (this.state.barData===nextState.barData) {
              return false
          } else {
              return true
          }
      }*/

    render() {
        console.log("属狗  这里多次请求网络 state变化会导致多次刷新页面")
        let {agencyLevel, teamNum, allExtractedCommissions, outstandingCommissions} = this.state.agentData;
        return (<View style={{flex: 1}}>
                {this.state.agentData !== {} && this.state.pieData !== {} && this.state.barData.length > 0 &&
                this.state.inviteData !== {} &&
                <ScrollView style={{flex: 1, backgroundColor: MainTheme.BackgroundColor}}>
                    {this.state.agentData !== {} &&
                    <ImageBackground source={require('../../static/img/agent/dlgl_bg.png')}
                                     resizeMode='cover' style={styles.bgImagbg}>
                        <Text style={[styles.agentTitle, styles.welcomTitle]}>欢迎您,{userName}</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center', width: DeviceValue.windowWidth}}>
                            <Text style={[styles.agentTitle, {
                                fontSize: 22, marginLeft: DeviceValue.windowWidth / 2 - 32
                            }]}>￥{outstandingCommissions}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.refs.modal6.open()
                                }}
                                style={[styles.agentTitle, styles.takeMonyView]}>
                                <Text style={[styles.agentTitle, {fontSize: 10}]}>提取佣金</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.agentTitle, {margin: 8}]}>未结佣金</Text>
                        <View style={styles.titleView}>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle18]}>{agencyLevel}</Text>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle18]}>{teamNum}</Text>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle18]}>{allExtractedCommissions}</Text>
                        </View>
                        <View style={styles.titleView}>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle14]}>代理等级</Text>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle14]}>团队人数</Text>
                            <Text style={[styles.agentTitle, styles.fontSizeTitle14]}>累计提拥</Text>
                        </View>
                    </ImageBackground>}
                    {this.state.agentData !== {} && this.createAgentBtn()}
                    {this.state.inviteData !== {} && this.createQr()}
                    <View style={{
                        width: DeviceValue.windowWidth,
                        backgroundColor: MainTheme.BackgroundColor
                    }}>
                        {this.state.pieData !== {} && this.createPie()}
                        {this.state.barData.length > 0 && this.createBar()}
                    </View>

                </ScrollView>}
                <Modal style={[styles.modal, styles.modal4]} position={"bottom"} ref={"modal6"}>

                    <View style={styles.modalView}>
                        <Text style={styles.choiceText}>请选择:</Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.refs.modal6.close()
                                this.props.navigation.navigate('AgentCommissionTransfer');
                            }}
                            style={styles.touchView}>
                            <Text style={[styles.agentTitle, {fontSize: 14}]}>转至中心钱包</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={this.onShowBank.bind(this)}
                            style={styles.touchBankView}>
                            <Text style={{fontSize: 14, color: theme_color}}>提现至银行卡</Text>
                        </TouchableOpacity>
                    </View>

                </Modal>
            </View>
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
        width: 32,
        height: 32
    },
    shortcutTitle: {
        fontSize: 12,
        color: MainTheme.DarkGrayColor,
        marginTop: 2
    },
    agentTitle: {
        color: MainTheme.commonButtonTitleColor
    },
    titleView: {
        width: DeviceValue.windowWidth - 50,
        height: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 3
    },
    fontSizeTitle18: {
        flex: 1,
        fontSize: 18,
        textAlign: 'center',
    },
    fontSizeTitle14: {
        flex: 1,
        fontSize: 14,
        textAlign: 'center',
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
        height: 26,
        borderRadius: 4,
        borderColor: MainTheme.theme_color,
        borderWidth: 0.5,
        justifyContent: 'center',
        padding: 2,
        color: MainTheme.theme_color,
        marginTop: 1

    },
    tgwaText: {
        height: 86,
        width: DeviceValue.windowWidth - 30 - 6 - 4 - 115,
        borderRadius: 4,
        borderColor: MainTheme.theme_color,
        borderWidth: 0.5,
        padding: 2,
        marginTop: 6,
        color: MainTheme.theme_color,
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
        fontSize: 12
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
    ,
    modal: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    modal4: {
        height: 160
    },
    modalView: {
        width: DeviceValue.windowWidth,
        height: 160,
        alignItems: 'center'
    },
    choiceText: {
        fontSize: 12,
        marginTop: 12,
        marginLeft: 20,
        textAlign: 'left',
        width: DeviceValue.windowWidth
    },
    touchView: {
        alignItems: 'center', justifyContent: 'center', marginTop: 10,
        backgroundColor: theme_color, height: 40, width: DeviceValue.windowWidth - 40
    },
    touchBankView: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        borderWidth: 0.5,
        borderRadius: 4,
        borderColor: theme_color,
        height: 40,
        width: DeviceValue.windowWidth - 40
    },
    textGray: {
        color: MainTheme.ThemeEditTextTextColor,
        fontSize: 10
    },
    pieView: {
        height: DeviceValue.windowWidth * 0.3,
        width: DeviceValue.windowWidth * 0.3,
        margin: 15,
    },
    pieRightView: {
        height: DeviceValue.windowWidth * 0.3,
        flex: 1,
        justifyContent: 'space-between',
        marginTop: 8,
        marginLeft: 15,
        padding: 8
    }, pieRightItemView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
    }, pieRightItemTwoView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
    },
    barText: {
        marginTop: (170 / 11.5) * 2 - 15,
        fontSize: 10,
        width: 30,
        textAlign: 'right',
        height: 15
    },
    barRowText: {
        width: 15,
        height: 15,
        fontSize: 10,
        marginLeft: (DeviceValue.windowWidth - 30 - 30) / 7 - 7 - (DeviceValue.windowWidth - 30 - 30) / 28,
        backgroundColor: 'blue',
        textAlign: 'center'
    },
    barRowTwoText: {
        width: 15,
        height: 15,
        fontSize: 10,
        marginLeft: (DeviceValue.windowWidth - 30 - 30) / 7 - 7,
        backgroundColor: 'blue',
        textAlign: 'center'
    },
    barView: {
        height: 171,
        width: DeviceValue.windowWidth - 30 - 30 - 3,
        marginRight: 15,
        marginLeft: 3
    },
    barBg: {
        resizeMode: 'contain',
        width: DeviceValue.windowWidth - 30,
        height: (DeviceValue.windowWidth - 30) * (557 / 729),
        margin: 15
    },
    barTextOne: {
        fontSize: 10,
        width: 30,
        textAlign: 'right',
        height: 15,
        marginTop: (170 / 11.5) * 1.4 - 7,
    }
});
