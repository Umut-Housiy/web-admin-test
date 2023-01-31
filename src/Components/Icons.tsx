import { FunctionComponent } from "react";
interface IconProps {
  className?: string;
  onClick?: () => void;
  fill?: string;
}

export const HamburgerIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={props.className} onClick={props.onClick} >
      <path d="M5 16H27" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 8H27" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 24H27" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const HomeIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 12 13" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M7.49963 11.9996V8.99953C7.49963 8.86693 7.44696 8.73975 7.35319 8.64598C7.25942 8.55221 7.13224 8.49953 6.99963 8.49953H4.99963C4.86703 8.49953 4.73985 8.55221 4.64608 8.64598C4.55231 8.73975 4.49963 8.86693 4.49963 8.99953V11.9996C4.49963 12.1322 4.44696 12.2594 4.35321 12.3531C4.25945 12.4469 4.13229 12.4996 3.9997 12.4996L1.00006 12.5C0.934396 12.5 0.869372 12.4871 0.808702 12.4619C0.748032 12.4368 0.692905 12.4 0.646469 12.3536C0.600033 12.3071 0.563197 12.252 0.538066 12.1913C0.512935 12.1307 0.5 12.0657 0.5 12V6.22122C0.5 6.15156 0.514556 6.08267 0.542734 6.01896C0.570913 5.95525 0.612092 5.89814 0.663632 5.85128L5.66329 1.30535C5.75532 1.22167 5.87525 1.1753 5.99964 1.17529C6.12403 1.17529 6.24396 1.22165 6.336 1.30533L11.3363 5.85127C11.3879 5.89814 11.4291 5.95525 11.4573 6.01896C11.4854 6.08267 11.5 6.15157 11.5 6.22124V12C11.5 12.0657 11.4871 12.1307 11.4619 12.1914C11.4368 12.252 11.4 12.3071 11.3535 12.3536C11.3071 12.4 11.252 12.4368 11.1913 12.462C11.1306 12.4871 11.0656 12.5 10.9999 12.5L7.99957 12.4996C7.86697 12.4996 7.73981 12.4469 7.64606 12.3531C7.5523 12.2594 7.49963 12.1322 7.49963 11.9996V11.9996Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const HelmetIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg fill="none" viewBox="0 0 21 21" className={props.className} onClick={props.onClick} >
      <g clipPath="url(#clip0)"> <path fill="currentColor" fillRule="evenodd" d="M19.914 13.683h-.819a8.63 8.63 0 00-3.172-5.932c-.036-1.476-1.213-2.437-2.644-2.437a3.11 3.11 0 00-.6-.842c-1.514-1.515-4.038-1.058-4.958.842-1.432 0-2.609.962-2.644 2.439a8.612 8.612 0 00-3.172 5.93h-.82a.586.586 0 00-.585.586v2.579c0 .323.262.585.586.585h18.828a.586.586 0 00.586-.585v-2.579a.586.586 0 00-.586-.586zm-5.162-5.869V10.9a.586.586 0 001.172 0V9.343a7.42 7.42 0 011.998 4.34h-4.336c0-2.314.02-4.888-.004-7.188.66.08 1.17.645 1.17 1.32zM8.586 6.652c0-1.051.862-1.914 1.914-1.914 1.051 0 1.914.863 1.914 1.914v7.031H8.586v-7.03zm-3.51 2.69V10.9a.586.586 0 101.172 0V7.814c0-.674.51-1.24 1.17-1.319-.052 2.29-.004 4.873-.004 7.188H3.078c.171-1.64.88-3.159 1.998-4.341zm14.252 6.92H1.672v-1.407h17.656v1.407z" clipRule="evenodd"></path>
      </g>
      <defs>
        <clipPath id="clip0">
          <path
            fill="#fff"
            d="M0 0H20V20H0z"
            transform="translate(.5 .5)"
          ></path>
        </clipPath>
      </defs>
    </svg>
  );
};
export const TagIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 21 21" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M10.4797 2.52178L4.17861 3.78201L2.91839 10.0831C2.89821 10.184 2.90325 10.2883 2.93307 10.3868C2.96288 10.4853 3.01655 10.5749 3.08931 10.6477L11.2497 18.808C11.3077 18.8661 11.3766 18.9121 11.4524 18.9435C11.5283 18.9749 11.6095 18.9911 11.6916 18.9911C11.7737 18.9911 11.855 18.9749 11.9308 18.9435C12.0066 18.9121 12.0755 18.8661 12.1336 18.808L19.2046 11.737C19.2627 11.6789 19.3087 11.61 19.3401 11.5342C19.3715 11.4584 19.3877 11.3771 19.3877 11.295C19.3877 11.2129 19.3715 11.1317 19.3401 11.0558C19.3087 10.98 19.2627 10.9111 19.2046 10.8531L11.0443 2.6927C10.9715 2.61995 10.8819 2.56628 10.7834 2.53646C10.685 2.50664 10.5806 2.5016 10.4797 2.52178V2.52178Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.46094 8C7.9787 8 8.39844 7.58027 8.39844 7.0625C8.39844 6.54473 7.9787 6.125 7.46094 6.125C6.94317 6.125 6.52344 6.54473 6.52344 7.0625C6.52344 7.58027 6.94317 8 7.46094 8Z" fill="currentColor" />
    </svg>
  );
};

export const LightBulbIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M6.00012 12.5H10.0001" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.50012 14.5H9.50012" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.99969 10.5C4.16027 9.87033 3.54024 8.99248 3.22743 7.99082C2.91463 6.98916 2.9249 5.91447 3.25679 4.91897C3.58868 3.92348 4.22537 3.05763 5.07668 2.44408C5.92798 1.83053 6.95075 1.50037 8.00012 1.50037C9.04948 1.50036 10.0723 1.83052 10.9236 2.44407C11.7749 3.05762 12.4116 3.92346 12.7435 4.91896C13.0753 5.91446 13.0856 6.98915 12.7728 7.99081C12.46 8.99247 11.84 9.87032 11.0006 10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const SiteGeneralManagementIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M4.75 7C5.99264 7 7 5.99264 7 4.75C7 3.50736 5.99264 2.5 4.75 2.5C3.50736 2.5 2.5 3.50736 2.5 4.75C2.5 5.99264 3.50736 7 4.75 7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.25 7C12.4926 7 13.5 5.99264 13.5 4.75C13.5 3.50736 12.4926 2.5 11.25 2.5C10.0074 2.5 9 3.50736 9 4.75C9 5.99264 10.0074 7 11.25 7Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.75 13.5C5.99264 13.5 7 12.4926 7 11.25C7 10.0074 5.99264 9 4.75 9C3.50736 9 2.5 10.0074 2.5 11.25C2.5 12.4926 3.50736 13.5 4.75 13.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.25 9.5V13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 11.25H9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const UserGearIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick} >
      <path d="M12.5 4.5C13.0523 4.5 13.5 4.05228 13.5 3.5C13.5 2.94772 13.0523 2.5 12.5 2.5C11.9477 2.5 11.5 2.94772 11.5 3.5C11.5 4.05228 11.9477 4.5 12.5 4.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 2.5V1.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.6339 3L10.9844 2.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.6339 4L10.9844 4.375" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 4.5V5.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.3661 4L14.0156 4.375" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.3661 3L14.0156 2.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.93689 13.4994C2.55161 12.4354 3.43552 11.5519 4.49982 10.9376C5.56411 10.3234 6.77131 9.99999 8.00015 10C9.22898 10 10.4362 10.3234 11.5005 10.9377C12.5647 11.552 13.4486 12.4355 14.0633 13.4995" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.6641 7.60684C11.3648 8.28785 10.8815 8.87188 10.2685 9.29326C9.65555 9.71464 8.93716 9.95666 8.19415 9.99212C7.45113 10.0276 6.71296 9.85505 6.06263 9.49395C5.4123 9.13285 4.87559 8.59749 4.51286 7.94807C4.15012 7.29865 3.97574 6.56091 4.00933 5.81781C4.04291 5.07471 4.28313 4.35571 4.70296 3.74166C5.1228 3.1276 5.70561 2.64284 6.38586 2.34188C7.06612 2.04092 7.81684 1.93569 8.55363 2.03802" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const StatisticalIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M2.75 13V8.5H6.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.25 13H1.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.25 13V5.5H9.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.25 2.5H9.75V13H13.25V2.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const SettingsIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 20 21" fill="none" className={props.className} onClick={props.onClick} >
      <path d="M10 13C11.3807 13 12.5 11.8807 12.5 10.5C12.5 9.11929 11.3807 8 10 8C8.61929 8 7.5 9.11929 7.5 10.5C7.5 11.8807 8.61929 13 10 13Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.8755 9.87496L17.6807 8.66712C17.7332 8.58931 17.7679 8.50089 17.7823 8.40816C17.7968 8.31543 17.7907 8.22065 17.7644 8.13055C17.6124 7.63032 17.4122 7.14606 17.1666 6.6846C17.1215 6.60245 17.059 6.53125 16.9833 6.47609C16.9076 6.42092 16.8206 6.38315 16.7286 6.36547L15.3038 6.08048L14.4199 5.19661L14.1349 3.77172C14.1173 3.67973 14.0795 3.59278 14.0243 3.51707C13.9691 3.44137 13.8979 3.37878 13.8158 3.33378C13.3543 3.08813 12.87 2.88795 12.3698 2.73605C12.2797 2.70976 12.1849 2.70362 12.0922 2.71808C11.9994 2.73254 11.911 2.76723 11.8332 2.8197L10.6255 3.62488H9.37545L8.16769 2.8197C8.08987 2.76723 8.00146 2.73254 7.90873 2.71808C7.816 2.70362 7.72122 2.70976 7.63113 2.73605C7.13089 2.88795 6.64661 3.08813 6.18513 3.33377C6.10297 3.37878 6.03177 3.44137 5.9766 3.51707C5.92142 3.59278 5.88365 3.67974 5.86597 3.77173L5.58105 5.19653L4.69711 6.08047L3.27229 6.3654C3.1803 6.38307 3.09335 6.42084 3.01765 6.47601C2.94194 6.53118 2.87935 6.60238 2.83435 6.68453C2.58866 7.14602 2.38845 7.63031 2.23654 8.13056C2.21024 8.22065 2.20411 8.31543 2.21857 8.40816C2.23303 8.50089 2.26773 8.5893 2.3202 8.66711L3.12538 9.87488V11.1249L2.3202 12.3326C2.26773 12.4105 2.23303 12.4989 2.21858 12.5916C2.20412 12.6843 2.21025 12.7791 2.23655 12.8692C2.38842 13.3695 2.5886 13.8537 2.83426 14.3152C2.87927 14.3974 2.94186 14.4686 3.01756 14.5237C3.09326 14.5789 3.18021 14.6167 3.2722 14.6344L4.69711 14.9194L5.58097 15.8032L5.8659 17.2281C5.88358 17.3201 5.92135 17.4071 5.97651 17.4828C6.03168 17.5585 6.10288 17.6211 6.18503 17.6661C6.64649 17.9117 7.13076 18.1119 7.631 18.2638C7.72109 18.2901 7.81586 18.2962 7.90858 18.2818C8.00131 18.2673 8.08971 18.2326 8.16752 18.1801L9.37538 17.375H10.6254L11.8332 18.1802C11.911 18.2327 11.9994 18.2674 12.0922 18.2818C12.1849 18.2963 12.2797 18.2901 12.3698 18.2639C12.87 18.112 13.3543 17.9118 13.8157 17.6661C13.8979 17.6211 13.9691 17.5585 14.0242 17.4828C14.0794 17.4071 14.1172 17.3202 14.1349 17.2282L14.4199 15.8033L15.3037 14.9194L16.7286 14.6344C16.8206 14.6168 16.9075 14.579 16.9833 14.5238C17.059 14.4687 17.1215 14.3974 17.1666 14.3153C17.4122 13.8538 17.6124 13.3696 17.7644 12.8694C17.7907 12.7793 17.7968 12.6845 17.7823 12.5918C17.7679 12.499 17.7332 12.4106 17.6807 12.3328L16.8755 11.125V9.87496Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const GroupBuyIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 22 22" fill="none" className={props.className} onClick={props.onClick} >
      <path d="M8.37367 12.66L8.37192 12.6599C8.12388 12.6363 7.87485 12.6247 7.62569 12.625L7.625 12.625C5.51634 12.625 4.25042 13.4084 3.50463 14.2785C2.73837 15.1725 2.5 16.1821 2.5 16.625C2.5 16.9233 2.57414 17.0548 2.63466 17.1153C2.69518 17.1759 2.8267 17.25 3.125 17.25H7.18086C7.1404 17.0434 7.12153 16.8325 7.125 16.6206C7.12609 15.3617 7.59581 14.0914 8.46585 13.0395L8.37367 12.66ZM8.37367 12.66C8.50308 12.6719 8.632 12.6879 8.76024 12.7079M8.37367 12.66L8.76024 12.7079M8.76024 12.7079C8.6575 12.8157 8.55936 12.9263 8.46597 13.0393L8.76024 12.7079ZM19.5 16.625C19.5 16.8188 19.453 16.9308 19.4082 16.998C19.3613 17.0684 19.2952 17.1215 19.2139 17.1622C19.1306 17.2038 19.0413 17.2271 18.9686 17.2392C18.9334 17.2451 18.9052 17.2478 18.8877 17.2491C18.8792 17.2497 18.8735 17.2499 18.8711 17.25H9.87894C9.87654 17.2499 9.87083 17.2497 9.86228 17.2491C9.84481 17.2478 9.81659 17.2451 9.78142 17.2392C9.7087 17.2271 9.61937 17.2038 9.53611 17.1622C9.4548 17.1215 9.3887 17.0684 9.34181 16.998C9.297 16.9308 9.25 16.8188 9.25 16.625C9.25 16.1821 9.48837 15.1725 10.2546 14.2785C11.0004 13.4084 12.2663 12.625 14.375 12.625C16.4837 12.625 17.7496 13.4084 18.4954 14.2785C19.2616 15.1725 19.5 16.1821 19.5 16.625ZM17.25 7.625C17.25 8.00255 17.1756 8.3764 17.0312 8.72521C16.8867 9.07403 16.6749 9.39096 16.4079 9.65793C16.141 9.9249 15.824 10.1367 15.4752 10.2812C15.1264 10.4256 14.7526 10.5 14.375 10.5C13.9974 10.5 13.6236 10.4256 13.2748 10.2812C12.926 10.1367 12.609 9.9249 12.3421 9.65793C12.0751 9.39096 11.8633 9.07403 11.7188 8.72521C11.5744 8.3764 11.5 8.00255 11.5 7.625C11.5 6.8625 11.8029 6.13124 12.3421 5.59207C12.8812 5.0529 13.6125 4.75 14.375 4.75C15.1375 4.75 15.8688 5.0529 16.4079 5.59207C16.9471 6.13124 17.25 6.8625 17.25 7.625ZM4.1875 8.1875C4.1875 7.425 4.4904 6.69374 5.02957 6.15457C5.56874 5.6154 6.3 5.3125 7.0625 5.3125C7.825 5.3125 8.55626 5.6154 9.09543 6.15457C9.6346 6.69374 9.9375 7.425 9.9375 8.1875C9.9375 8.95 9.6346 9.68126 9.09543 10.2204C8.55626 10.7596 7.825 11.0625 7.0625 11.0625C6.3 11.0625 5.56874 10.7596 5.02957 10.2204C4.4904 9.68126 4.1875 8.95 4.1875 8.1875Z" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
};

