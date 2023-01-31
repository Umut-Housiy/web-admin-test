import { FunctionComponent, useContext, useState } from "react"
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Button } from "../Components/Button";
import { CategorySelectSeller } from "../Components/CategorySelectSeller"
import { ChevronRightIcon } from "../Components/Icons";
import { Label } from "../Components/Label"
import ApiService from "../Services/ApiService";
import { SharedContext, SharedContextProviderValueModel } from "../Services/SharedContext";

export const LinkedCategoryAdd: FunctionComponent = () => {
  const context = useContext<SharedContextProviderValueModel>(SharedContext);

  const history = useHistory();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  const [selectedCategoryDisplay, setSelectedCategoryDisplay] = useState<string>("");

  const [linkedCategoryId, setLinkedCategoryId] = useState<number>(0);

  const [linkedCategoryDisplay, setLinkedCategoryDisplay] = useState<string>("");

  const [order, setOrder] = useState<number>(0);

  const [processLoading, setProcessLoading] = useState<boolean>(false);

  const createSellerCategoryLinkRelation = async () => {
    setProcessLoading(true);

    const _result = await ApiService.createSellerCategoryLinkRelation(selectedCategoryId, linkedCategoryId, order);

    if (_result.succeeded === true) {
      context.showModal({
        type: "Success",
        title: "Kategori başarıyla linklendi",
        onClose: () => {
          context.hideModal();
          history.push('/satici-kategori-linkleme');
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
        <Link to="/satici-kategori-linkleme" className="inline-block mb-5">
          <div className="flex items-center text-sm text-gray-400 ">
            <ChevronRightIcon className="transform -rotate-180 icon-md mr-3" />
            Kategori Linkleme
          </div>
        </Link>
        <h2 className="mb-5 pb-5 border-b">Yeni Kategori Linkleme</h2>
        <div className="w-1/2">
          <Label title="Kategori Seçimi" withoutDots isRequired />
          <CategorySelectSeller key="1" value={selectedCategoryId} onChange={setSelectedCategoryId} setCategoryDisplayText={setSelectedCategoryDisplay} />
          <Label title="Bağlanacağı Kategori" withoutDots isRequired />
          <CategorySelectSeller key="2" value={linkedCategoryId} onChange={setLinkedCategoryId} setCategoryDisplayText={setLinkedCategoryDisplay} />
          <Label className="mt-4" title="Gösterim Sırası" withoutDots />
          <input className="form-input" type="number" value={order} onChange={(e) => { setOrder(parseInt(e.target.value)); }} />
          <div className="flex mt-4 justify-end">
            <Button isLoading={processLoading} text="Kaydet ve Linkle" design="button-blue-400 w-72" onClick={() => createSellerCategoryLinkRelation()} />
          </div>
        </div>
      </div>
    </div>
  )
}
