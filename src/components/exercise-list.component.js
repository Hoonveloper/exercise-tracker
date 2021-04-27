import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
// exercise컴퍼넌트 하나 더만듬 exerciselist 는 classs 클래스 컴퍼넌트 exercise는 함수형 컴퍼넌트 함수형은
// 클래스와 달리 state와 lifecycle이 없다. 그냥 props받고 jsx 리턴해주면 함수형 컴퍼넌트 사용하기. 컴퍼넌트는 하나 파일
// 만드는게 난데 이건 작아서 그냥여기에 만들었음.
const Exercise = props => {
    return (
        <tr>
            <td>{props.exercise.username}</td>
            <td>{props.exercise.description}</td>
            <td>{props.exercise.duration}</td>
            <td>{
                    props
                        .exercise
                        .date
                        .substring(0, 10)
                }</td>
            <td>
                <Link to={'/edit/' + props.exercise._id}>edit</Link>
                |
                <a
                    href="#"
                    onClick={() => {
                        props.deleteExercise(props.exercise._id)
                    }}>delete</a>
            </td>
        </tr>

    );

};
export class ExerciseList extends Component { //class임.
    constructor(props) {
        super(props);
        this.state = {
            exercises: []
        }
        this.deleteExercise = this
            .deleteExercise
            .bind(this);
        //this.editExercise =this.editExercise.bind(this);
    }
    deleteExercise(id) {
        axios
            .delete('http://localhost:5000/exercises/' + id) //백엔드에서 제거.
            .then(res => console.log(res.data))
            .catch(err => console.error(err));
        this.setState({
            exercises: this
                .state
                .exercises
                .filter(el => el._id !== id) //_id : objectId , _id!==id일 경우 배제 시키고 배열 만듬. 여기서 _id는 mongodb가서 보면 알듯이 자동을 ㅗ만들어져 있음.

        })
    }
    componentDidMount() {
        axios
            .get('http://localhost:5000/exercises/')
            .then(res => {
                if (res.data.length > 0) { //운동이 1개라도 있다면
                    this.setState({exercises: res.data}) //exercises 배열에 response받은거 넣기.
                }
            })
            .catch(err => console.error(err))

        }
    exerciseList() {
        return this
            .state
            .exercises
            .map(exercise => {
                return <Exercise
                    exercise={exercise}
                    deleteExercise={this.deleteExercise}
                    key={exercise._id}/>; //deleteExercise는 함수인데 함수도 넘겨줄 수 있음.

            })

    }
    render() {

        return (
            <div>
                <h3>Logged Exercises</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Description</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Date</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.exerciseList()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default ExerciseList
