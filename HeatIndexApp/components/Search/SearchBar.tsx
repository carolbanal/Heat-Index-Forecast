import React from 'react';
import { TextInput, FlatList, TouchableOpacity, Text, View } from 'react-native';
import { Svg, Path } from 'react-native-svg';

interface SearchBarProps {
    searchQuery: string;
    filteredCities: string[];
    onSearchQueryChange: (query: string) => void;
    onCitySelect: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, filteredCities, onSearchQueryChange, onCitySelect }) => {
    return (
        <View className="w-full my-6">
            <View className="flex-row items-center">

                <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }} className="flex-grow h-10 flex-row justify-between items-center rounded-full m-6">
                    {/* Search Input */}
                    <TextInput
                        placeholder="Search province (Metro Manila, ...)"
                        placeholderTextColor={'white'}
                        value={searchQuery}
                        onChangeText={onSearchQueryChange}
                        className="pl-6 font-bold text-base text-white"
                    />

                    {/* Icon (Right side) */}
                    <Svg className="pr-16"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill='white'
                    >
                        <Path
                            d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"
                            stroke='white'
                        />
                    </Svg>

                </View>

            </View>

            {/* Search Results */}
            {searchQuery && filteredCities.length > 0 && (
                <FlatList
                    data={filteredCities}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onCitySelect(item)} className="mt-2">
                            <Text className="text-white p-2 bg-[rgba(0,0,0,0.5)] rounded-md"> {/* Background added */}
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                    nestedScrollEnabled={true}
                    className="max-h-52"
                />
            )}
        </View>
    );
};

export default SearchBar;