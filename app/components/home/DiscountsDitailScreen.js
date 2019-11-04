import React, {Component} from 'react';
import {FlatList, Image, ImageBackground, RefreshControl, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {category_group_divide_line_color, category_tab_checked_bg_color, theme_color} from "../../utils/AllColor";
import deviceValue from "../../utils/DeviceValue";
import FastImage from 'react-native-fast-image'
import {CAGENT} from "../../utils/Config";
import http from "../../http/httpFetch";
import Toast from "react-native-easy-toast";

let url
export default class DiscountsDitailScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
        };
    }

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {
            headerTitle: <View
                style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>活动详情</Text></View>,

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
            headerRight: (
                <TouchableOpacity onPress={() => {
                    navigation.navigate('SeachGameList', {gameId: searchId})
                }}>
                    <Image
                        style={{
                            resizeMode: 'contain',
                            width: 20,
                            height: 20,
                            marginRight: 12
                        }}/>
                </TouchableOpacity>
            ),
        };
    };

    componentWillMount() {
        let {navigation} = this.props;
        url = navigation.getParam('url', '');
    }

    componentDidMount() {

        Image.getSize(url, (width, height) => {
            console.log(width + "    " + height)
            console.log(deviceValue.windowWidth + "    " + deviceValue.windowHeight)
            let myHeight = height * deviceValue.windowWidth / width;
            this.setState({height: myHeight})
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.height > 0 &&
                <ScrollView style={{flex: 1, backgroundColor: category_group_divide_line_color}}>
                    <Image
                        source={{
                            uri: url,

                        }}
                        style={{width: deviceValue.windowWidth, height: this.state.height, resizeMode: 'cover',}}
                    />
                </ScrollView>}
            </View>

        );
    }


}
