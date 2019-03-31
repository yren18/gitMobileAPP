import React, { Component } from "react";
import { Platform, StatusBar, View, Text, StyleSheet, Button, Image, ScrollView} from "react-native";
import { Container, Header, Body, Left,Right, Picker, Item, Input} from 'native-base';
import { Avatar, ListItem } from 'react-native-elements';
import axios from 'axios';
import moment from 'moment'

// https://react-native-training.github.io/react-native-elements/docs/avatar.html

const token = '043ba9cdbd13f23359a1852a26a14aa34e89fc62';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          avatarUrl: 'https://avatars0.githubusercontent.com/u/32400328?v=4',
          name: '',
          username: '',
          bio: '',
          website: '',
          email: '',
          repoCount: '',
          followerCount: '',
          followingCount: '',
          createdTime: '',
          repoData: [],
          followingData: [],
          followerData: [],
          followersUrl: 'https://api.github.com/users/yren18/followers',
          followingUrl: 'https://api.github.com/users/yren18/following',
          repoUrl: 'https://api.github.com/users/yren18/repos'
        }
        this._storeData = this._storeData.bind(this)
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
      axios.get('https://api.github.com/users/yren18' + '?access_token=' + token)
        .then((response) => {
          this._storeData('user',JSON.stringify(response.data));
          this.setState({
            avatarUrl: response.data.avatar_url,
            name: response.data.name,
            username: response.data.login,
            bio: response.data.bio,
            website: response.data.blog,
            email: response.data.email,
            repoCount: response.data.public_repos,
            followerCount: response.data.followers,
            followingCount: response.data.following,
            createdTime: response.data.created_at,
            followersUrl: response.data.followers_url,
            followingUrl: response.data.following_url,
            repoUrl: response.data.repos_url,
          });
        });
    }

    componentDidUpdate() {
      axios.get('https://api.github.com/users/yren18' + '?access_token=' + token)
        .then((response) => {
          this.setState({
            avatarUrl: response.data.avatar_url,
            name: response.data.name,
            username: response.data.login,
            bio: response.data.bio,
            website: response.data.blog,
            email: response.data.email,
            repoCount: response.data.public_repos,
            followerCount: response.data.followers,
            followingCount: response.data.following,
            createdTime: response.data.created_at,
            followersUrl: response.data.followers_url,
            followingUrl: response.data.following_url,
            repoUrl: response.data.repos_url,
          });
        });
    }

    render() {
        var parsed_time = this.state.createdTime.substring(0,10)
        return (
            <ScrollView style={styles.container}>
              <View style={styles.topBar}>
                <Avatar
                  rounded
                  size = 'xlarge'
                  source={{uri: this.state.avatarUrl}}
                  containerStyle={{marginTop: 7, marginLeft: 7}}
                />
                <View style={{flexDirection: 'col', marginLeft: 10}}>
                  <Text></Text>
                  <Text style={{fontSize:25, textAlign:'center'}}> {this.state.name} </Text>
                  <Text></Text>
                  <Text style={{textAlign:'center'}}>  {this.state.username}</Text>
                  <Text></Text>
                  <Text style={{textAlign:'center'}}>  {this.state.email} </Text>
                  <Text/>
                  <Text style={{textAlign:'center'}}>{parsed_time}</Text>
                </View>
              </View>

              <View style={styles.middleBar}>
                  <View style={styles.clickableButton}>
                      <Button title={`Repo: ${this.state.repoCount}`}
                          color="black"
                          onPress={() => this.props.navigation.push('Repo', {repoUrl: this.state.repoUrl, onGoBack: () => this.refresh()})} />
                  </View>
                  <View style={styles.clickableButton}>
                      <Button title={`Follower: ${this.state.followerCount}`}
                          color="black"
                          onPress={() => this.props.navigation.push('Follower', {followersUrl: this.state.followersUrl})} />
                  </View>
                  <View style={styles.clickableButton}>
                      <Button title={`Following: ${this.state.followingCount}`}
                          color="black"
                          onPress={() => this.props.navigation.push('Following', {followingUrl: this.state.followingUrl})} />
                  </View>
              </View>

              <View style={styles.bottomBar}>
                  <Text style={{fontSize:20, marginLeft: 10, marginRight: 10}}> Biography</Text>
                  <Text style={styles.attributeValue}> {this.state.bio}</Text>
                  <Text style={{fontSize:20, marginLeft: 10, marginRight: 10, marginTop: 10}}> Website</Text>
                  <Text style={styles.attributeValue}> {this.state.website}</Text>
              </View>
              <View style={{flex: 6}} />
            </ScrollView>

        );
    }

}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flex:14,
    backgroundColor: 'powderblue',
    flexDirection: 'row'
  },
  middleBar: {
    flexDirection: 'row',
    marginTop: 10,
    flex: 3,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'skyblue'
  },
  bottomBar: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flex: 35,
  },
  clickableButton: {
    flex: 1,
    textAlign:'center'
  },
  attributeValue: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5
  }
});
