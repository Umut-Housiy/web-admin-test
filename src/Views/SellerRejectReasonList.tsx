import { FunctionComponent, useContext, useRef } from "react"
import { Link, useHistory } from "react-router-dom";
import { ChevronRightIcon } from "../Components/Icons";
import { Table } from "../Components/Table";
import { SellerRejectReasonsListShowModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const SellerRejecReasonList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const tableEl = useRef<any>();

  const sortOptions = [
    { key: "1", value: "En yeni eklenen" },
    { key: "2", value: "En eski eklenen" },
    { key: "3", value: "Sıraya göre azalan" },
    { key: "4", value: "Sıraya göre artan" }
  ];


  const getSellerRejectReasonsCount = async (order: number, searchText: string, page: number, take: number) => {
    const _result = await ApiService.getSellerRejectReasonsCount();
    let data: SellerRejectReasonsListShowModel[] = [];

    data = [
      {
        Name: "Ürün/Sipariş İptali",
        User: "Kullanıcı",
        Condition: "Sipariş verilen ürün veya ürünlerin henüz mağaza tarafından onaylanmadan iptal edilme durumu",
        Count: ((_result.data || []).find(x => x.Type === 1) || { Type: 1, Count: 0 }).Count || 0,
        Type: 1
      },
      {
        Name: "Ürün İadesi",
        User: "Kullanıcı",
        Condition: "Müşteri tarafından sipariş edilen ürün için iade talebi oluşturma durumu",
        Count: ((_result.data || []).find(x => x.Type === 2) || { Type: 2, Count: 0 }).Count || 0,
        Type: 2
      },
      {
        Name: "Ürün Sorun Bildir",
        User: "Kullanıcı",
        Condition: "Yayınlanan ilanlar ile ilgili müşteri tarafından sorun bildirme durumu",
        Count: ((_result.data || []).find(x => x.Type === 3) || { Type: 3, Count: 0 }).Count || 0,
        Type: 3
      },

    ]

    return {
      Data: data,
      TotalCount: 3
    }
  }
  return (
    <div>
      <div className="content-wrapper">
        <div className="portlet-wrapper">
          <h2 className="mb-5">İptal ve İade Yönetimi</h2>
          <Table
            ref={tableEl}
            emptyListText={"İptal Ve Red Sebebi Bulunamadı"}
            getDataFunction={getSellerRejectReasonsCount}
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

            </div>}
            renderItem={(e: SellerRejectReasonsListShowModel, i) => {
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
                  <Link to={`/satici-iptal-iade-yonetimi-detay/${e.Type}`}>
                    <ChevronRightIcon className="icon-sm" />
                  </Link>
                </div>
              </div>
            }}
            sortOptions={sortOptions}
          />
        </div>
      </div>
    </div>
  )
}
