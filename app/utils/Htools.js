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
			let pre = content.substring(0, pos);
			if (pre.length == 1) {
				//整数部分只有一位数
				content = '' + content;
			} else {
				content = content.substring(0, pos + 3);
			}
			return content;
		} else {
			return content;
		}
	} else {
		return '0.00';
	}
};


/**
 * 工具类
 */
export default class TXTools {
	/**
	 * 格式化日期为'yyyy-MM-dd'的字符串
	 */
	static formatDateToCommonString = (theDate) => {
		let year = theDate.getFullYear();
		let month = theDate.getMonth() + 1;
		var day = theDate.getDate();

		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}

		return ('' + year + '-' + month + '-' + day);
	}

	/**
	 * 获取days天后的日期，days为负数则为今天之前日期
	 */
	static dateAfter=(days) => {
		let today = new Date();
		return new Date(today.getTime() + (24 * 60 * 60 * 1000 * days));
	}
}


