import { Alert } from 'react-native';

/**
 * 金额转换
 * @param money
 * @return {String}
 * @constructor
 */
export const transferMoneyFamat = (money) => {
	let content = String(money);
    if (content.indexOf('--') != -1 || content.indexOf('维护中') != -1 || content.indexOf('加载中...') != -1) {
    	return content;
    }

    if (Number(content) > 0) {
    	
    	if (content.indexOf('.') != -1) {
    		//有小数点
    		let pos = content.indexOf('.');
    		let pre = content.substring(0,pos);
    		if (pre.length == 1) {
    			//整数部分只有一位数
    			content = '' + content; 
    		}else {
    			content = content.substring(0,pos + 3);
    		}
    		return content;
    	}else {
    		return content;
    	}
    }else {
    	return '0.00';
    }
};


