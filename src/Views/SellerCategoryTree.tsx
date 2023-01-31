import { FunctionComponent } from "react"
import { CategoryTree } from "../Components/CategoryTree"

export const SellerCategoryTree: FunctionComponent = () => {
  return (
    <div className="content-wrapper">
      <div className="portlet-wrapper">
        <h2 className="pb-5 mb-5 border-b">Kategori Ağacı</h2>
        <CategoryTree />
      </div>
    </div>

  )
}
