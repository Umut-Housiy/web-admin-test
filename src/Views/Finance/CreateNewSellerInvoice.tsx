import { FunctionComponent, useContext, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { Dropdown } from "../../Components/Dropdown"
import { ChevronRightIcon, PlusIcon } from "../../Components/Icons"
import { Label } from "../../Components/Label"
import { SellerModel, TotalPaymentType } from "../../Models"
import { autonNumericOptions, returnPaymentType } from "../../Services/Functions"
import ReactNumeric from 'react-numeric';
import { Button } from "../../Components/Button"
import { ChooseSellerTable } from "../../Components/ChooseSellerTable"
import ApiService from "../../Services/ApiService"
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext"
import { useStateEffect } from "../../Components/UseStateEffect"

export const CreateNewSellerInvoice: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [selectedInvoiceType, setSelectedInvoiceType] = useState<{ key: string, value: string }>({ key: "0", value: "Kategori" });

  const [invoiceTypeList, setInvoiceTypeList] = useState<{ key: string, value: string }[]>([]);

  const [price, setPrice] = useState<number>(0);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [totalPrice, setTotalPrice] = useState<number>(0);

  const history = useHistory();

  const taxValues = [
    // { key: "0", value: "%0" },
    { key: "1", value: "%1" },
    { key: "8", value: "%8" },
    { key: "18", value: "%18" }
  ];

  const [selectedTaxValue, setselectedTaxValue] = useState<{ key: string, value: string }>({ key: "18", value: "%18" });

  useEffect(() => {
    let tempArray: { key: string, value: string }[] = [];
    for (let i = 101; i < TotalPaymentType.LastInvoiceNumber + 1; i++) {
      tempArray.push(
        {
          key: String(i),
          value: returnPaymentType(i)
        }
      )
    }
    setInvoiceTypeList([...tempArray])
  }, []);

  useStateEffect(() => {
    let totalPrice = price + ((price * Number(selectedTaxValue.key)) / 100);

    setTotalPrice(totalPrice);

  }, [price, selectedTaxValue]);

  const [selectedSellerList, setSelectedSellerList] = useState<SellerModel[]>([]);

  const [selectedSellerIdList, setSelectedSellerIdList] = useState<number[]>([]);

  const createPaymentAction = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createPaymentAction(Number(selectedInvoiceType.key), String(totalPrice), Number(selectedTaxValue.key), selectedSellerIdList, [])

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Fatura başarıyla oluşturuldu",
        onClose: () => {
          context.hideModal();
          history.push("/satici-faturalandirilmasi-gereken-islemler");
          setProcessLoading(false);
        }
      });
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setProcessLoading(false);
        }
      });
    }
  }
  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <Link to="/satici-faturalandirilmasi-gereken-islemler" className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Faturalandırılması Gereken Satıcı İşlemleri
          </div>
        </Link>
        <h2 className="mb-4">Yeni Fatura Oluştur</h2>
        <div className="w-1/2">
          <Label className="mt-4" title="Fatura Tipi" withoutDots isRequired />
          <Dropdown
            isSearchable
            key="invoiceTypeList"
            isDropDownOpen={currentOpenedFilterButton === "invoiceTypeList"}
            onClick={() => { setCurrentOpenedFilterButton("invoiceTypeList"); }}
            className="w-full text-black-700 text-sm"
            classNameDropdown="max-h-52 overflow-y-auto custom-scrollbar"
            label={selectedInvoiceType.value}
            items={invoiceTypeList}
            onItemSelected={item => { setSelectedInvoiceType(item); }} />
          <div className="grid lg:grid-cols-3 gap-x-2">
            <div className="lg:col-span-1">
              <Label className="mt-4" title="Tutar" withoutDots isRequired />
              <ReactNumeric
                value={price}
                preDefined={autonNumericOptions.TL}
                onChange={(e, value: number) => { setPrice(value) }}
                className={"form-input"}
              />
            </div>
            <div className="lg:col-span-1">
              <Label className="mt-4" title="KDV Oranı %" withoutDots isRequired />
              <Dropdown
                key="vatValue"
                isDropDownOpen={currentOpenedFilterButton === "vatValue"}
                onClick={() => { setCurrentOpenedFilterButton("vatValue"); }}
                className="w-full text-gray-900 mb-2 lg:mb-0 py-2 text-sm"
                label={selectedTaxValue.value}
                items={taxValues}
                onItemSelected={item => { setselectedTaxValue(item) }} />
            </div>
            <div className="lg:col-span-1">
              <Label className="mt-4" title="KDV Dahil Toplam Tutar" withoutDots isRequired />
              <ReactNumeric
                value={totalPrice}
                preDefined={autonNumericOptions.TL}
                className={"form-input pointer-evenst-none bg-gray-100"}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <ChooseSellerTable selectedList={selectedSellerList} setSelectedList={setSelectedSellerList} setSelectedListToApi={setSelectedSellerIdList} />
        </div>
        <div className="text-right">
          <Button isLoading={processLoading} text="Fatura Oluştur" design="button-blue-400 w-1/4 mt-4" onClick={() => createPaymentAction()} />
        </div>
      </div>
    </div>
  )
}
