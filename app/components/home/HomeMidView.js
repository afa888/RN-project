import {FlatList, Image, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import React, {Component} from "react";
import {theme_color} from "../../utils/AllColor";
import deviceValue from "../../utils/DeviceValue";
import FastImage from 'react-native-fast-image'

export default class HomeMidView extends Component<Props> {
    gridItem = ({item, index}) => {
        console.log(index)
        return (
            <View style={{
                width: deviceValue.windowWidth / 4, flexDirection: 'row',
                backgroundColor: 'white',
                height: 90, alignItems: 'center', justifyContent: 'center'
            }}>
                <TouchableOpacity onPress={ ()=>{this.props.goMoreGame(item)}  }>
                <View style={{flex: 1, alignItems: 'center', flexDirection: 'column'}}>
                    <ImageBackground style={{
                        marginTop: 10,
                        width: deviceValue.windowWidth / 4 - 50,
                        height: deviceValue.windowWidth / 4 - 50,
                    }} source={require('../../static/img/index_loading.png')} resizeMode='cover'>
                        <FastImage
                            style={{
                                width: deviceValue.windowWidth / 4 - 50,
                                height: deviceValue.windowWidth / 4 - 50,
                            }}
                            source={{
                                uri: item.imageUrl !== "" ? item.imageUrl : '',
                                priority: FastImage.priority.normal,

                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            onError={() => {
                                console.log("出错了")
                            }}
                        />
                    </ImageBackground>
                    <Text style={{marginTop: 6}}>{item.name}</Text>


                </View>
                </TouchableOpacity>

            </View>
        )
    }

    render() {
        return (<View>
            <View style={{
                backgroundColor: 'white',
                height: 40,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 12,
                alignItems: 'center',
                paddingLeft: 12,
                paddingRight: 12
            }}>
                <Text style={{fontWeight: 'bold',}}>平台推荐</Text>

                <Text style={{fontSize: 12, color: theme_color, flex: 1, marginLeft: 12}}>精彩荟萃，激情无限</Text>
                <TouchableOpacity onPress={ ()=>{this.props.goMoreGame('navigate')}  }>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{color: theme_color, fontSize: 14}}>更多</Text>
                        <Image source={require('../../static/img/arrow_more.png')}
                               style={{
                                   resizeMode: 'contain',
                                   width: 12,
                                   height: 12,
                                   marginLeft: 6
                               }}/>
                    </View>
                </TouchableOpacity>
            </View>

            <FlatList
                style={{backgroundColor: 'white'}}
                numColumns={4}
                data={this.props.data}
                keyExtractor={item => item.id}
                enableEmptySections={true}//数据可以为空
                renderItem={this.gridItem}
            />
        </View>)
    }
}
