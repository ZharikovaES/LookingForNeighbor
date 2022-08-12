import { subYears } from 'date-fns';
import React from "react";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";

import "react-datepicker/dist/react-datepicker.css";

const CalendarDateOfBirth = props => {
    return (
        <div>
            <label htmlFor={ props.id }>{ props.label }</label>
            <DatePicker 
                className="form-control"
                selected={props.value} 
                onChange={props.handleChange}
                placeholderText={props.placeholderText}
                id={ props.id }
                includeDateIntervals={[{ 
                        start: subYears(new Date(), 118),
                        end: subYears(new Date(), 18) 
                    }]}
                closeOnScroll={true}
                dateFormat="dd.MM.yyyy"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                required={ props.required ?? false }
                //disabledKeyboardNavigation
                locale={ru}
                //yearDropdownItemNumber={100}
            />
        </div>
    );
};
export default CalendarDateOfBirth;