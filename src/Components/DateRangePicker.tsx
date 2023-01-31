import React, { FunctionComponent, useEffect, useState } from "react";
import { DatePicker } from "./DatePicker";
import { useStateEffect } from "./UseStateEffect";

export interface DatePickerPropModel {
  isFull?: boolean,
  disabled?: boolean,
  pageLoading?: boolean,
  onClick?: () => void,
  setMinDate: (e: Date) => void,
  setMaxDate: (e: Date) => void,
  minValue?: Date,
  maxValue?: Date
}

export const DateRangePicker: FunctionComponent<DatePickerPropModel> = (props: DatePickerPropModel) => {
  const [selectedMinDate, setSelectedMinDate] = useState<Date>(props.minValue || new Date());
  const [selectedMaxDate, setSelectedMaxDate] = useState<Date>(props.maxValue || new Date());

  useStateEffect(() => {
    props.setMinDate(selectedMinDate);
    if (selectedMinDate > selectedMaxDate) {
      setSelectedMaxDate(selectedMinDate);
    }
  }, [selectedMinDate]);

  useStateEffect(() => {
    props.setMaxDate(selectedMaxDate);
  }, [selectedMaxDate]);

  useEffect(() => {
    if (props.minValue) setSelectedMinDate(props.minValue);
  }, [props.minValue]);

  useEffect(() => {
    if (props.maxValue) setSelectedMaxDate(props.maxValue);
  }, [props.maxValue]);

  return (
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="lg:col-span-1">
          <DatePicker
              isFull
              // maxDate={selectedMaxDate}
              value={selectedMinDate}
              setSelectedDate={(e) => {
                setSelectedMinDate(e)
              }}
          />
        </div>
        <div className="lg:col-span-1">
          <DatePicker
              isFull
              minDate={selectedMinDate}
              value={selectedMaxDate}
              setSelectedDate={(e) => {
                setSelectedMaxDate(e)
              }}
          />
        </div>
      </div>
  )
}
