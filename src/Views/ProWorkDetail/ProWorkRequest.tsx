import { FunctionComponent } from "react"
import { ProRequestNewModel } from "../../Models"
import { Image } from "../../Components/Image";
import { SRLWrapper } from "simple-react-lightbox";


interface ProWorkRequestProp {
  item?: ProRequestNewModel
}

export const ProWorkRequest: FunctionComponent<ProWorkRequestProp> = (props: ProWorkRequestProp) => {
  return (
    <div className="pt-4">
      <div className="mb-4">
        <p className="text-type-12-medium text-gray-700 mb-2">
          Hizmet Alınacak Tarih
        </p>
        <p className="text-sm text-gray-900 mb-1">
          {props.item?.DateOption === 1 ? props.item?.RequestedServiceDate : props.item?.DateOption === 2 ? "İki ay içerisinde" : props.item?.DateOption === 3 ? "Altı ay içerisinde" : props.item?.DateOption === 4 ? "Sadece fiyat almak istiyorum" : ""}
        </p>
      </div>
      <div className="mb-4">
        <p className="text-type-12-medium text-gray-700 mb-2">
          Hizmet Alınacağı Konum
        </p>
        <p className="text-sm text-gray-900 mb-1">
          {props.item?.CityName + "/" + props.item?.DistrictName}
        </p>
      </div>
      {
        props.item?.Answers &&
        <>
          {
            props.item?.Answers.map((item, index) => (
              <div className="mb-4" key={"answers" + index}>
                <p className="text-type-12-medium text-gray-700 mb-2">
                  {item.Question}
                </p>
                {
                  item.DataType === 1 || item.DataType === 3 ?
                    <p className="text-sm text-gray-900 mb-1">
                      {item.Value}
                    </p>
                    :
                    item.DataType === 2 ?
                      JSON.parse(item.Value).map((item2, index2) => (
                        <p className="text-sm text-gray-900 mb-1" key={"dataType2" + index2}>
                          {item2}
                        </p>
                      ))
                      :
                      item.DataType == 4 &&
                      <SRLWrapper>
                        <div className="lg:grid-cols-7 gap-2.5 grid">
                          {
                            JSON.parse(item.Value).map((item3, index3) => (
                              <div className="lg:col-span-1" key={"dataType4" + index3}>
                                <Image className="cursor-pointer" src={item3} key={"proRequestPhotos" + index3} />
                              </div>
                            ))
                          }
                        </div>
                      </SRLWrapper>
                }
              </div>
            ))}
        </>
      }
    </div>
  )
}
