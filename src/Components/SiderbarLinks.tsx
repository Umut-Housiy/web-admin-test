import React, { FunctionComponent } from "react"
import { NavLink } from "react-router-dom"

import { ChevronRightIcon } from "./Icons"

interface SidebarLinksProps {
  list: { id:number, title: string, url?: string, }[];
  onItemSelected?: (selected: { id: number }) => void;
  selectedTabsId?: number,

}
export const SidebarLinks: FunctionComponent<SidebarLinksProps> = (props: SidebarLinksProps) => {

  return (
    <div className="sidebar-links text-gray-400">
      {props.list.map((item, index) => (
        <NavLink to={item.url ?? "#"}
          onClick={() => { props.onItemSelected?.(item); }}
          key={index} 
          className={`${props.selectedTabsId === item.id && "sidebar-links--active text-blue-400"} mb-5 flex justify-between items-center font-medium text-tiny`}>
          {item.title}
          <ChevronRightIcon className="sidebar-links--chevron icon-md text-blue-400" />
        </NavLink>
      ))}
    </div>
  )
}