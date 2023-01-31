import { FunctionComponent, useCallback, useContext, useEffect, useRef, useState, } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../Components/Button";
import { CheckIcon, ChevronRightIcon, PlusIcon, TrashIcon, } from "../../Components/Icons";
import { SidebarLinks } from "../../Components/SiderbarLinks";
import { Table } from "../../Components/Table";
import { Image } from "../../Components/Image";
import { SharedContext, SharedContextProviderValueModel, } from "../../Services/SharedContext";
import ApiService from "../../Services/ApiService";
import { Modal } from "../../Components/Modal";
import { formatter, fraction } from "../../Services/Functions";
import { AdvertSearchResult } from "../../Models";
import { Label } from "../../Components/Label";
import { useStateEffect } from "../../Components/UseStateEffect";
import { DatePicker } from "../../Components/DatePicker";
import { ToggleButton } from "../../Components/ToggleButton";
import { Dropzone } from "../../Components/Dropzone";
import { SERVICES } from "../../Services/Constants";
import { AdvertSearchFilterBar } from "../../Components/AdvertSearchFilterBar";

const sidebarLinks = [
  {id: 1, title: "1. Kampanya İçeriği",},
  {id: 2, title: "2. Kampanya Bilgileri",},
];

const sortOptions = [
  {key: "3", value: "Yeniden Eskiye"},
  {key: "4", value: "Eskiden Yeniye"},
  {key: "1", value: "Fiyat Artan"},
  {key: "2", value: "Fiyat Azalan"},
];

