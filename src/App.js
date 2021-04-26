import logo from './logo.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import {BrowserRouter as Router ,Route} from "react-router-dom";


import Navbar from './components/navbar.component';
import EditExercise from './components/edit-exercise.component';
import ExerciseList from './components/exercise-list.component';
import UpdateExcise from './components/create-exercise.component';
import CreateUser from './components/create-user.component';


function App() {
  return (
    <Router>
      <Navbar/>
      <br/>
      <Route path="/" exact component={ExerciseList}/>
      <Route path="/edit/:id" exact component={EditExercise}/>
      <Route path="/create" exact component={UpdateExcise}/>
      <Route path="/user" exact component={CreateUser}/> 
    </Router>
  );
}

export default App;
