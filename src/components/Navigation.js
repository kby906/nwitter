import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => (
    <div className="navlist">
        <nav>
        <ul>
            <li>
                <Link to="/">HOME</Link>
            </li>
            <li>
                <Link to="/profile">
                    {userObj.photoURL && <img src={userObj.photoURL} width="30px" heigh="30px" alt="" />}
                     {userObj.displayName}'s PROFILE
                </Link>

            </li>
        </ul>
    </nav>
    </div>)
export default Navigation