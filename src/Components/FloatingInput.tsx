import { FunctionComponent } from "react"
import { CheckCircleIcon } from "./Icons"
import { Loading } from "./Loading"

interface FloatingInputProps {
  label: string,
  className?: string,
  value: string | number,
  onChange: (e) => void,
  type: string,
  password?: boolean,
  isInvalid?: boolean,
  invalidText?: string,
  checkValid?: boolean,
  loading?: boolean,
  idForLabel?: string,
  onKeyDown?: (e) => void
}

export const FloatingInput: FunctionComponent<FloatingInputProps> = (props: FloatingInputProps) => {


  return (
    props.loading ?
      <Loading inputSm />
      :
      <>
        <div className={`${props.className ? props.className : ""} grid`}>
          <label htmlFor={props.idForLabel ?? props.label} className={`${props.checkValid && props.isInvalid ? "floating-label-wrapper--invalid border-red-400" : ""} floating-label-wrapper`}>
            <input value={props.value} onChange={props.onChange} onKeyDown={props.onKeyDown} type={props.type} id={props.idForLabel ?? props.label} placeholder={props.label} className="floating-label-input" autoComplete="new-password" />
            <span className="floating-label">{props.label}</span>
            {(props.checkValid && props.isInvalid === false && props.value !== "" && props.value !== null) ?
              <CheckCircleIcon className="icon-sm text-green-400 absolute right-4 top-4" />
              :
              <></>
            }
          </label>
        </div>
        {(props.checkValid && props.isInvalid === true) ?
          <span className="text-xs text-red-400 font-medium my-1.5">{props.invalidText}</span>
          :
          <></>
        }
      </>
  )
}
