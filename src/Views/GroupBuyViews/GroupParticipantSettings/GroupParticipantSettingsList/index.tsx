import React, { useCallback, useContext, useRef, useState } from "react";
import { Table } from "../../../../Components/Table";
import { readPageQueryString } from "../../../../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../../../../Services/SharedContext";
import { GroupParticipantSetting, SellerModel } from "../../../../Models";
import { Link, useHistory } from "react-router-dom";
import { Button } from "../../../../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../../../../Components/Icons";
import ApiService from "../../../../Services/ApiService";
import { CustomDropdown, Option } from "../../../../Components/CustomDropdown";
import { useStateEffect } from "../../../../Components/UseStateEffect";

function AddNewButton() {
  const history = useHistory();
  return (
    <Button buttonMd textTiny color="text-blue-400"
            className="w-72" design="button-blue-100"
            text="Yeni İçerik Oluştur" hasIcon
            icon={<PlusIcon className="icon-sm mr-2"/>}
            onClick={() => history.push("/grup-alim-katilimci-ayari/olustur")}/>
  );
}

function ItemComponent(props: { item: GroupParticipantSetting & { SellerName: string; }, showDeleteModal: () => void }) {
  const {item, showDeleteModal} = props;
  return (
    <div className="lg:grid-cols-6 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
      <div className="lg:col-span-1 flex lg:block items-center">
        <p className="p-sm">
          {item.Name}
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <p className={`p-sm ${item.IsGeneral ? 'text-blue-400' : 'text-green-400'}`}>
          {item.IsGeneral ? 'Genel' : 'Özel'}
        </p>
      </div>
      <div className="lg:col-span-2 flex lg:block items-center">
        <p className="p-sm">
          {item.SellerName}
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <p className="p-sm">
          {item.ParticipantCount}
        </p>
      </div>
      <div className="lg:col-span-1 flex justify-between items-center">
        <div className="text-gray-700 flex gap-2 items-center ml-auto">
          <Link to={{
            pathname: `/grup-alim-katilimci-ayari/duzenle/${item.Id}`,
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

export function GroupParticipantSettingsList() {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const tableEl = useRef<any>();

  const [selectedSeller, setSelectedSeller] = useState<Option>({key: '-1', value: ''});
  const [sellerList, setSellerList] = useState<SellerModel[]>([]);

  const getSellerOptionList = useCallback(async () => {
    const response = await ApiService.getSellerApprovedList(1, 9999, '', 1);
    if (response.succeeded && response.data) {
      setSellerList(response.data.Data);
      return response.data.Data.map((item) => ({key: String(item.Id), value: item.StoreName}));
    }
    setSellerList([]);
    return [];
  }, []);

  const fetchItemList = useCallback(async (order: number, searchText: string, page: number, take: number) => {
    const response = await ApiService.getGroupParticipantSettingsList({
      page, take, searchText, sellerId: selectedSeller.key === '-1' ? 0 : Number(selectedSeller.key),
    });

    if (response.succeeded && response.data) {
      return {Data: response.data.Data, TotalCount: response.data.TotalCount};
    } else {
      return {Data: [], TotalCount: 0,}
    }
  }, [selectedSeller]);

  const showDeleteModal = useCallback((item: GroupParticipantSetting) => {
    context.showModal({
      type: "Question",
      title: "Katılımcı Ayarı Sil",
      message: `${item.Name} isimli katılımcı ayarını silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const response = await ApiService.deleteGroupParticipantSettings({id: item.Id});
        context.hideModal();

        if (response.succeeded) {
          context.showModal({
            type: "Success",
            title: "Katılımcı Ayarı başarıyla silindi",
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

      onClose: () => context.hideModal(),
    })
  }, []);

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [selectedSeller]);

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Oluşturulan Katılımcı Ayarları</h2>
        <Table
          ref={tableEl}
          emptyListText={"Katılımcı Ayarı Bulunamadı"}
          getDataFunction={fetchItemList}
          addNewButton={<AddNewButton/>}
          header={
            <div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-1 flex items-center">
                <span className="p-sm-gray-400">
                  Katılımcı Ayarı İsmi
                </span>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <span className="p-sm-gray-400">
                  Genel / Özel
                </span>
              </div>
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-400 mr-4">
                  Mağaza ismi
                </span>
                <div style={{width: 160}}>
                  <CustomDropdown value={selectedSeller} onChange={setSelectedSeller} placeholder="Seçiniz..."
                                  getOptionList={getSellerOptionList} className="text-gray-400"/>
                </div>
              </div>
              <div className="lg:col-span-1 flex items-center">
                <span className="p-sm-gray-400">
                  Kişi sayısı
                </span>
              </div>
            </div>
          }
          renderItem={(item, index) => (
            <ItemComponent
              item={{
                ...item, SellerName: item.SellerId ?
                  (sellerList.find((seller) => seller.Id === item.SellerId)?.StoreName || '-') : '-'
              }}
              showDeleteModal={() => showDeleteModal(item)}
              key={`key_${index}`}/>
          )}
          page={Number(readPageQueryString(window.location) ?? "1")}
          setPageQueryString
          noSortOptions
        />
      </div>
    </div>
  );
}
