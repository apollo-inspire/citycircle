import React from 'react';
import { Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';



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
  
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.dark;

  const WhiteCheckIcon = () => (
  <Text style={{ color: theme.accent, fontSize: 16, fontWeight: 'bold' }}>✓</Text>
  );

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
      style={{ margin: 10, backgroundColor: theme.backgroundCard, zIndex }}
      dropDownContainerStyle={{ backgroundColor: theme.backgroundCard, maxHeight: 600 }}
      textStyle={{ fontFamily: 'Poppins-Regular', color: theme.text }}
      placeholderStyle={{ color: theme.textLowcontrast }}
      searchTextInputStyle={{
        fontFamily: 'Poppins-Regular',
        padding: 12,
        borderRadius: 6,
        marginVertical: 1,
        marginHorizontal: 3,
        color: theme.text,
        backgroundColor: theme.background900,
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
        color: theme.accent,
        // backgroundColor: Colors.dark.buttonGray,
        fontFamily: 'Poppins-Bold',
        // fontWeight: 'bold',
      }}
    />
  );
}
