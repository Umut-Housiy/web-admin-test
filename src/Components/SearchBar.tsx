import { FunctionComponent } from "react"
import { SearchIcon } from "./Icons"
interface SearchBarProps {
  placeholder?: string
  buttonText?: string,
  className?: string,
  notButton?: boolean
  isSmall?:boolean,
  inputClassName?:string,
  iconColor?:string,
  value?:string
  onChange?: (e) => void;
}
export const SearchBar: FunctionComponent<SearchBarProps> = (props: SearchBarProps) => {
  return (
    <div className={`${props.className && props.className} flex items-center`}>
      <div className={`${props.isSmall === true ? "text-sm" : "text-tiny"} ${props.notButton !== true ? "" : "mr-2"} rounded-lg flex text-gray-700 flex-1  relative`}>
        <span className="w-auto flex justify-end items-center p-2 absolute left-0 bottom-0 top-0">
          <SearchIcon className={`${props.iconColor ? props.iconColor : "text-blue-400"} icon-md transform -rotate-90`} />
        </span>
        <input value={props.value} onChange={props.onChange} className={`${props.inputClassName ? props.inputClassName : ""} w-full rounded-lg focus:outline-none border border-gray-200 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 pl-10  `} type="text" placeholder={props.placeholder} />
      </div>
      {props.notButton !== true &&
        <button className="button button-blue-400 px-8">
          {props.buttonText}
        </button>
      }
    </div>
  )
}