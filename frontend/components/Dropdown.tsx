import React from "react";
import { View, Text, StyleSheet} from "react-native";
import {Picker} from '@react-native-picker/picker';

type DropdownOption = {
    label: string;
    value: string | number;
};

type DropdownProps = {
    label: string;
    selectedValue: string | number;
    onValueChange: (value: string | number) => void;
    options: DropdownOption[];
    error?: string;
};

function Dropdown ({
    label,
    selectedValue,
    onValueChange,
    options,
    error,
}:DropdownProps)  {
    return (
        <View>
            <Text>{label}</Text>
            <Picker
                selectedValue={selectedValue}
                onValueChange={onValueChange}
                style={styles.picker}
            >
                {options.map((option) => (
                    <Picker.Item
                        key={option.value}
                        label={option.label}
                        value={option.value}
                    />
                ))}
            </Picker>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    picker: {
        marginBottom: 10,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 8,
    },
});

export default Dropdown;
