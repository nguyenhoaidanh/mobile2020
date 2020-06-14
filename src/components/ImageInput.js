import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, ButtonGroup, Card, Avatar, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import { showImageInput, setAvatar } from '../utils/functions';
const styles = StyleSheet.create({
  img: { flex: 1, width: null, height: null, resizeMode: 'contain' },
  img2: { flex: 1, width: '100%', height: '100%' },
  wrapAvatar: { width: '100%', height: Dimensions.get('window').height - 210, padding: 0 },
});
const iconSize = 24,
  iconColor = 'black';
type Props = {};
class Footer extends Component<Props> {
  state = {};
  showImageInput = () => {
    let { picker, camera, callback, disabled, useFrontCamera, multiple = false } = this.props;
    if (disabled) return;
    showImageInput({ picker, camera, callback, multiple });
  };
  render() {
    const {
      disabled = false,
      showAccessory = true,
      backgroundColor = 'transparent',
      margin = 20,

      height = '80%',
      width = '100%',
      small = true,
      component = null,
    } = this.props;
    const { image = {} } = this.props;
    return (
      <Avatar
        avatarStyle={small ? styles.img2 : styles.img}
        containerStyle={styles.wrapAvatar}
        source={setAvatar(image)}
        showAccessory={!showAccessory ? false : !disabled}
        onAccessoryPress={this.showImageInput}
        onPress={this.showImageInput}
        accessory={{
          name: image.path ? 'mode-edit' : 'plus-circle',
          type: image.path ? 'material' : 'font-awesome',
          color: 'white',
          underlayColor: 'gray',
          size: 30,
        }}
      />
    );
  }
}
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    app: state.app,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Footer));