export const SearchIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={props.className} onClick={props.onClick}>
      <path fillRule="evenodd" clipRule="evenodd" d="M15.8333 9.16667C15.8333 11.9281 13.5948 14.1667 10.8333 14.1667C8.07191 14.1667 5.83333 11.9281 5.83333 9.16667C5.83333 6.40524 8.07191 4.16667 10.8333 4.16667C13.5948 4.16667 15.8333 6.40524 15.8333 9.16667ZM17.5 9.16667C17.5 12.8486 14.5152 15.8333 10.8333 15.8333C9.29274 15.8333 7.8742 15.3108 6.7453 14.4332L3.92259 17.2559C3.59715 17.5814 3.06951 17.5814 2.74408 17.2559C2.41864 16.9305 2.41864 16.4028 2.74408 16.0774L5.56679 13.2547C4.68923 12.1258 4.16667 10.7073 4.16667 9.16667C4.16667 5.48477 7.15143 2.5 10.8333 2.5C14.5152 2.5 17.5 5.48477 17.5 9.16667Z" fill="currentColor" stroke="currentColor" strokeWidth={0.5} strokeLinecap="round" />
    </svg>
  );
};

export const SearchIconNew: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M7.66665 14C11.1644 14 14 11.1645 14 7.66671C14 4.1689 11.1644 1.33337 7.66665 1.33337C4.16884 1.33337 1.33331 4.1689 1.33331 7.66671C1.33331 11.1645 4.16884 14 7.66665 14Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.6666 14.6667L13.3333 13.3334" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ChevronDownIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M13 6L8 11L3 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const SignoutIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick} >
      <path d="M10.8768 5.375L13.5018 8L10.8768 10.625" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 8H13.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 13.5H3C2.86739 13.5 2.74021 13.4473 2.64645 13.3536C2.55268 13.2598 2.5 13.1326 2.5 13V3C2.5 2.86739 2.55268 2.74021 2.64645 2.64645C2.74021 2.55268 2.86739 2.5 3 2.5H7.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ErrorIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 57 56" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M28.5 17.5V31.5" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28.4998 41.9999C29.7885 41.9999 30.8332 40.9552 30.8332 39.6666C30.8332 38.3779 29.7885 37.3333 28.4998 37.3333C27.2112 37.3333 26.1665 38.3779 26.1665 39.6666C26.1665 40.9552 27.2112 41.9999 28.4998 41.9999Z" fill="currentColor" />
      <path d="M28.4998 51.3334C41.3865 51.3334 51.8332 40.8867 51.8332 28.0001C51.8332 15.1134 41.3865 4.66675 28.4998 4.66675C15.6132 4.66675 5.1665 15.1134 5.1665 28.0001C5.1665 40.8867 15.6132 51.3334 28.4998 51.3334Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  );
};
export const UserIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 17 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M8.5 14C11.8137 14 14.5 11.3137 14.5 8C14.5 4.68629 11.8137 2 8.5 2C5.18629 2 2.5 4.68629 2.5 8C2.5 11.3137 5.18629 14 8.5 14Z" stroke="currentColor" strokeMiterlimit="10" />
      <path d="M8.5 10C9.88071 10 11 8.88071 11 7.5C11 6.11929 9.88071 5 8.5 5C7.11929 5 6 6.11929 6 7.5C6 8.88071 7.11929 10 8.5 10Z" stroke="currentColor" strokeMiterlimit="10" />
      <path d="M4.4873 12.4609C4.86394 11.7204 5.43813 11.0986 6.14632 10.6642C6.85452 10.2299 7.66908 10 8.49986 10C9.33063 10 10.1452 10.2299 10.8534 10.6642C11.5616 11.0985 12.1358 11.7204 12.5124 12.4609" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const KeyIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 17 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M6.32289 7.67717C5.93745 6.71577 5.89578 5.65078 6.20492 4.66221C6.51406 3.67364 7.15504 2.82213 8.01953 2.2516C8.88402 1.68107 9.91898 1.42652 10.9495 1.53099C11.98 1.63545 12.9428 2.09252 13.6752 2.82492C14.4076 3.55733 14.8647 4.52016 14.9691 5.55066C15.0736 6.58116 14.819 7.61612 14.2485 8.4806C13.678 9.34509 12.8265 9.98607 11.8379 10.2952C10.8493 10.6043 9.78434 10.5627 8.82294 10.1772L8.82298 10.1771L8 11.0001H6.5V12.5001H5V14.0001H2.5V11.5001L6.323 7.67712L6.32289 7.67717Z" stroke="#BFBFBF" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.75 5.5C12.1642 5.5 12.5 5.16421 12.5 4.75C12.5 4.33579 12.1642 4 11.75 4C11.3358 4 11 4.33579 11 4.75C11 5.16421 11.3358 5.5 11.75 5.5Z" fill="currentColor" />
    </svg>
  );
};

export const SuccessIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 84 84" fill="none" className={props.className} onClick={props.onClick}>
      <rect width="84" height="84" fill="white" />
      <path d="M73.3038 11.796C72.7132 11.96 71.8601 12.3046 71.4171 12.5507C70.8921 12.846 64.0999 19.5233 50.9913 32.6319L31.3366 52.2538L24.3312 45.2647C20.4593 41.4257 16.9483 38.0296 16.5218 37.7507C13.864 35.946 10.0249 35.9296 7.28506 37.7014C5.59522 38.8007 4.33194 40.5397 3.75772 42.5741C3.1835 44.6249 3.64287 47.496 4.84053 49.3171C5.62803 50.5147 25.8734 70.6452 26.9726 71.3343C28.7116 72.4171 31.3038 72.7944 33.371 72.253C35.7663 71.6296 34.4702 72.86 59.3257 48.0046C74.0257 33.3046 82.4749 24.7405 82.7539 24.2647C83.607 22.7553 83.8859 21.7053 83.8859 19.8514C83.8859 17.3085 83.1968 15.6022 81.4906 13.896C79.407 11.8124 76.2406 11.0085 73.3038 11.796Z" fill="currentColor" />
    </svg>
  );
};

export const CloseIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AlertIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 14 14" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M7 0.500305C3.41594 0.500305 0.5 3.41624 0.5 7.00031C0.5 10.5844 3.41594 13.5003 7 13.5003C10.5841 13.5003 13.5 10.5844 13.5 7.00031C13.5 3.41624 10.5841 0.500305 7 0.500305ZM7 10.4975C6.87639 10.4975 6.75555 10.4608 6.65277 10.3922C6.54999 10.3235 6.46988 10.2259 6.42258 10.1117C6.37527 9.99747 6.36289 9.8718 6.38701 9.75056C6.41112 9.62932 6.47065 9.51796 6.55806 9.43055C6.64547 9.34314 6.75683 9.28362 6.87807 9.2595C6.99931 9.23539 7.12497 9.24776 7.23918 9.29507C7.35338 9.34237 7.45099 9.42248 7.51967 9.52526C7.58834 9.62804 7.625 9.74888 7.625 9.87249C7.625 10.0383 7.55915 10.1972 7.44194 10.3144C7.32473 10.4316 7.16576 10.4975 7 10.4975ZM7.67875 4.21156L7.49938 8.02406C7.49938 8.15666 7.4467 8.28384 7.35293 8.37761C7.25916 8.47138 7.13198 8.52406 6.99937 8.52406C6.86677 8.52406 6.73959 8.47138 6.64582 8.37761C6.55205 8.28384 6.49937 8.15666 6.49937 8.02406L6.32 4.21343V4.21187C6.31607 4.12028 6.33071 4.02885 6.36305 3.94307C6.39539 3.8573 6.44475 3.77895 6.50817 3.71276C6.57158 3.64656 6.64774 3.59388 6.73205 3.5579C6.81636 3.52191 6.90708 3.50336 6.99875 3.50336C7.09042 3.50336 7.18114 3.52191 7.26545 3.5579C7.34976 3.59388 7.42592 3.64656 7.48933 3.71276C7.55275 3.77895 7.60211 3.8573 7.63445 3.94307C7.66679 4.02885 7.68143 4.12028 7.6775 4.21187L7.67875 4.21156Z" fill="currentColor" />
    </svg>
  );
};
export const PlusIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M2.5 8H13.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 2.5V13.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const EditIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={props.className} onClick={props.onClick} >
      <path d="M10 12.5H7.5V10L15 2.5L17.5 5L10 12.5Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.125 4.375L15.625 6.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.875 9.375V16.25C16.875 16.4158 16.8092 16.5747 16.6919 16.6919C16.5747 16.8092 16.4158 16.875 16.25 16.875H3.75C3.58424 16.875 3.42527 16.8092 3.30806 16.6919C3.19085 16.5747 3.125 16.4158 3.125 16.25V3.75C3.125 3.58424 3.19085 3.42527 3.30806 3.30806C3.42527 3.19085 3.58424 3.125 3.75 3.125H10.625" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ChevronRightIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={props.className} onClick={props.onClick}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.89786 5.25862C7.21526 4.92535 7.74274 4.91248 8.07602 5.22989L12.451 9.39655C12.6162 9.55384 12.7096 9.77194 12.7096 10C12.7096 10.2281 12.6162 10.4462 12.451 10.6034L8.07602 14.7701C7.74274 15.0875 7.21526 15.0747 6.89786 14.7414C6.58045 14.4081 6.59332 13.8806 6.92659 13.5632L10.668 10L6.92659 6.43678C6.59332 6.11938 6.58045 5.5919 6.89786 5.25862Z" fill="currentColor" />
    </svg>
  );
};

