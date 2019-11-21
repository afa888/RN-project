import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    ScrollView,
    Image,
    StatusBar,
    TouchableOpacity,
    FlatList,
    RefreshControl, ImageBackground, DeviceEventEmitter,InteractionManager
} from 'react-native';
import Dimensions from 'Dimensions'
import http from "../../http/httpFetch";
import { NativeModules } from 'react-native';
import FastImage from 'react-native-fast-image'
import DeviceValue from "../../utils/DeviceValue";
import HomeNoticeView from './HomeNoticeView'
import ModalScratch from '../../customizeview/ModalScratch'
import RedBagDialog from '../../customizeview/RedBagDialog'
import HomeMidView from './HomeMidView'
import {
    category_group_divide_line_color,
    category_tab_checked_bg_color,
    theme_color,
    textTitleColor
} from "../../utils/AllColor";
import HomeBottomView from "./HomeBottomView";
import AndroidNativeGameActiviy from "../../customizeview/AndroidIosNativeGameActiviy";
import Toast, { DURATION } from 'react-native-easy-toast'
import { CAGENT } from '../../utils/Config'
import CodePush from 'react-native-code-push';
import TXTools from '../../utils/Htools';
import {
    INNER_MESSAGER_DATETIME_PERIOD,
    INNER_MESSAGER_MESSAGE_NUM_URL,
    INNER_MESSAGER_STATUS_CHANGED,
} from './InnerMessager';
import { getStoreData, checkLoginState } from "../../http/AsyncStorage";
import TXToastManager from "../../tools/TXToastManager";


