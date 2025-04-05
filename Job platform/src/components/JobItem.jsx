// eslint-disable-next-line no-unused-vars
import React from 'react';
import JobItem from './JobItem';
import '../styles/JobItem.css';

// eslint-disable-next-line react/prop-types
export default function JobList({ jobs }) {
  return (
    <div className="job-list">
      {/* eslint-disable-next-line react/prop-types */}
      {jobs.length > 0 ? (
          // eslint-disable-next-line react/prop-types
        jobs.map(job => <JobItem key={job.id} job={job} />)
      ) : (
        <p>Вакансии не найдены</p>
      )}
    </div>
  );
}
