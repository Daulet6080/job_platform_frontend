import React from 'react';
import JobItem from './JobItem'; // Переименуем для вакансий
import '../styles/JobList.css';

export default function JobList({ jobs }) {
  return (
    <div className="job-list">
      {jobs.length > 0 ? (
        jobs.map(job => <JobItem key={job.id} job={job} />)
      ) : (
        <p>Вакансии не найдены</p>
      )}
    </div>
  );
}
