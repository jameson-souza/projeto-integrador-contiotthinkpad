import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useDatabase } from '@/hooks/useDatabase';
import { useEffect, useState } from 'react';

export default function DashboardScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { getSummary } = useDatabase();
  const [summary, setSummary] = useState({ totalCounts: 0, totalObjects: 0 });

  useEffect(() => {
    const loadSummary = async () => {
      const summaryData = await getSummary();
      setSummary(summaryData);
    };

    if (isFocused) {
      loadSummary();
    }
  }, [isFocused]);

  return (
    <View className="flex-1 items-center justify-start p-6 bg-gray-100 dark:bg-gray-900">
      <Text className="text-3xl font-bold text-gray-800 dark:text-white mt-16">Dashboard</Text>
      
      <View className="w-full flex-row justify-around my-8">
        <View className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md items-center w-40">
          <Text className="text-3xl font-bold text-blue-500 dark:text-blue-400">{summary.totalCounts}</Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">Contagens</Text>
        </View>
        <View className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md items-center w-40">
          <Text className="text-3xl font-bold text-blue-500 dark:text-blue-400">{summary.totalObjects}</Text>
          <Text className="text-sm text-gray-600 dark:text-gray-300 mt-1">Objetos</Text>
        </View>
      </View>

      <TouchableOpacity 
        // A funcionalidade da câmera está desativada devido a uma incompatibilidade com a versão do Expo SDK.
        disabled={true}
        style={{
          backgroundColor: '#9CA3AF', // gray-400
          width: '100%',
          paddingVertical: 16,
          borderRadius: 8,
          shadowOpacity: 0.1,
          shadowRadius: 5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 32,
        }}
      >
        <FontAwesome name="camera" size={20} color="white" />
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginLeft: 12 }}>Iniciar Contagem (Desativado)</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        className="bg-gray-500 dark:bg-gray-700 w-full py-3 rounded-lg mt-4 flex-row items-center justify-center"
        onPress={() => router.push('/(tabs)/reports')}
      >
        <FontAwesome name="list-alt" size={18} color="white" />
        <Text className="text-white text-md font-bold ml-3">Ver Relatórios</Text>
      </TouchableOpacity>

    </View>
  );
}