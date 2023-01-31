import { FunctionComponent, ReactElement } from "react";
import { Loading } from "./Loading";

interface LabelProps {
  title: string,
  desc?: string | number | ReactElement | null | JSX.Element[],
  character?: string
  endCharacter?: string,
  descBold?: boolean,
  withoutDots?: boolean,
  isRequired?: boolean,
  className?: string,
  descClassName?: string,
  flexStart?: boolean,
  loading?: boolean,
  titleWidth?: string,
  descWidth?: string,
}
export const Label: FunctionComponent<LabelProps> = (props: LabelProps) => {
  return (
    <>
      {props.withoutDots !== true ?
        props.loading ?
          <div className="flex items-center w-full gap-2">
            <Loading textSm width="w-2/5" />
            <Loading textSm width="w-3/5" />
          </div>
          :
          <div className={`${props.flexStart ? "items-start" : "items-center"} w-full flex mb-3`}>
            <p className={`${props.titleWidth ? props.titleWidth : "w-2/5"} p-sm-gray-700 w-2/5 flex items-center justify-between `}>
              {props.title}
              <span>:</span>
            </p>
            <p className={`${props.descBold === true ? "font-medium" : ""} ${props.descClassName ? props.descClassName : "p-sm"} ${props.descWidth ? props.descWidth : "w-3/5"} ml-2 `}>
              {props.character && props.character}
              {props.desc}
              {props.endCharacter && props.endCharacter}

            </p>
          </div>
        :
        props.loading ?
          <Loading textSm />
          :
          <div className={`${props.className ? props.className : ""} flex`}>
            <p className="label"> {props.title}</p>
            {props.isRequired &&
              <span className="text-sm text-red-400 font-medium ml-1">*</span>
            }
          </div>
      }
    </>
  )

}
