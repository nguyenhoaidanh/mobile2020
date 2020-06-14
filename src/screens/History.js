import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Card, Overlay, Image } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import HistoryItem from '../components/HistoryItem';
import Loading from '../components/Loading';
import { itemHeight, imgBku } from '../constants/constants';
import { AXIOS, checkTokenExpire, shadow, setAvatar } from '../utils/functions';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({});

type Props = {};
class Home extends Component<Props> {
  state = {};
  componentDidMount() {
    AXIOS('/sessions/checkins', 'GET', {}, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', `found ${data.object.length} session`);
        this.setState({
          history: data.object,
          images: data.object.map((e) => <Image source={setAvatar(e.session.link_face)} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />),
        });
      })
      .catch((err) => {
        checkTokenExpire(err, this);
      })
      .finally(() => this.setState({ loading: false }));
  }
  onchange = (name, value) => {
    this.setState({ [name]: value });
  };
  navigate = (url) => {
    this.props.history.push(url);
    this.props.appActions.setCurScreent({ currentScreent: { title: 'Tạo room' } });
  };
  renderPopupInfo = () => {
    const { curiItem, urlIdx, images = [] } = this.state;
    const { session = {} } = curiItem;
    console.log(123456, 'session', images[urlIdx], session.link_face, setAvatar(session.link_face));
    return (
      <Overlay overlayStyle={{ width: '90%' }} isVisible={this.state.showForm} onBackdropPress={() => this.setState({ showForm: false })}>
        <View>{images[urlIdx]}</View>
      </Overlay>
    );
  };
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, history = [], loading = true } = this.state;
    const itemHeight = 190;
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {this.state.showForm ? this.renderPopupInfo() : null}
        {history.map((item, idx) => (
          <HistoryItem data={item} key={idx} onClick={() => this.setState({ showForm: true, curiItem: item, urlIdx: idx })} />
        ))}
        {loading ? (
          <Loading />
        ) : history.length === 0 ? (
          <Text style={{ marginTop: 50, color: 'white', fontSize: 20, alignSelf: 'center' }}>Bạn chưa có lượt điểm danh nào</Text>
        ) : null}
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