export const ManagementCampaignAdd: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const history = useHistory();
  const params = useParams<{ id: string }>();
  const tableEl = useRef<any>();
  const tableElModal = useRef<any>();

  const [createProcessingLoading, setCreateProcessingLoading] = useState<boolean>(false);

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);
  const [showAdvertProductModal, setShowAdvertProductModal] = useState<boolean>(false);
  const [selectedTempAdvertProductList, setSelectedTempAdvertProductList] = useState<AdvertSearchResult[]>([]);
  const [selectedAdvertProductList, setSelectedAdvertProductList] = useState<AdvertSearchResult[]>([]);
  const [selectedAdvertIdList, setSelectedAdvertIdList] = useState<number[]>([]);
  const [campaignSortNumber, setCampaignSortNumber] = useState<number>(1);
  const [selectedStartDate, setSelectedStartDate] = useState<Date>(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date(selectedStartDate.getTime() + 86400000));
  const [hasCountDown, setHasCountDown] = useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string>("");

  const [categoryName, setCategoryName] = useState<string>("");
  const [campaignNameForFilter, setCampaignNameForFilter] = useState<string>("");
  const [minDiscountRate, setMinDiscountRate] = useState<string>("0");
  const [maxDiscountRate, setMaxDiscountRate] = useState<string>("0");
  const [listDataFromChild, setListDataFromChild] = useState<AdvertSearchResult[]>();
  const [selectedAllProductsInPage, setSelectedAllProductsInPage] = useState<boolean>(false);
  const [selectedSellerCampaignIds, setSelectedSellerCampaignIds] = useState<string[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<string>("");

  const selectAllProducts = () => {
    if (listDataFromChild === undefined) return;
    const filterNotExist = listDataFromChild.filter(
      (x) => !selectedTempAdvertProductList.includes(x)
    );
    setSelectedTempAdvertProductList([
      ...selectedTempAdvertProductList,
      ...filterNotExist,
    ]);
    setSelectedAllProductsInPage(true);
  };

  const deSelectAllProducts = () => {
    if (listDataFromChild === undefined) return;
    const filteredList = selectedTempAdvertProductList.filter(
      (x) => !listDataFromChild.find((y) => y.advertId === x.advertId)
    );
    setSelectedTempAdvertProductList(filteredList);
    setSelectedAllProductsInPage(false);
  };

  const checkPageListSelected = (list?: AdvertSearchResult[]) => {
    if (list === undefined) {
      if (listDataFromChild === undefined) {
        setSelectedAllProductsInPage(false);
        return;
      }
      for (let i = 0; i < listDataFromChild?.length; i++) {
        if (!selectedTempAdvertProductList.includes(listDataFromChild[i])) {
          setSelectedAllProductsInPage(false);
          return;
        }
      }
    } else {
      for (let i = 0; i < list?.length - 1; i++) {
        if (
          !selectedTempAdvertProductList.find(
            (y) => y.advertId === list[i].advertId
          )
        ) {
          setSelectedAllProductsInPage(false);
          return;
        }
      }
    }
    setSelectedAllProductsInPage(true);
  };

  const searchAvertForAdmin = async (order: number, searchText: string, page: number, take: number) => {
    if (selectedSellerId !== "") {
      const response = await ApiService.searchAvertForAdminBySellerIdAsAdvertSearchResult(Number(selectedSellerId), page, take, order);
      if (response.succeeded) {
        return {
          Data: response.data.Data,
          TotalCount: response.data.TotalCount,
        };
      } else {
        setShowAdvertProductModal(false);
        context.showModal({
          type: "Error",
          message: response.message,
          onClose: () => context.hideModal(),
        });
        return {Data: [], TotalCount: 0,};
      }
    } else if (
      selectedSellerCampaignIds !== undefined
      && selectedSellerCampaignIds.length > 0
    ) {
      const response = await ApiService.searchAvertForAdminBySellerCampaignIds(selectedSellerCampaignIds.map((x) => Number(x)), page, take, order);
      if (response.succeeded) {
        return {
          Data: response.data.Data,
          TotalCount: response.data.TotalCount,
        };
      } else {
        setShowAdvertProductModal(false);
        context.showModal({
          type: "Error",
          message: response.message,
          onClose: () => context.hideModal(),
        });
        return {Data: [], TotalCount: 0,};
      }
    }
    const response = await ApiService.searchAvertForAdmin(
      searchText, page, take, order, categoryName,
      campaignNameForFilter, "0", "0",
      minDiscountRate, maxDiscountRate, [], []);

    if (response.succeeded) {
      return {
        Data: response.data.Data,
        TotalCount: response.data.TotalCount,
      };
    } else {
      setShowAdvertProductModal(false);
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => context.hideModal(),
      });
      return {Data: [], TotalCount: 0,};
    }
  };

  const handleAddTempAdvertProductList = (product) => {
    if (selectedTempAdvertProductList.find((i) => i.advertId === product.advertId)) {
      const currentArray = selectedTempAdvertProductList.filter((i) => i.advertId !== product.advertId);
      setSelectedTempAdvertProductList(currentArray);
      setSelectedAllProductsInPage(false);
    } else {
      setSelectedTempAdvertProductList([...selectedTempAdvertProductList, product]);
    }
  };

  const removeSelectedAdvertList = (e) => {
    const currentArray = selectedAdvertProductList.filter((i) => i.advertId !== e.advertId);
    setSelectedTempAdvertProductList(currentArray);
    setSelectedAdvertProductList(currentArray);
  };

  useStateEffect(() => {
    checkPageListSelected();
  }, [selectedTempAdvertProductList]);

  useStateEffect(() => {
    tableEl.current?.reload();
  }, [selectedAdvertProductList]);

  const advertProductList = async (order: number, searchText: string, page: number) => {
    return {
      Data: selectedAdvertProductList.slice((page - 1) * 20, page * 20),
      TotalCount: selectedAdvertProductList.length,
    };
  };

  const addFiles = (e) => {
    setFileUrl(e[0].FileUrl);
  };

  const getDataFromChild = (d) => {
    setListDataFromChild(d);
    checkPageListSelected(d);
  };

  useStateEffect(() => {
    setSelectedAdvertIdList(selectedAdvertProductList.map(item => Number(item.advertId)));
  }, [selectedAdvertProductList]);

  const createManagementCampaign = async () => {
    setCreateProcessingLoading(true);

    const response = await ApiService.createManagementCampaign(
      selectedAdvertIdList, selectedStartDate.getTime(), selectedEndDate.getTime(),
      campaignName, fileUrl, hasCountDown, campaignSortNumber,
    );

    if (response.succeeded) {
      setCreateProcessingLoading(false);
      context.showModal({
        type: "Success",
        title: "Kampanya başarıyla oluşturuldu.",
        onClose: () => {
          context.hideModal();
          history.push("/yonetim-kampanyalari");
        },
      });
    } else {
      setCreateProcessingLoading(false);
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => context.hideModal(),
      });
    }
  };

  const clearFilter = () => {
    setCategoryName("");
    setCampaignNameForFilter("");
    setMinDiscountRate("0");
    setMaxDiscountRate("0");
  };

  const getCampaignAdverts = useCallback(async () => {
    const response = await ApiService.getUsedProducts(Number(params.id), 1, 99, '', 1);
    if (response.succeeded) {
      const array = response.data.Data.map((item) => ({
        advertId: String(item.AdvertId),
        barcodeNo: String(item.Barcode),
        buyboxPrice: item.BuyboxPrice,
        category: [item.Category],
        isEnabled: true,
        mainPhoto: item.PhotoUrl,
        price: item.MarketPrice,
        discountedPrice: item.SalePrice,
        productName: item.ProductName,
        stockCount: item.StockCount,
      }));
      // @ts-ignore
      setSelectedAdvertProductList(array);
      // @ts-ignore
      setSelectedTempAdvertProductList(array);
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          history.push("/yonetim-kampanyalari");
        },
      });
    }
  }, []);

  const getCampaignDetails = useCallback(async () => {
    const response = await ApiService.getManagementCampaignDetail(Number(params.id));

    if (response.succeeded) {
      const data = response.data;
      setCampaignName(`${data.CampaignName} kopyası`);
      setFileUrl(data.PhotoUrl);
      setHasCountDown(data.ShowCountdown);
      setCampaignSortNumber(data.SortNumber);
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          history.push("/yonetim-kampanyalari");
        },
      });
    }
  }, []);

  useEffect(() => {
    if (params.id) {
      getCampaignDetails();
      getCampaignAdverts();
    }
  }, [params.id]);

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-4 border-b border-gray-200">Yeni Kampanya Oluştur</h2>
        <div className="grid lg:grid-cols-4">
          <div className="lg:col-span-1 px-3 py-4">
            <SidebarLinks
              list={sidebarLinks}
              selectedTabsId={selectedTabsId}
              onItemSelected={(item) => setSelectedTabsId(item.id)}
            />
          </div>
          <div className="lg:col-span-3 pl-6 border-l border-gray-200 py-4">
            {selectedTabsId === 1 ? (
              <>
                <h4 className="mb-4">Kampanyalı Ürünler</h4>
                <div className="text-sm mb-4">
                  Kampanyanın koşullarında indirim uygulanacak ürün veya
                  ürünleri seçiniz.
                </div>
                <Button
                  buttonMd
                  text="Ürün Seç"
                  hasIcon
                  icon={<PlusIcon className="icon-sm mr-2" />}
                  design="button-blue-100"
                  className=" mb-4 w-60 text-blue-400"
                  onClick={() => setShowAdvertProductModal(true)}
                />
                <Table
                  ref={tableEl}
                  key={"table2"}
                  emptyListText={"Ürün Bulunamadı"}
                  getDataFunction={advertProductList}
                  header={
                    <div className=" lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
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
                  }
                  renderItem={(e, i) => {
                    return (
                      <div
                        key={"list" + i}
                        className="lg:grid-cols-9 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
                      >
                        <div className="lg:col-span-3 flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">
                            Ürün Adı:
                          </span>
                          <div className="flex w-full">
                            <Image
                              src={e.mainPhoto}
                              className="w-12 h-12 max-h-12 max-w-12 mr-2 object-contain  "
                            />
                            <div className="">
                              <p className="p-sm line-clamp-2">
                                {e.productName}
                              </p>
                              <p className="text-black-700 text-sm">
                                Barkod No:{" "}
                                <span className="font-medium">
                                  {e.barcodeNo}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">
                            Stok Adedi:
                          </span>
                          <p className="text-black-700 text-sm">
                            {e.stockCount}
                          </p>
                        </div>
                        <div className="lg:col-span-2 flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">
                            Ürün Kategorisi:
                          </span>
                          <p className="text-black-700 text-sm">
                            {e.category.join(" > ")}
                          </p>
                        </div>
                        <div className="lg:col-span-1 flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">
                            Satış Fiyatı:
                          </span>
                          <p className="text-sm font-medium text-black-400">
                            {e.discountedPrice && e.discountedPrice > 0 ? (
                              <div className="text-tiny text-black-400 font-medium text-sm">
                                {e.discountedPrice % 1 === 0 ? (
                                  <>
                                    {fraction.format(e.discountedPrice ?? 0)} TL{" "}
                                  </>
                                ) : (
                                  <>
                                    {formatter.format(e.discountedPrice ?? 0)}{" "}
                                    TL
                                  </>
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
                          <span className="p-sm-gray-700 lg:hidden mr-2">
                            BUYBOX:
                          </span>
                          <p className="text-sm text-green-400 font-medium">
                            {e.buyboxPrice % 1 === 0 ? (
                              <>{fraction.format(e.buyboxPrice)} TL </>
                            ) : (
                              <>{formatter.format(e.buyboxPrice)} TL</>
                            )}
                          </p>
                        </div>
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
                <div className="my-3 ml-auto flex items-center justify-end">
                  <Button
                    text="Sonraki Adım"
                    design="button-blue-400 text-white w-72"
                    onClick={() => setSelectedTabsId(2)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="w-2/3">
                  <Label
                    title="Kampanya Başlangıç Tarihi"
                    isRequired
                    withoutDots
                  />
                  <DatePicker
                    isFull
                    value={selectedStartDate}
                    minDate={selectedStartDate}
                    setSelectedDate={(e) => {
                      setSelectedStartDate(e);
                      setSelectedEndDate(e);
                    }}
                  />
                  <Label
                    className="mt-4"
                    title="Kampanya Bitiş Tarihi"
                    isRequired
                    withoutDots
                  />
                  <DatePicker
                    isFull
                    value={selectedEndDate}
                    minDate={new Date(selectedStartDate.getTime() + 86400000)}
                    setSelectedDate={(e) => {
                      setSelectedEndDate(e);
                    }}
                  />
                  <div className="flex items-center justify-between my-4">
                    <span className="p-sm font-medium text-gray-700">
                      Geri sayım sayacı çalıştır
                    </span>
                    <ToggleButton
                      onClick={() => setHasCountDown(!hasCountDown)}
                      defaultValue={hasCountDown}
                    />
                  </div>
                  <Label
                    className="mt-4"
                    title="Kampanya Başlığı"
                    isRequired
                    withoutDots
                  />
                  <input
                    className=" form-input"
                    type="text"
                    value={campaignName}
                    onChange={({target: {value}}) => setCampaignName(value)}
                  />
                  <Label
                    title="Kampanya Sıralaması"
                    className="mt-4"
                    isRequired
                    withoutDots
                  />
                  <input
                    type="number"
                    min="1"
                    value={campaignSortNumber}
                    className="form-input"
                    onChange={({target: {value}}) => setCampaignSortNumber(Number.parseInt(value))}
                  />
                  <Label
                    className="mt-4"
                    title="Kampanya Görseli"
                    isRequired
                    withoutDots
                  />
                  <Dropzone
                    fileUploaderCss
                    accept={["image"]}
                    addFiles={addFiles}
                    maxFileSizeAsMB={10}
                    uploadUrl={`${SERVICES.API_ADMIN_CAMPAIGN_URL}/upload-campaign-photo`}
                    maxFileCount={1}
                    sizeDescription={"389x220 px"}
                  />
                  {fileUrl !== "" && (
                    <div className="relative inline-block">
                      <Image key={"fileUrl"} src={fileUrl} className="w-full" />
                      <div className="absolute top-2 right-2 p-2 bg-white rounded-lg">
                        <TrashIcon
                          className="icon-sm"
                          onClick={() => setFileUrl("")}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="my-3 flex items-center justify-end">
                  <span
                    className="flex w-32 items-center text-sm text-gray-700 cursor-pointer"
                    onClick={() => setSelectedTabsId(1)}
                  >
                    <ChevronRightIcon className="transform -rotate-180 icon-md mr-3 " />
                    Önceki Adım
                  </span>
                  <Button
                    isLoading={createProcessingLoading}
                    text="Kaydet ve Tamamla"
                    design="button-blue-400 text-white w-72"
                    onClick={() => createManagementCampaign()}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

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
                  {selectedTempAdvertProductList.length} / 50
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
                  setSelectedAllProductsInPage(false);
                  clearFilter();
                }}
              />
            </div>
            <AdvertSearchFilterBar
              campaign
              setCategoryName={setCategoryName}
              setCampaignName={setCampaignNameForFilter}
              setMinDiscountRate={setMinDiscountRate}
              setMaxDiscountRate={setMaxDiscountRate}
              setApplyClink={() => tableElModal.current?.reload()}
              seller
              sellerCampaign
              setSellerId={(t) => setSelectedSellerId(t)}
              setSellerCampaignIds={(sellerIds) => setSelectedSellerCampaignIds(sellerIds)}
            />
            <Table
              ref={tableElModal}
              key={"table1"}
              emptyListText={"Ürün Bulunamadı"}
              getDataFunction={searchAvertForAdmin}
              getListData={getDataFromChild}
              sortOptions={sortOptions}
              pageChanged={checkPageListSelected}
              header={
                <div className=" lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
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
                      buttonSm
                      className="p-6"
                      hasIcon
                      // icon={
                      //   selectedAllProductsInPage? (
                      //     <CheckIcon className="icon-sm" />
                      //   ) : (
                      //     <></>
                      //   )
                      // }
                      design={
                        selectedAllProductsInPage
                          ? "button-blue-400 text-white"
                          : "button-blue-100 text-blue-400"
                      }
                      text={
                        selectedAllProductsInPage
                          ? "Seçimi kaldır"
                          : "Tümünü seç"
                      }
                      onClick={
                        !selectedAllProductsInPage
                          ? selectAllProducts
                          : deSelectAllProducts
                      }
                    />
                  </div>
                </div>
              }
              renderItem={(e, i) => {
                return (
                  <div
                    key={"list" + i}
                    className="lg:grid-cols-9 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
                  >
                    <div className="lg:col-span-3 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Ürün Adı:
                      </span>
                      <div className="flex w-full">
                        <Image
                          src={e.mainPhoto}
                          className="w-12 h-12 max-h-12 max-w-12 mr-2 object-contain  "
                        />
                        <div className="">
                          <p className="p-sm line-clamp-2">{e.productName}</p>
                          <p className="text-black-700 text-sm">
                            Barkod No:{" "}
                            <span className="font-medium">{e.barcodeNo}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Stok Adedi:
                      </span>
                      <p className="text-black-700 text-sm">{e.stockCount}</p>
                    </div>
                    <div className="lg:col-span-2 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Ürün Kategorisi:
                      </span>
                      <p className="text-black-700 text-sm">
                        {e.category.join(" > ")}
                      </p>
                    </div>
                    <div className="lg:col-span-1 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Satış Fiyatı:
                      </span>
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
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        BUYBOX:
                      </span>
                      <p className="text-sm text-green-400 font-medium">
                        {e.buyboxPrice % 1 === 0 ? (
                          <>{fraction.format(e.buyboxPrice)} TL </>
                        ) : (
                          <>{formatter.format(e.buyboxPrice)} TL</>
                        )}
                      </p>
                    </div>
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
