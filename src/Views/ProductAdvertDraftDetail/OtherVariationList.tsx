import { FunctionComponent, useContext, useRef } from "react"
import { AlertIcon, ChevronRightIcon } from "../../Components/Icons";
import { Table } from "../../Components/Table";
import { Image } from "../../Components/Image";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import ApiService from "../../Services/ApiService";
import { formatter, fraction } from "../../Services/Functions";
import { Link, useHistory } from "react-router-dom";
import { ProductDraftAdvertListInnerModel } from "../../Models";


export interface OtherVariationListProps {
  DraftId: number
}

export const OtherVariationList: FunctionComponent<OtherVariationListProps> = (props: OtherVariationListProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const history = useHistory();

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  const getDraftsOtherVariations = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getDraftsOtherVariations(props.DraftId, page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  return (
    <>
      <Table
        ref={tableEl}
        key={"1"}
        emptyListText={"İlan Bulunamadı"}
        getDataFunction={getDraftsOtherVariations}
        header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
          <div className="lg:col-span-2 flex items-center">
            <span className="p-sm-gray-400">
              Ürün Adı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Barkod No
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Model No
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Kategori
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Stok Kodu
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Stok Miktarı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Piyasa Satış Fiyatı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Satış Fiyatı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center gap-1">
            <span className="p-sm-gray-400">
              BUYBOX
            </span>
            <AlertIcon className="w-3 h-3 text-gray-400 transform rotate-180" />
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Satıcı Adı
            </span>
          </div>
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Oluşturulma Tarihi
            </span>
          </div>
        </div>}
        renderItem={(e: ProductDraftAdvertListInnerModel, i) => {
          return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b h-20 border-gray-200 hidden lg:grid flex gap-4 items-center">
            <div className="lg:col-span-2 flex gap-4 items-center">
              <Image src={e.ProductMainPhoto} alt={e.ProductName} className="w-14 h-14 object-contain" />
              <p className="p-sm">
                {e.ProductName}
              </p>
            </div>
            <div className="lg:col-span-1 flex ">
              <p className="p-sm">
                {e.BarcodeNo}
              </p>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <p className="p-sm">
                {e.ModelNo}
              </p>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <p className="p-sm">
                {e.Category}
              </p>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <p className="p-sm">
                {e.StockCode}
              </p>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <p className="p-sm">
                {e.StockCount}
              </p>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <p className="p-sm">
                {e.MarketPrice % 1 === 0 ?
                  <>{fraction.format(e.MarketPrice)} TL </>
                  :
                  <>{formatter.format(e.MarketPrice)} TL</>
                }
              </p>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <p className="p-sm">
                {e.SalePrice % 1 === 0 ?
                  <>{fraction.format(e.SalePrice)} TL </>
                  :
                  <>{formatter.format(e.SalePrice)} TL</>
                }
              </p>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <p className="text-sm font-medium text-green-400">
                {e.BuyboxPrice % 1 === 0 ?
                  <>{fraction.format(e.BuyboxPrice)} TL </>
                  :
                  <>{formatter.format(e.BuyboxPrice)} TL</>
                }
              </p>
            </div>
            <div className="lg:col-span-1 flex items-center">
              <p className="text-sm font-medium text-blue-400 underline cursor-pointer" onClick={() => { history.push("/satici-detay/" + e.SellerId); }}>
                {e.SellerName}
              </p>
            </div>
            <div className="lg:col-span-1 flex justify-between">
              <p className="p-sm">
                {handleJsDate(e.CreatedDateJSTime)}
              </p>
              <div className="text-gray-700 flex gap-2 items-center">
                <Link target="_blank" to={`/onay-bekleyen-ilan-detay/${e.DraftId}`}>
                  <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
                </Link>
              </div>
            </div>
          </div>
        }}
      />
    </>
  )
}
