import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import { Button, ButtonGroup, Card, Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import { showImageInput, setAvatar } from '../utils/functions';
const styles = StyleSheet.create({
  img: { width: '100%', height: '100%', paddingBottom: 0, marginBottom: 0 },
  wrapAvatar: { width: '100%', height: '100%', paddingBottom: 0 },
});
const iconSize = 24,
  iconColor = 'black';
type Props = {};
class Footer extends Component<Props> {
  state = {};
  showImageInput = () => {
    let { picker, camera, callback } = this.props;
    showImageInput({ picker, camera, callback });
  };
  render() {
    const { showAccessory = true, backgroundColor = 'transparent', margin = 20, image = {}, height = '80%', width = '100%', component = null } = this.props;
    return (
      <View style={{ width, height, backgroundColor, borderRadius: 10, paddingBottom: 0 }}>
        <Avatar
          avatarStyle={styles.img}
          containerStyle={styles.wrapAvatar}
          source={setAvatar(image)}
          showAccessory={showAccessory}
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
      </View>
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
