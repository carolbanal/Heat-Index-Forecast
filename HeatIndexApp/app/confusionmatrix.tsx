import React, { useCallback, useEffect } from 'react';
import { Text, View, SafeAreaView, FlatList, StyleSheet } from 'react-native';

const ConfusionMatrix: React.FC<{ navigation: any }> = ({ navigation }) => {
    const confMatrixData = [
        { trueLabel: 'Caution', predictedLabels: [30897, 933, 0, 0] },
        { trueLabel: 'Extreme Caution', predictedLabels: [1394, 92716, 0, 0] },
        { trueLabel: 'Danger', predictedLabels: [0, 1858, 15395, 0] },
        { trueLabel: 'Extreme Danger', predictedLabels: [0, 0, 0, 56] },
    ];

    const hideHeader = useCallback(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {
        const focusListener = navigation.addListener('focus', hideHeader);
        return focusListener;
    }, [navigation, hideHeader]);

    return (
        <View className="flex-1 bg-gray-900 p-4 py-12">
            <SafeAreaView>
                <FlatList
                    data={confMatrixData}
                    keyExtractor={(item) => item.trueLabel}
                    renderItem={({ item }) => (
                        <View className="flex-row justify-between items-center border-b border-gray-600 py-2">
                            <Text className="w-1/5 text-white font-bold">{item.trueLabel}</Text>
                            {item.predictedLabels.map((value, index) => (
                                <View key={index} className={`w-1/5 p-2 justify-center items-center ${getColor(value)}`}>
                                    <Text className="text-black">{value}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                    ListHeaderComponent={() => (
                        <View className="flex-row justify-between items-center border-b border-gray-600 p-2">
                            <Text className="w-1/5"></Text>
                            <Text className="w-1/5 text-center text-white font-bold">Caution</Text>
                            <Text className="w-1/5 text-center text-white font-bold">Extreme Caution</Text>
                            <Text className="w-1/5 text-center text-white font-bold">Danger</Text>
                            <Text className="w-1/5 text-center text-white font-bold">Extreme Danger</Text>
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <View className="p-4 border border-orange-500 rounded-lg">
                            <Text className="text-white text-sm pb-2">
                                The confusion matrix provided indicates the model's performance in predicting
                                classes across four categories: "Caution," "Extreme Caution," "Danger," and "Extreme Danger."
                                Each row represents the actual class, while each column represents the predicted class.
                                Here's a breakdown of the matrix:
                            </Text>

                            {/* Row Descriptions */}
                            {confMatrixData.map((row, index) => (
                                <View key={index}>
                                    <Text className="py-2 text-orange-500 text-sm font-bold">{`${index + 1} Row (Actual "${row.trueLabel}"):`}</Text>
                                    <Text className="text-white text-sm">
                                        {row.predictedLabels.map((value, i) => ( // Changed item to row
                                            <Text key={i}>
                                                {value} instances of "{row.trueLabel}" were predicted as "{getPredictionLabel(i)}".{' '}
                                            </Text>
                                        ))}

                                    </Text>

                                </View>
                            ))}
                            <Text className="text-white text-sm">
                                {"\n"}{"\n"}These numbers mean that the model is <Text className="font-bold">97.51% accurate</Text>
                            </Text>
                        </View>
                    )}
                />
            </SafeAreaView>
        </View>
    );
};

// Function to determine color based on value
const getColor = (value: number) => {
    if (value > 5000) return 'bg-green-600'; // Red
    if (value > 1000) return 'bg-green-400'; // Orange
    if (value > 100) return 'bg-green-200'; // Yellow
    return 'bg-green-100'; // Green
};

// Function to get the prediction label
const getPredictionLabel = (index: number) => {
    const labels = ["Caution", "Extreme Caution", "Danger", "Extreme Danger"];
    return labels[index];
};

export default ConfusionMatrix;