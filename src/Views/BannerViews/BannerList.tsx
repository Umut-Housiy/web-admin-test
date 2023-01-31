import React, { useCallback, useContext, useRef } from "react";
import { Table } from "../../Components/Table";
import { Button } from "../../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../../Components/Icons";
import { Link, useHistory } from "react-router-dom";
import { readPageQueryString } from "../../Services/Functions";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Banner } from "../../Models";

function BannerAddNewButton() {
  const history = useHistory();
  return (
      <Button buttonMd textTiny color="text-blue-400"
              className="w-72" design="button-blue-100"
              text="Yeni İçerik Oluştur" hasIcon
              icon={<PlusIcon className="icon-sm mr-2"/>}
              onClick={() => history.push("/banner-olustur")}/>
  );
}

function BannerTableHeaderComponent() {
  return (
      <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
        <div className="lg:col-span-1 flex items-center">
          <span className="p-sm-gray-400">
            Banner İsmi
          </span>
        </div>
        <div className="lg:col-span-3 flex items-center">
          <span className="p-sm-gray-400">
            Photo
          </span>
        </div>
        <div className="lg:col-span-2 flex items-center">
          <span className="p-sm-gray-400">
            Geçerlilik tarih aralığı
          </span>
        </div>
        <div className="lg:col-span-1 flex items-center">
          <span className="p-sm-gray-400">
            Aktif/Pasif
          </span>
        </div>
      </div>
  );
}

function BannerItem(props: { banner: Banner, showDeleteModal: () => void }) {
  const {banner, showDeleteModal} = props;
  return (
      <div className="lg:grid-cols-8 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
        <div className="lg:col-span-1 flex lg:block items-center">
          <p className="p-sm">
            {banner.Name}
          </p>
        </div>
        <div className="lg:col-span-3 flex lg:block items-center">
          <p className="p-sm">
            <img src={banner.PhotoUrl} alt={banner.Name} style={{width: 1440 / 3.2, height: 62 / 3.2}}/>
          </p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="w-1/3">
            {(new Date(banner.StartDate)).toLocaleDateString('tr')}
          </span>
          <span className="w-1/3 ml-4">
            {(new Date(banner.EndDate)).toLocaleDateString('tr')}
          </span>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center">
          <p className={`w-20 text-center p-sm rounded-full ${banner.IsEnabled ? "bg-green-100 text-green-400" : "bg-red-100 text-red-400"}`}>
            {banner.IsEnabled ? "Aktif" : "Pasif"}
          </p>
        </div>
        <div className="lg:col-span-1 flex justify-between items-center">
          <div className="text-gray-700 flex gap-2 items-center ml-auto">
            <Link to={{
              pathname: `/banner-duzenle/${banner.Id}`,
              state: {queryPage: Number(readPageQueryString(window.location) ?? "1")}
            }}>
              <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"/>
            </Link>
            <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all "
                       onClick={showDeleteModal}/>
          </div>
        </div>
      </div>
  )
}

export function BannerList() {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const tableEl = useRef<any>();
  const fetchBannerList = useCallback(async (order: number, searchText: string, page: number, take: number) => {
    const response = await ApiService.getBannerList({Page: page, Take: take, searchText, OrderBy: order,});

    if (response.succeeded && response.data) {
      return {
        Data: response.data.Data,
        TotalCount: response.data.TotalCount,
      }
    } else {
      return {
        Data: [],
        TotalCount: 0,
      }
    }
  }, []);

  const showDeleteModal = useCallback((item: Banner) => {
    context.showModal({
      type: "Question",
      title: "Bannerı Sil",
      message: `${item.Name} isimli bannerı silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const response = await ApiService.deleteBannerById({Id: item.Id});
        context.hideModal();

        if (response.succeeded) {
          context.showModal({
            type: "Success",
            title: "Banner başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) tableEl.current?.reload();
            }
          });
        } else {
          context.showModal({
            type: "Error",
            message: response.message,
            onClose: () => context.hideModal(),
          });
        }
        return true;
      },

      onClose: () => {
        context.hideModal();
      },
    })
  }, []);

  return (
      <div className="content-wrapper">
        <div className="portlet-wrapper">
          <h2 className="mb-5">Oluşturulan Bannerlar</h2>
          <Table
              ref={tableEl}
              emptyListText={"Banner Bulunamadı"}
              getDataFunction={fetchBannerList}
              addNewButton={<BannerAddNewButton/>}
              header={<BannerTableHeaderComponent/>}
              renderItem={(item, index) => (
                  <BannerItem
                      banner={item}
                      showDeleteModal={() => showDeleteModal(item)}
                      key={`key_${index}`}/>
              )}
              page={Number(readPageQueryString(window.location) ?? "1")}
              setPageQueryString
          />
        </div>
      </div>
  );
}
