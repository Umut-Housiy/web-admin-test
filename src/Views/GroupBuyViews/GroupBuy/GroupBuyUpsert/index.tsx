import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SharedContext, SharedContextProviderValueModel } from "../../../../Services/SharedContext";
import { useHistory } from "react-router";
import { CustomDropdown, Option } from "../../../../Components/CustomDropdown";
import { Button } from "../../../../Components/Button";
import ApiService from "../../../../Services/ApiService";
import { ProductAdvertListInnerModel } from "../../../../Models";
import { Label } from "../../../../Components/Label";
import { Image } from "../../../../Components/Image";
import { fraction } from "../../../../Services/Functions";
import { Loading } from "../../../../Components/Loading";
import { getNumericPositive, getTimeFormatted } from "../../../../utils/formatters";
import ReactDatePicker from "react-datepicker";
import './index.css';
import tr from 'date-fns/locale/tr';

export function ExampleCustomTimeInput(props: { value?: string; date?: Date; onChange?: (text: string) => void; }) {
  const [value, setValue] = useState(props.value || '00:00');
  return (
    <input
      value={value}
      style={{color: value.length !== 5 ? '#E31A1A' : undefined}}
      className="rounded-lg focus:outline-none border border-gray-300 p-2 text-gray-900 text-sm w-full"
      onChange={({target: {value}}) => setValue(getTimeFormatted(value))}
      onBlur={() => props.onChange && props.onChange(getTimeFormatted(value))}
      onKeyDown={({key}) => key === 'Enter' && props.onChange && props.onChange(getTimeFormatted(value))}
    />
  )
}

