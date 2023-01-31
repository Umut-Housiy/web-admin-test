import { FunctionComponent, useRef, useState, useContext } from "react";

import {
  AdvertSearchResult,
  AvertSearchModel,
  ItemModel,
} from "../../../Models";
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
import { formatter, fraction } from "../../../Services/Functions";
import { AdvertSearchFilterBar } from "../../AdvertSearchFilterBar";

export interface Tabs2ForProductsProps {
  setSelectedAdvertListToApi: (e: ItemModel[]) => void;
  setSelectedAdvertList: (e: AdvertSearchResult[]) => void;
  selectedAdvertList: AdvertSearchResult[];
}

export const Tabs2ForProducts: FunctionComponent<Tabs2ForProductsProps> = (
  props: Tabs2ForProductsProps
) => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const [showAdvertProductModal, setShowAdvertProductModal] =
    useState<boolean>(false);

  const [selectedTempAdvertProductList, setSelectedTempAdvertProductList] =
    useState<AdvertSearchResult[]>(props.selectedAdvertList ?? []);

  const [selectedAdvertProductList, setSelectedAdvertProductList] = useState<
    AdvertSearchResult[]
  >(props.selectedAdvertList ?? []);

  const [selectedAdvertListToApi, setSelectedAdvertListToApi] = useState<
    ItemModel[]
  >([]);

  const sortOptions = [
    { key: "3", value: "Yeniden Eskiye" },
    { key: "4", value: "Eskiden Yeniye" },
    { key: "1", value: "Fiyat Artan" },
    { key: "2", value: "Fiyat Azalan" },
  ];

  //#region filters start
  const [categoryName, setCategoryName] = useState<string>("");

  const [minPrice, setMinPrice] = useState<string>("0");

  const [maxPrice, setMaxPrice] = useState<string>("0");

  const [minDiscountRate, setMinDiscountRate] = useState<string>("0");

  const [maxDiscountRate, setMaxDiscountRate] = useState<string>("0");

  const [allPageData, setAllPageData] = useState<AdvertSearchResult[]>([]);
  const [isAllPageDataSelected, setIsAllPageDataSelected] =
    useState<boolean>(false);

  const getDataFromChild = (childData) => {
    setAllPageData([...childData]);
  };

  const checkAllPageDataIsSelected = (checkData?: AdvertSearchResult[]) => {
    if (checkData == undefined) {
      for (let i = 0; i < allPageData.length; i++) {
        if (
          !selectedTempAdvertProductList.find(
            (x) => x.advertId == allPageData[i].advertId
          )
        ) {
          setIsAllPageDataSelected(false);
          return;
        }
      }
      setIsAllPageDataSelected(true);
      return;
    } else {
      for (let i = 0; i < allPageData.length; i++) {
        if (!checkData.find((x) => x.advertId == allPageData[i].advertId)) {
          setIsAllPageDataSelected(false);
          return;
        }
        setIsAllPageDataSelected(true);
        return;
      }
    }
  };

  const selectAllPageData = () => {
    if (allPageData != undefined) {
      let unSelectedAdverts = allPageData.filter(
        (x) =>
          !selectedTempAdvertProductList.find((y) => y.advertId == x.advertId)
      );
      setSelectedTempAdvertProductList([
        ...selectedTempAdvertProductList,
        ...unSelectedAdverts,
      ]);
      setIsAllPageDataSelected(true);
    }
  };
  const deSelectAllPageData = () => {
    if (allPageData != undefined) {
      let filteredData = selectedTempAdvertProductList.filter(
        (x) => !allPageData.find((y) => y.advertId == x.advertId)
      );
      setSelectedTempAdvertProductList([...filteredData]);
      setIsAllPageDataSelected(false);
    }
  };
  //#endregion fiters end

  useStateEffect(() => {
    checkAllPageDataIsSelected();
  }, [selectedTempAdvertProductList]);
  const searchAvertForAdmin = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    const _result = await ApiService.searchAvertForAdmin(
      searchText,
      page,
      take,
      order,
      categoryName,
      "",
      minPrice,
      maxPrice,
      minDiscountRate,
      maxDiscountRate,
      [],
      []
    );

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount,
      };
    } else {
      setShowAdvertProductModal(false);
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

  const handleAddTempAdvertProductList = (product) => {
    if (
      selectedTempAdvertProductList.find((i) => i.advertId === product.advertId)
    ) {
      let _currentArray = selectedTempAdvertProductList.filter(
        (i) => i.advertId !== product.advertId
      );
      setSelectedTempAdvertProductList(_currentArray);
      setIsAllPageDataSelected(false);
    } else {
      setSelectedTempAdvertProductList([
        ...selectedTempAdvertProductList,
        product,
      ]);
    }
  };

  const removeSelectedAdvertList = (e) => {
    let _currentArray = selectedAdvertProductList.filter(
      (i) => i.advertId !== e.advertId
    );
    setSelectedTempAdvertProductList(_currentArray);
    setSelectedAdvertProductList(_currentArray);
  };

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [selectedAdvertProductList]);

  const advertProductList = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    return {
      Data: selectedAdvertProductList.slice((page - 1) * take, page * take),
      TotalCount: selectedAdvertProductList.length,
    };
  };

  useStateEffect(() => {
    let _currentArray: ItemModel[] = [];
    selectedAdvertProductList.map((item) =>
      _currentArray.push({
        ItemId: Number(item.advertId),
        PhotoUrl: "",
        RedirectUrl: "",
        Title: "",
        Description: "",
        IsIdeaMainProduct: false,
      })
    );
    setSelectedAdvertListToApi(_currentArray);
  }, [selectedAdvertProductList]);

  useStateEffect(() => {
    props.setSelectedAdvertListToApi(selectedAdvertListToApi);
    props.setSelectedAdvertList(selectedAdvertProductList);
  }, [selectedAdvertListToApi]);

  const returnHeader = () => {
    return (
      <div className="lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
        <div className="lg:col-span-3">
          <span className="p-sm-gray-400">Ürün Adı</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Stok Adedi</span>
        </div>
        <div className="lg:col-span-2">
          <span className="p-sm-gray-400">Ürün Kategorisi</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">Satış Fiyatı</span>
        </div>
        <div className="lg:col-span-1">
          <span className="p-sm-gray-400">BUYBOX</span>
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
        <div className="lg:col-span-3 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Adı:</span>
          <div className="flex items-center w-full">
            <Image
              src={e.mainPhoto}
              className="min-w-14 max-w-14 max-h-14 min-h-14 mr-2 object-contain  "
            />
            <div className="">
              <p className="p-sm line-clamp-2">{e.productName}</p>
              <p className="text-black-700 text-sm">
                Barkod No: <span className="font-medium">{e.barcodeNo}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center flex items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Stok Adedi:</span>
          <p className="text-black-700 text-sm">{e.stockCount}</p>
        </div>
        <div className="lg:col-span-2 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Kategorisi:</span>
          <p className="text-black-700 text-sm">{e.category.join(" > ")}</p>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">Satış Fiyatı:</span>
          <p className="text-sm font-medium text-black-400">
            {e.discountedPrice && e.discountedPrice > 0 ? (
              <div className="text-tiny text-black-400 font-medium text-sm">
                {e.discountedPrice % 1 === 0 ? (
                  <>{fraction.format(e.discountedPrice ?? 0)} TL </>
                ) : (
                  <>{formatter.format(e.discountedPrice ?? 0)} TL</>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-x-1 mt-1">
                <div className="text-tiny text-black-400 font-medium text-sm">
                  {e.price % 1 === 0 ? (
                    <>{fraction.format(e.price)} TL </>
                  ) : (
                    <>{formatter.format(e.price)} TL</>
                  )}
                </div>
              </div>
            )}
          </p>
        </div>
        <div className="lg:col-span-1 flex lg:block items-center">
          <span className="p-sm-gray-700 lg:hidden mr-2">BUYBOX:</span>
          <p className="text-sm text-green-400 font-medium">
            {e.buyboxPrice % 1 === 0 ? (
              <>{fraction.format(e.buyboxPrice)} TL </>
            ) : (
              <>{formatter.format(e.buyboxPrice)} TL</>
            )}
          </p>
        </div>
      </>
    );
  };

  const clearFilter = () => {
    setCategoryName("");
    setMinPrice("0");
    setMaxPrice("0");
    setMinDiscountRate("0");
    setMaxDiscountRate("0");
  };

  return (
    <div>
      <h4 className="mb-4">Öne Çıkarılacak Ürün Listesi</h4>
      <Button
        textTiny
        text="Ürün Seç"
        hasIcon
        icon={<PlusIcon className="icon-sm mr-2 " />}
        design="button-blue-100 text-blue-400 w-60 mb-4"
        onClick={() => setShowAdvertProductModal(true)}
      />

      <Table
        ref={tableEl}
        key={"table2"}
        emptyListText={"Ürün Bulunamadı"}
        getDataFunction={advertProductList}
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
                  onClick={() => removeSelectedAdvertList(e)}
                />
              </div>
            </div>
          );
        }}
        noRefreshButton
      />

      <Modal
        modalType="fixedMd"
        showModal={showAdvertProductModal}
        onClose={() => {
          setShowAdvertProductModal(false);
          setSelectedTempAdvertProductList(selectedAdvertProductList);
          clearFilter();
        }}
        title="Listeden Ürün Ekleme"
        body={
          <div className="">
            <div className="flex gap-3 justify-end items-center text-sm my-4">
              <div className="text-gray-700">
                <span className="text-gray-900 font-medium">
                  {selectedTempAdvertProductList.length} / 200
                </span>{" "}
                Ürün Seçildi
              </div>
              <Button
                buttonMd
                text="Seçili Ürünleri Ekle"
                design="button-blue-400 w-60"
                onClick={() => {
                  setSelectedAdvertProductList(selectedTempAdvertProductList);
                  setShowAdvertProductModal(false);
                  clearFilter();
                }}
              />
            </div>
            <AdvertSearchFilterBar
              setCategoryName={setCategoryName}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              setMinDiscountRate={setMinDiscountRate}
              setMaxDiscountRate={setMaxDiscountRate}
              setApplyClink={() => tableElModal.current?.reload()}
            />

            <Table
              ref={tableElModal}
              key={"table1"}
              emptyListText={"Ürün Bulunamadı"}
              getDataFunction={searchAvertForAdmin}
              pageChanged={checkAllPageDataIsSelected}
              header={
                <div className="lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-3">
                    <span className="p-sm-gray-400">Ürün Adı</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Stok Adedi</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Ürün Kategorisi</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Satış Fiyatı</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">BUYBOX</span>
                  </div>
                  <div className="lg:col-span-1">
                    <Button
                      className="p-6"
                      buttonSm
                      design={
                        isAllPageDataSelected
                          ? "button-blue-400 text-white"
                          : "button-blue-100 text-blue-400"
                      }
                      text={
                        isAllPageDataSelected ? "Seçimi Kaldır" : "Tümünü Seç"
                      }
                      onClick={
                        !isAllPageDataSelected
                          ? () => selectAllPageData()
                          : () => deSelectAllPageData()
                      }
                    ></Button>
                  </div>
                </div>
              }
              getListData={getDataFromChild}
              sortOptions={sortOptions}
              renderItem={(e, i) => {
                return (
                  <div
                    key={"list" + i}
                    className="lg:grid-cols-9 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
                  >
                    {returnBody(e)}
                    <div className="lg:col-span-1">
                      {e.isEnabled === true ? (
                        <Button
                          buttonSm
                          className="p-6"
                          hasIcon
                          icon={
                            selectedTempAdvertProductList.find(
                              (i) => i.advertId === e.advertId
                            ) ? (
                              <CheckIcon className="icon-sm" />
                            ) : (
                              <></>
                            )
                          }
                          design={
                            selectedTempAdvertProductList.find(
                              (i) => i.advertId === e.advertId
                            )
                              ? "button-blue-400 text-white"
                              : "button-blue-100 text-blue-400"
                          }
                          text={
                            selectedTempAdvertProductList.find(
                              (i) => i.advertId === e.advertId
                            )
                              ? ""
                              : "Seç"
                          }
                          onClick={() => {
                            handleAddTempAdvertProductList(e);
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
