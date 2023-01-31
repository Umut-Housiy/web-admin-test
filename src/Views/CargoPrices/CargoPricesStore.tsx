import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Button } from "../../Components/Button";
import { EditIcon, PlusIcon, TrashIcon } from "../../Components/Icons";
import { Table } from "../../Components/Table";
import { formatter, fraction } from "../../Services/Functions";
import { Modal } from "../../Components/Modal";
import { Label } from "../../Components/Label";
import { Dropdown } from "../../Components/Dropdown";
import { SellerCargoPriceModel } from "../../Models";
import { ToggleButton } from "../../Components/ToggleButton";
import { Loading } from "../../Components/Loading";

function AddNewButton(props: { onClick: () => void }) {
  return (
    <Button buttonMd textTiny color="text-blue-400" className="w-80" design="button-blue-100"
            text="Yeni İçerik Oluştur" hasIcon icon={<PlusIcon className="icon-sm mr-2"/>}
            onClick={props.onClick}/>
  );
}

function Header(props: {
  companyOptions: { key: string; value: string }[];
  selectedCompanyOption: { key: string; value: string; };
  setSelectedCompanyOptions: (item: { key: string; value: string }) => void;
}) {
  return (
    <div className=" lg:grid-cols-4 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
      <div className="lg:col-span-1 flex flex-row items-center">
        <span className="p-sm-gray-400">
          Kargo Şirketi
        </span>
        <Dropdown
          className="w-full text-black-700 text-sm border-gray-300 ml-4"
          label={props.selectedCompanyOption.value}
          items={props.companyOptions}
          onItemSelected={props.setSelectedCompanyOptions}
        />
      </div>
      <div className="lg:col-span-1 flex flex-row items-center">
          <span className="p-sm-gray-400">
            Desi Aralığı
          </span>
      </div>
      <div className="lg:col-span-1 flex flex-row items-center">
          <span className="p-sm-gray-400">
            Kargo Bedeli
          </span>
      </div>
      <div className="lg:col-span-1 flex flex-row items-center">
          <span className="p-sm-gray-400">
            Ücretsiz Kargo
          </span>
      </div>
    </div>
  );
}

function RenderItem(props: {
  item: SellerCargoPriceModel,
  onEditClicked: (item: SellerCargoPriceModel) => void,
  onDeleteClicked: (item: SellerCargoPriceModel) => void
}) {
  const {item, onEditClicked, onDeleteClicked} = props;
  return (
    <div
      className="lg:grid-cols-4 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
      <div className="lg:col-span-1">
        <p className="p-sm">
          {item.CargoCompanyName}
        </p>
      </div>
      <div className="lg:col-span-1">
        <p className="p-sm">
          {String(item.MinDesi) + "-" + String(item.MaxDesi)}
        </p>
      </div>
      <div className="lg:col-span-1">
        <p className="p-sm">
          {
            item.CargoPrice % 1 === 0
              ? <>{fraction.format(item.CargoPrice)} TL</>
              : <>{formatter.format(item.CargoPrice)} TL</>
          }
        </p>
      </div>
      <div className="lg:col-span-1 flex justify-between">
        {
          item.IsFreeShipping
            ? <p className="text-green-400 font-medium text-sm">Aktif</p>
            : <p className="p-sm">-</p>
        }
        <div className="text-gray-700 flex gap-2 items-center">
          <EditIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all"
                    onClick={() => onEditClicked(item)}/>
          <TrashIcon className="icon-sm hover:text-blue-400 cursor-pointer transition-all "
                     onClick={() => onDeleteClicked(item)}/>
        </div>
      </div>
    </div>
  );
}

type PricingType = {
  id?: number;
  minDesi: string;
  maxDesi: string;
  isFreeShipping: boolean;
  cargoPrice: string;
}

const initialPricing: PricingType = {
  minDesi: "0",
  maxDesi: "0",
  isFreeShipping: false,
  cargoPrice: "0",
}

const getFloatIfNeeded = (num: number) => num.toFixed(2).replace(/[.,]00$/, "");
const getNumericPositive = (text: string) => text.replace(/[^0-9.]+/g, '');
const getNumeric = (text: string) => text.replace(/[^0-9.-]+/g, '');

