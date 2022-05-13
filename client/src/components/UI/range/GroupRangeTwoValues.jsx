import React from 'react';
import RangeTwoValues from './RangeTwoValues';

const GroupRangeTwoValues = props => {
    return (
        <div>
            {
                props.values.map((el, i) => (
                    <RangeTwoValues
                        key={ props.labels[i] }
                        style={{thumb: {
                            height: '42px',
                            width: '42px',                        
                        }}}
                        label={ props.labels[i] }
                        step={ props.steps[i] }
                        min={ props.limits[i][0] }
                        max={ props.limits[i][1] }
                        values={el}
                        handleChange={ values => {
                            const newArr = [ ...props.values];
                            newArr[i] = values;

                            const newLimits = newArr.map((element, index, arr) => {
                                if (index === 0) return props.limits[0];
                                const maxOfPreviousElement = arr[index - 1][1];
                                if (maxOfPreviousElement < element[1]) newArr[index][1] = maxOfPreviousElement;
                                return [props.limits[index][0], maxOfPreviousElement];
                            });
                            props.handleChange(newArr, newLimits);
                        } }
                    />    
                ))
            }
        </div>
    );
}

export default GroupRangeTwoValues;