import account from "../assets/icons/account.svg";
import disconnect from "../assets/icons/disconnect.svg";
import check from "../assets/icons/check.svg";
import fingerprint from "../assets/icons/hand.jpg";
import { Link } from "react-router-dom";
import { FingerprintReader, SampleFormat } from "@digitalpersona/devices";
import { useState, useEffect } from "react";
import CircularIndeterminate from "../materialUi/progresscomponent";
import axios from "axios";


function AdminPage() {
  const [reader, setReader] = useState(null);
  const [sampleQuality, setSampleQuality] = useState(null);
  const [sampleImage, setSampleImage] = useState(null);
  const [connected, setconnected] = useState(null);
  const [circle,setcircle] = useState(false);
  const [acquired, setacquired]= useState(false)
  useEffect(() => {
    const fpReader = new FingerprintReader();
    setReader(fpReader);

    // Clean up on unmount
    return () => {
      fpReader.off();
    };
  }, []);

  const onDeviceConnected = () => {
    reader.on("DeviceConnected", () => {
      console.log("Device Connected");
    });
  };

  const onDeviceDisconnected = () => {
    reader.on("DeviceDisconnected", () => {
      console.log("Device Disconnected");
    });
  };

  const onQualityReported = (event) => {
    const quality = event.quality;
    setSampleQuality(quality);
    console.log("Quality Reported:", quality);

    // Directly send the sample to the server regardless of quality
    sendSampleToServer(sampleImage, quality);
  };

  const acquireSample = async () => {
    try {
      // Start acquisition
      await reader.startAcquisition(SampleFormat.Intermediate);
  
      // Handle sample acquisition event after acquisition starts
      reader.on('SamplesAcquired', async (event) => {
        const samples = event.samples;
        setacquired(true);
  
        // Convert the sample to an image format (e.g., Base64)
        const sampleImageBase64 = convertSampleToImage(samples);
        setSampleImage(sampleImageBase64);
  
        // Send the sample to the server
        await sendSampleToServer(sampleImageBase64, sampleQuality);
      });
  
    } catch (error) {
      console.error('Error acquiring sample:', error);
    }
  };
  
  const convertSampleToImage = (samples) => {
    // Convert the sample to a base64 image string (or other image formats as required)
    const sampleArrayBuffer = samples[0];  // assuming the first sample
    const blob = new Blob([sampleArrayBuffer], { type: 'image/png' });
    return URL.createObjectURL(blob);
  };
  
  const sendSampleToServer = async (image, quality) => {
    try {
      const formData = new FormData();
      formData.append('fingerprint', image); // assuming it's an image
      formData.append('quality', quality);
  
      const response = await axios.post('https://authbackend-3ce93569ffa7.herokuapp.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      console.log('Sample sent to the server:', response.data);
    } catch (error) {
      console.error('Error sending sample:', error);
    }
  };
  

  const checkInitialDeviceStatus = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      // Check for devices that start with "Digital Persona"
      const isFingerprintScannerConnected = devices.some((device) =>
        device.label.startsWith("Digital Persona")
      );

      if (isFingerprintScannerConnected) {
        setconnected(true);
      } else {
        setconnected(false);
      }
    } catch (error) {
      console.error("Error checking initial device status:", error);
    }
  };

  // Button click handler to trigger the check
  const handleCheckStatus = () => {
    checkInitialDeviceStatus();
  };

  return (
    <>
      {connected ? (
        <p className="mt-[0px] font-montserrat bg-orange text-white w-[180px] text-center text-[13px] font-semibold relative top-[10px] rounded left-[50%] py-[10px] ">
          scanner detected
        </p>
      ) : (
        <p className="mt-[0px] font-montserrat bg-darkgreen text-white w-[180px] text-center text-[13px] font-semibold relative top-[10px] rounded left-[50%] py-[10px] ">
          scanner not connected
        </p>
      )}
      <div className="flex h-100vh mt-[-40px] ">
        <div className="flex flex-col h-screen items-center pt-[40px] w-[20%] bg-darkgreen ">
          <img
            className="w-[100px] self-start ml-[55px]  h-[100px] "
            src={account}
            alt="profile"
          />
          <p className="font-montserrat text-white self-start mt-[10px] ml-[49px] font-medium ">
            Administrator
          </p>
          <ul className="mt-[90px] self-start ml-[50px]">
            <Link>
              <li className=" font-montserrat font-bold text-white  mb-[17px]  ">
                Enrol FingerPrint
              </li>
            </Link>
            <Link>
              <li className=" font-montserrat text-mediumgray  mt-[17px] ">
                Attendance History
              </li>
            </Link>
            <Link>
              <li className=" font-montserrat text-mediumgray  mt-[17px] ">
                Registered Users
              </li>
            </Link>
          </ul>
        </div>
        <div className="flex w-[65%]">
          <div className="flex flex-col w-[60%]  ">
            <p className="mt-[60px] pl-[43px] font-montserrat font-bold text-darkgreen text-[19px]">
              Step-by-Step Instructions
            </p>
            <ol className="list-disc mt-[20px] ">
              <li className="font-montserrat ml-[60px] mb-[10px] ">
                Ensure your fingers are clean and dry
              </li>
              <li className="font-montserrat ml-[60px] mt-[10px] ">
                Remove any gloves or hand accessories
              </li>
              <li className="font-montserrat ml-[60px] mt-[10px] ">
                Place your finger on the fingerprint scanner
              </li>
              <li className="font-montserrat ml-[60px] mt-[10px] ">
                Press gently, making sure your finger is flat and centered
              </li>
              <li className="font-montserrat ml-[60px] mt-[10px] ">
                Hold for 2-3 seconds
              </li>
              <li className="font-montserrat ml-[60px] mt-[10px] ">
                Lift your finger and repeat steps 4-6
              </li>
            </ol>

            <div className="mt-[30px] ml-[190px]">
           {circle && connected==false? <CircularIndeterminate />:<></> }
            </div>
            <button
              onClick={() => {
                handleCheckStatus();
                setcircle(true)
                console.log("clicked!");
              }}
              className="mt-[40px] ml-[68px] hover:bg-green font-montserrat text-white rounded bg-darkgreen w-[300px] py-[10px] "
            >
              Check for fingerPrint scanner
            </button>
            <div className="mt-[40px] pl-[43px] flex flex-col ">
              <img
                className="ml-[140px] mb-[10px]  w-[60px] "
                src={disconnect}
                alt="disconected"
              />
              <p className="font-montserrat ">
                Scanner not detected. click the check button above
              </p>
              <p className="mt-[25px] font-montserrat font-medium text-[13px]  italic">
                Our system using Hd Persona 400 series and above for fingerprint
                capturing
              </p>
            </div>
          </div>
          <div className="w-[40%] flex flex-col items-center">
            <img
              className="mt-[20px] ml-[150px] "
              src={fingerprint}
              alt="successfull enrollement icon"
            />
            {acquired? <p className="ml-[120px]">FingerPrint captured and sent to the server successfull</p>: <></> }
            <button
              onClick={() =>acquireSample()}
              className="mt-[40px] ml-[148px] hover:bg-green font-montserrat text-white rounded bg-darkgreen w-[200px] py-[10px]"
            >
              Acquire Samples
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