function PricingListItem(props: { index: number, pricing: PricingType, onChange: (item: PricingType) => void, onDelete: () => void }) {
  const {index, pricing, onChange, onDelete} = props;
  const {minDesi, maxDesi, isFreeShipping, cargoPrice} = pricing;

  return (
    <div className="grid-cols-12 p-2 border-b border-gray-200 grid gap-4 items-center">
      <div className="col-span-1 flex items-center justify-center">
        {index}.
      </div>
      <div className="col-span-3 flex items-center">
        <input
          className="form-input" value={minDesi}
          onChange={({target: {value}}) => onChange({...pricing, minDesi: getNumericPositive(value)})}
        />
      </div>
      <div className="col-span-3 flex items-center">
        <input
          className="form-input" value={maxDesi}
          onChange={({target: {value}}) => onChange({...pricing, maxDesi: getNumericPositive(value)})}
        />
      </div>
      <div className="col-span-3 flex items-center">
        <input
          className="form-input" value={cargoPrice}
          onChange={({target: {value}}) => onChange({...pricing, cargoPrice: getNumericPositive(value)})}
        />
      </div>
      <div className="col-span-1 flex items-center justify-center">
        <ToggleButton
          defaultValue={isFreeShipping}
          onClick={() => onChange({...pricing, isFreeShipping: !isFreeShipping})}
        />
      </div>
      <div className="col-span-1 flex items-center justify-around">
        <TrashIcon className="icon-md hover:text-blue-400 cursor-pointer transition-all" onClick={onDelete}/>
      </div>
    </div>
  );
}

type CargoPriceModalProps = {
  cargoOptions: { key: string, value: string }[];
  selectedCargoOption: { key: string, value: string };
  showModal: boolean;
  setShowModal: (bool: boolean) => void;
  tableRef: React.MutableRefObject<any>;
}

