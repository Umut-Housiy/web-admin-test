import { FunctionComponent, useContext, useEffect, useState } from "react"
import { Link, useHistory, useLocation, useParams } from "react-router-dom"
import { DateView } from "../Components/DateView";
import { CargoTrackIcon, ChevronRightIcon } from "../Components/Icons"
import { Label } from "../Components/Label";
import { AdminOrderCargoListModel, SellerTempModelForOrderDetail } from "../Models";
import ApiService from "../Services/ApiService";
import { formatter, fraction } from "../Services/Functions";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { Image } from "../Components/Image";
import { CountDown } from "../Components/CountDown";

interface RouteParams {
  id: string,
}

interface LocationModel {
  queryPage: number,
}
export const OrderListDetail: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const params = useParams<RouteParams>();

  const location = useLocation<LocationModel>();

  const history = useHistory();

  const [loading, setLoading] = useState<boolean>(false);

  const [billAddressDescription, setBillAddressDescription] = useState<string>("lorem ipsum");

  const [billAddressNameSurname, setBillAddressNameSurname] = useState<string>("lorem ipsum");

  const [billAddressPhone, setBillAddressPhone] = useState<string>("lorem ipsum");

  const [billCitizenshipNo, setBillCitizenshipNo] = useState<string>("lorem ipsum");

  const [userMail, setUserMail] = useState<string>("lorem ipsum");

  const [installmentCount, setInstallmentCount] = useState<number>(0);

  const [orderStatus, setOrderStatus] = useState<number>(0);

  const [orderStatusString, setOrderStatusString] = useState<string>("lorem ipsum");

  const [sellers, setSellers] = useState<SellerTempModelForOrderDetail[]>([]);

  const [orderDate, setOrderDate] = useState<number>(0);

  const [cargoPrice, setCargoPrice] = useState<number>(0);

  const [productCount, setProductCount] = useState<number>(0);

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const [productsOnCargoList, setProductsOnCargoList] = useState<AdminOrderCargoListModel[]>([]);

  const [isPersonalBill, setIsPersonalBill] = useState<boolean>(false);

  const [billCompanyName, setBillCompanyName] = useState<string>("");

  const [billTaxDepartment, setBillTaxDepartment] = useState<string>("");

  const [billTaxNumber, setBillTaxNumber] = useState<string>("");

  const [deliveryAddressDescription, setDeliveryAddressDescription] = useState<string>("");

  const [deliveryAddressNameSurname, setDeliveryAddressNameSurname] = useState<string>("");

  const [deliveryAddressPhone, setDeliveryAddressPhone] = useState<string>("");

  useEffect(() => {
    getOrderDetail()
  }, []);

  const getOrderDetail = async () => {

    setLoading(true);

    const _result = await ApiService.getOrderDetail(Number(params.id));

    if (_result.succeeded === true) {
      const d = _result.data

      setBillAddressDescription(d.BillAddressDescription);
      setBillAddressNameSurname(d.BillAddressNameSurname);
      setBillCitizenshipNo(d.BillCitizenshipNo)
      setBillAddressPhone(d.BillAddressPhone);
      setUserMail(d.UserMail);
      setOrderStatus(d.OrderStatus);
      setOrderStatusString(d.OrderStatusString);
      setSellers(d.Sellers);
      setOrderDate(d.CreatedDateJSTime);
      setProductCount(d.ProductCount);
      setTotalPrice(d.TotalPrice);
      setIsPersonalBill(d.IsPersonalBill);
      setBillCompanyName(d.BillCompanyName);
      setBillTaxDepartment(d.BillTaxDepartment);
      setBillTaxNumber(d.BillTaxNumber);
      setDeliveryAddressDescription(d.DeliveryAddressDescription);
      setDeliveryAddressNameSurname(d.DeliveryAddressNameSurname);
      setDeliveryAddressPhone(d.DeliveryAddressPhone);
      setCargoPrice(d.CargoPrice);
      setInstallmentCount(d.InstallmentCount);
      setProductsOnCargoList(d.CargoList);
      setLoading(false);
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); history.push('/siparis-listesi'); setLoading(false);
        }
      });
    }
  }

  const returnTotalProductAmount = (e) => {
    let _totalAmount: number = 0;

    e.ProductList.map((item) => (
      _totalAmount = _totalAmount + item.Amount
    ))

    return _totalAmount
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to={`${location.state?.queryPage !== 1 ? `/siparis-listesi?sayfa=${location.state?.queryPage ?? 1}` : "/siparis-listesi"}`} className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Sipariş Listesi
          </div>
        </Link>
        <h2 className="mb-4 border-b pb-5">Sipariş Detayı</h2>
        <div className="grid lg:grid-cols-3 gap-x-4">
          <div className="lg:col-span-1">
            <h4 className="mb-4">Sipariş Bilgileri</h4>
            <Label loading={loading} descWidth="w-72" title="Sipariş Durumu" descClassName={`${(orderStatus === 0 || orderStatus === 1) ? "bg-yellow-100 text-yellow-600" : orderStatus === 2 ? "bg-blue-100 text-blue-400" : orderStatus === 3 ? "bg-green-100 text-green-400" : "bg-gray-100 text-gray-900"} inline-block text-sm font-medium text-center rounded-full py-1 `} desc={orderStatusString} />
            <Label loading={loading} title="Satıcı" desc={
              sellers.map((item) => (
                <Link to={`/satici-detay/${item.OwnerSellerId}`} className="mr-2 inline-block text-blue-400 font-medium underline">
                  {item.SellerName}
                </Link>
              ))
            } />
            <Label loading={loading} title="Sipariş Numarası" desc={params.id} character="#" />
            <Label loading={loading} title="Sipariş Tarihi" desc={<DateView className="text-sm" dateNumber={orderDate} pattern="dd/MM/yyyy" />} />
            <Label loading={loading} title="Sipariş Özeti" desc={`Toplam ${productCount} ürün`} />
            <Label loading={loading} title="Satış Tutarı" descBold descClassName="text-black-400" desc={
              <>
                {totalPrice % 1 === 0 ?
                  <>{fraction.format(totalPrice)} TL </>
                  :
                  <>{formatter.format(totalPrice)} TL</>
                }
              </>
            } />
            <Label loading={loading} title="Ödeme Tarihi" desc={<DateView className="text-sm" dateNumber={orderDate} pattern="dd/MM/yyyy" />} />
            <Label loading={loading} title="Ödeme Türü" desc={`Kredi Kartı ile Ödeme`} descBold />
            <Label loading={loading} title="Kargo Ücreti" desc={
              <>
                {cargoPrice % 1 === 0 ?
                  <>{fraction.format(cargoPrice)} TL </>
                  :
                  <>{formatter.format(cargoPrice)} TL</>
                }
              </>
            } />
          </div>
          <div className="lg:col-span-1">
            <h4 className="mb-4">Fatura Bilgileri</h4>
            <Label loading={loading} title="Fatura Tipi" desc={isPersonalBill === true ? "Bireysel Fatura" : "Kurumsal Fatura"} />
            {isPersonalBill === true ?
              <>
                <Label loading={loading} title="İsim Soyisim" desc={billAddressNameSurname} />
                <Label loading={loading} title="TCKN" desc={billCitizenshipNo} />
              </>
              :
              <>
                <Label loading={loading} title="Firma Adı" desc={billCompanyName} />
                <Label loading={loading} title="Vergi Numarası" desc={billTaxNumber} />
                <Label loading={loading} title="Vergi Dairesi" desc={billTaxDepartment} />
              </>
            }
            <Label loading={loading} title="Fatura Adresi" desc={billAddressDescription} />
            <Label loading={loading} title="Telefon Numarası" desc={billAddressPhone} />
          </div>
          <div className="lg:col-span-1">
            <h4 className="mb-4">Teslimat Bilgileri</h4>
            <Label loading={loading} title="Alıcı İsim Soyisim" desc={deliveryAddressNameSurname} />
            <Label loading={loading} title="Teslimat Adresi" desc={deliveryAddressDescription} />
            <Label loading={loading} title="Telefon Numarası" desc={deliveryAddressPhone} />
          </div>
        </div>
        {productsOnCargoList.length > 0 &&
          <>
            <h4 className="py-4 ">Sipariş Gönderileri</h4>
            <div className=" lg:grid-cols-10 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-3">
                <span className="text-sm font-medium text-gray-400">
                  Gönderi Bilgisi
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="text-sm font-medium text-gray-400">
                  Ürün Adedi
                </span>
              </div>
              <div className="lg:col-span-3">
                <span className="text-sm font-medium text-gray-400">
                  Kargolama Tarihi
                </span>
              </div>
              <div className="lg:col-span-3">
                <span className="text-sm font-medium text-gray-400">
                  İşlemler
                </span>
              </div>
            </div>
            {productsOnCargoList.map((item) => (
              <div className="lg:grid-cols-10 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0" >
                <div className="lg:col-span-3 flex items-center">
                  <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Gönderi Bilgisi: </span>
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm text-gray-600">Referans Numarası: {item.CargoBarcode}</span>
                    {item.ProductList.map((item2) => (
                      <>
                        <Image src={item2.PhotoUrl} className="w-20 h-16 object-contain" />
                      </>
                    ))}
                  </div>
                </div>
                <div className="lg:col-span-1 flex items-center">
                  <span className="text-sm font-medium text-gray-400 lg:hidden mr-2">Ürün Adedi: </span>
                  <p className="p-sm">
                    {returnTotalProductAmount(item)}
                  </p>
                </div>
                <div className="lg:col-span-3 flex items-center">
                  <span className="text-sm font-medium text-gray-400 lg:hidden mr-2">Kargolanma Tarihi: </span>
                  {item.ShippedDateJSTime === 0 ? "-" :
                    <DateView className="text-sm font-medium" dateNumber={item.ShippedDateJSTime} pattern="dd/MM/yyyy" />
                  }
                </div>
                <div className="lg:col-span-3 flex items-center">
                  <span className="text-sm font-medium text-gray-400 lg:hidden mr-2">İşlemler </span>
                  {item.DeliveredDateJSTime > 0 ?
                    <div className="flex flex-col">
                      <div className="flex items-center mb-4">
                        <span className="text-sm text-gray-700 inline-block mr-1">Teslim Tarihi: </span>
                        <span>
                          {<DateView className="text-sm text-gray-900" dateNumber={item.DeliveredDateJSTime} pattern="dd/MM/yyyy" />}
                        </span>
                      </div>
                    </div>
                    :
                    <>
                      {(item.CargoTrackUrl !== "" && item.CargoTrackUrl !== null) ?
                        <a className="flex items center font-medium text-blue-400 text-sm" target="_blank" href={item.CargoTrackUrl} >
                          <CargoTrackIcon className="icon-md mr-2 mb-1" /> Kargo Takibi
                        </a>
                        :
                        <>
                          {(item.CargoTrackNo !== "" && item.CargoTrackNo !== null) ?
                            <div className="lg:col-span-3 flex items-center">
                              <div className="flex items-start text-black-700 gap-2">
                                <div>
                                  <p className="text-sm font-medium"><span>Kargo: </span>{item.CargoCompany}</p>
                                  <span className="flex text-sm font-medium"><span>Kargo Takip Numarası: </span> {item.CargoTrackNo}</span>
                                </div>
                              </div>
                            </div>
                            :
                            <></>
                          }
                        </>
                      }
                    </>
                  }
                </div>
              </div>
            ))}
          </>
        }
        {sellers.length > 0 &&
          <>
            <h4 className="py-4">Ürün Listesi</h4>
            <div className=" lg:grid-cols-9 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
              <div className="lg:col-span-3">
                <span className="text-sm font-medium text-gray-400">
                  Ürün Bilgisi
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="text-sm font-medium text-gray-400">
                  Satıcı
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="text-sm font-medium text-gray-400">
                  Sipariş Adet
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="text-sm font-medium text-gray-400">
                  Tutar
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="text-sm font-medium text-gray-400">
                  Kargo için Kalan Süre
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="text-sm font-medium text-gray-400">
                  Durum Tarihi
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="text-sm font-medium text-gray-400">
                  Durum
                </span>
              </div>
            </div>
            {sellers.map((item) => (
              item.Products.map((e) => (
                <div className="lg:grid-cols-9 px-2 border-b lg:h-20 border-gray-200 grid gap-4 items-center py-3 lg:py-0" >
                  <div className="lg:col-span-3 flex items-center">
                    <span className="text-sm font-medium text-gray-400 lg:hidden mr-2">Ürün Bilgisi: </span>
                    <div className="flex items-start text-black-700 gap-2">
                      <Image src={e.ProductMainPhoto} className="w-20 h-16 object-contain" />
                      <div>
                        <p className="text-sm font-medium">{e.ProductName}</p>
                        <span className="flex text-sm"><span>Barkod No:</span> {e.BarcodeNo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-1 flex items-center">
                    <span className="text-sm font-medium text-gray-400 lg:hidden mr-2">Satıcı: </span>
                    <p className="p-sm">
                      {item.SellerName}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex items-center">
                    <span className="text-sm font-medium text-gray-400 lg:hidden mr-2">Sipariş Adet: </span>
                    <p className="p-sm">
                      {e.Amount}
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex items-center">
                    <span className="text-sm font-medium text-gray-400 lg:hidden mr-2">Tutar: </span>
                    <p className="p-sm">
                      {e.DiscountedPrice > 0 ?
                        <>
                          {
                            (e.DiscountedPrice * e.Amount) % 1 === 0 ?
                              <>{fraction.format(e.DiscountedPrice * e.Amount)} TL </>
                              :
                              <>{formatter.format(e.DiscountedPrice * e.Amount)} TL</>
                          }
                        </>
                        :
                        <>
                          {
                            (e.Price * e.Amount) % 1 === 0 ?
                              <>{fraction.format(e.Price * e.Amount)} TL </>
                              :
                              <>{formatter.format(e.Price * e.Amount)} TL</>
                          }
                        </>
                      }
                    </p>
                  </div>
                  <div className="lg:col-span-1 flex items-center">
                    <span className="text-sm font-medium text-gray-400 lg:hidden mr-2">Kargo için Kalan Süre</span>
                    {e.EstimatedDeliveryDateJSTime > 0 && (e.ProductStatusCode === 0 || e.ProductStatusCode === 1) ?
                      <div className="bg-red-100 p-1 rounded-md text-center">
                        <CountDown fullRemaingTime startDate={-1} endDate={e.EstimatedDeliveryDateJSTime} />
                      </div>
                      : "-"
                    }
                  </div>
                  <div className="lg:col-span-1 flex items-center">
                    <span className="text-sm font-medium text-gray-400 lg:hidden mr-2">Durum Tarihi</span>
                    {e.ProductStatusCode <= 0 ? "-" :
                      <DateView className="text-sm font-medium" dateNumber={e.LastUpdateDateJSTime} pattern="dd/MM/yyyy" />
                    }
                  </div>
                  <div className="lg:col-span-1 flex items-center">
                    <span className="text-sm font-medium text-gray-400 lg:hidden mr-2">Durum</span>
                    <span className={`${(e.ProductStatusCode === 0 || e.ProductStatusCode === 1 || e.ProductStatusCode === 8) ? "text-yellow-600 bg-yellow-100" : e.ProductStatusCode === 2 ? "text-blue-400 bg-blue-100" : e.ProductStatusCode === 3 ? "text-green-400 bg-green-100" : e.ProductStatusType === 4 ? "text-red-400 bg-red-100" : "bg-gray-100 text-gray-900"} w-full py-2 rounded-md block text-sm font-medium text-center`}>{e.ProductStatusCode === 8 ? e.CargoStatus : e.ProductStatus}</span>
                  </div>
                </div>
              ))
            ))}
          </>
        }
      </div>
    </div >
  )
}
