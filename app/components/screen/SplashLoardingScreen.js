import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Button,
    Alert,
    Image,
    StatusBar,
    ImageBackground,
    DeviceEventEmitter,
    Linking,
    AsyncStorage
} from 'react-native';
import Dimensions from 'Dimensions'
import MainScreen from "./MainScreen";
import SplashScreen from 'react-native-splash-screen'
import SpinnerLoding from "../../tools/SpinnerLoding";
import {CAGENT} from "../../utils/Config";
import DeviceValue from "../../utils/DeviceValue";
import http from "../../http/httpFetch";
import FastImage from 'react-native-fast-image'
import CodePush from 'react-native-code-push'
import {PermissionsAndroid} from 'react-native'
import {URL_IOS_DOWNLOAD_UPDATE_JSON, URL_DOWNLOAD_UPDATE_JSON} from '../../utils/Config'
import AndroidIosNativeGameActiviy from '../../customizeview/AndroidIosNativeGameActiviy';
import TXToastManager from "../../tools/TXToastManager"
import * as Progress from 'react-native-progress';
import {theme_color} from "../../utils/AllColor";
import {getStoreData, setStoreData} from "../../http/AsyncStorage";
import httpBaseManager from "../../http/httpBaseManager";


let codePushOptions = {
    //设置检查更新的频率
    //ON_APP_RESUME APP恢复到前台的时候
    //ON_APP_START APP开启的时候自动更新
    //MANUAL 手动检查然后点击提示框更新
    checkFrequency: CodePush.CheckFrequency.MANUAL
};

