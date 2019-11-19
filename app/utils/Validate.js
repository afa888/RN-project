import TXToastManager from "../tools/TXToastManager";

const Reg = {
    username: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,11}$/,//用户名
    password: /^[0-9A-Za-z]{6,12}$/,//密码
    referralCode: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{4,15}$/,//推荐码
    realName: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/,//真实姓名  2到20位汉字，中间可以加点
    mobile: /^1[2-9][0-9]{9}$/,//手机号
    code: /^[0-9]{4}$/,//验证码
    email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
    card: /^[0-9]{14,20}$/,//卡号
    cardNum: /^[0-9]{4,20}$/,
    chineseName: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,10}$/,//中文名称
    wechat: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/, //微信号
    QQ: /^[0-9]{4,12}$/ //QQ号
};

/**
 * 登录验证
 * @param username
 * @param password
 * @return {boolean}
 * @constructor
 */
export const Login_validate = (username,password) => {
    if(username === ''){
        TXToastManager.show('请输入用户名');
        return false;
    }
    if(password === ''){
        TXToastManager.show('请输入密码');
        return false;
    }
    return true;
};

/**
 * 快速注册验证
 * @param params
 * @return {boolean}
 * @constructor
 */
export const Reg_quick_validate = (params) => {
    if(params.referralCode !== ''){
        if(!Reg.referralCode.test(params.referralCode)) {
            TXToastManager.show('请输入4-15位英文数字组合的推荐码');
            return false;
        }
    }
    if(!Reg.username.test(params.userName)){
        TXToastManager.show('用户名由6-11位字母和数字组成');
        return false;
    }
    if(!Reg.password.test(params.passWord)){
        TXToastManager.show('密码由6-12位字母、数字组成');
        return false;
    }
    if(!Reg.mobile.test(params.mobileNo)){
        TXToastManager.show('请输入真实的手机号码');
        return false;
    }
    if(!Reg.code.test(params.imgcode)){
        TXToastManager.show('请正确输入验证码');
        return false;
    }
    return true;
};

/**
 * 手机注册验证
 * @param params
 * @return {boolean}
 * @constructor
 */
export const Reg_phone_validate = (params) => {
    if(params.referralCode.trim() !== ''){
        if(!Reg.referralCode.test(params.referralCode)) {
            TXToastManager.show('请输入4-15位英文数字组合的推荐码');
            return false;
        }
    }
    if(!Reg.mobile.test(params.mobileNo)){
        TXToastManager.show('请输入真实的手机号码');
        return false;
    }
    if(!Reg.code.test(params.imgcode)){
        TXToastManager.show('请正确输入验证码');
        return false;
    }
    return true;
};

/**
 * 手机号验证
 * @param phone
 * @return {boolean}
 * @constructor
 */
export const Reg_phoneNum_validate = (phone) => {
    if(!Reg.mobile.test(phone)){
        TXToastManager.show('请输入真实的手机号码');
        return false;
    }
    return true;
};

/**
 * 手机注册 => 发送验证码
 * @param phoneNum
 * @return {boolean}
 */
export const send_code_validate = (phoneNum) =>{
    if(!Reg.mobile.test(phoneNum)){
        TXToastManager.show('请输入真实的手机号码');
        return false;
    }
    return true;
};

export const Reg_chineseName_validate = (chName) => {
    if(!Reg.chineseName.test(chName)){
        return false;
    }
    return true;
};

export const Reg_password_validate = (password) => {
    if(!Reg.password.test(password)){
        return false;
    }
    return true;
};

export const wechat_validate = (wechat) => {
    if(!Reg.wechat.test(wechat)){
        TXToastManager.show('请输入真实的微信号');
        return false;
    }
    return true;
};

export const qq_validate = (qq) => {
    if(!Reg.QQ.test(qq)){
        TXToastManager.show('请输入真实的QQ号码');
        return false;
    }
    return true;
};


