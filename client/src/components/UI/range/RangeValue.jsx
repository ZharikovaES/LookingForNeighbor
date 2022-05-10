import React, { useState } from "react";
import { Range, getTrackBackground } from "react-range";
// import "./styles.css";

const RangeValue = ({label, step, min, max, value, handleChange}) => {
  // const STEP = 1;
  // const MIN = 10;
  // const MAX = 100;
  const [currentValue, setCurrentValue] = useState([value]);

  return (
    <div>
      { label && (<label>{label}</label>) }
      <div style={{margin: "40px"}}>
      <Range
        values={currentValue}
        step={step}
        min={min}
        max={max}
        onChange={val => setCurrentValue(val)}
        onFinalChange={handleChange}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
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
                  values: currentValue,
                  colors: ["#548BF4", "#ccc"],
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
              height: '42px',
              width: '42px',
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
              { currentValue[index] }
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

    </div>
  );
};

export default RangeValue;
