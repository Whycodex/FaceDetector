import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as FaceDetector from "expo-face-detector";
import { Camera } from "expo-camera";

export default function App() {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
      } else {
        setHasPermission(false);
      }
    })();
  }, []);

  const handleFaceDetected = ({ faces }) => {
    if (faces.length > 0) {
      console.log("Faces Detected: ", faces.length);
      setDetectedFaces(faces);
    } else {
      console.log("No Faces Detected");
    }
  };

  const toggleFaceDetection = async () => {
    if (isDetecting) {
      if (cameraRef.current) {
        await cameraRef.current.pausePreview();
      }
    } else {
      if (cameraRef.current) {
        await cameraRef.current.resumePreview();
      }
    }
    setIsDetecting((prev) => !prev);
  };

  const renderFaceBoxes = () => {
    return detectedFaces.map((face, idx) => (
      <View
        key={idx}
        style={[
          styles.faceBox,
          {
            left: face.bounds.origin.x,
            top: face.bounds.origin.y,
            width: face.bounds.size.width,
            height: face.bounds.size.height,
          },
        ]}
      ></View>
    ));
  };

  if (hasPermission == null) {
    return null;
  }

  if (hasPermission == false) {
    <View style={styles.container}>
      <Text>No Access To Camera</Text>
    </View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.front}
          onFacesDetected={handleFaceDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
            runClassifications: FaceDetector.FaceDetectorClassifications.none,
            minDetectionInterval: 300,
            tracking: true,
          }}
          ref={cameraRef}
        >
          {renderFaceBoxes()}
        </Camera>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText} onPress={toggleFaceDetection}>
          {isDetecting ? "Start Detecting" : "Stop Detecting"}
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  faceBox: {
    position: "absolute",
    borderColor: "green",
    borderWidth: 2,
    borderRadius: 4,
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
    borderRadius: 10,
  },
  camera: {
    flex: 1,
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 4,
    backgroundColor: "#000",
    width: "95%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});
