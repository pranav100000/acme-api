import React from 'react';

export default function FlashMessage({ type, message }) {
  if (!message) {
    return null;
  }

  return <div className={`alert alert-${type}`}>{message}</div>;
}
