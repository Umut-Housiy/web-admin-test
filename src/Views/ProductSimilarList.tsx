import { FunctionComponent, useContext, useRef } from "react"
import { Image } from "../Components/Image";
import { Table } from "../Components/Table";
import { ProductSimilarListModel } from "../Models";
import ApiService from "../Services/ApiService";
import { SharedContextProviderValueModel, SharedContext } from "../Services/SharedContext";

export const ProductSimilarList: FunctionComponent = () => {

  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const tableEl = useRef<any>();

  const getSimilarList = async (order: number, searchText: string, page: number, take: number) => {
    // let list: { Data: ProductSimilarListModel[], TotalCount: number } = {
    //   Data: [
    //     {
    //       ProductSimilarId: 1,
    //       ModelNo1: "123",
    //       ModelNo1Images: ["https://picsum.photos/400/400?random=12", "https://picsum.photos/400/400?random=13"],
    //       ModelNo1ProductId: 100,
    //       ModelNo2: "qwe",
    //       ModelNo2Images: ["https://picsum.photos/400/400?random=14", "https://picsum.photos/400/400?random=15"],
    //       ModelNo2ProductId: 200
    //     }
    //   ],
    //   TotalCount: 1
    // };
    // return list;

    const _result = await ApiService.getProductSimilarList(page, take, searchText, order);

    if (_result.succeeded === true) {
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

  const handleMergeSimilar = async (id: number, toModel1: boolean) => {
    context.showModal({
      type: "Question",
      title: toModel1 ? "Grup 1 Üzerinde birleştir" : "Grup 2 Üzerinde birleştir",
      message: toModel1 ? "Grup 2 üzerinde bulunan tüm ürünler grup 1 üzerine taşınacak. Onaylıyor musunuz? (Bu işlem geri alınamaz)" : "Grup 1 üzerinde bulunan tüm ürünler grup 2 üzerine taşınacak. Onaylıyor musunuz? (Bu işlem geri alınamaz)",
      onClick: async () => {
        const _result = await ApiService.mergeProductSimilar(id, toModel1);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Birleştirme işlemi başarılı",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }

  const handleDeleteSimilar = async (id: number) => {
    context.showModal({
      type: "Question",
      title: "Benzerlik Silinecek",
      message: "Yakalanan benzerlik silinecek. Onaylıyor musunuz?",
      onClick: async () => {
        const _result = await ApiService.deleteProductSimilar(id);

        context.hideModal();

        if (_result.succeeded === true) {
          context.showModal({
            type: "Success",
            title: "Birleştirme işlemi başarılı",
            onClose: () => {
              context.hideModal();
              if (tableEl.current) {
                tableEl.current?.reload();
              }
            }
          });
        }
        else {
          context.showModal({
            type: "Error",
            message: _result.message,
            onClose: () => { context.hideModal(); }
          });
        }
        return true;
      },
      onClose: () => { context.hideModal(); },
    })
  }


  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="mb-5">Benzer Ürün Listesi</h2>
        <Table
          ref={tableEl}
          emptyListText={"Ürün Bulunamadı"}
          getDataFunction={getSimilarList}
          header={
            <div className=" lg:grid-cols-11 px-2 border-b border-t py-6 border-gray-200 hidden lg:grid gap-4 flex items-center">
              <div className="lg:col-span-2 flex items-center">
                <span className="p-sm-gray-400">
                  Ürün Grubu - 1
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Model No - 1
                </span>
              </div>
              <div className="lg:col-span-2">
                <span className="p-sm-gray-400">
                  Ürün Grubu - 2
                </span>
              </div>
              <div className="lg:col-span-1">
                <span className="p-sm-gray-400">
                  Model No - 2
                </span>
              </div>
              <div className="lg:col-span-3 flex items-center">
                <span className="p-sm-gray-400 mx-auto">
                  İşlemler
                </span>
              </div>
            </div>
          }
          renderItem={(e: ProductSimilarListModel, i) => {
            return (
              <div key={"list" + i} className="lg:grid-cols-11 px-2 border-b  border-gray-200 grid gap-4 items-center py-3 ">
                <div className="lg:col-span-2 gap-2 flex  items-center">
                  {e.ModelNo1Images.map(x =>
                    <Image src={x} alt={""} className="h-12 w-12 mr-2 object-contain" ></Image>
                  )}
                </div>
                <div className="lg:col-span-1 flex items-center">
                  <p className="p-sm">
                    {e.ModelNo1}
                  </p>
                </div>
                <div className="lg:col-span-2 gap-2 flex  items-center">
                  {e.ModelNo2Images.map(x =>
                    <Image src={x} alt={""} className="h-12 w-12 mr-2 object-contain" ></Image>
                  )}
                </div>
                <div className="lg:col-span-1 flex items-center">
                  <p className="p-sm">
                    {e.ModelNo2}
                  </p>
                </div>
                <div className="lg:col-span-5 flex">
                  <div className="flex p-sm items-center mx-auto w-full">
                    <div className="border-r border-gray-300 px-2 cursor-pointer"><a target="_blank" rel="noreferrer" href={"/urun-detay/" + e.ModelNo1ProductId} className=""> 1. Grubu İncele</a></div>
                    <div className="border-r border-gray-300 px-2 cursor-pointer"><a target="_blank" rel="noreferrer" href={"/urun-detay/" + e.ModelNo2ProductId} className=""> 2. Grubu İncele</a></div>
                    <div className="border-r border-gray-300 px-2 cursor-pointer" onClick={() => { handleMergeSimilar(e.ProductSimilarId, true) }}>1. Grup üzerinde birleştir</div>
                    <div className="border-r border-gray-300 px-2 cursor-pointer" onClick={() => { handleMergeSimilar(e.ProductSimilarId, false) }}>2. Grup üzerinde birleştir</div>
                    <div className="px-2 cursor-pointer" onClick={() => { handleDeleteSimilar(e.ProductSimilarId) }}>Listeden Kaldır</div>
                  </div>
                </div>
              </div>
            )
          }}
        />
      </div>
    </div>
  )
}
