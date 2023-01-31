import React, { useContext, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import ApiService from "../../Services/ApiService";
import { Table } from "../../Components/Table";
import { Button } from "../../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../../Components/Icons";
import { Image } from "../../Components/Image";

const sortOptions = [
  {key: "1", value: "En yeni eklenen"},
  {key: "2", value: "En eski eklenen"},
  {key: "3", value: "Sıraya göre azalan"},
  {key: "4", value: "Sıraya göre artan"},
];

export function HomeSliderListOld() {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();
  const tableEl = useRef<any>();

  const getSliderList = async (order: number, searchText: string, page: number, take: number) => {
    const response = await ApiService.getSliderList(page, take, searchText, order, 1);

    if (response.succeeded) {
      return {
        Data: response.data.Data,
        TotalCount: response.data.TotalCount
      }
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => context.hideModal()
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const showDeleteModal = (item) => {
    context.showModal({
      type: "Question",
      title: "Slider Sil",
      message: `Sliderı silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const response = await ApiService.removeSlider(item.Id);

        context.hideModal();

        if (response.succeeded) {
          context.showModal({
            type: "Success",
            title: "Slider başarıyla silindi",
            onClose: () => context.hideModal(),
          });

          if (tableEl.current) {
            tableEl.current?.reload();
          }
        } else {
          context.showModal({
            type: "Error",
            message: response.message,
            onClose: () => context.hideModal(),
          });
        }

        return true;
      },
      onClose: () => context.hideModal(),
    })
  }

  return (
      <div className="content-wrapper">
        <div className="portlet-wrapper">
          <h2 className="pb-5 border-b">Anasayfa (eski) Slider Yönetimi</h2>
          <Table
              ref={tableEl}
              emptyListText={"Slider Bulunamadı"}
              getDataFunction={getSliderList}
              addNewButton={
                <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100"
                        text="Yeni Slider Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2"/>}
                        onClick={() => history.push(`/slider-ekle/1`)}
                />}
              header={<div
                  className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                Gösterim Sırası
              </span>
                </div>
                <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Görsel
              </span>
                </div>
                <div className="lg:col-span-3">
              <span className="p-sm-gray-400">
                Başlık
              </span>
                </div>
                <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Oluşturulma Tarihi
              </span>
                </div>
                <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Yerleşim Alanı
              </span>
                </div>
                <div className="lg:col-span-2">
              <span className="p-sm-gray-400">
                Durum
              </span>
                </div>
              </div>}
              renderItem={(e, i) => {
                return <div key={"list" + i}
                            className="lg:grid-cols-12 px-2 border-b h-20 border-gray-200 hidden lg:grid flex gap-4 items-center">
                  <div className="lg:col-span-1 flex items-center">
                    <p className="p-sm">
                      {e.OrderBy}
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <Image src={e.PhotoUrl} alt={e.Title} className="w-46 h-14 object-contain"/>
                  </div>
                  <div className="lg:col-span-3">
                    <p className="p-sm">
                      {e.Title}
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <p className="p-sm">
                      {e.CreatedDate}
                    </p>
                  </div>
                  <div className="lg:col-span-2">
                    <p className="p-sm">
                      {e.ShowOnWebsite && "Web"}
                      {e.ShowOnMobilWeb && `${e.ShowOnWebsite ? "," : ""} Mobil Web`}
                      {e.ShowOnApp && `${e.ShowOnMobilWeb ? "," : ""} Mobil Uygulama`}
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex justify-between">
                    <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                      {e.IsEnabled === true ? "Aktif" : "Pasif"}
                    </p>
                    <div className="text-gray-700 flex gap-2 items-center">
                      <Link to={`/slider-detay/${e.Id}`}>
                        <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"/>
                      </Link>
                      <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all "
                                 onClick={() => showDeleteModal(e)}/>
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
