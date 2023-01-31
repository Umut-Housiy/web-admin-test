import React, { FunctionComponent } from "react"
import { ErrorIcon } from "../Components/Icons"

export const Districted: FunctionComponent = () => {
  return (
    <div className="h-screen">
      <div className="flex flex-col items-center justify-center">
        <div className="ml-20 mt-28 bg-white rounded-lg text-center lg:w-4/12	 h-80 flex flex-col items-center justify-center ">
          <ErrorIcon className="w-24 h-24 text-red-400 mb-4 mx-auto" />
          <h3 className="mb-4">Sayfa Erişim Yetkisi Yok</h3>
          <p className="text-tiny text-gray-900">Bu sayfa içeriğine erişim yetkiniz bulunmamaktadır</p>
        </div>
      </div>
    </div>
  )
}