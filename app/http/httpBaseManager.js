import React, { AsyncStorage }from 'react-native';
import http from './httpFetch';
import {CAGENT} from '../utils/Config';
import { mergeStoreData, getStoreData, LoginStateKey} from "./AsyncStorage";

export default class httpBaseManager {

    //基础请求, 排除它端登录的情况
    static async baseRequest () {
        getStoreData(LoginStateKey).then((loginInfo) => {
            if (loginInfo.isLogin) {
                getStoreData('userInfoState').then((userInfo) => {

                    if (!userInfo || !userInfo.settedqkpwd) {
                        this.queryQkpwdInfo();
                    }else if (!userInfo || (!userInfo.bankList || userInfo.bankList.length ==0 )) {
                        this.queryBankCardInfo();
                    }
                    this.queryUserInfo();
                });

            }
        });
    }

    //资产情况查询
    static async queryBalance () {
        let params = {platCode:'WALLET'};
        http.get('transfer/getBalance', params).then(res => {
            if(res.status === 10000){
                let oData = res.data;
                let balance = oData.balance;
                if (balance.length > 0) {
                    mergeStoreData('userInfoState',
                    {
                        balance: balance
                    });
                }

            }
        }
    )};

    //用户信息数据获取
    static async queryUserInfo () {
        http.post('User/getUserInfo', null).then(res => {
            if(res.status === 10000){
                let oData = res.data;
                let userName = oData.username;
                let platCode1 = CAGENT.toLowerCase();
                let platCode2 = CAGENT.toUpperCase();
                if (userName.length > CAGENT.length) {
                    if (userName.substring(0,CAGENT.length) === platCode1 ||
                        userName.substring(0,CAGENT.length) === platCode2) {
                        userName = userName.substring(CAGENT.length);
                    }
                }

                let uid = oData.uid;
                //钱包余额
                let wallet = '0.00';
                if (oData.wallet) {
                    wallet = oData.wallet;
                }
                //余额
                let totalBalance = '0.00';
                if (oData.totalBalance) {
                    totalBalance = oData.totalBalance;
                }
                let integral = '0.00';
                if(oData.integral){
                    integral = oData.integral;
                }
                //
                let qq = String(oData.qq || '');
                let weixin = String(oData.weixin || '');
                let mobileStatus = oData.mobileStatus;
                let cardStatus = oData.cardStatus;
                let email = oData.email;
                let realname = oData.realname;
                if (realname === '会员') {
                    realname = '';
                }
                let mobile = oData.mobile;
                let login_time = oData.login_time;
                let reg_date = oData.reg_date;

                mergeStoreData('userInfoState',
                    {
                        userName: userName,
                        uid: uid,
                        balance: wallet,
                        totalBalance: totalBalance,
                        integral: integral,
                        qq:qq,
                        weixin:weixin,
                        mobileStatus:mobileStatus,
                        cardStatus:cardStatus,
                        email:email,
                        realname:realname,
                        mobile:mobile,
                        login_time:login_time,
                        reg_date:reg_date
                    });
                this.queryQkpwdInfo();
            }

        });
    }

//是否设置取款密码
    static async queryQkpwdInfo  () {
        http.post('User/checkQkpwd', null).then(res => {
            if(res.status === 10000){
                let setUpStr = String(res.data);
                let settedqkpwd = false;
                if (setUpStr == 'true') {
                    settedqkpwd = true;
                    this.queryBankCardInfo();//提款密码已经设置，检查绑卡情况
                }
                mergeStoreData('userInfoState',
                    {
                        settedqkpwd: settedqkpwd
                    });
            }
        }
    )};

//银行卡信息查询
    static async queryBankCardInfo ()  {
        http.post('User/getUserCard', null).then(res => {
            if(res.status === 10000){
                let arrList = res.data;
                if (arrList.length == 0) {
                    arrList = [];
                }
                mergeStoreData('userInfoState',
                    {
                        bankList: arrList
                    });

            }
        }
    )};
}

