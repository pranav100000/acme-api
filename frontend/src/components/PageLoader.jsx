import React from 'react';
import PageHeader from './PageHeader';

export default function PageLoader({ title }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="page-body">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    </>
  );
}
