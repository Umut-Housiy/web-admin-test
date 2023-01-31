import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { fraction, GroupBuyById, GroupBuyParticipant, ProductAdminDetailModel } from "../../../../Models";
import { ChevronRightIcon, CoverPhotoIcon, EditIcon } from "../../../../Components/Icons";
import { TabsTitle } from "../../../../Components/TabsTitle";
import ApiService from "../../../../Services/ApiService";
import { Link, useParams } from "react-router-dom";
import { SharedContext, SharedContextProviderValueModel } from "../../../../Services/SharedContext";
import Slider from "react-slick";
import ReactDatePicker from "react-datepicker";
import tr from 'date-fns/locale/tr';
import { ExampleCustomTimeInput } from "../GroupBuyUpsert";
import { Button } from "../../../../Components/Button";
import { useHistory } from "react-router";
import { getGroupBuyStatus } from "../GroupBuyList";
import { readPageQueryString } from "../../../../Services/Functions";
import { Table } from "../../../../Components/Table";

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  autoplaySpeed: 4000,
  autoplay: true,
}

// todo add participant detail page, add group end date update, add busy loading elements
export function GroupBuyDetail() {
  const params = useParams<{ id: string; }>();
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const history = useHistory();

  const [busyCount, setBusyCount] = useState(0);
  const [groupBuyData, setGroupBuyData] = useState<GroupBuyById>();
  const [productAdvert, setProductAdvert] = useState<ProductAdminDetailModel>();

  const [groupBuyEndDate, setGroupBuyEndDate] = useState(new Date());
  const endDateRef = useRef<number>(0);

  const [tabList] = useState([
    {id: 1, name: "Ürün Bilgisi"},
    {id: 2, name: "Grup Alım Bilgisi"},
    {id: 3, name: "Katılımcı Bilgisi"},
  ]);
  const [selectedTabId, setSelectedTabId] = useState(3);

  const getGroupBuyData = useCallback(async () => {
    if (!params.id) return;
    setBusyCount(x => x + 1);
    const response = await ApiService.getGroupBuyById({id: Number(params.id)});

    if (response.succeeded) {
      setGroupBuyData(response.data);
      setGroupBuyEndDate(new Date(response.data.EndDate));
      endDateRef.current = new Date(response.data.EndDate).getTime();
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
        }
      });
    }
    setBusyCount(x => x - 1);
  }, []);

  const getProductAdvert = useCallback(async () => {
    if (!groupBuyData) return;
    setBusyCount(x => x + 1);
    const response = await ApiService.getAdvertDetailForAdmin(groupBuyData.ProductAdvertId);

    if (response.succeeded) {
      setProductAdvert(response.data);
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
        }
      });
    }
    setBusyCount(x => x - 1);
  }, [groupBuyData]);

  useEffect(() => {
    getGroupBuyData();
  }, []);

  useEffect(() => {
    getProductAdvert();
  }, [getProductAdvert]);

  const tableEl = useRef<any>(null);

  const fetchUserList = useCallback(async (order: number, searchText: string, page: number, take: number) => {
    const response = await ApiService.getGroupBuyParticipants({groupId: Number(params.id), page, take, searchText});

    if (response.succeeded) {
      return {Data: response.data.Data, TotalCount: response.data.TotalCount};
    }
    return {Data: [], TotalCount: 0}
  }, []);

  useEffect(() => {
    tableEl.current?.reload();
  }, []);

  const updateGroupBuyEndDate = useCallback(async () => {
    setBusyCount(x => x + 1);
    const response = await ApiService.extendGroupBuy({
      groupId: Number(params.id), endDate: groupBuyEndDate.toISOString(),
    });

    if (response.succeeded) {
      endDateRef.current = groupBuyEndDate.getTime();
      context.showModal({
        type: "Success",
        message: "Grup Bitiş Zamanı Güncellenedi",
        onClose: () => {
          context.hideModal();
        }
      });
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
        }
      });
    }
    setBusyCount(x => x - 1);
  }, [params, groupBuyEndDate]);

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to="/grup-alimlar" className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3"/>
            Grup Alım Listesi
          </div>
        </Link>
        <div className="flex align-items-center mb-5 justify-between">
          <h2>Grup Alım Detay</h2>

          <Button textTiny className="w-60 " buttonSm design="button-blue-400"
                  text="Grup Alımı Düzenle" hasIcon icon={<EditIcon className="icon-sm mr-2"/>}
                  onClick={() => history.push(`/grup-alim/duzenle/${Number(params.id ?? "0")}`)}/>
        </div>
        <TabsTitle list={tabList} selectedTabsId={selectedTabId}
                   onItemSelected={item => setSelectedTabId(item.id)}/>
        {(productAdvert && groupBuyData) ? (
          selectedTabId === 1 ?
            <div className="mt-4">
              <h4 className="mb-4">Ürün Galerisi</h4>
              {
                productAdvert.Images.length <= 4 ?
                  <div className="grid lg:grid-cols-5">
                    {productAdvert.Images.map((item, index) => (
                      <div className="col-span-1 relative" key={"media_" + index}>
                        <img src={item.PhotoUrl} className="w-full pr-3 object-contain h-48" alt="Slider"/>
                        {item.IsMainPhoto ?
                          <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1"/> : <></>
                        }
                      </div>
                    ))}
                  </div>
                  :
                  <Slider {...sliderSettings}>
                    {productAdvert.Images.map((item, index) => (
                      <div className="relative" key={"media_" + index}>
                        <img src={item.PhotoUrl} className="w-full pr-3 object-contain h-48" alt="Slider"/>
                        {item.IsMainPhoto ?
                          <CoverPhotoIcon className="h-12 w-12 absolute left-1 top-1"/> : <></>
                        }
                      </div>
                    ))}
                  </Slider>
              }
              <span className="text-type-18-medium one-line mt-4">{productAdvert.ProductName}</span>
              <div className="flex flex-row">
                <div className="flex-col w-1/3">
                  <div className="flex flex-row items-center mt-2">
                    <div className="text-type-14-regular">Mağaza :</div>
                    <div className="text-type-16-medium ml-2">{productAdvert.AdvertDetail.StoreName}</div>
                  </div>
                  <div className="flex flex-row items-center mt-2">
                    <div className="text-type-14-regular">Kategori :</div>
                    <div className="text-type-16-medium ml-2">{productAdvert.Category}</div>
                  </div>
                  <div className="flex flex-row items-center mt-2">
                    <div className="text-type-14-regular">Barkod No :</div>
                    <div className="text-type-16-medium ml-2">{productAdvert.BarcodeNo}</div>
                  </div>
                  <div className="flex flex-row items-center mt-2">
                    <div className="text-type-14-regular">Model No :</div>
                    <div className="text-type-16-medium ml-2">{productAdvert.ModelNo}</div>
                  </div>
                </div>
                <div className="flex-col w-1/3">
                  <div className="flex flex-row items-center mt-2">
                    <div className="text-type-14-regular">Stok Kodu :</div>
                    <div className="text-type-16-medium ml-2">{productAdvert.AdvertDetail.StockCode}</div>
                  </div>
                  <div className="flex flex-row items-center mt-2">
                    <div className="text-type-14-regular">Stok Miktarı :</div>
                    <div className="text-type-16-medium ml-2">{productAdvert.AdvertDetail.Stock}</div>
                  </div>
                  <div className="flex flex-row items-center mt-2">
                    <div className="text-type-14-regular">Satış Fiyatı :</div>
                    <div className="text-type-16-medium ml-2">
                      {`${fraction.format(productAdvert.AdvertDetail.SalePrice)} ₺`}</div>
                  </div>
                  <div className="flex flex-row items-center mt-2">
                    <div className="text-type-14-regular">Piyasa Satış Fiyatı :</div>
                    <div className="text-type-16-medium ml-2">
                      {`${fraction.format(productAdvert.AdvertDetail.MarketPrice)} ₺`}</div>
                  </div>
                </div>
              </div>
            </div>
            : selectedTabId === 2 ?
              <div className="mt-4">
                <span className="text-type-18-medium one-line mt-4">Grup Bilgisi</span>
                <div className="flex flex-row">
                  <div className="flex-col w-1/3">
                    <div className="flex flex-row items-center mt-2">
                      <div className="text-type-14-regular">Grup Durumu :</div>
                      <div className="text-type-16-medium ml-2">{getGroupBuyStatus(groupBuyData.GeneralStatus)}</div>
                    </div>
                    <div className="flex flex-row items-center mt-2">
                      <div className="text-type-14-regular">Grup ismi :</div>
                      <div className="text-type-16-medium ml-2">{groupBuyData.Name}</div>
                    </div>
                    <div className="flex flex-row items-center mt-2">
                      <div className="text-type-14-regular">Açıklama :</div>
                      <div className="text-type-16-medium ml-2 one-line">{groupBuyData.Description}</div>
                    </div>
                    <div className="flex flex-row items-center mt-2">
                      <div className="text-type-14-regular">Grup Alım süresi :</div>
                      <div className="text-type-16-medium ml-2 one-line">{`${groupBuyData.GroupLifeHours} saat`}</div>
                    </div>
                    <div className="flex flex-row items-center mt-2">
                      <div className="text-type-14-regular">Grup katılımcı sayısı :</div>
                      <div className="text-type-16-medium ml-2 one-line">
                        {`${groupBuyData.ParticipantCount} / ${groupBuyData.ParticipantCountLimit}`}</div>
                    </div>
                  </div>
                  <div className="flex-col w-1/3">
                    <div className="flex flex-row items-center mt-2">
                      <div className="text-type-14-regular">Grup Satış Fiyatı :</div>
                      <div className="text-type-16-medium ml-2">
                        {`${fraction.format(groupBuyData.GroupBuyingPrice)} ₺`}</div>
                    </div>
                    <div className="flex flex-row items-center mt-2">
                      <div className="text-type-14-regular">Piyasa Satış Fiyatı :</div>
                      <div className="text-type-16-medium ml-2">
                        {`${fraction.format(groupBuyData.ProductActualPrice)} ₺`}</div>
                    </div>
                    <div className="flex flex-row items-center mt-2">
                      <div className="text-type-14-regular">Grup başlangıç zamanı :</div>
                      <ReactDatePicker
                        className="rounded-lg focus:outline-none border border-gray-300 py-2 px-3 text-gray-900 ml-2"
                        style={{width: 300}}
                        selected={new Date(groupBuyData.StartDate)}
                        dateFormat="d MMMM yyyy - HH:mm"
                        readOnly
                        locale={tr}
                      />
                    </div>
                    <div className="flex flex-row items-center mt-2">
                      <div className="text-type-14-regular">Grup bitiş zamanı :</div>
                      <ReactDatePicker
                        className="rounded-lg focus:outline-none border border-gray-300 py-2 px-3 text-gray-900 ml-2"
                        style={{width: 300}}
                        selected={groupBuyEndDate}
                        onChange={setGroupBuyEndDate}
                        dateFormat="d MMMM yyyy - HH:mm"
                        locale={tr}
                        showTimeInput
                        customTimeInput={
                          <ExampleCustomTimeInput/>
                        }
                      />
                    </div>
                    <div className="flex flex-row items-center mt-2 h-9">
                      {groupBuyEndDate.getTime() !== endDateRef.current ? (
                        <Button isLoading={!!busyCount} textTiny buttonSm
                                className="w-72"
                                text="Grup Bitiş Süresini Güncelle"
                                design="button-blue-400" onClick={updateGroupBuyEndDate}/>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              :
              <div className="mt-4">
                <Table
                  ref={tableEl}
                  emptyListText={"Grup Alım Katılımcı Bulunamadı"}
                  getDataFunction={fetchUserList}
                  header={
                    <div className="lg:grid-cols-7 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
                      <div className="lg:col-span-1 flex items-center p-sm-gray-400">
                        İsim
                      </div>
                      <div className="lg:col-span-1 flex items-center p-sm-gray-400">
                        Durum
                      </div>
                      <div className="lg:col-span-1 flex items-center p-sm-gray-400">
                        Ödeme Zamanı
                      </div>
                      <div className="lg:col-span-1 flex items-center p-sm-gray-400">
                        Ödeme Miktarı
                      </div>
                      <div className="lg:col-span-1 flex items-center p-sm-gray-400">
                        Taksit Sayısı
                      </div>
                    </div>
                  }
                  renderItem={(item: GroupBuyParticipant, index) => (
                    <div className="lg:grid-cols-7 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center"
                         key={`key_${index}`}>
                      <div className="lg:col-span-1 flex lg:block items-center">
                        {item.NameAndSurname}
                      </div>
                      <div className="lg:col-span-1 flex lg:block items-center">
                        {item.Status === 1 ? 'Tamamlamış' : 'Tamamlıyor'}
                      </div>
                      <div className="lg:col-span-1 flex lg:block items-center">
                        {item.SuccessPaymentDate ? new Date(item.SuccessPaymentDate).toLocaleString('tr') : '-'}
                      </div>
                      <div className="lg:col-span-1 flex lg:block items-center">
                        {`${fraction.format(item.PayedPrice)} ₺`}
                      </div>
                      <div className="lg:col-span-1 flex lg:block items-center">
                        {item.Installment}
                      </div>
                    </div>
                  )}
                  page={Number(readPageQueryString(window.location) ?? "1")}
                  setPageQueryString
                  noSortOptions
                />
              </div>
        ) : null}

      </div>
    </div>
  );
}