export const TrashIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M16.875 4.37512L3.125 4.37513" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.125 8.12512V13.1251" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.875 8.12512V13.1251" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.875 1.87512H13.125" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.625 4.37513V16.2501C15.625 16.4159 15.5592 16.5749 15.4419 16.6921C15.3247 16.8093 15.1658 16.8751 15 16.8751H5C4.83424 16.8751 4.67527 16.8093 4.55806 16.6921C4.44085 16.5749 4.375 16.4159 4.375 16.2501V4.37512" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
export const DoubleLeftIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M12.5 13L7.5 8L12.5 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 13L2.5 8L7.5 3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const HelpCircleIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 17" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M8.00004 15.1667C11.6819 15.1667 14.6667 12.1819 14.6667 8.50004C14.6667 4.81814 11.6819 1.83337 8.00004 1.83337C4.31814 1.83337 1.33337 4.81814 1.33337 8.50004C1.33337 12.1819 4.31814 15.1667 8.00004 15.1667Z" fill="currentColor" />
      <path d="M6.06006 6.50001C6.21679 6.05446 6.52616 5.67875 6.93336 5.43944C7.34056 5.20012 7.81932 5.11264 8.28484 5.19249C8.75036 5.27234 9.1726 5.51436 9.47678 5.8757C9.78095 6.23703 9.94743 6.69436 9.94673 7.16668C9.94673 8.50001 7.94673 9.16668 7.94673 9.16668" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11.8334H8.00667" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const StarOutlineIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={props.className} onClick={props.onClick}>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.87085 4.50343C7.50499 4.42421 7.18929 4.19484 7.00089 3.87137L5.99782 2.14922L4.99476 3.87137C4.80636 4.19484 4.49066 4.42421 4.1248 4.50343L2.17697 4.92523L3.50487 6.41137C3.75429 6.69051 3.87488 7.06164 3.83717 7.43407L3.63641 9.41691L5.46016 8.61325C5.80271 8.46229 6.19294 8.46229 6.53549 8.61325L8.35924 9.41691L8.15848 7.43407C8.12077 7.06164 8.24136 6.69051 8.49078 6.41137L9.81868 4.92523L7.87085 4.50343ZM6.5739 0.489093C6.31674 0.0475811 5.67891 0.0475811 5.42175 0.489093L3.84261 3.2003L0.776115 3.86434C0.276747 3.97248 0.0796449 4.5791 0.420081 4.9601L2.51062 7.29976L2.19456 10.4214C2.14309 10.9297 2.65911 11.3046 3.12666 11.0986L5.99782 9.83337L8.86898 11.0986C9.33654 11.3046 9.85256 10.9297 9.80109 10.4214L9.48503 7.29976L11.5756 4.9601C11.916 4.5791 11.7189 3.97248 11.2195 3.86434L8.15304 3.2003L6.5739 0.489093Z" fill="currentColor" />
    </svg>
  );
};

export const StarIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={props.className} onClick={props.onClick}>
      <path fillRule="evenodd" clipRule="evenodd" d="M6.5739 0.989093C6.31674 0.547581 5.67891 0.547581 5.42175 0.989093L3.84261 3.7003L0.776115 4.36434C0.276747 4.47248 0.0796449 5.0791 0.420081 5.4601L2.51062 7.79976L2.19456 10.9214C2.14309 11.4297 2.65911 11.8046 3.12666 11.5986L5.99782 10.3334L8.86898 11.5986C9.33654 11.8046 9.85256 11.4297 9.80109 10.9214L9.48503 7.79976L11.5756 5.4601C11.916 5.0791 11.7189 4.47248 11.2195 4.36434L8.15304 3.7003L6.5739 0.989093Z" fill="currentColor" />
    </svg>
  );
};

export const FilterIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M8.5 8.00012L2.5 8.00014" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 8.00014L10.5 8.00012" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 12.5001L2.5 12.5002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 12.5002L5.5 12.5001" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 14.0001L5.5 11.0001" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 3.5002L2.5 3.50012" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 3.50012L7.5 3.5002" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 2.00012L7.5 5.00012" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 9.50012L10.5 6.50012" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const RefreshIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 17" fill="none" className={props.className} onClick={props.onClick}>
      <g clipPath="url(#refresh)">
        <path d="M15.3334 3.16663V7.16663H11.3334" stroke="#155FB4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M0.666626 13.8334V9.83337H4.66663" stroke="#155FB4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.33996 6.50001C2.67807 5.54453 3.25271 4.69028 4.01027 4.01696C4.76783 3.34363 5.6836 2.87319 6.67215 2.64952C7.6607 2.42584 8.6898 2.45624 9.66342 2.73786C10.637 3.01948 11.5235 3.54315 12.24 4.26001L15.3333 7.16668M0.666626 9.83334L3.75996 12.74C4.47646 13.4569 5.36287 13.9805 6.3365 14.2622C7.31012 14.5438 8.33922 14.5742 9.32777 14.3505C10.3163 14.1268 11.2321 13.6564 11.9896 12.9831C12.7472 12.3097 13.3218 11.4555 13.66 10.5" stroke="#155FB4" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="refresh">
          <rect width={16} height={16} fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const EyeOffIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 17 16" fill="none" className={props.className} onClick={props.onClick} >
      <g clipPath="url(#eye-off)">
        <path d="M9.91334 9.41368C9.73024 9.61017 9.50944 9.76778 9.26411 9.87709C9.01877 9.9864 8.75394 10.0452 8.4854 10.0499C8.21686 10.0547 7.95011 10.0053 7.70108 9.90467C7.45204 9.80408 7.22582 9.65436 7.0359 9.46444C6.84599 9.27453 6.69627 9.0483 6.59568 8.79927C6.49509 8.55023 6.44569 8.28349 6.45043 8.01495C6.45517 7.74641 6.51394 7.48157 6.62326 7.23624C6.73257 6.99091 6.89017 6.77011 7.08667 6.58701M12.46 11.9603C11.3204 12.829 9.93274 13.3103 8.5 13.3337C3.83334 13.3337 1.16667 8.00034 1.16667 8.00034C1.99593 6.45494 3.1461 5.10475 4.54 4.04034L12.46 11.9603ZM7.1 2.82701C7.55889 2.7196 8.02871 2.6659 8.5 2.66701C13.1667 2.66701 15.8333 8.00034 15.8333 8.00034C15.4287 8.75741 14.946 9.47017 14.3933 10.127L7.1 2.82701Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.16667 0.666992L15.8333 15.3337" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="eye-off">
          <rect width="16" height="16" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const ThreeDotIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M8 8.75C8.41421 8.75 8.75 8.41421 8.75 8C8.75 7.58579 8.41421 7.25 8 7.25C7.58579 7.25 7.25 7.58579 7.25 8C7.25 8.41421 7.58579 8.75 8 8.75Z" fill="currentColor" />
      <path d="M4 8.75C4.41421 8.75 4.75 8.41421 4.75 8C4.75 7.58579 4.41421 7.25 4 7.25C3.58579 7.25 3.25 7.58579 3.25 8C3.25 8.41421 3.58579 8.75 4 8.75Z" fill="currentColor" />
      <path d="M12 8.75C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25C11.5858 7.25 11.25 7.58579 11.25 8C11.25 8.41421 11.5858 8.75 12 8.75Z" fill="currentColor" />
    </svg>
  );
};

export const NormalFaceIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg className={props.className} viewBox="0 0 56 56" fill="none" >
      <circle cx="27.9999" cy="27.9999" r="23.8846" fill="white" />
      <path d="M28 41.125C35.2487 41.125 41.125 35.2487 41.125 28C41.125 20.7513 35.2487 14.875 28 14.875C20.7513 14.875 14.875 20.7513 14.875 28C14.875 35.2487 20.7513 41.125 28 41.125Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.75 31.9375H33.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.0625 24.0625H24.0756" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31.9375 24.0625H31.9506" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 1C31.5457 1 35.0567 1.69838 38.3325 3.05525C41.6082 4.41213 44.5847 6.40094 47.0919 8.90812C49.5991 11.4153 51.5879 14.3918 52.9447 17.6676C54.3016 20.9433 55 24.4543 55 28C55 31.5457 54.3016 35.0567 52.9447 38.3325C51.5879 41.6082 49.5991 44.5847 47.0919 47.0919C44.5847 49.5991 41.6082 51.5879 38.3324 52.9448C35.0567 54.3016 31.5457 55 28 55C24.4543 55 20.9433 54.3016 17.6675 52.9447C14.3917 51.5879 11.4153 49.5991 8.90811 47.0919C6.40093 44.5847 4.41212 41.6082 3.05525 38.3324C1.69837 35.0566 0.999998 31.5457 1 28C1 24.4543 1.69838 20.9433 3.05526 17.6675C4.41214 14.3917 6.40094 11.4153 8.90813 8.90811C11.4153 6.40093 14.3918 4.41212 17.6676 3.05525C20.9434 1.69837 24.4543 0.999998 28 1L28 1Z" stroke="#EFEFEF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 1C33.557 1 38.9787 2.71465 43.5251 5.90996C48.0716 9.10527 51.5214 13.6256 53.4038 18.8541C55.2862 24.0826 55.5094 29.7645 54.043 35.1246C52.5767 40.4846 49.4922 45.2617 45.2104 48.8039C40.9287 52.346 35.6583 54.4808 30.1184 54.9168C24.5785 55.3528 19.039 54.0688 14.2559 51.24C9.47273 48.4113 5.6789 44.1756 3.39211 39.1109C1.10532 34.0462 0.436964 28.3993 1.47824 22.9407" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const CoverPhotoIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={props.className} onClick={props.onClick}>
      <g filter="url(#filter0_d)">
        <rect x="8" y="6.00049" width="24" height="24" rx="2" fill="#FE894D" />
        <path d="M25.5 13.0005H14.5C14.2239 13.0005 14 13.2243 14 13.5005V22.5005C14 22.7766 14.2239 23.0005 14.5 23.0005H25.5C25.7761 23.0005 26 22.7766 26 22.5005V13.5005C26 13.2243 25.7761 13.0005 25.5 13.0005Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 20.5004L17.1464 17.354C17.1929 17.3075 17.248 17.2707 17.3086 17.2456C17.3693 17.2205 17.4343 17.2075 17.5 17.2075C17.5657 17.2075 17.6307 17.2205 17.6913 17.2456C17.752 17.2707 17.8071 17.3075 17.8535 17.354L20.6464 20.1469C20.6929 20.1933 20.748 20.2301 20.8086 20.2552C20.8693 20.2804 20.9343 20.2933 21 20.2933C21.0657 20.2933 21.1307 20.2804 21.1913 20.2552C21.252 20.2301 21.3071 20.1933 21.3535 20.1469L22.6464 18.854C22.6929 18.8075 22.748 18.7707 22.8086 18.7456C22.8693 18.7205 22.9343 18.7075 23 18.7075C23.0657 18.7075 23.1307 18.7205 23.1913 18.7456C23.252 18.7707 23.3071 18.8075 23.3535 18.854L26 21.5004" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21.75 17.0005C22.1642 17.0005 22.5 16.6647 22.5 16.2505C22.5 15.8363 22.1642 15.5005 21.75 15.5005C21.3358 15.5005 21 15.8363 21 16.2505C21 16.6647 21.3358 17.0005 21.75 17.0005Z" fill="white" />
      </g>
      <defs>
        <filter id="filter0_d" x="0" y="0.000488281" width="40" height="40" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation={4} />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