export function GroupBuyUpsert() {
  const {id} = useParams<{ id: string }>();
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const history = useHistory();

  const [busyCount, setBusyCount] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [deposit, setDeposit] = useState<string>('0');
  const [groupBuyingPrice, setGroupBuyingPrice] = useState('0');
  const [canGroupStartFrom, setCanGroupStartFrom] = useState<Date>(new Date());

  //#region Product Advert
  const [selectedProductAdvertOption, setSelectedProductAdvertOption] = useState<Option>({key: '-1', value: ''});
  const [productAdvertList, setProductAdvertList] = useState<ProductAdvertListInnerModel[]>([]);
  const [oldProductAdvertId, setOldProductAdvertId] = useState('');

  const selectedProductAdvert = useMemo(() => {
    return productAdvertList.find(({AdvertId}) => AdvertId.toString() === selectedProductAdvertOption.key);
  }, [selectedProductAdvertOption]);

  const getProductAdvertOptionList = useCallback(async (): Promise<Option[]> => {
    const response = await ApiService.getProductAdvertList(1, 9999, '', 1);

    if (response.succeeded) {
      setProductAdvertList(response.data.Data);
      return response.data.Data.map(item => ({
        key: item.AdvertId.toString(), value: `${item.ProductName} - ${item.SellerName}`,
        element: (
          <div className="product-advert-option">
            <Image src={item.ProductMainPhoto} className="border border-gray-300 rounded"/>
            <div className="flex flex-col ml-4">
              <span className="one-line text-type-14-medium">{item.ProductName}</span>
              <span className="one-line text-type-12-medium">{item.SellerName}</span>
            </div>
          </div>
        )
      }));
    }
    return [];
  }, []);

  useEffect(() => {
    if (oldProductAdvertId && productAdvertList.length) {
      const oldProductAdvert = productAdvertList.find((item) => item.AdvertId === Number(oldProductAdvertId));
      if (oldProductAdvert) {
        setSelectedProductAdvertOption({
          key: oldProductAdvert.AdvertId.toString(),
          value: `${oldProductAdvert.ProductName} - ${oldProductAdvert.SellerName}`
        });
      }
    }
  }, [oldProductAdvertId, productAdvertList]);
  //#endregion

  //#region Group Participant Setting
  const [selectedParticipantSettingOption, setSelectedParticipantSettingOption] = useState<Option>({
    key: '-1', value: '',
  });
  const [participantOptionList, setParticipantOptionList] = useState<Option[]>([]);
  const [oldParticipant, setOldParticipant] = useState('');

  const getParticipantSettingOptionList = useCallback(async (): Promise<Option[]> => {
    if (!selectedProductAdvert) return [];
    const response = await ApiService.getGroupParticipantSettingsList({
      page: 1, take: 9999, searchText: '', sellerId: Number(selectedProductAdvert.SellerId), includeGeneral: true
    });
    if (response.succeeded && response.data) {
      const options = response.data.Data.map((item) => ({
        key: String(item.Id), value: item.ParticipantCount.toString()
      }));
      setParticipantOptionList(options);
      return options;
    }
    return [];
  }, [selectedProductAdvert]);

  useEffect(() => {
    if (oldParticipant && participantOptionList.length) {
      const oldParticipantOption = participantOptionList.find((item) => item.value === oldParticipant);
      if (oldParticipantOption) {
        setSelectedParticipantSettingOption({...oldParticipantOption});
      }
    }
  }, [oldParticipant, participantOptionList]);
  //#endregion

  //#region Group Live Setting
  const [selectedLiveTimeSettingOption, setSelectedLiveTimeSettingOption] = useState<Option>({
    key: '-1', value: '',
  });
  const [liveTimeOptionList, setLiveTimeOptionList] = useState<Option[]>([]);
  const [oldLiveTime, setOldLiveTime] = useState('');

  const getLiveTimeSettingOptionList = useCallback(async (): Promise<Option[]> => {
    const response = await ApiService.getGroupLiveTimeSettingsByParticipantId({
      groupParticipantSettingId: Number(selectedParticipantSettingOption.key),
      sellerId: Number(selectedProductAdvertOption.key),
    });
    if (response.succeeded && response.data) {
      const options = response.data.map((item) => ({key: String(item.Id), value: item.LiveTime.toString()}));
      setLiveTimeOptionList(options);
      return options;
    }
    return [];
  }, [selectedProductAdvertOption, selectedParticipantSettingOption]);

  useEffect(() => {
    if (oldLiveTime && liveTimeOptionList.length) {
      const oldLiveTimeOption = liveTimeOptionList.find((item) => item.value === oldLiveTime);
      if (oldLiveTimeOption) {
        setSelectedLiveTimeSettingOption({...oldLiveTimeOption});
      }
    }
  }, [oldLiveTime, liveTimeOptionList]);
  //#endregion

  const upsertGroupParticipantSetting = useCallback(async () => {
    setBusyCount(x => x + 1);

    const body = {
      id: -1,
      name,
      description,
      groupParticipantSettingId: Number(selectedParticipantSettingOption.key),
      groupLifeHours: Number(selectedLiveTimeSettingOption.value),
      productAdvertId: Number(selectedProductAdvertOption.key),
      deposit: Number(deposit),
      groupBuyingPrice: Number(groupBuyingPrice),
      canGroupStartFrom: canGroupStartFrom.toISOString(),
    }

    let response;
    if (!id) {
      response = await ApiService.createGroupBuy(body);
    } else {
      body.id = Number(id);
      response = await ApiService.updateGroupBuy(body);
    }

    if (response.succeeded) {
      context.showModal({
        type: "Success",
        title: id ? "Değişiklikler kaydedildi." : "Group Alımı oluşturuldu.",
        onClose: () => {
          context.hideModal();
          setBusyCount(x => x - 1);
          history.push("/grup-alimlar");
        }
      });
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          setBusyCount(x => x - 1);
        }
      });
    }
  }, [
    name, description, selectedParticipantSettingOption, selectedLiveTimeSettingOption,
    selectedProductAdvertOption, deposit, groupBuyingPrice, canGroupStartFrom
  ]);

  const fetchById = useCallback(async () => {
    setBusyCount(x => x + 1);
    await ApiService.getGroupBuyById({id: Number(id)})
      .then((response => {
        const groupBuy = response.data;
        if (groupBuy) {
          setName(groupBuy.Name);
          setDescription(groupBuy.Description);
          setDeposit(groupBuy.Deposit.toString());
          setCanGroupStartFrom(new Date(groupBuy.CanGroupStartFrom));
          setGroupBuyingPrice(groupBuy.GroupBuyingPrice.toString());
          setOldProductAdvertId(groupBuy.ProductAdvertId.toString());
          setOldParticipant(groupBuy.ParticipantCountLimit.toString());
          setOldLiveTime(groupBuy.GroupLifeHours.toString());

        }
      }));
    setBusyCount(x => x - 1);
  }, [id]);

  useEffect(() => {
    if (id) fetchById()
  }, [id]);

  return (
    <div className="content-wrapper mb-5">
      <div className="portlet-wrapper">
        <h2 className="mb-5">
          {id ? 'Grup Alımı Düzenle' : 'Yeni Grup Alımı Oluştur'}
        </h2>
        <div className="flex flex-row w-full border-t border-gray-200">
          <div className="flex flex-col w-1/4">
            <Label className="mt-4" title="Grup Alım İsmi" withoutDots isRequired/>
            {busyCount ? <Loading inputSm/> :
              <input
                className="rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm w-full"
                type="text" placeholder="Grup Alım İsmi" value={name}
                onChange={({target: {value}}) => setName(value)}
              />}
          </div>
          <div className="flex flex-col w-1/4 pl-4">
            <Label className="mt-4" title="Grup Alım Açıklaması" withoutDots/>
            {busyCount ? <Loading inputSm/> :
              <input
                className="rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm w-full"
                type="text" placeholder="Grup Alım Açıklaması" value={description}
                onChange={({target: {value}}) => setDescription(value)}
              />}
          </div>
        </div>
        <div className="flex flex-row w-full">
          <div className="w-1/2">
            <Label className="mt-4" title="Ürün ilanı" withoutDots isRequired/>
            <CustomDropdown value={selectedProductAdvertOption} onChange={setSelectedProductAdvertOption}
                            placeholder="Seçiniz..." isLoading={!!busyCount}
                            getOptionList={getProductAdvertOptionList}
                            className="text-gray-900 product-advert-dropdown"/>
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-1/2">
                <Label className="mt-4" title="Grup Alım Fiyatı" withoutDots isRequired/>
                {busyCount ? <Loading inputSm/> :
                  <input
                    className="rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm w-full"
                    type="numeric" placeholder="Grup Alım Fiyatı" value={groupBuyingPrice}
                    onChange={({target: {value}}) => setGroupBuyingPrice(getNumericPositive(value))}
                  />}
              </div>
              <div className="flex flex-col w-1/2 pl-4">
                <Label className="mt-4" title="Deposit Miktari" withoutDots isRequired/>
                {busyCount ? <Loading inputSm/> :
                  <input
                    className="rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm w-full"
                    type="numeric" placeholder="Deposit Miktari" value={deposit}
                    onChange={({target: {value}}) => setDeposit(getNumericPositive(value))}
                  />}
              </div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex flex-col w-1/2">
                <Label className="mt-4" title="Katılımcı Ayarı" withoutDots isRequired/>
                <CustomDropdown value={selectedParticipantSettingOption} onChange={setSelectedParticipantSettingOption}
                                placeholder="Seçiniz..." isLoading={!!busyCount}
                                disabled={selectedProductAdvertOption.key === '-1'}
                                getOptionList={getParticipantSettingOptionList} className="text-gray-900"/>
              </div>
              <div className="flex flex-col w-1/2 pl-4">
                <Label className="mt-4" title="Süre Ayarı (saat)" withoutDots isRequired/>
                <CustomDropdown value={selectedLiveTimeSettingOption} onChange={setSelectedLiveTimeSettingOption}
                                placeholder="Seçiniz..." isLoading={!!busyCount}
                                disabled={selectedProductAdvertOption.key === '-1' || selectedParticipantSettingOption.key === '-1'}
                                getOptionList={getLiveTimeSettingOptionList} className="text-gray-900"/>
              </div>
            </div>
            <div className="flex flex-col W-1/2">
              <Label className="mt-4" title="Grup Alım Aktifleşme Tarihi" withoutDots isRequired/>
              <div className="w-full">
                {busyCount ? <Loading inputSm/> :
                  <ReactDatePicker
                    className="rounded-lg focus:outline-none border border-gray-300 p-3 text-gray-900 focus:ring-1 focus:ring-blue-400 text-sm"
                    style={{width: 300}}
                    selected={canGroupStartFrom}
                    onChange={setCanGroupStartFrom}
                    showTimeInput
                    dateFormat="d MMMM yyyy - HH:mm"
                    locale={tr}
                    customTimeInput={
                      <ExampleCustomTimeInput/>
                    }
                  />}
              </div>
            </div>

          </div>
          <div className="w-1/2 pl-4">
            <Label className="mt-4" title="Seçilen ürün ilanı detayı" withoutDots/>
            {selectedProductAdvert ? (
              <div className="flex flex-col w-full border border-gray-300 rounded p-2 selected-product-advert">
                <span className="text-type-16-medium one-line">{selectedProductAdvert.ProductName}</span>
                <div className="flex flex-row mt-3">
                  <Image src={selectedProductAdvert.ProductMainPhoto} className="border border-gray-300 rounded"/>
                  <div className="flex flex-col ml-4">
                    <div className="text-type-16-medium one-line">
                      <span className="text-type-14-regular font-normal inline mr-1">Mağaza:</span>
                      {selectedProductAdvert.SellerName}
                    </div>
                    <div className="text-type-16-medium one-line mt-2">
                      <span className="text-type-14-regular font-normal inline mr-1">Kategori:</span>
                      {selectedProductAdvert.Category}
                    </div>
                    <div className="text-type-16-medium one-line mt-2">
                      <span className="text-type-14-regular font-normal inline mr-1">Barkod No:</span>
                      {selectedProductAdvert.BarcodeNo}
                      <span className="text-type-14-regular font-normal inline mr-1 ml-4">Model No:</span>
                      {selectedProductAdvert.ModelNo}
                    </div>
                    <div className="text-type-16-medium one-line mt-2">
                      <span className="text-type-14-regular font-normal inline mr-1">Stok Kodu:</span>
                      {selectedProductAdvert.StockCode || '-'}
                      <span className="text-type-14-regular font-normal inline mr-1 ml-4">Stok Miktari:</span>
                      {selectedProductAdvert.StockCount}
                    </div>
                  </div>
                </div>
                <div className="text-type-16-medium one-line mt-2">
                  <span className="text-type-14-regular font-normal inline mr-1">Satış Fiyatı:</span>
                  {`${fraction.format(selectedProductAdvert.SalePrice)} ₺`}
                  <span className="text-type-14-regular font-normal inline mr-1 ml-4">Piyasa Satış Fiyatı:</span>
                  {`${fraction.format(selectedProductAdvert.MarketPrice)} ₺`}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex mt-4">
          <Button isLoading={!!busyCount} textTiny
                  className="w-24 ml-auto"
                  text="Vazgeç"
                  color="text-gray-400"
                  onClick={() => history.push("/grup-alimlar")}/>
          <Button isLoading={!!busyCount} textTiny
                  className="w-72"
                  text="Kaydet ve Tamamla"
                  design="button-blue-400"
                  onClick={() => upsertGroupParticipantSetting()}/>
        </div>
      </div>
    </div>
  );
}
