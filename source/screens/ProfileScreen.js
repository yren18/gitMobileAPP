import React, { Component } from "react";
import { Platform, AsyncStorage, StatusBar, View, Text, StyleSheet, Button, Image, ScrollView, Alert} from "react-native";
import { Container, Header, Body, Left,Right, Picker, Item, Input} from 'native-base';
import { Avatar, ListItem } from 'react-native-elements';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import axios from 'axios';
import moment from 'moment'

// https://react-native-training.github.io/react-native-elements/docs/avatar.html

const token = '043ba9cdbd13f23359a1852a26a14aa34e89fc62';

class ProfileScreen extends Component {
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
          repoUrl: 'https://api.github.com/users/yren18/repos',
          isFollowing: '',
        }
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
      let followersUrl = '';
      if(this.props.navigation.getParam('followersUrl')){
          followersUrl = this.props.navigation.getParam('followersUrl')
      }
      axios.get(`${followersUrl}` + '?access_token=' + token)
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
            repoUrl: response.data.repos_url,
            followersUrl: response.data.followers_url,
            followingUrl: response.data.following_url,
          });
        }).then(res => {
          this.checkFollowing();
        }).then(
          () => console.log('profile end willmount')
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('Next: '+nextState.isFollowing);
        console.log('this: '+this.state.isFollowing);
        if (nextState.isFollowing !== this.state.isFollowing) {
            console.log("should update: TURE");
            return true;
        }
        console.log("should update: FALSE");
        return false;
    }

    componentDidUpdate() {
        this.checkFollowing();
    }

    /**
    *  function to Unfollow
    */
    unfollow() {
        fetch('https://api.github.com/user/following/' + this.state.username, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(res =>
              {
                console.log('authenticated');
                this.setState({
                    isFollowing: false,
                });
              }
            )
            .catch((error) => {
                console.log('Error on Authentication');
            });
    }

    /**
    *  function to follow
    */
    follow() {
        fetch('https://api.github.com/user/following/' + this.state.username, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(res =>
              {
                console.log('authenticated');
                this.setState({
                    isFollowing: true,
                });
              }
            )
            .catch((error) => {
                console.log('Error on Authentication');
            });
    }

    /**
    *  function to retrieve data
    */
    _retrieveData = async () => {
            try {
                let value = await AsyncStorage.getItem('user');
                let user = JSON.parse(value);
                if (user !== null) {
                    console.log("Name: " + user.name + ", Github username: " + user.login);
                }
            } catch (err) {
                console.log(err)
            }
        };

    /**
    *  function to use api to check if isFollowing
    */
    checkFollowing() {
        fetch('https://api.github.com/users/yren18/following/' + this.state.username, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(res => {
                this.setState({
                    isFollowing: res.status === 204,
                });
                console.log('aaa'+this.state.isFollowing);
            })
            .catch((error) => {
                console.log('Error on Authentication');
            });
    }

    render() {
        console.log("render");
        var parsed_time= this.state.createdTime.substring(0,10)
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
                          onPress={() => this.props.navigation.push('Repo', {repoUrl: this.state.repoUrl})} />
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
                  <View style={{marginTop: 250}}>
                    {this.state.isFollowing === true ? (
                        <Button onPress={() => this.unfollow()} title="Unfollow" />
                    ) : (
                        <Button onPress={() => this.follow()} title="Follow" />
                    )}
                  </View>
              </View>
              <View style={{flex: 6}} />
            </ScrollView>

        );
    }

}
export default ProfileScreen;

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
