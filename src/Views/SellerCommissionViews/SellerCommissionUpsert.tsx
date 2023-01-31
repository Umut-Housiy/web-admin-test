import { Label } from "../../Components/Label";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Button } from "../../Components/Button";
import { useHistory, useParams } from "react-router-dom";
import ApiService from "../../Services/ApiService";
import { Dropdown } from "../../Components/Dropdown";
import { Loading } from "../../Components/Loading";
import { DateRangePicker } from "../../Components/DateRangePicker";
import { TrashIcon } from "../../Components/Icons";

type CategoryOption = {
  key: string; value: string; commissionPercentage: number;
}

type SellerCommissionDiscountByCategory = {
  id?: number;
  selectedCategory: CategoryOption;
  startDate: Date;
  endDate: Date;
  discountRate: string;
  finishPrice: string;
  finishQuantity: string;
}

const initializedSellerCommissionDiscountByCategory: SellerCommissionDiscountByCategory = {
  selectedCategory: {key: "-1", value: "Seçiniz...", commissionPercentage: 0},
  startDate: new Date(),
  endDate: new Date(),
  discountRate: "0",
  finishPrice: "",
  finishQuantity: "",
}

const getIntPositive = (text: string) => text.replace(/[^0-9]+/g, '');
const formatPoints = (text: string) => text.split(".").reduce((prev, curr, i) => prev + (i === 1 ? "." : "") + curr);
const getFloatPositive = (text: string) => formatPoints(text.replace(/[^0-9.]+/g, ''));

type SellerCommissionItemProps = {
  item: SellerCommissionDiscountByCategory;
  onUpdate: (item: SellerCommissionDiscountByCategory) => void;
  categoryOptions: CategoryOption[];
  onDelete: () => void;
}