export const HappyFaceIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg className={props.className} viewBox="0 0 56 56" fill="none">
      <circle cx="27.9999" cy="27.9999" r="23.8846" fill="white" />
      <path d="M28 41.125C35.2487 41.125 41.125 35.2487 41.125 28C41.125 20.7513 35.2487 14.875 28 14.875C20.7513 14.875 14.875 20.7513 14.875 28C14.875 35.2487 20.7513 41.125 28 41.125Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22.75 30.625C22.75 30.625 24.7188 33.25 28 33.25C31.2813 33.25 33.25 30.625 33.25 30.625" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.0625 24.0625H24.0756" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31.9375 24.0625H31.9506" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 1C31.5457 1 35.0567 1.69838 38.3325 3.05525C41.6082 4.41213 44.5847 6.40094 47.0919 8.90812C49.5991 11.4153 51.5879 14.3918 52.9447 17.6676C54.3016 20.9433 55 24.4543 55 28C55 31.5457 54.3016 35.0567 52.9447 38.3325C51.5879 41.6082 49.5991 44.5847 47.0919 47.0919C44.5847 49.5991 41.6082 51.5879 38.3324 52.9448C35.0567 54.3016 31.5457 55 28 55C24.4543 55 20.9433 54.3016 17.6675 52.9447C14.3917 51.5879 11.4153 49.5991 8.90811 47.0919C6.40093 44.5847 4.41212 41.6082 3.05525 38.3324C1.69837 35.0566 0.999998 31.5457 1 28C1 24.4543 1.69838 20.9433 3.05526 17.6675C4.41214 14.3917 6.40094 11.4153 8.90813 8.90811C11.4153 6.40093 14.3918 4.41212 17.6676 3.05525C20.9434 1.69837 24.4543 0.999998 28 1L28 1Z" stroke="#EFEFEF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 1C34.0647 1 39.9528 3.04182 44.7155 6.79644C49.4783 10.5511 52.8382 15.7998 54.254 21.697C55.6698 27.5941 55.0589 33.7962 52.5199 39.3038C49.9808 44.8114 45.6614 49.3039 40.2577 52.0572C34.854 54.8105 28.6807 55.6644 22.7326 54.4812C16.7844 53.298 11.4077 50.1467 7.46904 45.5351C3.53032 40.9234 1.25891 35.12 1.02082 29.06C0.782718 23 2.5918 17.0362 6.15655 12.1298" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ClockIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M6 3.75V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.94856 7.125L6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.36719 4.67432H1.49219V2.79932" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.08318 8.91682C3.66007 9.49371 4.39507 9.88658 5.19525 10.0457C5.99542 10.2049 6.82482 10.1232 7.57856 9.811C8.33231 9.49879 8.97654 8.97008 9.42981 8.29173C9.88307 7.61338 10.125 6.81585 10.125 6C10.125 5.18415 9.88307 4.38663 9.42981 3.70827C8.97654 3.02992 8.33231 2.50121 7.57856 2.189C6.82482 1.87679 5.99542 1.7951 5.19525 1.95426C4.39507 2.11343 3.66007 2.50629 3.08318 3.08319L1.49219 4.67418" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const SadFaceIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg className={props.className} viewBox="0 0 56 56" fill="none" >
      <circle cx="27.9999" cy="27.9999" r="23.8846" fill="white" />
      <path d="M28 41.125C35.2487 41.125 41.125 35.2487 41.125 28C41.125 20.7513 35.2487 14.875 28 14.875C20.7513 14.875 14.875 20.7513 14.875 28C14.875 35.2487 20.7513 41.125 28 41.125Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M33.25 33.25C33.25 33.25 31.2813 30.625 28 30.625C24.7188 30.625 22.75 33.25 22.75 33.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.0625 24.0625H24.0756" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31.9375 24.0625H31.9506" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 1C31.5457 1 35.0567 1.69838 38.3325 3.05525C41.6082 4.41213 44.5847 6.40094 47.0919 8.90812C49.5991 11.4153 51.5879 14.3918 52.9447 17.6676C54.3016 20.9433 55 24.4543 55 28C55 31.5457 54.3016 35.0567 52.9447 38.3325C51.5879 41.6082 49.5991 44.5847 47.0919 47.0919C44.5847 49.5991 41.6082 51.5879 38.3324 52.9448C35.0567 54.3016 31.5457 55 28 55C24.4543 55 20.9433 54.3016 17.6675 52.9447C14.3917 51.5879 11.4153 49.5991 8.90811 47.0919C6.40093 44.5847 4.41212 41.6082 3.05525 38.3324C1.69837 35.0566 0.999998 31.5457 1 28C1 24.4543 1.69838 20.9433 3.05526 17.6675C4.41214 14.3917 6.40094 11.4153 8.90813 8.90811C11.4153 6.40093 14.3918 4.41212 17.6676 3.05525C20.9434 1.69837 24.4543 0.999998 28 1L28 1Z" stroke="#EFEFEF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M28 1C33.557 1 38.9787 2.71465 43.5251 5.90996C48.0716 9.10527 51.5214 13.6256 53.4038 18.8541C55.2862 24.0826 55.5094 29.7645 54.043 35.1246C52.5767 40.4846 49.4922 45.2617 45.2104 48.8039C40.9287 52.346 35.6583 54.4808 30.1184 54.9168C24.5785 55.3528 19.039 54.0688 14.2559 51.24C9.47273 48.4113 5.6789 44.1756 3.39211 39.1109C1.10532 34.0462 0.436964 28.3993 1.47824 22.9407" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const LikeButton: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 29 28" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M8.96663 25.6673H5.46663C4.8478 25.6673 4.2543 25.4215 3.81672 24.9839C3.37913 24.5463 3.1333 23.9528 3.1333 23.334V15.1673C3.1333 14.5485 3.37913 13.955 3.81672 13.5174C4.2543 13.0798 4.8478 12.834 5.46663 12.834H8.96663M17.1333 10.5007V5.83398C17.1333 4.90573 16.7646 4.01549 16.1082 3.35911C15.4518 2.70273 14.5616 2.33398 13.6333 2.33398L8.96663 12.834V25.6673H22.1266C22.6894 25.6737 23.2354 25.4765 23.6642 25.112C24.093 24.7475 24.3756 24.2404 24.46 23.684L26.07 13.184C26.1207 12.8496 26.0982 12.5081 26.0039 12.1833C25.9096 11.8584 25.7458 11.558 25.5238 11.3028C25.3019 11.0475 25.0271 10.8436 24.7185 10.7051C24.4099 10.5666 24.0749 10.4968 23.7366 10.5007H17.1333Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const OrderCancelIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 31 28" fill="none" className={props.className} onClick={props.onClick} >
      <path d="M24.3999 10H29.3999V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.3999 4.88459C7.58649 3.65303 8.99517 2.67609 10.5455 2.00957C12.0959 1.34305 13.7575 1 15.4356 1C17.1137 1 18.7754 1.34305 20.3257 2.00957C21.8761 2.67609 23.2847 3.65303 24.4713 4.88459L29.3999 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.3999 18H1.3999V25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.3999 23.1154C23.2133 24.347 21.8046 25.3239 20.2543 25.9904C18.7039 26.6569 17.0423 27 15.3642 27C13.6861 27 12.0244 26.6569 10.4741 25.9904C8.92374 25.3239 7.51506 24.347 6.32847 23.1154L1.3999 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.9555 14.5L15.8933 20.524" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.2839 17.274V11.7272C21.2839 11.6442 21.2619 11.5627 21.2201 11.491C21.1782 11.4193 21.1181 11.36 21.0458 11.3192L16.124 8.53724C16.0536 8.49746 15.9741 8.47656 15.8933 8.47656C15.8125 8.47656 15.733 8.49746 15.6627 8.53724L10.7408 11.3192C10.6685 11.36 10.6084 11.4193 10.5666 11.491C10.5247 11.5627 10.5027 11.6442 10.5027 11.7272V17.274C10.5027 17.357 10.5247 17.4385 10.5666 17.5102C10.6084 17.5819 10.6685 17.6412 10.7408 17.6821L15.6627 20.464C15.733 20.5038 15.8125 20.5247 15.8933 20.5247C15.9741 20.5247 16.0536 20.5038 16.124 20.464L21.0458 17.6821C21.1181 17.6412 21.1782 17.5819 21.2201 17.5102C21.2619 17.4385 21.2839 17.357 21.2839 17.274V17.274Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.2197 11.4889L15.9555 14.4991L10.5673 11.4883" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.7723 15.7017V12.8892L13.3361 9.85156" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PacketUpIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 49 48" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M24.3186 32L24.1859 44.8513" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35.6859 37.9163V26.0832C35.6859 25.9061 35.6389 25.7322 35.5496 25.5793C35.4604 25.4263 35.3321 25.2998 35.178 25.2127L24.678 19.2779C24.5279 19.193 24.3583 19.1484 24.1859 19.1484C24.0135 19.1484 23.844 19.193 23.6939 19.2779L13.1939 25.2127C13.0397 25.2998 12.9114 25.4263 12.8222 25.5793C12.7329 25.7322 12.6859 25.9061 12.6859 26.0832V37.9163C12.6859 38.0934 12.7329 38.2673 12.8222 38.4202C12.9114 38.5732 13.0397 38.6997 13.1939 38.7869L23.6939 44.7216C23.844 44.8065 24.0135 44.8511 24.1859 44.8511C24.3583 44.8511 24.5279 44.8065 24.678 44.7216L35.178 38.7869C35.3321 38.6997 35.4604 38.5732 35.5496 38.4202C35.6389 38.2673 35.6859 38.0934 35.6859 37.9163V37.9163Z" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35.549 25.5775L24.3186 31.9992L12.8237 25.5762" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30.3277 34.5642V28.5642L18.7303 22.084" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.45 8.4375L24.2 1.6875L30.95 8.4375H27.575V14.625C27.575 14.7742 27.5157 14.9173 27.4102 15.0227C27.3047 15.1282 27.1616 15.1875 27.0125 15.1875H21.3875C21.2383 15.1875 21.0952 15.1282 20.9897 15.0227C20.8842 14.9173 20.825 14.7742 20.825 14.625V8.4375H17.45Z" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const CheckIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M9.75 3.00037L4.5 9.00037L2.25 6.75037" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AnswerArrow: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 20 20" fill="none" strokeWidth={2} className={props.className} onClick={props.onClick}>
      <path d="M12.5 8.3335L16.6667 12.5002L12.5 16.6668" stroke="currentColor" />
      <path d="M3.33203 3.3335V9.16683C3.33203 10.0509 3.68322 10.8987 4.30834 11.5239C4.93346 12.149 5.78131 12.5002 6.66536 12.5002H16.6654" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
};

export const ChevronFillIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 7 4" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M0 0L3.5 4L7 0" fill="currentColor" />
    </svg>
  );
};

export const EyeIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 17" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M7.98941 4C5.55378 4 3.05534 5.40969 1.08847 8.22906C1.03233 8.31042 1.00156 8.4066 1.00006 8.50544C0.998556 8.60428 1.02639 8.70135 1.08003 8.78438C2.59128 11.15 5.05628 13 7.98941 13C10.8907 13 13.4063 11.1444 14.9203 8.77344C14.9727 8.69203 15.0006 8.59727 15.0006 8.50047C15.0006 8.40366 14.9727 8.3089 14.9203 8.2275C13.4028 5.88375 10.8688 4 7.98941 4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11C9.38071 11 10.5 9.88071 10.5 8.5C10.5 7.11929 9.38071 6 8 6C6.61929 6 5.5 7.11929 5.5 8.5C5.5 9.88071 6.61929 11 8 11Z" stroke="currentColor" strokeMiterlimit={10} />
    </svg>
  );
};

