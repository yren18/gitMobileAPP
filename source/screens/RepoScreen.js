import React, { Component } from "react";
import { Platform, StatusBar, View, Text, StyleSheet, Button, FlatList, Linking, ScrollView} from "react-native";
import { Container, Header, Body, Left,Right, Picker, Item, Input} from 'native-base';
import { Avatar, List, ListItem } from 'react-native-elements';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

//https://react-native-training.github.io/react-native-elements/docs/listitem.html

const token = '043ba9cdbd13f23359a1852a26a14aa34e89fc62';

class RepoScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        repoData: [],
        starList: {}
      }
    }

    /**
     * function to check if given repo is starred
     */
    checkRating(login, name) {
        console.log('checkRating');
        fetch(`https://api.github.com/user/starred/${login}/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
        })
        .then(res => {
            let newState = Object.assign({}, this.state.starList);

            newState[name] = (res.status===204)? 'star' : 'star-o';
            this.setState({ starList: newState });
        })
        .catch((error) => {
            console.log('Error on Authentication');
        });
    }

    /**
     * function to get status or all repos
     */
    checkStars() {
        console.log(this.state.repoData);
        this.state.repoData.forEach(repo => {
            this.checkRating(repo.owner.login, repo.name);
        })
    }

    componentWillMount() {
      this._mounted = true;
      let repoUrl = '';
      if(this.props.navigation.getParam('repoUrl')){
          repoUrl = this.props.navigation.getParam('repoUrl');
      }
      axios.get(`${repoUrl}` + '?access_token=' + token)
        .then((response) => {
          this.setState({
            repoData: response.data,
            starList: {}
          });
        }).then(() => {
          this.checkStars();
        })
    }

    /**
     * function to change status of repo
     */
    changeList(name) {
        if(this.state.starList[name] === 'star-o') {
            this.state.starList[name] = 'star';
        }
        else if(this.state.starList[name] === 'star'){
            this.state.starList[name] = 'star-o';
        }
        console.log('it is ' + this.state.starList[name])
        return this.state.starList;
    }

    /**
     * function to use api to star/unstar
     */
    checkClose(login, name) {
        if(this.state.starList[name]==="star") {
            axios.delete(`https://api.github.com/user/starred/${login}/${name}` + '?access_token=' + token)
                .then(function (response) {
                if(response.status===204){
                    console.log("success close");
                    this.setState({
                        starList: this.changeList(name)
                    });
                }
            }.bind(this))
        }
        else{
            axios.put(`https://api.github.com/user/starred/${login}/${name}` + '?access_token=' + token)
                .then(function (response) {
                if(response.status===204){
                    console.log("success check");
                    this.setState({
                        starList: this.changeList(name)
                    });
                }
            }.bind(this))
        }
    }

    render() {
      console.log('render');
      return(
        <ScrollView>
          {
            this.state.repoData.map((l, i) => (
              <ListItem
                key={i}
                containerStyle={{ borderBottomWidth: 1, borderTopWidth: 0, borderColor: '#c1c1d7'}}
                title={l.name}
                subtitle={l.owner.login + "\n" + l.description}
                onPress={() => { Linking.openURL(l.html_url) }}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                subtitleStyle={{ color: '#3d3d5c' }}
                rightIcon={this.state.starList[l.name] === 'star' ? <Icon name='star' size={18} onPress={()=> this.checkClose(l.owner.login, l.name)}/> :
                                                                    <Icon name='star-o' size={18} onPress={()=> this.checkClose(l.owner.login, l.name)}/>}


                chevron
              />
            ))
          }
        </ScrollView>
      );
    }
}
export default RepoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
