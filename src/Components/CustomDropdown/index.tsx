import React, { CSSProperties, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import './index.css';
import { CloseIcon, SearchIcon } from "../Icons";
import { Loading } from "../Loading";
import { useStateEffect } from "../UseStateEffect";

export type Option = { key: string; value: string; element?: ReactElement };

type CustomDropdownProps = {
  value: Option;
  onChange: (value: Option) => void;
  getOptionList: () => Promise<Option[]> | Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  hideSearchIcon?: boolean;
  isLoading?: boolean;
}

export function CustomDropdown(props: CustomDropdownProps) {
  const [searchValue, setSearchValue] = useState(props.value.key !== '-1' ? props.value.value : '');
  const [optionList, setOptionList] = useState<Option[]>([]);
  const [isOptionListOpen, setIsOptionListOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(!!props.isLoading);

  const filteredOptions = useMemo<Option[]>(() => {
    if (searchValue === '') return optionList;
    return optionList.filter(x => x.value.toLocaleLowerCase('tr').includes(searchValue.toLocaleLowerCase('tr')));
  }, [optionList, searchValue]);

  const onOptionClicked = useCallback((option: Option) => {
    setSearchValue(option.value);
    props.onChange(option);
    setIsOptionListOpen(false);
  }, []);

  const onClearClicked = useCallback(() => {
    if (props.disabled) return;
    setSearchValue('');
    props.onChange({key: '-1', value: ''});
    setIsOptionListOpen(true);
  }, [props.disabled]);

  const onKeyDownInput = useCallback((key: string) => {
    if (key === 'Enter' && filteredOptions.length === 1) {
      onOptionClicked(filteredOptions[0]);
    }
  }, [filteredOptions]);

  const fetchOptions = useCallback(async () => {
    if (props.disabled) return;
    setIsBusy(true);
    const results = await props.getOptionList();
    setOptionList(results);
    setIsBusy(false)
  }, [props.getOptionList, props.disabled]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useStateEffect(() => {
    setSearchValue(props.value.key !== '-1' ? props.value.value : '');
  }, [props.value]);

  useStateEffect(() => {
    setIsBusy(!!props.isLoading);
  }, [props.isLoading]);

  if (isBusy) {
    return (<Loading inputSm/>);
  }

  return (
    <div className={`custom-dropdown ${props.className ? props.className : ''}${
      props.value.key === '-1' ? '' : ' selected'} ${isOptionListOpen ? 'border-blue' : 'border-gray-300'}`}
         style={{...(props.style ? props.style : {})}}>
      <div className="w-full h-full" onClick={() => !props.disabled ? setIsOptionListOpen(true) : null}>
        {!props.hideSearchIcon ? (<SearchIcon className="search-icon text-gray-500"/>) : null}
        <input placeholder={props.placeholder}
               disabled={props.disabled}
               value={searchValue}
               onChange={({target: {value}}) => setSearchValue(value)}
               onKeyDown={({key}) => onKeyDownInput(key)}
        />
        <CloseIcon className="close-icon text-gray-500" onClick={onClearClicked}/>
      </div>
      {isOptionListOpen ? (
        <div className="option-list shadow-custom border-gray-300">
          {filteredOptions.length ? (
            <div className="option-item-list">
              {filteredOptions.map((item, index) => (
                <div className="option-item text-gray-500 hover:bg-gray-100 hover:text-black"
                     key={`key_${item.key}_${index}`}
                     onClick={() => onOptionClicked(item)}>
                  {item.element ? item.element : item.value}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">Seçenek Yok</div>
          )}
        </div>
      ) : null}
      {isOptionListOpen ? (
        <div className='outside' onClick={() => {
          if (props.value.key === '-1') {
            setSearchValue('');
          } else {
            setSearchValue(optionList.find(x => x.key === props.value.key)?.value || '');
          }
          setIsOptionListOpen(false);
        }}/>
      ) : null}
    </div>
  );
}
