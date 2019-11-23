import React, {Component} from 'react';
import {
    Modal,
    Text,
    TouchableHighlight,
    View,
    StyleSheet,
    TextInput,
    BackAndroid, TouchableOpacity, Image, ScrollView, ImageBackground
} from 'react-native';
import {NavigationActions} from "react-navigation";
import ScratchView from 'react-native-scratch';
import {category_group_divide_line_color, category_tab_checked_bg_color, theme_color} from "../utils/AllColor";
import {TXAlert} from "../tools/TXAlert"
import http from "../http/httpFetch";
import {getStoreData,mergeStoreData} from "../http/AsyncStorage";

import {Reg_phoneNum_validate} from "../utils/Validate";
import {CAGENT} from '../utils/Config'
import TXProgressHUB from '../tools/TXProgressHUB';


let Dimensions = require('Dimensions');
let SCREEN_WIDTH = Dimensions.get('window').width;//宽
let SCREEN_HEIGHT = Dimensions.get('window').height;//高

let timeData
export default class ModalScratch extends Component<Props> {

    // 构造
    constructor(props) {
        super(props);
        this.state = {
            time: 60,
            scrachStatus:'0',// 0 待刮，1、已刮待领，2、确认领取留下联系方式
            phoneNum:'',
            code:'',
        }
    }
    componentWillMount() {

    }

    componentDidMount() {
        getStoreData('userInfoState').then((userInfo) => {
          this.setState({phoneNum:userInfo.mobile});
      });
    }


    componentWillUnmount() {

    }

    hideScrach = () => {
        this.props._dialogCancle()
    }

    static defaultProps = {
        _scrachVisible: true,
        _verifyPhone:1,
    }

    onImageLoadFinished = ({ id, success }) => {
        // Do something
    }
 
    onScratchProgressChanged = ({ value, id }) => {
        // Do domething like showing the progress to the user
        console.log(value);
        if (value > 30) {
            this.setState({scrachStatus:'1'});
        }
    }
 
    onScratchDone = ({ isScratchDone, id }) => {
        // Do something
        console.log('完成');
    }
 
    onScratchTouchStateChanged = ({ id, touchState }) => {
        // Example: change a state value to stop a containing
        // FlatList from scrolling while scratching
        this.setState({ scrollEnabled: !touchState });
    }

    onChangeText = (text) => {
        this.setState({phoneNum:text});
    }

    onChangeCode = (text) => {
        this.setState({code:text});
    }

    onCommitPhone = () => {
        let needCheck = true;
        if (this.props.scratchData.verifyPhone === 1) {
            needCheck = false;
        }
        if (needCheck && this.state.phoneNum.length != 11) {
            TXAlert('手机号输入不正确，请重新输入');
        }else if(needCheck && this.state.code.length < 4){
            TXAlert('请输入您收到的短信验证码!');
        }else {
            let prams;
            if (this.props.scratchData.verifyPhone === 0) {
                prams = {activityId:this.props.scratchData.activityId,activityAmount:this.props.scratchData.usermoney,
                phoneNo:this.state.phoneNum,code:this.state.code};
            }else {
                prams = {activityId:this.props.scratchData.activityId,activityAmount:this.props.scratchData.usermoney};
            }
            TXProgressHUB.showSpinIndeterminate('领取彩金中...');
            http.post('gglActivity/receiveReward.do', prams).then(res => {
                console.log("刮刮乐领取")
                console.log(res);
                TXProgressHUB.dismiss();
                if (res && res.status === 10000) {
                    TXProgressHUB.show('领取成功,将尽快完成审核并计入您的主账户中!')
                    this.props._dialogSaveScratch();
                }else {
                    if (!res) {
                        TXProgressHUB.netError();
                    }else {
                        TXProgressHUB.show(res.msg);
                    }
                }
            }).catch(err => {
                console.error(err)
            });
        }
    }

    getValidateCode = (phoneNum) => {
        if (this.state.time == 60) {
            if (Reg_phoneNum_validate(phoneNum)) {
            let prams = {mobileNo:phoneNum,cagent:CAGENT};
            // TXProgressHUB.showSpinIndeterminate();
            TXProgressHUB.showSpinIndeterminate('loading');
            http.post('Mobile/sendMessageCode', prams,true).then(res => {
                console.log("获取验证码")
                console.log(res);
                TXProgressHUB.dismiss();
                if (res && res.status === 10000) {
                    // TXAlert('验证码发送成功!');
                    TXProgressHUB.show('验证码发送成功!');
                    this.sendTimeCodeDown();
                }else {
                    if (!res) {
                        TXProgressHUB.netError();
                    }else {
                        TXProgressHUB.show(res.msg);
                    }
                }
            }).catch(err => {
                console.error(err)
            });
        }
        }
        
    }

