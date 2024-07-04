import './CertificateTemplate.css'

import React from 'react'

interface CertificateTemplateProps {
  artworkTitle: string
  artistName: string
  yearOfCompletion: string
  dimensions: string
  editionNumber: string
  materials: string
  registrationNumber: string
  dateOfCertification: string
  signatureImagePath: string
  artworkImagePath: string // Path for the artwork image
  markerImagePath: string
  certificateUrl: string
}

const parseDimensions = (
  dimensions: string
): { width: number; height: number } => {
  const [width, height] = dimensions.split('x').map((dim) => parseFloat(dim))
  return { width, height }
}

const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  artworkTitle,
  artistName,
  yearOfCompletion,
  dimensions,
  editionNumber,
  materials,
  registrationNumber,
  dateOfCertification,
  signatureImagePath,
  artworkImagePath,
  markerImagePath,
  certificateUrl,
}) => {
  const { width, height } = parseDimensions(dimensions)
  const aspectRatio = height / width

  const materialsText = materials.replace(/\\n/g, '<br>')

  return (
    <div className="certificate-template">
      <div className="certificate-template-left">
        <h1>Certificate of Authenticity</h1>
        <div className="details">
          <div className="detail">
            <strong>ARTWORK TITLE</strong>
            <p>{artworkTitle}</p>
          </div>
          <div className="detail">
            <strong>ARTIST NAME</strong>
            <p>{artistName}</p>
          </div>
          <div className="detail-group">
            <div className="detail">
              <strong>YEAR OF COMPLETION</strong>
              <p>{yearOfCompletion}</p>
            </div>
            <div className="detail">
              <strong>DIMENSIONS</strong>
              <p>{dimensions}</p>
            </div>
            <div className="detail">
              <strong>EDITION NUMBER</strong>
              <p>{editionNumber}</p>
            </div>
          </div>
          <div className="detail">
            <strong>MEDIUM AND MATERIALS</strong>
            <p dangerouslySetInnerHTML={{ __html: materialsText }} />
            <span>
              This document certifies that the accompanying artwork, titled{' '}
              <span className="deepen-text">{artworkTitle}</span>, is an
              original work created by{' '}
              <span className="deepen-text">{artistName}</span>. This
              certificate is provided to affirm the authenticity of the
              aforementioned artwork.
            </span>
          </div>
        </div>

        <div className="footer">
          <div className="footer-detail">
            <strong>REGISTRATION NUMBER</strong>
            <p>{registrationNumber}</p>
          </div>
          <div className="footer-detail">
            <strong>DATE OF CERTIFICATION</strong>
            <p>{dateOfCertification}</p>
          </div>
        </div>
        <div className="signature">
          <strong>SIGNATURE OF AUTHENTICATING PARTY</strong>
          <img
            src={signatureImagePath}
            alt="Signature"
            className="signature-image"
          />
        </div>
        <p className="url-text">{certificateUrl}</p>
        <img
          className="left_shading"
          src="https://sdk-static.thecertified.xyz/Down.svg"
        />
      </div>
      <div className="certificate-template-right">
        <div className="artwork-image-container">
          <img src={artworkImagePath} alt="Artwork" className="artwork-image" />
        </div>
        <div className="markmaker-container">
          <img src={markerImagePath} alt="marker" className="markmaker-logo" />
        </div>
        <img
          className="right_shading"
          src="https://sdk-static.thecertified.xyz/UP.svg"
        />
      </div>
    </div>
  )
}

export default CertificateTemplate
