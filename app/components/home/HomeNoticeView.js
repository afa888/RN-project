import React, {Component} from 'react';
import {Image, StyleSheet, View, Text, Alert, DeviceEventEmitter} from "react-native";
import deviceValue from "../../utils/DeviceValue";
import FastImage from 'react-native-fast-image'
import {CAGENT} from "../../utils/Config";
import {textTitleColor, ThemeEditTextTextColor} from "../../utils/AllColor";
import http from "../../http/httpFetch";
import Swiper from "react-native-swiper";
import {MarqueeHorizontal, MarqueeVertical} from 'react-native-marquee-ab';
import {getStoreData} from "../../http/AsyncStorage";
import SplashScreen from "react-native-splash-screen";


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
        for (var i = 0; i < deviceValue.imgUrl.length; i++) {
            iView.push(<FastImage
                key={i}
                style={styles.slideFastImage}
                source={{
                    uri: deviceValue.imgUrl[i],
                    priority: FastImage.priority.high,

                }}
                resizeMode={FastImage.resizeMode.cover}
            />)
        }
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

    renderItem({item, index}) {
        return (
            <View style={styles.slideFastImage}>
                <FastImage
                    style={styles.slideFastImage}
                    source={{
                        uri: item,
                        priority: FastImage.priority.high,

                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
        );
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
            <View style={{height: deviceValue.windowWidth * 0.4}}>
                {this.state.imageView.length > 0 && <Swiper style={styles.wrapper}
                                                            showsButtons={false}
                                                            autoplay={true}
                                                            showsPagination={true}
                                                            autoplayTimeout={4}
                                                            loadMinimal={true}
                                                            removeClippedSubviews={false}
                                                            dot={<View style={{
                                                                backgroundColor: 'rgba(0,0,0,.5)',
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: 4,
                                                                marginLeft: 3,
                                                                marginRight: 3,
                                                                marginTop: 3,
                                                                marginBottom: 3,
                                                            }}/>}
                                                            activeDot={<View style={{
                                                                backgroundColor: 'gray',
                                                                width: 8,
                                                                height: 8,
                                                                borderRadius: 4,
                                                                marginLeft: 3,
                                                                marginRight: 3,
                                                                marginTop: 3,
                                                                marginBottom: 3
                                                            }}/>}
                                                            paginationStyle={{
                                                                bottom: 3,
                                                            }}
                >
                    {this.state.imageView}
                </Swiper>}
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
    wrapper: {height: deviceValue.windowWidth * 0.4},
    slideFastImage: {
        width: deviceValue.windowWidth,
        height: deviceValue.windowWidth * 0.4,
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
android   TxwApp-Android
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ Xwfz7ALB9oJaP7G8A7bFYPeYQHo-da47032d-cfef-49c4-b776-6f80bc1dca31 │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ 5rCSFvlkRjP2-j2xxDZCUPPzsjIOda47032d-cfef-49c4-b776-6f80bc1dca31 │



ios   TxwApp-Ios
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ NbX0t2wa8f1gWrVzktpD4rDpa-Akda47032d-cfef-49c4-b776-6f80bc1dca31 │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ NoVa5UDgVQItvFCsI413AjcLVgQ6da47032d-cfef-49c4-b776-6f80bc1dca31 │
└────────────┴──────────────────────────────────────────────────────────────────┘

*/

/*code-push release-react TxwApp-Android android -t 1.0.0 -d Production --des '右侧菜单' -m true
code-push release-react TxwApp-Ios ios -t 1.0.0 -d Production --des '右侧菜单' -m true
*/
