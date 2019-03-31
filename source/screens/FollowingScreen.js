import React, { Component } from "react";
import { Platform, StatusBar, View, Text, StyleSheet, Button, FlatList, Linking, ScrollView} from "react-native";
import { Container, Header, Body, Left,Right, Picker, Item, Input} from 'native-base';
import { Avatar, List, ListItem } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import axios from 'axios';

//https://react-native-training.github.io/react-native-elements/docs/listitem.html

const token = '043ba9cdbd13f23359a1852a26a14aa34e89fc62';

class FollowingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          followingData: []
        }
        this._storeData(this.props.followingData, JSON.stringify(this.props.followingData));
    }

    /**
     * store data to database
     */
    _storeData = async (name, user) => {
        try {
            await AsyncStorage.setItem(name, user);
        } catch (error) {
            // Error saving data
        }
    }

    componentWillMount() {
      this._mounted = true;
      let followingUrl = '';
      if(this.props.navigation.getParam('followingUrl')){
          followingUrl = this.props.navigation.getParam('followingUrl');
          followingUrl = followingUrl.substring(0, followingUrl.length-13)
      }
      axios.get(`${followingUrl}` + '?access_token=' + token)
        .then((response) => {
          this.setState({
            followingData: response.data,
          });
        })
    }

    render() {
      return(
        <ScrollView >
          {
            this.state.followingData.map((l, i) => (
              <ListItem
                key={i}
                containerStyle={{ borderBottomWidth: 1, borderTopWidth: 0, borderColor: '#c1c1d7'}}
                title={l.login}
                leftAvatar={{ rounded: true, source: { uri: l.avatar_url } }}
                onPress={() => this.props.navigation.push('Profile', {followersUrl: l.url})}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                chevron
              />
            ))
          }
        </ScrollView>
      );
    }
}
export default FollowingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