    sendTimeCodeDown = () => {
        if (this.state.time == 60) {
            this.timer = setInterval(() => {
            this.setState((preState) =>({
                time: preState.time - 1,
            }),() => {
                if(this.state.time <= 0){
                    clearInterval(this.timer);
                    this.setState({time:60});
                }
            });
        }, 1000)
        }
    }

    changeScratchStatus = () => {
        // 根据注册类型 是否需要验证手机号
        if (this.props._verifyPhone === 0) {

            this.setState({scrachStatus:'2'});
            
        }else {
            //直接领取
            this.onCommitPhone();
        }
    }

    render() {
        // 根据状态显示不同界面
        let title;
        let buttonView;
        if (this.state.scrachStatus === '0') {
            title = '您有一次刮奖机会哦';
        }else if(this.state.scrachStatus === '1'){
            title = '您已刮中奖品';
        }else {
            title = '请留下联系方式领奖';
        }

        let time = this.state.time;
        let countDownTitle = time == 60 ? '获取短信验证码' : time + '秒后重新获取';

        let bgImage;
        if (this.state.scrachStatus == '0') {
            buttonView =null;
            bgImage = require('../static/img/ggl_01.png');
        }else if(this.state.scrachStatus == '1') {
            bgImage = require('../static/img/ggl_02.png');
               buttonView = <TouchableOpacity onPress={() => {
                                        // 根据注册类型 是否需要验证手机号
                                        this.changeScratchStatus();
                                        
                                    }}>
                                    <View style={{marginTop:30,alignItems:'center'}}>
                                        <Image source={require('../static/img/ggl_anniu.png')}
                                           style={{
                                               resizeMode: 'contain',
                                               width: 169,
                                               height: 38,
                                           }}/>
                                           <View style={{width: 169,
                                               height: 38,
                                               position:'absolute',alignItems:'center',justifyContent:'center'}}>
                                                <Text style={{color:'#3D2711',fontSize:18}}>立即领奖</Text>
                                           </View>
                                    </View>
                                        
                                </TouchableOpacity>
        }else {
            bgImage = require('../static/img/ggl_03.png');
            buttonView = <TouchableOpacity onPress={() => {
                        this.onCommitPhone();
                    }}>
                    <View style={{marginTop:30,alignItems:'center'}}>
                        <Image source={require('../static/img/ggl_anniu.png')}
                           style={{
                               resizeMode: 'contain',
                               width: 169,
                               height: 38,
                           }}/>
                           <View style={{width: 169,
                               height: 38,
                               position:'absolute',alignItems:'center',justifyContent:'center'}}>
                                <Text style={{color:'#3D2711',fontSize:18}}>确定</Text>
                           </View>
                    </View>
                        
                </TouchableOpacity>
        }

        return (
            <Modal style={{ zIndex: 1 }}
                transparent={true}
                visible={this.props._scrachVisible}
                onRequestClose={() => {
                }} //如果是Android设备 必须有此方法

            >
                <View style={styles.bg}>
                    <ImageBackground style={styles.dialog}
                                     source={bgImage}
                                     resizeMode='contain'>
                        <TouchableOpacity onPress={() => {
                                this.hideScrach()
                            }}>
                            <View style={{marginTop:30,marginRight:20,alignItems:'flex-end',justifyContent:'flex-end'}}>
                                <Image source={require('../static/img/del.png')}
                                   style={{
                                       resizeMode: 'contain',
                                       width: 35,
                                       height: 35,
                                       marginTop: 10,
                                   }}/>
                            </View>
                                
                        </TouchableOpacity>
                        <View style={styles.dialogTitleView}>
                            <Text style={{color:'#F5D453',fontSize:14}}></Text>

                        </View>
                        <View style={styles.scratchView}>
                            
                            <Image source={require('../static/img/ggl_lq.png')}
                                       style={styles.scratchViewPic}/>
                            {this.state.scrachStatus == '2' ? 
                                <View style={[styles.scratchViewPic,{flexDirection:'column',position: 'absolute'}]}>
                                    <View style={{marginTop:20,flexDirection:'row',justifyContent:'center'}}>
                                        <TextInput maxLength={11}
                                          style={{backgroundColor:'white',width:80,height: 22,fontSize:10, borderWidth: 0,paddingVertical: 0 }}
                                          onChangeText={text => this.onChangeText(text)} 
                                          value = {this.state.phoneNum}
                                          />
                                        <TouchableOpacity onPress={() => {
                                                this.setState({phoneNum:''});
                                            }}>
                                            <View style={{alignItems:'center'}}>
                                                   <View style={{width: 80,
                                                       height: 22,alignItems:'center',justifyContent:'center',backgroundColor:'#DBA83F'}}>
                                                        <Text style={{color:'#3D2711',fontSize:10}}>更改手机号</Text>
                                                   </View>
                                            </View>
                                                
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{marginTop:20,flexDirection:'row',justifyContent:'center'}}>
                                        <TextInput maxLength={6}
                                          style={{paddingVertical: 0,marginRight:5,backgroundColor:'white',width:65,height: 22,fontSize:10, borderWidth: 0 }}
                                          onChangeText={text => this.onChangeCode(text)}                                        />
                                        <View style={{alignItems:'center'}}>
                                                   <View style={{width: 90,
                                                       height: 22,alignItems:'center',justifyContent:'center',backgroundColor:'#DBA83F'}}>
                                                        <TouchableOpacity onPress={() => {
                                                                this.getValidateCode(this.state.phoneNum);
                                                            }}>
                                                            <View style={{alignItems:'center'}}>
                                                                   <View style={{width: 90,
                                                                       height: 22,alignItems:'center',justifyContent:'center',backgroundColor:'#DBA83F'}}>
                                                                        <Text style={{color:'#3D2711',fontSize:10}}>{countDownTitle}</Text>
                                                                   </View>
                                                            </View>
                                                                
                                                        </TouchableOpacity>
                                                   </View>
                                            </View>


                                    </View>
                                </View>
                            :
                                <View style={[styles.scratchViewPic,{flexDirection:'column',position: 'absolute',alignItems:'center',justifyContent:'center'}]}>
                                        <Text style={{color:'#EFD55A',fontSize:15,fontWeight:'bold'}}>恭喜您获得彩金</Text>
                                        <View style={{flexDirection:'row',marginTop:10,alignItems:'center'}}>
                                            <Text style={{color:'#EFD55A',fontSize:15}}>￥</Text>
                                            <Text style={{color:'#EFD55A',fontSize:30,fontWeight:'bold'}}>{this.props.scratchData.usermoney}</Text>
                                        </View>
                                        
                                </View>
                            }
                            {this.state.scrachStatus == '0' ?
                                <ScratchView
                                id={1} // ScratchView id (Optional)
                                brushSize={10} // Default is 10% of the smallest dimension (width/height)
                                threshold={70} // Report full scratch after 70 percentage, change as you see fit. Default is 50
                                fadeOut={false} // Disable the fade out animation when scratch is done. Default is true
                                placeholderColor="#b5b5b4" // Scratch color while image is loading (or while image not present)
                                imageUrl="https://image.58sheng.cn/html/mobileTXW/image/photo_2019-11-16_16-56-55.jpg" // A url to your image (Optional)
                                resourceName="" // An image resource name (without the extension like '.png/jpg etc') in the native bundle of the app (drawble for Android, Images.xcassets in iOS) (Optional)
                                resizeMode="cover|contain|stretch" // Resize the image to fit or fill the scratch view. Default is stretch
                                onImageLoadFinished={this.onImageLoadFinished} // Event to indicate that the image has done loading
                                onTouchStateChanged={this.onTouchStateChangedMethod} // Touch event (to stop a containing FlatList for example)
                                onScratchProgressChanged={this.onScratchProgressChanged} // Scratch progress event while scratching
                                onScratchDone={this.onScratchDone} // Scratch is done event
                            />
                             : null}
                            
                        </View>
                        <View>
                            {buttonView}
                        </View>
                        
                    </ImageBackground>
                    
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    bg: {  //全屏显示 半透明 可以看到之前的控件但是不能操作了
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(52,52,52,0.5)',  //rgba  a0-1  其余都是16进制数
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    dialog: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * (1144 / 737),
        borderRadius: 8,
    },
    dialogTitleView: {
        width: 137,
        height: 14,
        flexDirection: 'column',
        marginTop:185 * SCREEN_WIDTH / 375 - 18,
        marginLeft:72 * SCREEN_WIDTH / 375
    },
    scratchView:{
        width:180 * SCREEN_WIDTH / 375,
        height:101 * SCREEN_WIDTH / 375,
        marginTop:29 * SCREEN_WIDTH / 375,
        marginLeft:97 * SCREEN_WIDTH / 375
    },
    scratchViewPic:{
        resizeMode: 'contain',
        width:180 * SCREEN_WIDTH / 375,
        height:101 * SCREEN_WIDTH / 375,
    },
    scratchViewRedBG:{
        backgroundColor:'#a00000',
        width:180 * SCREEN_WIDTH / 375+10,
        height:101 * SCREEN_WIDTH / 375+10,
    },
    dialogTitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#000000',
        marginLeft: 12,
    }
});
