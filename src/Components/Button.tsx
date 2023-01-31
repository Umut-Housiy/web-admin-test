import React, { CSSProperties, FunctionComponent, ReactElement } from "react"
import { Loading } from "./Loading"
import { ProcessLoader } from "./ProcessLoader"
interface ButtonProps {
  text: string,
  block?: boolean,
  design?: string,
  color?: string,
  className?: string,
  onClick?: () => void;
  isLoading?: boolean,
  loaderColor?: string,
  hasIcon?: boolean,
  icon?: ReactElement,
  textTiny?: boolean,
  buttonSm?: boolean,
  buttonMd?: boolean,
  buttonLg?: boolean,
  pageLoading?: boolean,
  isDisabled?: boolean
  style?: CSSProperties,
}
export const Button: FunctionComponent<ButtonProps> = (props: ButtonProps) => {
  return (
    <>
      {props.pageLoading ?
        <Loading width="w-48" height="h-12" />
        :
        <button
          style={props.style}
          disabled={props.isLoading ? true : false}
          onClick={props.onClick}
          className={`
          ${props.block ? "w-full" : ""}
          ${props.design && props.design}
          ${props.color && props.color}
          ${props.isDisabled === true ? "pointer-events-none bg-gray-100 text-gray-700 border cursor-not-allowed border-gray-200 button" : props.className !== null && props.className}
          ${props.className !== null && props.className}
          ${props.isLoading ? "cursor-not-allowed" : ""}
          ${props.textTiny === true ? "text-tiny" : "text-sm"}
          ${props.buttonSm === true ? "py-2" : props.buttonMd === true ? "py-2.5" : props.buttonLg === true ? "py-3" : "py-4"}
          button`}
          aria-label={props.text}  >
          <div className="flex justify-center items-center">
            {props.isLoading ?
              <ProcessLoader loaderColor={props.loaderColor} />
              :
              <>
                {props.hasIcon &&
                  props.icon
                }
                {props.text}
              </>
            }
          </div>
        </button>
      }

    </>
  )
}
