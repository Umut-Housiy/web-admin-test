import { FunctionComponent, useContext, useRef, useState } from 'react'
import { Button } from '../Components/Button';
import { Dropdown } from '../Components/Dropdown';
import { EditIcon } from '../Components/Icons';
import { Label } from '../Components/Label';
import { Modal } from '../Components/Modal';
import { Table } from '../Components/Table'
import { WorkPenaltyFeeListShowModel, } from '../Models';
import ApiService from '../Services/ApiService';
import { SharedContext, SharedContextProviderValueModel } from '../Services/SharedContext';

export const SiteServicesInterruptions: FunctionComponent = () => {

  const tableEl = useRef<any>();

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const [currentOpenedFilterButton, setCurrentOpenedFilterButton] = useState<string>("");

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [updatePenalty, setUpdatePenalty] = useState<number>(0);

  const [valueTypes, setValueTypes] = useState<{ key: number, value: string }[]>([
    { key: 1, value: "%" },
    { key: 2, value: "TL" }
  ])
  const getWorkPenaltyFeeReasonList = async (order: number, searchText: string, page: number, take: number) => {

    const _result = await ApiService.getWorkPenaltyFeeList();

    let data: WorkPenaltyFeeListShowModel[] = [];
    data = [
      {
        Name: "Geciken Kargo",
        User: "Satıcı / Mağaza",
        Statu: "Ürünün kargoya çıkarılma süresinin gecikme durumu",
        ValueType: valueTypes.find(i => i.key === 2)?.value ?? "-",
        Value: _result.data.find(x => x.Type === 1)?.Value ?? 0,
        Type: 1
      },
      {
        Name: "İptal Edilen Sipariş",
        User: "Satıcı / Mağaza",
        Statu: "Sipariş iptal etme durumu",
        ValueType: valueTypes.find(i => i.key === 2)?.value ?? "-",
        Value: _result.data.find(x => x.Type === 2)?.Value ?? 0,
        Type: 2,

      },
      {
        Name: "İptal Edilen Ürün",
        User: "Satıcı / Mağaza",
        Statu: "Sipariş içerisinde ürün reddetme/iptal etme durumu",
        ValueType: valueTypes.find(i => i.key === 2)?.value ?? "-",
        Value: _result.data.find(x => x.Type === 3)?.Value ?? 0,
        Type: 3,
      },
      {
        Name: "İptal Edilen Hizmet",
        User: "Profesyonel",
        Statu: "Teklif onayından sonra hizmet iptal etme durumu",
        ValueType: valueTypes.find(i => i.key === 1)?.value ?? "-",
        Value: _result.data.find(x => x.Type === 4)?.Value ?? 0,
        Type: 4,
      },
      {
        Name: "Geciken Hizmet",
        User: "Profesyonel",
        Statu: "İş Teslim tarihinden sonra bitirilen işler durumu",
        ValueType: valueTypes.find(i => i.key === 1)?.value ?? "-",
        Value: _result.data.find(x => x.Type === 5)?.Value ?? 0,
        Type: 5,
      }

    ]
    return {
      Data: data,
      TotalCount: data.length
    }

  }
  const [selectedType, setSelectedType] = useState<WorkPenaltyFeeListShowModel>(
    {
      Name: "",
      User: "",
      Statu: "",
      ValueType: "",
      Value: 0,
      Type: 0,
    }
  );

  const handleOpenEditModal = (item) => {
    setSelectedType(item)
    setUpdatePenalty(item.Value)
    setShowEditModal(true);
  }

  const setUpdatePenaltyFunc = async () => {
    setProcessLoading(true);

    const _result = await ApiService.getUpdateWorkPenaltyFeeList(selectedType.Type, (selectedType.Type === 4 || selectedType.Type === 5) ? 1 : 2, updatePenalty);
    setShowEditModal(false);
    if (_result.succeeded === true) {

      context.showModal({
        type: "Success",
        title: "Başarılı",
        message: "Değişiklik kaydedildi",
        onClose: () => {
          context.hideModal();
          clearModal();
          setProcessLoading(false);
          tableEl?.current.reload();
        }
      });
    } else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal();
          setProcessLoading(false);
        }
      });
    }
  }

  const clearModal = () => {
    setSelectedType({
      Name: "",
      User: "",
      Statu: "",
      ValueType: "",
      Value: 0,
      Type: 0,
    })
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Ceza ve Hizmet Kesintileri</h2>
        <Table
          ref={tableEl}
          emptyListText={"İçerik Bulunamadı"}
          getDataFunction={getWorkPenaltyFeeReasonList}
          header={<div className=" lg:grid-cols-5 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1 flex items-center">
              <span className="p-sm-gray-400">
                İşlem Adı
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Uygulanacağı Kişi
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Uygulanacağı Durum
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ceza Türü
              </span>
            </div>
            <div className="lg:col-span-1">
              <span className="p-sm-gray-400">
                Ceza Bedeli
              </span>
            </div>
          </div>}
          renderItem={(e: WorkPenaltyFeeListShowModel, i) => {
            return <div key={"list" + i} className="lg:grid-cols-5 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1 flex items-center">
                <p className="p-sm">
                  {e.Name}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.User}
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {
                    e.Statu
                  }
                </p>
              </div>
              <div className="lg:col-span-1">
                <p className="p-sm">
                  {e.ValueType}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                {e.Value}
                <div className="text-gray-700 flex gap-2 items-center">
                  <EditIcon className="w-8 h-5 hover:hover:text-blue-400   cursor-pointer transition-all border-l pl-1" onClick={() => { handleOpenEditModal(e); }} />
                </div>
              </div>
            </div>

          }}
        />
        <Modal
          modalType="fixedSm"
          showModal={showEditModal}
          onClose={() => { setShowEditModal(false); clearModal() }}
          title="Ceza-Hizmet Kesintisi"
          body=
          {
            <>
              <Label title="Ceza Türü" className="mb-3" withoutDots />
              <Dropdown
                key="valueType"
                isDisabled={true}
                isDropDownOpen={currentOpenedFilterButton === "valueType"}
                onClick={() => { setCurrentOpenedFilterButton("valueType"); }}
                label={selectedType.ValueType}
              />
              <Label title="Cezai Bedeli" className="mt-2" withoutDots />
              <input
                className="form-input"
                value={updatePenalty}
                type="number"
                onChange={(e) => { setUpdatePenalty(parseInt(e.target.value)) }} />
            </>
          }
          footer={
            <Button isLoading={processLoading} text="Düzenle ve Kaydet" design="button-blue-400" block className="mt-6" onClick={() => setUpdatePenaltyFunc()} />
          }
        />
      </div>
    </div>
  )
}