function CargoPriceModal(props: CargoPriceModalProps) {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [cargoOptions] = useState<{ key: string, value: string }[]>(props.cargoOptions);
  const [modalType] = useState<'update' | 'create'>(props.selectedCargoOption.key !== "0" ? 'update' : 'create');

  const [isLoading, setIsLoading] = useState(false);
  const [percentageChange, setPercentageChange] = useState<string>("");
  const [pricingList, setPricingList] = useState<PricingType[]>([]);
  const [selectedCargoOption, setSelectedCargoOption] = useState<{ key: string, value: string }>(props.selectedCargoOption);

  const createCargoPrice = useCallback(async () => {
    const response = await ApiService.createSellerCargoPrice(
      Number(selectedCargoOption.key), pricingList.map((item) => ({
        MinDesi: parseFloat(item.minDesi),
        MaxDesi: parseFloat(item.maxDesi),
        IsFreeShipping: item.isFreeShipping,
        CargoPrice: parseFloat(item.cargoPrice),
      }))
    );
    props.setShowModal(false);

    if (response.succeeded) {
      context.showModal({
        type: "Success",
        title: "İçerik kaydedildi.",
        onClose: () => {
          context.hideModal();
          if (props.tableRef.current) props.tableRef.current?.reload();
        },
      });
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          props.setShowModal(true);
        },
      });
    }
  }, [context, pricingList])

  const updateCargoPrice = useCallback(async () => {
    const response = await ApiService.updateSellerCargoPrice(
      Number(selectedCargoOption.key), pricingList.map((item) => ({
        Id: item.id || null,
        MinDesi: parseFloat(item.minDesi),
        MaxDesi: parseFloat(item.maxDesi),
        IsFreeShipping: item.isFreeShipping,
        CargoPrice: parseFloat(item.cargoPrice),
      }))
    );
    props.setShowModal(false);

    if (response.succeeded) {
      context.showModal({
        type: "Success",
        title: "Değişiklikler kaydedildi.",
        onClose: () => {
          context.hideModal();
          if (props.tableRef.current) props.tableRef.current?.reload();
        },
      });
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => {
          context.hideModal();
          props.setShowModal(true);
        },
      });
    }
  }, [context, pricingList])

  const onDeleteClicked = useCallback((index: number) => {
    const id = pricingList[index].id;
    props.setShowModal(false);
    context.showModal({
      type: "Question",
      title: "İçerik Sil",
      message: "İçerik silinecek. Emin misiniz?",
      onClick: async () => {
        let response;
        if (id) {
          response = await ApiService.deleteSellerCargoPrice(id);
        }
        if (!id || response.succeeded) {
          context.showModal({
            type: "Success",
            title: "İçerik silindi",
            onClose: () => {
              context.hideModal();
              props.setShowModal(true);
              setPricingList([...pricingList.filter((_, i) => i !== index)]);
            },
          });
        } else {
          context.showModal({
            type: "Error",
            message: response.message,
            onClose: () => {
              context.hideModal();
              props.setShowModal(true);
            },
          });
        }
        return true;
      },
      onClose: () => {
        context.hideModal();
        props.setShowModal(true);
      },
    });
  }, [props, context, pricingList]);

  const fetchPricingList = useCallback(async () => {
    setIsLoading(true);
    const response = await ApiService.getSellerCargoPricesList(1, 9999, '', 2, parseInt(selectedCargoOption.key));
    if (response.succeeded) {
      setPricingList(response.data.Data.map((item) => ({
        id: item.Id,
        minDesi: String(item.MinDesi),
        maxDesi: String(item.MaxDesi),
        isFreeShipping: item.IsFreeShipping,
        cargoPrice: String(item.CargoPrice),
      })));
    } else {
      setPricingList([]);
    }
    setIsLoading(false);
  }, [context]);

  useEffect(() => {
    if (props.selectedCargoOption.key !== "0" && props.showModal) {
      fetchPricingList();
    }
  }, [props.selectedCargoOption, props.showModal]);

  return (
    <Modal
      modalType="fixedMd"
      showModal={props.showModal}
      onClose={() => props.setShowModal(false)}
      title={modalType === 'update' ? "Kargo İşlemi Detayı" : "Kargo İşlemi Ekle"}
      body={
        <>
          <Label title="Kargo Şirketi" withoutDots isRequired/>
          <Dropdown
            className="w-full max-w-520 text-black-700 text-sm border-gray-300"
            label={selectedCargoOption.value}
            items={cargoOptions}
            onItemSelected={setSelectedCargoOption}
          />
          <Label className="mt-2" title="Desi Aralıkları" withoutDots isRequired/>
          <div
            className="grid-cols-12 p-2 border-b border-gray-200 grid gap-4">
            <div className="col-span-1 flex items-center"/>
            <div className="col-span-3 flex items-center">
              <span className="p-sm-gray-400">MinDesi</span>
            </div>
            <div className="col-span-3 flex items-center">
              <span className="p-sm-gray-400">MaxDesi</span>
            </div>
            <div className="col-span-3 flex items-center">
              <span className="p-sm-gray-400">Kargo Fiyat</span>
            </div>
            <div className="col-span-1 flex items-center">
              <span className="p-sm-gray-400">Ücretsiz</span>
            </div>
          </div>
          {
            isLoading ? (
              <>
                <div className="mt-2">
                  <Loading inputSm/>
                </div>
                <div className="mt-2">
                  <Loading inputSm/>
                </div>
                <div className="mt-2">
                  <Loading inputSm/>
                </div>
              </>
            ) : (
              pricingList.map((item, index) => (
                <PricingListItem
                  index={index + 1}
                  pricing={item}
                  onChange={(newPricing) => {
                    pricingList[index] = newPricing;
                    setPricingList([...pricingList]);
                  }}
                  onDelete={() => onDeleteClicked(index)}
                  key={`key_${index}`}
                />
              ))
            )
          }
          <div className="w-full flex items-center justify-center p-2 mt-2">
            <Button buttonMd textTiny color="text-blue-400" className="w-60" design="button-blue-100"
                    text="Yeni Desi Ekle" hasIcon icon={<PlusIcon className="icon-sm mr-2"/>}
                    onClick={() => setPricingList([...pricingList, initialPricing])}/>
          </div>
          <div className="w-full flex-col items-center p-2 mt-2">
            <Label title="Fiyatları yüzdelik güncelle" withoutDots/>
            <div className="w-full flex flex-row items-center justify-between mt-2">
              <input
                value={percentageChange}
                onChange={({target: {value}}) => setPercentageChange(getNumeric(value))}
                className={"w-60 rounded-lg border border-gray-200 p-3 text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-400"}
                type="numeric"
                placeholder={'%'}
              />
              <Button
                buttonMd textTiny color="text-blue-400" className="w-60" design="button-blue-100"
                text={!isNaN(parseFloat(percentageChange)) && parseFloat(percentageChange) > 0 ? 'Zam Uygula' : 'İndirim Uygula'}
                onClick={() => {
                  if (percentageChange && !isNaN(parseFloat(percentageChange))) {
                    const change = parseFloat(percentageChange);
                    setPricingList([...pricingList.map((item) => ({
                      ...item,
                      cargoPrice: getFloatIfNeeded((parseFloat(item.cargoPrice) || 0) * (100 + change) / 100),
                    }))
                    ]);
                    setPercentageChange("");
                  }
                }}
              />
            </div>
          </div>
        </>
      }
      footer={
        <Button className="w-full" design="button-blue-400" text="Kaydet"
                onClick={modalType === 'create' ? createCargoPrice : updateCargoPrice}/>
      }
    />
  );
}

