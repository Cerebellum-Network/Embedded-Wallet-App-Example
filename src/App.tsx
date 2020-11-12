import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';

declare const window: any;

const DEFAULT_NETWORK = 'cere-testnet';

function App() {
  const [appId, setAppId] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wallet, setWallet]: [any, any] = useState(null);
  const [collapsedIndex, setCollapsedIndex] = useState<number | null>(0);
  const [destination, setDestination] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [paymentInfo, setPaymentInfo] = useState<string>('');

  const [transmitDataInfo, setTransmitDataInfo] = useState<string>('');
  const [transmitDataDestination, setTransmitDataDestination] = useState<string>('');
  const [signatureValues, setSignatureValues] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [reference, setReference] = useState<string>('');

  const [selectedNetwork, setSelectedNetwork] = useState<string>(DEFAULT_NETWORK);

  const onAppIdChanged = (e: any) => {
    setAppId(e.target.value);
  };

  const onUserIdChanged = (e: any) => {
    setUserId(e.target.value);
  };

  const submitOnboardingForm = async () => {
    if (!appId || !userId) {
      alert('Application ID and User External ID are required!');
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

        setDestination(localWallet.publicKey);
      } else {
        alert('Something went wrong!');
      }
    } catch (e) {
      console.error(e.messages);
      alert(e.message);
    }

    setIsLoading(false);
  };

  const submitPaymentForm = async () => {
    if (!amount || !destination) {
      alert('Amount and destination are required!');
    }

    setIsLoading(true);

    try {
      const result = await window.cereSDK.rewardUser(destination, "asset", amount);
      setPaymentInfo(result);
    } catch (e) {
      console.error(e.messages);
      alert(e.message);
    }

    setIsLoading(false);
  };

  const submitTransmitDataForm = async () => {
    if (!transmitDataDestination || !signatureValues || !signature || !reference) {
      alert('All params are required!');
    }

    setIsLoading(true);

    try {
      const result = await window.cereSDK.transmitData(transmitDataDestination, signatureValues, signature, reference);
      setTransmitDataInfo(result);
    } catch (e) {
      console.error(e.messages);
      alert(e.message);
    }

    setIsLoading(false);
  };

  const collapse = (index: number) => {
    setCollapsedIndex(isActiveIndex(index) ? null : index);
  };

  const isActiveIndex = (index: number) => {
    return index === collapsedIndex;
  };

  const renderCollapseClass = (index: number) => {
    return isActiveIndex(index) ? 'show' : '';
  };

  const renderCollapseIcon = (index: number) => {
    return isActiveIndex(index) ? '▲' : '▼';
  };

  const onDestinationChanged = (e: any) => {
    setDestination(e.target.value);
  };

  const onAmountChanged = (e: any) => {
    setAmount(e.target.value);
  };

  const onTransmitDataDestinationChanged = (e: any) => {
    setTransmitDataDestination(e.target.value);
  };

  const onSignatureValuesChanged = (e: any) => {
    setSignatureValues(e.target.value);
  };

  const onSignatureChanged = (e: any) => {
    setSignature(e.target.value);
  };

  const onReferenceChanged = (e: any) => {
    setReference(e.target.value);
  };

  const renderOnboardingForm = () => {
    return (
      <div className="row">
        <div className="col-md-4"/>
        <div className="col-md-4">
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
          <button type="submit" className="btn btn-primary" onClick={submitOnboardingForm}>{isLoading ? 'Loading...' : 'Initialize'}</button>
        </div>
        <div className="col-md-4"/>
      </div>
    );
  };

  const renderTransmitDataForm = () => {
    return (
      <div className="row">
        <div className="col-md-4"/>
        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="appId">Destination</label>
            <input value={transmitDataDestination} onChange={onTransmitDataDestinationChanged} type="text" className="form-control" id="appId" aria-describedby="appId" placeholder="Enter Destination Public Key"/>
          </div>
          <div className="form-group">
            <label htmlFor="appId">Signature Values</label>
            <input value={signatureValues} onChange={onSignatureValuesChanged} type="text" className="form-control" id="appId" aria-describedby="appId" placeholder="Enter Signature Values"/>
          </div>
          <div className="form-group">
            <label htmlFor="appId">Signature</label>
            <input value={signature} onChange={onSignatureChanged} type="text" className="form-control" id="appId" aria-describedby="appId" placeholder="Enter Signature"/>
          </div>
          <div className="form-group">
            <label htmlFor="appId">Reference (CID)</label>
            <input value={reference} onChange={onReferenceChanged} type="text" className="form-control" id="appId" aria-describedby="appId" placeholder="Enter Data Reference (CID)"/><option>Cere Testnet (default)</option>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary" onClick={submitTransmitDataForm}>{isLoading ? 'Loading...' : 'Send'}</button>
          </div>
          {
            transmitDataInfo && (
              <div className="alert alert-success" role="alert">
                Transaction finished successfully. Hash: {transmitDataInfo}
              </div>
            )
          }
        </div>
        <div className="col-md-4"/>
      </div>
    );
  };

  const onNetworkChanged = (e: any) => {
    const {value} = e.target;
    setSelectedNetwork(value);
    window.cereSDK.setNetwork(value);
  };

  const networks = [{id: DEFAULT_NETWORK, name: 'Cere Testnet'}];

  const renderNetwork = () => {
    return (
      <div className="row">
        <div className="col-md-4"/>
        <div className="col-md-4"/>
        <div className="col-md-4">
          <div className="form-group">
            <select className="form-control form-control" onChange={onNetworkChanged} defaultValue={selectedNetwork}>
              <option value={''}>Select Network</option>
              {
                networks.map((network) => (
                  <option
                    key={network.id}
                    value={network.id}
                  >{network.name} {network.id === DEFAULT_NETWORK && '(default)'}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="row"><h1>Example application with embedded Wallet</h1></div>
      {renderNetwork()}
      <div id="accordion">
        <div className="card">
          <div className="card-header" id="headingOne">
            <h5 className="mb-0">
              <button onClick={collapse.bind(null, 0)} className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Create user {renderCollapseIcon(0)}
              </button>
            </h5>
          </div>

          <div id="collapseOne" className={`collapse ${renderCollapseClass(0)}`} aria-labelledby="headingOne" data-parent="#accordion">
            <div className="card-body">
              {renderOnboardingForm()}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header" id="headingTwo">
            <h5 className="mb-0">
              <button onClick={collapse.bind(null, 1)} className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Payment {renderCollapseIcon(1)}
              </button>
            </h5>
          </div>
          <div id="collapseTwo" className={`collapse ${renderCollapseClass(1)}`} aria-labelledby="headingTwo" data-parent="#accordion">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4"/>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="appId">Destination</label>
                    <input value={destination} onChange={onDestinationChanged} type="text" className="form-control" id="appId" aria-describedby="appId" placeholder="Enter Destination Public Key"/>
                  </div>
                  <div className="form-group">
                    <label htmlFor="appId">Amount</label>
                    <input value={amount} onChange={onAmountChanged} type="text" className="form-control" id="appId" aria-describedby="appId" placeholder="Enter Amount"/>
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary" onClick={submitPaymentForm}>{isLoading ? 'Loading...' : 'Send'}</button>
                  </div>
                  {
                    paymentInfo && (
                      <div className="alert alert-success" role="alert">
                        Transaction finished successfully. Hash: {paymentInfo}
                      </div>
                    )
                  }
                </div>
                <div className="col-md-4"/>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header" id="headingTwo">
            <h5 className="mb-0">
              <button onClick={collapse.bind(null, 2)} className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Transmit Data {renderCollapseIcon(2)}
              </button>
            </h5>
          </div>
          <div id="collapseTwo" className={`collapse ${renderCollapseClass(2)}`} aria-labelledby="headingTwo" data-parent="#accordion">
            <div className="card-body">
              {renderTransmitDataForm()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
