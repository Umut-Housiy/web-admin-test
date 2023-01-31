import { FunctionComponent, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../Components/Button";
import { AlertIcon } from "../Components/Icons";
import { Label } from "../Components/Label";
import { Loading } from "../Components/Loading";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";
import { fraction } from "../Services/Functions";
import { autonNumericOptions } from "../Services/Functions";
import ReactNumeric from 'react-numeric';
import { useStateEffect } from "../Components/UseStateEffect";
import { Dropdown } from "../Components/Dropdown";

interface RouteParams {
  id: string
}

export const ProductAdvertEdit: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const params = useParams<RouteParams>();

  const [loading, setLoading] = useState<boolean>(false);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const taxValues = [
    // { key: "0", value: "%0" },
    { key: "1", value: "%1" },
    { key: "8", value: "%8" },
    { key: "18", value: "%18" }
  ];

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [categoryId, setCategoryId] = useState<number>(0);

  const [barcode, setBarcode] = useState<string>("");

  const [stockCode, setStockCode] = useState<string>("");

  const [stockCount, setStockCount] = useState<number>(0);

  const [desi, setDesi] = useState<number>(0);

  const [cargoDay, setCargoDay] = useState<number>(0);

  const [marketPrice, setMarketPrice] = useState<number>(0);

  const [salePrice, setSalePrice] = useState<number>(0);

  const [taxPrice, setTaxPrice] = useState<number>(0);

  const [priceWoTax, setPriceWoTax] = useState<number>(0);

  const [selectedTaxValue, setselectedTaxValue] = useState<{ key: string, value: string }>({ key: "18", value: "%18" });

  const [buybox, setBuyBox] = useState<number>(0);

  useEffect(() => {
    getAdvertDetailForAdmin();
  }, []);

  useStateEffect(() => {
    var tax = parseInt(selectedTaxValue.key);
    if (tax <= 0) {
      setTaxPrice(0);
      setPriceWoTax(salePrice);
    }
    else {
      const _taxPrice = salePrice - (salePrice / (1 + (tax / 100)))
      setTaxPrice(_taxPrice);
      setPriceWoTax(salePrice - _taxPrice);
    }
  }, [selectedTaxValue, salePrice]);

  const getAdvertDetailForAdmin = async () => {
    setLoading(true);
    setProcessLoading(true);

    const _result = await ApiService.getAdvertDetailForAdmin(Number(params.id ?? "0"));

    if (_result.succeeded === true) {

      setCategoryId(_result.data.CategoryId);
      setBarcode(_result.data.BarcodeNo);
      setStockCode(_result.data.AdvertDetail.StockCode);
      setStockCount(_result.data.AdvertDetail.Stock);
      setDesi(_result.data.Desi);
      setCargoDay(_result.data.AdvertDetail.ShippingPrepareDay);
      setMarketPrice(_result.data.AdvertDetail.MarketPrice);
      setSalePrice(_result.data.AdvertDetail.SalePrice);
      setselectedTaxValue(taxValues.find(x => x.key === String(_result.data.TaxRate)) ?? { key: "18", value: "%18" });
      setBuyBox(_result.data.BuyboxPrice);

      setLoading(false);
      setProcessLoading(false);
    }
    else {
      setLoading(false);
      setProcessLoading(false);
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => { context.hideModal(); history.push("/urun-ilan-listesi"); }
      });
    }
  }

  const updateAdvert = async () => {
    setProcessLoading(true);

    const _result = await ApiService.updateProductAndAdvert(0, Number(params.id ?? "0"), 0, "", 0, "", barcode,"", cargoDay, false, stockCode, String(salePrice), String(marketPrice), Number(selectedTaxValue.key), stockCount, String(desi), [], [], "", "", []);

    setProcessLoading(false);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi",
        onClose: () => { context.hideModal(); history.push(`/urun-ilan-detay/${Number(params.id)}`); }
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
        <h2 >İlan Bilgilerini Düzenle</h2>
        <div className="w-full bg-gray-100 my-5 p-5 flex">
          <div className="text-sm my-auto ">
            <div className="flex">
              <AlertIcon className="w-4 h-4 text-red-400" /><span className="ml-2 font-medium">Değişikliklerinizi kaydediniz.</span>
            </div>
          </div>
          <div className="text-gray-700 flex gap-2 items-center ml-auto my-auto">
            <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-blue-400" text="Kaydet" onClick={() => { updateAdvert(); }} />
            <Button isLoading={processLoading} buttonSm textTiny className="w-24" design="button-gray-100" text="Vazgeç" onClick={() => { history.push(`/urun-ilan-detay/${Number(params.id)}`); }} />
          </div>
        </div>
        <div className="border-t border-gray-300 py-4">
          <h3>Satış Bilgileri</h3>
          <div className="w-full flex gap-8">
            <div className="w-1/2">
              <Label className="mt-4" title="Barkod No" withoutDots />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <input type="text" className="form-input bg-gray-100" disabled value={barcode} />
              }
              <Label className="mt-4" title="Stok Kodu" withoutDots />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <input type="text" className="form-input" value={stockCode} onChange={(e) => { setStockCode(e.target.value); }} />
              }
              <Label className="mt-4" title="Stok Adedi" withoutDots />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <input type="number" className="form-input" value={stockCount} onChange={(e) => { setStockCount(Number(e.target.value)); }} />
              }
              <Label className="mt-4" title="Desi (İsteğe Bağlı)" withoutDots />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <input type="number" className="form-input bg-gray-100" disabled value={desi} onChange={(e) => { setDesi(Number(e.target.value)); }} />
              }
              <Label className="mt-4" title="Kargoya Hazırlık Süresi" withoutDots />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <div className="w-full flex gap-2">
                    <input type="number" className="form-input" value={cargoDay} onChange={(e) => { setCargoDay(Number(e.target.value)); }} />
                    <input type="text" value="Gün" className="form-input bg-gray-100" disabled />
                  </div>
              }
            </div>
            <div className="w-1/2">
              <Label className="mt-4" title="Piyasa Fiyatı (KDV dahil)" withoutDots />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <ReactNumeric
                    value={marketPrice}
                    preDefined={autonNumericOptions.TL}
                    onChange={(e, value: number) => { setMarketPrice(value); }}
                    className="form-input"
                  />
              }
              {
                loading ?
                  <div className="mt-8">
                    <Loading textMd />
                  </div>
                  :
                  <div className="mt-6 flex gap-2">
                    <AlertIcon className="text-gray-700 icon-sm" />
                    <div className="text-sm font-medium text-gray-700">BUYBOX Fiyatı (KDV dahil) :</div>
                    <div className="text-sm font-medium text-green-400">{fraction.format(buybox) + " TL"}</div>
                  </div>
              }
              <Label className="mt-6" title="Housiy’de Satış Yapılacak Fiyat (KDV dahil)" withoutDots />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <ReactNumeric
                    value={salePrice}
                    preDefined={autonNumericOptions.TL}
                    onChange={(e, value: number) => { setSalePrice(value); }}
                    className="form-input"
                  />
              }
              <Label className="mt-4" title="KDV Oranı" withoutDots />
              {
                loading ?
                  <Loading inputSm />
                  :
                  <Dropdown
                    key="vatValue"
                    isDropDownOpen={currentOpenedFilterButton === "vatValue"}
                    onClick={() => { setCurrentOpenedFilterButton("vatValue"); }}
                    isDisabled={true}
                    label={selectedTaxValue.value}
                    items={taxValues}
                    onItemSelected={item => { setselectedTaxValue(item) }} />
              }
              <div className="w-full flex gap-2">
                <div className="w-1/2">
                  <Label className="mt-4" title="KDV Tutarı" withoutDots />
                  {
                    loading ?
                      <Loading inputSm />
                      :
                      <ReactNumeric
                        value={taxPrice}
                        preDefined={autonNumericOptions.TL}
                        className="form-input bg-gray-100 pointer-events-none"
                      />
                  }
                </div>
                <div className="w-1/2">
                  <Label className="mt-4" title="KDV Hariç Fiyatı" withoutDots />
                  {
                    loading ?
                      <Loading inputSm />
                      :
                      <ReactNumeric
                        value={priceWoTax}
                        preDefined={autonNumericOptions.TL}
                        className="form-input bg-gray-100 pointer-events-none"
                      />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt-6">
          <Button isLoading={processLoading} textTiny className="ml-auto w-24" text="Vazgeç" color="text-gray-400" onClick={() => { history.push(`/urun-ilan-detay/${Number(params.id)}`); }} />
          <Button isLoading={processLoading} textTiny className="w-72" design="button-blue-400" text="Kaydet ve Tamamla" onClick={() => { updateAdvert(); }} />
        </div>
      </div>
    </div>
  )
}
