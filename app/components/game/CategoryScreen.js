import React, {Component, ReactPage, FlowPage, JestPage} from 'react';
import {Platform, StyleSheet, View, Text, Image, TouchableOpacity, Alert, SafeAreaView} from 'react-native';
import {theme_color} from '../../utils/AllColor'
import CategoryGameGridListScreen from './CategoryGameGridListScreen'
import AndroidNativeGameActiviy from '../../customizeview/AndroidIosNativeGameActiviy';
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view'
import http from "../../http/httpFetch";
import SpinnerLoding from "../../tools/SpinnerLoding";
import {CAGENT} from "../../utils/Config";
import DeviceValue from "../../utils/DeviceValue";


let gameId
let searchId
//分类页面
export default class GameListScreen extends Component<Props> {
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            index: 0
        };
    }

    componentWillMount() {
        console.log("分类 走一样")
        if (DeviceValue.CategoryData.length > 0) {
            this.setState({
                data: DeviceValue.CategoryData,
            })
        } else {
            this.httpRefresh()
        }
    }

    httpRefresh = () => {
        let prams = {
            cagent: CAGENT,
            src: CAGENT,
            terminal: DeviceValue.terminal,
        };
        http.get('game/getPageTab', prams).then(res => {
            if (res.status === 10000) {
                this.setState({
                    data: res.data,

                })
            }
        }).catch(err => {
            console.error(err)
        });
    }


    gotoGame = (item) => {
        console.log(item)
        if (item.gameId === "") {
            this.props.navigation.navigate('GameList', item.logImgUrl === "" ? {
                otherParam: '',
                gameName: item.name,
                gameId: item.id,
            } : {otherParam: item.logImgUrl, gameId: item.id, gameName: item.name,})
        } else {
            this.forwardGame(item)
        }
    }

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


    render() {
        let sreenView = []
        for (var i = 0; i < this.state.data.length - 3; i++) {
            sreenView.push(<CategoryGameGridListScreen tabLabel={this.state.data[i].name}
                                                       dataList={this.state.data[i].gameClassifyEntities}
                                                       id={this.state.data[i].id}
                                                       gotoGame={this.gotoGame.bind(this)}/>)
        }

        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={{flex: 1}}>
                    {this.state.data.length > 0 && <ScrollableTabView
                        style={{}}
                        initialPage={0}
                        renderTabBar={() => <ScrollableTabBar/>}
                        tabBarActiveTextColor={theme_color}
                        tabBarUnderlineStyle={{backgroundColor: theme_color, height: 1}}
                        tabBarTextStyle={{marginLeft: 6, marginRight: 6}}
                        onChangeTab={(index) => {
                            searchId = this.state.data[index.i].id
                        }}

                    >

                        {sreenView}

                    </ScrollableTabView>}
                    <SpinnerLoding/>
                </View>
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white'
    }
});
