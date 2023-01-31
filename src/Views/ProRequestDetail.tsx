import { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { ChevronRightIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { TabsTitle } from "../Components/TabsTitle";
import { MessageDataModel, OfferInstallmentModel, OfferMaterialModel, ProRequestModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { useStateEffect } from "../Components/UseStateEffect";
import { DateView } from "../Components/DateView";
import { CountDown } from "../Components/CountDown";
import { formatter, fraction } from "../Services/Functions";
import { EmptyList } from "../Components/EmptyList";
import { Loading } from "../Components/Loading";
import { MessageItem } from "../Components/MessageItem";
import { Button } from "../Components/Button";
import { SRLWrapper } from "simple-react-lightbox";

interface RouteParams {
  id: string,
}

interface LocationModel {
  queryPage: number,
}

export const ProRequestDetail: FunctionComponent = () => {

  const params = useParams<RouteParams>();

  const location = useLocation<LocationModel>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [answers, setAnswers] = useState<ProRequestModel[]>([]);

  const [requestLoading, setRequestLoading] = useState<boolean>(false);

  const [status, setStatus] = useState<number>(3);

  const [clientName, setClientName] = useState<string>("");

  const [clientPhoto, setClientPhoto] = useState<string>("");

  const [proPhoto, setProPhoto] = useState<string>("");

  const [categoryName, setCategoryName] = useState<string>("");

  const [remainingOfferDate, setRemainingOfferDate] = useState<number>(0);

  const [storeName, setStoreName] = useState<string>("");

  const [createdDate, setCreatedDate] = useState<string>("");

  const [offerId, setOfferId] = useState<number>(0);

  const [tabsLink, setTabLinks] = useState<{ id: number, name: string }[]>([
    {
      id: 1,
      name: "Talep Bilgileri",
    },
    {
      id: 3,
      name: "Mesajlar",
    },
  ]);

  const [selectedTabsId, setSelectedTabsId] = useState<number>(1);

  const [workId, setWorkId] = useState<number>(0);

  const handleGetProjectDay = (startDate, endDate) => {
    let diffInMilliSeconds = Math.abs(endDate - startDate) / 1000;

    const days = Math.floor(diffInMilliSeconds / 86400);
    return days + 1;
  }

  //#region  TABS-1 REQUEST INFORMATION ---START---
  const [requestRejectDate, setRequestRejectDate] = useState<string>("");

  const [requestRejectTitle, setRequestRejectTitle] = useState<string>("");

  const [requestRejectReason, setRequestRejectReason] = useState<string>("");

  const [proId, setProId] = useState<number>(0);

  const [dateOption, setDateOption] = useState<number>(0);

  const [requestedServiceDate, setRequestedServiceDate] = useState<string>("");

  const [requestCityName, setRequestCityName] = useState<string>("");

  const [requestDistrictName, setRequestDistrictName] = useState<string>("");

  useEffect(() => {
    getRequestDetail()
  }, [])

  const getRequestDetail = async () => {
    setRequestLoading(true);

    const _result = await ApiService.getRequestDetail(Number(params.id));

    if (_result.succeeded === true) {
      let x = _result.data
      setWorkId(x.WorkId);
      setAnswers(x.Answers);
      setStatus(x.Statue);
      setProId(x.ProId);
      setClientName(x.ClientName);
      setClientPhoto(x.ClientPhoto);
      setDateOption(x.DateOption);
      setRequestedServiceDate(x.RequestedServiceDate);
      setProPhoto(x.ProPhoto);
      setCategoryName(x.CategoryName);
      setStoreName(x.StoreName);
      setCreatedDate(x.CreatedDate);
      setRequestRejectDate(x.RejectDate);
      setRequestRejectTitle(x.RejectTitle);
      setRequestRejectReason(x.RejectReason);
      setRemainingOfferDate(x.RemainingOfferDateJS);
      setRequestCityName(x.CityName);
      setRequestDistrictName(x.DistrictName);
      setOfferId(x.OfferId);
      if (x.OfferId > 0) {
        let tempList = tabsLink;
        tempList.push({ id: 2, name: "Teklif Bilgileri" });
        setTabLinks(JSON.parse(JSON.stringify(tempList)));
      }
      if (x.Statue === 2) {
        let tempList = tabsLink;
        tempList.push({ id: 4, name: "Talep Red Bilgileri" });
        setTabLinks(JSON.parse(JSON.stringify(tempList)));
      }
      if (x.Statue === 4) {
        let tempList = tabsLink;
        tempList.push({ id: 4, name: "Talep İptal Bilgileri" });
        setTabLinks(JSON.parse(JSON.stringify(tempList)));
      }

      setRequestLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setRequestLoading(false); history.push("/pro-talepler"); }
      });
    }
  }

  const renderRequestStatue = () => {
    if (status === 1 && remainingOfferDate < Date.now()) {
      return <div className="py-1 w-32 text-center rounded-full text-sm font-medium bg-gray-100 text-gray-900">
        Teklif Süresi Doldu
      </div>
    }
    else {
      return <div className={`${status === 1 ? "bg-yellow-100 text-yellow-600" : status === 3 ? "bg-green-100 text-green-400" : status === 2 ? "bg-gray-100 text-gray-900" : status === 4 && "bg-red-100 text-red-400"} py-1 w-32 text-center rounded-full text-sm font-medium`}>
        {status === 1 ? "Teklif Bekliyor" : status === 3 ? "Teklif Oluşturuldu" : status === 2 ? "Talep Reddedildi" : status === 4 && "Talep İptal Edildi"}
      </div>
    }
  }
  //#endregion

  //#region TABS-2 OFFER INFORMATION ---START---

  const [offerLoading, setOfferLoading] = useState<boolean>(false);

  const history = useHistory();

  const [offerStatus, setOfferStatus] = useState<number>(0); //onay bekleyen = 1, onaylanan = 2, reddedilen = 3

  const [proName, setProName] = useState<string>("");

  const [isQuickOffer, setIsQuickOffer] = useState<boolean>(false);

  const [selectedPaymentType, setSelectedPaymentType] = useState<number>(0); // pesin ödeme = 1, parçalı ödeme = 2,

  const [offerCreatedDate, setOfferCreatedDate] = useState<number>(0);

  const [offerJobStartDateJS, setOfferJobStartDateJS] = useState<number>(0);

  const [offerJobDueDateJS, setOfferJobDueDateJS] = useState<number>(0);

  const [projectDayCount, setProjectDayCount] = useState<number>(0);

  const [offerExpireDateJS, setOfferExpireDateJS] = useState<number>(0);

  const [materialList, setMaterialList] = useState<OfferMaterialModel[]>([]);

  const [offerDescription, setOfferDescription] = useState<string>("Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit dolorem, excepturi officia voluptas non temporibus nam ab");

  const [materialUnit, setMaterialUnit] = useState<{ key: string, value: string }[]>([
    { key: "1", value: "adet" },
    { key: "2", value: "m2" },
    { key: "3", value: "lt" },
    { key: "4", value: "kg" },
  ]);

  const [totalMaterialPriceWoVat, setTotalMaterialPriceWoVat] = useState<number>(0);

  const [laborCostWoVat, setLaborCostWoVat] = useState<number>(0);

  const [totalVat, setTotalVat] = useState<number>(0);

  const [totalPriceForProject, setTotalPriceForProject] = useState<number>(0);

  const [installmentCount, setInstallmentCount] = useState<number>(0);

  const [installmentList, setInstallmentList] = useState<OfferInstallmentModel[]>([]);

  const [offerRejectDate, setOfferRejectDate] = useState<string>("");

  const [offerRejectTitle, setOfferRejectTitle] = useState<string>("");

  const [offerRejectReason, setOfferRejectReason] = useState<string>("");

  useStateEffect(() => {
    if (offerId > 0) {
      getOfferDetail();
    }
  }, [offerId]);

  const getOfferDetail = async () => {
    setOfferLoading(true);

    const _result = await ApiService.getOfferDetail(offerId);

    if (_result.succeeded === true) {
      const d = _result.data;
      setOfferStatus(d.Status);
      setProName(d.StoreName);
      setIsQuickOffer(d.IsQuickOffer);
      setSelectedPaymentType(d.PaymentType);
      setOfferCreatedDate(d.CreatedDate);
      setOfferJobStartDateJS(d.JobStartDateJS);
      setOfferJobDueDateJS(d.JobDueDateJS);
      setProjectDayCount(d.ProjectDayCount);
      setOfferExpireDateJS(d.OfferExpireDateJS);
      setOfferDescription(d.Description);
      setMaterialList(JSON.parse(JSON.stringify(d.MaterialList)));
      calculateTotalPriceMaterialWoVat(d.MaterialList);
      let _laborCostWoVat: number = (d.TotalWorkmanshipPrice * ((100 - d.TaxRate) / 100));
      setLaborCostWoVat(_laborCostWoVat);
      calculateTotalVat(d.MaterialList, d.TotalWorkmanshipPrice);
      setInstallmentCount(d.InstallmentCount);
      setInstallmentList(d.InstallmentList);
      setOfferRejectDate(d.RejectDate);
      setOfferRejectTitle(d.RejectTitle);
      setOfferRejectReason(d.RejectReason);
      setTotalPriceForProject(d.TotalPrice);
      if (d.Status === 3) {
        let tempList = tabsLink;
        tempList.push({ id: 5, name: "Teklif Red Bilgileri" });
        setTabLinks(JSON.parse(JSON.stringify(tempList)));
      }
      setOfferLoading(false);
    }
    else {
      setOfferLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push('/pro-talepler') }
      });
    }
  }

  const renderOffderStatus = () => {
    if (offerStatus === 1 && offerExpireDateJS < Date.now()) {
      return <div className="py-1 w-32 text-center rounded-full text-sm font-medium bg-gray-100 text-gray-900">
        Teklif Süresi Doldu
      </div>
    }
    else {
      return <div className={`${offerStatus === 1 ? "bg-yellow-100 text-yellow-600" : offerStatus === 2 ? "bg-green-100 text-green-400" : status === 3 && "bg-gray-100 text-gray-900"} py-1 w-32 text-center rounded-full text-sm font-medium`}>
        {offerStatus === 1 ? "Onay Bekliyor" : offerStatus === 2 ? "Teklif Onaylandı" : offerStatus === 3 && "Teklif Reddedildi"}
      </div>
    }

  }

  const calculateTotalPriceMaterialWoVat = (materialList: OfferMaterialModel[]) => {
    let _totalPriceArrayWoVat: number[] = [];
    if (materialList && materialList.length && materialList.length > 0) {
      materialList.map((item) => (
        _totalPriceArrayWoVat.push(Number(item.TotalPrice) * ((100 - item.TaxRate) / 100))
      ));

      let sum = 0;
      for (let i = 0; i < _totalPriceArrayWoVat.length; i++) {
        sum += _totalPriceArrayWoVat[i];
      }
      setTotalMaterialPriceWoVat(sum);
    }
    else {
      setTotalMaterialPriceWoVat(0);
    }
  }

  const calculateTotalVat = (materialList, totalWorkmanshipPrice) => {
    let _totalVatArrayFromMaterialList: number[] = [];
    if (materialList) {
      materialList.map((item) => (
        _totalVatArrayFromMaterialList.push(Number(item.TotalPrice) - Number(item.TotalPrice) * ((100 - item.TaxRate) / 100))
      ));
    }

    let temp = 0;
    for (let i = 0; i < _totalVatArrayFromMaterialList.length; i++) {
      temp += _totalVatArrayFromMaterialList[i];
    }

    let _totalVat = temp + (totalWorkmanshipPrice - laborCostWoVat);

    setTotalVat(_totalVat);
  }

  //#endregion

  //#region  TABS-3 MESSAGES
  const scrollEl = useRef<any>();

  const scrollInnerEl = useRef<any>();

  const [messageList, setMessageList] = useState<MessageDataModel[]>([]);

  const [isContinue, setIsContinue] = useState<boolean>(false);

  const [oldestMessageDate, setOldestMessageDate] = useState<number>();

  const [messageLoading, setMessageLoading] = useState<boolean>(true);

  const [messageProcessLoading, setMessageProcessLoading] = useState<boolean>(false);

  useStateEffect(() => {
    getMessagesForAdmin();
    if (scrollEl.current && scrollInnerEl.current) {
      scrollEl.current.scrollTop = scrollInnerEl.current.clientHeight;
    }
  }, [workId]);

  const getMessagesForAdmin = async () => {

    const _result = await ApiService.getMessagesForAdmin(workId, oldestMessageDate);

    if (_result.succeeded === true) {

      let tempList: MessageDataModel[] = [];
      _result.data.Data.forEach((item) => {
        tempList.push(item);
      });
      messageList.forEach((item) => {
        tempList.push(item);
      });
      setMessageList(JSON.parse(JSON.stringify(tempList)));
      setIsContinue(_result.data.IsContinue);
      setOldestMessageDate(_result.data.OldestMessageDate);

      setMessageLoading(false);
      setMessageProcessLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); setMessageLoading(false); setMessageProcessLoading(false); }
      });
    }
  }
  //#endregion


  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/pro-talepler?sayfa=${location.state?.queryPage ?? 1}` : "/pro-talepler"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Talepler
          </div>
        </Link>
        <div className="flex align-items-center mb-5">
          <h2>Talep Detayı</h2>
        </div>
        <TabsTitle list={tabsLink} selectedTabsId={selectedTabsId} onItemSelected={item => { setSelectedTabsId(item.id) }} />
        {selectedTabsId === 1 ?
          <>
            <h4 className="my-4">Talep Bilgileri</h4>
            <div className="w-1/4">
              <Label loading={requestLoading || offerLoading} title="Talep Durumu" desc={renderRequestStatue()} />
              <Label loading={requestLoading} title="Müşteri Adı" desc={clientName} />
              <Label loading={requestLoading} title="Profesyonel Bilgisi" desc={<Link to={`/pro-profesyonel-detay/${proId}`} className="text-sm text-blue-400 underline font-medium">{storeName}</Link>} />
              <Label loading={requestLoading} title="İş Tanımı" desc={categoryName} />
              <Label loading={requestLoading} title="Talep Oluşturulma Tarihi" desc={createdDate} />
              {
                (status === 1) ?
                  <Label loading={requestLoading} title="Teklif İçin Kalan Süre" desc={<CountDown fullRemaingTime startDate={-1} endDate={remainingOfferDate} />} />
                  :
                  <></>
              }
            </div>
            <h4 className="my-4 border-t pt-4">Talep Bilgileri</h4>
            {
              requestLoading ?
                <>
                  <Loading width="w-full" height="h-20" />
                  <Loading width="w-full" height="h-20" />
                  <Loading width="w-full" height="h-20" />
                  <Loading width="w-full" height="h-20" />
                </>
                :
                <>
                  <div className="mb-4">
                    <p className="text-type-12-medium text-gray-700 mb-2">
                      Hizmet Alınacağı Konum
                    </p>
                    <p className="text-sm text-gray-900 mb-1">
                      {`${requestCityName}/${requestDistrictName}`}
                    </p>
                  </div>
                  <div className="mb-4">
                    <p className="text-type-12-medium text-gray-700 mb-2">
                      Hizmet Alınacak Tarih
                    </p>
                    <p className="text-sm text-gray-900 mb-1">
                      {dateOption === 1 ? requestedServiceDate : dateOption === 2 ? "İki ay içerisinde" : dateOption === 3 ? "Altı ay içerisinde" : dateOption === 4 ? "Sadece fiyat almak istiyorum" : ""}
                    </p>
                  </div>
                  {answers.map((item, index) => (
                    <div className="mb-4" key={"answers" + index}>
                      <p className="text-type-12-medium text-gray-700 mb-2">
                        {item.Question}
                      </p>
                      {item.DataType === 1 || item.DataType === 3 ?
                        <p className="text-sm text-gray-900 mb-1">
                          {item.Value}
                        </p>
                        : item.DataType === 2 ?
                          JSON.parse(item.Value).map((item2, index2) => (
                            <p className="text-sm text-gray-900 mb-1" key={"dataType2" + index2}>
                              {item2}
                            </p>
                          ))
                          : item.DataType == 4 ?
                            <SRLWrapper>
                              <div className="lg:grid-cols-5 gap-2 grid">
                                {JSON.parse(item.Value).map((item3, index3) => (
                                  <div className="lg:col-span-1" key={"dataType4" + index3}>
                                    <Image className="cursor-pointer" src={item3} key={"proRequestPhotos" + index3} />
                                  </div>
                                ))}
                              </div>
                            </SRLWrapper>
                            :
                            <></>
                      }
                    </div>
                  ))}
                </>
            }

          </>
          :
          selectedTabsId === 2 ?
            <>
              {status === 3 ?
                <div className="mt-4">
                  <Label loading={offerLoading} title="Teklif Durumu" titleWidth="w-1/6" descWidth="w-5/6" desc={renderOffderStatus()} />
                  <Label loading={offerLoading} title="Profesyonel Adı" titleWidth="w-1/6" descWidth="w-5/6" desc={proName} />
                  <Label loading={offerLoading} title="Teklif Tipi" titleWidth="w-1/6" descWidth="w-5/6" desc={isQuickOffer === true ? "Hızlı Teklif" : "Detaylı Teklif"} />
                  <Label loading={offerLoading} title="Ödeme Tipi" titleWidth="w-1/6" descWidth="w-5/6" desc={selectedPaymentType === 1 ? "Peşin Ödeme" : "Taksitli Ödeme"} />
                  <Label loading={offerLoading} title="Teklif Tarihi" titleWidth="w-1/6" descWidth="w-5/6" desc={<DateView className="text-sm font-medium" dateNumber={offerCreatedDate} pattern="dd.MM.yyyy" />
                  } />
                  <Label loading={offerLoading} title="İş Başlangıç Tarihi" titleWidth="w-1/6" descWidth="w-5/6" desc={<DateView className="text-sm font-medium" dateNumber={offerJobStartDateJS} pattern="dd.MM.yyyy" />
                  } />
                  <Label loading={offerLoading} title="İş Teslim Tarihi" titleWidth="w-1/6" descWidth="w-5/6" desc={<DateView className="text-sm font-medium" dateNumber={offerJobDueDateJS} pattern="dd.MM.yyyy" />
                  } />
                  <Label loading={offerLoading} title="Proje Süresi" titleWidth="w-1/6" descWidth="w-5/6" desc={handleGetProjectDay(offerJobStartDateJS, offerJobDueDateJS) + " gün"} />
                  {

                    (offerStatus === 1) &&
                    <Label loading={offerLoading} title="Teklif Geçerlilik Süresi" titleWidth="w-1/6" descWidth="w-5/6" desc={<CountDown startDate={-1} endDate={offerExpireDateJS} />} />
                  }
                  <Label loading={offerLoading} title="Teklif Açıklaması" titleWidth="w-1/6" descWidth="w-5/6" desc={offerDescription} />
                  <Label loading={offerLoading} title="Toplam Tutar" titleWidth="w-1/6" descWidth="w-5/6" desc={
                    Number(totalPriceForProject) % 1 === 0 ?
                      <>{fraction.format(Number(totalPriceForProject))} TL </>
                      :
                      <>{formatter.format(Number(totalPriceForProject))} TL</>
                  } />
                  {
                    !isQuickOffer ?
                      <>
                        {
                          offerLoading ?
                            <Loading width="w-full" height="h-40" className="mt-4" />
                            :
                            <>
                              <h4 className="py-4 border-t">Malzeme Listesi</h4>
                              <div className="lg:grid-cols-10 bg-gray-100 p-3 mt-4 lg:grid hidden">
                                <div className="lg:col-span-2 text-sm text-gray-700 font-medium">Malzeme Adı</div>
                                <div className="lg:col-span-2 text-sm text-gray-700 font-medium">Marka</div>
                                <div className="lg:col-span-2 text-sm text-gray-700 font-medium">Miktar-Birim</div>
                                <div className="lg:col-span-2 text-sm text-gray-700 font-medium">KDV</div>
                                <div className="lg:col-span-2 text-sm text-gray-700 font-medium">Toplam Tutar</div>
                              </div>
                              {
                                (materialList && materialList.length && materialList.length > 0) ?
                                  <>
                                    {
                                      materialList.map((item) => (
                                        <div className="lg:grid-cols-10 p-3 mt-4 grid border-b lg:border-0">
                                          <div className="lg:col-span-2 ">
                                            <div className="flex items-center text-sm text-black-400">
                                              <span className="text-sm text-gray-700 font-medium lg:hidden mr-1">Malzeme Adı: </span>
                                              {item.MaterialName}
                                            </div>
                                          </div>
                                          <div className="lg:col-span-2 ">
                                            <div className="flex items-center text-sm text-black-400">
                                              <span className="text-sm text-gray-700 font-medium lg:hidden mr-1">Marka: </span>
                                              {item.Brand}
                                            </div>
                                          </div>
                                          <div className="lg:col-span-2 ">
                                            <div className="flex items-center text-sm text-black-400">
                                              <span className="text-sm text-gray-700 font-medium lg:hidden mr-1">Miktar-Birim: </span>
                                              {item.Quantity}
                                              <span className="ml-1">{materialUnit.find(i => i.key === String(item.Unit))?.value}</span>
                                            </div>
                                          </div>
                                          <div className="lg:col-span-2 ">
                                            <div className="flex items-center text-sm text-black-400">
                                              <span className="text-sm text-gray-700 font-medium lg:hidden mr-1">KDV: </span>
                                              %{item.TaxRate}
                                            </div>
                                          </div>
                                          <div className="lg:col-span-2 flex items-center justify-between">
                                            <div className="flex items-center text-sm text-black-400">
                                              <span className="text-sm text-gray-700 font-medium lg:hidden mr-1">Toplam Tutar: </span>
                                              {Number(item.TotalPrice) % 1 === 0 ?
                                                <>{fraction.format(Number(item.TotalPrice))} TL </>
                                                :
                                                <>{formatter.format(Number(item.TotalPrice))} TL</>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    }
                                  </>
                                  :
                                  <EmptyList text="" desc="Eklenmiş Malzeme Bulunmamakta" />
                              }
                              <div className="w-full border-t pt-4 border-b">
                                <div className="w-1/4 ml-auto">
                                  <div className="flex flex-col justify-end">
                                    <Label loading={offerLoading} title="Toplam Malzeme Tutarı" desc={
                                      totalMaterialPriceWoVat % 1 === 0 ?
                                        <>{fraction.format(totalMaterialPriceWoVat)} TL </>
                                        :
                                        <>{formatter.format(totalMaterialPriceWoVat)} TL</>
                                    } />
                                    <Label loading={offerLoading} title="Toplam İşçilik Tutarı" desc={
                                      laborCostWoVat % 1 === 0 ?
                                        <>{fraction.format(laborCostWoVat)} TL </>
                                        :
                                        <>{formatter.format(laborCostWoVat)} TL</>
                                    } />
                                    <Label loading={offerLoading} title="Toplam KDV" desc={
                                      totalVat % 1 === 0 ?
                                        <>{fraction.format(totalVat)} TL </>
                                        :
                                        <>{formatter.format(totalVat)} TL</>
                                    } />
                                  </div>
                                </div>
                              </div>
                              <div className="w-full ">
                                <div className="flex justify-end border-b mt-4">
                                  <div className="w-1/4">
                                    <Label loading={offerLoading} title="Toplam Proje Tutarı" desc={
                                      totalPriceForProject % 1 === 0 ?
                                        <h4>{fraction.format(totalPriceForProject)} TL </h4>
                                        :
                                        <h4>{formatter.format(totalPriceForProject)} TL</h4>
                                    } />
                                  </div>
                                </div>
                              </div>
                            </>
                        }
                      </>
                      :
                      <></>
                  }
                  <h4 className="py-4 border-t">Ödeme Planı</h4>
                  {
                    offerLoading ?
                      <Loading width="w-full" height="h-40" className="mt-4" />
                      :
                      <div className="p-3 border rounded-lg">
                        <div className="grid lg:grid-cols-4">
                          <div className="lg:col-span-4 font-medium flex items-center pb-3 border-b justify-between text-sm mb-3 text-black-400">
                            {
                              <>
                                <span className="block w-3/4" >{isQuickOffer === true ? "Peşin Ödeme Alın" : installmentCount + " Taksit ile ödeme alın"} </span>
                                {totalPriceForProject % 1 === 0 ?
                                  <span className="block w-1/4">{fraction.format(totalPriceForProject)} TL </span>
                                  :
                                  <span className="block w-1/4">{formatter.format(totalPriceForProject)} TL</span>
                                }
                              </>
                            }
                          </div>
                        </div>
                        {
                          installmentList &&
                          <>
                            {
                              installmentList.map((item) => (
                                <div className="flex w-full items-center text-sm mb-3">
                                  <div className="w-1/4">{item.InstallmentOrder}.taksit</div>
                                  <div className="w-1/4">-</div>
                                  <div className="w-1/4">%
                                    {item.PriceRatio % 1 === 0 ?
                                      <>{fraction.format(item.PriceRatio)} </>
                                      :
                                      <>{formatter.format(item.PriceRatio)}</>
                                    }
                                  </div>
                                  <div className="w-1/4 font-medium  ">
                                    {item.Price % 1 === 0 ?
                                      <>{fraction.format(item.Price)} TL </>
                                      :
                                      <>{formatter.format(item.Price)} TL</>
                                    }
                                  </div>
                                </div>
                              ))
                            }
                          </>
                        }
                      </div>
                  }
                </div>
                :
                <></>
              }
            </>
            :
            selectedTabsId === 3 ?
              <>
                <div ref={scrollEl} className={`min-h-60vh max-h-60vh overflow-y-auto custom-scrollbar mt-4 py-2 px-3 ${messageList.length > 0 ? "border border-gray-200 rounded-md" : ""}`}>
                  <div ref={scrollInnerEl} className="flex flex-col justify-end">
                    {
                      isContinue &&
                      <Button isLoading={messageProcessLoading} onClick={() => { setMessageProcessLoading(true); getMessagesForAdmin(); }} buttonSm design={"bg-blue-100 text-blue-400 w-40 mx-auto my-4 "} hasIcon icon={<ChevronRightIcon className="icon-sm text-blue-400 transform -rotate-90 mr-2" />} text={"Daha Fazla Yükle"}></Button>
                    }
                    {
                      messageLoading ?
                        <>
                          <div className="flex flex-col items-start">
                            <div className="w-3/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                            <div className="w-6/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                            <div className="w-5/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="w-3/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                            <div className="w-6/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                            <div className="w-5/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                          </div>
                          <div className="flex flex-col items-start">
                            <div className="w-3/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                            <div className="w-6/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                            <div className="w-5/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="w-3/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                            <div className="w-6/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                            <div className="w-5/12">
                              <Loading width="w-full" height="h-8" />
                            </div>
                          </div>
                        </>
                        :
                        <>
                          {
                            messageList.length <= 0 ?
                              <>
                                <EmptyList text={"Mesaj Bulunamadı"} />
                              </>
                              :
                              messageList.map((item, index) => (
                                <>
                                  {
                                    ((!item.IsPro && (index - 1) >= 0 && messageList[(index - 1)].IsPro) || (!item.IsPro && (index + 1) <= messageList.length - 1 && messageList[(index + 1)].IsPro) || (!item.IsPro && index === 0)) &&
                                    <div className="flex items-center gap-2 justify-start mt-2">
                                      <Image className="w-8 h-8 rounded-full object-cover" src={clientPhoto} alt={clientName} />
                                      <div className="text-xs text-gray-900 font-medium">{clientName}</div>
                                    </div>
                                  }
                                  <MessageItem item={item} />
                                  {
                                    ((item.IsPro && (index + 1) <= messageList.length - 1 && !messageList[(index + 1)].IsPro) || (item.IsPro && (index - 1) >= 0 && !messageList[(index - 1)].IsPro) || (item.IsPro && index === messageList.length - 1)) &&
                                    <div className="flex items-center gap-2 justify-end mt-2">
                                      <Image className="w-8 h-8 rounded-full object-cover" src={proPhoto} alt={storeName} />
                                      <div className="text-xs text-gray-900 font-medium">{storeName}</div>
                                    </div>
                                  }
                                </>
                              ))
                          }
                        </>
                    }
                  </div>
                </div>
              </>
              :
              selectedTabsId === 4 ?
                <>
                  <div className="mt-4">
                    <Label title="Talep Durumu" titleWidth="w-1/6" descWidth="w-5/6" desc={
                      <div className="bg-gray-100 text-gray-900 py-1 w-32 text-center rounded-full text-sm font-medium">Reddedildi</div>
                    } />
                    <Label title={status === 2 ? "Talep Red Tarihi" : "Talep İptal Tarihi"} titleWidth="w-1/6" descWidth="w-5/6" desc={requestRejectDate} />
                    <Label title={status === 2 ? "Talep Red Nedeni" : "Talep İptal Nedeni"} titleWidth="w-1/6" descWidth="w-5/6" desc={requestRejectTitle} />
                    <Label title={status === 2 ? "Talep Red Açıklaması" : "Talep İptal Açıklaması"} titleWidth="w-1/6" descWidth="w-5/6" desc={requestRejectReason} />
                  </div>
                </>
                :
                selectedTabsId === 5 ?
                  <>
                    <div className="mt-4">
                      <Label title="Teklif Durumu" titleWidth="w-1/6" descWidth="w-5/6" desc={
                        <div className="bg-gray-100 text-gray-900 py-1 w-32 text-center rounded-full text-sm font-medium">Reddedildi</div>
                      } />
                      <Label title="Teklif Red Tarihi" titleWidth="w-1/6" descWidth="w-5/6" desc={offerRejectDate} />
                      <Label title="Teklif Red Nedeni" titleWidth="w-1/6" descWidth="w-5/6" desc={offerRejectTitle} />
                      <Label title="Red Açıklaması" titleWidth="w-1/6" descWidth="w-5/6" desc={offerRejectReason} />
                    </div>
                  </>
                  :
                  <></>
        }
      </div>
    </div>
  )
}
