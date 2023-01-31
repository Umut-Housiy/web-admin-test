import React, { FunctionComponent, useContext, useEffect, useRef, useState } from "react";
import { DateView } from "../../Components/DateView";
import { CheckIcon, ChevronRightIcon, CloseIcon, LikeButton, OrderCancelIcon, PacketUpIcon, StarIcon } from "../../Components/Icons";
import { RateCard } from "../../Components/RateCard";
import { Table } from "../../Components/Table";
import ApiService from "../../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../../Services/SharedContext";
import { Image } from "../../Components/Image";
import { EvaluateAdvertDetailInnerModel, OrderStatusTypes } from "../../Models";
import { RateStars } from "../../Components/RateStars";
import { Modal } from "../../Components/Modal";
import { Button } from "../../Components/Button";
import { Link } from "react-router-dom";

export interface EvaluationListProps {
  id: number,
}
export const EvaluationList: FunctionComponent<EvaluationListProps> = (props: EvaluationListProps) => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableElEvaluations = useRef<any>();

  const [showEvaluationDetailModal, setShowEvaluationDetailModal] = useState<boolean>(false);

  const [advertRate, setAdvertRate] = useState<number>(0);

  const [satisfactionRate, setSatisfactionRate] = useState<number>(0);

  const [cancelRate, setCancelRate] = useState<number>(0);

  const [refundRate, setRefundRate] = useState<number>(0);

  const [cardLoading, setCardLoading] = useState<boolean>(false);

  const defaultSelectedEvalution = {
    ProductEvaluateId: 0,
    ProductId: 0,
    AdvertId: 0,
    UserOrderId: 0,
    CreatedDateJSTime: 0,
    EvaluateRate: 0,
    Comment: "",
    UserName: "",
    UserPhoto: "",
    UserId: 0,
    OrderStatus: "",
    IsShowUserName: false,
    SellerId: 0,
    StoreName: "",
    OrderStatusType: 0,//fe
  }

  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluateAdvertDetailInnerModel>(defaultSelectedEvalution);

  const getProductEvaluationsForDetail = async (order: number, searchText: string, page: number, take: number) => {
    setCardLoading(true);

    const _result = await ApiService.getProductEvaluationsForDetail(props.id, page, take, searchText, order);

    if (_result.succeeded === true) {
      setAdvertRate(_result.data.AdvertRate);
      setSatisfactionRate(_result.data.SatisfactionRate)
      setCancelRate(_result.data.CancelRate)
      setRefundRate(_result.data.RefundRate)
      setCardLoading(false);
      return {
        Data: _result.data.Data,
        TotalCount: _result.data.TotalCount
      }
    }
    else {
      context.showModal({
        type: "Error",
        message: _result.message,
        onClose: () => {
          context.hideModal(); setCardLoading(false);
        }
      });
      return {
        Data: [],
        TotalCount: 0
      }
    }
  }

  const showEvaluationDetail = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setShowEvaluationDetailModal(true);
  }

  return (
    <>
      <div className="grid lg:grid-cols-4 gap-4 mt-4 border-b pb-4">
        <RateCard loading={cardLoading} bgColor="bg-gray-100" onStore label="Genel Ürün Puanı" rateValue={advertRate} icon={<StarIcon className="w-10 h-10 mr-2 text-yellow-600 p-2 bg-white rounded-full" />} />
        <RateCard loading={cardLoading} label="Memnuniyet Oranı" rateValue={satisfactionRate} icon={<LikeButton className="w-7 h-7 mr-2 text-blue-400" />} />
        <RateCard loading={cardLoading} label="Sipariş İptal Oranı" color="text-red-400" rateValue={cancelRate} icon={<OrderCancelIcon className="w-8 h-8 mr-2 text-blue-400" />} />
        <RateCard loading={cardLoading} label="Ürün İade Oranı" rateValue={refundRate} icon={<PacketUpIcon className="w-10 h-10 mr-2 text-blue-400" />} />
      </div>
      <Table
        ref={tableElEvaluations}
        emptyListText={"Değerlendirme Bulunamadı"}
        key="tableElEvaluations"
        getDataFunction={getProductEvaluationsForDetail}
        header={<div className=" lg:grid-cols-12 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
          <div className="lg:col-span-1 flex items-center">
            <span className="p-sm-gray-400">
              Tarih
            </span>
          </div>
          <div className="lg:col-span-2">
            <span className="p-sm-gray-400">
              Müşteri Adı
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Sipariş No
            </span>
          </div>
          <div className="lg:col-span-1">
            <span className="p-sm-gray-400">
              Satıcı
            </span>
          </div>
          <div className="lg:col-span-2">
            <span className="p-sm-gray-400">
              Sipariş Durumu
            </span>
          </div>
          <div className="lg:col-span-5">
            <span className="p-sm-gray-400">
              Değerlendirme
            </span>
          </div>
        </div>}
        renderItem={(e, i) => {
          return <div key={"list" + i} className="lg:grid-cols-12 px-2 border-b min-h-20 py-5 border-gray-200 grid gap-4 items-center">
            <div className="lg:col-span-1 flex lg:block lg:items-center flex-col lg:flex-row">
              <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Tarih:</span>
              <DateView className="text-sm inline-block" dateNumber={e.CreatedDateJSTime} pattern="dd/MM/yyyy" />
            </div>
            <div className="lg:col-span-2 flex lg:block items-center">
              <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Müşteri Adı:</span>
              <div className="flex items-center text-gray-900">
                <Image src={e.UserPhoto} alt={e.UserName} className=" mr-2 min-w-12 max-w-12 max-h-12 min-h-12 rounded-full object-cover" />
                <p className="text-sm font-medium">
                  {e.UserName}
                  {e.IsShowUserName === true && " (Anonim)"}
                </p>
              </div>

            </div>
            <div className="lg:col-span-1 flex lg:block lg:items-center flex-col lg:flex-row">
              <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Sipariş No:</span>
              <p className="p-sm">
                #{e.UserOrderId}
              </p>
            </div>
            <div className="lg:col-span-1 flex lg:block lg:items-center flex-col lg:flex-row">
              <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Satıcı:</span>
              <Link to={`/satici-detay/${e.SellerId}`} className="text-blue-400 font-medium text-sm underline"> {e.StoreName}</Link>
            </div>
            <div className="lg:col-span-2 flex lg:block items-center">
              <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Sipariş Durumu</span>
              <div className="flex items-center justify-between">
                {OrderStatusTypes.DONE == e.OrderStatusType ?
                  <span className="flex items-center text-blue-400 font-medium text-sm">
                    <CheckIcon className="icon-sm mr-1" />
                    {e.OrderStatus}
                  </span>
                  :
                  OrderStatusTypes.CANCELED == e.OrderStatusType ?
                    <span className="flex items-center text-red-400 font-medium text-sm">
                      <CloseIcon className="icon-sm mr-1" />
                      {e.OrderStatus}
                    </span>
                    :
                    <span className="flex items-center text-gray-900 font-medium text-sm">
                      <OrderCancelIcon className="icon-sm mr-1" />
                      {e.OrderStatus}
                    </span>
                }
              </div>
            </div>

            <div className="lg:col-span-5 flex lg:block items-center">
              <span className="text-sm font-medium text-gray-700 lg:hidden mr-2">Değerlendirme:</span>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <RateStars className="h-4 mr-1 text-gray-700 " rateValue={e.EvaluateRate} numberColor="text-gray-700" />
                  <span className="text-sm inline-block text-gray-700 mt-2" >“{e.Comment}{e.Comment.length > 100 && "..."}“</span>
                  {e.Comment.length > 100 && <span className="font-medium text-gray-900 inline-block mt-1 text-xs cursor-pointer" onClick={() => { showEvaluationDetail(e) }}>Daha Fazla Göster</span>}
                </div>
                <div className="">
                  <ChevronRightIcon className=" cursor-pointer icon-md text-gray-700" onClick={() => showEvaluationDetail(e)} />
                </div>
              </div>

            </div>
          </div>
        }}
      />

      <Modal
        modalType="fixedSm"
        showModal={showEvaluationDetailModal}
        onClose={() => {
          setShowEvaluationDetailModal(false);
          setSelectedEvaluation(defaultSelectedEvalution);
        }}
        title="Değerlendirme Detayı"
        body=
        {
          <div className="">
            <div className=" flex items-center">
              <Image src={selectedEvaluation.UserPhoto} alt={selectedEvaluation.UserName} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="text-sm font-medium ml-2 text-gray-900">{selectedEvaluation.UserName}: </h3>
                <DateView className="text-sm text-gray-700 mb-1 ml-2" dateNumber={selectedEvaluation.CreatedDateJSTime} pattern="dd/MM/yyyy" />
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <RateStars className="h-6 mr-1 text-yellow-600 mb-2" rateValue={selectedEvaluation.EvaluateRate} numberColor="text-yellow-600" />
            </div>
            <div className="p-3  text-sm mt-2 bg-gray-100 rounded-lg">
              {selectedEvaluation.Comment}
            </div>
          </div>
        }
        footer={
          <>
            <Button text="Kapat" design="button-blue-400 w-full" onClick={() => {
              setShowEvaluationDetailModal(false);
              setSelectedEvaluation(defaultSelectedEvalution);
            }} />
          </>
        }
      />
    </>
  );
}
