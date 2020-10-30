import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';

declare const window: any;

function App() {
  const [appId, setAppId] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wallet, setWallet]: [any, any] = useState(null);

  const onAppIdChanged = (e: any) => {
    setAppId(e.target.value);
  };

  const onUserIdChanged = (e: any) => {
    setUserId(e.target.value);
  };

  const submitOnboardingForm = async () => {
    if (!appId || !userId) {
      alert('Application ID and User External ID is required!');
    }

    setIsLoading(true);

    try {
      await window.cereSDK.init(appId, userId);

      const storageItem = localStorage.getItem(userId);
      if (storageItem) {
        const localWallet = JSON.parse(storageItem);

        setWallet({
          publicKey: localWallet.publicKey,
          privateKey: localWallet.secret,
        });
      } else {
        alert('Something went wrong!');
      }
    } catch (e) {
      console.error(e.messages);
      alert(e.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="container">
      <div className="row"><h1>Onboarding</h1></div>
      <div className="row">
        <div className="col-sm"/>
        <div className="col-sm">
          <div className="form-group">
            <label htmlFor="appId">Specify Application ID</label>
            <input value={appId} onChange={onAppIdChanged} type="text" className="form-control" id="appId" aria-describedby="appId" placeholder="Enter Application ID"/>
          </div>
          <div className="form-group">
            <label htmlFor="userId">Specify External User Id</label>
            <input value={userId} onChange={onUserIdChanged} type="text" className="form-control" id="userId" placeholder="Enter User External ID"/>
          </div>
          <div>
            {
              wallet && (
                <div>
                  <div>Got user's wallet</div>
                  <div>Public Key: {wallet.publicKey}</div>
                  <div>Private Key: {wallet.privateKey}</div>
                </div>
              )
            }
          </div>
          <button type="submit" className="btn btn-primary" onClick={submitOnboardingForm}>{isLoading ? 'Loading...' : 'Get Wallet'}</button>
        </div>
        <div className="col-sm"/>
      </div>
    </div>
  );
}

export default App;
