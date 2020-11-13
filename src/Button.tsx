import React from 'react';

interface ButtonInterface {
  onClick: () => void,

  isLoading: boolean,
}

const Button = ({onClick, isLoading}: ButtonInterface) => {
  return (
    <div className='button-wrapper'>
      <button type="submit" className="btn btn-outline-danger" onClick={onClick}>
        Submit
      </button>
      {isLoading && (
        <div className="lds-ripple">
          <div/>
          <div/>
        </div>
      )}
    </div>
  );
};

export default Button;
