import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useToast, AlertBanner } from '../common/ToastAlert';
import { getMockDB, saveMockDB } from '../../lib/supabase';
import { Briefcase, FileText, CheckCircle2, Award, Calendar, Search, Upload, UserCheck } from 'lucide-react';

export const VacancyPortal = ({ initialTab = 'list' }) => {
  const { db, refreshDB } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(initialTab); // 'list', 'apply', 'results', 'exams'
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  // Application Form State
  const [formData, setFormData] = useState({
    applicant_name: '',
    phone_number: '',
    email: '',
    address: '',
    region: 'Addis Ababa',
    zone: 'Kirkos',
    woreda: '02',
    kebele: '05',
    // File uploads simulated
    cv_url: 'cv_resume.pdf',
    academic_doc_url: 'academic_degree.pdf',
    university_temp_doc_url: 'university_temp.pdf',
    bible_degree_url: '',
    bible_diploma_url: '',
    grade_12_transcript_url: '',
    grade_10_transcript_url: '',
    grade_8_transcript_url: '',
    grade_12_entrance_cert_url: '',
    grade_10_matric_cert_url: '',
    grade_6_ministry_cert_url: '',
    grade_8_ministry_cert_url: '',
    birth_certificate_url: '',
    fayda_or_id_url: 'fayda_id_card.png'
  });

  // Result Search Query
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const vacancies = db?.vacancies || [];
  const examAnnouncements = db?.exam_announcements || [];
  const examResults = db?.exam_results || [];

  const handleOpenApply = (vacancy) => {
    setSelectedVacancy(vacancy);
    setActiveTab('apply');
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!formData.applicant_name || !formData.phone_number || !formData.email) {
      showToast("Please fill in all mandatory fields (Name, Phone, Email)", "error");
      return;
    }

    const freshDb = getMockDB();
    const newApp = {
      id: `app-${Date.now()}`,
      vacancy_id: selectedVacancy?.id || 'vac-1',
      vacancy_title: selectedVacancy?.title || 'General Position',
      ...formData,
      status: 'Pending',
      created_at: new Date().toISOString()
    };

    freshDb.job_applications.unshift(newApp);
    saveMockDB(freshDb);
    refreshDB();

    showToast("Application submitted successfully! Keep your phone number to check exam results.", "success");
    setActiveTab('list');
  };

  const handleSearchResults = (e) => {
    e.preventDefault();
    setHasSearched(true);
    const query = searchQuery.trim().toLowerCase();
    const found = examResults.find(
      r => r.applicant_phone.toLowerCase().includes(query) || (r.applicant_email && r.applicant_email.toLowerCase().includes(query))
    );
    setSearchResult(found || null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header & Tabs */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
            {t('job_vacancies')} & Exam Results Portal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Apply for church vacancies, check exam dates, and view selection scores.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('list')}
            className={`btn ${activeTab === 'list' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Briefcase size={16} />
            <span>Open Vacancies</span>
          </button>

          <button
            onClick={() => setActiveTab('exams')}
            className={`btn ${activeTab === 'exams' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Calendar size={16} />
            <span>Exam Schedules</span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`btn ${activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Award size={16} />
            <span>Check Results</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Vacancy List */}
      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {vacancies.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No open vacancies posted at the moment.</p>
            </div>
          ) : (
            vacancies.map(vac => (
              <div key={vac.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>{vac.job_type}</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{vac.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      Application Place: {vac.place_of_application}
                    </p>
                  </div>
                  <button onClick={() => handleOpenApply(vac)} className="btn btn-primary">
                    <FileText size={16} />
                    <span>{t('apply_now')}</span>
                  </button>
                </div>

                <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                  {vac.description}
                </p>

                {/* Exam & Interview Schedule Call Notice if published */}
                {examAnnouncements.find(ex => ex.vacancy_id === vac.id) && (
                  <div style={{
                    backgroundColor: 'var(--primary-light-blue)',
                    border: '1px dashed var(--primary-blue)',
                    borderRadius: '8px',
                    padding: '0.875rem 1rem',
                    marginTop: '0.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary-blue)', fontWeight: 800, fontSize: '0.875rem' }}>
                      <Calendar size={16} />
                      <span>{examAnnouncements.find(ex => ex.vacancy_id === vac.id).title || 'Written Exam & Interview Call Schedule'}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.8125rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>📝 Written Exam Schedule</div>
                        <div>Date & Time: <strong>{examAnnouncements.find(ex => ex.vacancy_id === vac.id).written_exam_date}</strong></div>
                        <div>Venue / Location: <strong>{examAnnouncements.find(ex => ex.vacancy_id === vac.id).written_exam_venue}</strong></div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary-blue)' }}>🗣️ Interview Exam Schedule</div>
                        <div>Date & Time: <strong>{examAnnouncements.find(ex => ex.vacancy_id === vac.id).interview_date}</strong></div>
                        <div>Venue / Place: <strong>{examAnnouncements.find(ex => ex.vacancy_id === vac.id).interview_venue}</strong></div>
                      </div>
                    </div>

                    {examAnnouncements.find(ex => ex.vacancy_id === vac.id).instructions && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        <strong>Exam Instructions:</strong> {examAnnouncements.find(ex => ex.vacancy_id === vac.id).instructions}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8125rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <span>Posted: {vac.application_start_date}</span>
                  <span>Deadline: <strong>{vac.expiry_date}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Comprehensive Application Form */}
      {activeTab === 'apply' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
              Application for: {selectedVacancy?.title || 'Church Position'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Fill in your details and attach all required credentials (Max 10MB PDF/Word).
            </p>
          </div>

          <form onSubmit={handleSubmitApplication}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="applicant_name"
                  required
                  className="form-control"
                  placeholder="e.g. Solomon Bekele"
                  value={formData.applicant_name}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="text"
                  name="phone_number"
                  required
                  className="form-control"
                  placeholder="+251 911 000 000"
                  value={formData.phone_number}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="form-control"
                  placeholder="applicant@example.com"
                  value={formData.email}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Residence Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Street / House Number"
                  value={formData.address}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Region</label>
                <input
                  type="text"
                  name="region"
                  className="form-control"
                  value={formData.region}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Zone / Subcity</label>
                <input
                  type="text"
                  name="zone"
                  className="form-control"
                  value={formData.zone}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Woreda</label>
                <input
                  type="text"
                  name="woreda"
                  className="form-control"
                  value={formData.woreda}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kebele</label>
                <input
                  type="text"
                  name="kebele"
                  className="form-control"
                  value={formData.kebele}
                  onChange={handleFormChange}
                />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1.5rem 0' }} />

            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary-blue)' }}>
              Mandatory & Optional Document Attachments (PDF / Word / Images)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">CV / Resume (PDF / Word ~10MB)</label>
                <input type="file" className="form-control" accept=".pdf,.doc,.docx" />
              </div>

              <div className="form-group">
                <label className="form-label">Academic Document (PDF)</label>
                <input type="file" className="form-control" accept=".pdf" />
              </div>

              <div className="form-group">
                <label className="form-label">University Temp Doc (Optional)</label>
                <input type="file" className="form-control" accept=".pdf" />
              </div>

              <div className="form-group">
                <label className="form-label">Bible Degree (Optional)</label>
                <input type="file" className="form-control" accept=".pdf" />
              </div>

              <div className="form-group">
                <label className="form-label">Bible Diploma (Optional)</label>
                <input type="file" className="form-control" accept=".pdf" />
              </div>

              <div className="form-group">
                <label className="form-label">Grade 12 Transcript (Optional)</label>
                <input type="file" className="form-control" accept=".pdf" />
              </div>

              <div className="form-group">
                <label className="form-label">Grade 10 Transcript (Optional)</label>
                <input type="file" className="form-control" accept=".pdf" />
              </div>

              <div className="form-group">
                <label className="form-label">Grade 8 Transcript (Optional)</label>
                <input type="file" className="form-control" accept=".pdf" />
              </div>

              <div className="form-group">
                <label className="form-label">Grade 12 Entrance Cert (Optional)</label>
                <input type="file" className="form-control" accept=".pdf" />
              </div>

              <div className="form-group">
                <label className="form-label">Fayda ID / National ID (Front & Back)</label>
                <input type="file" className="form-control" accept="image/*,.pdf" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setActiveTab('list')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <Upload size={16} />
                <span>Submit Job Application</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: Exam & Interview Call Announcements */}
      {activeTab === 'exams' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
              Official Call Notices & Exam / Interview Schedules
            </h3>
          </div>

          {examAnnouncements.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: 'var(--text-muted)' }}>No call notices or exam dates published yet.</p>
            </div>
          ) : (
            examAnnouncements.map(ex => {
              const vacancy = vacancies.find(v => v.id === ex.vacancy_id);
              const isWritten = ex.notice_type === 'Written_Exam';
              const isInterview = ex.notice_type === 'Interview';
              const formatDT = (dtStr) => {
                if (!dtStr) return 'TBD';
                try {
                  const d = new Date(dtStr);
                  if (isNaN(d.getTime())) return dtStr;
                  return d.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
                } catch (e) {
                  return dtStr;
                }
              };

              return (
                <div
                  key={ex.id}
                  className="card"
                  style={{
                    borderLeft: `4px solid ${isWritten ? 'var(--primary-blue)' : isInterview ? '#166534' : '#9333ea'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div>
                      <span
                        className={`badge ${isWritten ? 'badge-primary' : isInterview ? 'badge-success' : 'badge-warning'}`}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        {isWritten ? '📝 CALL FOR WRITTEN EXAM' : isInterview ? '🗣️ CALL FOR INTERVIEW' : '📋 COMBINED EXAM & INTERVIEW CALL'}
                      </span>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
                        {ex.title || (vacancy ? `Notice for ${vacancy.title}` : 'Vacancy Call Notice')}
                      </h4>
                      {vacancy && (
                        <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                          Position: <strong>{vacancy.title}</strong> ({vacancy.job_type})
                        </small>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1rem', margin: '1rem 0' }}>
                    {(isWritten || !isInterview) && ex.written_exam_date && (
                      <div style={{ backgroundColor: 'var(--primary-light-blue)', padding: '0.875rem', borderRadius: '8px' }}>
                        <strong style={{ color: 'var(--primary-blue)', display: 'block', marginBottom: '0.25rem' }}>
                          📝 Written Exam Date & Time:
                        </strong>
                        <span style={{ fontSize: '1rem', fontWeight: 700 }}>{formatDT(ex.written_exam_date)}</span>
                        <br />
                        <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                          Venue: <strong>{ex.written_exam_venue || 'SKHC Fellowship Hall'}</strong>
                        </small>
                      </div>
                    )}

                    {(isInterview || !isWritten) && ex.interview_date && (
                      <div style={{ backgroundColor: '#f0fdf4', padding: '0.875rem', borderRadius: '8px' }}>
                        <strong style={{ color: '#166534', display: 'block', marginBottom: '0.25rem' }}>
                          🗣️ Oral Interview Date & Time:
                        </strong>
                        <span style={{ fontSize: '1rem', fontWeight: 700 }}>{formatDT(ex.interview_date)}</span>
                        <br />
                        <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                          Venue: <strong>{ex.interview_venue || 'Pastoral Office'}</strong>
                        </small>
                      </div>
                    )}
                  </div>

                  {ex.instructions && (
                    <p style={{ fontSize: '0.875rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '0.75rem', borderRadius: '6px', color: '#92400e', marginBottom: 0 }}>
                      <strong>Required Documents & Instructions:</strong> {ex.instructions}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 4: Applicant Exam Results Lookup */}
      {activeTab === 'results' && (
        <div className="card" style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
            Check Your Written Exam & Interview Results
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            Enter your Phone Number or Email address used during job application.
          </p>

          <form onSubmit={handleSearchResults} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. +251911223344 or applicant@example.com"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
              <Search size={16} />
              <span>Search Result</span>
            </button>
          </form>

          {hasSearched && (
            <div>
              {searchResult ? (
                <div style={{
                  backgroundColor: searchResult.status === 'Passed' ? '#dcfce7' : '#fee2e2',
                  border: `1px solid ${searchResult.status === 'Passed' ? '#86efac' : '#fca5a5'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  color: searchResult.status === 'Passed' ? '#166534' : '#991b1b'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.125rem', fontWeight: 800 }}>{searchResult.applicant_name}</h4>
                    <span className={`badge ${searchResult.status === 'Passed' ? 'badge-success' : 'badge-danger'}`}>
                      STATUS: {searchResult.status}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 90px), 1fr))', gap: '0.75rem', textAlign: 'center', margin: '1rem 0', backgroundColor: 'rgba(255,255,255,0.6)', padding: '0.75rem', borderRadius: '6px' }}>
                    <div>
                      <small>Written Exam</small>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{searchResult.written_exam_score}%</div>
                    </div>
                    <div>
                      <small>Interview Score</small>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{searchResult.interview_score}%</div>
                    </div>
                    <div>
                      <small>Total Score</small>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{searchResult.total_score}%</div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem' }}>
                    <strong>Remarks:</strong> {searchResult.remarks || 'No additional remarks.'}
                  </p>
                </div>
              ) : (
                <AlertBanner
                  type="warning"
                  title="No Results Found"
                  message="No exam score record matched your phone number or email. Please verify and try again or contact the Main Registrar."
                />
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
