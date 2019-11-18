import React, {Component} from 'react';
import {Image, StyleSheet, View, Text, Alert, DeviceEventEmitter} from "react-native";
import deviceValue from "../../utils/DeviceValue";
import FastImage from 'react-native-fast-image'
import {CAGENT} from "../../utils/Config";
import {textTitleColor, theme_color, ThemeEditTextTextColor, commonButton2BGColor} from "../../utils/AllColor";
import http from "../../http/httpFetch";
import {MarqueeHorizontal, MarqueeVertical} from 'react-native-marquee-ab';
import {getStoreData} from "../../http/AsyncStorage";
import SplashScreen from "react-native-splash-screen";
import type {ViewStyle} from "react-native/Libraries/StyleSheet/StyleSheet";
import BetterBanner from '../../customizeview/BetterBanner'

export default class HomeNoticeView extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            imageView: [],
            noticeData: [],
        }
    }

    componentWillMount() {
        this.postNotice()
        this.initView()
    }

    initView = () => {
        let iView = []
        let iImag = [];
        for (var i = 0; i < deviceValue.imgUrl.length; i++) {
            if (i !== deviceValue.imgUrl.length - 1) {
                iImag.push({uri: deviceValue.imgUrl[i]},)
            }

            iView.push(<View style={styles.slideFastView}><FastImage
                key={i}
                style={styles.slideFastImage}
                source={{
                    uri: deviceValue.imgUrl[i],
                    priority: FastImage.priority.high,

                }}
                resizeMode={FastImage.resizeMode.cover}
            /></View>)
        }
        this.setState({imageView: iImag})
        console.log('lllll轮播')
        console.log(deviceValue.imgUrl)
        this.setState({imageView: iView})
        /*  getStoreData('@bannerUrl').then((bannerUrl) => {
              if (bannerUrl.bannerUrl !== undefined) {
                  console.log("取值先666666222")
                  console.log(bannerUrl.bannerUrl.length)
                  let iView = []
                  for (var i = 0; i < bannerUrl.bannerUrl.length; i++) {
                      let url = bannerUrl.bannerUrl[i]
                      console.log("取值先666666222wwwwwww")
                      console.log(bannerUrl.bannerUrl.length + "     ggg" + url)
                      iView.push(<FastImage
                          key={i}
                          style={styles.slideFastImage}
                          source={{
                              uri: url,
                              priority: FastImage.priority.high,

                          }}
                          resizeMode={FastImage.resizeMode.cover}
                      />)
                  }
                  console.log('轮播图URL')
                  console.log(bannerUrl.bannerUrl)
                  this.setState({imageView: iView})
              }
          });*/

    }

    postNotice = () => {
        let prams = {
            cagent: CAGENT,

        };
        http.post('gonggao.do', prams).then((res) => {
            if (res.status === 10000) {
                console.log(res)
                let imgUrl = []
                if (res.data.length > 0) {
                    let index = 0
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].src1 === CAGENT) {
                            if (res.data[i].rmk !== "") {
                                index++
                                imgUrl.push({label: index, value: index + '、' + res.data[i].rmk})
                            }
                        }
                    }
                }
                console.log("jjjjjjjj")
                console.log(imgUrl)
                this.setState({noticeData: imgUrl})

            }
        }).catch(err => {
            console.error(err)
        });
    }


    renderNoticeItem({item, index}) {
        return (
            <View style={styles.noticeView} key={`entry-${index}`}>
                <Text style={{fontSize: 15, marginLeft: 6}} numberOfLines={1}>{index + 1}、{item}</Text>
            </View>
        );
    }


    render() {

        return (<View>
            <View style={{
                width: deviceValue.windowWidth,
                height: (deviceValue.windowWidth - 30) * (301 / 750) + 20 + 10,
                backgroundColor: 'white',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 10
            }}>
                {this.state.imageView.length > 0 && <BetterBanner
                    style={{width: deviceValue.windowWidth - 30, marginRight: 15, marginLeft: 15,}}
                    bannerHeight={(deviceValue.windowWidth - 30) * (301 / 750) + 20}
                    bannerComponents={this.state.imageView}
                    onPress={(index) => {
                    }}
                    isSeamlessScroll={true}
                    indicatorGroupPosition={'center'}
                    indicatorContainerHeight={20}
                />}

            </View>

            <View style={styles.noticeView}>
                <Image source={require('../../static/img/notification.png')}
                       style={{
                           resizeMode: 'contain',
                           width: 20,
                           height: 20,
                           marginLeft: 6
                       }}/>
                {this.state.noticeData.length > 0 && <MarqueeVertical
                    textList={this.state.noticeData}
                    width={deviceValue.windowWidth - 30 - 40}
                    height={30}
                    delay={3000}
                    direction={'up'}
                    numberOfLines={1}
                    reverse={false}
                    bgContainerStyle={{backgroundColor: 'white'}}
                    textStyle={{fontSize: 12, marginLeft: 12, color: textTitleColor}}
                    style={{marginLeft: 12}}
                    onTextClick={(item) => {
                        if (this.state.noticeData.length > 0) {
                            this.props.showDialog(true, this.state.noticeData)
                        }
                    }}/>}

            </View>
        </View>)
    }
}
const styles = StyleSheet.create({
    wrapper: {
        width: deviceValue.windowWidth - 30,
        height: (deviceValue.windowWidth - 30) * (301 / 750),
        marginRight: 15,
        marginLeft: 15

    },
    slideFastImage: {

        width: deviceValue.windowWidth - 30,
        height: (deviceValue.windowWidth - 30) * (301 / 750),
        borderRadius: 6,
    },
    slideFastView: {
        width: deviceValue.windowWidth - 30,
        height: (deviceValue.windowWidth - 30) * (301 / 750),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        marginRight: 15,
    },
    noticeView: {
        backgroundColor: 'white',
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 9,
        marginBottom: 9,
        borderRadius: 16,
    },
    paginationContainer: {
        paddingVertical: 8,
        position: 'relative', bottom: 20,
        backgroundColor: 'red'
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    }
});


/*
android   TxwNewApp-Android
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ 59DX_8H9j0WuIGP7c5603AdtKqzZda47032d-cfef-49c4-b776-6f80bc1dca31 │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ KhevFYxB713Xuvor6LmrqDqFJ_q_da47032d-cfef-49c4-b776-6f80bc1dca31 │
└────────────┴──────────────────────────────────────────────────────────────────┘



ios   TxwNewApp-Ios
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ 17GnIG6fkdKZkOPO6zmBK0nlZzhJda47032d-cfef-49c4-b776-6f80bc1dca31 │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ wAZ-yQkQFfHRo07Q4SYH20KoYbYyda47032d-cfef-49c4-b776-6f80bc1dca31 │
└────────────┴──────────────────────────────────────────────────────────────────┘


*/

/*code-push release-react TxwNewApp-Android android -t 1.0.1 -d Production --des '老虎bug' -m true
code-push release-react TxwNewApp-Ios ios -t 1.0.0 -d Production --des '右侧菜单' -m true

这里的版本号要特别注意对应build.gradle中设置的versionName "1.0.1"
*/
