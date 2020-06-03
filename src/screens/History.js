import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input, Button, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/index';
import RoomItem from '../components/RoomItem';
import Loading from '../components/Loading';
import { itemHeight } from '../constants/constants';
import { AXIOS } from '../utils/functions';
import cStyles from '../constants/common-styles';
const styles = StyleSheet.create({});

type Props = {};
class Home extends Component<Props> {
  state = {};
  componentDidMount() {
    AXIOS('/sessions/joined', 'GET', {}, {}, this.props.userInfo.token)
      .then(({ data }) => {
        console.log('123456', 1, data);
        this.setState({ history: data.result });
      })
      .catch((err) => {
        console.log('123456', 2, err.response.data);
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
          <Card key={idx}>
            <Text style={styles.textLeft}>
              Bạn đã điểm danh lớp <Text style={{ fontWeight: 'bold' }}>Cơ sở dữ liệu</Text>
            </Text>
            <Text style={styles.textLeft}>
              Giảng viên: <Text style={{ fontWeight: 'bold' }}>Nguyễn Thị X</Text>
            </Text>
            <Text style={styles.textLeft}>
              Sỉ số: <Text style={{ fontWeight: 'bold' }}>90/100</Text>
            </Text>
            <Text style={{ alignSelf: 'flex-end' }}>19h30 19/12/2020</Text>
          </Card>
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
