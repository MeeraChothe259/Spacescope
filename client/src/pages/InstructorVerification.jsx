import React, { useState, useEffect } from 'react';
import {
    FileText,
    CheckCircle,
    AlertTriangle,
    ZoomIn,
    ZoomOut,
    ShieldCheck,
    UserCheck,
    XOctagon,
    RefreshCw,
    Download
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import './InstructorVerification.css';

const InstructorVerification = () => {
    const [activeTab, setActiveTab] = useState('resume');
    const [isOcrProcessing, setIsOcrProcessing] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [adminNote, setAdminNote] = useState('');

    // Mock Instructor Data
    const instructorData = {
        name: "Dr. Elena Vance",
        applicantId: "INST-2026-X92",
        submittedAt: "2026-01-23 09:42 AM",
        aiScore: 94,
    };

    // Documents State
    const documents = {
        resume: {
            id: 'resume',
            label: 'CV / Resume',
            status: 'verified',
            url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800', // Mock doc image
            confidence: 98,
            issues: []
        },
        certificate: {
            id: 'certificate',
            label: 'PhD Astrophysics',
            status: 'verified',
            url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&q=80&w=800', // Mock cert
            confidence: 96,
            issues: []
        },
        identity: {
            id: 'identity',
            label: 'Govt. ID',
            status: 'flagged',
            url: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=800', // Mock ID
            confidence: 72,
            issues: ['Expiry Date unclear', 'Hologram reflection low']
        }
    };

    // Simulate OCR when switching tabs
    useEffect(() => {
        setIsOcrProcessing(true);
        const timer = setTimeout(() => setIsOcrProcessing(false), 800);
        return () => clearTimeout(timer);
    }, [activeTab]);

    const handleZoom = (delta) => {
        setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.5), 2));
    };

    return (
        <div className="verification-container">
            <Navbar />

            {/* Header */}
            <header className="verification-header">
                <div className="header-title">
                    <h1>Instructor Verification Console</h1>
                    <p>Applicant: {instructorData.name} | ID: {instructorData.applicantId}</p>
                </div>
                <div className="trust-badge">
                    <ShieldCheck size={16} />
                    <span>AI-Assisted + Human-Verified</span>
                </div>
            </header>

            <div className="verification-grid">

                {/* LEFT: Documents Panel */}
                <div className="documents-panel">
                    {/* Document Tabs */}
                    <div className="doc-tabs">
                        {Object.values(documents).map(doc => (
                            <div
                                key={doc.id}
                                className={`doc-tab ${activeTab === doc.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(doc.id)}
                            >
                                <FileText size={18} className={activeTab === doc.id ? 'text-indigo-400' : 'text-slate-400'} />
                                <div className="doc-info">
                                    <h4>{doc.label}</h4>
                                    <span>{doc.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Document Preview */}
                    <div className="doc-preview-area">
                        {isOcrProcessing ? (
                            <div className="ocr-loading">
                                <div className="scan-line"></div>
                                <p>Running Optical Character Recognition...</p>
                            </div>
                        ) : (
                            <>
                                <img
                                    src={documents[activeTab].url}
                                    alt="Document Preview"
                                    className="doc-preview-image"
                                    style={{ transform: `scale(${zoomLevel})` }}
                                />

                                {/* Simulated Highlights */}
                                <div className="ocr-highlight" style={{ top: '20%', left: '10%', width: '30%', height: '5%' }} title="Name Match: 100%"></div>
                                <div className="ocr-highlight" style={{ top: '28%', left: '10%', width: '15%', height: '4%' }} title="Date Verified"></div>

                                <div className="zoom-controls">
                                    <button className="zoom-btn" onClick={() => handleZoom(-0.1)}><ZoomOut size={18} /></button>
                                    <span>{Math.round(zoomLevel * 100)}%</span>
                                    <button className="zoom-btn" onClick={() => handleZoom(0.1)}><ZoomIn size={18} /></button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT: Verification Results */}
                <div className="verification-results-panel">

                    {/* AI Score Card */}
                    <div className="score-card">
                        <div className="score-ring">
                            <svg width="80" height="80" className="score-svg">
                                <circle cx="40" cy="40" r="36" className="score-circle-bg" />
                                <circle
                                    cx="40" cy="40" r="36"
                                    className="score-circle-progress"
                                    style={{ strokeDashoffset: 251 - (251 * instructorData.aiScore) / 100 }}
                                />
                            </svg>
                            <span className="score-value">{instructorData.aiScore}%</span>
                        </div>
                        <div className="score-details">
                            <h3>AI Trust Score</h3>
                            <p>Calculated based on cross-referencing databases and document metadata.</p>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="checklist-card">
                        <h3>
                            Verification Checklist
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Auto-checked: {instructorData.submittedAt}</span>
                        </h3>

                        <div className="checklist-item">
                            <div className="check-label">
                                <CheckCircle size={16} className="text-green-400" />
                                <span>Identity Verification (KYC)</span>
                            </div>
                            <span className="status-badge verified">PASSED</span>
                        </div>

                        <div className="checklist-item">
                            <div className="check-label">
                                <CheckCircle size={16} className="text-green-400" />
                                <span>Academic Credentials</span>
                            </div>
                            <span className="status-badge verified">VERIFIED (MIT)</span>
                        </div>

                        <div className="checklist-item">
                            <div className="check-label">
                                <CheckCircle size={16} className="text-green-400" />
                                <span>Employment History</span>
                            </div>
                            <span className="status-badge verified">CONFIRMED</span>
                        </div>

                        <div className="checklist-item">
                            <div className="check-label">
                                <AlertTriangle size={16} className="text-yellow-400" />
                                <span>ID Expiration Check</span>
                            </div>
                            <span className="status-badge warning">NEAR EXPIRY</span>
                        </div>
                    </div>

                    {/* Action Panel */}
                    <div className="action-panel">
                        <textarea
                            className="admin-note"
                            placeholder="Add internal notes for potential audit..."
                            rows="2"
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                        />
                        <div className="action-buttons">
                            <button className="btn btn-reject">
                                <XOctagon size={18} />
                                Reject
                            </button>
                            <button className="btn" style={{ background: '#334155', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <RefreshCw size={18} />
                                Request Re-upload
                            </button>
                            <button className="btn btn-approve">
                                <UserCheck size={18} />
                                Approve Instructor
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InstructorVerification;
