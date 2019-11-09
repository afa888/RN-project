import React, {Component} from 'react';
import {FlatList, Image, ImageBackground, RefreshControl, Text, TouchableOpacity, View} from "react-native";
import {category_tab_checked_bg_color, textTitleColor, theme_color} from "../../utils/AllColor";
import deviceValue from "../../utils/DeviceValue";
import FastImage from 'react-native-fast-image'
import {CAGENT} from "../../utils/Config";
import http from "../../http/httpFetch";


export default class DiscountsScreen extends Component<Props> {
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
                <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}> 最新优惠</Text></View>,

            headerLeft: (
                <View></View>
            ),
            headerRight: (
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12
                    }}>
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
                            <Text style={{color: textTitleColor, fontSize: 8, marginTop: 2}}>客服</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ),
        };
    };

    componentDidMount() {
        this.httpGridGame()
    }


    httpGridGame = () => {
        let prams = {
            cagent: CAGENT,
            type: 2,
        };
        let dicountList = [];
        http.post('mobleWebcomConfig.do', prams).then(res => {
            console.log(res);
            if (res.status === 10000) {
                if (res.data !== undefined && res.data.length > 0) {
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].src1 === 'TXW') {
                            dicountList.push(res.data[i])
                        }
                    }
                    console.log('dicountList')
                    console.log(dicountList)
                    this.setState({data: dicountList})
                }

            }
        }).catch(err => {
            console.error(err)
        });
    }
    rightItem = ({item, index}) => {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('DiscountDetail', {url: item.img2})
            }}>
                <View style={{
                    backgroundColor: category_tab_checked_bg_color, width: deviceValue.windowWidth,
                    height: deviceValue.windowWidth / 1.5,
                }}>
                    <ImageBackground style={{
                        margin: 6,
                        flex: 1,
                        width: deviceValue.windowWidth,
                        height: (deviceValue.windowWidth - 12) * (450 / 750),
                    }} source={require('../../static/img/loading_image.png')} resizeMode='cover'>


                        <FastImage
                            style={{
                                width: deviceValue.windowWidth - 12,
                                height: (deviceValue.windowWidth - 12) * (450 / 750),
                                flex: 1
                            }}
                            source={{
                                uri: item.img1.startsWith('//') ? "http:" + item.img1 : item.img1,
                                priority: FastImage.priority.normal,

                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </ImageBackground>
                </View>
            </TouchableOpacity>

        )
    }

    render() {


        return (
            <View style={{flex: 1}}>
                <FlatList
                    style={{backgroundColor: category_tab_checked_bg_color, paddingBottom: 30}}
                    data={this.state.data}
                    keyExtractor={item => item.img1}
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.rightItem}
                />
            </View>
        );
    }
}
