import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Image } from "../Components/Image";
import { ChevronRightIcon, CloseIcon, TrashIcon } from "../Components/Icons";
import { TabsTitle } from "../Components/TabsTitle";
import { CampaignMainAdvertModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Label } from "../Components/Label";
import { DateView } from "../Components/DateView";
import { currentDateStampForCompare, formatter, fraction } from "../Services/Functions";
import { Table } from "../Components/Table";
import { CountDown } from "../Components/CountDown";

interface RouteParams {
  id: string
}

interface LocationModel {
  queryPage: number,
}

export const SellerCampaignDetail: FunctionComponent = () => {

  const dateForCompare = currentDateStampForCompare();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const tabsLink = [
    { id: 1, name: "Kampanya Bilgisi" },
    { id: 2, name: "Kampanya Ürünleri" },
    { id: 3, name: "Kampanya Siparişleri" },
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  // TABS1--CAMPAIGN-DETAIL-START
  const campaignTypes = [
    { key: 1, name: "Tekil Ürün Kampanyası" },
    { key: 2, name: "İlişkili Ürün Kampanyası" },
    { key: 3, name: "Kasa Önü Kampanyası" },
  ];

  const [campaignCreatedData, setCampaignCreatedData] = useState<number>(0);

  const [campaignStartDate, setCampaignStartDate] = useState<number>(1627296150439);

  const [campaignEndDate, setCampaignEndDate] = useState<number>(1628296150439);

  const [campaignStatus, setCampaignStatus] = useState<boolean>(false);

  const [discountType, setDiscountType] = useState<number>(0);

  const [commissionDiscount, setCommissionDiscount] = useState<number>(0);

  const [discount, setDiscount] = useState<number>(0);

  const [orderedCount, setOrderedCount] = useState<number>(0);

  const [addBasketCount, setAddBasketCount] = useState<number>(0);

  const [totalEarning, setTotalEarning] = useState<number>(0);

  const [terminateCampaignLoading, setTerminateCampaignLoading] = useState<boolean>(false);

  const [sellerStoreName, setSellerStoreName] = useState<string>("");

  const [campaignType, setCampaignType] = useState<number>(0);

  const [mainAdvertData, setMainAdvertData] = useState<CampaignMainAdvertModel>(
    {
      AdvertId: 0,
      PhotoUrl: "",
      Name: "",
      StockCount: 0,
      SalePrice: 0,
      ShowProduct: false,
    }
  );

  const [status, setStatus] = useState<boolean>(false);


  useEffect(() => {
    getSellerCampaignDetail();
  }, [])

  const getSellerCampaignDetail = async () => {
    setLoading(true);

    const _result = await ApiService.getSellerCampaignDetail(Number(params.id));

    if (_result.succeeded === true) {
      const d = _result.data;
      setCampaignType(d.CampaignType);
      setSellerStoreName(d.SellerStoreName)
      setCampaignCreatedData(d.CreatedDateJSTime);
      setCampaignStartDate(d.StartDateJSTime);
      setCampaignEndDate(d.EndDateJSTime);
      setDiscountType(d.DiscountType);
      setCampaignStatus(d.Status);
      setCommissionDiscount(d.CommissionDiscount);
      setDiscount(d.Discount);
      setOrderedCount(d.ReportData.OrderedCount);
      setAddBasketCount(d.ReportData.AddBasketCount);
      setTotalEarning(d.ReportData.TotalEarning);
      setMainAdvertData(d.MainAdvertData);
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/satici-kampanya-listesi') }
      });
    }
  }

  const showQuestionModalForTerminate = async () => {
    context.showModal({
      type: "Question",
      title: "Kampanyaya sonlandırılsın mı?",
      message: "Sonlandırılan kampanyaların durumu pasife alınacak ve değişiklik yapılamayacaktır. Bu işlem geri alınamaz.",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await terminateCampaignForAdmin(); return true; }
    });
  }

  const terminateCampaignForAdmin = async () => {
    setTerminateCampaignLoading(true);

    const _result = await ApiService.terminateCampaignForAdmin(Number(params.id ?? "0"));

    context.hideModal();

    if (_result.succeeded === true) {
      setTerminateCampaignLoading(false);
      context.showModal({
        type: "Success",
        title: "Kampanya Sonlandırıldı",
        onClose: () => { context.hideModal(); history.push("/satici-kampanya-listesi"); }
      });
    }
    else {
      setTerminateCampaignLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); }
      });
    }
  }

  // TABS1--CAMPAIGN-DETAIL-END

  // TABS2--ADVET-LİST-START

  const tableEl = useRef<any>();

  const getUsedProducts = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getUsedProducts(Number(params.id), page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
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

  const showDeleteAdvertModal = async (CampaignAdvertId) => {
    context.showModal({
      type: "Question",
      title: "Bu ürünü kampanyadan silmek istiyor musunuz?",
      message: "Onayladığınız takdirde ürün kampanyadan silinecektir. Bu işlemi geri alamazsınız.",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await excludeAdvertFromCampaignForAdmin(CampaignAdvertId); return true; }
    });
  }

  const excludeAdvertFromCampaignForAdmin = async (CampaignAdvertId) => {
    setProcessLoading(true);

    const _result = await ApiService.excludeAdvertFromCampaignForAdmin(CampaignAdvertId);

    setProcessLoading(false);
    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ürün Kaldırıldı.",
        onClose: () => {
          context.hideModal();
          tableEl.current?.reload();

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
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/satici-kampanya-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/satici-kampanya-listesi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Kampanya Listesi
          </div>
        </Link>
        <div className="flex align-items-center mb-5 justify-between">
          <h2>Kampanya Detayı</h2>
          {(campaignStatus === true && campaignEndDate > dateForCompare) &&
            <Button buttonMd text="Kampanyayı Sonlandır" hasIcon icon={<CloseIcon className="icon-sm mr-2" />} design="button-gray-100 mr-2 w-48" onClick={() => showQuestionModalForTerminate()} />
          }
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {selectedTabsId === 1 ?
          <div className="grid lg:grid-cols-2 gap-4 my-4">
            <div className="lg:col-span-1">
              <h4 className="mb-4">Kampanya Bilgileri</h4>
              <Label loading={loading} className="mt-4" title="Mağaza" descClassName="text-sm font-medium text-blue-400 underline" desc={sellerStoreName} />
              <Label loading={loading} className="mt-4" descClassName="text-sm" title="Kampanya Oluşturma Tarihi" desc={<DateView className="text-sm font-medium" dateNumber={campaignCreatedData} pattern="dd/MM/yyyy" />} />
              <Label loading={loading} className="mt-4" title="Kampanya Türü" desc={campaignTypes.find(i => i.key === campaignType)?.name ?? "-"} />
              <Label loading={loading} className="mt-4" descClassName="text-sm" title="Kampanya Başlangıç Tarihi" desc={<DateView className="text-sm font-medium" dateNumber={campaignStartDate} pattern="dd/MM/yyyy" />} />
              <Label loading={loading} className="mt-4" descClassName="text-sm" title="Kampanya Bitiş Tarihi" desc={<DateView className="text-sm font-medium" dateNumber={campaignEndDate} pattern="dd/MM/yyyy" />} />
              <Label loading={loading} className="mt-4" title="Uygulanacak İndirim Türü" descClassName="text-sm font-medium text-blue-400 underline" desc={discountType === 1 ? "Yüzdelik" : "Fiyatsal"} />
              <Label loading={loading} className="mt-4" title="İndirim" desc={discountType === 1 ? "% " + discount :
                <>
                  {discount % 1 === 0 ?
                    <>{fraction.format(discount)} TL </>
                    :
                    <>{formatter.format(discount)} TL</>
                  }
                </>
              } />
              <Label loading={loading} className="mt-4" title="Kampanya Durumu" desc={campaignStatus === true && campaignEndDate < dateForCompare ? "Tamamlandı " : (campaignStatus === true && campaignStartDate < dateForCompare && campaignEndDate > dateForCompare) ? "Yayında" : (campaignStatus === true && campaignStartDate > dateForCompare) ? "Yayına girmesi bekleniyor" : "Pasif"}
                descClassName={campaignStatus === true ? "text-blue-400 font-medium text-sm" : "text-gray-700 font-medium text-sm"} />
            </div>
            <div className="lg:col-span-1">
              <h4 className="mb-4">Kampanya Raporları</h4>
              <Label loading={loading} className="mt-4" title="Aktif Süre" desc={
                <CountDown returnActiveDay={true} startDate={campaignStartDate} endDate={campaignEndDate} />
              } />
              <Label loading={loading} className="mt-4" title="Kalan Süre" desc={
                campaignStatus === true ?
                  <CountDown startDate={campaignStartDate} endDate={campaignEndDate} />
                  :
                  "-"
              } />
              <Label loading={loading} className="mt-4" title="Sepete Eklenme" desc={addBasketCount} />
              <Label loading={loading} className="mt-4" title="Sipariş Tamamlama" desc={orderedCount} />
              <Label loading={loading} className="mt-4" title="Toplam Kazanç" desc={
                (totalEarning % 1 === 0 ?
                  <>{fraction.format(totalEarning)} TL </>
                  :
                  <>{formatter.format(totalEarning)} TL</>
                )} />

            </div>
            {(mainAdvertData !== null && mainAdvertData.AdvertId > 0) &&
              <div className="lg:col-span-2">
                <h4 className="my-4">İlişkili Ana Ürün</h4>
                <div className=" lg:grid-cols-8 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                  <div className="lg:col-span-2 flex items-center">
                    <span className="text-sm text-gray-700 font-medium">
                      Ürün Adı
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="text-sm text-gray-700 font-medium">
                      Stok Adedi
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="text-sm text-gray-700 font-medium">
                      Satış Fiyatı
                    </span>
                  </div>
                  <div className="lg:col-span-2">
                    <span className="text-sm text-gray-700 font-medium">
                      Durum
                    </span>
                  </div>
                </div>
                <div className="lg:grid-cols-8 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0">
                  <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                    <span className="text-sm text-gray-700 font-medium lg:hidden mr-2">Ürün Adı</span>
                    <div className="flex items-center">
                      <Image src={mainAdvertData.PhotoUrl} alt={mainAdvertData.Name} className="w-12 h-12 mr-2 max-h-12 min-h-12 object-contain" />
                      <span className="font-medium text-sm text-gray-900 line-clamp-2 block ">
                        {mainAdvertData.Name}
                      </span>
                    </div>
                  </div>
                  <div className="lg:col-span-2 flex lg:block items-center">
                    <span className="text-sm text-gray-700 font-medium lg:hidden mr-2"> Stok Adedi</span>
                    <p className="p-sm font-medium">
                      {mainAdvertData.StockCount}
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex lg:block items-center">
                    <span className="text-sm text-gray-700 font-medium lg:hidden mr-2">Satış Fiyatı:</span>
                    <p className="p-sm  font-medium">
                      {mainAdvertData.SalePrice % 1 === 0 ?
                        <>{fraction.format(mainAdvertData.SalePrice)} TL </>
                        :
                        <>{formatter.format(mainAdvertData.SalePrice)} TL</>}
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex justify-between items-center">
                    <p className={`${mainAdvertData.ShowProduct === true ? "text-green-400" : "text-red-400"} font-medium text-sm`}>
                      {mainAdvertData.ShowProduct === true ? "Aktif" : "Pasif"}
                    </p>
                    <Link to={`/urun-ilan-detay/${mainAdvertData.AdvertId}`}>
                      <ChevronRightIcon className="icon-md text-gray-700 cursor-pointer block" />
                    </Link>
                  </div>
                </div>
              </div>
            }
          </div>
          : selectedTabsId === 2 &&
          <>
            <Table
              ref={tableEl}
              key={"table1"}
              emptyListText={"Ürün Bulunamadı"}
              getDataFunction={getUsedProducts}
              header={<div className="lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-2">
                  <span className="p-sm-gray-400">
                    Ürün Adı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Barkod No
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Model No
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Kategori
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Stok Kodu
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Stok Miktarı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Piyasa Satış Fiyatı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Satış Fiyatı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    BUYBOX
                  </span>
                </div>
                <div className="lg:col-span-2">
                  <span className="p-sm-gray-400">
                    Satıcı
                  </span>
                </div>

              </div>}
              renderItem={(e, i) => {
                return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-2 lg:py-0">
                  <div className="lg:col-span-2 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Adı:</span>
                    <div className="flex w-full items-center">
                      <Image src={e.PhotoUrl} className="w-12 h-12 max-h-12 max-w-12 mr-2 object-contain" key={"image" + i} alt={e.ProductName} />
                      <p className="text-sm text-gray-900 line-clamp-3 overflow-auto">{e.ProductName}</p>
                    </div>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Barkod No:</span>
                    <p className="text-black-700 text-sm">
                      {e.Barcode}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center flex items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Model No:</span>
                    <p className="text-black-700 text-sm">
                      {e.ModelNo}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Kategori</span>
                    <p className="text-black-700 text-sm">
                      {e.Category}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Stok Kodu</span>
                    <p className="text-black-700 text-sm">
                      {e.StockCode === "" ? "-" : e.StockCode}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Stok Miktarı</span>
                    <p className="text-black-700 text-sm">
                      {e.StockCount}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Piyasa Satış Fiyatı:</span>
                    <p className="text-sm">
                      {e.MarketPrice % 1 === 0 ?
                        <>{fraction.format(e.MarketPrice)} TL </>
                        :
                        <>{formatter.format(e.MarketPrice)} TL</>
                      }
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Satış Fiyatı:</span>
                    <p className="text-sm text-black-400 font-medium">
                      {e.SalePrice % 1 === 0 ?
                        <>{fraction.format(e.SalePrice)} TL </>
                        :
                        <>{formatter.format(e.SalePrice)} TL</>
                      }
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">BUYBOX:</span>
                    <p className="text-sm text-green-400 font-medium">
                      {e.BuyboxPrice % 1 === 0 ?
                        <>{fraction.format(e.BuyboxPrice)} TL </>
                        :
                        <>{formatter.format(e.BuyboxPrice)} TL</>
                      }
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex lg:block items-center">
                    <span className="p-sm-gray-700 lg:hidden mr-2">Satıcı</span>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-400 underline font-medium text-sm" onClick={() => history.push(`/satici-detay/${e.SellerId}`)}>{e.StoreName}</span>

                      <div className="ml-auto flex items-center divide-x">
                        {(campaignStatus === true && campaignEndDate > dateForCompare) &&
                          <div className="pr-3" >
                            <TrashIcon className="icon-sm text-gray-900" onClick={() => showDeleteAdvertModal(e.CampaignAdvertId)} />
                          </div>
                        }
                        <Link className="pl-3" to={`/urun-ilan-detay/${e.AdvertId}`}>
                          <ChevronRightIcon className="icon-md text-gray-700" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              }}
            />
          </>
        }
      </div>
    </div>
  )
}
