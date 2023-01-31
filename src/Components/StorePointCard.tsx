import React, { FunctionComponent } from "react"

import { StarIcon } from "./Icons"
import { Loading } from "./Loading"

interface StorePointCardProps {
  storePointValue: number,
  evaluationCount: number,
  loading?: boolean
}
export const StorePointCard: FunctionComponent<StorePointCardProps> = (props: StorePointCardProps) => {
  return (
    <div className={props.loading ? "" : "bg-gray-100 py-6 px-3 shadow-md rounded-lg"}>
      {props.loading ?
        <Loading width="w-full" height="h-28" />
        :
        <div className="flex items-center">
          <div className="bg-white rounded-full">
            <StarIcon className="h-6 w-6 m-3.5 text-yellow-400" />
          </div>
          <div className="flex-1 mx-2">
            <p className="text-gray-700 font-medium mb-1">Genel Mağaza Puanınız</p>
            <div className="flex items-center">
              <h4 className="text-gray-900 mr-2">
                {(props.storePointValue * 2) % 1 === 0 ?
                  <>{(props.storePointValue * 2)} </>
                  :
                  <>{(props.storePointValue * 2).toFixed(1)}</>
                }
                / 10 </h4>
              <p className="p-sm">( {props.evaluationCount} değerlendirme )</p>
            </div>
          </div>
        </div>
      }

    </div>
  )
}
