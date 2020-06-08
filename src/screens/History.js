import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import HistoryItem from '../components/HistoryItem';
import Loading from '../components/Loading';
import { itemHeight } from '../constants/constants';
import { AXIOS, checkTokenExpire, shadow } from '../utils/functions';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({});

type Props = {};
class Home extends Component<Props> {
  state = {};
  componentDidMount() {
    AXIOS('/sessions/checkins', 'GET', {}, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', `found ${data.result.length} session`);
        this.setState({ history: data.result });
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
  render() {
    const iconSize = 24;
    const iconColor = 'black';
    const { errorMessage = {}, history = [], loading = true } = this.state;
    const itemHeight = 190;
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {history.map((item, idx) => (
          <HistoryItem data={item} key={idx} />
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
