import {
  FunctionComponent,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";

import { ItemModel, SellerCategoryListInnerModel } from "../../../Models";
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

export interface Tabs2ForProductCategoriesProps {
  setSelectedAdvertCategoryListToApi: (e: ItemModel[]) => void;
  setSelectedAdvertCategoryList: (e: SellerCategoryListInnerModel[]) => void;
  selectedAdvertCategoryList: SellerCategoryListInnerModel[];
}

export const Tabs2ForProductCategories: FunctionComponent<
  Tabs2ForProductCategoriesProps
> = (props: Tabs2ForProductCategoriesProps) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const [showAdvertCategoryModal, setShowAdvertCategoryModal] =
    useState<boolean>(false);

  const [selectedTempAdvertCategoryList, setSelectedTempAdvertCategoryList] =
    useState<SellerCategoryListInnerModel[]>(
      props.selectedAdvertCategoryList ?? []
    );

  const [selectedAdvertCategoryList, setSelectedAdvertCategoryList] = useState<
    SellerCategoryListInnerModel[]
  >(props.selectedAdvertCategoryList ?? []);

  const [selectedAdvertCategoryListToApi, setSelectedAdvertCategoryListToApi] =
    useState<ItemModel[]>([]);
  const [allPageData, setAllPageData] = useState<
    SellerCategoryListInnerModel[]
  >([]);
  const [isAllPageDataSelected, setIsAllPageDataSelected] =
    useState<boolean>(false);

  useEffect(() => {
    checkIsAllPageDataSelected();
  }, [selectedTempAdvertCategoryList]);
  const selectAllPageData = () => {
    if (allPageData != undefined) {
      let unSelected = allPageData.filter(
        (x) => !selectedTempAdvertCategoryList.find((y) => y.Id == x.Id)
      );
      setSelectedTempAdvertCategoryList([
        ...selectedTempAdvertCategoryList,
        ...unSelected,
      ]);
      setIsAllPageDataSelected(true);
    }
  };

  const deselectAllPageData = () => {
    if (allPageData != undefined) {
      let selectedFilter = selectedTempAdvertCategoryList.filter(
        (x) => !allPageData.find((y) => y.Id == x.Id)
      );
      setSelectedTempAdvertCategoryList([...selectedFilter]);
      setIsAllPageDataSelected(false);
    }
  };
  const getDataFromChild = (data) => {
    setAllPageData(data);
  };
  const checkIsAllPageDataSelected = (
    checkData?: SellerCategoryListInnerModel[]
  ) => {
    if (checkData == undefined) {
      for (let i = 0; i < allPageData.length; i++) {
        if (
          !selectedTempAdvertCategoryList.find((x) => x.Id == allPageData[i].Id)
        ) {
          setIsAllPageDataSelected(false);
          return;
        }
      }
      setIsAllPageDataSelected(true);
    } else {
      for (let i = 0; i < checkData.length; i++) {
        if (!selectedTempAdvertCategoryList.includes(checkData[i])) {
          setIsAllPageDataSelected(false);
          return;
        }
      }
      setIsAllPageDataSelected(true);
    }
  };

  const getSellerCategoryList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    const _result = await ApiService.getSellerCategoryList(
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
      setShowAdvertCategoryModal(false);
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

  const handleAddTempAdvertCategoryList = (category) => {
    if (selectedTempAdvertCategoryList.find((i) => i.Id === category.Id)) {
      let _currentArray = selectedTempAdvertCategoryList.filter(
        (i) => i.Id !== category.Id
      );
      setSelectedTempAdvertCategoryList(_currentArray);
      setIsAllPageDataSelected(false);
    } else {
      setSelectedTempAdvertCategoryList([
        ...selectedTempAdvertCategoryList,
        category,
      ]);
    }
  };

  const removeSelectedAdvertCategoryList = (e) => {
    let _currentArray = selectedAdvertCategoryList.filter((i) => i.Id !== e.Id);
    setSelectedTempAdvertCategoryList(_currentArray);
    setSelectedAdvertCategoryList(_currentArray);
  };

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [selectedAdvertCategoryList]);

  const sellerCategoryList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    return {
      Data: selectedAdvertCategoryList.slice((page - 1) * take, page * take),
      TotalCount: selectedAdvertCategoryList.length,
    };
  };

  useStateEffect(() => {
    let _currentArray: ItemModel[] = [];
    selectedAdvertCategoryList.map((item) =>
      _currentArray.push({
        ItemId: item.Id,
        PhotoUrl: "",
        RedirectUrl: "",
        Title: "",
        Description: "",
        IsIdeaMainProduct: false,
      })
    );
    setSelectedAdvertCategoryListToApi(_currentArray);
  }, [selectedAdvertCategoryList]);

  useStateEffect(() => {
    props.setSelectedAdvertCategoryListToApi(selectedAdvertCategoryListToApi);
    props.setSelectedAdvertCategoryList(selectedAdvertCategoryList);
  }, [selectedAdvertCategoryListToApi]);

  const returnHeader = () => {
    return (
      <div className=" lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Kategori Görseli</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Kategori adı</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Üst Kategori</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Kategori Komisyonu</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Durum</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400"> </span>
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
          <p className="text-black-700 text-sm">{e.CategoryName}</p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Üst Kategori:</span>
          <p className="text-black-700 text-sm">{e.ParentName}</p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">
            Kategori Komisyonu:
          </span>
          <p className="text-black-700 text-sm">%{e.CommissionPercentage}</p>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Durum:</span>
          <p
            className={`${
              e.CategoryStatus === true ? "text-green-400" : "text-red-400"
            } font-medium text-sm`}
          >
            {e.CategoryStatus === true ? "Aktif" : "Pasif"}
          </p>
        </div>
      </>
    );
  };
  return (
    <div>
      <h4 className="mb-4">Öne Çıkarılacak Ürün Kategori Listesi</h4>
      <Button
        textTiny
        text="Kategori Seç"
        hasIcon
        icon={<PlusIcon className="icon-sm mr-2 " />}
        design="button-blue-100 text-blue-400 w-60 mb-4"
        onClick={() => setShowAdvertCategoryModal(true)}
      />
      <Table
        ref={tableEl}
        key={"table2"}
        emptyListText={"Kategori Bulunamadı"}
        getDataFunction={sellerCategoryList}
        header={returnHeader()}
        renderItem={(e, i) => {
          return (
            <div
              key={"list" + i}
              className="lg:grid-cols-9 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
            >
              {returnBody(e)}
              <div className="lg:col-span-1">
                <TrashIcon
                  className="icon-sm mr-2"
                  onClick={() => removeSelectedAdvertCategoryList(e)}
                />
              </div>
            </div>
          );
        }}
        noRefreshButton
      />

      <Modal
        modalType="fixedMd"
        showModal={showAdvertCategoryModal}
        onClose={() => {
          setShowAdvertCategoryModal(false);
          setSelectedTempAdvertCategoryList(selectedAdvertCategoryList);
        }}
        title="Listeden Ürün Kategorisi Ekleme"
        body={
          <div className="">
            <div className="flex gap-3 justify-end items-center text-sm my-4">
              <div className="text-gray-700">
                <span className="text-gray-900 font-medium">
                  {selectedTempAdvertCategoryList.length} / 200
                </span>{" "}
                Kategori Seçildi
              </div>
              <Button
                buttonMd
                text="Seçili Kategorileri Ekle"
                design="button-blue-400 w-60"
                onClick={() => {
                  setSelectedAdvertCategoryList(selectedTempAdvertCategoryList);
                  setShowAdvertCategoryModal(false);
                }}
              />
            </div>
            <Table
              ref={tableElModal}
              key={"table1"}
              emptyListText={"Kategori Bulunamadı"}
              getDataFunction={getSellerCategoryList}
              getListData={getDataFromChild}
              pageChanged={checkIsAllPageDataSelected}
              header={
                <div className=" lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Kategori Görseli</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Kategori adı</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Üst Kategori</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Kategori Komisyonu</span>
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
                          ? () => deselectAllPageData()
                          : () => selectAllPageData()
                      }
                    ></Button>
                    <span className="p-sm-gray-400"> </span>
                  </div>
                </div>
              }
              renderItem={(e, i) => {
                return (
                  <div
                    key={"list" + i}
                    className="lg:grid-cols-9 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
                  >
                    {returnBody(e)}
                    <div className="lg:col-span-1">
                      <Button
                        buttonSm
                        className="p-6"
                        hasIcon
                        icon={
                          selectedTempAdvertCategoryList.find(
                            (i) => i.Id === e.Id
                          ) ? (
                            <CheckIcon className="icon-sm" />
                          ) : (
                            <></>
                          )
                        }
                        design={
                          selectedTempAdvertCategoryList.find(
                            (i) => i.Id === e.Id
                          )
                            ? "button-blue-400 text-white"
                            : "button-blue-100 text-blue-400"
                        }
                        text={
                          selectedTempAdvertCategoryList.find(
                            (i) => i.Id === e.Id
                          )
                            ? ""
                            : "Seç"
                        }
                        onClick={() => {
                          handleAddTempAdvertCategoryList(e);
                        }}
                      />
                      {/* } */}
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
