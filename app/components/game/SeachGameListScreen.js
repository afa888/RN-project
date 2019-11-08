import React, {Component, ReactPage, FlowPage, JestPage} from 'react';
import {Platform, StyleSheet, View, Text, Image, TouchableOpacity, Alert, TextInput} from 'react-native';
import {theme_color, category_group_divide_line_color} from '../../utils/AllColor'
import SeachGameGridListScreen from './SeachGameGridListScreen'
import AndroidNativeGameActiviy from '../../customizeview/AndroidIosNativeGameActiviy';
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view'
import deviceValue from "../../utils/DeviceValue";
import http from "../../http/httpFetch";
import ListDataEmptyView from '../../customizeview/ListDataEmptyView'

let gameId

export default class SeachGameListScreen extends Component<Props> {
    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {
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
            headerTitle: (
                <View
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}> 搜索游戏</Text></View>
            ),
            headerRight: (<View/>)
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            keyword: '',
            isEmpty: false
        };
    }

    onSubmitEditing = () => {

        this.httpRefresh(this.state.keyWord)
    }

    componentWillMount() {
        let {navigation} = this.props;
        let otherParam = navigation.getParam('otherParam', '');
        let gameName = navigation.getParam('gameName', '');
        let id = navigation.getParam('gameId', '');

        gameId = id
        // this.httpRefresh()
        // this.props.navigation.setParams({onSubmitEditing: this.onSubmitEditing, keyWord: ''})

    }

    httpRefresh = (searchName) => {
        let prams = {
            pageNo: 1,
            pageSize: 24,
            id: gameId,
            searchName: searchName
        };
        http.get('game/getForthTab', prams).then(res => {
            console.log(res);
            if (res.status === 10000) {
                if (res.data !== null && res.data.list !== null) {
                    this.setState({data: res.data.list})
                    let list = [];
                    list = res.data.list
                    if (list.length > 0) {
                        this.setState({isEmpty: false})
                    } else {
                        this.setState({isEmpty: true})

                    }
                } else {

                }

            }
        }).catch(err => {
            console.error(err)
        });
    }


    gotoGame = (url, id, type) => {
        AndroidNativeGameActiviy.openGameWith(url, id, type);
    }

    render() {


        return (
            <View style={{flex: 1}}>
                <View
                    style={{
                        width: deviceValue.windowWidth,
                        height: 35,
                        marginTop: 20,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <View style={{
                        backgroundColor: category_group_divide_line_color,
                        borderRadius: 16,
                        flex: 1,
                        width: deviceValue.windowWidth - 60,
                        height: 30,
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>

                        <TextInput
                            ref={component => this._textInput = component}
                            style={{
                                marginLeft: 12,
                                marginRight: 3,
                                flex: 1,
                                fontSize: 12,
                                width: deviceValue.windowWidth - 110,
                                alignItems: 'center'
                            }}
                            onSubmitEditing={() => {
                                this.onSubmitEditing()
                            }}
                            underlineColorAndroid='transparent'
                            placeholder="请输入游戏名称"
                            maxLength={11}
                            value={this.state.keyWord}
                            onChangeText={(text) => {
                                this.setState({keyWord: text})
                            }}
                            returnKeyType='search'
                        />
                        <Image source={require('../../static/img/ic_menu_search.png')}
                               style={{
                                   resizeMode: 'contain',
                                   width: 20,
                                   height: 20,
                               }}/>
                    </View>


                </View>
                <View style={{
                    height: 1,
                    backgroundColor: category_group_divide_line_color,
                    marginTop: 15,
                    marginBottom: 15
                }}/>
                {this.state.isEmpty ? <ListDataEmptyView/> :
                    <SeachGameGridListScreen
                        searchName={this.state.keyWord}
                        dataList={this.state.data}
                        id={gameId}
                        gotoGame={this.gotoGame.bind(this)}/>}
            </View>
        );
    }
}


const styles = StyleSheet.create({});
