import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

interface TabsProp {
  list: { id: number, name: string, url?: string, lenghtValue?: number, disabled?: boolean }[];
  onItemSelected?: (selected: { id: number }) => void;
  selectedTabsId: number,
  hasLenght?: boolean,
  margin?: string,
}

export const TabsTitle: FunctionComponent<TabsProp> = (props: TabsProp) => {
  return (
    <>
      <div className="w-100 overflow-x-auto overflow-y-hidden whitespace-nowrap custom-scrollbar text-gray-700 text-sm font-medium pb-5 border-b border-gray-200">
        {props.list.map((item, index) => (
          <div key={item.id} className="inline-block">
            {item.url ?
              <Link
                key={item.id}
                to={item.url}
                className={`${props.selectedTabsId === item.id && "text-blue-400 border-b-3 border-blue-400"} cursor-pointer py-4 lg:mr-8 mr-3`}
              >
                {item.name}
              </Link>
              :
              item.disabled ?
                <span
                  key={item.id}
                  className={`${props.margin ? props.margin : "lg:mr-11"} cursor-pointer py-4  mr-3 text-gray-400`}>
                  {item.name}
                  {props.hasLenght && "(" + item.lenghtValue + ")"}
                </span>
                :
                <span
                  key={item.id}
                  className={`${props.selectedTabsId === item.id && "text-blue-400 border-b-2 border-blue-400"} ${props.margin ? props.margin : "lg:mr-8"} cursor-pointer py-4  mr-3`}
                  onClick={() => { props.onItemSelected?.(item); }}>
                  {item.name}
                  {props.hasLenght && "(" + item.lenghtValue + ")"}
                </span>
            }
          </div>
        ))}
      </div>
    </>
  )
}
