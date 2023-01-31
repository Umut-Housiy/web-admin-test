import React, { FunctionComponent } from "react";
import { StarIcon, StarOutlineIcon } from "./Icons";

interface RateStarsProps {
  rateValue: number,
  className?: string,
  onProfessional?: boolean,
  numberColor?: string

}

export const RateStars: FunctionComponent<RateStarsProps> = (props: RateStarsProps) => {
  return (
    <div className="justify-start flex items-center">
      {props.rateValue >= 1 ? <StarIcon className={`${props.className} text-gray-700`} /> : <StarOutlineIcon className={`${props.className} text-gray-700 mt-0.5`} />}
      {props.rateValue >= 2 ? <StarIcon className={`${props.className} text-gray-700`} /> : <StarOutlineIcon className={`${props.className} text-gray-700 mt-0.5`} />}
      {props.rateValue >= 3 ? <StarIcon className={`${props.className} text-gray-700`} /> : <StarOutlineIcon className={`${props.className} text-gray-700 mt-0.5`} />}
      {props.rateValue >= 4 ? <StarIcon className={`${props.className} text-gray-700`} /> : <StarOutlineIcon className={`${props.className} text-gray-700 mt-0.5`} />}
      {props.rateValue >= 5 ? <StarIcon className={`${props.className} text-gray-700`} /> : <StarOutlineIcon className={`${props.className} text-gray-700 mt-0.5`} />}
      <span className={`${props.onProfessional && "hidden"} ${props.className} ${props.numberColor ?? "text-gray-700"} text-tiny font-semibold ml-2`}>{props.rateValue} </span>
    </div>
  )
}
