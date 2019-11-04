import React, {Component, ReactPage, FlowPage, JestPage} from 'react';
import {Platform, StyleSheet, View, Text, Image, TouchableOpacity, Alert, TextInput} from 'react-native';
import {theme_color, category_group_divide_line_color} from '../../utils/AllColor'
import CategoryScreen from './SeachGameGridListScreen'
import AndroidNativeGameActiviy from '../../customizeview/AndroidIosNativeGameActiviy';
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view'
import deviceValue from "../../utils/DeviceValue";
import http from "../../http/httpFetch";

let gameId

export default class SeachGameListScreen extends Component<Props> {
    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {

            headerLeft: (<View
                style={{flex: 1, width: deviceValue.windowWidth - 80, height: 40, justifyContent: 'center'}}>
                <View style={{
                    backgroundColor: category_group_divide_line_color,
                    borderRadius: 16,
                    marginLeft: 12,
                    flex: 1,
                    width: deviceValue.windowWidth - 60,
                    height: 30,
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <Image source={require('../../static/img/ic_menu_search.png')}
                           style={{
                               resizeMode: 'contain',
                               width: 20,
                               height: 20,
                               marginLeft: 12
                           }}/>
                    <TextInput
                        ref={component => this._textInput = component}
                        style={{
                            marginLeft: 12,
                            marginRight: 3,
                            flex: 1,
                            fontSize: 14,
                            width: deviceValue.windowWidth - 90,
                            alignItems: 'center'
                        }}
                        onSubmitEditing={() => {
                            navigation.state.params.onSubmitEditing()
                        }}
                        underlineColorAndroid='transparent'
                        placeholder="请输入游戏名称"
                        maxLength={11}
                        value={navigation.state.keyWord}
                        onChangeText={(text) => navigation.setParams({keyWord: text})}
                        returnKeyType='search'
                    />
                </View>


            </View>),
            headerRight: (
                <TouchableOpacity style={{marginRight: 12}} onPress={() => {
                    navigation.goBack()
                }}>

                    <Text>取消</Text>

                </TouchableOpacity>
            ),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            keyword: ''
        };
    }

    onSubmitEditing = () => {
        let {navigation} = this.props;
        let keyWord = navigation.getParam('keyWord', '');
        this.setState({keyWord: keyWord})
        this.httpRefresh(keyWord)
    }

    componentWillMount() {
        let {navigation} = this.props;
        let otherParam = navigation.getParam('otherParam', '');
        let gameName = navigation.getParam('gameName', '');
        let id = navigation.getParam('gameId', '');

        gameId = id
      // this.httpRefresh()
        this.props.navigation.setParams({onSubmitEditing: this.onSubmitEditing, keyWord: ''})

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
                this.setState({data: res.data.list})
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
                {this.state.data.length>0&&<CategoryScreen
                    searchName={this.state.keyWord}
                    dataList={this.state.data}
                    id={gameId}
                    gotoGame={this.gotoGame.bind(this)}/>}
            </View>
        );
    }
}


const styles = StyleSheet.create({});
