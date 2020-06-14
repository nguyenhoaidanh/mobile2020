import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView, Alert, Image } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ButtonGroup, Card, Button, CheckBox, Avatar } from 'react-native-elements';
import ImageInput from '../components/ImageInput';
import cStyles from '../constants/common-styles';
import { AXIOS, checkTokenExpire, uploadFileToServer, setAvatar, showImageInput } from '../utils/functions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import Loading from '../components/Loading';
const styles = StyleSheet.create({});
const iconSize = 24;
const iconColor = 'black';
type Props = {};
const min_image = 10;

class Home extends Component<Props> {
  constructor(props) {
    super(props);
    const { userInfo = {} } = props;
    let list = [];
    const { list_images = [] } = userInfo;
    const n = list_images.length > min_image ? list_images.length : min_image;
    for (let i = 0; i < n; i++) {
      if (list_images[i]) list.push({ index: i, image: list_images[i] || {} });
    }
    this.state = { userInfo, list };
  }
  showImageInput = () => {
    let { picker, callback, multiple = true } = this.props;
    showImageInput({ picker: true, callback: (img) => this.setImage(img), multiple: true });
  };
  register = () => {
    let { list = [] } = this.state;
    let count = 0;
    list = list.filter((e) => e.image.path);
    list = list.map((e) => e.image);
    if (list.length < min_image) return this.showAlert(`Hãy chọn ít nhất ${min_image} ảnh bạn nhé`);
    this.setState({ loading: true, loadingText: '' });
    let msg = '';
    uploadFileToServer(list, this.props.userInfo.token, '/users/images/uploadfile', 'POST', (progressEvent) => {
      const { loaded, total } = progressEvent;
      let percent = Math.floor((loaded / total) * 100);
      const loadingText = percent < 100 ? `Đang tải ảnh lên ${percent}%` : `Đang xử lý`;
      this.setState({ loadingText });
    })
      .then(({ data }) => {
        console.log('123456', 1, data);
        this.props.appActions.setUserInfo({ userInfo: { list_images: data.object } });
        this.setState({ list: data.object.map((e, i) => ({ index: i, image: e })) });
        msg = 'Đăng kí gương mặt thành công';
        this.setState({ success: true });
      })
      .catch((err) => {
        checkTokenExpire(err, this);
        msg = 'Ảnh không rõ hoặc số lượng gương mặt mỗi bức ảnh không đúng. Vui lòng chụp lại.';
      })
      .finally(() => {
        this.setState({ loading: false });
        this.showAlert(msg);
      });
  };
  setImage = (image, index) => {
    let { list = [] } = this.state;
    for (const img of image) {
      list.push({ index: list.length, image: img });
    }
    this.setState({ list });
  };
  showAlert = (msg) => {
    Alert.alert('Thông báo', msg, [
      {
        text: 'Đã hiểu',
      },
    ]);
  };
  componentWillReceiveProps(props) {
    const { userInfo = {} } = props;
    const { list_images = [] } = userInfo;
    const list = [];
    const n = list_images.length > min_image ? list_images.length : min_image;
    for (let i = 0; i < n; i++) {
      list.push({ index: i, image: list_images[i] || {} });
    }
    this.setState({ userInfo, list });
  }
  renderRow = (row, rowNum, success) => {
    return (
      <ButtonGroup
        key={rowNum}
        buttons={row.map((el, idx) => ({
          element: () => {
            return (
              <ImageInput
                multiple={true}
                disabled={success}
                key={idx}
                image={el.image}
                picker={true}
                callback={(img) => this.setImage(img, rowNum * 2 + idx)}
                height={'100%'}
              />
            );
          },
        }))}
        buttonStyle={{
          padding: 0,
          width: '100%',
          margin: 0,
          // borderTopColor: 'transparent',
          // borderLeftColor: 'transparent',
          // borderRightColor: 'transparent',
          // borderBottomColor: 'transparent',
        }}
        containerStyle={{
          // borderTopColor: 'transparent',
          // borderLeftColor: 'transparent',
          // borderRightColor: 'transparent',
          // borderBottomColor: 'transparent',
          padding: 0,
          margin: 0,
          height: 200,
          backgroundColor: 'transparent',
        }}
      />
    );
  };
  parseList = (list) => {
    //[1,2,3,4]=>[[1,2],[3,4]]
    let rs = [];
    for (let i = 0; i < list.length; i += 2) {
      rs.push(list[i + 1] ? [list[i], list[i + 1]] : [list[i]]);
    }
    return rs;
  };
  render() {
    let { errorMessage = {}, list = [], loading = false, userInfo = {}, success = false } = this.state;
    const { list_images = [] } = userInfo;
    console.log(123456, 'found image', list.length);
    if (!success) success = list_images.length >= min_image;
    const rowHeight = 200;
    list = this.parseList(list);
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {loading ? <Loading loadingText={this.state.loadingText} /> : null}
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Text
            style={{
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 10,
              marginTop: 10,
              alignSelf: 'center',
              fontSize: 20,
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {success ? <Icon name="check-circle" color="white" size={25} style={{ marginRight: 15 }} /> : null}
            {success ? ' Đã đăng kí gương mặt ' : ` Chọn ít nhất ${min_image} ảnh chân dung khác nhau có mặt của bạn`}
          </Text>
        </View>
        {list.map((row, idx) => this.renderRow(row, idx, success))}
        {success ? null : (
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: '50%', alignItems: 'center' }}>
              <Button
                containerStyle={{ width: '90%' }}
                titleStyle={cStyles.btnText}
                buttonStyle={{ borderRadius: 20, backgroundColor: '#55d646' }}
                title={'Thêm ảnh'}
                icon={<MaterialCommunityIcons style={{ marginRight: 10 }} name="plus-circle" size={iconSize} color={'white'} />}
                onPress={this.showImageInput}
              />
            </View>
            <View style={{ width: '50%', alignItems: 'center' }}>
              <Button
                containerStyle={{ width: '90%' }}
                titleStyle={cStyles.btnText}
                buttonStyle={{ borderRadius: 20, width: '90%', backgroundColor: '#55d646' }}
                title={'Đăng kí '}
                onPress={this.register}
                iconRight
                icon={<MaterialCommunityIcons style={{ marginLeft: 10 }} name="face-recognition" size={iconSize} color={'white'} />}
              />
            </View>
          </View>
        )}
        <View style={{ height: 65 }} />
      </ScrollView>
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    app: state.app,
    userInfo: state.user.userInfo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
