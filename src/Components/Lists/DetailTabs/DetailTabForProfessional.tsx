import { FunctionComponent, useContext, useRef, useState } from "react"
import { useHistory } from "react-router-dom";
import { DynamicListProfessionalModel } from "../../../Models";
import ApiService from "../../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../../Services/SharedContext";
import { Button } from "../../Button";
import { CheckIcon, ChevronRightIcon, PlusIcon, StarIcon, TrashIcon } from "../../Icons";
import { Table } from "../../Table";
import { Image } from "../../Image";
import { formatter, fraction } from "../../../Services/Functions";
import { DateView } from "../../DateView";
import { Modal } from "../../Modal";

export interface DetailTabForProfessionalProps {
  DynamicListId: number
}

export const DetailTabForProfessional: FunctionComponent<DetailTabForProfessionalProps> = (props: DetailTabForProfessionalProps) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const history = useHistory();

  const [showAddingModal, setShowAddingModal] = useState<boolean>(false);

  const [selectedItemIdList, setSelectedItemIdList] = useState<number[]>([])

  const [selectedTempItemIdList, setSelectedTempItemIdList] = useState<number[]>([]);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const getDynamicListItems = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getDynamicListItems(props.DynamicListId, page, take, searchText, order);

    if (_result.succeeded === true) {
      let _tempArray: DynamicListProfessionalModel[] = []
      let _selectedItemIdList: number[] = []

      _result.data.Data.map((item) => (
        _tempArray.push(item.Professional),
        _selectedItemIdList.push(item.Professional.ProfessionalId)
      ))
      setSelectedItemIdList(_selectedItemIdList);
      return {
        Data: _tempArray,
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
      title: "Profesyoneli Sil",
      message: `${item.StoreName} isimli profeyoneli listeden silmek istediğinize emin misiniz?`,
      onClick: async () => {
        const _result = await ApiService.deleteItemFromDynamicList(item.ItemId);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Profesyonel başarıyla silindi",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
              setSelectedTempItemIdList([])
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

  const getProList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getProList(page, take, order, searchText);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      setShowAddingModal(false);
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


  const addItemToDynamicList = async () => {
    setProcessLoading(true);

    const _result = await ApiService.addItemToDynamicList(props.DynamicListId, selectedTempItemIdList, [])

    setShowAddingModal(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Profesyonel(ler) başarıyla eklendi",
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
          if (tableEl.current) {
            tableEl.current?.reload();
          }
          setSelectedTempItemIdList([])
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
        }
      });
    }
  }

  const returnHeader = () => {
    return <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
      <div className="lg:col-span-2">
        <span className="p-sm-gray-400">
          Profesyonel Adı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Profesyonel Puanı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Teklif Sayısı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Favori Eklenme Sayısı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Tamamlanan Hizmet Sayısı
        </span>
      </div>
      <div className="lg:col-span-1">
        <span className="p-sm-gray-400">
          Durum
        </span>
      </div>
    </div>
  }

  const returnBody = (e) => {
    return <>
      <div className="lg:col-span-2 flex lg:block items-center flex items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel Adı:</span>
        <p className="text-black-700 text-sm">
          {e.StoreName}
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center flex items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel Puanı:</span>
        <span className="flex items-center text-yellow-600 text-sm font-semibold">
          <StarIcon className="w-3 h-3 mr-1 mb-0.5" />
          {e.StoreRate}
        </span>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Teklif Sayısı:</span>
        <p className="text-black-700 text-sm">
          {e.OfferCount}
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Favori Eklenme Sayısı:</span>
        <p className="text-black-700 text-sm">
          {e.FavoriteCount}
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Tamamlanan Hizmet Sayısı:</span>
        <p className="text-black-700 text-sm">
          {e.ServiceCount}
        </p>
      </div>
      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
        <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
          {e.IsEnabled === true ? "Aktif" : "Pasif"}
        </p>
      </div>
    </>
  }

  const handleAddTempItem = (pro) => {

    if (selectedTempItemIdList.find(i => i === pro.Id)) {
      let _currentArray = selectedTempItemIdList.filter(i => i !== pro.Id);
      setSelectedTempItemIdList(_currentArray);
    }
    else {
      setSelectedTempItemIdList([...selectedTempItemIdList, pro.Id])
    }

  }
  return (
    <>
      <Table
        ref={tableEl}
        emptyListText={"Liste Bulunamadı"}
        getDataFunction={getDynamicListItems}
        addNewButton={
          <Button buttonMd textTiny color="text-blue-400" className="w-72" design="button-blue-100" text="Yeni Profesyonel Ekle" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { setShowAddingModal(true) }} />}
        header={returnHeader()}
        renderItem={(e, i) => {
          return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
            {returnBody(e)}
            <div className="lg:col-span-1 flex justify-between items-center">
              <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler: </span>
              <div className="text-gray-700 flex gap-2 items-center ml-auto">
                <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => showDeleteModal(e)} />
                <ChevronRightIcon className="icon-md text-gray-700 border-l cursor-pointer" onClick={() => { history.push(`/pro-profesyonel-detay/${e.ProfessionalId}`) }} />
              </div>
            </div>
          </div>
        }}
      />

      <Modal
        modalType="fixedMd"
        showModal={showAddingModal}
        onClose={() => { setShowAddingModal(false); setSelectedTempItemIdList([]) }}
        title="Listeden Profesyonel Ekleme"
        body=
        {
          <div className="">
            <div className="flex gap-3 justify-end items-center text-sm my-4">
              <div className="text-gray-700"><span className="text-gray-900 font-medium">{selectedItemIdList.length + selectedTempItemIdList.length} / 200</span> Profesyonel Seçildi</div>
              <Button isLoading={processLoading} buttonMd text="Seçili Profesyonelleri Ekle" design="button-blue-400 w-60" onClick={() => {
                addItemToDynamicList()
              }} />
            </div>
            <Table
              ref={tableElModal}
              key={"table1"}
              emptyListText={"Profesyonel Bulunamadı"}
              getDataFunction={getProList}
              header={returnHeader()}
              renderItem={(e, i) => {
                return <div key={"listTable" + i} className="lg:grid-cols-8 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                  {returnBody(e)}
                  <div className="lg:col-span-1">
                    {e.IsEnabled === true ?
                      <Button buttonSm
                        className="p-6"
                        hasIcon icon={(selectedTempItemIdList.find(i => i === e.Id) || selectedItemIdList.find(i => i === e.Id)) ? <CheckIcon className="icon-sm" /> : <></>}
                        design={selectedTempItemIdList.find(i => i === e.Id) ? "button-blue-400 text-white" : selectedItemIdList.find(i => i === e.Id) ? "button-blue-400 text-white pointer-events-none" : "button-blue-100 text-blue-400"}
                        text={(selectedTempItemIdList.find(i => i === e.Id) || selectedItemIdList.find(i => i === e.Id)) ? "" : "Seç"} onClick={() => { handleAddTempItem(e); }} />
                      :
                      <></>}
                  </div>
                </div>
              }}
              noRefreshButton
            />
          </div>
        }
      />

    </>
  )
}
