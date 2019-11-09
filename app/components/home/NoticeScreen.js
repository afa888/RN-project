import React, {Component} from 'react';
import {FlatList, Image, ImageBackground, RefreshControl, Text, TouchableOpacity, View} from "react-native";
import {category_tab_checked_bg_color, theme_color} from "../../utils/AllColor";
import deviceValue from "../../utils/DeviceValue";
import FastImage from 'react-native-fast-image'
import {CAGENT} from "../../utils/Config";
import http from "../../http/httpFetch";
import {NavigationActions} from "react-navigation";


export default class NoticeScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            index: 0
        };
    }

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {
            headerTitle: <View
                style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}> 公告中心</Text></View>,

            headerLeft: (
                <TouchableOpacity onPress={() => {
                    navigation.dispatch(NavigationActions.back());
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
                <View></View>
            ),
        };
    };

    componentWillMount() {
        let {navigation} = this.props;
        let data = navigation.getParam('data', '');
        this.setState({data: data})
    }

    componentDidMount() {
    }


    rightItem = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => {

            }}>
                <View style={{
                    backgroundColor: "white",
                    width: deviceValue.windowWidth,
                    paddingBottom: 20,
                    paddingTop: 15,
                    paddingLeft: 15,
                    paddingRight: 15
                }}>
                    <Text>
                        {item}
                    </Text>

                </View>
            </TouchableOpacity>

        )
    }
    /*分割线*/
    separatorComponent = () => {
        return <View style={{height: 1, backgroundColor:category_group_divide_line_color }}/>
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <FlatList
                    style={{backgroundColor: "white", paddingBottom: 30}}
                    data={this.state.data}
                    keyExtractor={item => item.img1}
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.rightItem}
                    ItemSeparatorComponent={this.separatorComponent} // 分割线

                />
            </View>
        );
    }
}