export function CargoPricesStore() {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);
  const tableRef = useRef<any>();

  const [cargoCompanyOptions, setCargoCompanyOptions] = useState<{ key: string, value: string }[]>([]);
  const [selectedCargoCompanyOption, setSelectedCargoCompanyOption] = useState<{ key: string, value: string }>({
    key: "0",
    value: "Seçiniz..."
  });
  const [showModal, setShowModal] = useState<boolean>(false);

  const getSellerCargoPricesList = useCallback(async (order: number, searchText: string, page: number, take: number) => {
    const response = await ApiService.getSellerCargoPricesList(page, take, searchText, order,
      selectedCargoCompanyOption.key !== "0" ? Number(selectedCargoCompanyOption.key) : null
    );
    if (response.succeeded) {
      return {
        Data: response.data.Data,
        TotalCount: response.data.TotalCount
      }
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => context.hideModal(),
      });
      return {Data: [], TotalCount: 0};
    }
  }, [context, selectedCargoCompanyOption]);

  const deleteSellerCargoPrice = useCallback((item) => {
    context.showModal({
      type: "Question",
      title: "İçerik Sil",
      message: "İçerik silinecek. Emin misiniz?",
      onClick: async () => {
        const response = await ApiService.deleteSellerCargoPrice(item.Id);
        if (response.succeeded) {
          context.showModal({
            type: "Success",
            title: "İçerik silindi",
            onClose: () => {
              context.hideModal();
              if (tableRef.current) tableRef.current?.reload();
            }
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
    });
  }, [context, tableRef])

  const openCreateModal = useCallback(() => {
    setSelectedCargoCompanyOption({key: "0", value: "Seçiniz..."});
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((item: SellerCargoPriceModel) => {
    setSelectedCargoCompanyOption({key: String(item.CargoCompanyId), value: item.CargoCompanyName});
    setShowModal(true);
  }, []);

  const getCargoCompanyListForAdmin = useCallback(async () => {
    const response = await ApiService.getCargoCompanyListForAdmin(1, 9999, "", 1);
    if (response.succeeded) {
      setCargoCompanyOptions(response.data.Data.map((item) => ({key: String(item.Id), value: item.Name})));
    } else {
      context.showModal({
        type: "Error",
        message: response.message,
        onClose: () => context.hideModal(),
      });
    }
  }, [context]);

  useEffect(() => {
    getCargoCompanyListForAdmin();
  }, []);

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Mağaza Kargo Fiyatlandırması</h2>
        <Table ref={tableRef}
               key={selectedCargoCompanyOption.key}
               emptyListText={"İçerik Bulunamadı"}
               getDataFunction={getSellerCargoPricesList}
               addNewButton={<AddNewButton onClick={openCreateModal}/>}
               header={
                 <Header
                   companyOptions={cargoCompanyOptions}
                   selectedCompanyOption={selectedCargoCompanyOption}
                   setSelectedCompanyOptions={(item) => setSelectedCargoCompanyOption(item)}
                 />
               }
               renderItem={(item, index) => (
                 <RenderItem item={item} key={`key_${index}`}
                             onEditClicked={openEditModal}
                             onDeleteClicked={deleteSellerCargoPrice}/>
               )}
        />
      </div>
      <CargoPriceModal
        cargoOptions={cargoCompanyOptions}
        selectedCargoOption={selectedCargoCompanyOption} key={selectedCargoCompanyOption.key}
        showModal={showModal}
        setShowModal={setShowModal}
        tableRef={tableRef}
      />
    </div>
  )
}
