import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,ScrollView} from 'react-native';
import Dimensions from 'Dimensions'
import TXInput from "../../../tools/TXInput"
import QRCode from 'react-native-qrcode';
import {getStoreData} from "../../../http/AsyncStorage";
import { WebView } from 'react-native-webview';
import MainTheme from "../../../utils/AllColor"

let timeCount = 59*60+59

export default class DepositPayResultScreen extends Component<Props> {
    static navigationOptions = ({ navigation }) => {

        return {
          title: navigation.state.params.title,
          headerBackTitle:null,
          headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
          headerLeft: (
            <TouchableOpacity onPress={() => {
                    navigation.navigate('Home')
                }}>
                    <Image source={require('../../../static/img/titlebar_back_normal.png')}
                           style={{
                               resizeMode: 'contain',
                               width: 20,
                               height: 20,
                               margin: 12
                           }}/>
                </TouchableOpacity>
          ),
        };
      };

    constructor(props){
        super(props);
        this.state = {userName:''};
    }

    componentDidMount () {
      getStoreData('userInfoState').then((userInfo) => {
          this.setState({userName:userInfo.userName});
      });
    }

    render() {
        let params  = this.props.navigation.state.params.data;
        let resType = String(params.resType);
        let hView;
        if (resType == '1') {
            //本地加载html 内容
            return(
                <WebView
                  automaticallyAdjustContentInsets={false}
                  source={{html:params.data}}
                />
              );
        }else if(resType == '4'){
          return (
            <WebView source={{uri:params.data}} androidmixedContentMode='always' />
          );
        }
        else if(resType == '2'){
             return(
                <View style={{backgroundColor:MainTheme.backgroundColor,height:Dimensions.get('window').height}}>
                  <View style={{marginTop:20,alignItems:'center'}}>
                    <QRCode
                      value={params.data}
                      size={150}
                      bgColor="white"
                      fgColor="black"/>
                  </View>
                  <View style={{paddingTop:20}}>
                    <View style={{flexDirection:'row',width:Dimensions.get('window').width}}>
                      <Text style={[styles.Text_style,{width:Dimensions.get('window').width/2}]}>用户名:{this.state.userName}</Text>
                      <Text style={[styles.Text_style,{width:Dimensions.get('window').width/2}]}>金额:{params.amount}</Text>
                    </View>

                    <View style={{paddingTop:10,flexDirection:'row',width:Dimensions.get('window').width}}>
                      <Text style={styles.Text_style}>订单号:{params.orderNo}</Text>
                    </View>


                    <View style={{paddingTop:20}}>
                      {this.props.navigation.state.params.title == '支付宝支付' ?
                        <View>
                          <Text style={styles.Text_RStyle}>二维码仅本次支付有效，不可重复使用</Text>
                          <Text style={[styles.Text_RStyle,{paddingTop:20}]}>(1)截屏二维码。</Text>
                          <Text style={styles.Text_RStyle}>(2)打开支付宝点击扫一扫。</Text>
                          <Text style={styles.Text_RStyle}>(3)点击右上角相册，选择截屏的二维码。</Text>
                          <Text style={styles.Text_RStyle}>(4)支持用另外一台手机扫码。</Text>
                          <Text style={styles.Text_RStyle}>(5)如果出现风险提示退出在请重新扫描二维码。</Text>
                          <Text style={styles.Text_RStyle}>(6)输错金额或重复扫描都会导致上分失败，请各位玩家注意。</Text>
                        </View>
                        :
                        <View>
                          <Text style={[styles.Text_style,{fontSize:20}]}>注意：</Text>
                          <Text style={[styles.Text_style,{paddingTop:10}]}>(1) 二维码只可支付一次，请不要重复支付！！！</Text>
                          <Text style={[styles.Text_style,{paddingTop:10}]}>(2) 请截图保存到相册，在【微信】中扫一扫-照片。</Text>
                        </View>
                      }
                    </View>

                  </View>
                </View>
              );
        }
    }
}

const styles = StyleSheet.create({
    Text_style: {
        fontSize:15,
        paddingLeft:10,
        color:MainTheme.backgroundColor,
    },
    Text_RStyle: {
      fontSize:15,
      paddingLeft:10,
      color:'red',
    },
    contentContainer: {
        paddingVertical: 0,
        backgroundColor:MainTheme.backgroundColor
    }
});
