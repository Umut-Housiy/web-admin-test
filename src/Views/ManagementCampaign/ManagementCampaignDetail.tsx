import { FunctionComponent, useContext, useEffect, useRef, useState, } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import {
  CheckIcon,
  ChevronRightIcon,
  CloseIcon,
  EditIcon,
  NewTabIcon,
  PlusIcon,
  TrashIcon,
} from "../../Components/Icons";
import { TabsTitle } from "../../Components/TabsTitle";
import { Image } from "../../Components/Image";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel, } from "../../Services/SharedContext";
import { Label } from "../../Components/Label";
import { Button } from "../../Components/Button";
import { Table } from "../../Components/Table";
import { formatter, fraction } from "../../Services/Functions";
import { Modal } from "../../Components/Modal";
import { DateView } from "../../Components/DateView";
import { SITE_URLS } from "../../Services/Constants";
import { AdvertSearchFilterBar } from "../../Components/AdvertSearchFilterBar";
import { AdvertSearchResult } from "../../Models";

interface RouteParams {
  id: string;
}

interface LocationModel {
  queryPage: number;
}

export const ManagementCampaignDetail: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const history = useHistory();

  const location = useLocation<LocationModel>();

  const [loading, setLoading] = useState<boolean>(false);

  const tableEl = useRef<any>();

  const tableElModal = useRef<any>();

  const tabsLink = [
    { id: 1, name: "Kampanya Bilgisi" },
    { id: 2, name: "Kampanya Ürünleri" },
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [photoUrl, setPhotoUrl] = useState<string>("");

  const [campaignName, setCampaignName] = useState<string>("");

  const [startDate, setStartDate] = useState<number>(0);

  const [endDate, setEndDate] = useState<number>(0);

  const [hasCountDown, setHasCountDown] = useState<boolean>(true);

  const [seoUrl, setSeoUrl] = useState<string>("");

  const [showAdvertProductModal, setShowAdvertProductModal] = useState<boolean>(false);

  const [selectedTempAdvertProductList, setSelectedTempAdvertProductList] = useState<number[]>([]);

  const [campaignAdvertIds, setCampaignAdvertIds] = useState<number[]>([]);

  const [advertLoading, setAdvertLoading] = useState<boolean>(false);

  const [status, setStatus] = useState<boolean>(false);
  const [campaignSortNumber, setCampaignSortNumber] = useState<number>(1);

  //#region filters start
  const [categoryName, setCategoryName] = useState<string>("");

  const [campaignNameForFilter, setCampaignNameForFilter] = useState<string>("");

  const [minDiscountRate, setMinDiscountRate] = useState<string>("0");

  const [maxDiscountRate, setMaxDiscountRate] = useState<string>("0");

  const sortOptions = [
    {key: "3", value: "Yeniden Eskiye"},
    {key: "4", value: "Eskiden Yeniye"},
    {key: "1", value: "Fiyat Artan"},
    {key: "2", value: "Fiyat Azalan"},
  ];

  const [listDataFromChild, setListDataFromChild] = useState<AdvertSearchResult[]>();
  const [selectedAllProductsInPage, setSelectedAllProductsInPage] = useState<boolean>(false);

  const selectAllProducts = () => {
    if (listDataFromChild === undefined) return;
    const filterNotExist = listDataFromChild.filter(
      (x) => !selectedTempAdvertProductList.includes(Number(x.advertId))
    );
    setSelectedTempAdvertProductList([
      ...selectedTempAdvertProductList,
      ...filterNotExist.map((x) => Number(x.advertId)),
    ]);
    setSelectedAllProductsInPage(true);
  };

  const deSelectAllProducts = () => {
    if (listDataFromChild === undefined) return;
    selectedTempAdvertProductList.filter((x) => x);
    let filteredList = selectedTempAdvertProductList.filter(
      (x) => !listDataFromChild.find((y) => Number(y.advertId) === x)
    );
    setSelectedTempAdvertProductList(filteredList);
    setSelectedAllProductsInPage(false);
  };

  const getDataFromChild = (d) => {
    setListDataFromChild(d);
    checkPageListSelected(d);
  };

  const checkPageListSelected = (list?: AdvertSearchResult[]) => {
    if (list === undefined) {
      if (listDataFromChild === undefined) {
        setSelectedAllProductsInPage(false);
        return;
      }
      for (let i = 0; i < listDataFromChild?.length; i++) {
        if (
          !selectedTempAdvertProductList.includes(
            Number(listDataFromChild[i].advertId)
          )
        ) {
          setSelectedAllProductsInPage(false);
          return;
        }
      }
    } else {
      for (let i = 0; i < list?.length - 1; i++) {
        if (
          !selectedTempAdvertProductList.find(
            (y) => y === Number(list[i].advertId)
          )
        ) {
          setSelectedAllProductsInPage(false);
          return;
        }
      }
    }
    setSelectedAllProductsInPage(true);
  };

  //#endregion fiters end

  useEffect(() => {
    getManagementCampaignDetail();
  }, []);

  const getManagementCampaignDetail = async () => {
    setLoading(true);

    const response = await ApiService.getManagementCampaignDetail(Number(params.id ?? "0"));

    if (response.succeeded) {
      let x = response.data;
      setPhotoUrl(x.PhotoUrl);
      setCampaignName(x.CampaignName);
      setStartDate(x.StartDateJSTime);
      setEndDate(x.EndDateJSTime);
      setHasCountDown(x.ShowCountdown);
      setSeoUrl(x.SeoUrl);
      setStatus(x.Status);
      setCampaignSortNumber(x.SortNumber);
      setLoading(false);
    } else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          history.push("/yonetim-kampanyalari");
        },
      });
    }
  };

  const showQuestionModalForTerminate = async () => {
    context.showModal({
      type: "Question",
      title: "Kampanyaya sonlandırılsın mı?",
      message:
        "Sonlandırılan kampanyaların durumu pasife alınacak ve değişiklik yapılamayacaktır. Bu işlem geri alınamaz",
      onClose: () => {
        context.hideModal();
      },
      onClick: async () => {
        await terminateCampaignForAdmin();
        return true;
      },
    });
  };

  const terminateCampaignForAdmin = async () => {
    const _result = await ApiService.terminateCampaignForAdmin(Number(params.id ?? "0"));

    if (_result.succeeded) {
      context.showModal({
        type: "Success",
        title: "Kampanya Sonlandırıldı",
        onClose: () => {
          context.hideModal();
          history.push("/yonetim-kampanyalari");
        },
      });
    } else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
        },
      });
    }
  };

  useEffect(() => {
    if (selectedTabsId === 2) getCampaignAdvertIds();
  }, [selectedTabsId]);

  const getCampaignAdvertIds = async () => {
    setAdvertLoading(true);

    const response = await ApiService.getCampaignAdvertIds(Number(params.id));

    if (response.succeeded) {
      setCampaignAdvertIds(response.data);
      setLoading(false);
      setAdvertLoading(false);
    } else {
      setAdvertLoading(false);
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
        },
      });
    }
  };

  const getUsedProducts = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    const response = await ApiService.getUsedProducts(
      Number(params.id),
      page,
      take,
      searchText,
      order
    );

    if (response.succeeded) {
      setAdvertLoading(false);
      return {
        Data: response.data.Data,
        TotalCount: response.data.TotalCount,
      };
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          setAdvertLoading(false);
        },
      });
      return {
        Data: [],
        TotalCount: 0,
      };
    }
  };

  const searchAvertForAdmin = async (
    order: number,
    searchText: string,
    page: number,
    take: number
  ) => {
    const response = await ApiService.searchAvertForAdmin(
      searchText,
      page,
      take,
      order,
      categoryName,
      campaignNameForFilter,
      "0",
      "0",
      minDiscountRate,
      maxDiscountRate,
      [],
      []
    );

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
        onClose: () => {
          context.hideModal();
        },
      });
      return {Data: [], TotalCount: 0,};
    }
  };

  const handleAddTempAdvertProductList = (advertId) => {
    if (selectedTempAdvertProductList.find((i) => i === Number(advertId))) {
      let _currentArray = selectedTempAdvertProductList.filter(
        (i) => i !== Number(advertId)
      );
      setSelectedTempAdvertProductList(_currentArray);
    } else {
      setSelectedTempAdvertProductList([
        ...selectedTempAdvertProductList,
        Number(advertId),
      ]);
    }
  };

  const addAdvertToManagementCampaign = async () => {
    const response = await ApiService.addAdvertToManagementCampaign(Number(params.id), selectedTempAdvertProductList);
    if (response.succeeded) {
      setShowAdvertProductModal(false);
      context.showModal({
        type: "Success",
        title: "Ürünler eklendi",
        onClose: () => {
          context.hideModal();
          tableEl?.current?.reload();
          clearFilter();
        },
      });
    } else {
      setShowAdvertProductModal(false);
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
        },
      });
    }
  };

  const showDeleteAdvertModal = async (CampaignAdvertId) => {
    context.showModal({
      type: "Question",
      title: "Bu ürünü kampanyadan silmek istiyor musunuz?",
      message:
        "Onayladığınız takdirde ürün kampanyadan silinecektir. Bu işlemi geri alamazsınız",
      onClose: () => {
        context.hideModal();
      },
      onClick: async () => {
        await excludeAdvertFromCampaignForAdmin(CampaignAdvertId);
        return true;
      },
    });
  };

  const excludeAdvertFromCampaignForAdmin = async (CampaignAdvertId) => {
    context.hideModal();
    const response = await ApiService.excludeAdvertFromCampaignForAdmin(CampaignAdvertId);

    if (response.succeeded) {
      context.showModal({
        type: "Success",
        title: "Ürün Kaldırıldı",
        onClose: () => {
          context.hideModal();
          tableEl.current?.reload();
        },
      });
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
        },
      });
    }
  };

  const clearFilter = () => {
    setCategoryName("");
    setCampaignNameForFilter("");
    setMinDiscountRate("0");
    setMaxDiscountRate("0");
  };

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link
          to={`${
            location.state?.queryPage !== 1
              ? `/yonetim-kampanyalari?sayfa=${location.state?.queryPage ?? 1}`
              : "/yonetim-kampanyalari"
          }`}
          className="inline-block mb-5"
        >
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Yönetim Kampanyaları
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <h2 className="mb-5">Kampanya Detayı</h2>
          {status && endDate > new Date().getTime() && (
            <div className="flex items-center gap-3">
              <Button
                onClick={() =>
                  history.push(`/yonetim-kampanyasi-duzenle/${params.id}`)
                }
                buttonSm
                text="Kampanya Bilgilerini Düzenle"
                hasIcon
                icon={<EditIcon className="icon-sm mr-2" />}
                design="button-blue-400 w-72 text-white"
              />
              <Button
                onClick={() => showQuestionModalForTerminate()}
                buttonSm
                text="Kampanyayı Sonlandır"
                hasIcon
                icon={<CloseIcon className="icon-sm mr-2" />}
                design="button-gray-100 w-72 "
              />
            </div>
          )}
        </div>
        <TabsTitle
          list={tabsLink}
          selectedTabsId={selectedTabsId}
          onItemSelected={(item) => {
            setSelectedTabsId(item.id);
          }}
        />
        {selectedTabsId === 1 ? (
          <>
            <h4 className="my-4">Kampanya Bilgileri</h4>
            {loading ? (
              <></>
            ) : (
              <Image
                key="photoUrl"
                src={photoUrl}
                alt={campaignName}
                className="h-20 w-32 object-contain"
              />
            )}
            <div className="w-1/3">
              <Label
                loading={loading}
                title="Kampanya Başlığı"
                desc={campaignName}
                descClassName="text-sm"
              />
              <Label
                loading={loading}
                title="Kampanya Başlangıç Tarihi"
                desc={
                  <DateView
                    key="startDate"
                    className="text-sm font-medium"
                    dateNumber={startDate}
                    pattern="dd/MM/yyyy"
                  />
                }
                descClassName="text-sm"
              />
              <Label
                loading={loading}
                title="Kampanya Bitiş Tarihi"
                desc={
                  <DateView
                    key="endDate"
                    className="text-sm font-medium"
                    dateNumber={endDate}
                    pattern="dd/MM/yyyy"
                  />
                }
                descClassName="text-sm"
              />
              <Label
                loading={loading}
                title="Geri Sayım Sayacı"
                desc={hasCountDown ? "Aktif" : "Pasif"}
                descClassName={
                  hasCountDown
                    ? "text-sm text-blue-400 font-medium"
                    : " text-sm text-gray-700 font-medium"
                }
              />
              <Label
                loading={loading}
                title="Kampanya Sırası"
                desc={campaignSortNumber}
              />
              <Label
                loading={loading}
                title="Yönlendirileceği Sayfa (URL)"
                desc={
                  <div className="flex items-center">
                    {seoUrl}{" "}
                    <a
                      className="pr-3"
                      target="_blank"
                      href={`${SITE_URLS.SITE_URL}/kampanya/${seoUrl ?? ""}`}
                    >
                      <NewTabIcon className="icon-sm inline-block ml-2" />
                    </a>
                  </div>
                }
                descClassName="text-blue-400 text-sm underline font-medium"
              />
            </div>
          </>
        ) : (
          <>
            <Table
              ref={tableEl}
              key={"table1"}
              emptyListText={"Ürün Bulunamadı"}
              getDataFunction={getUsedProducts}
              addNewButton={
                <Button
                  isLoading={advertLoading}
                  onClick={() => setShowAdvertProductModal(true)}
                  buttonMd
                  textTiny
                  design={`${
                    status && endDate > new Date().getTime()
                      ? "button-blue-100 text-blue-400 "
                      : "pointer-events-none button-gray-100 text-gray-400"
                  } w-72 `}
                  text="Yeni Ürün Ekle"
                  hasIcon
                  icon={<PlusIcon className="icon-sm mr-2" />}
                />
              }
              header={
                <div className="lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Ürün Adı</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Barkod No</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Model No</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Kategori</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Marka</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Oluşturulma Tarihi</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">BUYBOX</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Satıcı Sayısı</span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm-gray-400">Varyasyon Sayısı</span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="p-sm-gray-400">Durum</span>
                  </div>
                </div>
              }
              renderItem={(e, i) => {
                return (
                  <div
                    key={"list" + i}
                    className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0"
                  >
                    <div className="lg:col-span-2 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Ürün Adı:
                      </span>
                      <div className="flex w-full items-center">
                        <Image
                          src={e.PhotoUrl}
                          className="w-12 h-12 max-h-12 max-w-12 mr-2 object-contain"
                          key={"image" + i}
                          alt={e.ProductName}
                        />
                        <p className="text-sm text-gray-900 line-clamp-3 overflow-auto">
                          {e.ProductName}
                        </p>
                      </div>
                    </div>
                    <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Barkod No:
                      </span>
                      <p className="text-black-700 text-sm">{e.Barcode}</p>
                    </div>
                    <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Model No:
                      </span>
                      <p className="text-black-700 text-sm">{e.ModelNo}</p>
                    </div>
                    <div className="lg:col-span-1 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Kategori
                      </span>
                      <p className="text-black-700 text-sm">{e.Category}</p>
                    </div>
                    <div className="lg:col-span-1 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Marka
                      </span>
                      <p className="text-black-700 text-sm">{e.StoreName}</p>
                    </div>
                    <div className="lg:col-span-1 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Oluşturulma Tarihi
                      </span>
                      <p className="text-black-700 text-sm">
                        <DateView
                          className="text-sm text-gray-700 mb-1"
                          dateNumber={e.CreatedDateJSTime ?? 0}
                          pattern="dd/MM/yyyy"
                        />
                      </p>
                    </div>
                    <div className="lg:col-span-1 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        BUYBOX:
                      </span>
                      <p className="text-sm text-green-400 font-medium">
                        {e.BuyboxPrice % 1 === 0 ? (
                          <>{fraction.format(e.BuyboxPrice)} TL </>
                        ) : (
                          <>{formatter.format(e.BuyboxPrice)} TL</>
                        )}
                      </p>
                    </div>
                    <div className="lg:col-span-1 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Satıcı Sayısı
                      </span>
                      <p className="text-black-700 text-sm">-</p>
                    </div>{" "}
                    <div className="lg:col-span-1 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Varyasyon Sayısı
                      </span>
                      <p className="text-black-700 text-sm">-</p>
                    </div>{" "}
                    <div className="lg:col-span-2 flex lg:block items-center">
                      <span className="p-sm-gray-700 lg:hidden mr-2">
                        Durum
                      </span>
                      <div className="flex items-center justify-between">
                        <span>-</span>
                        <div className="ml-auto flex items-center divide-x">
                          <div className="pr-3">
                            {status && endDate > new Date().getTime() && (
                                <TrashIcon
                                  className="icon-sm text-gray-900"
                                  onClick={() =>
                                    showDeleteAdvertModal(e.CampaignAdvertId)
                                  }
                                />
                              )}
                          </div>
                          <Link
                            className="pl-3"
                            to={`/urun-ilan-detay/${e.AdvertId}`}
                          >
                            <ChevronRightIcon className="icon-md text-gray-700" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </>
        )}
      </div>
      <Modal
        modalType="fixedMd"
        showModal={showAdvertProductModal}
        onClose={() => {
          setShowAdvertProductModal(false);
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
                  addAdvertToManagementCampaign();
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
            />
            <Table
              ref={tableElModal}
              key={"table1Modal"}
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
                          ? () => {
                              selectAllProducts();
                            }
                          : () => {
                              deSelectAllProducts();
                            }
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
                              (i) => i === Number(e.advertId)
                            ) ||
                            campaignAdvertIds.find(
                              (i) => i === Number(e.advertId)
                            ) ? (
                              <CheckIcon className="icon-sm" />
                            ) : (
                              <></>
                            )
                          }
                          design={
                            campaignAdvertIds.find(
                              (i) => i === Number(e.advertId)
                            )
                              ? "button-blue-400 pointer-events-none"
                              : selectedTempAdvertProductList.find(
                                  (i) => i === Number(e.advertId)
                                )
                              ? "button-blue-400 text-white"
                              : "button-blue-100 text-blue-400"
                          }
                          text={
                            selectedTempAdvertProductList.find(
                              (i) => i === Number(e.advertId)
                            ) ||
                            campaignAdvertIds.find(
                              (i) => i === Number(e.advertId)
                            )
                              ? ""
                              : "Seç"
                          }
                          onClick={() => {
                            handleAddTempAdvertProductList(e.advertId);
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
