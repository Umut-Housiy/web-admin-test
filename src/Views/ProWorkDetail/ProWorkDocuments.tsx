import { FunctionComponent } from "react"
import { WorkDetailModel } from "../../Models"
import { Image } from "../../Components/Image";
import { EmptyList } from "../../Components/EmptyList";
import { SRLWrapper } from "simple-react-lightbox";

interface ProWorkDocumentsProp {
  item?: WorkDetailModel
}

export const ProWorkDocuments: FunctionComponent<ProWorkDocumentsProp> = (props: ProWorkDocumentsProp) => {

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  return (
    <>
      <div className="grid grid-cols-12 py-5 border-b border-gray-200 text-type-12-medium text-gray-700 flex items-center">
        <div className="col-span-2">Belge Görseli</div>
        <div className="col-span-8">Belge Adı</div>
        <div className="col-span-2">Yükleme Tarihi</div>
      </div>
      {
        (props.item?.Documents && props.item?.Documents.length > 0) ?
          <SRLWrapper>
            <>
              {
                props.item.Documents.map((item) => (
                  <div className="grid grid-cols-12 py-4 border-b border-gray-200 text-sm text-gray-900 font-medium flex items-center">
                    <div className="col-span-2">
                      <Image src={item.Url} alt={item.Name} className="object-contain cursor-pointer w-20 h-20" />
                    </div>
                    <div className="col-span-8">{item.Name}</div>
                    <div className="col-span-2">{handleJsDate(item.CreatedDateJS)}</div>
                  </div>
                ))
              }
            </>
          </SRLWrapper>
          :
          <EmptyList text="Belge Bulunamadı" />
      }
    </>
  )
}
