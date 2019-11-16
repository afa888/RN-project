import {FlatList, Image, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import React, {Component} from "react";
import {textTitleColor, theme_color} from "../../utils/AllColor";
import deviceValue from "../../utils/DeviceValue";
import FastImage from 'react-native-fast-image'
/*position: 'absolute' 相对于父布局的绝对布局 */

export default class HomeMidView extends Component<Props> {
    gridItem = ({item, index}) => {
        console.log(index)
        return (
            <View style={{
                width: deviceValue.windowWidth / 4,
                backgroundColor: 'white',
                height: 90,
            }}>

                <View style={{
                    width: deviceValue.windowWidth / 4, flexDirection: 'row',
                    backgroundColor: 'white',
                    height: 90, alignItems: 'center', justifyContent: 'center'
                }}>
                    <TouchableOpacity onPress={() => {
                        this.props.goMoreGame(item)
                    }}>
                        <View style={{flex: 1, alignItems: 'center', flexDirection: 'column'}}>
                            <ImageBackground style={{
                                marginTop: 10,
                                backgroundColor: 'white',
                                width: deviceValue.windowWidth / 4 - 62,
                                height: deviceValue.windowWidth / 4 - 62,
                            }} source={require('../../static/img/index_loading.png')} resizeMode='cover'>
                                <FastImage
                                    style={{
                                        width: deviceValue.windowWidth / 4 - 62,
                                        height: deviceValue.windowWidth / 4 - 62,
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
                            <Text style={{marginTop: 6,fontSize:12}}>{item.name}</Text>


                        </View>
                    </TouchableOpacity>


                </View>
                {item.hot === 1 && <Image source={require('../../static/img/small_red_dot.png')}
                                          style={{
                                              position: 'absolute', left: deviceValue.windowWidth / 4 - 20,
                                              resizeMode: 'contain',
                                              width: 10,
                                              height: 10,
                                              marginTop: 6
                                          }}/>}
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
                alignItems: 'center',
                paddingLeft: 15,
                paddingRight: 15
            }}>
                <View style={{backgroundColor: theme_color, height: 20, width: 5}}/>
                <Text style={{fontWeight: 'bold', marginLeft: 5, color: textTitleColor}}>平台推荐</Text>

                <Text style={{fontSize: 12, color: theme_color, flex: 1, marginLeft: 12}}>精彩荟萃，激情无限</Text>
                <TouchableOpacity onPress={() => {
                    this.props.goMoreGame('navigate')
                }}>
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