export const MakeCoverPhotoIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 11 11" className={props.className} onClick={props.onClick} fill="none">
      <path d="M9.10449 2.375H2.22949C2.0569 2.375 1.91699 2.51491 1.91699 2.6875V8.3125C1.91699 8.48509 2.0569 8.625 2.22949 8.625H9.10449C9.27708 8.625 9.41699 8.48509 9.41699 8.3125V2.6875C9.41699 2.51491 9.27708 2.375 9.10449 2.375Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.91699 7.06245L3.88352 5.09592C3.91253 5.06691 3.94698 5.04389 3.9849 5.02818C4.02281 5.01248 4.06345 5.00439 4.10449 5.00439C4.14552 5.00439 4.18616 5.01248 4.22407 5.02818C4.26199 5.04389 4.29644 5.06691 4.32546 5.09592L6.07102 6.84148C6.10003 6.8705 6.13448 6.89352 6.1724 6.90922C6.21031 6.92493 6.25095 6.93301 6.29199 6.93301C6.33302 6.93301 6.37366 6.92493 6.41157 6.90922C6.44949 6.89352 6.48394 6.8705 6.51296 6.84148L7.32102 6.03342C7.35003 6.00441 7.38448 5.98139 7.4224 5.96568C7.46031 5.94998 7.50095 5.94189 7.54199 5.94189C7.58302 5.94189 7.62366 5.94998 7.66157 5.96568C7.69949 5.98139 7.73394 6.00441 7.76296 6.03342L9.41698 7.68745" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.76074 4.875C7.01963 4.875 7.22949 4.66513 7.22949 4.40625C7.22949 4.14737 7.01963 3.9375 6.76074 3.9375C6.50186 3.9375 6.29199 4.14737 6.29199 4.40625C6.29199 4.66513 6.50186 4.875 6.76074 4.875Z" fill="#7A7A7A" />
    </svg>
  );
};

export const ChevronRightFill: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 6 10" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M1.3331 1L5.3331 5L1.3331 9" fill="currentColor" />
      <path d="M1.3331 1L5.3331 5L1.3331 9L1.3331 1Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const MagnifyGlassIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg className={props.className} onClick={props.onClick} viewBox="0 0 48 48" fill="none" >
      <path d="M46.5026 41.1248L33.2633 27.3131C34.1122 25.9801 34.7955 24.5442 35.2603 23.0365C35.7828 21.3435 36.0476 19.578 36.0476 17.7894C36.0476 7.98047 28.0671 0 18.2582 0C8.44922 0 0.46875 7.98047 0.46875 17.7894C0.46875 27.5984 8.44922 35.5789 18.2582 35.5789C19.4231 35.5789 20.5891 35.4653 21.7255 35.2408C22.6011 35.068 23.1713 34.2177 22.9984 33.3409C22.8256 32.4661 21.9756 31.8878 21.0985 32.068C20.1691 32.2511 19.2136 32.3445 18.2582 32.3445C10.233 32.3445 3.70312 25.8146 3.70312 17.7894C3.70312 9.76428 10.233 3.23438 18.2582 3.23438C26.2833 3.23438 32.8132 9.76428 32.8132 17.7894C32.8132 19.2543 32.5968 20.6986 32.1694 22.0836C31.274 24.9869 29.4349 27.5984 26.9901 29.4353C26.967 29.4525 26.9568 29.4785 26.9352 29.4968C26.9114 29.5166 26.881 29.5228 26.8583 29.5441C26.7964 29.6023 26.7671 29.6781 26.7162 29.7429C26.6506 29.826 26.5825 29.9037 26.5349 29.996C26.4862 30.0912 26.4613 30.1897 26.4327 30.2911C26.4045 30.39 26.3738 30.4838 26.365 30.5859C26.3558 30.6899 26.3697 30.7896 26.3807 30.8936C26.391 30.9961 26.3979 31.0953 26.4283 31.1957C26.4595 31.2986 26.5151 31.3901 26.5675 31.4865C26.6052 31.5564 26.6199 31.6337 26.6689 31.6992C26.6869 31.723 26.7144 31.734 26.7334 31.7563C26.7524 31.7794 26.7579 31.808 26.7788 31.83L40.7604 46.8179C41.5481 47.606 42.5837 48 43.6197 48C44.655 48 45.6903 47.606 46.4784 46.8179C48.0553 45.2417 48.0553 42.6764 46.5026 41.1248ZM44.191 44.5312C43.8754 44.8455 43.3638 44.8469 43.0865 44.5712L30.301 30.8643C30.635 30.5555 30.9565 30.2358 31.2656 29.903L44.191 43.3868C44.5063 43.7029 44.5063 44.2152 44.191 44.5312Z" fill="currentColor" />
    </svg>
  );
};

export const LiraIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg className={props.className} viewBox="0 0 16 16" fill="none">
      <path d="M11.48 7.59C11.48 8.63667 11.3533 9.49333 11.1 10.16C10.8467 10.82 10.4467 11.3133 9.9 11.64C9.35333 11.96 8.63333 12.12 7.74 12.12C7.12 12.12 6.38 12.03 5.52 11.85V9.58L4.14 9.86V8.93L5.52 8.65V7.93L4.11 8.22V7.32L5.52 7.02V4.96H6.95V6.72L8.45 6.41V7.33L6.95 7.64V8.36L8.43 8.06V8.98L6.95 9.28V10.73C7.17 10.7767 7.43 10.8 7.73 10.8C8.59667 10.8 9.19667 10.5267 9.53 9.98C9.87 9.43333 10.04 8.63667 10.04 7.59H11.48Z" fill="currentColor" />
    </svg>
  );
};

export const EnvelopeIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg className={props.className} viewBox="0 0 16 16" fill="none" >
      <path d="M14 3.5L8 9L2 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 3.5H14V12C14 12.1326 13.9473 12.2598 13.8536 12.3536C13.7598 12.4473 13.6326 12.5 13.5 12.5H2.5C2.36739 12.5 2.24021 12.4473 2.14645 12.3536C2.05268 12.2598 2 12.1326 2 12V3.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.90921 8L2.1543 12.3587" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.8448 12.3587L9.08984 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const WebIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg className={props.className} viewBox="0 0 16 16" fill="none" >
      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeMiterlimit={10} />
      <path d="M2 8H14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 13.838C9.38071 13.838 10.5 11.2238 10.5 7.99909C10.5 4.77434 9.38071 2.16016 8 2.16016C6.61929 2.16016 5.5 4.77434 5.5 7.99909C5.5 11.2238 6.61929 13.838 8 13.838Z" stroke="currentColor" strokeMiterlimit={10} />
    </svg>
  );
};

export const MapPinIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg className={props.className} viewBox="0 0 16 16" fill="none" >
      <path d="M8 8.5C9.10457 8.5 10 7.60457 10 6.5C10 5.39543 9.10457 4.5 8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 7.60457 6.89543 8.5 8 8.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 6.5C13 11 8 14.5 8 14.5C8 14.5 3 11 3 6.5C3 5.17392 3.52678 3.90215 4.46447 2.96447C5.40215 2.02678 6.67392 1.5 8 1.5C9.32608 1.5 10.5979 2.02678 11.5355 2.96447C12.4732 3.90215 13 5.17392 13 6.5V6.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  );
};

export const SearchIconLg: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 49 48" fill="none" className={props.className} onClick={props.onClick}>
      <g clipPath="url(#searchLg)">
        <path d="M9.05469 19.4066C8.16187 19.4066 7.4375 18.6826 7.4375 17.7894C7.4375 11.547 12.5157 6.46875 18.7582 6.46875C19.6514 6.46875 20.3754 7.19312 20.3754 8.08594C20.3754 8.97913 19.6514 9.70312 18.7582 9.70312C14.2996 9.70312 10.6719 13.3308 10.6719 17.7894C10.6719 18.6826 9.94788 19.4066 9.05469 19.4066Z" fill="currentColor" />
        <path d="M47.0026 41.1248L33.7633 27.3131C34.6122 25.9801 35.2955 24.5442 35.7603 23.0365C36.2828 21.3435 36.5476 19.578 36.5476 17.7894C36.5476 7.98047 28.5671 0 18.7582 0C8.94922 0 0.96875 7.98047 0.96875 17.7894C0.96875 27.5984 8.94922 35.5789 18.7582 35.5789C19.9231 35.5789 21.0891 35.4653 22.2255 35.2408C23.1011 35.068 23.6713 34.2177 23.4984 33.3409C23.3256 32.4661 22.4756 31.8878 21.5985 32.068C20.6691 32.2511 19.7136 32.3445 18.7582 32.3445C10.733 32.3445 4.20312 25.8146 4.20312 17.7894C4.20312 9.76428 10.733 3.23438 18.7582 3.23438C26.7833 3.23438 33.3132 9.76428 33.3132 17.7894C33.3132 19.2543 33.0968 20.6986 32.6694 22.0836C31.774 24.9869 29.9349 27.5984 27.4901 29.4353C27.467 29.4525 27.4568 29.4785 27.4352 29.4968C27.4114 29.5166 27.381 29.5228 27.3583 29.5441C27.2964 29.6023 27.2671 29.6781 27.2162 29.7429C27.1506 29.826 27.0825 29.9037 27.0349 29.996C26.9862 30.0912 26.9613 30.1897 26.9327 30.2911C26.9045 30.39 26.8738 30.4838 26.865 30.5859C26.8558 30.6899 26.8697 30.7896 26.8807 30.8936C26.891 30.9961 26.8979 31.0953 26.9283 31.1957C26.9595 31.2986 27.0151 31.3901 27.0675 31.4865C27.1052 31.5564 27.1199 31.6337 27.1689 31.6992C27.1869 31.723 27.2144 31.734 27.2334 31.7563C27.2524 31.7794 27.2579 31.808 27.2788 31.83L41.2604 46.8179C42.0481 47.606 43.0837 48 44.1197 48C45.155 48 46.1903 47.606 46.9784 46.8179C48.5553 45.2417 48.5553 42.6764 47.0026 41.1248ZM44.691 44.5312C44.3754 44.8455 43.8638 44.8469 43.5865 44.5712L30.801 30.8643C31.135 30.5555 31.4565 30.2358 31.7656 29.903L44.691 43.3868C45.0063 43.7029 45.0063 44.2152 44.691 44.5312Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="searchLh">
          <rect width="48" height="48" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const EmptyListData: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg width="124" height="84" viewBox="0 0 124 84" fill="none" className={props.className} onClick={props.onClick}>
      <path fillRule="evenodd" clipRule="evenodd" d="M30.9995 12.1244C30.9995 10.2291 32.8043 9.95508 32.8043 9.95508L36.0737 9.96295C36.0737 9.96295 37.9938 9.96295 37.9938 12.1328C37.9938 14.3027 36.0737 14.3027 36.0737 14.3027L32.8043 14.2937C32.8043 14.2937 30.9995 14.0197 30.9995 12.1244ZM78.3017 14.3027L66.7269 14.2994L55.1521 14.296H42.785C42.785 14.296 40.9802 14.022 40.9802 12.1267C40.9802 10.2314 42.785 9.95742 42.785 9.95742L66.728 9.96295H90.3437C90.3437 9.96295 92.2637 9.96295 92.2637 12.1328C92.2637 14.3027 90.3437 14.3027 90.3437 14.3027H78.3017ZM78.3017 24.977L66.7269 24.9736L55.1521 24.9703H42.785C42.785 24.9703 40.9802 24.6963 40.9802 22.801C40.9802 20.9057 42.785 20.6317 42.785 20.6317L66.728 20.6372H86.9641C86.9641 20.6372 88.8842 20.6372 88.8842 22.8071C88.8842 24.977 86.9641 24.977 86.9641 24.977H78.3017ZM69.8979 56.125C71.1606 57.803 72.6887 59.27 74.4198 60.4636L66.7269 60.4614L55.1521 60.4581H42.785C42.785 60.4581 40.9802 60.1841 40.9802 58.2888C40.9802 56.3935 42.785 56.1195 42.785 56.1195L66.728 56.125H69.8979ZM66 44.4264C66 44.4324 66 44.4384 66 44.4445C66 45.9286 66.1663 47.374 66.4813 48.7629L55.1521 48.7597H42.785C42.785 48.7597 40.9802 48.4856 40.9802 46.5904C40.9802 44.6951 42.785 44.421 42.785 44.421L66 44.4264ZM67.5311 36.8685C68.1918 35.3084 69.0503 33.8523 70.0752 32.5319H66.728L42.785 32.5264C42.785 32.5264 40.9802 32.8004 40.9802 34.6957C40.9802 36.591 42.785 36.865 42.785 36.865H55.1521L66.7269 36.8683L67.5311 36.8685ZM32.8043 20.6294C32.8043 20.6294 30.9995 20.9034 30.9995 22.7987C30.9995 24.694 32.8043 24.968 32.8043 24.968L36.0737 24.977C36.0737 24.977 37.9938 24.977 37.9938 22.8071C37.9938 20.6372 36.0737 20.6372 36.0737 20.6372L32.8043 20.6294ZM30.9995 34.6933C30.9995 32.798 32.8043 32.524 32.8043 32.524L36.0737 32.5319C36.0737 32.5319 37.9938 32.5319 37.9938 34.7018C37.9938 36.8716 36.0737 36.8716 36.0737 36.8716L32.8043 36.8626C32.8043 36.8626 30.9995 36.5886 30.9995 34.6933ZM32.8043 44.4187C32.8043 44.4187 30.9995 44.6927 30.9995 46.588C30.9995 48.4833 32.8043 48.7573 32.8043 48.7573L36.0737 48.7663C36.0737 48.7663 37.9938 48.7663 37.9938 46.5964C37.9938 44.4266 36.0737 44.4266 36.0737 44.4266L32.8043 44.4187ZM32.8043 56.1171C32.8043 56.1171 30.9995 56.3911 30.9995 58.2864C30.9995 60.1817 32.8043 60.4557 32.8043 60.4557L36.0737 60.4647C36.0737 60.4647 37.9938 60.4647 37.9938 58.2949C37.9938 56.125 36.0737 56.125 36.0737 56.125L32.8043 56.1171Z" fill="#222222" />
      <g clipPath="url(#EmptyListData)">
        <path d="M112.234 66.468L99.792 53.4876C100.59 52.2348 101.232 50.8854 101.669 49.4684C102.16 47.8773 102.409 46.2181 102.409 44.5371C102.409 35.3185 94.9086 27.8184 85.69 27.8184C76.4714 27.8184 68.9712 35.3185 68.9712 44.5371C68.9712 53.7557 76.4714 61.2559 85.69 61.2559C86.7848 61.2559 87.8806 61.1492 88.9486 60.9382C89.7715 60.7758 90.3074 59.9766 90.1449 59.1527C89.9825 58.3305 89.1836 57.787 88.3594 57.9563C87.4858 58.1284 86.5879 58.2162 85.69 58.2162C78.1478 58.2162 72.0109 52.0793 72.0109 44.5371C72.0109 36.995 78.1478 30.8581 85.69 30.8581C93.2321 30.8581 99.369 36.995 99.369 44.5371C99.369 45.9138 99.1656 47.2712 98.764 48.5729C97.9225 51.3015 96.194 53.7557 93.8964 55.4821C93.8747 55.4983 93.865 55.5227 93.8447 55.5399C93.8224 55.5585 93.7938 55.5644 93.7725 55.5843C93.7143 55.639 93.6868 55.7103 93.6389 55.7712C93.5773 55.8493 93.5133 55.9223 93.4686 56.009C93.4228 56.0985 93.3994 56.1911 93.3725 56.2864C93.346 56.3793 93.3171 56.4675 93.3089 56.5635C93.3003 56.6612 93.3133 56.7548 93.3237 56.8526C93.3333 56.9489 93.3398 57.0422 93.3684 57.1365C93.3977 57.2332 93.45 57.3193 93.4992 57.4098C93.5346 57.4755 93.5484 57.5482 93.5945 57.6098C93.6114 57.6321 93.6372 57.6425 93.6551 57.6634C93.673 57.6851 93.6782 57.712 93.6978 57.7326L106.838 71.8185C107.578 72.5591 108.551 72.9295 109.525 72.9295C110.498 72.9295 111.471 72.5591 112.212 71.8185C113.694 70.3372 113.694 67.9263 112.234 66.468ZM110.062 69.6695C109.765 69.9648 109.285 69.9662 109.024 69.707L97.008 56.825C97.3219 56.5349 97.6241 56.2345 97.9146 55.9216L110.062 68.594C110.358 68.891 110.358 69.3725 110.062 69.6695Z" fill="#155FB4" />
        <path d="M81.2278 41.2375C81.5595 40.1841 82.2533 39.282 83.1864 38.6911C84.1194 38.1002 85.2315 37.8586 86.3256 38.0091C87.4198 38.1595 88.4253 38.6924 89.1643 39.5132C89.9032 40.334 90.3277 41.3899 90.3628 42.4938C90.4663 45.6098 85.844 47.3231 85.844 47.3231" stroke="#155FB4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M86.1775 51.4701L86.1936 51.4696" stroke="#155FB4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="EmptyListData">
          <rect width="45.1111" height="45.1111" fill="white" transform="translate(68.5305 27.8184)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const UploadIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 17 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M5.875 5.12305L8.5 2.49805L11.125 5.12305" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 9.5V2.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 8.5V13C14.5 13.1326 14.4473 13.2598 14.3536 13.3536C14.2598 13.4473 14.1326 13.5 14 13.5H3C2.86739 13.5 2.74021 13.4473 2.64645 13.3536C2.55268 13.2598 2.5 13.1326 2.5 13V8.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const AnswerIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 52 52" fill="none" className={props.className} onClick={props.onClick}>
      <circle cx="26" cy="26" r="26" fill="#F7F7F7" />
      <path d="M28.9727 24L33.9637 29L28.9727 34" stroke="#909090" strokeWidth={2} />
      <path d="M17.9922 18V25C17.9922 26.0609 18.4129 27.0783 19.1617 27.8284C19.9105 28.5786 20.9261 29 21.9851 29H33.9637" stroke="#909090" strokeWidth={2} />
    </svg>
  );
};

