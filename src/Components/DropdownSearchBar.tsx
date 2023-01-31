import { FunctionComponent } from "react"
import { SearchIconNew } from "./Icons"

interface DropdownSearchBarProps {
  placeholder?: string
  buttonText?: string,
  className?: string,
  notButton?: boolean
  isSmall?: boolean,
  inputClassName?: string,
  iconColor?: string,
  value?: string
  onChange?: (e) => void;
  onClick?: (e) => void;
}
export const DropdownSearchBar: FunctionComponent<DropdownSearchBarProps> = (props: DropdownSearchBarProps) => {
  return (
    <div className={`${props.className && props.className} flex items-center gap-3`}>
      <div className={`${props.isSmall === true ? "text-sm" : "text-tiny"} ${props.notButton !== true ? "" : "m-2"} rounded-lg flex text-gray-700 flex-1  relative`}>
        <span className="w-auto flex justify-end items-center p-2 absolute left-0 bottom-0 top-0">
          <SearchIconNew className={`${props.iconColor ? props.iconColor : "text-blue-400"} icon-md `} />
        </span>
        <input value={props.value} onChange={props.onChange} className="form-input pl-10" type="text" placeholder={props.placeholder ?? "Ara..."} />
      </div>
      {props.notButton !== true &&
        <button className="button button-blue-400 px-8 py-2" onClick={props.onClick}>
          {props.buttonText}
        </button>
      }
    </div>
  )
}
