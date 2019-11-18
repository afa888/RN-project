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
import {textTitleColor, textThreeHightTitleColor} from "../../utils/AllColor";
import AndroidNativeGameActiviy from "../../customizeview/AndroidIosNativeGameActiviy";

let {width, height} = Dimensions.get('window');
let pageSize = 1;
let total = 0;
export default class CategoryGameGridListScreen extends Component<Props> {
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
            data: [],
            total: 0

        };
    }

    //这里的（17/23）是根据图片比例适配的
    rightItem = ({item, index}) => {
        console.log(item)
        return (
            <TouchableOpacity onPress={() => {
                this.props.gotoGame(item)
            }}>
                <View style={{
                    width: deviceValue.windowWidth / 2, flexDirection: 'column',
                    backgroundColor: "white",
                    height: (deviceValue.windowWidth / 2 - 30) * (17 / 23) + 60
                }}>
                    <View style={{flex: 1, alignItems: 'center', flexDirection: 'column'}}>
                        <ImageBackground style={{
                            width: deviceValue.windowWidth / 2 - 30,
                            height: (deviceValue.windowWidth / 2 - 30) * (17 / 23),
                            margin: 15,
                            borderRadius: 6
                        }} source={require('../../static/img/home_img_zwt.png')} resizeMode='cover'>
                            <FastImage
                                style={{
                                    width: deviceValue.windowWidth / 2 - 30,
                                    height: (deviceValue.windowWidth / 2 - 30) * (17 / 23),
                                    borderRadius: 6
                                }}
                                source={{
                                    uri:  item.imageUrl,
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </ImageBackground>

                    </View>
                    <Text style={{marginTop: -8, marginLeft: 15, fontSize: 14, color: textTitleColor}}
                          numberOfLines={1}>{item.name}</Text>
                    <Text style={{marginTop: 1, marginLeft: 15, fontSize: 12, color: textThreeHightTitleColor}}
                          numberOfLines={1}>{item.remark}</Text>
                </View>
            </TouchableOpacity>
        )
    }


    tostTitle = (msg) => {
        this.refs.toast.show(msg);
    }


    httpRefresh = () => {
        this.setState({
            refreshing: false,
            data: this.props.dataList,
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

        if (this.state.data !== null && this.state.data.length >= 12) {
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
                    numColumns={2}
                    style={{backgroundColor: "white"}}
                    data={this.state.data}
                    ListHeaderComponent={this.renderHeader}//头部
                    ListFooterComponent={this.renderFooter}//尾巴
                    keyExtractor={item => item.gameId}
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.rightItem}
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
