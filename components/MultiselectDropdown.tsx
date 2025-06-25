import { Colors } from '@/constants/Colors';
import React from 'react';
import { Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

type MultiSelectDropdownProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string[];
  setValue: (value: string[]) => void;
  items: { label: string; value: string }[];
  setItems: (items: { label: string; value: string }[]) => void;
  placeholder: string;
  searchPlaceholder?: string;
  onOpen?: () => void;
  zIndex?: number;
  zIndexInverse?: number;
};

const WhiteCheckIcon = () => (
  <Text style={{ color: Colors.basic.primary[300], fontSize: 16, fontWeight: 'bold' }}>✓</Text>
);

export default function MultiselectDropdown({
  open,
  setOpen,
  value,
  setValue,
  items,
  setItems,
  placeholder,
  searchPlaceholder,
  onOpen,
  zIndex,
  zIndexInverse,
}: MultiSelectDropdownProps) {
  return (
    <DropDownPicker
      open={open}
      multiple={true}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      placeholder={placeholder}
      style={{ margin: 10, backgroundColor: Colors.dark.backgroundCard, zIndex }}
      dropDownContainerStyle={{ backgroundColor: Colors.dark.backgroundCard, maxHeight: 600 }}
      textStyle={{ fontFamily: 'Poppins-Regular', color: Colors.dark.text }}
      placeholderStyle={{ color: Colors.dark.textLowcontrast }}
      searchTextInputStyle={{
        fontFamily: 'Poppins-Regular',
        padding: 12,
        borderRadius: 6,
        marginVertical: 1,
        marginHorizontal: 3,
        color: Colors.dark.text,
        backgroundColor: Colors.dark.background900,
      }}
      searchable={true}
      searchPlaceholder={searchPlaceholder}
      TickIconComponent={WhiteCheckIcon}
      onOpen={onOpen}
      listMode="SCROLLVIEW"
      scrollViewProps={{ nestedScrollEnabled: true }}
      zIndex={zIndex}
      zIndexInverse={zIndexInverse}
      selectedItemLabelStyle={{
        color: Colors.basic.primary[300],
        // backgroundColor: Colors.dark.buttonGray,
        fontFamily: 'Poppins-Bold',
        // fontWeight: 'bold',
      }}
    />
  );
}
