import React, {Component} from 'react';
import {Platform,DeviceEventEmitter,TouchableOpacity, StyleSheet, Text, View, Button, Alert, Image,StatusBar} from 'react-native';
import Dimensions from 'Dimensions'
import Picker from 'react-native-picker';
import TXInput from "../../../tools/TXInput"
import http from '../../../http/httpFetch'
import {mergeStoreData} from "../../../http/AsyncStorage";
import httpBaseManager from '../../../http/httpBaseManager'
import { NavigationActions } from 'react-navigation';
import {TXAlert} from "../../../tools/TXAlert"
import TXToastManager from "../../../tools/TXToastManager"
import MainTheme from "../../../utils/AllColor"
import {ThemeEditTextTextColor} from "../../../utils/AllColor"


let data = ['中国农业银行','中国银行','交通银行','中国建设银行','中国工商银行','中国邮政储蓄银行','招商银行','浦发银行','中国光大银行','中信银行','平安银行','中国民生银行','华夏银行','广发银行','北京银行','上海银行','兴业银行','其他银行'];

export default class NewBankCardScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {

        return {
          title: '新增银行卡',
          headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
          headerBackTitle:null,
          headerLeft: (
            <TouchableOpacity onPress={() => {
                    //navigation.popToTop();
                    navigation.dispatch(NavigationActions.back());
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
        this.state = {name:'',cardNum:'',cardType:'请选择银行种类',address:'',password:''};
    }

    _isChineseName = (name) => {
        var reg = /[\u4e00-\u9fa5]/;
        return reg.test(name);
    };

    _validateCard = (cardNum) => {
        var reg = /^([1-9]{1})(\d{15}|\d{18})$/;
        return reg.test(cardNum);
    }

    _onChange = (label, value) => {
        this.setState({ [label]: value });
    };

    _onBindCard (){
        if (this.state.name.length == 0) {
            TXToastManager.show('请输入持卡人名字');
        }else if(this.state.name.length<2 || this.state.name.length>20){
            TXToastManager.show('请输入2-20位中文名');
        }
        else if(this._isChineseName(this.state.name)==false){
            TXToastManager.show('真实姓名只能为中文!');
        }else if(this._validateCard(this.state.cardNum)==false) {
            TXToastManager.show('请输入正确的银行卡号');
        }else if(this.state.cardType == '请选择银行种类'){
            TXToastManager.show('请选择银行种类');
        }else if(this.state.address.length == 0){
            TXToastManager.show('请输入开户行地址');
        }else if(this.state.password.length != 4){
            TXToastManager.show('请输入4位资金密码');
        }else {
            console.log('验证完成，调用接口');
            let bankType = data.indexOf(this.state.cardType) + 1;
            if (bankType == 18) {
                bankType = 99;//特殊银行编码处理
            }

            let params = {cardUserName:this.state.name,cardNum:this.state.cardNum,
                bankCode:String(bankType),cardAddress:this.state.address,
                password:this.state.password};
            http.post('User/addUserCard', params,true).then((res) => {
                if (res.status === 10000) {
                    TXAlert('添加成功');
                    let newCardNum = this.state.cardNum.substring(0,4) + '***********' + this.state.cardNum.substring(this.state.cardNum.length - 4);//进行加密
                    let cardInfo = {bankName:this.state.cardType,cardNum:newCardNum};
                    mergeStoreData('userInfoState',
                        {
                        bankList:[cardInfo]
                    }).then((result) => {
                        DeviceEventEmitter.emit('bindSuccess','银行卡绑定完成');
                        httpBaseManager.queryBankCardInfo();//先暂时保存下银行卡信息 同时走接口去获取
                        this.props.navigation.dispatch(NavigationActions.back());
                    });


                }else {
                    if (!res) {
                        TXAlert('网络异常，请稍后重试');
                    }else {
                        TXAlert(res.msg);
                    }
                }
            }).catch(err => {
                console.error(err)
            });
        }
    };

    _onChooseBank = ()=> {
        console.log('选择银行');
        Picker.init({
            pickerData: data,
            pickerConfirmBtnColor:[55,55,55,1],
            pickerCancelBtnColor:[88,88,88,1],
            pickerCancelBtnText:'',
            pickerConfirmBtnText:'确定',
            pickerTitleText:'银行列表',
            onPickerConfirm: data => {
                console.log(data);
                this._onChange('cardType',data['0']);
            },
            onPickerCancel: data => {
                console.log(data);
            },
            onPickerSelect: data => {
                console.log(data);
                // this._onChange('cardType',data['0']);
            }
        });
        Picker.show();
    };

    render() {
        return (
            <View style={{height:Dimensions.get('window').height,alignItems: 'center',backgroundColor:'#efeff4'}}>
                
                <TXInput label="银行" detailTextColor={ThemeEditTextTextColor} isUpdate={false} showDetail={true} textAlign='right' onClick={this._onChooseBank} value={this.state.cardType || ''}/>
                <TXInput label="银行卡号" placeholder="请输入银行卡号" textAlign='right' onChange={(value) => this._onChange('cardNum', value)} value={this.state.cardNum || ''}/>
                <TXInput label="真实姓名" placeholder="请输入持卡人姓名" textAlign='right' onChange={(value) => this._onChange('name', value)} value={this.state.name || ''}/>
                <TXInput label="开户行" placeholder="请输入开户行名称" textAlign='right' onChange={(value) => this._onChange('address', value)} value={this.state.address || ''}/>
                <TXInput label="资金密码" secureTextEntry={true} placeholder="4位资金密码" textAlign='right' maxLength={4} onChange={(value) => this._onChange('password', value)} value={this.state.password || ''}/>
                
                <View style={{paddingTop:10,height:60,width:Dimensions.get('window').width}}>
                    <Text style={{paddingLeft:10,fontSize:12,color:MainTheme.tipsSpecialTextColor}}>为了您账户安全,真实姓名需要和绑定银行卡姓名一致，请绑定持卡本人的银行卡并确认卡号，避免后期提款无法到账。</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity  onPress={() => this._onBindCard()}  activeOpacity={0.2} focusedOpacity={0.5}>
                     <View style=  {{borderRadius:10,justifyContent:'center',alignItems:'center',width:Dimensions.get('window').width - 100,height:40,backgroundColor:MainTheme.commonButtonBGColor}}>

                        <Text style={{color:MainTheme.commonButtonTitleColor,fontSize:17}}>立即绑定</Text>
                     </View>
                </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Iuput_stype: {
        height: 100,
        backgroundColor:'#ffffff'
    },
});
