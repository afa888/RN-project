import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Alert,
    Image,
    FlatList,
    RefreshControl,
    TouchableOpacity, TouchableHighlight, ToastAndroid
} from 'react-native';
import {category_tab_checked_bg_color, category_group_divide_line_color} from '../../utils/AllColor'
import deviceValue from '../../utils/DeviceValue'
import FastImage from 'react-native-fast-image'
import Dimensions from 'Dimensions'
import http from "../../http/httpFetch";
import DeviceStorage from "../../http/AsyncStorage";
import {CAGENT} from "../../utils/Config";
import Toast, {DURATION} from 'react-native-easy-toast'

let {width, height} = Dimensions.get('window');
let pageSize = 1;
let total = 0;
//分类第二级页面
export default class GameGridListScreen extends Component<Props> {
    static navigationOptions = {
        header: null
    }

    componentWillMount() {
        this.refresh()
    }

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            isLoreMoreing: 'LoreMoreing',
            listPosition: 0,
            data: [],
            total: 0

        };
    }

    //这里为了保持原图，比例是按图片比例缩放的
    rightItem = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => {
                this.forwardGame(item)
            }}>
                <View style={{
                    width: deviceValue.windowWidth / 3, flexDirection: 'row',
                    backgroundColor: category_tab_checked_bg_color,
                    marginTop:15,
                    height: (deviceValue.windowWidth / 3 - 24)* (312 / 276), alignItems: 'center', justifyContent: 'center'
                }}>

                    <ImageBackground style={{
                        marginLeft: 12,
                        flex: 1,
                        width: deviceValue.windowWidth / 3 - 24,
                        height: (deviceValue.windowWidth / 3 - 24)* (312 / 276),
                        marginRight: 12,
                    }} source={require('../../static/img/game_item_bg.png')} resizeMode='contain'>

                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'column'}}>
                            <Text style={{marginTop: 8,}} numberOfLines={1}>{item.name}</Text>

                            <FastImage
                                style={{
                                    marginTop: 5,
                                    width: deviceValue.windowWidth / 3 - 24 - 20,
                                    height: deviceValue.windowWidth / 3 - 24 - 20,
                                }}
                                source={{
                                    uri: item.imageUrl.startsWith('//') ? "http:" + item.imageUrl : item.imageUrl,
                                    priority: FastImage.priority.normal,

                                }}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        </View>

                    </ImageBackground>

                </View>
            </TouchableOpacity>

        )
    }


    forwardGame = (item) => {

        let prams = {
            gameId: item.gameId,
            platCode: item.platformKey,
            gameType: item.gameType,
            model: 3
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
                    this.props.gotoGame(res.data.url, item.gameId, item.platformKey)
                }
            }
        }).catch(err => {
            console.error(err)
        });
    }
    tostTitle = (msg) => {
        this.refs.toast.show(msg);
    }

    isLoreMore = false;
    LoreMore = () => {
        if (this.isLoreMore == false) {
            if (this.state.data.length >= total) {
                this.setState({
                    isLoreMoreing: 'LoreMoreEmpty'
                })
                return
            }
            this.setState({
                isLoreMoreing: 'LoreMoreing',
            });
            this.isLoreMore = true;
            pageSize++
            console.log("耶稣pageSize=  " + pageSize)
            this.httpRefresh()
        }
    }

    httpRefresh = () => {
        let prams = {
            pageNo: pageSize,
            pageSize: 24,
            id: this.props.id,
        };
        http.get('game/getForthTab', prams).then(res => {
            if (res.status === 10000) {
                console.log(res)
                total = res.data.total
                this.isLoreMore = false;
                if (pageSize > 1) {
                    if (res.data.list !== null) {
                        let more = this.state.data;
                        console.log("长度 " + res.data.list.length)
                        if (res.data.list.length > 0) {
                            for (var i = 0; i < res.data.list.length; i++) {
                                more.push(res.data.list[i])
                            }
                        }
                        this.setState({
                            refreshing: false,
                            data: more,
                        });
                    }

                } else {
                    this.setState({
                        refreshing: false,
                        data: res.data.list,
                    });
                }
            }
        }).catch(err => {
            this.setState({
                refreshing: false,
            })
            console.error(err)
        });
    }

    refresh = () => {
        pageSize = 1;
        this.setState({
            refreshing: true,
        });
        this.httpRefresh()
    }


    renderFooter = () => {

        if (this.state.data.length > 10 && this.state.isLoreMoreing == 'LoreMoreing') {
            return (
                <View style={{
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>{'正在加载....'}</Text>
                </View>
            )
        } else if (this.state.isLoreMoreing == 'LoreMoreEmpty' && this.state.data.length >= 12) {
            return (
                <View style={{
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>{'没有更多了'}</Text>
                </View>
            )
        } else {
            return null
        }

    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'black'}}
                    position='center'
                    opacity={0.4}
                    textStyle={{color: 'white'}}
                />
                <FlatList
                    numColumns={3}
                    style={{backgroundColor: category_tab_checked_bg_color}}
                    data={this.state.data}
                    ListHeaderComponent={this.renderHeader}//头部
                    ListFooterComponent={this.renderFooter}//尾巴
                    keyExtractor={item => item.gameId}
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.rightItem}
                    onEndReachedThreshold={0.1}//执行上啦的时候10%执行
                    onEndReached={this.LoreMore}
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refresh}
                        title="Loading..."/>}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({


    right_item_img: {
        flex: 1,
        height: 60,

    }
    ,
    right_item_view: {
        height: 85,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 12
    }
});
