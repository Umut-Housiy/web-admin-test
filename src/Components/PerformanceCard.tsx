import { FunctionComponent } from "react"
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { NormalFaceIconForProgress, SadFaceIconForProgress, SmileIconForProgress } from "./Icons";

interface PerformanceCardProps {
  percentage: number,
  isReverse?: boolean
}

export const PerformanceCard: FunctionComponent<PerformanceCardProps> = (props: PerformanceCardProps) => {
  return (
    <div>
      <div className="flex w-full items-center gap-3 shadow-md py-7 px-3">
        <div style={{ width: 65, height: 65 }}>
          <CircularProgressbarWithChildren value={props.percentage}
            styles={buildStyles({
              pathColor: props.isReverse ? `${props.percentage === 0 ? "gray" : (props.percentage > 0 && props.percentage < 30) ? "green" : (props.percentage >= 30 && props.percentage < 50) ? "gold" : "red"}` : `${props.percentage === 0 ? "gray" : (props.percentage > 0 && props.percentage < 50) ? "red" : (props.percentage >= 50 && props.percentage < 85) ? "gold" : "green"}`,
            })}
          >
            {props.isReverse ?
              <>
                {props.percentage > 50 ? <SadFaceIconForProgress className={`${props.percentage === 0 ? "text-gray-400" : "text-red-400"} w-10 h-10`} />
                  : (props.percentage >= 30 && props.percentage < 50) ? <NormalFaceIconForProgress className="w-10 h-10 text-yellow-400" />
                    : <SmileIconForProgress className="w-10 h-10 text-green-400" />
                }
              </>
              :
              <>
                {props.percentage < 50 ? <SadFaceIconForProgress className={`${props.percentage === 0 ? "text-gray-400" : "text-red-400"} w-10 h-10`} />
                  : (props.percentage >= 50 && props.percentage < 85) ? <NormalFaceIconForProgress className="w-10 h-10 text-yellow-400" />
                    : <SmileIconForProgress className="w-10 h-10 text-green-400" />
                }
              </>
            }
          </CircularProgressbarWithChildren >
        </div>
        <div>
          <p className="text-sm text-black-700 font-medium mb-1 ">
            Başarı Durumu :
            {props.isReverse ? <>
              {props.percentage >= 85 ? " Çok Düşük"
                : props.percentage >= 50 && props.percentage < 85 ? " Düşük"
                  : props.percentage >= 40 && props.percentage < 50 ? " Orta"
                    : props.percentage > 25 && props.percentage < 40 ? " İyi"
                      : props.percentage <= 25 && " Çok Yüksek"}
            </> : <>
              {props.percentage >= 85 ? " Yüksek"
                : props.percentage >= 70 && props.percentage < 85 ? " İyi"
                  : props.percentage > 50 && props.percentage < 70 ? " Orta"
                    : props.percentage > 30 && props.percentage <= 50 ? " Düşük"
                      : props.percentage <= 30 && " Çok Düşük"}
            </>}
          </p>
          <h4 className="font-medium text-black-400">%{props.percentage}</h4>
        </div>
      </div>
    </div>
  )
}
