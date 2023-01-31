import React, { FunctionComponent } from "react";

import RcPagination from 'rc-pagination';
import LOCALE from 'rc-pagination/es/locale/tr_TR';
import { Loading } from "../Components/Loading";
import { ChevronRightIcon, ThreeDotIcon } from "../Components/Icons";

interface PaginationProps {
  noMargin?: boolean,
  loading?: boolean,
  totalCount?: number,
  page?: number,
  take?: number,
  setPage?: (page: number) => void
}
export const Pagination: FunctionComponent<PaginationProps> = (props: PaginationProps) => {
  return (
    <div className={`${props.noMargin === true ? "" : " mt-6"} w-full flex items-center gap-4 justify-start`}>
      {props.loading  ?
        <>
          <Loading className="mt-3" width={"w-44"} height={"h-8"} />
        </>
        :
        props.totalCount ?
          <RcPagination
            onChange={(page, size) => {
              if (props.setPage) {
                props.setPage(page)
              }
            }}
            className={"flex items-center cursor-pointer"}
            locale={LOCALE}
            current={props.page || 1}
            total={props.totalCount || 0}
            pageSize={props.take || 20}
            itemRender={(page, type, element) => {
              if (type === "page") {
                if (page === props.page)
                  return <div className="px-1.5 h-5 text-blue-400 font-medium  rounded-md text-center inline-block text-tiny">{page}</div>;
                else
                  return <div className="px-1 h-5 hover:text-blue-400 cursor-pointer h-6 text-gray-700  rounded-md text-center inline-block text-tiny">{page}</div>;
              }
              else
                return element;
            }}
            jumpNextIcon={<div className=" bg-gray-100 w-5 mt-1 h-5 text-gray-700 rounded-md text-center  inline-flex jusitfy-center items-center">
              <ThreeDotIcon className="transform rotate-180 w-4 h-4 mx-auto" />
            </div>}
            nextIcon={<div className="bg-gray-100 ml-1 mt-1.5 w-5 h-5 text-gray-700  rounded-md text-center inline-flex jusitfy-center items-center">
              <ChevronRightIcon className="w-5 h-5 mx-auto" />
            </div>}
            prevIcon={<div className="bg-gray-100 mr-1  mt-1.5 w-5 h-5 text-gray-700  rounded-md text-center inline-flex jusitfy-center items-center">
              <ChevronRightIcon className="w-5 h-5 transform mx-auto rotate-180" />
            </div>}
            jumpPrevIcon={<div className="bg-gray-100 mt-1 mx-1 w-5 h-5 text-gray-700 rounded-md text-center inline-flex jusitfy-center items-center">
              <ThreeDotIcon className="transform rotate-180 w-4 h-4 mx-auto" />
            </div>}
          /> : <></>}
    </div>
  );
};
