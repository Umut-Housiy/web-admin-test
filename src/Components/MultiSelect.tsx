import React, { FunctionComponent, useState } from "react"
import { DropdownSearchBar } from "./DropdownSearchBar";
import { ChevronDownIcon, CloseIcon } from "./Icons";

interface MultiSelectProps {
  showBox: boolean,
  selectedList: any[],
  variationList: any[],
  constVariationList?: any[],
  handleAdd: (selected: {}) => void;
  handleRemove: (selected: {}) => void;
  placeholder: string,
  IsArray?: boolean,
  isSearchable?: boolean
}
export const MultiSelect: FunctionComponent<MultiSelectProps> = (props: MultiSelectProps) => {

  const [showBox, setShowBox] = useState<boolean>(props.showBox);

  const [searchText, setSearchText] = useState<string>("");

  return (
    <div className="relative">
      <div className={`${showBox === true ? "border-blue-400 shadow-customFormInput" : "border-gray-300"}
              ${props.selectedList.length > 0 ? "py-2.5" : "py-3 "} cursor-pointer border rounded-lg text-gray-900 font-medium px-2 w-full text-sm flex items-center z-10`} onClick={() => setShowBox(true)}>
        {props.selectedList.length > 0 ?
          <>
            {props.selectedList.slice(0, 3).map((item, index) => (
              <div key={index} className="py-1 px-2 mr-2 text-gray-700 font-medium bg-blue-100 max-w-1/3 whitespace-nowrap gap-2 flex justify-between items-center z-20 rounded-md">
                <div className="truncate">
                  {props.IsArray ?
                    item
                    :
                    item.Name ?? props.constVariationList?.find(i => i.ElementId === item.ElementId)?.Name
                  }
                </div>
                <CloseIcon className="w-3 h-3 ml-auto cursor-pointer" onClick={() => props.handleRemove(item)} />
              </div>
            ))}
            {props.selectedList.length > 3 &&
              <span className="text-blue-400 font-medium truncate"> +{props.selectedList.length - 3} seçim daha</span>
            }
          </>
          :
          <p className="text-sm text-gray-700">{props.placeholder} Seçiniz...</p>
        }
        <ChevronDownIcon className="text-gray-700 ml-auto w-2 h-2" />
      </div>
      {showBox &&
        <>
          <div className="fixed inset-0 z-10 " onClick={() => setShowBox(false)}></div>
          <div className="absolute top-50 mt-1 shadow-custom left-0 right-0 border border-gray-200 rounded-lg bg-white overflow-hidden z-20 transition-all duration-300">
            {props.isSearchable && <DropdownSearchBar iconColor="text-gray-400" notButton onChange={(e) => {
              setSearchText(e.target.value)
            }} />}
            <div className="max-h-44 overflow-auto custom-scrollbar">
              {(props.isSearchable && searchText ? props.variationList.filter(x => x.Name.toLocaleLowerCase('tr').indexOf(searchText.toLocaleLowerCase('tr')) > -1) : props.variationList).length > 0 ?
                (props.isSearchable && searchText ? props.variationList.filter(x => x.Name.toLocaleLowerCase('tr').indexOf(searchText.toLocaleLowerCase('tr')) > -1) : props.variationList).map((item, index) => (
                  <p
                    key={index}
                    onClick={() => { props.handleAdd(item) }}
                    className={`${props.selectedList.find(i => i.ElementId === item.ElementId) ? "text-type-12-medium text-gray-900" : "text-type-12-regular text-gray-700"} px-2 py-3 hover:bg-blue-100 transition-all duration-300 cursor-pointer hover:text-blue-400`}>
                    <input type="checkbox"
                      className="form-checkbox rounded w-5 h-5 mr-2 icon-sm text-blue-400 border-2 border-gray-400 cursor-pointer"
                      onChange={(e) => { }}
                      checked={props.selectedList.find(i => i.ElementId === item.ElementId) ? true : false}
                    />
                    {item.Name}
                  </p>
                ))
                :
                <p className="p-sm-gray-700 text-center py-4">Seçenek Yok</p>
              }
            </div>
          </div>
        </>
      }
    </div>
  )
}