export const NewTabIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333" stroke="#155FB4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 2H14V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.66699 9.33333L14.0003 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};


export const ChainIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M8.35346 4.46445L7.11602 3.22702C6.8607 2.97146 6.55754 2.76871 6.22384 2.63035C5.89014 2.492 5.53246 2.42074 5.17121 2.42065C4.80997 2.42057 4.45225 2.49166 4.11849 2.62986C3.78473 2.76807 3.48147 2.97067 3.22603 3.22611C2.97059 3.48155 2.76798 3.78481 2.62978 4.11857C2.49158 4.45233 2.42049 4.81005 2.42057 5.17129C2.42066 5.53254 2.49191 5.89022 2.63027 6.22392C2.76863 6.55762 2.97138 6.86078 3.22694 7.1161L4.9947 8.88387C5.25006 9.13923 5.55322 9.34179 5.88687 9.48C6.22051 9.6182 6.57811 9.68933 6.93925 9.68933C7.30038 9.68933 7.65798 9.6182 7.99163 9.48C8.32527 9.34179 8.62843 9.13923 8.88379 8.88387" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.64622 11.5354L8.88365 12.7729C9.13897 13.0284 9.44214 13.2312 9.77584 13.3695C10.1095 13.5079 10.4672 13.5791 10.8285 13.5792C11.1897 13.5793 11.5474 13.5082 11.8812 13.37C12.2149 13.2318 12.5182 13.0292 12.7736 12.7738C13.0291 12.5183 13.2317 12.2151 13.3699 11.8813C13.5081 11.5475 13.5792 11.1898 13.5791 10.8286C13.579 10.4673 13.5078 10.1096 13.3694 9.77595C13.231 9.44226 13.0283 9.13909 12.7727 8.88377L11.005 7.116C10.7496 6.86064 10.4465 6.65808 10.1128 6.51988C9.77916 6.38168 9.42156 6.31055 9.06043 6.31055C8.69929 6.31055 8.3417 6.38168 8.00805 6.51988C7.6744 6.65808 7.37125 6.86064 7.11589 7.116" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const CopyIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M10.5 10.499H13.5V2.49902H5.5V5.49902" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 5.49927H2.5V13.4993H10.5V5.49927Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ImageIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 11 11" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M9.10547 2.375H2.23047C2.05788 2.375 1.91797 2.51491 1.91797 2.6875V8.3125C1.91797 8.48509 2.05788 8.625 2.23047 8.625H9.10547C9.27806 8.625 9.41797 8.48509 9.41797 8.3125V2.6875C9.41797 2.51491 9.27806 2.375 9.10547 2.375Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.91797 7.06245L3.88449 5.09592C3.91351 5.06691 3.94796 5.04389 3.98587 5.02818C4.02379 5.01248 4.06442 5.00439 4.10546 5.00439C4.1465 5.00439 4.18714 5.01248 4.22505 5.02818C4.26297 5.04389 4.29742 5.06691 4.32643 5.09592L6.07199 6.84148C6.10101 6.8705 6.13546 6.89352 6.17337 6.90922C6.21129 6.92493 6.25192 6.93301 6.29296 6.93301C6.334 6.93301 6.37464 6.92493 6.41255 6.90922C6.45047 6.89352 6.48492 6.8705 6.51393 6.84148L7.32199 6.03342C7.35101 6.00441 7.38546 5.98139 7.42337 5.96568C7.46129 5.94998 7.50192 5.94189 7.54296 5.94189C7.584 5.94189 7.62464 5.94998 7.66255 5.96568C7.70047 5.98139 7.73492 6.00441 7.76393 6.03342L9.41796 7.68745" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.76172 4.875C7.0206 4.875 7.23047 4.66513 7.23047 4.40625C7.23047 4.14737 7.0206 3.9375 6.76172 3.9375C6.50284 3.9375 6.29297 4.14737 6.29297 4.40625C6.29297 4.66513 6.50284 4.875 6.76172 4.875Z" fill="currentColor" />
    </svg >
  );
};

export const CalendarIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M13 2.5H3C2.72386 2.5 2.5 2.72386 2.5 3V13C2.5 13.2761 2.72386 13.5 3 13.5H13C13.2761 13.5 13.5 13.2761 13.5 13V3C13.5 2.72386 13.2761 2.5 13 2.5Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 1.5V3.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 1.5V3.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.5 5.5H13.5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const RightArrowIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={props.className} onClick={props.onClick}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
};

export const CargoTrackIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 17 17" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M15.5 8H11.5V5.5H14.1615C14.2614 5.5 14.3591 5.52994 14.4418 5.58597C14.5245 5.64199 14.5886 5.72152 14.6257 5.8143L15.5 8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 9.5H11.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.25 14C13.0784 14 13.75 13.3284 13.75 12.5C13.75 11.6716 13.0784 11 12.25 11C11.4216 11 10.75 11.6716 10.75 12.5C10.75 13.3284 11.4216 14 12.25 14Z" stroke="currentColor" stroke-miterlimit="10" />
      <path d="M4.75 14C5.57843 14 6.25 13.3284 6.25 12.5C6.25 11.6716 5.57843 11 4.75 11C3.92157 11 3.25 11.6716 3.25 12.5C3.25 13.3284 3.92157 14 4.75 14Z" stroke="currentColor" stroke-miterlimit="10" />
      <path d="M10.75 12.5H6.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.25 12.5H2C1.86739 12.5 1.74021 12.4473 1.64645 12.3536C1.55268 12.2598 1.5 12.1326 1.5 12V5C1.5 4.86739 1.55268 4.74021 1.64645 4.64645C1.74021 4.55268 1.86739 4.5 2 4.5H11.5V11.2009" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 11.2009V8H15.5V12C15.5 12.1326 15.4473 12.2598 15.3536 12.3536C15.2598 12.4473 15.1326 12.5 15 12.5H13.75" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const InfoIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 14 13" fill="none" className={props.className} onClick={props.onClick}>
      <path fillRule="evenodd" clipRule="evenodd" d="M0.5 6.5C0.5 2.91015 3.41015 0 7 0C10.5899 0 13.5 2.91015 13.5 6.5C13.5 10.0899 10.5899 13 7 13C3.41015 13 0.5 10.0899 0.5 6.5ZM7 5.30005C7.27614 5.30005 7.5 5.52391 7.5 5.80005V9.30005C7.5 9.57619 7.27614 9.80005 7 9.80005C6.72386 9.80005 6.5 9.57619 6.5 9.30005V5.80005C6.5 5.52391 6.72386 5.30005 7 5.30005ZM7.75 3.75C7.75 4.16421 7.41421 4.5 7 4.5C6.58579 4.5 6.25 4.16421 6.25 3.75C6.25 3.33579 6.58579 3 7 3C7.41421 3 7.75 3.33579 7.75 3.75Z" fill="currentColor" />
    </svg>
  );
};


