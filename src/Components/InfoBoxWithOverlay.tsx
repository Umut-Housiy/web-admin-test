import { FunctionComponent, ReactElement, useState } from "react";
import { InfoIcon } from "./Icons";

interface InfoBoxWithOverlayProps {
  text?: string | ReactElement,
  className?: string,
}

export const InfoBoxWithOverlay: FunctionComponent<InfoBoxWithOverlayProps> = (props: InfoBoxWithOverlayProps) => {

  const [showInfoBox, setShowInfoBox] = useState<boolean>(false);

  return (
    <div className="relative flex items-center justify-between">
      <InfoIcon className={`${props.className ? props.className : showInfoBox ? "text-blue-400" : "text-gray-900"} cursor-pointer icon-sm`} onClick={() => { setShowInfoBox(true) }} />
      {showInfoBox &&
        <>
          <div className="fixed inset-0 bg-black-400 opacity-70 z-20" onClick={() => setShowInfoBox(false)}></div>
          <div className="p-3 rounded-lg bg-white w-60 absolute right-0 top-6 z-30">
            {props.text &&
              <p className="text-sm text-gray-900 leading-4">
                {props.text}
              </p>
            }
          </div>
        </>
      }
    </div>
  )
}
