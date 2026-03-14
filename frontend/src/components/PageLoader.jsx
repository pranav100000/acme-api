import React from 'react'

export default function PageLoader({ title }) {
  return (
    <>
      <div className="page-header"><h2>{title}</h2></div>
      <div className="page-body"><div className="loading"><div className="spinner"></div></div></div>
    </>
  )
}
