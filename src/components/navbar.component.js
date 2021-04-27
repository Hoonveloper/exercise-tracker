import React, {Component} from 'react';
import {Link} from 'react-router-dom';
export class Navbar extends Component {
    render() {
        return (
            <nav
                className="navbar navbar-expand-lg navbar-light bg-light"
                style={{
                    fontFamily: "Fantasy"
                }}>
                <Link to="/" className="navbar-brand" href="#">
                    <i className="fas fa-running"></i>
                    Exercise Tracker
                    <i className="fas fa-dumbbell"></i>
                </Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active" aria-current="page" href="#">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/create" className="nav-link" href="#">Create Exercise Log</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/user" className="nav-link" href="#">CreateUser</Link>
                        </li>
                    </ul>
                </div>

            </nav>
        )
    }
}

export default Navbar;
