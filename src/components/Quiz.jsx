import React from 'react';
import { fetchAllData } from '../service';
import QuizArea from './QuizArea';
import ScoreArea from './ScoreArea';
import Progress from './Progress';
import {postScore} from '../service';
import Highscore from './Highscore';

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {

        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export class Quiz extends React.Component {

    constructor(props) {
        super(props)

        this.state = { current: 0, dataSet: [], score: 0, lives: 3, currentSeconds: 10, name: '' }
        this.handleClick = this.handleClick.bind(this);
        this.renderTime = this.renderTime.bind(this);
    }

    componentDidMount() {
        this.fetchDataList();
    }

    fetchDataList = () => {
        fetchAllData().then(allData => {
            shuffle(allData);
            this.setState({ dataSet: allData });
            console.log(this.state)
            if (!this.props.location) {
                return <p>Loading...</p>
            }
            this.setState({ name: this.props.location.state })
        })
    }

    handleClick(choice) {
        console.log(choice)
        console.log(this.state);
        if (choice === this.state.dataSet[this.state.current].correct_answer) {
            this.setState({ score: this.state.score + 10 + this.state.currentSeconds })
        } else {
            if (this.state.lives > 1) {
                this.setState({ lives: this.state.lives - 1 })
            } else {
                this.setState({ lives: this.state.lives - 1 })
                // window.alert("Kuolit. 18 000 €");
                //TÄHÄN SCOREN JA NIMEN POSTAUS?
                this.props.history.push('/highscore', this.state.correct)
            }
        }

        if (this.state.current === 19) {
            // addScore = score => {
            //   postScore(score).then(vastaus => {
            //     this.fetchScoreList();
            //   })
            // }
            // window.alert("Kuolit. 18 000 €");
            //TÄHÄN SCOREN JA NIMEN POSTAUS?
            this.props.history.push('/highscore', this.state.correct)
        } else {
            this.setState({ current: this.state.current + 1 })
        }
    }

    // Renderer callback with condition
    renderTime = ({ seconds, completed }) => {
        if (completed) {
            // Render a time out text
            return <TimeOut />;
        } else {
            this.state.currentSeconds = seconds;
            // Render a countdown
            return <span>{seconds}</span>;
        }
    };

    render() {
        return (
            <div>
                <div className="progressArea">
                    <Progress currentQuestion={this.state.current} />
                </div>
                <ScoreArea score={this.state.score} lives={this.state.lives} date={Date.now() + 10000} renderer={this.renderTime} />
                <h1>Onnea peliin, {this.state.name}!</h1>
                <QuizArea handleClick={this.handleClick} dataSet={this.state.dataSet[this.state.current]} />
                <Highscore addCallback={this.addScore}/>
            </div>
        )
    }
}

const TimeOut = () => <span>Time out!</span>;

// function Question(props) {
//     var style = {
//         color: "red",
//     }
//     if (!props.dataSet) {
//         return <p>Loading...</p>
//     }
//     return (
//         <h1 style={style}>{props.dataSet.question}</h1>
//     )
// }

// function Answer(props) {
//     var style = {
//         width: "100%",
//         height: 50,
//         color: "black"
//     }
//     return (
//         <div>
//             <button style={style} onClick={() => props.handleClick(props.choice)}>{props.answer}</button>
//         </div>
//     )
// }

// function AnswerList(props) {
//     var answers = []
//     if (!props.dataSet) {
//         return <p>Loading...</p>
//     }
//     for (let i = 0; i < props.dataSet.answers.length; i++) {
//         answers.push(<Answer choice={props.dataSet.answers[i]} handleClick={props.handleClick} answer={props.dataSet.answers[i]} />)
//     }
//     return (
//         <div>
//             {answers}
//         </div>
//     )
// }

// function QuizArea(props) {
//     var style = {
//         width: "100%",
//         display: "block",
//         textAlign: "center",
//         boxSizing: "border-box",
//         float: "left",
//         padding: "0 2em"
//     }
//     return (
//         <div style={style}>
//             <h2>Kysymys: </h2>
//             <Question dataSet={props.dataSet} />
//             <AnswerList dataSet={props.dataSet} handleClick={props.handleClick} />
//         </div>
//     )
// }

// function TotalCorrect(props) {
//     var style = {
//         display: "inline-block",
//         padding: "1em",
//         background: "#eee",
//         margin: "0 1em 0 0"
//     }
//     return (
//         <h2 style={style}>Oikeita vastauksia: {props.correct}</h2>
//     )
// }

// function TotalLives(props) {
//     var style = {
//         display: "inline-block",
//         padding: "1em",
//         background: "#eee",
//         margin: "0 0 0 1em"
//     }
//     return (
//         <h2 style={style}>Elämiä jäljellä: {props.lives}</h2>
//     )
// }

// function ScoreArea(props) {
//     var style = {
//         width: "100%",
//         display: "block",
//         textAlign: "left",
//         float: "left",
//         padding: "2em"
//     }
//     return (
//         <div style={style} >
//             <TotalCorrect correct={props.correct} />
//             <TotalLives lives={props.lives} />
//         </div>
//     )
// }

// ReactDOM.render(
//     <Quiz />,
//     document.getElementById("root")
// )