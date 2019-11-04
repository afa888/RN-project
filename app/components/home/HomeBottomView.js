import {Image, Text, TouchableOpacity, View} from "react-native";
import React, {Component} from "react";
import {theme_color} from "../../utils/AllColor";
import deviceValue from "../../utils/DeviceValue";
import {CAGENT} from "../../utils/Config";
import http from "../../http/httpFetch";

export default class HomeBottomView extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {data: []}
    }
    componentDidMount = () => {
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
                        if (res.data[i].src1 === CAGENT) {
                            dicountList.push(res.data[i])
                        }
                    }
                    console.log('dicountListbottom')
                    this.setState({data: dicountList})
                }

            }
        }).catch(err => {
            console.error(err)
        });
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
                <Text style={{fontWeight: 'bold',}}>精选大促</Text>

                <Text style={{fontSize: 12, color: theme_color, flex: 1, marginLeft: 12}}>各种优惠为您撑腰</Text>
                <TouchableOpacity onPress={() => {
                    this.props.gotoDiscout()
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
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                height: 176,
                flexDirection: 'row',
                marginBottom: 30,
            }}>
                <TouchableOpacity style={{
                    resizeMode: 'cover',
                    flex: 1,
                    height: 170,
                    marginBottom: 6,
                    marginLeft: 6,
                }} onPress={() => {
                    this.props.gotoDiscoutDetail(this.state.data[0].img2)
                }}>
                    <Image source={{uri: this.props.dicountUrl[0]}}
                           style={{
                               resizeMode: 'cover',
                               flex: 1,
                           }}/>

                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        marginLeft: 6,
                        width: deviceValue.windowWidth / 2,
                        height: 170,
                        marginBottom: 6,
                    }}>
                    <TouchableOpacity style={{
                        resizeMode: 'cover',
                        flex: 1,
                        height: 82,
                        marginBottom: 1,
                        marginRight: 6
                    }} onPress={() => {
                        this.props.gotoDiscoutDetail(this.state.data[1].img2)
                    }}>
                        <Image source={{uri: this.props.dicountUrl[1]}}
                               style={{
                                   resizeMode: 'cover',
                                   flex: 1,

                               }}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        flex: 1,
                        resizeMode: 'cover',
                        height: 82,
                        marginTop: 3,
                        marginRight: 6
                    }} onPress={() => {
                        this.props.gotoDiscoutDetail(this.state.data[2].img2)

                    }}>
                        <Image source={{uri: this.props.dicountUrl[2]}}
                               style={{
                                   flex: 1,
                                   resizeMode: 'cover',

                               }}/>
                    </TouchableOpacity>

                </View>

            </View>
        </View>)
    }
}
