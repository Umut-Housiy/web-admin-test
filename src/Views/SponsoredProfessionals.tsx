import { FunctionComponent, useContext, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { DateView } from "../Components/DateView";
import { ChevronRightIcon, TrashIcon } from "../Components/Icons";
import { Table } from "../Components/Table"
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const SponsoredProfessionals: FunctionComponent = () => {

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

  const history = useHistory();

  const getSponsoredProfessionalList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSponsoredProfessionalList(page, take, searchText, order);

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
      title: "Profesyonelin Sponsorluğunu Sonlandır",
      message: `${item.ProStoreName} isimli firmanın sponsorluğunu sonlandırmak istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.suspendSponsoredProfessional(item.AdvertisementId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Profesyonelin sponsorluğu başarıyla sonlandırıldı.",
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
        <h2 className="mb-5">Sponsorlu Profesyoneller</h2>
        <Table
          ref={tableEl}
          emptyListText={"Profesyonel Bulunamadı"}
          getDataFunction={getSponsoredProfessionalList}
          header={<div className=" lg:grid-cols-11 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-2 flex items-center">
              <span className="p-sm-gray-400">
                Firma Adı
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Sponsor Olma Tarihi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Tamamlanma Tarihi
              </span>
            </div>
            <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Sponsor Alanı
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
            return <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Firma Adı:</span>
                <Link to={`/pro-profesyonel-detay/${e.ProId}`} className="text-sm font-medium underline text-blue-400">
                  {e.ProStoreName}
                </Link>
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Sponsor Olma Tarihi:</span>
                <DateView className="text-sm inline-block" dateNumber={e.AdvertisementStartDateJSTime} pattern="dd/MM/yyyy HH:mm" />
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Tamamlanma Tarihi:</span>
                <DateView className="text-sm inline-block" dateNumber={e.AdvertisementEndDateJSTime} pattern="dd/MM/yyyy HH:mm" />
              </div>
              <div className="lg:col-span-2 flex lg:block items-center">
                <span className="p-sm-gray-700 lg:hidden mr-2">Sponsor Alanı:</span>
                <p className="p-sm">
                  {e.AdvertisementArea}
                </p>
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
                  <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                    onClick={() => { showDeleteModal(e) }} />
                  <ChevronRightIcon className="icon-md hover:text-blue-400 cursor-pointer transition-all" onClick={() =>
                    history.push(`//pro-profesyonel-detay/${e.ProId}`)} />
                </div>
              </div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
    </div>

  )
}
