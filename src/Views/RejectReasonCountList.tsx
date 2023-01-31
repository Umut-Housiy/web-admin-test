import { FunctionComponent, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import { RejectReasonsListShowModel } from "../Models";
import ApiService from "../Services/ApiService";

export const RejectReasonCountList: FunctionComponent = () => {

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];

  const tableEl = useRef<any>();

  const getRejectReasonCountList = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getRejectReasonCount();
    let data: RejectReasonsListShowModel[] = [];

    data = [
      {
        Name: "Talep İptal",
        User: "Kullanıcı",
        Condition: "Müşterinin oluşturduğu talebi henüz teklif gelmeden iptal etme durumu",
        Count: ((_result.data || []).find(x => x.Type === 7) || { Type: 0, Count: 0 }).Count || 0,
        Type: 7
      },
      {
        Name: "Talep Red",
        User: "Profesyonel",
        Condition: "Müşteri tarafından oluşturulmuş talebi profesyonelin reddetme durumu",
        Count: ((_result.data || []).find(x => x.Type === 1) || { Type: 1, Count: 0 }).Count || 0,
        Type: 1
      },
      {
        Name: "Talep İptali Red",
        User: "Admin",
        Condition: "Admin kullanıcısının, devam eden iş için oluşturulmuş iptal etme talebini reddetme durumu",
        Count: ((_result.data || []).find(x => x.Type === 8) || { Type: 8, Count: 0 }).Count || 0,
        Type: 8
      },
      {
        Name: "Teklif Red",
        User: "Kullanıcı",
        Condition: "Profesyonel tarafından oluşturulmuş teklifin müşteri tarafından reddedilme durumu",
        Count: ((_result.data || []).find(x => x.Type === 2) || { Type: 2, Count: 0 }).Count || 0,
        Type: 2
      },
      {
        Name: "Hizmet İptal",
        User: "Profesyonel",
        Condition: "Profesyonel gerçekleştirdiği hizmet iptal durumu",
        Count: ((_result.data || []).find(x => x.Type === 3) || { Type: 3, Count: 0 }).Count || 0,
        Type: 3
      },
      {
        Name: "Hizmet İptal",
        User: "Kullanıcı",
        Condition: "Müşterinin gerçekleştirdiği hizmet iptal durumu",
        Count: ((_result.data || []).find(x => x.Type === 4) || { Type: 4, Count: 0 }).Count || 0,
        Type: 4
      },
      {
        Name: "Profesyonel Sorun Bildir",
        User: "Kullanıcı",
        Condition: "Müşterinin kayıtlı profesyonel ile yaşadığı problemi bildirme durumu",
        Count: ((_result.data || []).find(x => x.Type === 5) || { Type: 5, Count: 0 }).Count || 0,
        Type: 5
      },
      {
        Name: "Hizmet Sorun Bildir",
        User: "Kullanıcı",
        Condition: "Müşterinin onaylanmış iş sürecinde yaşadığı problemi bildirme durumu",
        Count: ((_result.data || []).find(x => x.Type === 6) || { Type: 6, Count: 0 }).Count || 0,
        Type: 6
      }

    ]

    return {
      Data: data,
      TotalCount: 8
    }
  }

  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">İptal Ve Red Sebep Yönetimi</h2>
        <Table
          ref={tableEl}
          emptyListText={"İptal Ve Red Sebebi Bulunamadı"}
          getDataFunction={getRejectReasonCountList}
          header={<div className=" lg:grid-cols-4 px-2 border-b border-t py-5 border-gray-200 hidden lg:grid gap-4">
            <div className="lg:col-span-1">
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
                Seçenek Sayısı
              </span>
            </div>
          </div>
          }
          renderItem={(e: RejectReasonsListShowModel, i) => {
            return <div key={"list" + i} className="lg:grid-cols-4 px-2 border-b min-h-20 py-5 border-gray-200 hidden lg:grid flex gap-4 items-center">
              <div className="lg:col-span-1">
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
                  {e.Condition}
                </p>
              </div>
              <div className="lg:col-span-1 flex justify-between">
                <p className="p-sm">
                  {e.Count}
                </p>
                <Link to={`/iptal-red-yonetimi/${e.Type}`}>  <ChevronRightIcon className="icon-sm" /></Link>
              </div>
              <div className="lg:col-span-1 flex justify-between"></div>
            </div>
          }}
          sortOptions={sortOptions}
        />
      </div>
    </div>
  )
}
