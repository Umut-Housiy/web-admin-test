import { FunctionComponent, useContext, useEffect, useRef, useState } from "react"
import { useHistory, useParams } from "react-router-dom";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import { TextArea } from "../Components/TextArea";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import ReactNumeric from 'react-numeric';
import { autonNumericOptions } from "../Services/Functions";
import { DateRangePicker } from "../Components/DateRangePicker";
import { Dropdown } from "../Components/Dropdown";
import { ToggleButton } from "../Components/ToggleButton";
import { Button } from "../Components/Button";
import { CheckIcon, PlusIcon, TrashIcon } from "../Components/Icons";
import { Modal } from "../Components/Modal";
import { Table } from "../Components/Table";
import { SiteUserModel } from "../Models";

interface RouteParams {
  id: string,
}

export const DiscountCouponEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(true);

  const [processLoading, setProcessLoading] = useState<boolean>(true);

  const [couponId] = useState<number>(Number(params?.id ?? "0"));

  const [title, setTitle] = useState<string>("");

  const [description, setDescription] = useState<string>("");

  const [minPrice, setMinPrice] = useState<number>(0);

  const [startDate, setStartDate] = useState<Date>(new Date());

  const [endDate, setEndDate] = useState<Date>(new Date());

  const [discount, setDiscount] = useState<number>(0);

  const [code, setCode] = useState<string>("");

  const couponTypeOptions = [
    { key: "1", value: "Özel Üye Listesi Oluştur" },
    { key: "2", value: "Yeni Üyeler" },
    { key: "3", value: "Sepetinde Ürün Olan Üyeler" },
    { key: "4", value: "Son 3 gün İçerisinde Sipariş Oluşturmuş Üyeler" },
    { key: "5", value: "Tüm üyeler" },
  ];

  const [selectedType, setSelectedType] = useState<{ key: string, value: string }>({ key: "0", value: "Seçiniz..." });

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [isSms, setIsSms] = useState<boolean>(true);

  const [isPush, setIsPush] = useState<boolean>(true);

  const tableEl = useRef<any>();

  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);

  const [userTotalCount, setUserTotalCount] = useState<number>(0);

  const [tempSelectedUserList, setTempSelectedUserList] = useState<SiteUserModel[]>([]);

  const [selectedUserList, setSelectedUserList] = useState<SiteUserModel[]>([]);

  useEffect(() => {
    if (couponId > 0) {
      getDiscountCouponDetail();
    }
    else {
      setLoading(false);
      setProcessLoading(false);
    }
  }, [couponId]);

  const getDiscountCouponDetail = async () => {

    const _result = await ApiService.getDiscountCouponDetail(couponId);

    if (_result.succeeded === true) {

      setTitle(_result.data.Title);
      setDescription(_result.data.Description);
      setMinPrice(_result.data.MinimumCartPrice);
      setStartDate(new Date(_result.data.StartDateJS));
      setEndDate(new Date(_result.data.EndDateJS));
      setDiscount(_result.data.Discount);
      setCode(_result.data.Code);

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/indirim-kuponlari"); }
      });
    }
  }

  const createDiscountCoupon = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createDiscountCoupon(title, description, String(minPrice), startDate.getTime(), endDate.getTime(), String(discount), code, Number(selectedType.key), selectedUserList.map(x => { return x.Id }), isSms, isPush);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kupon başarıyla oluşturuldu.",
        onClose: () => { context.hideModal(); history.push("/indirim-kuponlari"); }
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

  const updateDiscountCoupon = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateDiscountCoupon(couponId, title, description, startDate.getTime(), endDate.getTime());

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kupon başarıyla düzenlendi.",
        onClose: () => { context.hideModal(); history.push("/indirim-kuponlari"); }
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

  const getSiteUserList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getSiteUserList(page, take, searchText, order);

    if (_result.succeeded === true) {
      setUserTotalCount(_result.data.TotalCount);

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

  const removeUserFromArray = (Id) => {
    let tempList = selectedUserList.filter(x => x.Id != Id);
    setSelectedUserList([...tempList]);
  }

  const handleOpenAddUserModal = () => {
    setTempSelectedUserList([...selectedUserList]);
    setShowAddUserModal(true);
  }

  const handleAddTempSelectedUserList = (item) => {
    let tempList = tempSelectedUserList;
    tempList.push(item);
    setTempSelectedUserList([...tempList]);
  }

  const handleRemoveTempSelectedUserList = (item) => {
    let tempList = tempSelectedUserList.filter(x => x.Id !== item.Id);
    setTempSelectedUserList([...tempList]);
  }

  const handleAddSelectedUserList = () => {
    setSelectedUserList([...tempSelectedUserList]);
    setShowAddUserModal(false);
  }

  const handleJsTime = (JsTime) => {
    var time = new Date(JsTime);
    return time.toLocaleDateString() ?? "";
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-4 border-b border-gray-200">{couponId > 0 ? "İndirim Kuponu Düzenle" : "İndirim Kuponu Oluştur"} </h2>
        <div className="w-1/2">
          <Label className="mt-4" title="Kupon Adı" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={title} onChange={(e) => { setTitle(e.target.value); }} />
          }
          <Label className="mt-4" title="Kupon Açıklaması" withoutDots isRequired />
          {
            loading ?
              <Loading inputMd />
              :
              <TextArea
                setText={setDescription}
                text={description}
                maxCount={200}
              />
          }
          <Label className="mt-4" title="Min. Alışveriş Tutarı" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <ReactNumeric
                value={minPrice}
                preDefined={autonNumericOptions.TL}
                onChange={(e, value: number) => { setMinPrice(value) }}
                className="form-input"
              />
          }
          <Label className="mt-4" title="Geçerlilik Tarihi" withoutDots isRequired />
          {
            loading ?
              <div className="flex gap-4">
                <Loading inputSm />
                <Loading inputSm />
              </div>
              :
              <DateRangePicker
                setMaxDate={setEndDate}
                setMinDate={setStartDate}
                minValue={startDate}
                maxValue={endDate}
              />
          }
          <Label className="mt-4" title="Kupon Bedeli (Tutar)" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <ReactNumeric
                value={discount}
                preDefined={autonNumericOptions.TL}
                onChange={(e, value: number) => { setDiscount(value) }}
                className="form-input"
              />
          }
          <Label className="mt-4" title="Oluşturulan Kupon Kodu" withoutDots isRequired />
          {
            loading ?
              <Loading inputSm />
              :
              <input className="form-input" type="text" value={code} onChange={(e) => { setCode(e.target.value); }} />
          }
          {!params.id ? (
            <>
              <Label className="mt-4" title="Kupon Tanımlanacak Üye Listesi" withoutDots isRequired />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <Dropdown
                    isDropDownOpen={currentOpenedFilterButton === "typeSelect"}
                    onClick={() => { setCurrentOpenedFilterButton("typeSelect"); }}
                    className="w-full text-black-700 text-sm border-gray-300"
                    label={selectedType.value}
                    items={couponTypeOptions}
                    onItemSelected={item => { setSelectedType(item); }} />
              }
            </>
          ) : null}
        </div>
        {
          selectedType.key === "1" &&
          <>
            <div className="border-t border-gray-200 mt-4 py-4">
              <h2 className="pb-4 ">Özel Üye Listesi</h2>
              <Button buttonMd textTiny color="text-blue-400" className="w-60" design="button-blue-100" text="Üye Seç" hasIcon icon={<PlusIcon className="icon-sm mr-2" />} onClick={() => { handleOpenAddUserModal(); }} />
              <div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4 mt-4">
                <div className="lg:col-span-1 flex items-center">
                  <span className="p-sm-gray-400">
                    Üye Adı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Üyelik Tarihi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Telefon Numarası
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Doğum Tarihi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Sepetindeki Ürün Sayısı
                  </span>
                </div>
              </div>
              {
                selectedUserList.map((e, i) => (
                  <div key={"list" + i} className="lg:grid-cols-5 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
                    <div className="lg:col-span-1 flex items-center">
                      <p className="p-sm">
                        {e.NameSurname}
                      </p>
                    </div>
                    <div className="lg:col-span-1">
                      <p className="p-sm">
                        {handleJsTime(e.CreatedDateJS)}
                      </p>
                    </div>
                    <div className="lg:col-span-1">
                      <p className="p-sm">
                        {e.Phone}
                      </p>
                    </div>
                    <div className="lg:col-span-1">
                      <p className="p-sm">
                        {handleJsTime(e.BirthDateJS)}
                      </p>
                    </div>
                    <div className="lg:col-span-1 flex justify-between">
                      <p className="p-sm">
                        {e.CartProductCount}
                      </p>
                      <div className="text-gray-700 flex gap-2 items-center">
                        <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all " onClick={() => { removeUserFromArray(e.Id) }} />
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </>
        }
        <div className="w-1/2">
          {
            loading ?
              <Loading textMd />
              :
              <div className="flex mt-4  align-items-center">
                <div className="text-gray-600 text-sm">SMS olarak bildir</div>
                <div className="ml-auto">
                  <ToggleButton onClick={() => { setIsSms(!isSms) }} defaultValue={isSms} />
                </div>
              </div>
          }
          {
            loading ?
              <Loading textMd />
              :
              <div className="flex mt-4  align-items-center">
                <div className="text-gray-600 text-sm">Push gönder</div>
                <div className="ml-auto">
                  <ToggleButton onClick={() => { setIsPush(!isPush) }} defaultValue={isPush} />
                </div>
              </div>
          }
        </div>
        <div className="flex mt-6">
          <Button isLoading={processLoading} textTiny className="w-24 ml-auto" text="Vazgeç" color="text-gray-400" onClick={() => { history.push("/indirim-kuponlari"); }} />
          {
            couponId > 0 ?
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Düzenle" onClick={() => { updateDiscountCoupon(); }} />
              :
              <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Oluştur" onClick={() => { createDiscountCoupon(); }} />
          }
        </div>
      </div>
      <Modal
        modalType="fixedMd"
        showModal={showAddUserModal}
        onClose={() => { setShowAddUserModal(false); }}
        title="Listeden Üye Seç"
        body=
        {
          <div className="">
            <div className="flex">
              <div className="flex ml-auto mt-3 py-3">
                <div className="text-sm text-gray-900 mr-2 my-auto">{tempSelectedUserList.length}/{userTotalCount}</div>
                <div className="p-sm-gray-700 w-36 my-auto">Üye Seçildi</div>
                <Button buttonMd block className="my-auto " design=" button-blue-400 p-2 " text="Seçili Üyeleri Ekle" onClick={() => { handleAddSelectedUserList(); }} />
              </div>
            </div>
            <Table
              ref={tableEl}
              key={"table1"}
              emptyListText={"Üye Bulunamadı"}
              getDataFunction={getSiteUserList}
              header={<div className=" lg:grid-cols-7 px-2 border-b border-t min-h-20 py-5 border-gray-200 hidden lg:grid gap-4">
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Üye Adı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Üyelik Tarihi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Telefon Numarası
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Doğum Tarihi
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Sepetindeki Ürün Sayısı
                  </span>
                </div>
                <div className="lg:col-span-1">
                  <span className="p-sm-gray-400">
                    Toplam Alışveriş Tutarı
                  </span>
                </div>
              </div>}
              renderItem={(e, i) => {
                return <div className=" lg:grid-cols-7 px-2 border-b border-t min-h-20 py-5 border-gray-200 hidden lg:grid gap-4" key={i}>
                  <div className="lg:col-span-1">
                    <span className="p-sm">
                      {e.NameSurname}
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm">
                      {handleJsTime(e.CreatedDateJS)}
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm ">
                      {e.Phone}
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm ">
                      {handleJsTime(e.BirthDateJS)}
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm ">
                      {e.CartProductCount}
                    </span>
                  </div>
                  <div className="lg:col-span-1">
                    <span className="p-sm ">
                      {e.TotalShoppingPrice}
                    </span>
                  </div>
                  <div className="lg:col-span-1 flex justify-end ">
                    <div className=" flex gap-2 items-center">
                      {
                        (tempSelectedUserList?.find(x => x.Id === e.Id) !== undefined) ?
                          <Button buttonSm block className="p-6" design="button-blue-400" text="" hasIcon icon={<CheckIcon className="icon-sm" />} onClick={() => { handleRemoveTempSelectedUserList(e); }} />
                          :
                          <Button buttonSm block className="p-6" color="text-blue-400" design="button-blue-100" text="Seç" onClick={() => { handleAddTempSelectedUserList(e); }} />
                      }
                    </div>
                  </div>
                </div>
              }}
            />
          </div>
        }
      />
    </div>
  )
}
