import { FunctionComponent, useContext, useRef } from "react"
import { AlertIcon, ChevronRightIcon } from "../../Components/Icons";
import { Table } from "../../Components/Table";
import { Image } from "../../Components/Image";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import ApiService from "../../Services/ApiService";
import { formatter, fraction } from "../../Services/Functions"
import { ProductListInnerModel } from "../../Models";
import { useHistory } from "react-router";

export interface SellerVariationListPropModel {
  advertId: number
}

export const SellerVariationList: FunctionComponent<SellerVariationListPropModel> = (props: SellerVariationListPropModel) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const getAdvertsOtherVariations = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getAdvertsOtherVariations(props.advertId, page, take, searchText, order);

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
        emptyListText={"Varyasyon Bulunamadı"}
        getDataFunction={getAdvertsOtherVariations}
        header={
          <div className=" lg:grid-cols-6 px-2 border-b border-t lg:h-14 border-gray-200 hidden lg:grid gap-4 flex items-center">
            <div className="lg:col-span-1 flex items-center">
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
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                BUYBOX
              </span>
              <AlertIcon className="w-3 h-3 text-gray-400 transform rotate-180" />
            </div>
            <div className="lg:col-span-1 flex items-center gap-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>
        }
        renderItem={(e: ProductListInnerModel, i) => {
          return (
            <div key={"list" + i} className="lg:grid-cols-6 px-2 border-b  border-gray-200 grid gap-4 items-center py-6 ">
              <div className="lg:col-span-1 flex items-center gap-2">
                <Image src={e.ProductMainPhoto} alt={e.ProductName} className="h-12 w-12 object-contain" ></Image>
                <p className="p-sm">
                  {e.ProductName}
                </p>
              </div>
              <div className="lg:col-span-1 items-center">
                <p className="p-sm">
                  {e.BarcodeNo}
                </p>
              </div>
              <div className="lg:col-span-1 items-center">
                <p className="p-sm">
                  {e.ModelNo}
                </p>
              </div>
              <div className="lg:col-span-1 items-center">
                <p className="p-sm">
                  {e.Category}
                </p>
              </div>
              <div className="lg:col-span-1 items-center">
                <p className="text-sm font-medium text-green-400">
                  {e.BuyboxPrice % 1 === 0 ?
                    <>{fraction.format(e.BuyboxPrice)} TL </>
                    :
                    <>{formatter.format(e.BuyboxPrice)} TL</>
                  }
                </p>
              </div>
              <div className="lg:col-span-1  flex items-center">
                <div className="flex items-center w-full">
                  {
                    e.IsEnabled ?
                      <p className="text-sm font-medium text-green-400">Aktif</p>
                      :
                      <p className="text-sm font-medium text-red-400">Pasif</p>
                  }
                  <ChevronRightIcon className="ml-auto icon-md text-gray-700 hover:text-blue-400 cursor-pointer transition-all" onClick={() => { history.push("/urun-detay/" + e.ProductId); }} />
                </div>
              </div>
            </div>
          )
        }}
      />
    </>
  )
}
