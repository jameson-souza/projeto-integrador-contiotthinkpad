import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, CameraType, useCameraPermissions } from 'expo-camera';
import { FontAwesome } from '@expo/vector-icons';
import { useDatabase } from '@/hooks/useDatabase';
import { useEffect, useState } from 'react';

export default function CameraScreen() {
  const router = useRouter();
  const { addCount } = useDatabase();

  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCount, setScannedCount] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lot, setLot] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Carregando permissões...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>Precisamos de sua permissão para usar a câmera.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permissão</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const randomCount = Math.floor(Math.random() * 50) + 5;
      setScannedCount(randomCount);
      setIsScanning(false);
    }, 1500);
  };

  const handleSave = async () => {
    if (!lot.trim() || !category.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o lote e a categoria.');
      return;
    }
    if (scannedCount === null) return;

    try {
      await addCount(lot, category, scannedCount);
      Alert.alert('Sucesso', 'Contagem salva com sucesso!');
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível salvar a contagem.');
    }
  };

  const resetScan = () => {
    setScannedCount(null);
    setLot('');
    setCategory('');
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={CameraType.back}>
        <View style={styles.cameraOverlay}>
          {scannedCount === null ? (
            isScanning ? (
              <ActivityIndicator size="large" color="#ffffff" />
            ) : (
              <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
                <FontAwesome name="qrcode" size={24} color="white" />
                <Text style={[styles.buttonText, { marginLeft: 16 }]}>Analisar</Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsText}>Objetos Detectados: {scannedCount}</Text>
              <TextInput
                placeholder="Lote"
                value={lot}
                onChangeText={setLot}
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Categoria"
                value={category}
                onChangeText={setCategory}
                style={styles.input}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity style={[styles.button, { backgroundColor: '#22C55E' }]} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar Contagem</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, { backgroundColor: '#EF4444', marginTop: 8 }]} onPress={resetScan}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Camera>
    </View>
  );
}