export const SquareCloseIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M10 6L6 10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10L6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 2.5H3C2.72386 2.5 2.5 2.72386 2.5 3V13C2.5 13.2761 2.72386 13.5 3 13.5H13C13.2761 13.5 13.5 13.2761 13.5 13V3C13.5 2.72386 13.2761 2.5 13 2.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};


export const SmileIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 28 28" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M14 25.6668C20.4434 25.6668 25.6667 20.4435 25.6667 14.0002C25.6667 7.55684 20.4434 2.3335 14 2.3335C7.55672 2.3335 2.33337 7.55684 2.33337 14.0002C2.33337 20.4435 7.55672 25.6668 14 25.6668Z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.33337 16.3335C9.33337 16.3335 11.0834 18.6668 14 18.6668C16.9167 18.6668 18.6667 16.3335 18.6667 16.3335" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 10.5H10.5117" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 10.5H17.5117" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const DownloadIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.6665 6.66797L7.99984 10.0013L11.3332 6.66797" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10V2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const FileTextIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M15.6246 17.5H4.37402C4.20826 17.5 4.04929 17.4342 3.93208 17.3169C3.81487 17.1997 3.74902 17.0408 3.74902 16.875V3.125C3.74902 2.95924 3.81487 2.80027 3.93208 2.68306C4.04929 2.56585 4.20826 2.5 4.37402 2.5H11.8746L16.2496 6.875V16.875C16.2496 16.9571 16.2335 17.0383 16.2021 17.1142C16.1707 17.19 16.1246 17.2589 16.0666 17.3169C16.0085 17.375 15.9396 17.421 15.8638 17.4524C15.788 17.4838 15.7067 17.5 15.6246 17.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.875 2.5V6.875H16.2506" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 10.625H12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 13.125H12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ProhibitIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 20 21" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M10 18C14.1421 18 17.5 14.6421 17.5 10.5C17.5 6.35786 14.1421 3 10 3C5.85786 3 2.5 6.35786 2.5 10.5C2.5 14.6421 5.85786 18 10 18Z" stroke="currentColor" strokeMiterlimit={10} />
      <path d="M4.69629 5.19531L15.3029 15.8019" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ClipboardPlusIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 20 21" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M13.125 2.375H6.875V5.5H13.125V2.375Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.125 3.625H15.625C15.7908 3.625 15.9497 3.69085 16.0669 3.80806C16.1842 3.92527 16.25 4.08424 16.25 4.25V17.375C16.25 17.5408 16.1842 17.6997 16.0669 17.8169C15.9497 17.9342 15.7908 18 15.625 18H4.375C4.20924 18 4.05027 17.9342 3.93306 17.8169C3.81585 17.6997 3.75 17.5408 3.75 17.375V4.25C3.75 4.08424 3.81585 3.92527 3.93306 3.80806C4.05027 3.69085 4.20924 3.625 4.375 3.625H6.875" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 11.75H12.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9.25L10 14.25" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const PlayVectorIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 14 17" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M12.8241 7.96582L1.57591 1.0917C1.48117 1.0338 1.37272 1.00219 1.2617 1.00011C1.15069 0.998031 1.04112 1.02556 0.944281 1.07988C0.847437 1.13419 0.766811 1.21332 0.710695 1.30913C0.65458 1.40494 0.625 1.51397 0.625 1.625V15.3732C0.625 15.4843 0.65458 15.5933 0.710695 15.6891C0.766811 15.7849 0.847437 15.864 0.944281 15.9183C1.04112 15.9727 1.15069 16.0002 1.2617 15.9981C1.37272 15.996 1.48117 15.9644 1.57591 15.9065L12.8241 9.03241C12.9154 8.97658 12.9909 8.89821 13.0433 8.80483C13.0957 8.71145 13.1232 8.60618 13.1232 8.49911C13.1232 8.39205 13.0957 8.28678 13.0433 8.19339C12.9909 8.10001 12.9154 8.02165 12.8241 7.96582Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const UploadImage: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 113 112" fill="none" className={props.className} onClick={props.onClick}>
      <g clipPath="url(#clip0)">
        <rect x="-38.5" y="-38.9998" width="190" height="190" rx="2" fill="#F2F5F7" />
        <rect x="-38" y="-38.4998" width="189" height="189" rx="1.5" stroke="#C2D1D9" />
      </g>
      <rect x="37.7207" y="40.5352" width="37.5581" height="30.9302" rx="4" fill="#F2F5F7" />
      <path fillRule="evenodd" clipRule="evenodd" d="M73.0695 40.5352H39.93C38.7098 40.5352 37.7207 41.5243 37.7207 42.7445V69.2561C37.7207 70.4762 38.7098 71.4654 39.93 71.4654H73.0695C74.2897 71.4654 75.2788 70.4762 75.2788 69.2561V42.7445C75.2788 41.5243 74.2897 40.5352 73.0695 40.5352ZM39.93 69.2561V42.7445H73.0695V69.2561H39.93Z" fill="#C2D1D9" />
      <path fillRule="evenodd" clipRule="evenodd" d="M43.7964 49.6485C43.7964 51.9364 45.651 53.791 47.9388 53.791C50.2266 53.791 52.0813 51.9364 52.0813 49.6485C52.0813 47.3607 50.2266 45.5061 47.9388 45.5061C45.651 45.5061 43.7964 47.3607 43.7964 49.6485ZM49.872 49.6485C49.872 50.7162 49.0065 51.5817 47.9388 51.5817C46.8712 51.5817 46.0057 50.7162 46.0057 49.6485C46.0057 48.5809 46.8712 47.7154 47.9388 47.7154C49.0065 47.7154 49.872 48.5809 49.872 49.6485Z" fill="#C2D1D9" />
      <path d="M45.6788 66.7265C45.2455 67.1561 44.5461 67.153 44.1166 66.7198C43.687 66.2865 43.6901 65.5871 44.1233 65.1576L53.2087 56.1504L58.3295 60.6044C58.7898 61.0048 58.8384 61.7026 58.438 62.1629C58.0376 62.6232 57.3399 62.6718 56.8796 62.2714L53.307 59.164L45.6788 66.7265Z" fill="#C2D1D9" />
      <path d="M53.9668 66.7232C53.5355 67.1546 52.836 67.1547 52.4046 66.7233C51.9732 66.2919 51.9732 65.5925 52.4046 65.1611L66.9432 50.6211L74.9026 57.6049C75.3612 58.0073 75.4068 58.7052 75.0044 59.1638C74.602 59.6224 73.9041 59.668 73.4455 59.2656L67.042 53.6469L53.9668 66.7232Z" fill="#C2D1D9" />
      <defs>
        <clipPath id="clip0">
          <rect width="190" height="190" fill="white" transform="translate(-38.5 -38.9998)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const SeoIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M11 6.33398L8.2 9.13398L7.13333 7.53398L5 9.66732" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.66602 6.33398H10.9993V7.66732" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.00065 14.6673H10.0007C13.334 14.6673 14.6673 13.334 14.6673 10.0007V6.00065C14.6673 2.66732 13.334 1.33398 10.0007 1.33398H6.00065C2.66732 1.33398 1.33398 2.66732 1.33398 6.00065V10.0007C1.33398 13.334 2.66732 14.6673 6.00065 14.6673Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ChainLinkIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M7.64752 4.46567L8.88495 3.22824C9.14027 2.97268 9.44344 2.76993 9.77714 2.63157C10.1108 2.49322 10.4685 2.42196 10.8298 2.42188C11.191 2.42179 11.5487 2.49288 11.8825 2.63108C12.2162 2.76929 12.5195 2.97189 12.7749 3.22733C13.0304 3.48277 13.233 3.78603 13.3712 4.11979C13.5094 4.45355 13.5805 4.81127 13.5804 5.17251C13.5803 5.53376 13.5091 5.89144 13.3707 6.22514C13.2323 6.55884 13.0296 6.86201 12.774 7.11732L11.0063 8.88509C10.7509 9.14045 10.4478 9.34302 10.1141 9.48122C9.78046 9.61942 9.42287 9.69055 9.06173 9.69055C8.7006 9.69055 8.343 9.61942 8.00935 9.48122C7.67571 9.34302 7.37255 9.14045 7.11719 8.88509" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.35476 11.5374L7.11732 12.7748C6.86201 13.0304 6.55884 13.2331 6.22514 13.3715C5.89144 13.5098 5.53376 13.5811 5.17251 13.5812C4.81127 13.5813 4.45355 13.5102 4.11979 13.372C3.78603 13.2338 3.48277 13.0312 3.22733 12.7757C2.97189 12.5203 2.76929 12.217 2.63108 11.8833C2.49288 11.5495 2.42179 11.1918 2.42188 10.8305C2.42196 10.4693 2.49322 10.1116 2.63157 9.77791C2.76993 9.44421 2.97268 9.14104 3.22824 8.88572L4.996 7.11796C5.25136 6.8626 5.55452 6.66003 5.88817 6.52183C6.22181 6.38363 6.57941 6.3125 6.94055 6.3125C7.30168 6.3125 7.65928 6.38363 7.99293 6.52183C8.32657 6.66003 8.62973 6.8626 8.88509 7.11796" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const ActiveTag: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg width={40} height={40} fill="none" xmlns="http://www.w3.org/2000/svg" {...props} >
      <circle cx={20} cy={20} r={19} fill="#155FB4" stroke="#155FB4" strokeWidth={2} />
      <path fillRule="evenodd" clipRule="evenodd" d="M22.641 10.25h5.761a1.345 1.345 0 011.345 1.35v5.766c0 .179-.07.35-.197.478L18.038 29.356a1.353 1.353 0 01-1.908 0l-5.484-5.484a1.352 1.352 0 010-1.908l11.517-11.517a.678.678 0 01.478-.197zm2.526 4.997a1.5 1.5 0 101.666-2.494 1.5 1.5 0 00-1.666 2.494z" fill="#fff" />
    </svg>
  );
};

export const PassiveTag: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg width={40} height={40} fill="none" xmlns="http://www.w3.org/2000/svg" {...props} >
      <circle cx={20} cy={20} r={19} fill="#000" fillOpacity={0.4} style={{ mixBlendMode: "multiply" }} />
      <circle cx={20} cy={20} r={19} stroke="#fff" strokeWidth={2} />
      <path fillRule="evenodd" clipRule="evenodd" d="M22.641 10.25h5.761a1.345 1.345 0 011.345 1.35v5.766c0 .179-.07.35-.197.478L18.038 29.356a1.353 1.353 0 01-1.908 0l-5.484-5.484a1.352 1.352 0 010-1.908l11.517-11.517a.678.678 0 01.478-.197zm2.526 4.997a1.5 1.5 0 101.666-2.494 1.5 1.5 0 00-1.666 2.494z" fill="#fff" />
    </svg>
  );
};

export const SmileIconForProgress: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={props.className} onClick={props.onClick}><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
  );
};

export const NormalFaceIconForProgress: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={props.className} onClick={props.onClick}><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="15" x2="16" y2="15"></line><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
  );
};

export const SadFaceIconForProgress: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={props.className} onClick={props.onClick}><circle cx="12" cy="12" r="10"></circle><path d="M16 16s-1.5-2-4-2-4 2-4 2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
  );
};

export const DeleteTagIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 17 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M8.16622 1.61762L3.12531 2.6258L2.11713 7.66671C2.10099 7.74742 2.10502 7.83087 2.12888 7.90966C2.15273 7.98844 2.19566 8.06011 2.25387 8.11832L8.78217 14.6466C8.8286 14.693 8.88372 14.7299 8.94438 14.755C9.00504 14.7801 9.07006 14.7931 9.13572 14.7931C9.20138 14.7931 9.2664 14.7801 9.32706 14.755C9.38773 14.7299 9.44284 14.693 9.48927 14.6466L15.1461 8.98976C15.1926 8.94333 15.2294 8.88821 15.2545 8.82755C15.2796 8.76689 15.2926 8.70187 15.2926 8.63621C15.2926 8.57055 15.2796 8.50553 15.2545 8.44487C15.2294 8.3842 15.1926 8.32909 15.1461 8.28266L8.61783 1.75436C8.55962 1.69615 8.48795 1.65322 8.40917 1.62936C8.33039 1.60551 8.24693 1.60148 8.16622 1.61762V1.61762Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.49977 5.61351V10.3865" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.8863 8H6.11328" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  );
};

