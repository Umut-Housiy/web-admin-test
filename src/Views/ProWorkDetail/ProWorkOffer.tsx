import { FunctionComponent } from "react"
import { WorkDetailModel, OfferMaterialUnitType } from "../../Models"
import { formatter, fraction } from "../../Services/Functions";

interface ProWorkOfferProp {
  item?: WorkDetailModel,
  offerCreatedDate: number
}

export const ProWorkOffer: FunctionComponent<ProWorkOfferProp> = (props: ProWorkOfferProp) => {

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  const handleTotalTax = () => {
    let sum = 0;
    props.item?.MaterialList.forEach((item) => {
      sum = sum + ((item.TotalPrice / 100) * item.TaxRate);
    })
    return sum;
  }

  const handleGetProjectDay = (startDate, endDate) => {
    let diffInMilliSeconds = Math.abs(endDate - startDate) / 1000;

    const days = Math.floor(diffInMilliSeconds / 86400);
    return days + 1;
  }

  return (
    <div className="pt-4">
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>Teklif Tarihi</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{handleJsDate(props.offerCreatedDate ?? 0)}</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>İş Başlangıç Tarihi</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{handleJsDate(props.item?.PlannedWorkStartDate ?? 0)}</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>İş Teslim Tarihi</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{handleJsDate(props.item?.PlannedWorkCompleteDate ?? 0)}</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>Proje Süresi</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{handleGetProjectDay((props.item?.PlannedWorkStartDate ?? 0), (props.item?.PlannedWorkCompleteDate ?? 0))} gün</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>Teklif Açıklaması</span><span>:</span></div>
        <div className="text-gray-900 font-medium">{props.item?.OfferDescription}</div>
      </div>
      <div className="flex items-center text-sm gap-2 mb-4">
        <div className="text-gray-700 flex justify-between w-1/6"><span>Toplam Tutar</span><span>:</span></div>
        <div className="text-gray-900 font-medium">
          {(props.item?.TotalPrice ?? 0) % 1 === 0 ?
            <>{fraction.format((props.item?.TotalPrice ?? 0))} TL </>
            :
            <>{formatter.format((props.item?.TotalPrice ?? 0))} TL</>
          }
        </div>
      </div>
      <div className="pt-4 border-t border-gray-200">
        <h2 className="mb-4">Malzeme Listesi</h2>
        <div className="py-4 px-2 bg-gray-100 text-gray-400 text-sm font-medium grid grid-cols-8">
          <div className="col-span-2">Malzeme Adı</div>
          <div className="col-span-2">Marka</div>
          <div className="col-span-1">Miktar-Birim</div>
          <div className="col-span-1">Birim Fiyat</div>
          <div className="col-span-1">KDV</div>
          <div className="col-span-1">Tutar</div>
        </div>
        {
          props.item?.MaterialList &&
          <>
            {
              props.item.MaterialList.map((item) => (
                <div className="py-4 px-2 text-sm grid grid-cols-8">
                  <div className="col-span-2">{item.MaterialName}</div>
                  <div className="col-span-2">{item.Brand}</div>
                  <div className="col-span-1">{(item.Quantity) + " " + (item.Unit === OfferMaterialUnitType.PIECE ? "adet" : item.Unit === OfferMaterialUnitType.KG ? "kg" : item.Unit === OfferMaterialUnitType.LT ? "lt" : item.Unit === OfferMaterialUnitType.M2 ? "m2" : "")}</div>
                  <div className="col-span-1">
                    {Number((item.TotalPrice / item.Quantity) ?? 0) % 1 === 0 ?
                      <>{fraction.format(Number((item.TotalPrice / item.Quantity) ?? 0))} TL </>
                      :
                      <>{formatter.format(Number((item.TotalPrice / item.Quantity) ?? 0))} TL</>
                    }
                  </div>
                  <div className="col-span-1">{"%" + item.TaxRate}</div>
                  <div className="col-span-1">
                    {Number(item.TotalPrice ?? 0) % 1 === 0 ?
                      <>{fraction.format(Number(item.TotalPrice ?? 0))} TL </>
                      :
                      <>{formatter.format(Number(item.TotalPrice ?? 0))} TL</>
                    }
                  </div>
                </div>
              ))
            }
            <div className="py-4 px-2  text-gray-400 text-sm font-medium grid grid-cols-8">
              <div className="col-span-6"></div>
              <div className="col-span-1">Toplam KDV:</div>
              <div className="col-span-1">
                {Number(handleTotalTax() ?? 0) % 1 === 0 ?
                  <>{fraction.format(Number(handleTotalTax() ?? 0))} TL </>
                  :
                  <>{formatter.format(Number(handleTotalTax() ?? 0))} TL</>
                }
              </div>
            </div>
            <div className="py-4 px-2  text-gray-400 text-sm font-medium grid grid-cols-8">
              <div className="col-span-6"></div>
              <div className="col-span-1">Toplam İşçilik Bedeli:</div>
              <div className="col-span-1">
                {Number(props.item.TotalWorkmanshipPrice ?? 0) % 1 === 0 ?
                  <>{fraction.format(Number(props.item.TotalWorkmanshipPrice ?? 0))} TL </>
                  :
                  <>{formatter.format(Number(props.item.TotalWorkmanshipPrice ?? 0))} TL</>
                }
              </div>
            </div>
            <div className="py-4 px-2  font-medium grid grid-cols-8">
              <div className="col-span-6"></div>
              <div className="col-span-1 text-sm  text-gray-400">Toplam Tutar:</div>
              <div className="col-span-1 text-tiny text-gray-900">
                {Number(props.item.TotalPrice ?? 0) % 1 === 0 ?
                  <>{fraction.format(Number(props.item.TotalPrice ?? 0))} TL </>
                  :
                  <>{formatter.format(Number(props.item.TotalPrice ?? 0))} TL</>
                }
              </div>
            </div>
          </>
        }
      </div>
    </div>
  )
}
