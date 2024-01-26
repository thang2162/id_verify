import { Camera, CameraType } from 'expo-camera';
import { useState, useRef, useContext } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {MemoContext} from '../utils/memo';
import AWSHelper from '../utils/AWSHelper';

export default function IdCapture(props) {
  const [type, setType] = useState(CameraType.back);
  const CameraRef = useRef(null);

  const {toggleLoader, setIdFileName} = useContext(MemoContext);

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  const captureImg = async () => {
    toggleLoader(true);
    const camRes = await CameraRef.current.takePictureAsync();

    console.log(camRes);

    const awsRes = await AWSHelper.uploadFile(camRes.uri);
    setIdFileName(awsRes);

    toggleLoader(false);
    props.navigation.navigate('SelfieCapture');
  }

  return (
    <View style={styles.container}>
      <Camera ref={CameraRef} style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={captureImg}>
            <Text style={styles.text}>Capture ID</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
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
