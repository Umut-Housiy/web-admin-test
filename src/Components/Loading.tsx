import { FunctionComponent } from "react"

interface LoadingProps {
  circle?: boolean,
  CircleClassName?: string,
  className?: string
  width?: string,
  height?: string,
  textSm?: boolean,
  textMd?: boolean,
  textLg?: boolean,
  inputSm?: boolean,
  inputMd?: boolean,
  loadingList?: boolean,
  card?: boolean
}


export const Loading: FunctionComponent<LoadingProps> = (props: LoadingProps) => {
  return (
    <div className={`${props.width ? props.width : "w-full"} ${props.className ?? props.className}`}>
      <div className="animate-pulse">
        {props.circle &&
          <div className={`${props.CircleClassName ? props.CircleClassName : "w-12 h-12"} bg-gray-400 rounded-full mb-3`}></div>
        }
        {(props.textSm || props.textMd || props.textLg) &&
          <div className={`${props.className ? "" : props.textSm ? "h-4" : props.textMd ? "h-6" : props.textLg && "h-8"} w-full bg-gray-400 rounded-lg mb-3`}></div>
        }
        {(props.inputSm || props.inputMd) &&
          <div className={`${props.inputSm ? "h-11" : props.inputMd && "h-20"} w-full bg-gray-400 rounded-lg mb-3`}></div>
        }
        {props.height &&
          <div className={`${props.height ? props.height : ""} w-full bg-gray-400 rounded-lg mb-3`}></div>
        }
        {props.card &&
          <div className="w-full bg-gray-400 rounded-lg mb-3 h-60"></div>
        }
      </div>
    </div>

  )
}
