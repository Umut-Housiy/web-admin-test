import React, { FunctionComponent, useEffect, useState } from "react"
import { DropdownSearchBar } from "./DropdownSearchBar";
import { ChevronDownIcon, CloseIcon } from "./Icons";
import { useStateEffect } from "./UseStateEffect";

export interface DropdownModel {
  key: string,
  value: string
}

interface MultiSelectProps {
  data: DropdownModel[],
  selectedValue?: DropdownModel[],
  setSelectedList: (e: DropdownModel[]) => void,
  placeholder: string,
  isSearchable?: boolean

}
export const MultiSelect: FunctionComponent<MultiSelectProps> = (props: MultiSelectProps) => {

  const [selectedList, setSelectedList] = useState<DropdownModel[]>([]);

  useEffect(() => {
    if (props.selectedValue) {
      setSelectedList(props.selectedValue);
    }
  }, [])

  useStateEffect(() => {
    props.setSelectedList(selectedList);
  }, [selectedList])


  const removeFromSelectedList = (e: DropdownModel) => {
    setSelectedList(selectedList.filter(x => x.key !== e.key) || [])
  }

  const addToSelectedList = (e: DropdownModel) => {
    setSelectedList([...selectedList, e]);
  }

  const addOrRemoveSelectedList = (e: DropdownModel) => {
    let temp = selectedList.find(x => x.key === e.key);

    if (temp) {
      removeFromSelectedList(e);
    }
    else {
      addToSelectedList(e);
    }
  }
  const [showBox, setShowBox] = useState<boolean>(false);

  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    setSearchText("");
  }, [showBox]);

  return (
    <div className="relative">
      <div className={`${showBox === true ? "border-blue-400  shadow-customFormInput " : "border-gray-300"}
              ${selectedList.length > 0 ? "py-2.5" : "py-3 "} cursor-pointer border rounded-lg text-gray-900 font-medium px-2 w-full text-sm flex items-center z-10`} onClick={() => setShowBox(true)}>
        {selectedList.length > 0 ?
          <>
            {selectedList.slice(0, 4).map((item, index) => (
              <div key={index} className="py-1 px-2 mr-2 text-gray-900 bg-blue-100 whitespace-nowrap rounded flex items-center z-20">
                {item.value}
                <CloseIcon className="w-3 h-3 ml-2 cursor-pointer" onClick={() => removeFromSelectedList(item)} />
              </div>
            ))}
            {selectedList.length > 4 &&
              <span className="text-blue-400 font-medium"> +{selectedList.length - 4} seçim daha</span>
            }
          </>
          :
          <p className="text-sm text-gray-700">{props.placeholder}</p>
        }
        <ChevronDownIcon className="text-gray-700 ml-auto w-2 h-2" />
      </div>
      {showBox &&
        <>
          <div className="fixed inset-0 z-10 " onClick={() => setShowBox(false)}></div>
          <div className="absolute top-50 mt-1 shadow-custom left-0 right-0 border border-gray-200 rounded-lg bg-white  z-30 transition-all duration-300">
            {props.isSearchable && <DropdownSearchBar iconColor="text-gray-400" notButton onChange={(e) => {
              setSearchText(e.target.value)
            }} />}
            <div className={`${props.isSearchable ? " max-h-44" : " max-h-66"} " overflow-auto custom-scrollbar`}>
              {props.data.length > 0 ?
                (props.isSearchable && searchText ? props.data.filter(x => x.value.toLocaleLowerCase('tr').indexOf(searchText.toLocaleLowerCase('tr')) > -1) : props.data).map((item, index) => (
                  <p
                    key={index}
                    onClick={() => { addOrRemoveSelectedList(item) }}
                    className={`${selectedList.find(i => i.key === item.key) ? "text-type-12-medium text-gray-900" : "text-type-12-regular text-gray-700"} px-2 py-3 hover:bg-blue-100 transition-all duration-300 cursor-pointer hover:text-blue-400`}>
                    <input type="checkbox"
                      className="form-checkbox rounded w-5 h-5 mr-2 icon-sm text-blue-400 border-2 border-gray-400 cursor-pointer"
                      onChange={(e) => { }}
                      checked={selectedList.find(i => i.key === item.key) ? true : false}
                    />
                    {item.value}
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
