import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { jobsData } from '../pages/JobsPage';
import '../styles/JobDetail.css';

export default function JobDetail() {
  const { id } = useParams();
  const job = jobsData.find((j) => j.id === parseInt(id));

  const [saved, setSaved] = useState(false);

  // Функция для добавления вакансии в избранное
  const handleSaveJob = () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const jobExists = savedJobs.find((item) => item.id === job.id);

    if (!jobExists) {
      savedJobs.push(job);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
      setSaved(true);
    }
  };

  if (!job) {
    return <p>Вакансия не найдена</p>;
  }

  return (
    <div className="job-detail">
      <h1>{job.title}</h1>
      <p className="company">{job.company}</p>
      <p className="location">{job.location}</p>
      <p className="salary">{job.salary}₽</p>
      <p>{job.description}</p>

      <button
        className="save-job-btn"
        onClick={handleSaveJob}
        disabled={saved}
      >
        {saved ? 'Вакансия сохранена' : 'Сохранить вакансию'}
      </button>
    </div>
  );
}
