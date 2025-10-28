import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useDatabase } from '@/hooks/useDatabase';
import { Count } from '@/types';
import { useEffect, useState, useCallback } from 'react';

export default function ReportsScreen() {
  const isFocused = useIsFocused();
  const { getCounts } = useDatabase();
  
  const [counts, setCounts] = useState<Count[]>([]);
  const [lotFilter, setLotFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadCounts = useCallback(async () => {
    const filters = {
      lot: lotFilter,
      category: categoryFilter,
    };
    const data = await getCounts(filters);
    setCounts(data);
  }, [getCounts, lotFilter, categoryFilter]);

  useEffect(() => {
    if (isFocused) {
      loadCounts();
    }
  }, [isFocused, loadCounts]);

  const renderItem = ({ item }: { item: Count }) => (
    <View className="bg-white dark:bg-gray-800 p-4 my-2 mx-4 rounded-lg shadow">
      <Text className="text-lg font-bold text-gray-800 dark:text-white">Lote: {item.lot || 'N/A'}</Text>
      <Text className="text-md text-gray-600 dark:text-gray-300">Categoria: {item.category || 'N/A'}</Text>
      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-lg font-semibold text-blue-500 dark:text-blue-400">Qtd: {item.quantity}</Text>
        <Text className="text-xs text-gray-400 dark:text-gray-500">{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 dark:bg-gray-900">
      <Text className="text-3xl font-bold text-gray-800 dark:text-white text-center mt-6 mb-4">Relatórios</Text>
      
      <View className="px-4 mb-4">
        <TextInput 
          placeholder="Filtrar por Lote"
          value={lotFilter}
          onChangeText={setLotFilter}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-lg mb-2 shadow"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput 
          placeholder="Filtrar por Categoria"
          value={categoryFilter}
          onChangeText={setCategoryFilter}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-3 rounded-lg shadow"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <FlatList
        data={counts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text className="text-center text-gray-500 mt-8">Nenhuma contagem encontrada.</Text>}
      />

      <View className="p-4">
        <TouchableOpacity 
          className="bg-green-500 dark:bg-green-600 w-full py-3 rounded-lg shadow-lg items-center justify-center"
          onPress={() => Alert.alert('Exportar', 'Funcionalidade de exportação a ser implementada.')}
        >
          <Text className="text-white text-md font-bold">Exportar Relatório</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}