import React, { FunctionComponent } from "react";

import { ChevronRightIcon, DoubleLeftIcon } from "../Components/Icons";

interface PaginationProps{
  noMargin?:boolean
}
export const Pagination: FunctionComponent<PaginationProps> = (props : PaginationProps) => {
  return (
    <div className={`${props.noMargin === true ? "" : " mt-6"} flex items-center gap-2 justify-center`}>
      <div className="w-6 h-6 text-gray-700 border rounded-md text-center border-gray-200 inline-flex jusitfy-center items-center">
       <DoubleLeftIcon className="w-4 h-4 mx-auto" />
      </div>
      <div className="w-6 h-6 text-gray-700 border rounded-md text-center border-gray-200 inline-flex jusitfy-center items-center">
       <ChevronRightIcon className="w-5 h-5 transform rotate-180"/>
      </div>
      <div className="w-6 h-6 text-gray-900 border rounded-md text-center border-gray-200 inline-block">
        1
      </div>
      <span className="px-2 text-gray-200 font-light">/</span>
      <div className="w-6 h-6 text-gray-700  rounded-md text-center inline-block">
        21
      </div>
      <div className="w-6 h-6 text-gray-700 border rounded-md text-center border-gray-200 inline-flex jusitfy-center items-center">
      <ChevronRightIcon className="w-5 h-5 mx-auto"/>
      </div>
      <div className="w-6 h-6 text-gray-700 border rounded-md text-center border-gray-200 inline-flex jusitfy-center items-center">
      <DoubleLeftIcon className="transform rotate-180 w-4 h-4 mx-auto" />
      </div>
    </div>
  );
};