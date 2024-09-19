// components/Search/SearchBar.tsx

import React from 'react';
import { TextInput, FlatList, TouchableOpacity, Text, View } from 'react-native';

interface SearchBarProps {
    searchQuery: string;
    filteredCities: string[];
    onSearchQueryChange: (query: string) => void;
    onCitySelect: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, filteredCities, onSearchQueryChange, onCitySelect }) => {
    return (
        <View className="m-4">
            <TextInput
                placeholder="Search region (Metro Manila, Cebu, etc.)..."
                className="border-b border-white text-white p-2"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={searchQuery}
                onChangeText={onSearchQueryChange}
            />
            {searchQuery && (
                <FlatList
                    data={filteredCities}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onCitySelect(item)}>
                            <Text className="text-white p-2">{item}</Text>
                        </TouchableOpacity>
                    )}
                    className="max-h-52 mt-2"
                />
            )}
        </View>
    );
};

export default SearchBar;