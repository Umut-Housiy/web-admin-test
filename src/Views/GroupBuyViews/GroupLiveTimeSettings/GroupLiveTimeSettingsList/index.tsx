import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Table } from "../../../../Components/Table";
import { readPageQueryString } from "../../../../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../../../../Services/SharedContext";
import { GroupLiveTimeSetting, GroupParticipantSetting, SellerModel } from "../../../../Models";
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
            onClick={() => history.push("/grup-alim-sure-ayari/olustur")}/>
  );
}

function ItemComponent(props: { item: GroupLiveTimeSetting & { SellerName: string; ParticipantCount: string; }, showDeleteModal: () => void }) {
  const {item, showDeleteModal} = props;
  return (
    <div className="lg:grid-cols-6 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
      <div className="lg:col-span-1 flex lg:block items-center">
        <p className="p-sm">
          {`${item.LiveTime} saat`}
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
            pathname: `/grup-alim-sure-ayari/duzenle/${item.Id}`,
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

const sortOptions = [
  { key: "1", value: "Yeniden Eskiye" },
  { key: "2", value: "Eskiden Yeniye" },
  { key: "3", value: "Kişiye Göre Azalan" },
  { key: "4", value: "Kişiye Göre Artan" },
  { key: "5", value: "Süreye Göre Azalan" },
  { key: "6", value: "Süreye Göre Artan" },
];

export function GroupLiveTimeSettingsList() {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const tableEl = useRef<any>();

  const [selectedSeller, setSelectedSeller] = useState<Option>({key: '-1', value: 'Seçiniz..'});
  const [sellerList, setSellerList] = useState<SellerModel[]>([]);
  const [participantSettingList, setParticipantSettingList] = useState<GroupParticipantSetting[]>([]);

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
    const response = await ApiService.getGroupLiveTimeSettingsList({
      page, take, searchText, sellerId: selectedSeller.key === '-1' ? null : Number(selectedSeller.key),
      orderBy: order
    });

    if (response.succeeded && response.data) {
      return {Data: response.data.Data, TotalCount: response.data.TotalCount};
    } else {
      return {Data: [], TotalCount: 0,}
    }
  }, [selectedSeller]);

  const fetchParticipants = useCallback(async () => {
    const response = await ApiService.getGroupParticipantSettingsList({
      searchText: '', page: 1, take: 9999, sellerId: 0, includeGeneral: true,
    });

    if (response.succeeded) {
      setParticipantSettingList(response.data.Data);
    }
  }, []);

  const showDeleteModal = useCallback((item: GroupLiveTimeSetting) => {
    const participantSetting = participantSettingList.find(({Id}) => Id === item.GroupParticipantSettingId);
    context.showModal({
      type: "Question",
      title: "Süre Ayarı Sil",
      message: `${item.LiveTime} saatlik ${participantSetting?.ParticipantCount || '-'} kişilik ${item.IsGeneral ? 'genel' : 'özel'} süre ayarını silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const response = await ApiService.deleteGroupLiveTimeSettings({id: item.Id});
        context.hideModal();

        if (response.succeeded) {
          context.showModal({
            type: "Success",
            title: "Süre Ayarı başarıyla silindi",
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
  }, [participantSettingList]);

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [selectedSeller]);

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Oluşturulan Süre Ayarları</h2>
        <Table
          ref={tableEl}
          emptyListText={"Süre Ayarı Bulunamadı"}
          getDataFunction={fetchItemList}
          addNewButton={<AddNewButton/>}
          header={
            <div className=" lg:grid-cols-6 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-1 flex items-center">
                <span className="p-sm-gray-400">
                  Süre
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
          renderItem={(item: GroupLiveTimeSetting, index) => (
            <ItemComponent
              item={{
                ...item, SellerName: item.SellerId ?
                  (sellerList.find((seller) => seller.Id === item.SellerId)?.StoreName || '-') : '-',
                ParticipantCount: item.GroupParticipantSettingId ?
                  (participantSettingList.find(({Id}) => Id === item.GroupParticipantSettingId)?.ParticipantCount.toString() || '-') : '-'
              }}
              showDeleteModal={() => showDeleteModal(item)}
              key={`key_${index}`}/>
          )}
          page={Number(readPageQueryString(window.location) ?? "1")}
          noSearchBar
          setPageQueryString
          sortOptions={sortOptions}
        />
      </div>
    </div>
  );
}
