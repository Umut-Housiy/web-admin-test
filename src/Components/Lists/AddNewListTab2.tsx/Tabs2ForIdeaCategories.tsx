import { FunctionComponent, useRef, useState, useContext } from "react";

import { IdeaCategoryInnerModel, ItemModel } from "../../../Models";
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
import { Image } from "../../Image";

export interface Tabs2ForIdeaCategoriesProps {
  setSelectedCategoryListToApi: (e: ItemModel[]) => void;
  setSelectedCategoryList: (e: IdeaCategoryInnerModel[]) => void;
  selectedCategoryList: IdeaCategoryInnerModel[];
}

export const Tabs2ForIdeaCategories: FunctionComponent<
  Tabs2ForIdeaCategoriesProps
> = (props: Tabs2ForIdeaCategoriesProps) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);

  const [selectedTempCategoryList, setSelectedTempCategoryList] = useState<
    IdeaCategoryInnerModel[]
  >(props.selectedCategoryList ?? []);

  const [selectedCategoryList, setSelectedCategoryList] = useState<
    IdeaCategoryInnerModel[]
  >(props.selectedCategoryList ?? []);

  const [selectedCategoryListToApi, setSelectedCategoryListToApi] = useState<
    ItemModel[]
  >([]);
  const [allPageData, setAllPageData] = useState<IdeaCategoryInnerModel[]>([]);
  const [isAllPageDataSelected, setIsAllPageDataSelected] =
    useState<boolean>(false);

  useStateEffect(() => {
    checkAllPageDataIsSelected();
  }, [selectedTempCategoryList]);

  const selectAllPage = () => {
    if (allPageData != undefined) {
      let unSelectedList = allPageData.filter(
        (x) => !selectedTempCategoryList.find((y) => y.Id == x.Id)
      );
      setSelectedTempCategoryList([
        ...selectedTempCategoryList,
        ...unSelectedList,
      ]);
      setIsAllPageDataSelected(true);
    }
  };
  const deSelectAllPageData = () => {
    if (allPageData != undefined) {
      let filteredList = selectedTempCategoryList.filter(
        (x) => !allPageData.find((y) => y.Id == x.Id)
      );
      setSelectedTempCategoryList([...filteredList]);
      setIsAllPageDataSelected(false);
    }
  };

  const checkAllPageDataIsSelected = (data?: IdeaCategoryInnerModel[]) => {
    if (data == undefined) {
      for (let i = 0; i < allPageData.length - 1; i++) {
        if (!selectedTempCategoryList.find((x) => x.Id == allPageData[i].Id)) {
          setIsAllPageDataSelected(false);
          return;
        }
      }
    } else {
      for (let i = 0; i < data.length - 1; i++) {
        if (!selectedTempCategoryList.find((x) => x.Id == data[i].Id)) {
          setIsAllPageDataSelected(false);
          return;
        }
      }
    }
    setIsAllPageDataSelected(true);
    return;
  };

  const getIdeaCategoryList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    const _result = await ApiService.getIdeaCategoryList(
      page,
      take,
      searchText,
      order
    );

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount,
      };
    } else {
      setShowCategoryModal(false);
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

  const handleAddTempCategoryList = (category) => {
    if (selectedTempCategoryList.find((i) => i.Id === category.Id)) {
      let _currentArray = selectedTempCategoryList.filter(
        (i) => i.Id !== category.Id
      );
      setSelectedTempCategoryList(_currentArray);
      setIsAllPageDataSelected(false);
    } else {
      setSelectedTempCategoryList([...selectedTempCategoryList, category]);
    }
  };

  const removeSelectedCategoryList = (e) => {
    let _currentArray = selectedCategoryList.filter((i) => i.Id !== e.Id);
    setSelectedTempCategoryList(_currentArray);
    setSelectedCategoryList(_currentArray);
  };

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [selectedCategoryList]);

  const ideaCategoryList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    return {
      Data: selectedCategoryList.slice((page - 1) * take, page * take),
      TotalCount: selectedCategoryList.length,
    };
  };

  useStateEffect(() => {
    let _currentArray: ItemModel[] = [];
    selectedCategoryList.map((item) =>
      _currentArray.push({
        ItemId: item.Id,
        PhotoUrl: "",
        RedirectUrl: "",
        Title: "",
        Description: "",
        IsIdeaMainProduct: false,
      })
    );
    setSelectedCategoryListToApi(_currentArray);
  }, [selectedCategoryList]);

  useStateEffect(() => {
    props.setSelectedCategoryListToApi(selectedCategoryListToApi);
    props.setSelectedCategoryList(selectedCategoryList);
  }, [selectedCategoryListToApi]);

  const returnHeader = () => {
    return (
      <div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Kategori Görseli</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Kategori adı</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Kategori Kodu</span>
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
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Görseli</span>
          <Image
            src={e.PhotoPath}
            alt={e.CategoryName}
            className="min-w-14 max-w-14 max-h-14 min-h-14 mr-2 object-contain"
          />
        </div>
        <div className="lg:col-span-2 flex lg:block items-center flex items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Kategori Adı:</span>
          <p className="text-black-700 text-sm">{e.Name}</p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Kateogri Kodu:</span>
          <p className="text-black-700 text-sm">{e.Code}</p>
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
      <h4 className="mb-4">Öne Çıkarılacak Fikir Kategori Listesi</h4>
      <Button
        textTiny
        text="Kategori Seç"
        hasIcon
        icon={<PlusIcon className="icon-sm mr-2 " />}
        design="button-blue-100 text-blue-400 w-60 mb-4"
        onClick={() => setShowCategoryModal(true)}
      />
      <Table
        ref={tableEl}
        key={"table2"}
        emptyListText={"Kategori Bulunamadı"}
        getDataFunction={ideaCategoryList}
        header={returnHeader()}
        renderItem={(e, i) => {
          return (
            <div
              key={"list" + i}
              className="lg:grid-cols-7 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
            >
              {returnBody(e)}
              <div className="lg:col-span-1">
                <TrashIcon
                  className="icon-sm mr-2"
                  onClick={() => removeSelectedCategoryList(e)}
                />
              </div>
            </div>
          );
        }}
        noRefreshButton
      />

      <Modal
        modalType="fixedMd"
        showModal={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setSelectedTempCategoryList(selectedCategoryList);
        }}
        title="Listeden Fikir Kategorisi Ekleme"
        body={
          <div className="">
            <div className="flex gap-3 justify-end items-center text-sm my-4">
              <div className="text-gray-700">
                <span className="text-gray-900 font-medium">
                  {selectedTempCategoryList.length} / 200
                </span>{" "}
                Kategori Seçildi
              </div>
              <Button
                buttonMd
                text="Seçili Kategorileri Ekle"
                design="button-blue-400 w-60"
                onClick={() => {
                  setSelectedCategoryList(selectedTempCategoryList);
                  setShowCategoryModal(false);
                }}
              />
            </div>
            <Table
              ref={tableElModal}
              key={"table1"}
              emptyListText={"Kategori Bulunamadı"}
              getDataFunction={getIdeaCategoryList}
              header={
                <div className=" lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Kategori Görseli</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Kategori adı</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Kategori Kodu</span>
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
                        !isAllPageDataSelected
                          ? () => selectAllPage()
                          : () => deSelectAllPageData()
                      }
                    ></Button>
                  </div>
                </div>
              }
              getListData={setAllPageData}
              pageChanged={checkAllPageDataIsSelected}
              renderItem={(e, i) => {
                return (
                  <div
                    key={"list" + i}
                    className="lg:grid-cols-7 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
                  >
                    {returnBody(e)}
                    <div className="lg:col-span-1">
                      {e.IsEnabled === true ? (
                        <Button
                          buttonSm
                          className="p-6"
                          hasIcon
                          icon={
                            selectedTempCategoryList.find(
                              (i) => i.Id === e.Id
                            ) ? (
                              <CheckIcon className="icon-sm" />
                            ) : (
                              <></>
                            )
                          }
                          design={
                            selectedTempCategoryList.find((i) => i.Id === e.Id)
                              ? "button-blue-400 text-white"
                              : "button-blue-100 text-blue-400"
                          }
                          text={
                            selectedTempCategoryList.find((i) => i.Id === e.Id)
                              ? ""
                              : "Seç"
                          }
                          onClick={() => {
                            handleAddTempCategoryList(e);
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