function SellerCommissionItem(props: SellerCommissionItemProps) {
  const {item, onUpdate, categoryOptions, onDelete} = props;
  return (
    <div className="border-t-2 last:border-b-2 border-gray-200 py-2">
      <div className="w-full">
        <div className="w-full grid grid-cols-12 gap-4 mt-2">
          <div className="col-span-4">
            <Label title="Kategori" withoutDots isRequired/>
            <Dropdown
              className="w-full text-black-700 text-sm"
              label={item.selectedCategory.value}
              items={categoryOptions}
              onItemSelected={option => onUpdate({...item, selectedCategory: option as CategoryOption})}/>
          </div>
          <div className="col-span-7">
            <Label title="Komisyon İndirimin Geçerlilik Tarihi" withoutDots/>
            <DateRangePicker
              setMaxDate={(date) => onUpdate({...item, endDate: date})}
              setMinDate={(date) => onUpdate({...item, startDate: date})}
              minValue={item.startDate}
              maxValue={item.endDate}
            />
          </div>
          <div className="col-span-1 flex items-center justify-center pt-5">
            <TrashIcon
              className="icon-md hover:text-blue-400 cursor-pointer transition-all"
              onClick={onDelete}
            />
          </div>
        </div>
        <div className="w-full grid grid-cols-3 gap-4 mt-2">
          <div className="col-span-1 flex flex-row">
            <div className="w-2/3 pr-4">
              <Label title="Komisyon İndirim Oranı" withoutDots isRequired/>
              <input
                type="text"
                className="w-full rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
                placeholder="Komisyon İndirimi Oranı"
                value={item.discountRate}
                onChange={({target: {value}}) =>
                  onUpdate({...item, discountRate: getFloatPositive(value)})}
              />
            </div>
            <div className="w-1/3">
              <Label title="Yeni Oran" withoutDots/>
              <p
                className="p text-type-20-medium text-gray-700">{`%${item.selectedCategory.commissionPercentage} -> %${item.selectedCategory.commissionPercentage * (100 - parseFloat(item.discountRate)) / 100}`}</p>
            </div>
          </div>
          <div className="col-span-1">
            <Label title="İndirim Bitiş Fiyatı" withoutDots/>
            <input type="text"
                   className="w-full rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
                   value={item.finishPrice}
                   onChange={({target: {value}}) => onUpdate({...item, finishPrice: getFloatPositive(value)})}
            />
          </div>
          <div className="col-span-1">
            <Label title="İndirim Bitiş Ürün Sayısı" withoutDots/>
            <input
              type="text"
              className="w-full rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
              value={item.finishQuantity}
              onChange={({target: {value}}) => onUpdate({...item, finishQuantity: getIntPositive(value)})}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SellerCommissionUpsert() {
  const {id} = useParams<{ id: string }>();
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const history = useHistory();

  const [isBusy, setIsBusy] = useState<boolean>(false);

  const [sellerOptions, setSellerOptions] = useState<{ key: string; value: string; }[]>([]);
  const [sellerCategoryOptions, setSellerCategoryOptions] = useState<CategoryOption[]>([]);

  const [selectedSeller, setSelectedSeller] = useState({key: "-1", value: "Seçiniz..."});
  const [discountName, setDiscountName] = useState('');
  const [discountDescription, setDiscountDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [sellerCommissionDiscountByCategoryList, setSellerCommissionDiscountByCategoryList] = useState<SellerCommissionDiscountByCategory[]>([]);

  const addSellerCommissionDiscountByCategory = useCallback(() => {
    setSellerCommissionDiscountByCategoryList(list => [
      {...initializedSellerCommissionDiscountByCategory, startDate, endDate},
      ...list,
    ]);
  }, [startDate, endDate]);

  const upsertSellerCommissionDiscount = useCallback(async () => {
    setIsBusy(true);

    let response;
    if (!id) {
      response = await ApiService.createSellerCommissionDiscount(
        Number(selectedSeller.key),
        discountName,
        discountDescription,
        startDate.toISOString(),
        endDate.toISOString(),
        sellerCommissionDiscountByCategoryList.map((item) => ({
          SellerCategoryId: parseInt(item.selectedCategory.key),
          CommissionDiscount: parseFloat(item.discountRate),
          StartDate: item.startDate.toISOString(),
          EndDate: item.endDate.toISOString(),
          FinishPrice: item.finishPrice ? parseFloat(item.finishPrice) : 0,
          FinishItemQuantity: item.finishQuantity ? parseFloat(item.finishQuantity) : 0,
        })),
      );
    } else {
      response = await ApiService.updateSellerCommissionDiscount(
        parseInt(id),
        Number(selectedSeller.key),
        discountName,
        discountDescription,
        startDate.toISOString(),
        endDate.toISOString(),
        sellerCommissionDiscountByCategoryList.map((item) => ({
          Id: item.id || null,
          SellerCategoryId: parseInt(item.selectedCategory.key),
          CommissionDiscount: parseFloat(item.discountRate),
          StartDate: item.startDate.toISOString(),
          EndDate: item.endDate.toISOString(),
          FinishPrice: item.finishPrice ? parseFloat(item.finishPrice) : 0,
          FinishItemQuantity: item.finishQuantity ? parseFloat(item.finishQuantity) : 0,
        })),
      );
    }

    if (response.succeeded) {
      context.showModal({
        type: "Success",
        title: id ? "Değişiklikler kaydedildi." : "Mağaza komisyon indirimi oluşturuldu.",
        onClose: () => {
          context.hideModal();
          setIsBusy(false);
          history.push("/magaza-komisyon-oranlari-listesi");
        }
      });
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          setIsBusy(false);
        }
      });
    }
  }, [id, selectedSeller, discountName, discountDescription, startDate, endDate, sellerCommissionDiscountByCategoryList]);

  const onDeletePressed = useCallback(async (index: number) => {
    const item = sellerCommissionDiscountByCategoryList[index];
    context.showModal({
      type: "Question",
      title: "İçerik Sil",
      message: "İçerik silinecek. Emin misiniz?",
      onClick: async () => {
        let response;
        if (item.id) {
          response = await ApiService.deleteSellerCommissionDiscount(item.id);
        }
        if (!item.id || response.succeeded) {
          context.showModal({
            type: "Success",
            title: "İçerik silindi",
            onClose: () => {
              context.hideModal();
              setSellerCommissionDiscountByCategoryList(list => [...list.filter((_, i) => i !== index)]);
            },
          });
        } else {
          context.showModal({
            type: "Error",
            message: response.message,
            onClose: () => context.hideModal(),
          });
        }
        return true;
      },
      onClose: () => context.hideModal(),
    })

  }, [sellerCommissionDiscountByCategoryList]);


  const fetchSellerList = useCallback(async () => {
    const response = await ApiService.getSellerApprovedList(1, 9999, '', 1);
    if (response.succeeded) {
      return setSellerOptions(response.data.Data.map(seller => ({key: String(seller.Id), value: seller.StoreName})));
    }
    context.showModal({
      type: "Error",
      message: response.message,
      onClose: () => context.hideModal(),
    });
  }, []);

  const fetchSellerCategoryList = useCallback(async () => {
    const response = await ApiService.getSellerCategoryList(1, 9999, '', 1);
    if (response.succeeded) {
      return setSellerCategoryOptions(response.data.Data.map(item => ({
        key: String(item.Id),
        value: item.CategoryName,
        commissionPercentage: item.CommissionPercentage,
      })));
    }
  }, []);

  useEffect(() => {
    fetchSellerList();
    fetchSellerCategoryList();
  }, []);

  const fetchById = useCallback(async () => {
    if (!id || !sellerCategoryOptions.length || !sellerOptions.length) return;
    setIsBusy(true);
    await ApiService.getByIdSellerCommissionDiscount(parseInt(id))
      .then(((response) => {
        if (response.succeeded && response.data) {
          const sellerCommission = response.data;
          setSelectedSeller(sellerOptions.find(({key}) => key === String(sellerCommission.SellerId))
            || {key: "-1", value: "Seçiniz..."},
          );
          setDiscountName(sellerCommission.CommissionDiscountName);
          setDiscountDescription(sellerCommission.CommissionDiscountDescription);
          setStartDate(new Date(sellerCommission.StartDate));
          setEndDate(new Date(sellerCommission.EndDate));
          setSellerCommissionDiscountByCategoryList(sellerCommission.SellerCategories.map(item => ({
            id: item.Id,
            selectedCategory: sellerCategoryOptions.find(({key}) => key === String(item.SellerCategoryId)) || {
              key: "-1", value: "Seçiniz...", commissionPercentage: 0,
            },
            startDate: new Date(item.StartDate),
            endDate: new Date(item.EndDate),
            discountRate: String(item.CommissionDiscount),
            finishPrice: String(item.FinishPrice || ""),
            finishQuantity: String(item.FinishItemQuantity || ""),
          })));
        }
      })).finally(() => setIsBusy(false));
  }, [id, sellerCategoryOptions, sellerOptions]);

  useEffect(() => {
    fetchById()
  }, [fetchById]);

  return (
    <div className="content-wrapper mb-5">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          Yeni Mağaza Komisyon Oranı Oluştur
        </h2>
        <div className="border-t border-gray-200">
          <div className="w-full flex flex-row mt-4">
            <div className="w-1/4 pr-3">
              <Label title="Mağaza" withoutDots isRequired/>
              {isBusy ? <Loading inputSm/> :
                <Dropdown
                  className="w-full text-black-700 text-sm"
                  label={selectedSeller.value}
                  items={sellerOptions}
                  onItemSelected={item => setSelectedSeller(item)}/>}
            </div>
            <div className="w-1/2 ml-1">
              <Label title="Komisyon İndirimin Geçerlilik Tarihi" withoutDots isRequired/>
              <div className="w-full">
                {isBusy ? <Loading inputSm/> :
                  <DateRangePicker
                    setMaxDate={setEndDate}
                    setMinDate={setStartDate}
                    minValue={startDate}
                    maxValue={endDate}
                  />}
              </div>
            </div>
          </div>
          <Label className="mt-4" title="Komisyon İndirimi İsmi" withoutDots isRequired/>
          {isBusy ? <Loading inputSm/> :
            <input
              type="text"
              className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
              placeholder="Komisyon indirimi ismi"
              value={discountName}
              onChange={({target: {value}}) => setDiscountName(value)}
            />}
          <Label className="mt-4" title="Komisyon İndirimi Açıklaması" withoutDots/>
          {isBusy ? <Loading inputSm/> :
            <input
              type="text"
              className="w-1/2 rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
              placeholder="Komisyon indirimi açıklaması"
              value={discountDescription}
              onChange={({target: {value}}) => setDiscountDescription(value)}
            />}
        </div>
        <div className="mt-4 border-t border-b border-gray-200">
          <div className="w-full flex flex-row items-center justify-between py-4">
            <Label title={`Kategori Komisyon İndirimleri (${sellerCommissionDiscountByCategoryList.length})`}
                   withoutDots/>
            <Button isLoading={isBusy}
                    textTiny buttonSm
                    className="w-48"
                    text="Yeni Ekle"
                    onClick={addSellerCommissionDiscountByCategory}
                    design="button-blue-400"/>
          </div>
          {
            sellerCommissionDiscountByCategoryList.map((item, index) => (
              <SellerCommissionItem
                key={`key_${index}`}
                item={item}
                onUpdate={(updated) => {
                  setSellerCommissionDiscountByCategoryList(list => {
                    list[index] = updated;
                    return [...list];
                  })
                }}
                categoryOptions={sellerCategoryOptions}
                onDelete={() => onDeletePressed(index)}
              />
            ))
          }
        </div>

        <div className="flex mt-4">
          <Button isLoading={isBusy} textTiny
                  className="w-24 ml-auto"
                  text="Vazgeç"
                  color="text-gray-400"
                  onClick={() => history.push("/magaza-komisyon-oranlari-listesi")}/>
          <Button isLoading={isBusy} textTiny
                  className="w-72"
                  text="Kaydet ve Tamamla"
                  design="button-blue-400"
                  onClick={() => upsertSellerCommissionDiscount()}
          />
        </div>
      </div>
    </div>
  );
}
