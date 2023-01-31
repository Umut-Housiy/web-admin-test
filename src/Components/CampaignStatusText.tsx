import { FunctionComponent } from "react";
import Countdown from 'react-countdown';
import { currentDateStampForCompare } from "../Services/Functions";

interface CampaignStatusTextProps {
  startDate: number,
  endDate: number
}

export const CampaignStatusText: FunctionComponent<CampaignStatusTextProps> = (props: CampaignStatusTextProps) => {
  const dateForCompare = currentDateStampForCompare();

  const renderer = ({ completed }) => {
    if (completed) {
      if (dateForCompare >= props.startDate && dateForCompare <= props.endDate) {
        return <Countdown date={calculateRemaingDate(props.startDate, props.endDate)} renderer={renderer} />
      }
      else {
        return <span className="text-sm text-gray-700 font-medium">Süresi Doldu!</span>;
      }
    }
    else {
      return (
        props.startDate > dateForCompare ? <span className="text-sm text-green-400 font-medium">Yayına Girmeyi Bekliyor</span>
          : (props.startDate <= dateForCompare && props.endDate >= dateForCompare) ? <span className="text-sm text-green-400 font-medium">Yayında</span>
            : <span className="text-sm text-gray-700 font-medium">Süresi Doldu!</span>
      )
    }
  };

  const calculateRemaingDate = (startDate, endDate) => {
    let dateNow = dateForCompare;
    if (startDate > dateNow) {
      return new Date().setTime(props.startDate)
    }
    else if (startDate <= dateNow && endDate >= dateNow) {
      return new Date().setTime(props.endDate)
    }
    else {
      return new Date().setTime(-1);
    }
  }
  return (
    (props.startDate && props.endDate) ?
      <Countdown date={calculateRemaingDate(props.startDate, props.endDate)} renderer={renderer} /> : <>-</>
  )
}
