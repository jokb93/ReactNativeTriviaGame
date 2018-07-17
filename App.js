import React, { Component } from 'react';
import { Alert, AppRegistry, Text, StyleSheet, ScrollView, View } from 'react-native';
import { createStackNavigator, StackActions } from 'react-navigation';

let Questions = {};

export class IntroScreen extends Component {

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={ViewportStyles.ViewStyle}>
        <Text style={[BlockStyles.Header, BlockStyles.Rules]}>Welcome to the Trivia Challange!</Text>
        <Text style={BlockStyles.Rules}>You will be presented with 10 True or False questions</Text>
        <Text style={BlockStyles.Rules}>Can you score 100%?</Text>
        <Text style={BlockStyles.Rules} onPress={() => {
          navigate('Questions');
        }}>BEGIN NOW</Text>
      </View>
    );
  }
}

export class QuestionScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      Title: "Loading...",
      curQuestion: "",
      Index: 0,
    };

    const { navigate } = this.props.navigation;

    this.updateText = () => {
      this.setState({ Title: Questions[this.state.Index].category });
      this.setState({ curQuestion: Questions[this.state.Index].question });
    }

    this.checkAnswer = (answer) => {
      let correct = Questions[this.state.Index].correct_answer;
      if(correct == answer){
        //alert("Nice!!");
        Questions[this.state.Index].answer = true;
      } else {
        //alert("Too bad, wrong answer");
        Questions[this.state.Index].answer = false;
      }
      if (this.state.Index == Questions.length - 1) {
        navigate('Result', );
        // end game
      } else {
        //continue game
        this.setState({ Index: this.state.Index + 1 });
        this.updateText();
      }
    }

    fetch("https://opentdb.com/api.php?amount=10&difficulty=hard&type=boolean")
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        Questions = responseJson.results;
        this.updateText();
      });
  };


  render() {
    return (
      <View style={ViewportStyles.ViewStyle}>
        <Text style={[BlockStyles.Header, BlockStyles.Rules]}>
          {this.state.Title}
        </Text>
        <Text style={[BlockStyles.Header, BlockStyles.Rules, BlockStyles.Boxed]}>
          {this.state.curQuestion}
        </Text>
        <Text style={BlockStyles.Rules}>
          {this.state.Index + 1} out of 10</Text>
        <View>
          <Text style={[BlockStyles.Rules, BlockStyles.higherMargin]} onPress={() => {
            this.checkAnswer("True");
          }}>TRUE</Text>
          <Text style={[BlockStyles.Rules, BlockStyles.higherMargin]} onPress={() => {
            this.checkAnswer("False");
          }}>FALSE</Text>
        </View>
      </View>
    );
  }
}


export class ResultScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      correct: 0,
      items: [],
    };

    
    for (var index = 0; index < Questions.length; index++) {
      var element = Questions[index];
      if(element.answer){
        this.state.correct = this.state.correct + 1;
        this.state.items.push(<Text style={BlockStyles.PointerText}>+ {element.question}</Text>);
      } else {
        this.state.items.push(<Text style={BlockStyles.PointerText}>- {element.question}</Text>);
      }
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView>
        <Text style={[BlockStyles.Header, BlockStyles.Rules]}>{this.state.correct} out of 10</Text>

        {this.state.items}
        
        <Text style={BlockStyles.Rules} onPress={() => {
          this.props.navigation.dispatch(StackActions.popToTop());
        }}>Replay?</Text>
      </ScrollView>
    );
  }
}

/* Screens */

const App = createStackNavigator({
  Home: { screen: IntroScreen },
  Questions: { screen: QuestionScreen },
  Result: { screen: ResultScreen },
}, 
{
  headerMode: 'none',
});

export default App;

/* Styling */

const ViewportStyles = StyleSheet.create({
  ViewStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#dedede',
    justifyContent: 'space-between',
  }
});

const BlockStyles = StyleSheet.create({
  Header: {
    marginTop: 15,
    fontWeight: 'bold',
  },
  Rules: {
    fontSize: 22,
    marginLeft: 30,
    marginRight: 30,
    textAlign: 'center',
  },
  PointerText: {
    fontSize: 22,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'left',
    color: '#5e5e5e',
  },
  Boxed:{
    borderColor: '#000',
    borderWidth: 1,
  },
  higherMargin:{
    marginTop: 10,
    marginBottom: 10,
  }
});