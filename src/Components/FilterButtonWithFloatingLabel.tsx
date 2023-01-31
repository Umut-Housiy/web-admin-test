import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";

import { ChevronDownIcon } from "./Icons";
import { ProcessLoader } from "./ProcessLoader";
import { DropdownSearchBar } from "./DropdownSearchBar";
import { Image } from "./Image";

interface FilterButtonProps {
  label?: string;
  onClick?: () => void;
  onItemSelected?: (selected: { key: string, value: string, flag?: string }) => void;
  isDropDownOpen?: boolean;
  className?: string;
  classNameDropdown?: string,
  isCheckboxVisible?: boolean;
  items?: { key: string, value: string }[];
  child?: ReactElement,
  isFull?: boolean,
  icon?: boolean,
  iconComponent?: ReactElement,
  labelClassName?: string,
  isDisabled?: boolean,
  pageLoading?: boolean,
  isSearchable?: boolean,
  showImage?: boolean
  welcome?: boolean,
  placeholder?: string,
  labelKey?: number
}

export const FilterButtonWithFloatingLabel: FunctionComponent<FilterButtonProps> = (props: FilterButtonProps) => {

  const [isDropDownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (props.isDropDownOpen !== undefined) {
      setIsDropdownOpen(props.isDropDownOpen);
    }
  }, [props.isDropDownOpen]);

  useEffect(() => {
    setSearchText("");
  }, [isDropDownOpen]);

  return (
    <div className={`${props.isFull && 'w-full'} ${(props.isDisabled || props.pageLoading) ? `pointer-events-none bg-gray-100 rounded-lg ` : ""} relative `} onClick={props.onClick}>
      <div className={`${isDropDownOpen ? `shadow-customBlue focus:outline-none bg-white z-10  border-blue-400` : "border-gray-300"} ${props.className} ${isDropDownOpen ? "pb-1" : `${props.labelKey === 0 ? "py-2.5" : "pb-1"} `} rounded-md duration-200  border  inline-block cursor-pointer relative font-normal text-sm  text-center focus:outline-none z-10  `} onClick={() => { setIsDropdownOpen(!isDropDownOpen) }}>
        {props.pageLoading === true ?
          <ProcessLoader loaderColor="bg-gray-400" />
          :
          <div className={`${(props.labelKey === 0) ? "text-gray-400" : "text-gray-900 font-medium"} ${props.isDisabled ? "opacity-30" : ""} py-1 pl-3 pr-5 font-normal flex  items-center justify-between`}>
            <div className="flex flex-col items-start justify-start">
              <p className="block text-xxs font-medium text-gray-700">{(props.placeholder && isDropDownOpen && props.labelKey === 0) ? props.placeholder : ""} {props.labelKey !== 0 && props.placeholder}</p>
              {(props.placeholder && props.labelKey === 0 && isDropDownOpen === false) ? props.placeholder : props.label}
            </div>
            <ChevronDownIcon className={`${isDropDownOpen && "transform -rotate-180 "} transition duration-300 icon-sm text-gray-400 ml-3 `} />
          </div>
        }
      </div>
      {isDropDownOpen &&
        <>
          <div className="fixed inset-0 z-10 " onClick={() => { setIsDropdownOpen(false); }}></div>
          <div className={`${props.classNameDropdown} ${props.welcome ? "top-14  rounded-md shadow-custom border-gray-300" : "top-12 rounded-b-md  border-blue-400"} max-h-64 overflow-auto custom-scrollbar absolute z-40 border bg-white right-0 left-0`}>
            <div className="mt-2">
              {props.isSearchable && <DropdownSearchBar notButton placeholder="Arama Yap" inputClassName="border-gray-200 text-sm" iconColor="text-gray-400" onChange={(e) => {
                setSearchText(e.target.value)
              }} />}
              {props.items !== (null || undefined) ?
                <>
                  {(props.isSearchable && searchText ? props.items.filter(x => x.value.toLocaleLowerCase('tr').indexOf(searchText.toLocaleLowerCase('tr')) > -1) : props.items).map((item, index) => (
                    <div key={item.key + "_" + index} className="flex py-3 px-2 items-center hover:bg-gray-100 cursor-pointer" onClick={() => { props.onItemSelected?.(item); setIsDropdownOpen(false) }}>
                      {props.isCheckboxVisible && <input type="checkbox" className="mr-2 w-4 h-4 bg-blue-400" />}
                      <label className="text-sm font-normal text-gray-700 leading-5">{item.value}</label>
                    </div>
                  ))}
                </>
                :
                <>
                  {props.child}
                </>
              }

            </div>
          </div>
        </>
      }
    </div>
  );
};
