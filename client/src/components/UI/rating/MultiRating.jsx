import React from 'react';
import { Rating } from 'react-simple-star-rating';

const MultiRating = ({ label, labels, values, handleChange }) => {
    return (
        <>
            <label><b>{ label }</b></label>
            {values.map((el, i) => (
                <div
                    key={i}
                >
                    <label>{ labels[i] }</label>
                    <Rating
                        ratingValue={el}
                        onClick={val => {
                            handleChange(val, i);
                        }}
                    />
                </div>
            
            ))}
        </>
    )
}
export default MultiRating;