import React, {Component} from 'react';
import {Platform,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import {CameraRoll,TouchableWithoutFeedback,ImageBackground,Swiper,FlatList,ScrollView,RefreshControl} from 'react-native';
import TXInput from "../../../tools/TXInput"
import FastImage from 'react-native-fast-image'
import Picker from 'react-native-picker';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Tips from './DepositTipsView'
import TXToastManager from "../../../tools/TXToastManager"
import MainTheme from "../../../utils/AllColor"
import {textTitleColor,textThreeHightTitleColor} from "../../../utils/AllColor"
import { PermissionsAndroid } from 'react-native'
import RNFS from 'react-native-fs'


//扫码
export default class PayScan extends Component<Props> {

    constructor(props){
        super(props);
    }

    handleIndexChange = (index) => {
      this.props.onChange('scanSelectedIndex', index)
    }

    // handleIndexChange = (index) => {
    //   this.props.onChange('money', '')
    //   this.props.onChange('payTypeSelectedIndex', index)
    // }

    //此函数用于为给定的item生成一个不重复的key
  //若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标index。
  _keyExtractor = (item, index) => index;
  _keyTypeExtractor = (item, index) => 100 + index;

  _renderTypeItem = ({item, index}) => {

    let choosed = this.props.params.scanSelectedIndex == index;
    let bgcolor =  choosed ? MainTheme.commonButtonBGColor : MainTheme.commonButton2BGColor;
    let textColor = choosed ? MainTheme.commonButtonTitleColor : MainTheme.textTitleColor;
    return (
        <View style={{padding:5}}>
            <View style={{width: 80,
                backgroundColor: bgcolor,justifyContent:'center',
                height: 25}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this.handleIndexChange.bind(this, index)}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'
                    }}>
                    <Text style={{color:textColor}}>{String(item)}</Text>
                    </View>

                </TouchableOpacity>
            </View>
        </View>


    );
  }

   async requestPhotosPermission(pathName) {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.DownloadImage(pathName);
          } else {
            console.log("Photos permission denied")
          }
      } catch (err) {
        console.warn(err)
      }
    }

    DownloadImage=(uri)=> {
     if (!uri) return null;
     return new Promise((resolve, reject) => {
         let timestamp = (new Date()).getTime();//获取当前时间错         
         let random = String(((Math.random() * 1000000) | 0))//六位随机数
         let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
         const downloadDest = `${dirs}/${timestamp+random}.jpg`;
         const formUrl = uri;
         const options = {
             fromUrl: formUrl,             
             toFile: downloadDest,             
             background: true,
             begin: (res) => {

             },
         };
         try {
             const ret = RNFS.downloadFile(options);
             ret.promise.then(res => {
                 // console.log('success', res);
                 // console.log('file://' + downloadDest)
                 var promise = CameraRoll.saveToCameraRoll(downloadDest);
                 promise.then(function(result) {
                    console.log('保存成功！地址如下：\n', result);
                    TXToastManager.show("保存图片成功!");
                 }).catch(function(error) {
                    console.log('error', error);
                    TXToastManager.show("保存失败!");
                 });
                 resolve(res);
             }).catch(err => {
                 reject(new Error(err))
             });
         } catch (e) {
             reject(new Error(e))
         } 
     }) 
    }


   saveToGallery = (pathName) => {
    
    CameraRoll.saveToCameraRoll(pathName, "photo")
                .then(() => {
                  TXToastManager.show("保存图片成功!");
                })
                .catch(err => {
                  console.log("err", err);
                });
    }

    saveImageToGallery = (pathName) => {
        if (Platform.OS == 'ios') {
            this.saveToGallery(pathName);
        }else {
            this.requestPhotosPermission(pathName);
        }
    }

    render () {
        var titleArr = [];
        if(this.props.params.currentPayModel.cagentPayerPOList.length > 0)
        {
            this.props.params.currentPayModel.cagentPayerPOList.map(item => {
                titleArr.push(item.paymentName);
            })
        }
        let payModel = this.props.params.currentPayModel.cagentPayerPOList[this.props.params.scanSelectedIndex];
        let des
        if (payModel && payModel.hasOwnProperty('minquota')) {//可能后台返回没有这个字段
            des = '单笔限额为'+ payModel.minquota +'~'+ payModel.maxquota +'元';
        }else {
            des = '请输入订单金额';
        }

        var imgUrl = this.props.params.currentPayModel.cagentPayerPOList[this.props.params.scanSelectedIndex].accountimg;
        return (
            <ScrollView bounces = {true} style={{flex:1,height:Dimensions.get('window').height - 250}}>
                <View style={{paddingTop:0,height:25,width:Dimensions.get('window').width}}>
                        <Text style={{paddingLeft:10}}>支付渠道</Text>
                    </View>

                    <FlatList
                        style={styles.flatListStyle}
                        data={titleArr}
                        listKey = {'type'}
                        keyExtractor={this._keyTypeExtractor}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                          //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。
                          //如果你的行高是固定的，getItemLayout用起来就既高效又简单.
                          //注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中
                        getItemLayout={(data, index) => ( {length: 44, offset: (44 + 1) * index, index} )}
                        renderItem={this._renderTypeItem}
                    />

                    <View style={{flexDirection:'column',alignItems:'center',paddingTop:20}}>
                        
                        <TouchableWithoutFeedback
                            onLongPress={() => {
                                this.saveImageToGallery(imgUrl);
                            }} 
                        >
                            <FastImage
                                    style={{
                                        width: 150,
                                        height: 150,
                                    }}
                                    source={{
                                        uri: imgUrl,
                                    }}
                                
                            />
                        </TouchableWithoutFeedback>
                        
                        <View style={{width:Dimensions.get('window').width,alignItems:'center',height:30,backgroundColor:MainTheme.backgroundViewColor}}>
                            <Text style={{fontSize:12,color:textThreeHightTitleColor,marginTop:10,alignItems:'center'}}>长按可保存二维码</Text>
                        </View>

                    </View>
                

                <View style={{height:10}}>
                </View>
                <TXInput label="金额"  forbiddenDot={true} keyboardType = 'numeric' placeholder={des} textAlign='right' onChange={(value) => this.props.onChange('money', value)} value={this.props.params.money || ''}/>
                <View style={{height:10}}>
                </View>
                <TXInput label="订单号" placeholder="请输入订单号后四位" maxLength={4} textAlign='right' onChange={(value) => this.props.onChange('orderNum', value)} value={this.props.params.orderNum || ''}/>
                <Tips onShowCustomer={this.props.onShowCustomer} onShowHelp={this.props.onShowHelp} />
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 0
  },
  container: {
    alignItems: 'center',
    justifyContent:'center',

  },
  flatListStyle:{
    color:'red',
    fontSize:16,
    paddingTop:5
  }
});


