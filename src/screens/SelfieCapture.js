import { Camera, CameraType } from 'expo-camera';
import { useState, useRef, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as FaceDetector from 'expo-face-detector';
import { MemoContext } from '../utils/memo';
import AWSHelper from '../utils/AWSHelper';


export default function SelfieCapture(props) {

    const CameraRef = useRef(null);
    const rollAngles = useRef([])
    const [faceCaptured, setFaceCaptured] = useState(false);
    const { toggleLoader, getIdFileName, setVerifySelfieRes, setVerifyIdRes } = useContext(MemoContext);

    const detections = {
        BLINK: { promptText: "Blink both eyes", minProbability: 0.4 },
        TURN_HEAD_LEFT: { promptText: "Turn head left", maxAngle: 310 },
        TURN_HEAD_RIGHT: { promptText: "Turn head right", minAngle: 50 },
        NOD: { promptText: "Nod", minDiff: 1 },
        SMILE: { promptText: "Smile", minProbability: 0.7 }
    }

    const onFacesDetected = (result) => {
        if (result.faces.length !== 1) {
            return
        }

        const face = result.faces[0]

        //Nod - Start
        // Collect roll angle data
        rollAngles.current.push(face.rollAngle)

        // Don't keep more than 10 roll angles
        if (rollAngles.current.length > 10) {
            rollAngles.current.shift()
        }

        // If not enough roll angle data, then don't process
        if (rollAngles.current.length < 10) return

        // Calculate avg from collected data, except current angle data
        const rollAnglesExceptCurrent = [...rollAngles.current].splice(
            0,
            rollAngles.current.length - 1
        )
        const rollAnglesSum = rollAnglesExceptCurrent.reduce((prev, curr) => {
            return prev + Math.abs(curr)
        }, 0)
        const avgAngle = rollAnglesSum / rollAnglesExceptCurrent.length

        // If the difference between the current angle and the average is above threshold, pass.
        const diff = Math.abs(avgAngle - Math.abs(face.rollAngle))

        // console.log(`
        // avgAngle: ${avgAngle}
        // rollAngle: ${face.rollAngle}
        // diff: ${diff}
        // `)
        if (diff >= detections.NOD.minDiff) {
            setFaceCaptured(true);
            captureImg();
        }

        //Nod - End

        // console.log("TURN_HEAD_LEFT " + face.yawAngle)
        if (face.yawAngle <= detections.TURN_HEAD_LEFT.maxAngle) {
            setFaceCaptured(true);
            captureImg();
        }

        // console.log("TURN_HEAD_RIGHT " + face.yawAngle)
        if (face.yawAngle >= detections.TURN_HEAD_RIGHT.minAngle) {
            setFaceCaptured(true);
            captureImg();
        }
    }

    const captureImg = async () => {
        if (!faceCaptured) {
            toggleLoader(true);
            const camRes = await CameraRef.current.takePictureAsync();

            console.log(camRes);

            const awsRes = await AWSHelper.uploadFile(camRes.uri);

            const selfieRes = await AWSHelper.verifySelfie(getIdFileName(), awsRes);
            const idRes = await AWSHelper.verifyId(getIdFileName());

            console.log('captureImg', selfieRes, idRes);

            setVerifyIdRes(JSON.stringify(idRes));
            setVerifySelfieRes(JSON.stringify(selfieRes));

            await AWSHelper.deleteFiles(getIdFileName(), awsRes);

            toggleLoader(false);

            props.navigation.navigate('Home');
        }
    }

    return (
        <View style={styles.container}>
            <Camera ref={CameraRef} style={styles.camera} type={CameraType.front} onFacesDetected={onFacesDetected}
                faceDetectorSettings={{
                    mode: FaceDetector.FaceDetectorMode.fast,
                    detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                    runClassifications: FaceDetector.FaceDetectorClassifications.none,
                    minDetectionInterval: 100,
                    tracking: true,
                }}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.text}>Take a Selfie</Text>
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
