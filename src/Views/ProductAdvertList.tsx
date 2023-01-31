import { FunctionComponent, useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Table } from "../Components/Table";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { AlertIcon, ChevronRightIcon, EditIcon } from "../Components/Icons";
import { formatter, fraction, readPageQueryString } from "../Services/Functions"

export const ProductAdvertList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Fiyata göre azalan" },
    { key: "4", value: "Fiyata göre artan" }
  ];

  const handleJsDate = (JsTime) => {
    try {
      var time = new Date(JsTime);
      return time.toLocaleDateString() ?? "";
    }
    catch {
      return ""
    }
  }

  const getProductAdvertList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProductAdvertList(page, take, searchText, order);

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
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Ürün İlan Listesi</h2>
        <div className="w-full overflow-x-auto custom-scrollbar">
          <Table
            ref={tableEl}
            key={"1"}
            emptyListText={"İlan Bulunamadı"}
            getDataFunction={getProductAdvertList}
            header={<div className="w-screen flex px-2 border-b border-t py-5 border-gray-200   gap-4">
              <div className="w-2col flex items-center">
                <span className="p-sm-gray-400">
                  Ürün Adı
                </span>
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  Barkod No
                </span>
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  Model No
                </span>
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  Kategori
                </span>
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  Stok Kodu
                </span>
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  Stok Miktarı
                </span>
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  Piyasa Satış Fiyatı
                </span>
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  Satış Fiyatı
                </span>
              </div>
              <div className="w-1col flex items-center gap-1">
                <span className="p-sm-gray-400">
                  BUYBOX
                </span>
                <AlertIcon className="w-3 h-3 text-gray-400 transform rotate-180" />
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  Satıcı Adı
                </span>
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  Oluşturulma Tarihi
                </span>
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  Favori Sayısı
                </span>
              </div>
              <div className="w-1col flex items-center">
                <span className="p-sm-gray-400">
                  İşlemler
                </span>
              </div>
            </div>}
            renderItem={(e, i) => {
              return <div key={"list" + i} className="w-screen  px-2 border-b min-h-20 py-5 border-gray-200   flex gap-4 items-center">
                <div className="w-2col flex items-center gap-2">
                  <img src={e.ProductMainPhoto} alt={e.ProductName} className="w-16 min-w-16 min-h-16 h-16 object-contain" />
                  <p className="p-sm">
                    {e.ProductName}
                  </p>
                </div>
                <div className="w-1col flex items-center truncate">
                  <p className="p-sm">
                    {e.BarcodeNo}
                  </p>
                </div>
                <div className="w-1col flex items-center truncate">
                  <p className="p-sm">
                    {e.ModelNo}
                  </p>
                </div>
                <div className="w-1col flex items-center">
                  <p className="p-sm">
                    {e.Category}
                  </p>
                </div>
                <div className="w-1col flex items-center truncate">
                  <p className="p-sm">
                    {e.StockCode}
                  </p>
                </div>
                <div className="w-1col flex items-center">
                  <p className="p-sm">
                    {fraction.format(e.StockCount ?? 0)}
                  </p>
                </div>
                <div className="w-1col flex items-center">
                  <p className="p-sm">
                    {e.MarketPrice % 1 === 0 ?
                      <>{fraction.format(e.MarketPrice)} TL </>
                      :
                      <>{formatter.format(e.MarketPrice)} TL</>
                    }
                  </p>
                </div>
                <div className="w-1col flex items-center">
                  <p className="p-sm">
                    {e.SalePrice % 1 === 0 ?
                      <>{fraction.format(e.SalePrice)} TL </>
                      :
                      <>{formatter.format(e.SalePrice)} TL</>
                    }
                  </p>
                </div>
                <div className="w-1col flex items-center">
                  <p className="text-sm font-medium text-green-400">
                    {e.BuyboxPrice % 1 === 0 ?
                      <>{fraction.format(e.BuyboxPrice)} TL </>
                      :
                      <>{formatter.format(e.BuyboxPrice)} TL</>
                    }
                  </p>
                </div>
                <div className="w-1col flex items-center">
                  <p className="text-sm font-medium text-blue-400 underline cursor-pointer" onClick={() => { history.push("/satici-detay/" + e.SellerId); }}>
                    {e.SellerName}
                  </p>
                </div>
                <div className="w-1col flex items-center">
                  <p className="p-sm">
                    {handleJsDate(e.CreatedDateJSTime)}
                  </p>
                </div>
                <div className="w-1col flex items-center">
                  <p className="p-sm">
                    {e.FavoriteCount ?? 0}
                  </p>
                </div>
                <div className="w-1col flex ">
                  <div className="text-gray-700 flex gap-2 items-center">
                    <EditIcon className="w-5 h-5 hover:hover:text-blue-400 cursor-pointer transition-all pl-1" onClick={() => { history.push(`/urun-ilan-duzenle/${e.AdvertId}`); }} />
                    <Link to={{ pathname: `/urun-ilan-detay/${e.AdvertId}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                      <ChevronRightIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" />
                    </Link>
                  </div>
                </div>
              </div>
            }}
            sortOptions={sortOptions}
            page={Number(readPageQueryString(window.location) ?? "1")}
            setPageQueryString
          />
        </div>
      </div>
    </div>
  )
}
