import { FunctionComponent, useEffect, useState } from "react"
import { GetDashboardLastOrdersResponseModel, GetDashboardLastWorksResponseModel, GetDashboardProRecoursesResponseModel, GetDashboardSellerRecoursesResponseModel, GetDashboardTotalCountsResponseModel, GetOrderEarningChartResponseModel, GetProductCategoryChartResponseModel, GetSiteUserChartResponseModel, GetWorkCategoryChartResponseModel, GetWorkEarningChartResponseModel, WorkPaymentStatus } from "../Models";
import ReactApexChart from 'react-apexcharts'
import ApiService from "../Services/ApiService";
import { useStateEffect } from "../Components/UseStateEffect";
import { Loading } from "../Components/Loading";
import { formatter, fraction } from "../Services/Functions";
import { ChevronFillIcon, ChevronRightFill, ChevronRightIcon, RefreshIcon } from "../Components/Icons";
import { DatePicker } from "../Components/DatePicker";
import { EmptyList } from "../Components/EmptyList";
import { Image } from "../Components/Image";
import { Link, useHistory } from "react-router-dom";

export const Dashboard: FunctionComponent = () => {

  const history = useHistory();

  const [lastOrdersLoading, setLastOrdersLoading] = useState<boolean>(false);

  const [lastOrdersList, setLastOrdersList] = useState<GetDashboardLastOrdersResponseModel[]>([]);

  const [lastWorksLoading, setLastWorksLoading] = useState<boolean>(false);

  const [lastWorksRefresh, setLastWorksRefresh] = useState<boolean>(false);

  const [lastWorksList, setLastWorksList] = useState<GetDashboardLastWorksResponseModel[]>([]);

  const [proRecoursesLoading, setProRecoursesLoading] = useState<boolean>(false);

  const [proRecoursesList, setProRecoursesList] = useState<GetDashboardProRecoursesResponseModel[]>([]);

  const [sellerRecoursesLoading, setSellerRecoursesLoading] = useState<boolean>(false);

  const [sellerRecoursesList, setSellerRecoursesList] = useState<GetDashboardSellerRecoursesResponseModel[]>([]);

  const [totalCountsLoading, setTotalCountsLoading] = useState<boolean>(false);

  const [totalCounts, setTotalCounts] = useState<GetDashboardTotalCountsResponseModel>();

  const [orderEarningLoading, setOrderEarningLoading] = useState<boolean>(false);

  const [orderEarningDate, setOrderEarningDate] = useState<Date>(new Date());

  const [orderEarningChartLabels, serOrderEarningChartLabels] = useState<string[]>([]);

  const [orderEarningChartValues, serOrderEarningChartValues] = useState<number[]>([]);

  const [productCategoryLoading, setProductCategoryLoading] = useState<boolean>(false);

  const [productCategoryRefresh, setProductCategoryRefresh] = useState<boolean>(false);

  const [productCategoryChartLabels, setProductCategoryChartLabels] = useState<string[]>([]);

  const [productCategoryChartValues, setProductCategoryChartValues] = useState<number[]>([]);

  const [siteUserLoading, setSiteUserLoading] = useState<boolean>(false);

  const [siteUserDate, setSiteUserDate] = useState<Date>(new Date);

  const [siteUserChartLabels, setSiteUserChartLabels] = useState<string[]>([]);

  const [siteUserChartValues, setSiteUserChartValues] = useState<number[]>([]);

  const [workCategoryLoading, setWorkCategoryLoading] = useState<boolean>(false);

  const [workCategoryRefresh, setWorkCategoryRefresh] = useState<boolean>(false);

  const [workCategoryChartLabels, setWorkCategoryChartLabels] = useState<string[]>([]);

  const [workCategoryChartValues, setWorkCategoryChartValues] = useState<number[]>([]);

  const [workEarningLoading, setWorkEarningLoading] = useState<boolean>(false);

  const [workEarningDate, setWorkEarningDate] = useState<Date>(new Date);

  const [workEarningChartLabels, setWorkEarningChartLabels] = useState<string[]>([]);

  const [workEarningChartValues, setWorkEarningChartValues] = useState<number[]>([]);

  useEffect(() => {
    getDashboardLastOrders();
    getDashboardLastWorks();
    getDashboardProRecourses();
    getDashboardSellerRecourses();
    getDashboardTotalCounts();
    getOrderEarningChart();
    getProductCategoryChart();
    getSiteUserChart();
    getWorkCategoryChart();
    getWorkEarningChart();
  }, []);

  //#region Last-Orders
  const getDashboardLastOrders = async () => {
    setLastOrdersLoading(true);

    const _result = await ApiService.getDashboardLastOrders();

    if (_result.succeeded === true) {
      setLastOrdersList(_result.data);
      setLastOrdersLoading(false);
    }
  }
  //#endregion

  //#region Last-Works
  useStateEffect(() => {
    if (lastWorksRefresh) {
      getDashboardLastWorks();
    }
  }, [lastWorksRefresh]);

  const getDashboardLastWorks = async () => {
    setLastWorksLoading(true);

    const _result = await ApiService.getDashboardLastWorks(lastWorksRefresh);

    if (_result.succeeded === true) {
      setLastWorksList(_result.data);
      setLastWorksLoading(false);
    }
    setLastWorksRefresh(false);
  }
  //#endregion

  //#region Pro-Recouses
  const getDashboardProRecourses = async () => {
    setProRecoursesLoading(true);

    const _result = await ApiService.getDashboardProRecourses();

    if (_result.succeeded === true) {
      setProRecoursesList(_result.data);
      setProRecoursesLoading(false);
    }
  }
  //#endregion

  //#region Seller-Recourses
  const getDashboardSellerRecourses = async () => {
    setSellerRecoursesLoading(true);

    const _result = await ApiService.getDashboardSellerRecourses();

    if (_result.succeeded === true) {
      setSellerRecoursesList(_result.data);
      setSellerRecoursesLoading(false);
    }
  }
  //#endregion

  //#region Total-Counts
  const getDashboardTotalCounts = async () => {
    setTotalCountsLoading(true);

    const _result = await ApiService.getDashboardTotalCounts();

    if (_result.succeeded === true) {
      setTotalCounts(_result.data);
      setTotalCountsLoading(false);
    }
  }
  //#endregion

  //#region Order-Earning
  useStateEffect(() => {
    getOrderEarningChart();
  }, [orderEarningDate]);


  const getOrderEarningChart = async () => {
    setOrderEarningLoading(true);

    const _result = await ApiService.getOrderEarningChart(orderEarningDate.getTime());

    if (_result.succeeded === true) {
      if (_result.data.length > 0) {

        let tempLabelList: string[] = [];
        let tempValuelist: number[] = [];

        _result.data.forEach((item) => {
          tempLabelList.push(handleJsDate(item.DateJSTime));
          tempValuelist.push(item.Price)
        })
        serOrderEarningChartLabels(JSON.parse(JSON.stringify(tempLabelList)));
        serOrderEarningChartValues(JSON.parse(JSON.stringify(tempValuelist)));
        setOrderEarningLoading(false);
      }
    }
  }
  //#endregion

  //#region Product-Category
  useStateEffect(() => {
    if (productCategoryRefresh) {
      getProductCategoryChart();
    }
  }, [productCategoryRefresh]);

  const getProductCategoryChart = async () => {
    setProductCategoryLoading(true);

    const _result = await ApiService.getProductCategoryChart(productCategoryRefresh);

    if (_result.succeeded === true) {
      if (_result.data.length > 0) {

        let tempLabelList: string[] = [];
        let tempValuelist: number[] = [];

        _result.data.forEach((item) => {
          tempLabelList.push(item.CategoryName);
          tempValuelist.push(item.Count)
        })
        setProductCategoryChartLabels(JSON.parse(JSON.stringify(tempLabelList)));
        setProductCategoryChartValues(JSON.parse(JSON.stringify(tempValuelist)));
        setProductCategoryLoading(false);
      }
    }
    setProductCategoryRefresh(false);
  }
  //#endregion

  //#region Site-User
  useStateEffect(() => {
    getSiteUserChart();
  }, [siteUserDate]);

  const getSiteUserChart = async () => {
    setSiteUserLoading(true);

    const _result = await ApiService.getSiteUserChart(siteUserDate.getTime());

    if (_result.succeeded === true) {
      if (_result.data.length > 0) {

        let tempLabelList: string[] = [];
        let tempValuelist: number[] = [];

        _result.data.forEach((item) => {
          tempLabelList.push(handleJsDate(item.DateJSTime));
          tempValuelist.push(item.UserCount)
        })
        setSiteUserChartLabels(JSON.parse(JSON.stringify(tempLabelList)));
        setSiteUserChartValues(JSON.parse(JSON.stringify(tempValuelist)));
        setSiteUserLoading(false);
      }
    }
  }
  //#endregion

  //#region Work-Category
  useStateEffect(() => {
    if (workCategoryRefresh) {
      getWorkCategoryChart();
    }
  }, [workCategoryRefresh]);

  const getWorkCategoryChart = async () => {
    setWorkCategoryLoading(true);

    const _result = await ApiService.getWorkCategoryChart(workCategoryRefresh);

    if (_result.succeeded === true) {
      if (_result.data.length > 0) {

        let tempLabelList: string[] = [];
        let tempValuelist: number[] = [];

        _result.data.forEach((item) => {
          tempLabelList.push(item.CategoryName);
          tempValuelist.push(item.Count)
        })
        setWorkCategoryChartLabels(JSON.parse(JSON.stringify(tempLabelList)));
        setWorkCategoryChartValues(JSON.parse(JSON.stringify(tempValuelist)));
        setWorkCategoryLoading(false);
      }
    }
    setWorkCategoryRefresh(false);
  }
  //#endregion

  //#region Work-Earning
  useStateEffect(() => {
    getWorkEarningChart();
  }, [workEarningDate]);

  const getWorkEarningChart = async () => {
    setWorkEarningLoading(true);

    const _result = await ApiService.getWorkEarningChart(workEarningDate.getTime());

    if (_result.succeeded === true) {
      if (_result.data.length > 0) {

        let tempLabelList: string[] = [];
        let tempValuelist: number[] = [];

        _result.data.forEach((item) => {
          tempLabelList.push(handleJsDate(item.DateJSTime));
          tempValuelist.push(item.Price)
        })
        setWorkEarningChartLabels(JSON.parse(JSON.stringify(tempLabelList)));
        setWorkEarningChartValues(JSON.parse(JSON.stringify(tempValuelist)));
        setWorkEarningLoading(false);
      }
    }
  }
  //#endregion

  const handleJsDate = (JsTime) => {
    if (JsTime > 0) {
      try {
        var time = new Date(JsTime);
        return time.toLocaleDateString() ?? "";
      }
      catch {
        return ""
      }
    }
    else {
      return ""
    }
  }

  const workCategoryChartOptions = {

    series: workCategoryChartValues,
    labels: workCategoryChartLabels,
    options: {
      chart: {
        type: 'donut',
        width: 380,
      },
    },
  };

  const productCategoryChartOptions = {

    series: productCategoryChartValues,
    labels: productCategoryChartLabels,
    options: {
      chart: {
        type: 'donut',
        width: 380,
      },
    },
  };

  const userChartOptions = {
    chart: {
      zoom: {
        enabled: false,
        autoScaleYaxis: true
      }
    },
    toolbar: {
      show: false,
    },
    series: [
      {
        name: "",
        data: siteUserChartValues
      },
    ],
    dataLabels: {
      enabled: false
    },
    colors: ["#165AA9", "#FFFFFF"],
    grid: {
      row: {
        colors: ['#FFFFFF', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: siteUserChartLabels
    },
    markers: {
      size: 0,
      colors: ['#FFFFFF'],
      strokeColors: '#FFFFFF',
      strokeWidth: 2,
    },
    fill: {
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      },
    },
  };

  const workEarningChartOptions = {
    chart: {
      zoom: {
        enabled: false,
        autoScaleYaxis: true
      }
    },
    toolbar: {
      show: false,
    },
    series: [
      {
        name: "",
        data: workEarningChartValues
      },
    ],
    dataLabels: {
      enabled: false
    },
    colors: ["#165AA9", "#FFFFFF"],
    grid: {
      row: {
        colors: ['#FFFFFF', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: workEarningChartLabels
    },
    markers: {
      size: 0,
      colors: ['#FFFFFF'],
      strokeColors: '#FFFFFF',
      strokeWidth: 2,
    },
    fill: {
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      },
    },
  };

  const orderEarningChartOptions = {
    chart: {
      zoom: {
        enabled: false,
        autoScaleYaxis: true
      }
    },
    toolbar: {
      show: false,
    },
    series: [
      {
        name: "",
        data: orderEarningChartValues
      },
    ],
    dataLabels: {
      enabled: false
    },
    colors: ["#165AA9", "#FFFFFF"],
    grid: {
      row: {
        colors: ['#FFFFFF', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: orderEarningChartLabels
    },
    markers: {
      size: 0,
      colors: ['#FFFFFF'],
      strokeColors: '#FFFFFF',
      strokeWidth: 2,
    },
    fill: {
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      },
    },
  };

  return (
    <div className="content-wrapper">
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 flex flex-col gap-4">
              <div>
                {
                  totalCountsLoading ?
                    <Loading width="w-full" height="h-40" />
                    :
                    <>
                      <div className="portlet-wrapper">
                        <div className="grid grid-cols-2 gap-4 w-full">
                          <div className="col-span-1">
                            <div className="text-gray-700 font-medium text-sm">Toplam Üye Sayısı</div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="text-tiny text-black-400 font-medium mt-2">
                                {(totalCounts?.TotalUserCount ?? 0) % 1 === 0 ?
                                  <>{fraction.format(totalCounts?.TotalUserCount ?? 0)} </>
                                  :
                                  <>{formatter.format(totalCounts?.TotalUserCount ?? 0)} </>
                                }
                              </div>
                              {
                                totalCounts && Math.abs((totalCounts?.LastDaysUserCount ?? 0)) > 0 &&
                                <div className={`${(totalCounts?.LastDaysUserCount ?? 0) > 0 ? "text-green-400" : "text-red-400"} flex items-center gap-1 font-medium`}>
                                  {
                                    (totalCounts?.LastDaysUserCount ?? 0) > 0 ?
                                      <ChevronFillIcon className="w-2 h-2 transform rotate-180" />
                                      :
                                      <ChevronFillIcon className="w-2 h-2" />
                                  }
                                  <div className="text-sm">{(totalCounts?.LastDaysUserCount ?? 0)}</div>
                                </div>
                              }
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div className="text-gray-700 font-medium text-sm">Toplam Profesyonel Sayısı</div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="text-tiny text-black-400 font-medium">
                                {(totalCounts?.TotalProfessionalCount ?? 0) % 1 === 0 ?
                                  <>{fraction.format(totalCounts?.TotalProfessionalCount ?? 0)} </>
                                  :
                                  <>{formatter.format(totalCounts?.TotalProfessionalCount ?? 0)} </>
                                }
                              </div>
                              {
                                totalCounts && Math.abs((totalCounts?.LastDaysProfessionalCount ?? 0)) > 0 &&
                                <div className={`${(totalCounts?.LastDaysProfessionalCount ?? 0) > 0 ? "text-green-400" : "text-red-400"} flex items-center gap-1 font-medium`}>
                                  {
                                    (totalCounts?.LastDaysProfessionalCount ?? 0) > 0 ?
                                      <ChevronFillIcon className="w-2 h-2 transform rotate-180" />
                                      :
                                      <ChevronFillIcon className="w-2 h-2" />
                                  }
                                  <div className="text-sm">{(totalCounts?.LastDaysProfessionalCount ?? 0)}</div>
                                </div>
                              }
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div className="text-gray-700 font-medium text-sm">Toplam Ürün Sayısı</div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="text-tiny text-black-400 font-medium">
                                {(totalCounts?.TotalProductCount ?? 0) % 1 === 0 ?
                                  <>{fraction.format(totalCounts?.TotalProductCount ?? 0)} </>
                                  :
                                  <>{formatter.format(totalCounts?.TotalProductCount ?? 0)} </>
                                }
                              </div>
                              {
                                totalCounts && Math.abs((totalCounts?.LastDaysProductCount ?? 0)) > 0 &&
                                <div className={`${(totalCounts?.LastDaysProductCount ?? 0) > 0 ? "text-green-400" : "text-red-400"} flex items-center gap-1 font-medium`}>
                                  {
                                    (totalCounts?.LastDaysProductCount ?? 0) > 0 ?
                                      <ChevronFillIcon className="w-2 h-2 transform rotate-180" />
                                      :
                                      <ChevronFillIcon className="w-2 h-2" />
                                  }
                                  <div className="text-sm">{(totalCounts?.LastDaysProductCount ?? 0)}</div>
                                </div>
                              }
                            </div>
                          </div>
                          <div className="col-span-1">
                            <div className="text-gray-700 font-medium text-sm">Toplam Mağaza Sayısı</div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="text-tiny text-black-400 font-medium ">
                                {(totalCounts?.TotalSellerCount ?? 0) % 1 === 0 ?
                                  <>{fraction.format(totalCounts?.TotalSellerCount ?? 0)} </>
                                  :
                                  <>{formatter.format(totalCounts?.TotalSellerCount ?? 0)} </>
                                }
                              </div>
                              {
                                totalCounts && Math.abs((totalCounts?.LastDaysSellerCount ?? 0)) > 0 &&
                                <div className={`${(totalCounts?.LastDaysSellerCount ?? 0) > 0 ? "text-green-400" : "text-red-400"} flex items-center gap-1 font-medium`}>
                                  {
                                    (totalCounts?.LastDaysSellerCount ?? 0) > 0 ?
                                      <ChevronFillIcon className="w-2 h-2 transform rotate-180" />
                                      :
                                      <ChevronFillIcon className="w-2 h-2" />
                                  }
                                  <div className="text-sm">{(totalCounts?.LastDaysSellerCount ?? 0)}</div>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                }
              </div>
              <div>
                {
                  siteUserLoading ?
                    <Loading width="w-full" height="h-96" />
                    :
                    <>
                      <div className="portlet-wrapper">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-tiny text-black-400 font-medium">Üye Grafiği</div>
                          <div className="flex gap-3 items-center">
                            <DatePicker
                              value={siteUserDate}
                              maxDate={new Date()}
                              setSelectedDate={(e) => { setSiteUserDate(e) }}
                            />
                            <RefreshIcon className="text-blue-400 cursor-pointer icon-sm" onClick={() => { getSiteUserChart(); }} />
                          </div>
                        </div>
                        <ReactApexChart options={userChartOptions} series={userChartOptions.series} type={'line'} height={300} />
                      </div>
                    </>
                }
              </div>
            </div>
            <div className="col-span-1 flex flex-col gap-4">
              <div>
                {
                  workCategoryLoading ?
                    <Loading width="w-full" height="h-64" />
                    :
                    <>
                      <div className="portlet-wrapper">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-tiny text-black-400 font-medium">En Popüler Hizmet Kategorileri</div>
                          <RefreshIcon className="text-blue-400 cursor-pointer icon-sm" onClick={() => { setWorkCategoryRefresh(true); }} />
                        </div>
                        <ReactApexChart options={workCategoryChartOptions} series={workCategoryChartOptions.series} type={'donut'} height={205} />
                      </div>
                    </>
                }
              </div>
              <div>
                {
                  productCategoryLoading ?
                    <Loading width="w-full" height="h-64" />
                    :
                    <>
                      <div className="portlet-wrapper">
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-tiny text-black-400 font-medium">En Popüler Ürün Kategorileri</div>
                          <RefreshIcon className="text-blue-400 cursor-pointer icon-sm" onClick={() => { setProductCategoryRefresh(true); }} />
                        </div>
                        <ReactApexChart options={productCategoryChartOptions} series={productCategoryChartOptions.series} type={'donut'} height={205} />
                      </div>
                    </>
                }
              </div>
            </div>
            <div className="col-span-2">
              {
                lastWorksLoading ?
                  <Loading width="w-full" height="h-96" />
                  :
                  <>
                    <div className="portlet-wrapper h-96 overflow-y-auto custom-scrollbar">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-tiny text-black-400 font-medium">Son Hizmetler</div>
                        <div className="flex items-center gap-4">
                          <RefreshIcon className="text-blue-400 cursor-pointer icon-sm" onClick={() => { setLastWorksRefresh(true); }} />
                          <div className="text-blue-400 text-sm font-medium cursor-pointer" onClick={() => { history.push("/devam-eden-isler"); }}>Tümünü Gör</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-4 py-5 border-t border-b border-gray-200">
                        <div className="col-span-1 flex items-center">
                          <div className="text-type-12-medium text-gray-700">Müşteri Bilgisi</div>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <div className="text-type-12-medium text-gray-700">Profesyonel Bilgisi</div>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <div className="text-type-12-medium text-gray-700">İş Tanımı</div>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <div className="text-type-12-medium text-gray-700">Toplam Tutar</div>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <div className="text-type-12-medium text-gray-700">Ödeme Durumu</div>
                        </div>
                      </div>
                      {
                        lastWorksList.length > 0 ?
                          <>
                            {
                              lastWorksList.map((item, index) => (
                                <div key={"lastworks_" + index} className="grid grid-cols-5 gap-4 py-5 border-b border-gray-200">
                                  <div className="col-span-1 flex items-center gap-2">
                                    <Image src={item.UserPhoto} className="w-8 h-8 rounded-full object-cover" />
                                    <div className="text-sm text-gray-900">{item.UserName}</div>
                                  </div>
                                  <div className="col-span-1 flex items-center">
                                    <Link to={`/pro-profesyonel-detay/${item.ProId}`}>
                                      <div className="text-blue-400 underline text-sm cursor-pointer font-medium">{item.ProStoreName}</div>
                                    </Link>
                                  </div>
                                  <div className="col-span-1 flex items-center">
                                    <div className="text-sm text-gray-900">{item.WorkName}</div>
                                  </div>
                                  <div className="col-span-1 flex items-center">
                                    <div className="text-sm text-gray-900">
                                      {(item.TotalPrice ?? 0) % 1 === 0 ?
                                        <>{fraction.format(item.TotalPrice ?? 0)} TL</>
                                        :
                                        <>{formatter.format(item.TotalPrice ?? 0)} TL</>
                                      }
                                    </div>
                                  </div>
                                  <div className="col-span-1 flex items-center justify-between ">
                                    {item.PaymentStatus === WorkPaymentStatus.COMPLETED ?
                                      <div className="w-36 text-center py-1 rounded-full bg-green-100 text-green-400 justify-center flex items-center text-sm font-medium">Tamamlandı</div>
                                      :
                                      item.PaymentStatus === WorkPaymentStatus.WAITING_FOR_INSTALLMENT_PAY ?
                                        <div className="w-36 text-center py-1 rounded-full bg-red-100 text-yellow-600 justify-center flex items-center text-sm font-medium">Ödeme Bekliyor</div>
                                        :
                                        item.PaymentStatus === WorkPaymentStatus.PAYMENT_DELAY ?
                                          <div className="w-36 text-center py-1 rounded-full bg-red-100 text-red-400 justify-center flex items-center text-sm font-medium">Geciken Ödeme</div>
                                          :
                                          item.PaymentStatus === WorkPaymentStatus.REFUNDED ?
                                            <div className="w-36 text-center py-1 rounded-full bg-green-100 text-green-400 justify-center flex items-center text-sm font-medium">İade Edildi</div>
                                            :
                                            item.PaymentStatus === WorkPaymentStatus.WAITING_FOR_REFUND ?
                                              <div className="w-36 text-center py-1 rounded-full bg-red-100 text-red-400 justify-center flex items-center text-sm font-medium">İade Bekliyor</div>
                                              :
                                              <></>
                                    }
                                    <Link to={`/hizmet-detay/${item.WorkId}`}>
                                      <ChevronRightIcon className="icon-md text-gray-900 hover:text-blue-400 duration-300 cursor-pointer" />
                                    </Link>
                                  </div>
                                </div>
                              ))
                            }
                          </>
                          :
                          <>
                            <EmptyList text="İş Bulunamadı" />
                          </>
                      }
                    </div>
                  </>
              }
            </div>
            <div className="col-span-2">
              {
                workEarningLoading ?
                  <Loading width="w-full" height="h-96" />
                  :
                  <>
                    <div className="portlet-wrapper">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-tiny text-black-400 font-medium">Hizmet-Kazanç Raporu</div>
                        <div className="flex gap-3 items-center">
                          <DatePicker
                            value={workEarningDate}
                            maxDate={new Date()}
                            setSelectedDate={(e) => { setWorkEarningDate(e) }}
                          />
                          <RefreshIcon className="text-blue-400 cursor-pointer icon-sm" onClick={() => { getWorkEarningChart(); }} />
                        </div>
                      </div>
                      <ReactApexChart options={workEarningChartOptions} series={workEarningChartOptions.series} type={'line'} height={350} />
                    </div>
                  </>
              }
            </div>
            <div className="col-span-2">
              {
                lastOrdersLoading ?
                  <Loading width="w-full" height="h-96" />
                  :
                  <>
                    <div className="portlet-wrapper h-96 overflow-y-auto custom-scrollbar">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-tiny text-black-400 font-medium">Son Siparişler</div>
                        <div className="flex items-center gap-4">
                          <RefreshIcon className="text-blue-400 cursor-pointer icon-sm" onClick={() => { getDashboardLastOrders(); }} />
                          <div className="text-blue-400 text-sm font-medium cursor-pointer" onClick={() => { history.push("/siparis-listesi"); }}>Tümünü Gör</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-4 py-5 border-t border-b border-gray-200">
                        <div className="col-span-1 flex items-center">
                          <div className="text-type-12-medium text-gray-700">Sipariş Bilgileri</div>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <div className="text-type-12-medium text-gray-700">Satıcı  Bilgileri</div>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <div className="text-type-12-medium text-gray-700">Müşteri Bilgisi</div>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <div className="text-type-12-medium text-gray-700">Satış Tutarı</div>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <div className="text-type-12-medium text-gray-700">Sipariş Durumu</div>
                        </div>
                      </div>
                      {
                        lastOrdersList.length > 0 ?
                          <>
                            {
                              lastOrdersList.map((item, index) => (
                                <div key={"lastworks_" + index} className="grid grid-cols-5 gap-4 py-5 border-b border-gray-200">
                                  <div className="col-span-1 flex items-center">
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">{"#" + item.OrderId}</div>
                                      <div className="text-sm mt-2 text-gray-900">{handleJsDate(item.CreatedDateJSTime)}</div>
                                    </div>
                                  </div>
                                  <div className="col-span-1 flex items-center">
                                    <div>
                                      {
                                        item.Sellers.map((sellerItem, index) => {
                                          if (index === item.Sellers.length - 1) {
                                            return (
                                              <span className="text-blue-400 underline text-sm cursor-pointer font-medium" onClick={() => { history.push(`/satici-detay/${sellerItem.SellerId}`) }}>{sellerItem.SellerStoreName}</span>
                                            )
                                          }
                                          else {
                                            return (
                                              <span className="text-blue-400 underline text-sm cursor-pointer font-medium" onClick={() => { history.push(`/satici-detay/${sellerItem.SellerId}`) }}>{sellerItem.SellerStoreName + ", "}</span>
                                            )
                                          }
                                        })
                                      }
                                    </div>
                                  </div>
                                  <div className="col-span-1 flex items-center gap-2">
                                    <Image src={item.BuyerPhotoUrl} className="w-8 h-8 rounded-full object-cover" />
                                    <div className="text-sm text-gray-900">{item.BuyerNameSurname}</div>
                                  </div>
                                  <div className="col-span-1 flex items-center">
                                    <div className="text-sm text-gray-900">
                                      {(item.TotalPrice ?? 0) % 1 === 0 ?
                                        <>{fraction.format(item.TotalPrice ?? 0)} TL</>
                                        :
                                        <>{formatter.format(item.TotalPrice ?? 0)} TL</>
                                      }
                                    </div>
                                  </div>
                                  <div className="col-span-1 flex items-center justify-between ">
                                    <div className={`${(item.StatusByte === 0 || item.StatusByte === 1) ? "text-yellow-600 bg-yellow-100" : item.StatusByte === 2 ? "text-blue-400 bg-blue-100" : item.StatusByte === 3 ? "text-green-400 bg-green-100" : item.StatusByte === 4 && "text-gray-900 bg-gray-100"} font-medium text-center text-sm w-36 rounded-full py-1`}>
                                      {item.Status}
                                    </div>
                                    <Link to={`/siparis-detay/${item.OrderId}`}>
                                      <ChevronRightIcon className="icon-md text-gray-900 hover:text-blue-400 duration-300 cursor-pointer" />
                                    </Link>
                                  </div>
                                </div>
                              ))
                            }
                          </>
                          :
                          <>
                            <EmptyList text="Sipariş Bulunamadı" />
                          </>
                      }
                    </div>
                  </>
              }
            </div>
            <div className="col-span-2">
              {
                orderEarningLoading ?
                  <Loading width="w-full" height="h-96" />
                  :
                  <>
                    <div className="portlet-wrapper">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-tiny text-black-400 font-medium">Satış-Kazanç Raporu</div>
                        <div className="flex gap-3 items-center">
                          <DatePicker
                            value={orderEarningDate}
                            maxDate={new Date()}
                            setSelectedDate={(e) => { setOrderEarningDate(e) }}
                          />
                          <RefreshIcon className="text-blue-400 cursor-pointer icon-sm" onClick={() => { getOrderEarningChart(); }} />
                        </div>
                      </div>
                      <ReactApexChart options={orderEarningChartOptions} series={orderEarningChartOptions.series} type={'line'} height={350} />
                    </div>
                  </>
              }
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          {
            totalCountsLoading ?
              <Loading width="w-full" height="h-40" />
              :
              <>
                <div className="portlet-wrapper">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-tiny text-black-400 font-medium">Ürün İlanları</div>
                    <RefreshIcon className="icon-sm text-blue-400 cursor-pointer" onClick={() => { getDashboardTotalCounts(); }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="col-span-1">
                      <div className="text-gray-700 font-medium text-sm">Onay Bekleyen İlan Sayısı</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="text-tiny text-black-400 font-medium ">
                          {(totalCounts?.WaitingApprovalAdvertCount ?? 0) % 1 === 0 ?
                            <>{fraction.format(totalCounts?.WaitingApprovalAdvertCount ?? 0)} </>
                            :
                            <>{formatter.format(totalCounts?.WaitingApprovalAdvertCount ?? 0)} </>
                          }
                        </div>
                        {
                          totalCounts && Math.abs((totalCounts?.LastDaysWaitingApprovalAdvertCount ?? 0)) > 0 &&
                          <div className={`${(totalCounts?.LastDaysWaitingApprovalAdvertCount ?? 0) > 0 ? "text-green-400" : "text-red-400"} flex items-center gap-1 font-medium`}>
                            {
                              (totalCounts?.LastDaysWaitingApprovalAdvertCount ?? 0) > 0 ?
                                <ChevronFillIcon className="w-2 h-2 transform rotate-180" />
                                :
                                <ChevronFillIcon className="w-2 h-2" />
                            }
                            <div className="text-sm">{(totalCounts?.LastDaysWaitingApprovalAdvertCount ?? 0)}</div>
                          </div>
                        }
                      </div>
                      <Link to={`/onay-bekleyen-ilanlar`} className="text-sm font-medium text-blue-400 cursor-pointer flex items-center gap-2 mt-2">
                        <div>Onay Bekleyen İlanlar</div>
                        <ChevronRightFill className="w-2 h-2" />
                      </Link>
                    </div>
                    <div className="col-span-1">
                      <div className="text-gray-700 font-medium text-sm">Onaylı İlan Sayısı</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="text-tiny text-black-400 font-medium">
                          {(totalCounts?.ApprovedAdvertCount ?? 0) % 1 === 0 ?
                            <>{fraction.format(totalCounts?.ApprovedAdvertCount ?? 0)} </>
                            :
                            <>{formatter.format(totalCounts?.ApprovedAdvertCount ?? 0)} </>
                          }
                        </div>
                        {
                          totalCounts && Math.abs((totalCounts?.LastDaysApprovedAdvertCount ?? 0)) > 0 &&
                          <div className={`${(totalCounts?.LastDaysApprovedAdvertCount ?? 0) > 0 ? "text-green-400" : "text-red-400"} flex items-center gap-1 font-medium`}>
                            {
                              (totalCounts?.LastDaysApprovedAdvertCount ?? 0) > 0 ?
                                <ChevronFillIcon className="w-2 h-2 transform rotate-180" />
                                :
                                <ChevronFillIcon className="w-2 h-2" />
                            }
                            <div className="text-sm">{(totalCounts?.LastDaysApprovedAdvertCount ?? 0)}</div>
                          </div>
                        }
                      </div>
                      <Link to={`/urun-ilan-listesi`} className="text-sm font-medium text-blue-400 cursor-pointer flex items-center gap-2 mt-2">
                        <div>Ürün İlan Listesi</div>
                        <ChevronRightFill className="w-2 h-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </>
          }
          {
            proRecoursesLoading ?
              <Loading width="w-full" height="h-96" />
              :
              <>
                <div className="portlet-wrapper h-96 overflow-y-auto custom-scrollbar">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-tiny text-black-400 font-medium">Profesyonel Başvuruları</div>
                    <div className="flex items-center gap-2">
                      <RefreshIcon className="icon-sm text-blue-400 cursor-pointer" onClick={() => { getDashboardProRecourses(); }} />
                      <Link to={"/pro-uye-basvuru-listesi"}>
                        <div className="text-blue-400 font-medium cursor-pointer text-sm">Tümünü Gör</div>
                      </Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-5">
                    <div className="col-span-1 flex items-center">
                      <div className="text-gray-400 font-medium text-sm">Şirket Adı</div>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <div className="text-gray-400 font-medium text-sm">Başvuru Durumu</div>
                    </div>
                  </div>
                  {
                    proRecoursesList.length > 0 ?
                      <>
                        {
                          proRecoursesList.map((item) => (
                            <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-5">
                              <div className="col-span-1 flex items-center gap-2">
                                <Image isAvatar src={item.PhotoUrl} className="w-8 h-8 object-cover rounded-full" />
                                <div className="text-sm text-gray-900 font-medium">{item.StoreName}</div>
                              </div>
                              <div className="col-span-1 flex items-center justify-between">
                                {
                                  item.Status === 1 ?
                                    <div className="rounded-full py-1 px-6 bg-red-100 text-yellow-600 text-sm truncate font-medium">Kayıt Aşamasında</div>
                                    :
                                    item.Status === 2 ?
                                      <div className="rounded-full py-1 px-6 bg-red-100 text-yellow-600 text-sm truncate font-medium">Onay Bekliyor</div>
                                      :
                                      <></>
                                }
                                <Link to={{ pathname: `${"/pro-profesyonel-detay/" + item.Id}`, state: { prevTitle: "Anasayfa", prevPath: window.location.pathname, tabId: 1 } }} >
                                  <ChevronRightIcon className="icon-md text-gray-900 hover:text-blue-400 duration-300 cursor-pointer" />
                                </Link>
                              </div>
                            </div>
                          ))
                        }
                      </>
                      :
                      <>
                        <EmptyList text={"Başvuru Bulunamadı"} />
                      </>
                  }
                </div>
              </>
          }
          {
            sellerRecoursesLoading ?
              <Loading width="w-full" height="h-96" />
              :
              <>
                <>
                  <div className="portlet-wrapper h-96 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-tiny text-black-400 font-medium">Mağaza Başvuruları</div>
                      <div className="flex items-center gap-2">
                        <RefreshIcon className="icon-sm text-blue-400 cursor-pointer" onClick={() => { getDashboardSellerRecourses(); }} />
                        <Link to={"/satici-basvuru-listesi"}>
                          <div className="text-blue-400 font-medium cursor-pointer text-sm">Tümünü Gör</div>
                        </Link>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-200 py-5">
                      <div className="col-span-1 flex items-center">
                        <div className="text-gray-400 font-medium text-sm">Şirket Adı</div>
                      </div>
                      <div className="col-span-1 flex items-center">
                        <div className="text-gray-400 font-medium text-sm">Başvuru Durumu</div>
                      </div>
                    </div>
                    {
                      sellerRecoursesList.length > 0 ?
                        <>
                          {
                            sellerRecoursesList.map((item) => (
                              <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-5">
                                <div className="col-span-1 flex items-center gap-2">
                                  <Image isAvatar src={item.PhotoUrl} className="w-8 h-8 object-cover rounded-full" />
                                  <div className="text-sm text-gray-900 font-medium">{item.StoreName}</div>
                                </div>
                                <div className="col-span-1 flex items-center justify-between">
                                  {
                                    item.Status === 1 ?
                                      <div className="rounded-full py-1 px-6 bg-red-100 text-yellow-600 text-sm truncate font-medium">Kayıt Aşamasında</div>
                                      :
                                      item.Status === 2 ?
                                        <div className="rounded-full py-1 px-6 bg-red-100 text-yellow-600 text-sm truncate font-medium">Onay Bekliyor</div>
                                        :
                                        <></>
                                  }
                                  <Link to={{ pathname: `${"/satici-detay/" + item.Id}`, state: { prevTitle: "Anasayfa", prevPath: window.location.pathname, tabId: 1 } }} >
                                    <ChevronRightIcon className="icon-md text-gray-900 hover:text-blue-400 duration-300 cursor-pointer" />
                                  </Link>
                                </div>
                              </div>
                            ))
                          }
                        </>
                        :
                        <>
                          <EmptyList text={"Başvuru Bulunamadı"} />
                        </>
                    }
                  </div>
                </>
              </>
          }
        </div>
      </div>
    </div>
  )
}
