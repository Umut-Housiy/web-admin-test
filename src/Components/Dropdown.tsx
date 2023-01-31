import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { DropdownSearchBar } from "./DropdownSearchBar";

import { ChevronFillIcon } from "./Icons";
import { Loading } from "./Loading";

interface DropdownProps {
  label?: string;
  onClick?: () => void;
  onItemSelected?: (selected: {
    key: string;
    value: string;
    groupId?: number;
    photo?: string;
  }) => void;
  isDropDownOpen?: boolean;
  className?: string;
  classNameDropdown?: string;
  isCheckboxVisible?: boolean;
  items?: { key: string; value: string }[];
  child?: ReactElement;
  isFull?: boolean;
  icon?: boolean;
  iconComponent?: ReactElement;
  labelClassName?: string;
  isDisabled?: boolean;
  loading?: boolean;
  isMultiSelect?: boolean;
  isSearchable?: boolean;
  showImage?: boolean;
  pageLoading?: boolean;
  onSearch?: (e: string) => void;
}

export const Dropdown: FunctionComponent<DropdownProps> = (
  props: DropdownProps
) => {
  const [isDropDownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    if (props.isDropDownOpen !== undefined) {
      setIsDropdownOpen(props.isDropDownOpen);
    }
  }, [props.isDropDownOpen]);

  useEffect(() => {
    setSearchText("");
    if (props.onSearch != undefined) {
      props.onSearch("");
    }
  }, [isDropDownOpen]);

  return props.loading ? (
    <Loading inputSm />
  ) : (
    <div
      className={`${props.isFull && "w-full"} ${
        props.isDisabled || props.pageLoading
          ? `pointer-events-none bg-gray-100 ${
              props.showImage ? "rounded-l-md rounded-r-none" : "rounded-md"
            } `
          : ""
      } relative `}
      onClick={props.onClick}
    >
      <div
        className={`${
          isDropDownOpen
            ? "shadow-customFormInput focus:outline-none bg-white z-10  border-blue-400"
            : "border-gray-200"
        } ${props.className ? props.className : "w-full"} ${
          props.showImage ? "rounded-l-md" : "rounded-md"
        } py-2 duration-200  border  inline-block cursor-pointer relative font-normal text-sm  text-center focus:outline-none z-10  `}
        onClick={() => {
          setIsDropdownOpen(!isDropDownOpen);
        }}
      >
        <div
          className={`${
            props.label === "Seçiniz..."
              ? "text-gray-400"
              : "text-gray-900 font-medium"
          } pl-3 pr-5  flex py-1 items-center justify-between text-sm`}
        >
          {props.icon && <>{props.iconComponent}</>}
          {props.label}
          <ChevronFillIcon
            className={`${
              isDropDownOpen && "transform -rotate-180 "
            } transition duration-300 w-2 h-2 ml-3 `}
          />
        </div>
      </div>
      {isDropDownOpen && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => {
              setIsDropdownOpen(false);
              setSearchText("");
            }}
          ></div>
          <div
            className={`top-50 rounded-lg shadow-custom border-gray-300 max-h-88 overflow-auto custom-scrollbar absolute z-40 border bg-white right-0 left-0`}
          >
            <div>
              {props.isSearchable && (
                <DropdownSearchBar
                  notButton
                  iconColor="text-gray-400"
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    if (props.onSearch != undefined) {
                      props.onSearch(e.target.value);
                    }
                  }}
                />
              )}
              {props.items !== (null || undefined) ? (
                <div
                  className={`${
                    props.isSearchable ? " max-h-36" : " max-h-66"
                  } " overflow-auto custom-scrollbar`}
                >
                  {(props.isSearchable && searchText
                    ? props.items.filter(
                        (x) =>
                          x.value
                            .toLocaleLowerCase("tr")
                            .indexOf(searchText.toLocaleLowerCase("tr")) > -1
                      )
                    : props.items
                  ).length > 0 ? (
                    <>
                      {(props.isSearchable && searchText
                        ? props.items.filter(
                            (x) =>
                              x.value
                                .toLocaleLowerCase("tr")
                                .indexOf(searchText.toLocaleLowerCase("tr")) >
                              -1
                          )
                        : props.items
                      ).map((item) => (
                        <div
                          key={item.key}
                          className={`${
                            props.labelClassName ? props.labelClassName : ""
                          } flex px-2 py-3 items-center transition-all duration-500 text-type-12-regular text-gray-700 hover:bg-gray-200 hover:text-gray-900`}
                          onClick={() => {
                            props.onItemSelected?.(item);
                            if (!props.isMultiSelect) {
                              setIsDropdownOpen(false);
                            }
                          }}
                        >
                          {props.isCheckboxVisible && (
                            <input
                              type="checkbox"
                              className="mr-2 w-4 h-4 bg-blue-400"
                            />
                          )}
                          <label>{item.value}</label>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center py-2 text-tiny text-gray-900 font-medium">
                        Seçenek Yok
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>{props.child}</>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
