import React from 'react';
import classes from "./Loader.module.css";

const Loader = () => {
    return (
        <div className={classes.wrapperLoader}>
            <div className={["d-flex justify-content-center align-items-center", classes.loader].join(' ')}>
                <div className={["spinner-border", classes.spinner].join(' ')} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}
export default Loader;