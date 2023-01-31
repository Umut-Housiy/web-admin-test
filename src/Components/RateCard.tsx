import React, { FunctionComponent, ReactElement } from "react"
import { Loading } from "./Loading"

interface RateCardProps {
  rateValue: number,
  label: string,
  icon: ReactElement,
  color?: string,
  loading?: boolean,
  productRate?: boolean,
  rateCount?: number,
  bgColor?: string,
  onStore?: boolean
}
export const RateCard: FunctionComponent<RateCardProps> = (props: RateCardProps) => {
  return (
    <div className={`${props.loading ? "" : `${props.bgColor ? props.bgColor : "bg-white"} py-6 px-3 shadow-md rounded-lg`}`}>
      {props.loading ?
        <Loading width="w-full" height="h-28" />
        :
        <div className="flex items-center">
          {props.icon}
          <div className="flex-1 mx-2">
            <p className="text-gray-700 font-medium mb-1">{props.label}</p>
            {props.productRate === true ?
              <div className="flex items-center">
                <h4>{props.rateValue} / 5 </h4>
                <span className="font-medium text-sm ml-2 text-gray-700"> ({props.rateCount} değerlendirme )</span>
              </div>
              :
              props.onStore === true ?
                <div className="flex items-center">
                  <h4>
                    {(props.rateValue * 2) % 1 === 0 ?
                      <>{(props.rateValue * 2)} </>
                      :
                      <>{(props.rateValue * 2).toFixed(1)}</>
                    }
                    / 10 </h4>
                </div>
                :
                <h4 className={`${props.color ? props.color : ""} text-gray-900`}>%{props.rateValue}</h4>
            }

          </div>
        </div>
      }

    </div>
  )
}
