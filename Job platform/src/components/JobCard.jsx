import React from 'react';
import '../styles/JobCard.css';

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <h3 className="job-title">{job.title}</h3>
      <div className="job-details">
        <div className="company-info">
          <p className="company-name">{job.company}</p>
          <p className="job-city">{job.city}</p>
        </div>
        <div className="job-salary">{job.salary}</div>
      </div>
      <p className="job-description">{job.description}</p>
      <div className="job-requirements">
        {job.requirements.map((req, index) => (
          <span key={index} className="requirement-tag">{req}</span>
        ))}
      </div>
      <div className="job-footer">
        <span className="job-date">Опубликовано: {new Date(job.date).toLocaleDateString()}</span>
        <button className="apply-button">Откликнуться</button>
      </div>
    </div>
  );
}