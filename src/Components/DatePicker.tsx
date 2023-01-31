import React, { FunctionComponent } from "react";
import ReactDatePicker from "react-datepicker";
import { CalendarIcon } from "./Icons";
import "react-datepicker/dist/react-datepicker.css";
import tr from 'date-fns/locale/tr';

export interface DatePickerPropModel {
  isFull?: boolean,
  disabled?: boolean,
  pageLoading?: boolean,
  onClick?: () => void,
  value?: Date,
  setSelectedDate: (e: Date) => void,
  className?: string,
  minDate?: Date,
  maxDate?: Date,
  isBirthDate?: boolean
}

export const DatePicker: FunctionComponent<DatePickerPropModel> = (props: DatePickerPropModel) => {

  return (
    <>
      <div className={` ${(props.disabled || props.pageLoading) ? "pointer-events-none bg-gray-100 w-full rounded-lg" : ""} relative `} onClick={props.onClick}>
        <div className={`border-gray-300 ${props.className} ${props.isFull ? 'w-full' : ""} duration-200 py-1.5 border  inline-block cursor-pointer relative rounded-none font-normal text-sm rounded-lg text-center focus:outline-none`}>
          <div className="pl-3 pr-5 font-normal flex py-1 items-center justify-between tailwind-date-picker-wrapper">
            <ReactDatePicker
              selected={props.value}
              onChange={date => props.setSelectedDate(date)}
              minDate={props.minDate}
              maxDate={props.maxDate}
              className={`w-full focus:outline-none cursor-pointer ${props.disabled ? "bg-gray-100" : ""}`}
              placeholderText="Seçiniz"
              showMonthDropdown={props.isBirthDate}
              showYearDropdown={props.isBirthDate}
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              locale={tr}
              dateFormat="dd/MM/yyyy"
            />
            <CalendarIcon className="icon-md text-gray-400" />
          </div>
        </div>
      </div>

    </>
  )
}
