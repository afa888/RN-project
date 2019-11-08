import React, {Component, ReactPage, FlowPage, JestPage} from 'react';
import {Platform, StyleSheet, View, Text, Image, TouchableOpacity, Alert, TextInput} from 'react-native';
import {category_group_divide_line_color, theme_color, textThreeHightTitleColor} from '../../utils/AllColor'
import CategoryScreen from './GameGridListScreen'
import AndroidNativeGameActiviy from '../../customizeview/AndroidIosNativeGameActiviy';
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view'
import http from "../../http/httpFetch";
import SpinnerLoding from "../../tools/SpinnerLoding";
import deviceValue from "../../utils/DeviceValue";


let gameId
let searchId
export default class GameListScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            index: 0
        };
    }

    componentWillMount() {
        let {navigation} = this.props;
        let otherParam = navigation.getParam('otherParam', '');
        let gameName = navigation.getParam('gameName', '');
        let id = navigation.getParam('gameId', '');

        console.log(id + "   kkkkk  ")
        gameId = id
        console.log(gameId + "   kkkkk  ")
        this.props.navigation.setParams({title: otherParam, gameName: gameName})
        this.httpRefresh()

    }

    httpRefresh = () => {
        let prams = {
            pageNo: 1,
            pageSize: 24,
            id: gameId,
        };
        http.get('game/getThirdTab', prams, true).then(res => {
            console.log(res);
            if (res.status === 10000) {
                if (res.data !== null && res.data.length > 0) {
                    this.setState({data: res.data})
                    searchId = this.state.data[0].id
                } else {

                }

            }
        }).catch(err => {
            console.error(err)
        });
    }


    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {
            headerRight: (<View
                    style={{
                        width: deviceValue.windowWidth - 60,
                        height: 48,
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <Text style={{
                        fontSize: 18,
                        color: 'black',
                        fontWeight: 'bold',
                        width: deviceValue.windowWidth / 3,
                    }}> {params.gameName}</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('SeachGameList', {gameId: searchId})
                    }}>
                        <View
                            style={{
                                width: 4*deviceValue.windowWidth/9,
                                height: 32,
                                justifyContent: 'center',
                                marginLeft:5,
                            }}>

                            <View style={{
                                backgroundColor: category_group_divide_line_color,
                                borderRadius: 6,
                                flex: 1,
                                width: 4*deviceValue.windowWidth/9,
                                height: 21,
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}>
                                <Image source={require('../../static/img/ic_menu_search.png')}
                                       style={{
                                           resizeMode: 'contain',
                                           width: 15,
                                           height: 15,
                                           marginLeft: 12
                                       }}/>
                                <Text
                                    style={{
                                        marginLeft: 4,
                                        flex: 1,
                                        fontSize: 12,
                                        alignItems: 'center',
                                        color: textThreeHightTitleColor
                                    }}
                                >请输入游戏名称</Text>
                            </View>

                        </View>
                    </TouchableOpacity>

                </View>
            ),
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
        };
    };
    gotoGame = (url, id, type) => {
        AndroidNativeGameActiviy.openGameWith(url, id, type);
    }

    render() {
        let sreenView = []
        for (var i = 0; i < this.state.data.length; i++) {
            sreenView.push(<CategoryScreen tabLabel={this.state.data[i].name}
                                           dataList={this.state.data[0].gameDetailEntities.list}
                                           id={this.state.data[i].id}
                                           gotoGame={this.gotoGame.bind(this)}/>)
        }

        return (
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
        );
    }
}


const styles = StyleSheet.create({});
