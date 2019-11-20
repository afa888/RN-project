import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import MainTheme from '../utils/AllColor';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

class TXInput extends Component {
  static propTypes = {
    placeholderTextColor: PropTypes.string,
    isUpdate: PropTypes.bool,
    readonly: PropTypes.bool,
    autoCapitalize: PropTypes.oneOf(['characters', 'words', 'sentences', 'none']),
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    showDetail: PropTypes.bool,
    detailTextColor: PropTypes.string,
    buttonFontSize: PropTypes.number,
    forbiddenDot: PropTypes.bool,
  };

  static defaultProps = {
    placeholderTextColor: '#ccc8c4',
    autoCapitalize: 'none',
    isUpdate: true,
    readonly: false,
    label: '文本输入框',
    placeholder: '请输入',
    required: false,
    showDetail: false,
    detailTextColor: '#514b46',
    buttonFontSize: 14,
    forbiddenDot: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      textAlign: 'right',
      isEditting: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value });
    }
  }

  _onChangeText = (val) => {
    const { forbiddenDot } = this.props;
    if (forbiddenDot) {
      //禁止输入小数点
      let newVar = val.replace('.', '');
      this.setState({ value: newVar });
      this.props.onChange && this.props.onChange(newVar.replace(/(^\s*)|(\s*$)/g, ''));
    } else {
      this.setState({ value: val });
      this.props.onChange && this.props.onChange(val.replace(/(^\s*)|(\s*$)/g, ''));
    }

  };

  _onBlur = (e) => {
    const { onBlur } = this.props;
    onBlur && onBlur(e);
    this.setState({ isEditting: false });
  };

  _onFocus = (e) => {
    const { onFocus } = this.props;
    onFocus && onFocus(e);
    this.setState({ isEditting: true });
  };
  _onClickButton = () => {
    this.props.onClick && this.props.onClick();
  }

  _renderInputContent = () => {
    const {detailTextColor, textInputStyle, placeholderTextColor, autoCapitalize, isUpdate, showDetail, suffix } = this.props;
    return (
      isUpdate == true ?
        <View
          style={[{ flexDirection: 'row', flex: 1, height: '100%' }, styles.center]}
        >
          <TextInput
            {...this.props}
            contextMenuHidden={true}
            onChangeText={this._onChangeText}
            onBlur={this._onBlur}
            onFocus={this._onFocus}
            style={[{ paddingTop: 0, paddingBottom: 0, textAlign: this.state.textAlign, flex: 1, fontSize: 14, color: MainTheme.DarkGrayColor }, textInputStyle]}
            placeholderTextColor={placeholderTextColor || MainTheme.LightGrayColor}
            value={String(this.state.value)}
            autoCorrect={false}
            autoCapitalize={autoCapitalize}
            underlineColorAndroid="transparent"
            returnKeyType='done'
          />
          <Text style={{ marginRight: 10 }}>
            {(suffix && suffix.length > 3) ? '' : suffix}
          </Text>
        </View>
        :
        <View
          style={[{ flexDirection: 'row', flex: 1, height: '100%', fontSize: 5 }, styles.center]}
        >
          <Text
            style={{ textAlign: this.state.textAlign, flex: 1 }}
          >
          </Text>

          <Text style={{ marginRight: 10 }}>
            {(suffix && suffix.length > 3) ? '' : suffix}
          </Text>
          <TouchableOpacity onPress={() => this._onClickButton()} activeOpacity={0.2} focusedOpacity={0.5}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>

              <Text style={[{ color: detailTextColor, fontSize: 15 },textInputStyle]}>{this.state.value}</Text>
            </View>

          </TouchableOpacity>
          {showDetail ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#8B8B8B' }}>  >  </Text> : <View style={{ width: 20 }}></View>}

        </View>
    );
  };

  _renderTextAreaContent = () => {
    const { textInputStyle, placeholderTextColor, autoCapitalize, isUpdate } = this.props;
    return (
      isUpdate ?
        <TextInput
          numberOfLines={4}
          {...this.props}
          multiline={true}
          onChangeText={this._onChangeText}
          onBlur={this._onBlur}
          onFocus={this._onFocus}
          style={[{ paddingTop: 0, paddingBottom: 0, height: 60, marginHorizontal: 10, textAlign: 'left', flex: 1, fontSize: 12 },
            textInputStyle,
          ]}
          placeholderTextColor={placeholderTextColor}
          value={String(this.state.value)}
          autoCorrect={false}
          returnKeyType='done'
          autoCapitalize={autoCapitalize}
          underlineColorAndroid="transparent"
          textAlignVertical='center'
        /> :
        <Text
          style={[{
            marginVertical: 5, height: 60, marginHorizontal: 10, textAlign: 'left', flex: 1,
            backgroundColor: '#f7f6f5',
          }, textInputStyle]}
        >{this.state.value}
        </Text>
    );
  };

  render() {
    const { label, labelTextStyle, required, mode } = this.props;
    if (mode === 'TextArea') {
      return (
        <View
          style={{
            height: 108,
            width: '100%',
            paddingVertical: 10,
            paddingHorizontal: 15,
            borderColor: '#eae6e4',
            marginVertical: 5,
            borderBottomWidth: 0.5,
            backgroundColor: '#fff'
          }}
        >
          <Text style={[{ fontSize: 15 }, labelTextStyle]}>
            {label}{required ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F00' }}>*</Text> : null}
          </Text>
          {this._renderTextAreaContent()}
        </View>
      );
    }
    return (
      <View
        style={[{
          height: 45,
          // width: '100%',
          backgroundColor: '#fff',
          flexDirection: 'row',
          borderColor: this.state.isEditting ? MainTheme.SpecialColor : MainTheme.LightGrayColor,
          borderBottomWidth: 0.5,
          marginRight: 10,
          marginLeft:10,
        }, styles.center]}
      >
        <Text style={[
          {
            width: 100,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginLeft:5,
            fontSize: 14,
            color: MainTheme.TextTitleColor,
          },
          labelTextStyle,
        ]}
        >{label}
          {required ? <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#F00' }}>*</Text> : null}
        </Text>
        {this._renderInputContent()}
      </View>
    );
  }
}

export default TXInput;
