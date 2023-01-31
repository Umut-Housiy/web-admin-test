import { FunctionComponent, useRef, useState, useContext } from "react";

import { ItemModel, ProjectModel } from "../../../Models";
import ApiService from "../../../Services/ApiService";
import {
  SharedContext,
  SharedContextProviderValueModel,
} from "../../../Services/SharedContext";
import { Button } from "../../Button";
import { CheckIcon, PlusIcon, TrashIcon } from "../../Icons";
import { Modal } from "../../Modal";
import { Table } from "../../Table";
import { useStateEffect } from "../../UseStateEffect";

export interface Tabs2ForIdeasProps {
  setSelectedListToApi: (e: ItemModel[]) => void;
  setSelectedList: (e: ProjectModel[]) => void;
  selectedList: ProjectModel[];
}

export const Tabs2ForIdeas: FunctionComponent<Tabs2ForIdeasProps> = (
  props: Tabs2ForIdeasProps
) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedTempList, setSelectedTempList] = useState<ProjectModel[]>(
    props.selectedList ?? []
  );

  const [selectedList, setSelectedList] = useState<ProjectModel[]>(
    props.selectedList ?? []
  );

  const [selectedListToApi, setSelectedListToApi] = useState<ItemModel[]>([]);
  const [allPageData, setAllPageData] = useState<ProjectModel[]>([]);
  const setPageDataToState = (data: ProjectModel[]) => {
    setAllPageData(data.filter((x) => x.IsEnabled));
  };
  const [isAllPageDataSelected, setIsAllPageDataSelected] =
    useState<boolean>(false);

  useStateEffect(() => {
    checkAllPageIsSelected();
  }, [selectedTempList]);
  const selectAll = () => {
    if (allPageData != undefined) {
      let selectList = allPageData.filter(
        (x) => x.IsEnabled && !selectedTempList.find((y) => y.Id == x.Id)
      );
      setSelectedTempList([...selectedTempList, ...selectList]);
      setIsAllPageDataSelected(true);
    }
  };
  const deSelectAll = () => {
    if (allPageData != undefined) {
      let filteredList = selectedTempList.filter(
        (x) => !allPageData.find((y) => y.Id == x.Id)
      );
      setSelectedTempList([...filteredList]);
      setIsAllPageDataSelected(false);
    }
  };

  const checkAllPageIsSelected = (pModel?: ProjectModel[]) => {
    if (pModel == undefined) {
      for (let i = 0; i < allPageData.length; i++) {
        if (!selectedTempList.find((x) => x.Id == allPageData[i].Id)) {
          setIsAllPageDataSelected(false);
          return;
        }
      }
    } else {
      for (let i = 0; i < pModel.length; i++) {
        if (!selectedTempList.find((x) => x.Id == pModel[i].Id)) {
          setIsAllPageDataSelected(false);
          return;
        }
      }
    }
    setIsAllPageDataSelected(true);
    return;
  };
  const getIdeaList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    const _result = await ApiService.getIdeaList(page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount,
      };
    } else {
      setShowModal(false);
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

  const handleAddTempList = (idea) => {
    if (selectedTempList.find((i) => i.Id === idea.Id)) {
      let _currentArray = selectedTempList.filter((i) => i.Id !== idea.Id);
      setSelectedTempList(_currentArray);
    } else {
      setSelectedTempList([...selectedTempList, idea]);
    }
  };

  const removeSelectedList = (e) => {
    let _currentArray = selectedList.filter((i) => i.Id !== e.Id);
    setSelectedTempList(_currentArray);
    setSelectedList(_currentArray);
  };

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [selectedList]);

  const ideaList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    return {
      Data: selectedList.slice((page - 1) * take, page * take),
      TotalCount: selectedList.length,
    };
  };

  useStateEffect(() => {
    let _currentArray: ItemModel[] = [];
    selectedList.map((item) =>
      _currentArray.push({
        ItemId: item.Id,
        PhotoUrl: "",
        RedirectUrl: "",
        Title: "",
        Description: "",
        IsIdeaMainProduct: false,
      })
    );
    setSelectedListToApi(_currentArray);
  }, [selectedList]);

  useStateEffect(() => {
    props.setSelectedListToApi(selectedListToApi);
    props.setSelectedList(selectedList);
  }, [selectedListToApi]);

  const returnHeader = () => {
    return (
      <div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Fikir Adı</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Kategori</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Görüntülenme Sayısı</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Favoriye Eklenme Sayısı</span>
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
          <span className="p-sm-gray-700 lg:hidden mr-2">Fikir Adı:</span>
          <p className="text-black-700 text-sm">{e.Name}</p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center flex items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Kategori:</span>
          <p className="text-black-700 text-sm">{e.CategoryName}</p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">
            Görüntülenme Sayısı:
          </span>
          <p className="text-black-700 text-sm">{e.ViewCount}</p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">
            Favoriye Eklenme Sayısı:
          </span>
          <p className="text-black-700 text-sm">{e.FavoriteCount}</p>
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
      <h4 className="mb-4">Öne Çıkarılacak Fikir Listesi</h4>
      <Button
        textTiny
        text="Fikir Seç"
        hasIcon
        icon={<PlusIcon className="icon-sm mr-2 " />}
        design="button-blue-100 text-blue-400 w-60 mb-4"
        onClick={() => setShowModal(true)}
      />
      <Table
        ref={tableEl}
        key={"table2"}
        emptyListText={"Fikir Bulunamadı"}
        getDataFunction={ideaList}
        header={returnHeader()}
        renderItem={(e, i) => {
          return (
            <div
              key={"list" + i}
              className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
            >
              {returnBody(e)}
              <div className="lg:col-span-1">
                <TrashIcon
                  className="icon-sm mr-2"
                  onClick={() => removeSelectedList(e)}
                />
              </div>
            </div>
          );
        }}
        noRefreshButton
      />

      <Modal
        modalType="fixedMd"
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTempList(selectedList);
        }}
        title="Listeden Fikir Ekleme"
        body={
          <div className="">
            <div className="flex gap-3 justify-end items-center text-sm my-4">
              <div className="text-gray-700">
                <span className="text-gray-900 font-medium">
                  {selectedTempList.length} / 200
                </span>{" "}
                Fikir Seçildi
              </div>
              <Button
                buttonMd
                text="Seçili Fikirleri Ekle"
                design="button-blue-400 w-60"
                onClick={() => {
                  setSelectedList(selectedTempList);
                  setShowModal(false);
                }}
              />
            </div>
            <Table
              ref={tableElModal}
              key={"table1"}
              emptyListText={"Fikir Bulunamadı"}
              getDataFunction={getIdeaList}
              getListData={setPageDataToState}
              pageChanged={checkAllPageIsSelected}
              header={
                <div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Fikir Adı</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Kategori</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Görüntülenme Sayısı</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">
                      Favoriye Eklenme Sayısı
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
                    className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
                  >
                    {returnBody(e)}
                    <div className="lg:col-span-1">
                      {e.IsEnabled === true ? (
                        <Button
                          buttonSm
                          className="p-6"
                          hasIcon
                          icon={
                            selectedTempList.find((i) => i.Id === e.Id) ? (
                              <CheckIcon className="icon-sm" />
                            ) : (
                              <></>
                            )
                          }
                          design={
                            selectedTempList.find((i) => i.Id === e.Id)
                              ? "button-blue-400 text-white"
                              : "button-blue-100 text-blue-400"
                          }
                          text={
                            selectedTempList.find((i) => i.Id === e.Id)
                              ? ""
                              : "Seç"
                          }
                          onClick={() => {
                            handleAddTempList(e);
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
