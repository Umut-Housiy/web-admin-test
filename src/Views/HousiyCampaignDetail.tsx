import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { Image } from "../Components/Image";
import { ChevronRightIcon, NewTabIcon, SquareCloseIcon, StarIcon, TrashIcon } from "../Components/Icons";
import { TabsTitle } from "../Components/TabsTitle";
import { CampaignCategoryModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Label } from "../Components/Label";
import { DateView } from "../Components/DateView";
import { currentDateStampForCompare, formatter, fraction } from "../Services/Functions";
import { Table } from "../Components/Table";
import { useStateEffect } from "../Components/UseStateEffect";
import { SITE_URLS } from "../Services/Constants";

interface RouteParams {
  id: string
}

interface LocationModel {
  queryPage: number,
}

export const HousiyCampaignDetail: FunctionComponent = () => {

  const dateForCompare = currentDateStampForCompare();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const tabsLink = [
    { id: 1, name: "Kampanya Bilgisi" },
    { id: 2, name: "Kampanya Ürünleri" },
    { id: 3, name: "Katılım Başvuruları" },
    { id: 4, name: "Kampanyaya Katılan Satıcılar" },
  ];

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  // <---- TABS-1--CAMPAIGN-DETAIL------START------->

  const [photoUrl, setPhotoUrl] = useState<string>("");

  const [campaignType, setCampaignType] = useState<number>(0);

  const [campaignStartDate, setCampaignStartDate] = useState<number>(0);

  const [campaignEndDate, setCampaignEndDate] = useState<number>(0);

  const [lastJoinDateJSTime, setLastJoinDateJSTime] = useState<number>(0);

  const [campaignName, setCampaignName] = useState<string>("");

  const [campaignDescriptipn, setCampaignDescriptipn] = useState<string>("");

  const [campaignSeoUrl, setCampaignSeoUrl] = useState<string>("");

  const [campaignStatus, setCampaignStatus] = useState<boolean>(false);

  const [commissionDiscount, setCommissionDiscount] = useState<number>(0);

  const [requiredDiscount, setRequiredDiscount] = useState<number>(0);

  const [sellerAdvertLimit, setSellerAdvertLimit] = useState<number>(0);

  const [requiredStockAmount, setRequiredStockAmount] = useState<number>(0);

  const [mustPayStockAmount, setMustPayStockAmount] = useState<number>(0);

  const [sameBasketReuseCount, setSameBasketReuseCount] = useState<number>(0);

  const [campaignCategories, setCampaignCategories] = useState<CampaignCategoryModel[]>([]);

  const [joinInfo, setJoinInfo] = useState<string>("");

  const [terminateCampaignLoading, setTerminateCampaignLoading] = useState<boolean>(false);

  const [campaignJoinRequestAdvertIdList, setCampaignJoinRequestAdvertIdList] = useState<number[]>([]);

  const handleAddRemoveCampaignJoinRequestAdvertIdList = (campaignJoinRequestAdvertId: number) => {
    if (campaignJoinRequestAdvertIdList.includes(campaignJoinRequestAdvertId)) {
      let tempList: number[] = campaignJoinRequestAdvertIdList.filter(x => x !== campaignJoinRequestAdvertId);
      setCampaignJoinRequestAdvertIdList(JSON.parse(JSON.stringify(tempList)));
    }
    else {
      let tempList: number[] = campaignJoinRequestAdvertIdList;
      tempList.push(campaignJoinRequestAdvertId);
      setCampaignJoinRequestAdvertIdList(JSON.parse(JSON.stringify(tempList)));
    }
  }

  useEffect(() => {
    getCampaignDetailForAdmin();
  }, [])

  const getCampaignDetailForAdmin = async () => {
    setLoading(true);

    const _result = await ApiService.getCampaignDetailForAdmin(Number(params.id));

    if (_result.succeeded === true) {
      const d = _result.data;
      setPhotoUrl(d.PhotoUrl);
      setCampaignType(d.CampaignType); //kontrol edilecek veri
      setCampaignStartDate(d.StartDateJSTime);
      setCampaignEndDate(d.EndDateJSTime);
      setLastJoinDateJSTime(d.LastJoinDateJSTime);
      setCampaignName(d.CampaignName);
      setCampaignDescriptipn(d.Description);
      setCampaignSeoUrl(d.SeoUrl);
      setCampaignStatus(d.Status);
      setCommissionDiscount(d.CommissionDiscount);
      //eğer indirim kampanyasıysa
      setRequiredDiscount(d.RequiredDiscount);
      //eğer x al y öde kampanyasıysa
      setRequiredStockAmount(d.RequiredStockAmount);
      setMustPayStockAmount(d.MustPayStockAmount);
      setSameBasketReuseCount(d.SameBasketReuseCount);
      //--//
      setSellerAdvertLimit(d.SellerAdvertLimit);
      setCampaignCategories(d.Categories);
      setJoinInfo(d.JoinInfo)
      setLoading(false);
    }
    else {
      setLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/housiy-kampanya-listesi') }
      });
    }
  }

  const showQuestionModalForTerminate = async () => {
    context.showModal({
      type: "Question",
      title: "Kampanyaya sonlandırılsın mı?",
      message: "Sonlandırılan kampanyaların durumu pasife alınacak ve değişiklik yapılamayacaktır. Bu işlem geri alınamaz",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await terminateCampaignForAdmin(); return true; }
    });
  }

  const terminateCampaignForAdmin = async () => {
    setTerminateCampaignLoading(true);

    const _result = await ApiService.terminateCampaignForAdmin(Number(params.id ?? "0"));

    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kampanya Sonlandırıldı",
        onClose: () => {
          context.hideModal();
          setTerminateCampaignLoading(false);
          history.push("/housiy-kampanya-listesi");
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          setTerminateCampaignLoading(false);
        }
      });
    }
  }
  // <---- TABS-1--CAMPAIGN-DETAIL------END------->

  // <---- TABS-2--ADVERT-LIST------START------->
  const tableAdvertList = useRef<any>();


  const getCampaignAdvertListForAdmin = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getCampaignAdvertListForAdmin(Number(params.id), page, take, searchText, order);

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
        onClose: () => { context.hideModal(); setSelectedTabsId(1); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const showDeleteAdvertModal = async (CampaignAdvertId: number) => {
    context.showModal({
      type: "Question",
      title: "Bu ürünü kampanyadan silmek istiyor musunuz?",
      message: "Onayladığınız takdirde ürün kampanyadan silinecektir. Bu işlemi geri alamazsınız",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await excludeAdvertFromCampaignForAdmin(CampaignAdvertId); return true; }
    });
  }

  const excludeAdvertFromCampaignForAdmin = async (CampaignAdvertId: number) => {

    const _result = await ApiService.excludeAdvertFromCampaignForAdmin(CampaignAdvertId);

    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ürün Kaldırıldı",
        onClose: () => {
          context.hideModal();
          tableAdvertList.current?.reload();
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

  // <---- TABS-2--ADVERT-LIST------END------->

  // <---- TABS-3--REQUEST LIST OF SELLERS------START------->
  const tableRequestListOfSellers = useRef<any>();

  const tableAdvertListForRequestListOfSellers = useRef<any>();

  const [selectedRequestId, setSelectedRequestId] = useState<number>(0);

  const [selectedRequestedSellerId, setSelectedRequestedSellerId] = useState<number>(0);

  const getRequestListOfSellersToJoinHousiyCampaign = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getRequestListOfSellersToJoinHousiyCampaign(Number(params.id), page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: selectedRequestId === 0 ? _result.data.Data : _result.data.Data.filter(i => i.RequestId === selectedRequestId),
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setSelectedTabsId(1); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const getAdvertListForRequestListOfSellersToJoinHousiyCampaign = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getAdvertListForRequestListOfSellersToJoinHousiyCampaign(selectedRequestId, page, take, searchText, order, selectedRequestedSellerId);

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
        onClose: () => { context.hideModal(); setSelectedTabsId(1); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  //#region ApproveAdvert
  const showApproveAdvertModal = async (CampaignJoinRequestAdvertId: number) => {
    context.showModal({
      type: "Question",
      title: "Bu ürünü onaylamak istiyor musunuz?",
      message: "Onayladığınız takdirde ürün kampanyaya eklenecektir",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await approveAdvertFromSellerRequestList(CampaignJoinRequestAdvertId); return true; }
    });
  }

  const approveAdvertFromSellerRequestList = async (CampaignJoinRequestAdvertId: number) => {

    const _result = await ApiService.approveAdvertFromSellerRequestList([CampaignJoinRequestAdvertId]);

    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ürün başarıyla onaylandı",
        onClose: () => {
          context.hideModal();
          tableAdvertListForRequestListOfSellers.current?.reload();
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

  const showMultiApproveAdvertModal = async () => {
    context.showModal({
      type: "Question",
      title: "Seçili ürünleri onaylamak istiyor musunuz?",
      message: "Onayladığınız takdirde seçili ürünler kampanyaya eklenecektir",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await approveMultiAdvertFromSellerRequestList(); return true; }
    });
  }

  const approveMultiAdvertFromSellerRequestList = async () => {

    const _result = await ApiService.approveAdvertFromSellerRequestList(campaignJoinRequestAdvertIdList);

    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ürünler başarıyla onaylandı.",
        onClose: () => {
          context.hideModal();
          setCampaignJoinRequestAdvertIdList(JSON.parse(JSON.stringify([])));
          tableAdvertListForRequestListOfSellers.current?.reload();
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
  //#endregion

  //#region RejectAdverts
  const showRejectAdvertModal = async (CampaignJoinRequestAdvertId: number) => {
    context.showModal({
      type: "Question",
      title: "Bu ürünü reddetmek istiyor musunuz?",
      message: "Onayladığınız takdirde ürün reddedilecek",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await rejectAdvertFromSellerRequestList(CampaignJoinRequestAdvertId); return true; }
    });
  }

  const rejectAdvertFromSellerRequestList = async (CampaignJoinRequestAdvertId: number) => {

    const _result = await ApiService.rejectAdvertFromSellerRequestList([CampaignJoinRequestAdvertId]);

    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ürün başarıyla reddedildi",
        onClose: () => {
          context.hideModal();
          tableAdvertListForRequestListOfSellers.current?.reload();
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

  const showMultiRejectAdvertModal = async () => {
    context.showModal({
      type: "Question",
      title: "Seçili ürünleri reddetmek istiyor musunuz?",
      message: "Onayladığınız takdirde seçili ürünler reddedilecek",
      onClose: () => { context.hideModal(); },
      onClick: async () => { await rejectMultiAdvertFromSellerRequestList(); return true; }
    });
  }

  const rejectMultiAdvertFromSellerRequestList = async () => {

    const _result = await ApiService.rejectAdvertFromSellerRequestList(campaignJoinRequestAdvertIdList);

    context.hideModal();

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Ürünler başarıyla reddedildi",
        onClose: () => {
          context.hideModal();
          setCampaignJoinRequestAdvertIdList(JSON.parse(JSON.stringify([])));
          tableAdvertListForRequestListOfSellers.current?.reload();
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
  //#endregion


  // <---- TABS-3--LIST OF SELLER REQUEST WHO WANT TO JOIN ------END------->

  // <---- TABS-4--JOINED SELLER LIST ------START------->

  const tableJoinedSellerList = useRef<any>();

  const tableAdvertLisOfJoinedSellerList = useRef<any>();

  const [selectedJoinedSellerId, setSelectedJoinedSellerId] = useState<number>(0)

  const getJoinedSellerListToHouisyCampaign = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getJoinedSellerListToHouisyCampaign(Number(params.id), page, take, searchText, order);

    if (_result.succeeded === true) {
      return {
        Data: selectedJoinedSellerId > 0 ? _result.data.Data.filter(i => i.SellerId === selectedJoinedSellerId) : _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setSelectedTabsId(1); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const getAdvertListOfJoinedSellerToHousiyCampaign = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getAdvertListOfJoinedSellerToHousiyCampaign(Number(params.id), selectedJoinedSellerId, page, take, searchText, order);

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
        onClose: () => { context.hideModal(); setSelectedTabsId(1); }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  // <---- TABS-4--JOINED SELLER LIST ------END------->

  useStateEffect(() => {
    if (selectedTabsId === 2) {
      tableAdvertList.current?.reload();
    }
    else if (selectedTabsId === 3) {
      tableRequestListOfSellers.current?.reload();
    }
    else if (selectedTabsId === 4) {
      tableJoinedSellerList.current?.reload();
    }
  }, [selectedRequestId, selectedJoinedSellerId]);

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/housiy-kampanya-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/housiy-kampanya-listesi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Housiy Kampanya Listesi
          </div>
        </Link>
        <div className="flex align-items-center mb-5 justify-between">
          <h2>Kampanya Detayı</h2>
          {(campaignStatus === true && campaignEndDate > dateForCompare) &&
            <Button buttonMd text="Kampanyayı Sonlandır" hasIcon icon={<SquareCloseIcon className="icon-sm mr-2" />} design="button-gray-100 mr-2 w-48" onClick={() => showQuestionModalForTerminate()} />
          }
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id); }} />
        {selectedTabsId === 1 ?
          <div className="grid lg:grid-cols-2 gap-4 my-4">
            <div className="lg:col-span-1">
              <h4 className="mb-4">Kampanya Bilgileri</h4>
              {loading ?
                <></>
                :
                <Image src={photoUrl} alt={campaignName} className="h-20 w-32 object-contain" />
              }
              <Label loading={loading} className="mt-4" title="Kampanya Türü" desc={campaignType === 4 ? "İndirim Kampanyası" : "X Al Y Öde Kampanyası"} />
              <Label loading={loading} className="mt-4" descClassName="text-sm" title="Kampanya Başlangıç Tarihi" desc={<DateView className="text-sm font-medium" dateNumber={campaignStartDate} pattern="dd/MM/yyyy" />} />
              <Label loading={loading} className="mt-4" descClassName="text-sm" title="Kampanya Bitiş Tarihi" desc={<DateView className="text-sm font-medium" dateNumber={campaignEndDate} pattern="dd/MM/yyyy" />} />
              <Label loading={loading} className="mt-4" descClassName="text-sm" title="Son Ürün Ekleme Tarihi" desc={<DateView className="text-sm font-medium" dateNumber={lastJoinDateJSTime} pattern="dd/MM/yyyy" />} />
              <Label loading={loading} className="mt-4" title="Kampanya Başlığı" desc={campaignName} />
              <Label loading={loading} className="mt-4" title="Kampanya Açıklaması" desc={campaignDescriptipn} />
              <Label loading={loading} title="Yönlendirileceği Sayfa (URL)" desc={<div className="flex items-center">{campaignSeoUrl} <a className="pr-3" target="_blank" href={`${SITE_URLS.SITE_URL}/kampanya/${campaignSeoUrl ?? ""}`} ><NewTabIcon className="icon-sm inline-block ml-2" /></a></div>} descClassName="text-blue-400 text-sm underline font-medium" />
              <Label loading={loading} className="mt-4" title="Kampanya Durumu" desc={campaignStatus === true && campaignEndDate < dateForCompare ? "Tamamlandı " : (campaignStatus === true && campaignStartDate < dateForCompare && campaignEndDate > dateForCompare) ? "Yayında" : (campaignStatus === true && campaignStartDate > dateForCompare) ? "Yayına girmesi bekleniyor" : "Pasif"}
                descClassName={campaignStatus === true ? "text-blue-400 font-medium text-sm" : "text-gray-700 font-medium text-sm"} />
            </div>
            <div className="lg:col-span-1">
              <h4 className="mb-4">Kampanya Koşulları</h4>
              <Label loading={loading} className="mt-4" descBold descClassName="text-sm text-red-400" character="%" title="Uygulanacak Komisyon İndirimi" desc={commissionDiscount} />
              {campaignType === 4 ?
                <Label loading={loading} className="mt-4" descBold descClassName="text-sm text-red-400" character="%" title="Sabit Fiyatta Zorunlu İndirim" desc={requiredDiscount} />
                :
                <>
                  <Label loading={loading} className="mt-4" title="Satın Alınması Gereken Ürün Adedi" desc={requiredStockAmount} />
                  <Label loading={loading} className="mt-4" title="Müşterinin Ödeyeceği Ürün Adedi" desc={mustPayStockAmount} />
                  <Label loading={loading} className="mt-4" title="Sipariş Limiti" desc={sameBasketReuseCount} />
                </>
              }
              <Label loading={loading} className="mt-4" title="Satıcı Başına Ürün Kotası" desc={sellerAdvertLimit} />
              <Label loading={loading} className="mt-4" title="Kategori Seçimi" desc={
                campaignCategories.length && campaignCategories.length > 0 ?
                  <div className="flex flex-wrap gap-2 items-center">
                    {
                      campaignCategories.map((item) => (
                        <span className="text-sm text-gray-900 bg-gray-100 py-2 px-3 rounded-full">{item.CategoryName}</span>
                      ))
                    }
                  </div>
                  :
                  <></>
              } />
            </div>
            <div className="lg:col-span-2">
              <h4 className="my-4">Detaylı Katılım Koşulları</h4>
              <p className="text-sm font-medium text-gray-700 mb-4">
                Katılım Koşul Bilgilendirmesi
              </p>
              <p className="p-3 border rounded-lg max-h-40 overflow-auto custom-scrollbar ck-editor-links" dangerouslySetInnerHTML={{ __html: joinInfo }} >
              </p>
            </div>
          </div>
          : selectedTabsId === 2 ?
            <>
              <Table
                ref={tableAdvertList}
                key={"tableAdvertList"}
                emptyListText={"Ürün Bulunamadı"}
                getDataFunction={getCampaignAdvertListForAdmin}
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
                        <p className="text-sm text-gray-900 ml-1 line-clamp-3 overflow-auto">{e.ProductName}</p>
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
                        {e.StockCode}
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
                          <div className="pr-3" >
                            <TrashIcon className="cursor-pointer icon-sm text-gray-900" onClick={() => showDeleteAdvertModal(e.CampaignAdvertId)} />
                          </div>
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
            : selectedTabsId === 3 ?
              <>
                <Table
                  ref={tableRequestListOfSellers}
                  key={"tableRequestListOfSellers"}
                  emptyListText={"Başvuru Bulunamadı"}
                  getDataFunction={getRequestListOfSellersToJoinHousiyCampaign}
                  header={<div className="lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                    <div className="lg:col-span-3">
                      <span className="p-sm-gray-400 flex items-center">
                        {selectedRequestId > 0 && <ChevronRightIcon className="transform -rotate-180 cursor-pointer icon-md mr-2" onClick={() => setSelectedRequestId(0)} />}
                        Mağaza Adı
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Mağaza Puanı
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Başvuru Tarihi
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Seçili Ürün Sayısı
                      </span>
                    </div>
                    <div className="lg:col-span-3">
                      <span className="p-sm-gray-400">
                        Onay Bekleyen Ürün Sayısı
                      </span>
                    </div>
                  </div>}
                  renderItem={(e, i) => {
                    return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-2 lg:py-0">
                      <div className="lg:col-span-3 flex lg:block items-center">
                        <span className="p-sm-gray-700 lg:hidden mr-2">Mağaza Adı: </span>
                        <p className="text-black-700 text-sm">
                          {e.StoreName}
                        </p>
                      </div>
                      <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                        <span className="p-sm-gray-700 lg:hidden mr-2">Mağaza Puanı: </span>
                        <div className="text-yellow-600 text-sm font-semibold items-center flex">
                          <StarIcon className="icon-sm mr-2" />
                          {e.StoreRate}
                        </div>
                      </div>
                      <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                        <span className="p-sm-gray-700 lg:hidden mr-2">Başvuru Tarihi: </span>
                        <DateView className="text-sm font-medium" dateNumber={e.RequestCrateDateJSTime} pattern="dd/MM/yyyy" />
                      </div>
                      <div className="lg:col-span-2 flex lg:block items-center">
                        <span className="p-sm-gray-700 lg:hidden mr-2">Seçili Ürün Sayısı: </span>
                        <p className="text-black-700 text-sm">
                          {e.SelectedAdvertCount}
                        </p>
                      </div>
                      <div className="lg:col-span-3 flex lg:block items-center">
                        <span className="p-sm-gray-700 lg:hidden mr-2">Onay Bekleyen Ürün Sayısı: </span>
                        <div className="flex items-center justify-between">
                          <p className="text-black-700 text-sm">
                            {e.SelectedAdvertCount - e.ApprovedAdvertCount}
                          </p>
                          {selectedRequestId === 0 &&
                            <ChevronRightIcon onClick={() => { setSelectedRequestId(e.RequestId); setSelectedRequestedSellerId(e.SellerId) }} className="icon-md cursor-pointer text-gray-700" />
                          }
                        </div>
                      </div>
                    </div>
                  }}
                  noTopPart={selectedRequestId > 0 ? true : false}
                />
                {selectedRequestId > 0 &&
                  <>
                    {
                      campaignJoinRequestAdvertIdList.length > 0 &&
                      <>
                        <div className="flex items-center justify-between bg-gray-100 p-4">
                          <div className="flex items-center gap-2">
                            <input type="checkbox"
                              className="form-checkbox text-blue-400 border border-gray-400 cursor-pointer mr-2"
                              onChange={(e) => { }}
                              onClick={() => { setCampaignJoinRequestAdvertIdList(JSON.parse(JSON.stringify([]))) }}
                              checked={campaignJoinRequestAdvertIdList.length > 0}
                            />
                            <div className="text-sm font-medium text-gray-900">{"Toplam " + campaignJoinRequestAdvertIdList.length + " ürün"}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button buttonMd design="button-blue-400" text="Seçili Ürünleri Onayla" onClick={() => { showMultiApproveAdvertModal(); }} />
                            <Button buttonMd design="button-gray-100" text="Seçili Ürünleri Reddet" onClick={() => { showMultiRejectAdvertModal(); }} />
                          </div>
                        </div>
                      </>
                    }
                    <Table
                      ref={tableAdvertListForRequestListOfSellers}
                      key={"tableAdvertListForRequestListOfSellers"}
                      emptyListText={"Ürün Bulunamadı"}
                      hasOverflowClass
                      getDataFunction={getAdvertListForRequestListOfSellersToJoinHousiyCampaign}
                      header={<div className=" w-screen px-2 border-b border-t py-5 border-gray-200 gap-4 lg:flex hidden items-center">
                        <div className="lg:w-2col w-full ">
                          <span className="p-sm-gray-400">
                            Ürün Adı
                          </span>
                        </div>
                        <div className="lg:w-1col w-full">
                          <span className="p-sm-gray-400">
                            Barkod No
                          </span>
                        </div>
                        <div className="lg:w-1col w-full">
                          <span className="p-sm-gray-400">
                            Model No
                          </span>
                        </div>
                        <div className="lg:w-1col w-full">
                          <span className="p-sm-gray-400">
                            Kategori
                          </span>
                        </div>
                        <div className="lg:w-1col w-full">
                          <span className="p-sm-gray-400">
                            Stok Kodu
                          </span>
                        </div>
                        <div className="lg:w-1col w-full">
                          <span className="p-sm-gray-400">
                            Stok Miktarı
                          </span>
                        </div>
                        <div className="lg:w-1col w-full">
                          <span className="p-sm-gray-400">
                            Piyasa Satış Fiyatı
                          </span>
                        </div>
                        <div className="lg:w-1col w-full">
                          <span className="p-sm-gray-400">
                            Satış Fiyatı
                          </span>
                        </div>
                        <div className="lg:w-1col w-full">
                          <span className="p-sm-gray-400">
                            Kampanya Fiyatı
                          </span>
                        </div>
                        <div className="lg:w-1col w-full">
                          <span className="p-sm-gray-400">
                            BUYBOX
                          </span>
                        </div>
                        <div className="lg:w-2col w-full">
                          <span className="p-sm-gray-400 text-center block">
                            İşlemler
                          </span>
                        </div>
                      </div>}
                      renderItem={(e, i) => {
                        return <div key={"list" + i} className={`${campaignJoinRequestAdvertIdList.includes(e.CampaignJoinRequestAdvertId) ? "bg-blue-100" : ""} flex flex-col lg:flex-row lg:w-screen px-2 border-b lg:h-20 border-gray-200 gap-4 items-center py-3 lg:py-0`}>
                          <div className="lg:w-2col w-full flex lg:block items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Adı:</span>
                            <div className="flex w-full items-center">
                              <input type="checkbox"
                                className="form-checkbox text-blue-400 border border-gray-400 cursor-pointer mr-2"
                                onChange={(e) => { }}
                                onClick={() => { handleAddRemoveCampaignJoinRequestAdvertIdList(e.CampaignJoinRequestAdvertId); }}
                                checked={campaignJoinRequestAdvertIdList.includes(e.CampaignJoinRequestAdvertId)}
                              />
                              <Image src={e.PhotoUrl} className="w-12 h-12 max-h-12 max-w-12 mr-2 object-contain" key={"image" + i} alt={e.ProductName} />
                              <p className="text-sm text-gray-900 ml-1 line-clamp-3 overflow-auto">{e.ProductName}</p>
                            </div>
                          </div>
                          <div className="lg:w-1col w-full lg:block items-center flex items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">Barkod No:</span>
                            <p className="text-black-700 text-sm">
                              {e.Barcode}
                            </p>
                          </div>
                          <div className="lg:w-1col w-full  flex lg:block items-center flex items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">Model No:</span>
                            <p className="text-black-700 text-sm">
                              {e.ModelNo}
                            </p>
                          </div>
                          <div className="lg:w-1col w-full  flex lg:block items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">Kategori</span>
                            <p className="text-black-700 text-sm">
                              {e.Category}
                            </p>
                          </div>
                          <div className="lg:w-1col w-full  flex lg:block items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">Stok Kodu</span>
                            <p className="text-black-700 text-sm">
                              {e.StockCode}
                            </p>
                          </div>
                          <div className="lg:w-1col w-full  flex lg:block items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">Stok Miktarı</span>
                            <p className="text-black-700 text-sm">
                              {e.StockCount}
                            </p>
                          </div>
                          <div className="lg:w-1col w-full  flex lg:block items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">Piyasa Satış Fiyatı:</span>
                            <p className="text-sm">
                              {e.MarketPrice % 1 === 0 ?
                                <>{fraction.format(e.MarketPrice)} TL </>
                                :
                                <>{formatter.format(e.MarketPrice)} TL</>
                              }
                            </p>
                          </div>
                          <div className="lg:w-1col w-full  flex lg:block items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">Satış Fiyatı:</span>
                            <p className="text-sm text-black-400">
                              {e.SalePrice % 1 === 0 ?
                                <>{fraction.format(e.SalePrice)} TL </>
                                :
                                <>{formatter.format(e.SalePrice)} TL</>
                              }
                            </p>
                          </div>
                          <div className="lg:w-1col w-full  flex lg:block items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">Kampanya Fiyatı:</span>
                            <p className="text-sm text-black-400 font-medium">
                              {(e.SalePrice * ((100 - e.DiscountRate) / 100)) % 1 === 0 ?
                                <>{fraction.format(e.SalePrice * ((100 - e.DiscountRate) / 100))} TL </>
                                :
                                <>{formatter.format(e.SalePrice * ((100 - e.DiscountRate) / 100))} TL</>
                              }
                            </p>
                          </div>
                          <div className="lg:w-1col w-full  flex lg:block items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">BUYBOX:</span>
                            <p className="text-sm text-green-400 font-medium">
                              {e.BuyboxPrice % 1 === 0 ?
                                <>{fraction.format(e.BuyboxPrice)} TL </>
                                :
                                <>{formatter.format(e.BuyboxPrice)} TL</>
                              }
                            </p>
                          </div>
                          <div className="lg:w-2col w-full  flex lg:block items-center">
                            <span className="p-sm-gray-700 lg:hidden mr-2">İşlemler</span>
                            <div className="flex items-center gap-2">
                              {
                                campaignJoinRequestAdvertIdList.length === 0 &&
                                <>
                                  <Button buttonMd design="button-blue-400 w-2/5" text="Onayla" onClick={() => showApproveAdvertModal(e.CampaignJoinRequestAdvertId)} />
                                  <Button buttonMd design="button-gray-100 w-2/5" text="Reddet" onClick={() => showRejectAdvertModal(e.CampaignJoinRequestAdvertId)} />
                                </>
                              }
                              <ChevronRightIcon className="icon-md cursor-pointer text-gray-700 ml-auto" onClick={() => { history.push("/urun-ilan-detay/" + e.AdvertId) }} />
                            </div>
                          </div>
                        </div>
                      }}
                    />
                  </>
                }
              </>
              : selectedTabsId === 4 &&
              <>
                <Table
                  noTopPart={selectedJoinedSellerId > 0 ? true : false}
                  ref={tableJoinedSellerList}
                  key={"tableJoinedSellerList"}
                  emptyListText={"Satıcı Bulunamadı"}
                  getDataFunction={getJoinedSellerListToHouisyCampaign}
                  header={<div className="lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                    <div className="lg:col-span-3">
                      <span className="p-sm-gray-400 flex items-center">
                        {selectedJoinedSellerId > 0 && <ChevronRightIcon className="transform -rotate-180 cursor-pointer icon-md mr-2" onClick={() => setSelectedJoinedSellerId(0)} />}
                        Mağaza Adı
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Mağaza Puanı
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Başvuru Tarihi
                      </span>
                    </div>
                    <div className="lg:col-span-2">
                      <span className="p-sm-gray-400">
                        Seçili Ürün Sayısı
                      </span>
                    </div>
                    <div className="lg:col-span-3">
                      <span className="p-sm-gray-400">
                        Onaylı Ürün Sayısı
                      </span>
                    </div>
                  </div>}
                  renderItem={(e, i) => {
                    return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-2 lg:py-0">
                      <div className="lg:col-span-3 flex lg:block items-center">
                        <span className="p-sm-gray-700 lg:hidden mr-2">Mağaza Adı: </span>
                        <p className="text-black-700 text-sm">
                          {e.StoreName}
                        </p>
                      </div>
                      <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                        <span className="p-sm-gray-700 lg:hidden mr-2">Mağaza Puanı: </span>
                        <div className="text-yellow-600 text-sm font-semibold items-center flex">
                          <StarIcon className="icon-sm mr-2" />
                          {e.StoreRate}
                        </div>
                      </div>
                      <div className="lg:col-span-2 flex lg:block items-center flex items-center">
                        <span className="p-sm-gray-700 lg:hidden mr-2">Başvuru Tarihi: </span>
                        <DateView className="text-sm font-medium" dateNumber={e.RequestCrateDateJSTime} pattern="dd/MM/yyyy" />
                      </div>
                      <div className="lg:col-span-2 flex lg:block items-center">
                        <span className="p-sm-gray-700 lg:hidden mr-2">Seçili Ürün Sayısı: </span>
                        <p className="text-black-700 text-sm">
                          {e.SelectedAdvertCount}
                        </p>
                      </div>
                      <div className="lg:col-span-3 flex lg:block items-center">
                        <span className="p-sm-gray-700 lg:hidden mr-2">Onaylı Ürün Sayısı: </span>
                        <div className="flex items-center justify-between">
                          <p className="text-black-700 text-sm">
                            {e.ApprovedAdvertCount}
                          </p>
                          {selectedJoinedSellerId === 0 &&
                            <ChevronRightIcon className="cursor-pointer icon-md text-gray-700" onClick={() => setSelectedJoinedSellerId(e.SellerId)} />
                          }
                        </div>
                      </div>
                    </div>
                  }}
                />
                {selectedJoinedSellerId > 0 &&
                  <Table
                    ref={tableAdvertLisOfJoinedSellerList}
                    key={"tableAdvertLisOfJoinedSellerList"}
                    emptyListText={"Ürün Bulunamadı"}
                    hasOverflowClass
                    getDataFunction={getAdvertListOfJoinedSellerToHousiyCampaign}
                    header={<div className=" w-screen px-2 border-b border-t py-5 border-gray-200 gap-4 lg:flex hidden items-center">
                      <div className="lg:w-2col w-full ">
                        <span className="p-sm-gray-400">
                          Ürün Adı
                        </span>
                      </div>
                      <div className="lg:w-1col w-full">
                        <span className="p-sm-gray-400">
                          Barkod No
                        </span>
                      </div>
                      <div className="lg:w-1col w-full">
                        <span className="p-sm-gray-400">
                          Model No
                        </span>
                      </div>
                      <div className="lg:w-1col w-full">
                        <span className="p-sm-gray-400">
                          Kategori
                        </span>
                      </div>
                      <div className="lg:w-1col w-full">
                        <span className="p-sm-gray-400">
                          Stok Kodu
                        </span>
                      </div>
                      <div className="lg:w-1col w-full">
                        <span className="p-sm-gray-400">
                          Stok Miktarı
                        </span>
                      </div>
                      <div className="lg:w-1col w-full">
                        <span className="p-sm-gray-400">
                          Piyasa Satış Fiyatı
                        </span>
                      </div>
                      <div className="lg:w-1col w-full">
                        <span className="p-sm-gray-400">
                          Satış Fiyatı
                        </span>
                      </div>
                      <div className="lg:w-1col w-full">
                        <span className="p-sm-gray-400">
                          Kampanya Fiyatı
                        </span>
                      </div>
                      <div className="lg:w-1col w-full">
                        <span className="p-sm-gray-400">
                          BUYBOX
                        </span>
                      </div>
                      <div className="lg:w-2col w-full">
                        <span className="p-sm-gray-400 text-center block">
                          İşlemler
                        </span>
                      </div>
                    </div>}
                    renderItem={(e, i) => {
                      return <div key={"list" + i} className="flex flex-col lg:flex-row lg:w-screen px-2 border-b lg:h-20 border-gray-200 gap-4 items-center py-3 lg:py-0">
                        <div className="lg:w-2col w-full flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Ürün Adı:</span>
                          <div className="flex w-full items-center">
                            <Image src={e.PhotoUrl} className="w-12 h-12 max-h-12 max-w-12 mr-2 object-contain" key={"image" + i} alt={e.ProductName} />
                            <p className="text-sm text-gray-900 ml-1 line-clamp-3 overflow-auto">{e.ProductName}</p>
                          </div>
                        </div>
                        <div className="lg:w-1col w-full lg:block items-center flex items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Barkod No:</span>
                          <p className="text-black-700 text-sm">
                            {e.Barcode}
                          </p>
                        </div>
                        <div className="lg:w-1col w-full  flex lg:block items-center flex items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Model No:</span>
                          <p className="text-black-700 text-sm">
                            {e.ModelNo}
                          </p>
                        </div>
                        <div className="lg:w-1col w-full  flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Kategori</span>
                          <p className="text-black-700 text-sm">
                            {e.Category}
                          </p>
                        </div>
                        <div className="lg:w-1col w-full  flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Stok Kodu</span>
                          <p className="text-black-700 text-sm">
                            {e.StockCode}
                          </p>
                        </div>
                        <div className="lg:w-1col w-full  flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Stok Miktarı</span>
                          <p className="text-black-700 text-sm">
                            {e.StockCount}
                          </p>
                        </div>
                        <div className="lg:w-1col w-full  flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Piyasa Satış Fiyatı:</span>
                          <p className="text-sm">
                            {e.MarketPrice % 1 === 0 ?
                              <>{fraction.format(e.MarketPrice)} TL </>
                              :
                              <>{formatter.format(e.MarketPrice)} TL</>
                            }
                          </p>
                        </div>
                        <div className="lg:w-1col w-full  flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Satış Fiyatı:</span>
                          <p className="text-sm text-black-400">
                            {e.SalePrice % 1 === 0 ?
                              <>{fraction.format(e.SalePrice)} TL </>
                              :
                              <>{formatter.format(e.SalePrice)} TL</>
                            }
                          </p>
                        </div>
                        <div className="lg:w-1col w-full  flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">Kampanya Fiyatı:</span>
                          <p className="text-sm text-black-400 font-medium">
                            {(e.SalePrice * ((100 - e.DiscountRate) / 100)) % 1 === 0 ?
                              <>{fraction.format(e.SalePrice * ((100 - e.DiscountRate) / 100))} TL </>
                              :
                              <>{formatter.format(e.SalePrice * ((100 - e.DiscountRate) / 100))} TL</>
                            }
                          </p>
                        </div>
                        <div className="lg:w-1col w-full  flex lg:block items-center">
                          <span className="p-sm-gray-700 lg:hidden mr-2">BUYBOX:</span>
                          <p className="text-sm text-green-400 font-medium">
                            {e.BuyboxPrice % 1 === 0 ?
                              <>{fraction.format(e.BuyboxPrice)} TL </>
                              :
                              <>{formatter.format(e.BuyboxPrice)} TL</>
                            }
                          </p>
                        </div>
                        <div className="lg:w-2col w-full flex lg:block items-center">
                          <div className="flex items-center">
                            <TrashIcon className="cursor-pointer icon-sm text-gray-900" onClick={() => showDeleteAdvertModal(e.CampaignAdvertId)} />
                            <ChevronRightIcon className="icon-md cursor-pointer text-gray-700 ml-auto" onClick={() => { history.push("/urun-ilan-detay/" + e.AdvertId) }} />
                          </div>
                        </div>
                      </div>
                    }}
                  />
                }
              </>
        }
      </div>
    </div>
  )
}
