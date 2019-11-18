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
		let day = theDate.getDate();

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

	/**
	 * 格式化金额为“12,375.00”的形式
	 * @param numString 金额字符串，如“123.50”、“-27813.00”
	 * @param ignoreSign 是否忽略正负号(返回的字符串是否包含‘-’号)
	 */
	static formatMoneyAmount = (numString, ignoreSign = true) => {
		let result = '';
		let sign = '';
		let temp = numString;
		
		if (numString.startsWith('-')) {
			temp = numString.slice(1);
			sign = '-';
		}

		let tails = '';
		let index = temp.indexOf('.');
		if (index != -1) {
			tails = temp.slice(index);
			temp = temp.slice(0, index);
		}

		while (temp.length > 3) {
			result = ',' + temp.slice(-3) + result;
			temp = temp.slice(0, temp.length - 3);
		}
		if (temp) {
			result = temp + result;
		}

		return ignoreSign ? (result + tails) : (sign + result + tails);
	}
}


