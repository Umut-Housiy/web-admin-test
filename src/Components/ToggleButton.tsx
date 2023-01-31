import { FunctionComponent, useState } from "react"
import { Loading } from "./Loading"
interface ToggleButtonProps {
  onClick?: () => void;
  defaultValue?: boolean;
  isDisabled?: boolean,
  loading?: boolean
}
export const ToggleButton: FunctionComponent<ToggleButtonProps> = (props: ToggleButtonProps) => {
  return (
    <div className={`${props.isDisabled == true ? "pointer-events-none" : ""} relative inline-block w-10 mr-2 align-middle select-none `}>
      {props.loading ? <Loading width="w-10" height="h-6" /> :
        <>
          <input type="checkbox" name="toggle" id="toggle" className=" focus:outline-none toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" onChange={() => { }} onClick={props.onClick} checked={props.defaultValue} />
          <div className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></div>
        </>
      }
    </div>
  )
}