export const QuestionMarkIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 17" fill="none" className={props.className} onClick={props.onClick}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00065 15.1668C4.31865 15.1668 1.33398 12.1822 1.33398 8.50016C1.33398 4.81816 4.31865 1.8335 8.00065 1.8335C11.6827 1.8335 14.6673 4.81816 14.6673 8.50016C14.6673 12.1822 11.6827 15.1668 8.00065 15.1668ZM7.33398 8.8335C7.33398 8.65669 7.40422 8.48712 7.52925 8.36209C7.65427 8.23707 7.82384 8.16683 8.00065 8.16683C8.19004 8.16682 8.37553 8.11303 8.53553 8.01172C8.69554 7.9104 8.82349 7.76574 8.9045 7.59455C8.9855 7.42336 9.01623 7.23269 8.99311 7.04472C8.96998 6.85676 8.89395 6.67922 8.77387 6.53277C8.65379 6.38632 8.49459 6.27698 8.3148 6.21748C8.135 6.15797 7.94201 6.15074 7.75827 6.19663C7.57453 6.24253 7.40759 6.33965 7.2769 6.47671C7.1462 6.61376 7.0571 6.78512 7.01998 6.97083L5.71198 6.70883C5.79307 6.30355 5.98032 5.92708 6.2546 5.61789C6.52887 5.3087 6.88033 5.07788 7.27304 4.94904C7.66576 4.8202 8.08564 4.79795 8.48977 4.88457C8.8939 4.97119 9.26779 5.16357 9.5732 5.44205C9.87861 5.72052 10.1046 6.0751 10.2281 6.46954C10.3515 6.86398 10.368 7.28413 10.2759 7.68703C10.1838 8.08994 9.98629 8.46116 9.70367 8.76274C9.42104 9.06432 9.06341 9.28544 8.66732 9.4035V9.8335H7.33398V8.8335ZM8.66732 11.8335V10.5002H7.33398V11.8335H8.66732Z" fill="currentColor" />
    </svg>
  );
};

export const EmptySearchIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 124 84" fill="none" className={props.className} onClick={props.onClick}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M34 57.8705C34 60.5369 36.1692 62.7061 38.8356 62.7061H61.8531L78.7407 62.7024C76.6493 61.9342 74.7264 60.817 73.0428 59.4213L38.8356 59.425C37.9785 59.425 37.2812 58.7277 37.2812 57.8707L37.2808 11.8388C37.2808 10.9816 37.978 10.2843 38.8351 10.2843H52.6108V28.302C52.6108 28.9131 52.9504 29.4736 53.4921 29.7564C53.7309 29.8811 53.9916 29.9426 54.2513 29.9426C54.5809 29.9426 54.9088 29.8435 55.1892 29.6481L61.8532 24.9995L68.5187 29.6431C68.7991 29.8385 69.1271 29.9376 69.4567 29.9376C69.7164 29.9376 69.9771 29.8761 70.2158 29.7514C70.7575 29.4685 71.0971 28.9081 71.0971 28.297V10.2793H84.873C85.73 10.2793 86.4273 10.9766 86.4273 11.8338L86.4271 25.0244C87.5484 25.0802 88.6447 25.231 89.708 25.4689V11.8338C89.708 9.16728 87.5388 6.99805 84.8725 6.99805L61.8531 7.00308H38.8356C36.1692 7.00308 34 9.17232 34 11.8388V57.8705ZM55.8925 10.2843V25.1596L60.8863 21.659C61.1685 21.4624 61.5246 21.36 61.8531 21.3599H61.8548V21.3625C62.1836 21.3636 62.5122 21.4628 62.7938 21.659L67.8154 25.1545V10.2793L55.8925 10.2843Z" fill="#222222" />
      <g clip-path="url(#clip0_3679:38846)">
        <path d="M112.236 66.468L99.7935 53.4876C100.591 52.2348 101.233 50.8854 101.67 49.4684C102.161 47.8773 102.41 46.2181 102.41 44.5371C102.41 35.3185 94.91 27.8184 85.6914 27.8184C76.4728 27.8184 68.9727 35.3185 68.9727 44.5371C68.9727 53.7557 76.4728 61.2559 85.6914 61.2559C86.7862 61.2559 87.8821 61.1492 88.95 60.9382C89.7729 60.7758 90.3088 59.9766 90.1464 59.1527C89.9839 58.3305 89.1851 57.787 88.3608 57.9563C87.4873 58.1284 86.5894 58.2162 85.6914 58.2162C78.1493 58.2162 72.0124 52.0793 72.0124 44.5371C72.0124 36.995 78.1493 30.8581 85.6914 30.8581C93.2336 30.8581 99.3705 36.995 99.3705 44.5371C99.3705 45.9138 99.1671 47.2712 98.7654 48.5729C97.9239 51.3015 96.1955 53.7557 93.8978 55.4821C93.8761 55.4983 93.8665 55.5227 93.8462 55.5399C93.8238 55.5585 93.7953 55.5644 93.7739 55.5843C93.7158 55.639 93.6882 55.7103 93.6404 55.7712C93.5788 55.8493 93.5148 55.9223 93.47 56.009C93.4243 56.0985 93.4008 56.1911 93.374 56.2864C93.3475 56.3793 93.3186 56.4675 93.3103 56.5635C93.3017 56.6612 93.3148 56.7548 93.3251 56.8526C93.3348 56.9489 93.3413 57.0422 93.3699 57.1365C93.3991 57.2332 93.4514 57.3193 93.5007 57.4098C93.5361 57.4755 93.5499 57.5482 93.596 57.6098C93.6129 57.6321 93.6387 57.6425 93.6566 57.6634C93.6745 57.6851 93.6796 57.712 93.6992 57.7326L106.839 71.8185C107.58 72.5591 108.553 72.9295 109.527 72.9295C110.5 72.9295 111.473 72.5591 112.213 71.8185C113.695 70.3372 113.695 67.9263 112.236 66.468V66.468ZM110.064 69.6695C109.767 69.9648 109.286 69.9662 109.026 69.707L97.0095 56.825C97.3234 56.5349 97.6255 56.2345 97.916 55.9216L110.064 68.594C110.36 68.891 110.36 69.3725 110.064 69.6695V69.6695Z" fill="#155FB4" />
        <path d="M81.2287 41.2378C81.5605 40.1843 82.2543 39.2823 83.1873 38.6914C84.1204 38.1005 85.2325 37.8588 86.3266 38.0093C87.4207 38.1598 88.4263 38.6926 89.1652 39.5135C89.9042 40.3343 90.3287 41.3901 90.3637 42.494C90.4673 45.6101 85.845 47.3233 85.845 47.3233" stroke="#155FB4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M86.1777 51.4702L86.1938 51.4697" stroke="#155FB4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_3679:38846">
          <rect width="45.1111" height="45.1111" fill="white" transform="translate(68.5312 27.8184)" />
        </clipPath>
      </defs>
    </svg>

  );
};

export const ZoomImageIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M6.13281 7.80078H9.46615" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.7998 9.46615V6.13281" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.66634 13.9987C11.1641 13.9987 13.9997 11.1632 13.9997 7.66536C13.9997 4.16756 11.1641 1.33203 7.66634 1.33203C4.16854 1.33203 1.33301 4.16756 1.33301 7.66536C1.33301 11.1632 4.16854 13.9987 7.66634 13.9987Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.6663 14.6654L13.333 13.332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const SubListIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M8.24707 5.91992H11.7471" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.25293 5.91992L4.75293 6.41992L6.25293 4.91992" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.24707 10.5859H11.7471" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.25293 10.5859L4.75293 11.0859L6.25293 9.58594" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.99967 14.6663H9.99967C13.333 14.6663 14.6663 13.333 14.6663 9.99967V5.99967C14.6663 2.66634 13.333 1.33301 9.99967 1.33301H5.99967C2.66634 1.33301 1.33301 2.66634 1.33301 5.99967V9.99967C1.33301 13.333 2.66634 14.6663 5.99967 14.6663Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const NotificationIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 21 20" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M7.5 17.5H12.5" stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.39046 8.12495C4.38943 7.38371 4.53511 6.64959 4.81912 5.96491C5.10313 5.28024 5.51984 4.65854 6.04524 4.13567C6.57064 3.61279 7.19433 3.19907 7.88036 2.91837C8.5664 2.63766 9.30121 2.49551 10.0424 2.50011C13.1354 2.5231 15.6094 5.09396 15.6094 8.19557V8.74995C15.6094 11.548 16.1948 13.1717 16.7104 14.0592C16.7659 14.154 16.7955 14.2618 16.7961 14.3717C16.7966 14.4816 16.7682 14.5897 16.7137 14.6851C16.6592 14.7805 16.5805 14.8599 16.4855 14.9151C16.3905 14.9704 16.2826 14.9997 16.1727 15H3.82645C3.71654 14.9997 3.60865 14.9704 3.51367 14.9151C3.41868 14.8598 3.33996 14.7805 3.28544 14.685C3.23092 14.5896 3.20253 14.4815 3.20313 14.3716C3.20374 14.2617 3.23332 14.1539 3.28889 14.059C3.80478 13.1716 4.39046 11.5479 4.39046 8.74995L4.39046 8.12495Z" stroke="#4D4D4D" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="6" r="4.5" fill="#EB5757" stroke="white" />
    </svg>
  );
};

export const BellIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={props.className} onClick={props.onClick}>
      <path d="M12 5.33251C12 2.39918 8.84 0.205847 5.74 1.95918C4.63333 2.58585 3.98 3.79918 4 5.07251C4.07333 9.95251 2 11.3325 2 11.3325H14C14 11.3325 12 9.99918 12 5.33251Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.15432 14C8.78766 14.64 7.96766 14.8533 7.33432 14.4867C7.13432 14.3733 6.96766 14.2 6.84766 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const MinusIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className} onClick={props.onClick}><line x1="5" y1="12" x2="19" y2="12"></line></svg>
  );
};

export const ErrorModalIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 84 84" fill="none" className={props.className} onClick={props.onClick}>
      <rect width="84" height="84" fill="white" />
      <path d="M65.625 18.375L18.375 65.625" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M65.625 65.625L18.375 18.375" stroke="currentColor" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
export const QuestionIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 84 84" fill="none" className={props.className} onClick={props.onClick}>
      <rect width="84" height="84" fill="white" />
      <path d="M41 74C44.3137 74 47 71.3137 47 68C47 64.6863 44.3137 62 41 62C37.6863 62 35 64.6863 35 68C35 71.3137 37.6863 74 41 74Z" fill="currentColor" />
      <path d="M27 27.0012C27 27.0012 27.2175 22.0514 32.0659 18.0826C34.9448 15.7262 38.4021 15.0438 41.5 15.0018C44.329 14.9673 46.8575 15.4427 48.3694 16.1747C50.9537 17.4316 56 20.4915 56 27.0012C56 33.8513 51.5926 36.9562 46.5826 40.3775C41.5725 43.7989 40.2917 47.1542 40.2917 51" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
export const CheckCircleIcon: FunctionComponent<IconProps> = (props: IconProps) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={props.className} onClick={props.onClick}>
      <path fillRule="evenodd" clipRule="evenodd" d="M21 12.0002C21 16.9708 16.9706 21.0002 12 21.0002C7.02944 21.0002 3 16.9708 3 12.0002C3 7.02965 7.02944 3.00021 12 3.00021C16.9706 3.00021 21 7.02965 21 12.0002ZM16.8155 10.4736C17.215 10.0922 17.2297 9.45924 16.8484 9.05974C16.467 8.66024 15.834 8.64552 15.4345 9.02686L10.625 13.6178L8.56548 11.6519C8.16598 11.2705 7.53299 11.2852 7.15165 11.6847C6.77031 12.0842 6.78502 12.7172 7.18452 13.0986L9.93449 15.7236C10.3209 16.0924 10.929 16.0924 11.3154 15.7236L16.8155 10.4736Z" fill="currentColor" />
    </svg>
  );
};
