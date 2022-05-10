import React from "react";
import NavBar from "../navbar/NavBar";

const Header = props => {
    return (
        <header>
            <div className="container-md">
                <NavBar/>
            </div>
        </header>
    );
}
export default Header;