class SplashLoardingScreen extends Component<Props> {
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };

    constructor(props) {
        super(props);
        this.state = {
            noticeData: [],
            imgUrl: [],
            isDownApk: false,
            downApkProgress: 0,
            downApkStatus: '下载进度',
            isShowMain: false
        }
    }

    componentDidMount() {
        //   CodePush.notifyAppReady();//为避免警告
        // CodePush.disallowRestart();//禁止重启
        //访问慢,不稳定
        CodePush.checkForUpdate().then((update) => {
            if (!update) {
                console.log("热更新已经是最新版本了")
            } else {
                this.syncImmediate(); //开始检查更新
            }
        });
        //CodePush.allowRestart();//在加载完了，允许重启
        //this.postCarousel()
        if (Platform.OS === "android") {
            this.checkVersion()
        } else if (Platform.OS === "ios") {
            this.checkIOSVersion()
        }
    }

    componentWillMount() {
        //监听事件名为EventName的事件接收Android的下载进度
        DeviceEventEmitter.addListener('EventName', (val) => {
            console.log(val)
            if (val.progress > 0) {
                this.setState({downApkProgress: val.progress, downApkStatus: '下载中'})
                if (val.progress === 100) {
                    this.setState({downApkStatus: '下载完成，准备安装'})
                }
            }
            console.log((Math.floor(val.progress * 100) / 100000))
        });
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    postCarousel = () => {
        let isFirst = true;
        getStoreData('@bannerUrl').then((bannerUrl) => {
            if (bannerUrl.bannerUrl !== undefined) {
                console.log("取值先222")
                console.log(bannerUrl.bannerUrl)
                isFirst = false
                DeviceValue.imgUrl = bannerUrl.bannerUrl;
                this.setState({isShowMain: true})
                SplashScreen.hide()

            }

        });
        let prams = {
            cagent: CAGENT,
            type: 1,
        };
        http.post('mobleWebcomConfig.do', prams).then((res) => {
            if (res && res.status === 10000) {
                console.log(res)
                let imgUrl = []
                if (res.data.length > 0) {
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].src1 === CAGENT) {
                            if (res.data[i].img1 !== "") {
                                imgUrl.push(res.data[i].img1)
                            }
                        }
                    }
                }

                console.log("轮播图开屏", imgUrl)
                DeviceValue.imgUrl = imgUrl;
                setStoreData('@bannerUrl',
                    {
                        bannerUrl: imgUrl
                    }).then((result) => {
                    //登录状态存储成功后 获取用户基本信息
                });
                if (isFirst) {
                    this.setState({isShowMain: true})
                    SplashScreen.hide()

                }
            }
        }).catch(err => {
            console.error(err)
        });
    }



    //更新提示
    showUpdate = (json) => {
        SplashScreen.hide()
        let content = json.content.length == 0 ? '修复部分BUG， 优化了部分功能' : json.content;
        if (json.update === '0') {
            //强制更新
            Alert.alert('版本升级提示', content, [{
                text: '立即更新', onPress: () => {
                    Linking.openURL(json.ios_download);
                }
            }], {cancelable: false});
        } else {
            //非强制更新
            Alert.alert('版本升级提示', content, [{
                text: '立即更新', onPress: () => {
                    Linking.openURL(json.ios_download);
                }
            }, {
                text: '暂不更新', onPress: () => {
                    this.postCarousel()
                }
            }], {cancelable: true});
        }

    }

    checkVersion = () => {
        fetch(URL_DOWNLOAD_UPDATE_JSON, {
            method: 'GET',//如果为GET方式，则不要添加body，否则会出错    GET/POST
            header: {//请求头
            },
        })
            .then((response) => response.json())//将数据转成json,也可以转成 response.text、response.html
            .then((responseJson) => {//获取转化后的数据responseJson、responseText、responseHtml
                console.log(responseJson);
                if (responseJson.apk_download !== undefined && responseJson.versioncode !== undefined&& responseJson.app_url !== undefined) {
                    DeviceValue.baseUrl = responseJson.app_url.split('?')[0]+CAGENT
                    console.log("获取到了基础地址",DeviceValue.baseUrl)
                    let forceUpdate = false
                    AndroidIosNativeGameActiviy.getVersion().then((andriodVersionCode) => {
                        console.log("版本号")
                        console.log(andriodVersionCode)
                        // if (andriodVersionCode < responseJson.versioncode) {//
                        if (false) {//
                            this.checkPermission(responseJson.apk_download)//检查权限
                        } else {
                            this.postCarousel()
                        }
                    })
                }
            }).catch((error) => {
            console.log(error);
            this.postCarousel()
        });
    }

    checkIOSVersion = () => {
        fetch(URL_IOS_DOWNLOAD_UPDATE_JSON, {
            method: 'GET',//如果为GET方式，则不要添加body，否则会出错    GET/POST
            header: {//请求头
            },
        })
            .then((response) => response.json())//将数据转成json,也可以转成 response.text、response.html
            .then((responseJson) => {//获取转化后的数据responseJson、responseText、responseHtml
                console.log(responseJson);
                if (responseJson.ios_download !== undefined && responseJson.versionname !== undefined&& responseJson.app_url !== undefined) {
                    DeviceValue.baseUrl = responseJson.app_url.split('?')[0]+CAGENT
                    AndroidIosNativeGameActiviy.getVersion().then((iosVersionCode) => {

                        iosVersionCode = '1.0.2';
                        console.log("版本号")
                        console.log(iosVersionCode)
                        if (iosVersionCode < responseJson.versionname) {//
                            this.showUpdate(responseJson)//版本更新
                        } else {
                            this.postCarousel()
                        }

                    })

                }

            }).catch((error) => {
            console.log(error);
            this.postCarousel()
        });
    }




    //如果有更新的提示
    syncImmediate = () => {
        CodePush.sync({
                //安装模式
                //ON_NEXT_RESUME 下次恢复到前台时
                //ON_NEXT_RESTART 下一次重启时
                //IMMEDIATE 马上更新
                installMode: CodePush.InstallMode.ON_NEXT_RESTART,
                mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
                //对话框
                updateDialog: {
                    //是否显示更新描述
                    appendReleaseDescription: true,
                    //更新描述的前缀。 默认为"Description"
                    descriptionPrefix: "",
                    //强制更新按钮文字，默认为continue
                    mandatoryContinueButtonLabel: "立即更新",
                    //强制更新消息描述
                    mandatoryUpdateMessage: '',
                    //(String) - 非强制更新时，取消按钮文字. Defaults to “Ignore”.
                    optionalIgnoreButtonLabel: '取消',
                    //(String) - 非强制更新时，确认文字. Defaults to “Install”.
                    optionalInstallButtonLabel: '立即更新',
                    //非强制更新时
                    optionalUpdateMessage: '有新版本了，是否更新',
                    //Alert窗口的标题
                    title: '更新提示',
                },

            },
        );
    }


    /*申请权限
    * 弹出提示框向用户请求某项权限。返回一个promise，最终值为用户是否同意了权限申请的布尔值。
    * 其中rationale参数是可选的，其结构为包含title和message)的对象。
    * 此方法会和系统协商，是弹出系统内置的权限申请对话框，
    * 还是显示rationale中的信息以向用户进行解释。
    * */
    requestReadPermission = async (url) => {
        try {
            //返回string类型
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    //第一次请求拒绝后提示用户你为什么要这个权限
                    'title': '我要读写权限',
                    'message': '没权限我不能工作，同意就好了'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.setState({isDownApk: true})
                SplashScreen.hide()
                AndroidIosNativeGameActiviy.startCheckVersion(url).then((result) => {
                    if (result === "下载出错了") {
                        Alert.alert("下载出错了,请检查网络重新下载")
                    }
                }).catch((error) => {
                    console.log('出错了' + error)
                })
            } else {
                TXToastManager.show('获取读写权限失败,我不能工作哦');
                // Alert.alert("获取读写权限失败,我不能工作哦")
            }
        } catch (err) {
            TXToastManager.show('获取读写权限失败,我不能工作哦');
            // Alert.alert("获取读写权限失败，我不能工作哦")
        }
    }
    //检查权限
    checkPermission = (url) => {
        try {
            //返回Promise类型
            const granted = PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            )
            granted.then((data) => {
                if (!data) {
                    this.requestReadPermission(url)
                } else {
                    this.setState({isDownApk: true})
                    SplashScreen.hide()
                    AndroidIosNativeGameActiviy.startCheckVersion(url).then((result) => {
                        if (result === "下载出错了") {
                            Alert.alert("下载出错了,请检查网络重新下载")
                        }
                    }).catch((error) => {
                        console.log('出错了' + error)
                    })
                }
            }).catch((err) => {
                Alert.alert(err.toString())
            })
        } catch (err) {
        }
    }

    downApkView = () => {
        return <View style={{flex: 1}}>
            <ImageBackground source={require('../../static/img/background2x.png')}
                             style={styles.header_img}>
                <View style={{flex: 1, marginTop: DeviceValue.windowHeight * 0.85, alignItems: 'center'}}>
                    <Text style={{
                        marginBottom: 12,
                        color: theme_color
                    }}>{this.state.downApkStatus}{this.state.downApkProgress + "%"}</Text>
                    <Progress.Bar progress={this.state.downApkProgress / 100} width={DeviceValue.windowWidth * 0.7}
                                  color={theme_color}/>
                </View>
            </ImageBackground>
        </View>
    }

    mainView = () => {
        return <View style={{flex: 1}}>
            {this.state.isShowMain && <MainScreen/>}
            <SpinnerLoding/>
        </View>
    }


    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.isDownApk === true ? this.downApkView() : this.mainView()}

            </View>
        );
    }
}

// 这一行必须要写
SplashLoardingScreen = CodePush(codePushOptions)(SplashLoardingScreen)
export default SplashLoardingScreen

const styles = StyleSheet.create({
    header_img: {
        flex: 1,
        resizeMode: 'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
    },
});
