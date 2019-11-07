import React, {Component} from 'react';
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
    RefreshControl, ImageBackground, DeviceEventEmitter
} from 'react-native';
import Dimensions from 'Dimensions'
import http from "../../http/httpFetch";
import {NativeModules} from 'react-native';
import FastImage from 'react-native-fast-image'
import DeviceValue from "../../utils/DeviceValue";
import HomeNoticeView from './HomeNoticeView'
import ModalDialog from '../../customizeview/ModalDialog'
import HomeMidView from './HomeMidView'
import {category_group_divide_line_color, category_tab_checked_bg_color, theme_color,textTitleColor} from "../../utils/AllColor";
import HomeBottomView from "./HomeBottomView";
import AndroidNativeGameActiviy from "../../customizeview/AndroidIosNativeGameActiviy";
import Toast, {DURATION} from 'react-native-easy-toast'
import {CAGENT} from '../../utils/Config'
import CodePush from 'react-native-code-push'

export default class HomeScreen extends Component<Props> {


    static navigationOptions = {
        headerTitle: <View style={{flex: 1, alignItems: "center"}}>
            <Image source={require('../../static/img/banner.png')}
                   style={{
                       flex: 1,
                       resizeMode: 'cover',
                       width: 150,
                       height: 20,
                   }}/>
        </View>,
        headerRight: <View
            style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',marginRight:12}}>
            <TouchableOpacity style={{width: 28, height: 48, alignItems: 'center'}} onPress={() => {

            }}>
                <View style={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 28,
                    height: 48,
                    justifyContent: 'center'
                }}>
                    <Image
                        source={require('../../static/img/nav_icon_email_nor.png')}
                        style={{
                            resizeMode: 'contain',
                            width: 18,
                            height: 18,
                        }}/>
                    <Text style={{color: textTitleColor, fontSize: 8,marginTop:2}}>消息</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{width: 28, height: 48, alignItems: 'center'}} onPress={() => {

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
                        }}/>
                    <Text style={{color: textTitleColor, fontSize: 8,marginTop:2}}>消息</Text>
                </View>
            </TouchableOpacity>
        </View>

    }

    componentWillMount() {

    }

    componentDidMount() {

        this.listener = DeviceEventEmitter.addListener('login', (val) => {
            this.props.navigation.navigate('LoginService')
        });
        this.httpCategoryRefresh()
        this.httpGridGame()
        console.log("99999")
        console.log(this.state.dicountUrl)
    }


    componentWillUnmount() {
        this.listener.remove();
    }

    constructor(props) {
        super(props);
        this.state = {
            isDialogVisible: false,
            data: {},
            dataImagUrl: [],
            dicountUrl: ["http://image.txv2.com/mobile" + CAGENT + "/image/Home/1.jpg",
                "http://image.txv2.com/mobile" + CAGENT + "/image/Home/2.jpg",
                "http://image.txv2.com/mobile" + CAGENT + "/image/Home/3.jpg",],
            noticeTitle: []
        }

    }

    showDialog = (blo, notice) => {
        let noticeList = []
        for (var i = 0; i < notice.length; i++) {
            noticeList.push(notice[i].value + "\r\n" + "\r")
        }
        this.setState({isDialogVisible: blo, noticeTitle: noticeList});
    }

    hideDialog = () => {
        this.setState({isDialogVisible: false});
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
        if (item === 'navigate') {

            this.props.navigation.navigate('分类')
        } else {
            if (item.gameId === "") {
                this.props.navigation.navigate('GameList', item.logImgUrl === "" ? {
                    otherParam: '',
                    gameName: item.name,
                    gameId: item.id,
                } : {otherParam: item.logImgUrl, gameId: item.id})
            } else {
                this.forwardGame(item)
            }
        }
    }
    httpCategoryRefresh = () => {
        let prams = {
            cagent: CAGENT,
            src: CAGENT,
            terminal: DeviceValue.terminal,
        };
        http.get('game/getPageTab', prams).then(res => {
            console.log(res);
            if (res.status === 10000) {
                let categoryList = []
                for (var i = 0; i < res.data.length; i++) {
                    let itemLeft = {key: res.data[i].name, isSelect: i == 0 ? true : false}
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
                this.setState({data: res.data})
            }
        }).catch(err => {
            console.error(err)
        });
    }


    gotoDiscout = () => {
        this.props.navigation.navigate('Discount')
    }

    gotoDiscoutDetail = (url) => {
        this.props.navigation.navigate('DiscountDetail', {url: url})
    }


    render() {
        return (
            <View style={{flex: 1, justifyContent: 'center'}}>
                <ModalDialog
                    _dialogContent={this.state.noticeTitle}
                    _dialogVisible={this.state.isDialogVisible}
                    _dialogLeftBtnAction={() => {
                        this.hideDialog()
                    }}
                    _dialogRightBtnAction={() => {
                        this.hideDialog()
                    }}
                    _dialogCancle={() => {
                        this.hideDialog()
                    }}
                />
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'black'}}
                    position='center'
                    opacity={0.4}
                    textStyle={{color: 'white'}}
                />
                <ScrollView style={{flex: 1, backgroundColor: category_group_divide_line_color}}>
                    <View style={{flex: 1}}>
                        <HomeNoticeView showDialog={
                            this.showDialog.bind(this)
                        }/>

                        <HomeMidView data={this.state.data.gameClassifyEntities}
                                     goMoreGame={this.goMoreGame.bind(this)}/>

                        <HomeBottomView dicountUrl={this.state.dicountUrl}
                                        gotoDiscout={this.gotoDiscout.bind(this)}
                                        gotoDiscoutDetail={this.gotoDiscoutDetail.bind(this)}/>
                    </View>

                </ScrollView>

            </View>
        );
    }
}


const styles = StyleSheet.create({

    wrapper: {height: 150},
    slideFastImage: {
        width: DeviceValue.windowWidth,
        height: 150,
    },
    itemView: {backgroundColor: 'white', height: 40, flexDirection: 'row', marginTop: 12, alignItems: 'center'},
    noticeView: {backgroundColor: 'white', height: 90, flexDirection: 'row', alignItems: 'center'},
    conView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    textView: {
        textAlign: 'center',
        textAlignVertical: 'center',
    }

});
