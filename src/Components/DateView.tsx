import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";

export interface DateViewPropModel {
  pattern?: string,
  dateNumber: number,
  className?: string
}

export const DateView: FunctionComponent<DateViewPropModel> = (props: DateViewPropModel) => {

  const [dateString, setdateString] = useState<string>("");

  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

  useEffect(() => {
    let date = new Date();

    const minuteMilisec = 60000; // 60 * 1000

    const currentDateMiliSec = props.dateNumber + ((date.getTimezoneOffset() * minuteMilisec));

    date.setTime(currentDateMiliSec);

    let _year = date.getFullYear();
    let _monthNumber = date.getMonth() + 1;
    let _monthString = months[date.getMonth()];
    let _dayNumber = date.getDate();
    let _dayString = days[date.getDay()];
    let _hour = date.getHours();
    let _minute = date.getMinutes();
    let _second = date.getSeconds();

    let result = props.pattern;
    if (!result)
      result = "dd/MM/yyyy HH:mm";

    result = result.replace("HH", _hour.toString().padStart(2, "0"));
    result = result.replace("mm", _minute.toString().padStart(2, "0"));
    result = result.replace("ss", _second.toString().padStart(2, "0"));
    result = result.replace("yyyy", _year.toString().padStart(4, "0"));
    result = result.replace("MMM", _monthString.toString());
    result = result.replace("MM", _monthNumber.toString().padStart(2, "0"));
    result = result.replace("ddd", _dayString.toString());
    result = result.replace("dd", _dayNumber.toString().padStart(2, "0"));

    setdateString(result);
  }, [props.dateNumber]);

  return (
    <p className={props.className}>
      {dateString}
    </p>
  )
}
