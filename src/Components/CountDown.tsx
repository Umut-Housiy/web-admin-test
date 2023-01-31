import { FunctionComponent, useEffect, useState } from "react";
import Countdown from 'react-countdown';
import { ChevronFillIcon } from "./Icons";

interface CountDownProps {
  startDate: number,
  endDate: number,
  returnActiveDay?: boolean,
  fullRemaingTime?: boolean,
  hasText?: string,
  className?: string,
  timeOutClassName?: string,
  textColor?: string,
  noChevron?: boolean
}

export const CountDown: FunctionComponent<CountDownProps> = (props: CountDownProps) => {

  const [startDate, setStartDate] = useState<Number>(props.startDate > 0 ? props.startDate + (new Date(props.startDate).getTimezoneOffset() * 60000) : props.startDate);

  const [endDate, setEndDate] = useState<Number>(props.endDate > 0 ? props.endDate + (new Date(props.endDate).getTimezoneOffset() * 60000) : props.endDate);

  useEffect(() => {
    if (props.startDate > 0) {
      let adjustedStartDate = props.startDate + (new Date(props.startDate).getTimezoneOffset() * 60000);
      setStartDate(adjustedStartDate);
    }
    else {
      setStartDate(props.startDate);
    }
  }, [props.startDate]);

  useEffect(() => {
    if (props.endDate > 0) {
      let adjustedEndDate = props.endDate + (new Date(props.endDate).getTimezoneOffset() * 60000);
      setEndDate(adjustedEndDate);
    }
    else {
      setEndDate(props.endDate);
    }
  }, [props.endDate]);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {

    if (completed) {
      if (new Date().getTime() >= startDate && new Date().getTime() <= endDate) {
        return <Countdown date={calculateRemaingDate(startDate, endDate)} renderer={renderer} />
      }
      else {
        return <span className={`${props.timeOutClassName ? props.timeOutClassName : "text-gray-700"} text-sm font-medium`}>Süresi Doldu!</span>;
      }
    }
    else {
      return (
        props.fullRemaingTime !== true ?
          <span className={`${props.textColor ? props.textColor : new Date().getTime() < startDate ? "text-green-400" : "text-red-400"} text-sm font-medium`} >
            {new Date().getTime() < startDate ? <ChevronFillIcon className={`${props.noChevron ? "hidden" : "inline-block"} text-green-400 transform -rotate-180 w-3 h-3 inline-block mr-1`} /> : <ChevronFillIcon className={`${props.textColor ? props.textColor : "text-red-400"} ${props.noChevron ? "hidden" : "inline-block"} mr-1 w-3 h-3`} />}
            {(days && days > 0) ? <> {days} gün</>
              :
              (hours && hours > 0) ? <>{hours} saat</>
                :
                (minutes && minutes > 0) ? <>{minutes} dakika </>
                  :
                  (seconds && seconds > 0) && <>{seconds} saniye</>
            }
          </span>
          :
          <div className="flex">
            {props.hasText ? <span className={`${new Date().getTime() < startDate ? "text-green-400" : "text-red-400"} text-sm mr-1 flex items-center `}>{props.hasText}</span> : <></>}
            <span className={`${new Date().getTime() < startDate ? "text-green-400" : "text-red-400"}  ${props.className ? props.className : "text-sm font-medium"} flex items-center `} >
              {new Date().getTime() < startDate ? <ChevronFillIcon className="text-green-400 w-3 h-3 inline-block mr-1 transform -rotate-180" /> : <ChevronFillIcon className="inline-block mr-1 text-red-400 w-3 h-3" />}
              {(days && days > 0) ? <> {days} g </> : <></>}

              {(hours && hours > 0) ? <>{hours}sa </> : <></>}

              {(minutes && minutes > 0) ? <>{minutes}dk </> : <></>}

              {(seconds && seconds > 0) && <>{seconds}sn </>}
            </span>
          </div>
      );
    }
  };
  const calculateRemaingDate = (startDate, endDate) => {
    let dateNow = new Date().getTime();
    if (startDate > dateNow) {
      return new Date().setTime(startDate);
    } else if (startDate <= dateNow && endDate >= dateNow) {
      return new Date().setTime(endDate);
    } else {
      return new Date().setTime(-1);
    }
  }

  const renderActiveDay = (startDate, endDate) => {
    let dateNow = new Date().getTime();

    if (startDate <= dateNow && endDate >= dateNow) {
      let activeDay = Math.ceil((dateNow - startDate) / (1000 * 3600 * 24))
      return <>{activeDay} gün</>
    }
    else if (startDate <= dateNow && endDate === -1) {
      let activeDay = Math.ceil((dateNow - startDate) / (1000 * 3600 * 24))
      return <span className="flex items-center text-xs text-red-400 font-medium"> <ChevronFillIcon className="inline-block transform -rotate-180 mr-1 text-red-400 w-3 h-3" />{activeDay} gün</span>
    }
    else {
      return <>-</>
    }
  }
  return (
    props.returnActiveDay === true ?
      renderActiveDay(startDate, endDate)
      :
      (startDate && endDate) ?
        <Countdown date={calculateRemaingDate(startDate, endDate)} renderer={renderer} />
        : <>-</>
  )
}
