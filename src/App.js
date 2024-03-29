import logo from './logo.svg';
import './App.css';
import liff from '@line/liff';
import { useEffect, useState } from 'react';
import Html5QrcodePlugin from './Html5QrcodePlugin';

function App() {
  const [pictureUrl, setPictureUrl] = useState(logo);
  const [idToken, setIdToken] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [decodedBarcode, setDecodeBarcode] = useState('')
  const [locationAccess, setLocationAccess] = useState({ lat: '', lng: '' })
  const [errorState, setErrorState] = useState('')

  useEffect(() => {
    initLine()
  }, [])

  const logout = () => {
    liff.logout()
    window.location.reload()
  }

  const initLine = () => {
    liff.init({ liffId: '2002051569-0wJggwro' }, () => {
      if (liff.isLoggedIn()) {
        runApp()
      } else {
        liff.login()
      }
    }, err => {
      console.error(err)
      setErrorState(err)
    })
  }

  const runApp = () => {
    const idToken = liff.getIDToken()
    setIdToken(idToken)
    liff.getProfile().then(profile => {
      navigator.geolocation.getCurrentPosition(function (position) {
        setLocationAccess({ lat: position.coords.latitude, lng: position.coords.longitude })
      })
      setDisplayName(profile.displayName)
      setPictureUrl(profile.pictureUrl)
      setStatusMessage(profile.statusMessage)
      setUserId(profile.userId)
    }).catch(err => {
      console.error(err)
      logout()
    })
  }

  const onNewScanResult = (decodedText, decodedResult) => {
    console.log('decodedResult', decodedResult);
    // handle decoded results here
    if (decodedText) {
      setDecodeBarcode(decodedText)
    }
  }

  const [qrCodeData, setQrCodeData] = useState('');
  const handleScan = () => {
    liff.scanCodeV2().then((result) => {
      setQrCodeData(result.value ?? '');
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ textAlign: "center" }}>
          <div>
            <p>Error: {errorState}</p>
          </div>
          <button onClick={handleScan}>Scan QR Code</button>
          <p>{qrCodeData}</p>
          <Html5QrcodePlugin
            fps={10}
            qrbox={250}
            disableFlip={false}
            qrCodeSuccessCallback={onNewScanResult}
          />
          <p style={{ textAlign: "left", marginLeft: "20%", marginRight: "20%", wordBreak: "break-all" }}><b>Decoded: </b> {decodedBarcode}</p>
          <p style={{ textAlign: "left", marginLeft: "20%", marginRight: "20%", wordBreak: "break-all" }}><b>Lat: </b> {locationAccess.lat}</p>
          <p style={{ textAlign: "left", marginLeft: "20%", marginRight: "20%", wordBreak: "break-all" }}><b>Lng: </b> {locationAccess.lng}</p>
          <a href='https://lin.ee/RG2Z5am'>
            <img src={require('./assets/button-line-new.png')} width="300px" height="50px" alt='logo' />
          </a>
          <h1>Information</h1>
          <hr />
          <img src={pictureUrl} width="300px" height="300px" alt='logo' />
          <p style={{ textAlign: "left", marginLeft: "20%", marginRight: "20%", wordBreak: "break-all" }}><b>id token: </b> {idToken}</p>
          <p style={{ textAlign: "left", marginLeft: "20%", marginRight: "20%", wordBreak: "break-all" }}><b>display name: </b> {displayName}</p>
          <p style={{ textAlign: "left", marginLeft: "20%", marginRight: "20%", wordBreak: "break-all" }}><b>status message: </b> {statusMessage}</p>
          <p style={{ textAlign: "left", marginLeft: "20%", marginRight: "20%", wordBreak: "break-all" }}><b>user id: </b> {userId}</p>
        </div>
      </header>
    </div>
  );
}

export default App;