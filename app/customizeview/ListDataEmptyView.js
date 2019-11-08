import React, {Component} from 'react';
import {Text, findNodeHandle, Image, TouchableOpacity, UIManager, View} from "react-native";
import deviceValue from "../utils/DeviceValue";
import {textTitleColor, textThreeHightTitleColor} from '../utils/AllColor'


export default class ListDataEmptyView extends Component<Props> {
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };

    constructor(props) {
        super(props);

    }


    componentWillMount() {
    }

    componentWillUnmount() {
    }


    render() {
        return (
            <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 30
                }}>
                    <Image source={require('../static/img/search_img_404.png')}
                           style={{
                               resizeMode: 'contain',
                               width: deviceValue.windowWidth / 2,
                               height: deviceValue.windowWidth / 2 * (234 / 364),
                               margin: 12
                           }}/>
                    <Text style={{color: textTitleColor, fontSize: 16}}>没有找到匹配的游戏</Text>
                    <Text style={{color: textThreeHightTitleColor}}>建议您修改关键词重新搜索</Text>
                </View>
            </View>
        );
    }
}
