import React from "react";

const Wrapper = props => {
    return (
        <div>
            <label>
                { props.label }
            </label>
            { props.children }
        </div>
    );
}

export default Wrapper;