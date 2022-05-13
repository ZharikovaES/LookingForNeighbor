import React, { useEffect, useState } from "react";
import { Range, getTrackBackground } from "react-range";

const RangeTwoValues = ({style, hasMarks, label, step, min, max, values, handleChange}) => {
  const [currentValues, setCurrentValues] = useState(values);
  const [minValueNumInput, setMinValueNumInput] = useState(parseFloat(values[0]));
  const [maxValueNumInput, setMaxValueNumInput] = useState(parseFloat(values[1]));

  useEffect(() => {
    setMaxValueNumInput(parseFloat(values[1]));
  }, [ values[1] ])

  return (
    <div>
      { label && (<label>{label}</label>) }
      <div style={{margin: "40px"}}>
        <Range
            values={currentValues}
            step={step}
            min={min}
            max={max}
            onChange={val => {
                setMinValueNumInput(val[0]);
                setMaxValueNumInput(val[1]);
                setCurrentValues(val);
            }}
            onFinalChange={handleChange}
            renderMark={hasMarks ? ({ props, index }) => (
                <div
                    { ...props }
                    style={{
                        ...props.style,
                        height: '16px',
                        width: '5px',
                        backgroundColor: index * step > currentValues[0] && index * step < currentValues[1] ? '#548BF4' : '#ccc'
                    }}
                />
              ) : null}
            renderTrack={({ props, children }) => (
                <div
                    onMouseDown={props.onMouseDown}
                    onTouchStart={props.onTouchStart}
                    style={{
                        ...props.style,
                        ...style.track,
                        height: "36px",
                        display: "flex",
                        width: "100%"
                    }}
                >
                    <div
                        ref={props.ref}
                        style={{
                            height: "5px",
                            width: "100%",
                            borderRadius: "4px",
                            background: getTrackBackground({
                            values: currentValues,
                            colors: ["#ccc", "#548BF4", "#ccc"],
                            min,
                            max,
                            }),
                            alignSelf: "center"
                        }}
                    >
                        {children}
                    </div>
                </div>
            )}
            renderThumb={({ index, props, isDragged }) => (
            <div
                {...props}
                style={{
                    ...props.style,
                    ...style.thumb,
                    borderRadius: '4px',
                    backgroundColor: '#FFF',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0px 2px 6px #AAA'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: '-28px',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                        padding: '4px',
                        borderRadius: '4px',
                        backgroundColor: '#548BF4'
                    }}
                >
                { currentValues[index] }
                </div>
                <div
                    style={{
                        height: '16px',
                        width: '5px',
                        backgroundColor: isDragged ? '#548BF4' : '#CCC'
                    }}
                />
            </div>
            )}
        />
        </div>
        <div>
            <input 
                type="number" 
                min={min} 
                max={currentValues[1]} 
                value={minValueNumInput}
                onChange={e => {
                    setMinValueNumInput(e.target.value);
                }}
                onBlur={e => {
                    const val = e.target.value ? Number(e.target.value) : min;
                    if (val <= currentValues[1] && val >= min){
                        // setMinValueNumInput(parseFloat(val).toString());
                        setCurrentValues([parseFloat(val), parseFloat(currentValues[1])])
                        handleChange([parseFloat(val), parseFloat(currentValues[1])])
                    } else {
                        setMinValueNumInput(parseFloat(min));
                        setCurrentValues([parseFloat(min), parseFloat(currentValues[1])])
                        handleChange([parseFloat(min), parseFloat(currentValues[1])]);    
                    }
                }}
            />
            <input 
                type="number" 
                min={currentValues[0]} 
                max={max} 
                value={maxValueNumInput}
                onChange={e => setMaxValueNumInput(parseFloat(e.target.value)) }  
                onBlur={e => {
                    const val = e.target.value ? Number(e.target.value) : max;
                    if (val >= currentValues[0] && val <= max){
                        // setMaxValueNumInput(parseFloat(val))
                        setCurrentValues([parseFloat(currentValues[0]), parseFloat(val)])
                        handleChange([parseFloat(currentValues[0]), parseFloat(val)])    
                    } else {
                        setMaxValueNumInput(parseFloat(max));
                        setCurrentValues([parseFloat(currentValues[0]), parseFloat(max)]);
                        handleChange([parseFloat(currentValues[0]), parseFloat(max)]);    
                    }
                }}  
            />
        </div>
    </div>
  );
};

export default RangeTwoValues;
