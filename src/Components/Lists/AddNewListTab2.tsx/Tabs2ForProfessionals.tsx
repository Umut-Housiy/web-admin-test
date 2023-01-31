import { FunctionComponent, useRef, useState, useContext } from "react";
import { ItemModel, ProModel } from "../../../Models";
import ApiService from "../../../Services/ApiService";
import {
  SharedContext,
  SharedContextProviderValueModel,
} from "../../../Services/SharedContext";
import { Button } from "../../Button";
import { CheckIcon, PlusIcon, StarIcon, TrashIcon } from "../../Icons";
import { Modal } from "../../Modal";
import { Table } from "../../Table";
import { useStateEffect } from "../../UseStateEffect";

export interface Tabs2ForProfessionalsProps {
  setSelectedProListToApi: (e: ItemModel[]) => void;
  setSelectedProList: (e: ProModel[]) => void;
  selectedProList: ProModel[];
}

export const Tabs2ForProfessionals: FunctionComponent<
  Tabs2ForProfessionalsProps
> = (props: Tabs2ForProfessionalsProps) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const [showProModal, setShowProModal] = useState<boolean>(false);

  const [selectedTempProList, setSelectedTempProList] = useState<ProModel[]>(
    props.selectedProList ?? []
  );

  const [selectedProList, setSelectedProList] = useState<ProModel[]>(
    props.selectedProList ?? []
  );

  const [selectedProListToApi, setSelectedProListToApi] = useState<ItemModel[]>(
    []
  );

  const [allPageData, setAllPageData] = useState<ProModel[]>([]);
  const [isAllPageDataSelected, setIsAllPageDataSelected] =
    useState<boolean>(false);

  useStateEffect(() => {
    checkAllPageDataIsSelected();
  }, [selectedTempProList]);
  const selectAll = () => {
    if (allPageData != undefined) {
      let unSelected = allPageData.filter(
        (x) => !selectedTempProList.find((y) => y.Id == x.Id)
      );
      setSelectedTempProList([...selectedTempProList, ...unSelected]);
      setIsAllPageDataSelected(true);
    }
  };
  const deSelectAll = () => {
    if (allPageData != undefined) {
      let filteredList = selectedTempProList.filter(
        (x) => !allPageData.find((y) => y.Id == x.Id)
      );
      setSelectedTempProList([...filteredList]);
      setIsAllPageDataSelected(false);
    }
  };
  const checkAllPageDataIsSelected = (data?: ProModel[]) => {
    if (data == undefined) {
      for (let i = 0; i < allPageData.length; i++) {
        if (!selectedTempProList.find((x) => x.Id == allPageData[i].Id)) {
          setIsAllPageDataSelected(false);
          return;
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (!selectedTempProList.find((x) => x.Id == data[i].Id)) {
          setIsAllPageDataSelected(false);
          return;
        }
      }
    }
    setIsAllPageDataSelected(true);
    return;
  };
  const getProList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    const _result = await ApiService.getProList(page, take, order, searchText);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount,
      };
    } else {
      setShowProModal(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
        },
      });
      return {
        Data: [],
        TotalCount: 0,
      };
    }
  };

  const handleAddTempProList = (pro) => {
    if (selectedTempProList.find((i) => i.Id === pro.Id)) {
      let _currentArray = selectedTempProList.filter((i) => i.Id !== pro.Id);
      setSelectedTempProList(_currentArray);
    } else {
      setSelectedTempProList([...selectedTempProList, pro]);
    }
  };

  const removeSelectedProList = (e) => {
    let _currentArray = selectedProList.filter((i) => i.Id !== e.Id);
    setSelectedTempProList(_currentArray);
    setSelectedProList(_currentArray);
  };

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [selectedProList]);

  const proList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    return {
      Data: selectedProList.slice((page - 1) * take, page * take),
      TotalCount: selectedProList.length,
    };
  };

  useStateEffect(() => {
    let _currentArray: ItemModel[] = [];
    selectedProList.map((item) =>
      _currentArray.push({
        ItemId: item.Id,
        PhotoUrl: "",
        RedirectUrl: "",
        Title: "",
        Description: "",
        IsIdeaMainProduct: false,
      })
    );
    setSelectedProListToApi(_currentArray);
  }, [selectedProList]);

  useStateEffect(() => {
    props.setSelectedProListToApi(selectedProListToApi);
    props.setSelectedProList(selectedProList);
  }, [selectedProListToApi]);

  const returnHeader = () => {
    return (
      <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Profesyonel Adı</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Profesyonel Puanı</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Teklif Sayısı</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Favori Eklenme Sayısı</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Tamamlanan Hizmet Sayısı</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Durum</span>
        </div>
      </div>
    );
  };

  const returnBody = (e) => {
    return (
      <>
        <div className="lg:col-span-2 flex lg:block items-center flex items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Profesyonel Adı:</span>
          <p className="text-black-700 text-sm">{e.StoreName}</p>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center flex items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">
            Profesyonel Puanı:
          </span>
          <span className="flex items-center text-yellow-600 text-tiny font-semibold">
            <StarIcon className="icon-sm mr-1 mb-0.5" />
            {e.StoreRate}
          </span>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Teklif Sayısı:</span>
          <p className="text-black-700 text-sm">{e.OfferCount}</p>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">
            Favori Eklenme Sayısı:
          </span>
          <p className="text-black-700 text-sm">{e.FavoriteCount}</p>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">
            Tamamlanan Hizmet Sayısı:
          </span>
          <p className="text-black-700 text-sm">{e.ServiceCount}</p>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
          <p
            className={`${
              e.IsEnabled === true ? "text-green-400" : "text-red-400"
            } font-medium text-sm`}
          >
            {e.IsEnabled === true ? "Aktif" : "Pasif"}
          </p>
        </div>
      </>
    );
  };
  return (
    <div>
      <h4 className="mb-4">Öne Çıkarılacak Profesyonel Listesi</h4>
      <Button
        textTiny
        text="Profesyonel Seç"
        hasIcon
        icon={<PlusIcon className="icon-sm mr-2 " />}
        design="button-blue-100 text-blue-400 w-60 mb-4"
        onClick={() => setShowProModal(true)}
      />

      <Table
        ref={tableEl}
        key={"table2"}
        emptyListText={"Profesyonel Bulunamadı"}
        getDataFunction={proList}
        header={returnHeader()}
        renderItem={(e, i) => {
          return (
            <div
              key={"list" + i}
              className="lg:grid-cols-8 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
            >
              {returnBody(e)}
              <div className="lg:col-span-1">
                <TrashIcon
                  className="icon-sm mr-2"
                  onClick={() => removeSelectedProList(e)}
                />
              </div>
            </div>
          );
        }}
        noRefreshButton
      />

      <Modal
        modalType="fixedMd"
        showModal={showProModal}
        onClose={() => {
          setShowProModal(false);
          setSelectedTempProList(selectedProList);
        }}
        title="Listeden Profesyonel Ekleme"
        body={
          <div className="">
            <div className="flex gap-3 justify-end items-center text-sm my-4">
              <div className="text-gray-700">
                <span className="text-gray-900 font-medium">
                  {selectedTempProList.length} / 200
                </span>{" "}
                Profesyonel Seçildi
              </div>
              <Button
                buttonMd
                text="Seçili Profesyonelleri Ekle"
                design="button-blue-400 w-60"
                onClick={() => {
                  setSelectedProList(selectedTempProList);
                  setShowProModal(false);
                }}
              />
            </div>
            <Table
              ref={tableElModal}
              key={"table1"}
              emptyListText={"Profesyonel Bulunamadı"}
              getDataFunction={getProList}
              getListData={setAllPageData}
              pageChanged={checkAllPageDataIsSelected}
              header={
                <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Profesyonel Adı</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Profesyonel Puanı</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Teklif Sayısı</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Favori Eklenme Sayısı</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">
                      Tamamlanan Hizmet Sayısı
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Durum</span>
                  </div>
                  <div className="lg:col-span-1">
                    <Button
                      text={
                        isAllPageDataSelected ? "Seçimi kaldır" : "Tümünü seç"
                      }
                      design={
                        isAllPageDataSelected
                          ? "button-blue-400 text-white"
                          : "button-blue-100 text-blue-400"
                      }
                      onClick={
                        isAllPageDataSelected
                          ? () => deSelectAll()
                          : () => selectAll()
                      }
                    ></Button>
                  </div>
                </div>
              }
              renderItem={(e, i) => {
                return (
                  <div
                    key={"list" + i}
                    className="lg:grid-cols-8 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
                  >
                    {returnBody(e)}
                    <div className="lg:col-span-1">
                      {e.IsEnabled === true ? (
                        <Button
                          buttonSm
                          className="p-6"
                          hasIcon
                          icon={
                            selectedTempProList.find((i) => i.Id === e.Id) ? (
                              <CheckIcon className="icon-sm" />
                            ) : (
                              <></>
                            )
                          }
                          design={
                            selectedTempProList.find((i) => i.Id === e.Id)
                              ? "button-blue-400 text-white"
                              : "button-blue-100 text-blue-400"
                          }
                          text={
                            selectedTempProList.find((i) => i.Id === e.Id)
                              ? ""
                              : "Seç"
                          }
                          onClick={() => {
                            handleAddTempProList(e);
                          }}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                );
              }}
              noRefreshButton
            />
          </div>
        }
      />
    </div>
  );
};
