import { FunctionComponent, useRef, useState, useContext } from "react";

import { SellerModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Button } from "./Button";
import { CheckIcon, PlusIcon, StarIcon, TrashIcon } from "./Icons";
import { Modal } from "./Modal";
import { Table } from "./Table";
import { useStateEffect } from "./UseStateEffect";
import { Image } from "./Image";

export interface ChooseSellerTableProps {
  setSelectedListToApi: (e: number[]) => void,
  setSelectedList: (e: SellerModel[]) => void,
  selectedList: SellerModel[]
}

export const ChooseSellerTable: FunctionComponent<ChooseSellerTableProps> = (props: ChooseSellerTableProps) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const take = 20;

  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedTempList, setSelectedTempList] = useState<SellerModel[]>(props.selectedList ?? []);

  const [selectedList, setSelectedList] = useState<SellerModel[]>(props.selectedList ?? []);

  const [selectedListToApi, setSelectedListToApi] = useState<number[]>([]);

  const getSellerApprovedList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSellerApprovedList(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      setShowModal(false);
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

  const handleAddTempList = (idea) => {

    if (selectedTempList.find(i => i.Id === idea.Id)) {
      let _currentArray = selectedTempList.filter(i => i.Id !== idea.Id);
      setSelectedTempList(_currentArray);
    }
    else {
      setSelectedTempList([...selectedTempList, idea])
    }
  }

  const removeSelectedList = (e) => {
    let _currentArray = selectedList.filter(i => i.Id !== e.Id);
    setSelectedTempList(_currentArray);
    setSelectedList(_currentArray);
  }

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [selectedList])

  const sellerList = async (order: number, searchText: string, page: number, take: number) => {
    return {
      Data: selectedList.slice((page - 1) * take, page * take),
      TotalCount: selectedList.length
    }
  }

  useStateEffect(() => {
    let _currentArray: number[] = []
    selectedList.map((item) => (
      _currentArray.push(item.Id)
    ));
    setSelectedListToApi(_currentArray);
  }, [selectedList]);


  useStateEffect(() => {
    props.setSelectedListToApi(selectedListToApi);
    props.setSelectedList(selectedList)
  }, [selectedListToApi]);

  const returnHeader = () => {
    return <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
      <div className="lg:col-span-3">
        <span className="p-sm-gray-400">
          Mağaza Adı
        </span>
      </div>
      <div className="lg:col-span-3">
        <span className="p-sm-gray-400">
          Mağaza Puanı
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
    return <><div className="lg:col-span-3 flex lg:block items-center flex items-center">
      <span className="p-sm-gray-700 lg:hidden mr-2">Mağaza Adı:</span>
      <div className="flex items-center text-sm text-black-900 ">
        <Image src={e.Logo} className="min-w-12 max-w-12 min-h-12 max-h-12 object-cover rounded-full mr-2" />
        {e.StoreName}
      </div>

    </div>
      <div className="lg:col-span-3 flex lg:block items-center flex items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Mağaza Puanı:</span>
        <div className="flex items-center font-mediun text-yellow-600 text-sm">
          <StarIcon className="w-4 h-4 mr-2 inline-block" />
          <span>{e.StoreRate}</span>
        </div>

      </div>

      <div className="lg:col-span-1 flex lg:block items-center">
        <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
        <p className={`${e.IsEnabled === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
          {e.IsEnabled === true ? "Aktif" : "Pasif"}
        </p>
      </div></>
  }
  return (
    <div>
      <h4 className="mb-4">Satıcı Listesi</h4>
      <Button textTiny text="Satıcı Seç" hasIcon icon={<PlusIcon className="icon-sm mr-2 " />} design="button-blue-100 text-blue-400 w-60 mb-4" onClick={() => setShowModal(true)} />
      <Table
        ref={tableEl}
        key={"table2"}
        emptyListText={"Satıcı Bulunamadı"}
        getDataFunction={sellerList}
        header={returnHeader()}
        renderItem={(e, i) => {
          return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
            {returnBody(e)}
            <div className="lg:col-span-1">
              <TrashIcon className="icon-sm mr-2 cursor-pointer" onClick={() => removeSelectedList(e)} />
            </div>
          </div>
        }}
        noRefreshButton
      />

      <Modal
        modalType="fixedMd"
        showModal={showModal}
        onClose={() => { setShowModal(false); setSelectedTempList(selectedList) }}
        title="Listeden Satıcı Ekleme"
        body=
        {
          <div className="">
            <div className="flex gap-3 justify-end items-center text-sm my-4">
              <div className="text-gray-700"><span className="text-gray-900 font-medium">{selectedTempList.length} / 200</span> Satıcı Seçildi</div>
              <Button buttonMd text="Seçili Satıcıları Ekle" design="button-blue-400 w-60" onClick={() => {
                setSelectedList(selectedTempList); setShowModal(false);
              }} />
            </div>
            <Table
              ref={tableElModal}
              key={"table1"}
              emptyListText={"Satıcı Bulunamadı"}
              getDataFunction={getSellerApprovedList}
              header={returnHeader()}
              renderItem={(e, i) => {
                return <div key={"list" + i} className="lg:grid-cols-8 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                  {returnBody(e)}
                  {e.IsEnabled === true &&
                    <div className="lg:col-span-1">
                      <Button buttonSm
                        className="p-6"
                        hasIcon icon={selectedTempList.find(i => i.Id === e.Id) ? <CheckIcon className="icon-sm" /> : <></>} design={selectedTempList.find(i => i.Id === e.Id) ? "button-blue-400 text-white" : "button-blue-100 text-blue-400"}
                        text={selectedTempList.find(i => i.Id === e.Id) ? "" : "Seç"} onClick={() => { handleAddTempList(e); }} />
                    </div>
                  }
                </div>
              }}
              noRefreshButton
            />
          </div>
        }
      />


    </div>
  )
}
