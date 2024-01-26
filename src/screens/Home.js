import { useContext } from 'react';
import { Camera } from 'expo-camera';
import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import { MainContext } from '../store';

export default function Home(props) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const { store } = useContext(MainContext);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <>
      <ScrollView style={{ flex: 1 }}>
        <Text style={{ color: 'black' }}>Face Compare Results:</Text>
        <Text style={{ color: 'black' }}>{store.VerifySelfieRes}</Text>
      </ScrollView>
      <View style={styles.container}>
        <Button onPress={() => props.navigation.navigate('IdCapture')} title="start" />
      </View>
      <ScrollView style={{ flex: 1, marginTop: 0 }}>
        <Text style={{ color: 'black' }}>Id Verify Results:</Text>
        <Text style={{ color: 'black' }}>{store.VerifyIdRes}
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    marginBottom: 0
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
