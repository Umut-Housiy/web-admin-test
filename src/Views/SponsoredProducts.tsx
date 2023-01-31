import { FunctionComponent, useContext, useRef } from "react";
import { Table } from "../Components/Table";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Link } from "react-router-dom";
import ApiService from "../Services/ApiService";
import { Image } from "../Components/Image"
import { CountDown } from "../Components/CountDown";
import { ChevronRightIcon, TrashIcon } from "../Components/Icons";
import { readPageQueryString } from "../Services/Functions";

export const SponsoredProducts: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Fiyata göre azalan" },
    { key: "4", value: "Fiyata göre artan" },
    { key: "5", value: "Süreye göre azalan" },
    { key: "6", value: "Süreye göre artan" },
  ];

  const tableEl = useRef<any>();

  const getSponsoredProductList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSponsoredProductList(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Ürünün Sponsorluğunu Sonlandır",
      message: `${item.AdvertTitle} isimli ürünün sponsorluğunu sonlandırmak istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.suspendSponsoredProduct(item.AdvertisementId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Ürünün sponsorluğu başarıyla sonlandırıldı.",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Sponsorlu Ürünler</h2>
        <Table
          ref={tableEl}
          emptyListText={"Ürün Bulunamadı"}
          getDataFunction={getSponsoredProductList}
          header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Reklam ID
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Satıcı Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Ürün Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Reklam Alanı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Reklam Süresi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Kalan Süre
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Görüntülenme Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Tıklanma Sayısı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Durum
              </span>
            </div>
          </div>}
          renderItem={(e, i) => {
            return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam ID:</span>
                <p className="p-sm">
                  {e.AdvertisementId}
                </p>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Satıcı Adı:</span>
                <Link to={`/satici-detay/${e.SellerId}`} className="text-sm font-medium underline text-blue-400">
                  {e.SellerStoreName}
                </Link>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Adı:</span>
                <div className="flex items-center">
                  <Image src={e.AdvertMainPhoto} alt={e.AdvertTitle} className="max-w-12 min-w-12 max-h-12 min-h-12 object-contain" />
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{e.AdvertTitle}</p>
                </div>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam Alanı:</span>
                <p className="p-sm">
                  {e.AdvertisementArea}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Reklam Süresi:</span>
                <p className="p-sm">
                  {e.AdvertisementDayCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Kalan Süre:</span>
                <div className="text-sm">
                  <CountDown startDate={e.AdvertisementStartDateJSTime} endDate={e.AdvertisementEndDateJSTime} />
                </div>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Görüntülenme Sayısı:</span>
                <p className="p-sm">
                  {e.ViewCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Tıklanma Sayısı:</span>
                <p className="p-sm">
                  {e.ClickCount}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between items-center">
                <p className={`${e.Status === "Aktif" ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                  {e.Status}
                </p>
                <div className="text-gray-700 flex gap-2 items-center">
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all" onClick={() => { showDeleteModal(e) }} />
                  <Link to={{ pathname: `/urun-ilan-detay/${e.AdvertId}`, state: { queryPage: Number(readPageQueryString(window.location) ?? "1") } }} >
                    <ChevronRightIcon className="icon-md hover:text-blue-400 cursor-pointer transition-all" />
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
  )
}