export default class HomeScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        let badgeWidth = 14;
        if (params && params.badgeValue > 0) {
            if (params.badgeValue > 9) {
                badgeWidth = 20;
            }
            if (params.badgeValue > 99) {
                badgeWidth = 26;
            }
        }

        return {
            headerTitle: <View style={{ flex: 1, alignItems: "center" }}>
                <Image source={require('../../static/img/banner.png')}
                    style={{
                        flex: 1,
                        resizeMode: 'contain',
                        width: DeviceValue.windowWidth,
                        height: 48,
                    }} />
            </View>,
            headerRight: <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12
                }}>
                <TouchableOpacity style={{ width: 28, height: 48, alignItems: 'center', marginRight: 10, }}
                    onPress={() => {
                        checkLoginState().then((isLogin) => {
                            if (isLogin) {
                                navigation.navigate('InnerMessager');
                            }
                            else {
                                TXToastManager.show('请先登录！');
                                navigation.navigate('LoginService');
                            }
                        }).catch(err => console.log('读取用户登录状态失败：' + err));
                    }}>
                    <View style={styles.innerMessageIcon}>
                        {
                            params && params.badgeValue > 0 && (
                                <View style={{ ...styles.badgeContainer, width: badgeWidth }}>
                                    <Text style={styles.badgeText}>
                                        {params.badgeValue > 99 ? '99+' : params.badgeValue}
                                    </Text>
                                </View>
                            )
                        }
                        <Image source={require('../../static/img/nav_icon_email_nor.png')}
                            style={{ resizeMode: 'contain', width: 18, height: 18, }} />
                        <Text style={{ color: textTitleColor, fontSize: 8, marginTop: 2 }}>消息</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={{ width: 28, height: 48, alignItems: 'center' }} onPress={() => {
                    navigation.navigate('CustomerService')

                }}>
                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 28,
                        height: 48,
                        justifyContent: 'center'
                    }}>
                        <Image
                            source={require('../../static/img/nav_icon_kefu_nor.png')}
                            style={{
                                resizeMode: 'contain',
                                width: 18,
                                height: 18,
                            }} />
                        <Text style={{ color: textTitleColor, fontSize: 8, marginTop: 2 }}>客服</Text>
                    </View>
                </TouchableOpacity>
            </View>,
            headerLeft: (
                <View></View>
            ),
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        // 跳转到登陆页面
        this.listener = DeviceEventEmitter.addListener('login', (val) => {
            this.props.navigation.navigate('LoginService')
        });


        // 站内信
        this.innerMessagerListener =
            DeviceEventEmitter.addListener(INNER_MESSAGER_STATUS_CHANGED, (val) => {
                this.props.navigation.setParams({ badgeValue: val });
            });

        // 游戏列表：获得一二级游戏
        this.httpCategoryRefresh();

        // 游戏列表：获取平台推荐游戏
        this.httpGridGame();

        // // 红包状态查询
        // this.httpRedBag();
        // 刮刮乐 与 红包;
       // this.httpScratch()

        // 获取未读的站内信数量
        checkLoginState().then((isLogin) => {
            if (isLogin) {
                this.requestInnerMessageInfo();
            }
            else {
                this.props.navigation.setParams({ badgeValue: 0 });
            }
        }).catch(err => console.log('读取用户登录状态失败：' + err));
    }

    componentWillUnmount() {
        this.listener.remove();
        this.innerMessagerListener.remove();
    }

    constructor(props) {
        super(props);
        this.state = {
            isRedBagVisible: false,
            isScrachVisible: false,
            data: {},
            dataImagUrl: [],
            dicountUrl: ["https://mobile.worldwealth.com.cn/mobile" + CAGENT + "/image/Home/1.jpg",
            "https://mobile.worldwealth.com.cn/mobile" + CAGENT + "/image/Home/2.jpg",
            "https://mobile.worldwealth.com.cn/mobile" + CAGENT + "/image/Home/3.jpg",],
            noticeTitle: [],
            redData: {}
        }

    }

    noticeScreen = (blo, notice) => {

        let noticeList = []
        for (var i = 0; i < notice.length; i++) {
            noticeList.push(notice[i].value + "\r\n" + "\r")
        }

        this.props.navigation.navigate('NoticeScreen', { data: noticeList })
    }

    // http://m.txbet1788.com/TXW/game/getPageTabRecommend?src=TXW&cagent=TXW&terminal=2

    forwardGame = (item) => {
        let prams = {
            gameId: item.gameId,
            platCode: item.platformKey,
            gameType: item.gameType,
            model: 2
        };

        http.post('game/forwardGame', prams, true).then((res) => {
            if (res.status === 10000) {
                console.log(res)
                if ("error" === res.data.message) {
                    this.tostTitle('系统错误')
                } else if ("process" === res.data.message) {
                    this.tostTitle('维护中')
                } else if (res.data.url === '') {
                    this.tostTitle('获取游戏地址失败')
                } else {
                    AndroidNativeGameActiviy.openGameWith(res.data.url, item.gameId, item.platformKey);
                    //this.props.navigation.navigate('Game',{gameUrl:res.data.url})
                }
            }
        }).catch(err => {
            console.error(err)
        });
    }
    tostTitle = (msg) => {
        this.refs.toast.show(msg);
    }

    goMoreGame = (item) => {
        console.log(item)
        if (item === 'navigate') {

            this.props.navigation.navigate('分类')
        } else if (item.gameId === "") {
            this.props.navigation.navigate('GameList', item.logImgUrl === "" ? {
                otherParam: '',
                gameName: item.name,
                gameId: item.id,
            } : { otherParam: item.logImgUrl, gameId: item.id, gameName: item.name, })
        } else {
            this.forwardGame(item)
        }
    }
    httpCategoryRefresh = () => {
        let prams = {
            cagent: CAGENT,
            src: CAGENT,
            terminal: DeviceValue.terminal,
        };
        http.get('game/getPageTab', prams).then(res => {
            console.log("平台推荐");
            console.log(res);
            if (res.status === 10000) {
                let categoryList = []
                for (var i = 0; i < res.data.length; i++) {
                    let itemLeft = { key: res.data[i].name, isSelect: i == 0 ? true : false }
                    categoryList.push(itemLeft);
                }
                DeviceValue.CategoryData = res.data
                DeviceValue.CategoryDataList = res.data[0].gameClassifyEntities
                DeviceValue.CategoryList = categoryList

            }
        }).catch(err => {
            console.error(err)
        });
    }
    httpGridGame = () => {
        let prams = {
            cagent: CAGENT,
            src: CAGENT,
            terminal: DeviceValue.terminal,
        };
        http.get('game/getPageTabRecommend', prams).then(res => {
            console.log(res);
            if (res.status === 10000) {
                this.setState({ data: res.data })
            }
        }).catch(err => {
            console.error(err)
        });
    }

    httpScratch = () => {

        getStoreData('@loginState').then((loginInfo) => {
            if (loginInfo.isLogin) {
                //已经登录
                getStoreData('userInfoState').then(userInfo => {
                    if (!userInfo.hasOwnProperty('scratchStatus') || userInfo.scratchStatus === 0) {
                        // 没有领取过 刮刮乐 就 去 服务器查询是否有活动
                        let prams = {type:'2',cagentCode:CAGENT};
                        http.post('gglActivity/getReward.do', prams).then(res => {
                            console.log("刮刮乐")
                            console.log(res);
                            if (res && res.status === 10000) {

                                if (res.data.status == '0') {
                                    //verifyPhone 1 是收机号 注册 无需验证， 0 是快速注册 需要验证手机号
                                    if (res.data.hasOwnProperty('activityId') && res.data.hasOwnProperty('usermoney') && res.data.hasOwnProperty('verifyPhone')) {
                                        this.setState({scratchData: res.data});
                                        this.showScrach();
                                    }

                                }else if(res.hasOwnProperty('msg') && res.msg === '用户已参与过此次活动') {
                                    //
                                    this.saveScratchStatus();
                                }
                            }else {
                                this.httpRedBag();
                            }
                        }).catch(err => {
                            console.error(err)
                            this.httpRedBag();
                        });
                    }else {
                        this.httpRedBag();
                    }
                });
            }else {
                //未登录
                this.httpRedBag();
            }
        });



    }

    saveScratchStatus = () => {
        mergeStoreData('userInfoState',
                    {
                        scratchStatus: 1
                    });
    }

    httpRedBag = () => {
        let prams = {};
        http.get('LuckyDraw/getStatus.do', prams).then(res => {
            console.log("红包")
            console.log(res);
            if (res.status === 10000) {
                this.setState({ redData: res.data })

                if (res.data.status !== "faild") {
                    this.showRedBag();

                }
            }
        }).catch(err => {
            console.error(err)
        });
    }

    showRedBag = () => {

        this.setState({ isRedBagVisible: true });
    }
    gotoDiscout = () => {
        this.props.navigation.navigate('DiscountsScreen')
    }

    gotoDiscoutDetail = (url) => {
        this.props.navigation.navigate('DiscountDetail', { url: url })
    }
    hideDialog = () => {
        this.setState({ isRedBagVisible: false });
    }
    gotoWebView = () => {
        this.props.navigation.navigate('RnWebScreen')
    }
    /**
     * 获取站内信未读数量
     */
    requestInnerMessageInfo = () => {
        // 查询的日期周期
        let theDay = TXTools.dateAfter(-INNER_MESSAGER_DATETIME_PERIOD);
        let from = TXTools.formatDateToCommonString(theDay);
        let to = TXTools.formatDateToCommonString(new Date());
        // 发送数据请求
        http.post(INNER_MESSAGER_MESSAGE_NUM_URL, { bdate: from, edate: to })
            .then(res => {
                if (res.status == 10000) {
                    this.props.navigation.setParams({ badgeValue: res.data.noread });
                }
            }).catch(err => {
                console.error(err);
            });
    }

    showScrach = () => {
        console.log('刮刮乐开始显示');
        this.setState({isScrachVisible: true});
    }
    hideScrach = () => {
        this.setState({isScrachVisible: false});
        this.httpRedBag();
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {this.state.isRedBagVisible && <RedBagDialog
                    _dialogContent={this.state.noticeTitle}
                    _dialogVisible={this.state.isRedBagVisible}
                    dialogData={this.state.redData}
                    _dialogCancle={
                        this.hideDialog.bind(this)
                    }
                    gotoWebView={this.gotoWebView.bind(this)}
                />}

                {this.state.isScrachVisible && <ModalScratch
                    _scrachVisible={this.state.isScrachVisible}
                    scratchData = {this.state.scratchData}
                    _verifyPhone = {this.state.scratchData ? this.state.scratchData.verifyPhone : 0}
                    _dialogSaveScratch = {this.saveScratchStatus.bind(this)}
                    _dialogCancle={
                        this.hideScrach.bind(this)
                    }
                />}
                <Toast
                    ref="toast"
                    style={{ backgroundColor: 'black' }}
                    position='center'
                    opacity={0.4}
                    textStyle={{ color: 'white' }}
                />
                <ScrollView style={{ flex: 1, backgroundColor: category_group_divide_line_color }}>
                    <View style={{ flex: 1 }}>
                        <HomeNoticeView showDialog={
                            this.noticeScreen.bind(this)
                        } />

                        <HomeMidView data={this.state.data.gameClassifyEntities}
                            goMoreGame={this.goMoreGame.bind(this)} />

                        <HomeBottomView dicountUrl={this.state.dicountUrl}
                            gotoDiscout={this.gotoDiscout.bind(this)}
                            gotoDiscoutDetail={this.gotoDiscoutDetail.bind(this)} />
                    </View>

                </ScrollView>

            </View>
        );
    }
}


const styles = StyleSheet.create({

    wrapper: { height: 150 },
    slideFastImage: {
        width: DeviceValue.windowWidth,
        height: 150,
    },
    itemView: { backgroundColor: 'white', height: 40, flexDirection: 'row', marginTop: 12, alignItems: 'center' },
    noticeView: { backgroundColor: 'white', height: 90, flexDirection: 'row', alignItems: 'center' },
    conView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    textView: {
        textAlign: 'center',
        textAlignVertical: 'center',
    },

    innerMessageIcon: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 28,
        height: 48,
        justifyContent: 'center'
    },

    badgeContainer: {
        position: 'absolute',
        top: 5,
        left: 14,
        height: 14,
        width: 14,
        zIndex: 999999,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        borderWidth: 0.5,
        borderColor: 'white',
    },

    badgeText: {
        color: 'white',
        fontSize: 10,
        textAlign: 'center',
    }

});
