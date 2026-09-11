import React, { useState, useEffect } from 'react';
import { 
    X, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    Send, 
    CheckCircle2, 
    Loader2, 
    LogOut,
    ShieldCheck,
    Key,
    Eye,
    EyeOff,
    ExternalLink,
    Zap,
    Shield
} from 'lucide-react';
import { logDashboardActivity } from '../utils/activityLogger';

const USER_STORAGE_KEY = 'weather_dashboard_user_profile';
const SESSION_STORAGE_KEY = 'weather_dashboard_session_active';
const API_KEY_STORAGE_KEY = 'weather_dashboard_api_key';
const DESTINATION_EMAIL = 'luckyssingh2003@gmail.com';
const DEMO_API_KEY = '4ff0015b209f5f61e460a0e32588e79e';

export default function LoginModal({ isOpen, onClose, onUserUpdated }) {
    const [userProfile, setUserProfile] = useState(() => {
        try {
            const saved = localStorage.getItem(USER_STORAGE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    // Tab mode: 'quick' = API Key + Name only, 'full' = Complete profile + API Key
    const [activeTab, setActiveTab] = useState('quick');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        apiKey: ''
    });

    const [showApiKey, setShowApiKey] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidatingKey, setIsValidatingKey] = useState(false);
    const [keyValidationStatus, setKeyValidationStatus] = useState(null); // null | 'valid' | 'invalid'
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Prepopulate form if user profile exists
    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || '',
                phone: userProfile.phone || '',
                email: userProfile.email || '',
                address: userProfile.address || '',
                apiKey: userProfile.apiKey || ''
            });
        }
    }, [userProfile]);

    // Reset validation status when apiKey changes
    useEffect(() => {
        setKeyValidationStatus(null);
    }, [formData.apiKey]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const maskApiKey = (key) => {
        if (!key || key.length < 8) return key || '';
        return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4);
    };

    const fillDemoKey = () => {
        setFormData(prev => ({ ...prev, apiKey: DEMO_API_KEY }));
        setKeyValidationStatus(null);
    };

    const validateApiKey = async (keyToValidate) => {
        const key = keyToValidate || formData.apiKey;
        if (!key || !key.trim()) {
            setErrorMessage('Please enter an API key to validate.');
            return false;
        }

        setIsValidatingKey(true);
        setKeyValidationStatus(null);
        setErrorMessage('');

        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${key.trim()}`
            );
            if (res.ok) {
                setKeyValidationStatus('valid');
                setIsValidatingKey(false);
                return true;
            } else {
                setKeyValidationStatus('invalid');
                setErrorMessage('Invalid API Key. Please check your key or use the demo key.');
                setIsValidatingKey(false);
                return false;
            }
        } catch (err) {
            setKeyValidationStatus('invalid');
            setErrorMessage('Could not verify API key. Check your connection and try again.');
            setIsValidatingKey(false);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        // Validate required fields based on active tab
        if (!formData.name.trim()) {
            setErrorMessage('Please enter your name.');
            return;
        }
        if (!formData.apiKey.trim()) {
            setErrorMessage('Please enter your OpenWeather API Key.');
            return;
        }
        if (activeTab === 'full') {
            if (!formData.phone.trim() || !formData.email.trim() || !formData.address.trim()) {
                setErrorMessage('Please fill in all fields (Name, Phone, Email, Address, and API Key).');
                return;
            }
        }

        setIsSubmitting(true);

        // Validate the API key first
        const isKeyValid = await validateApiKey(formData.apiKey);
        if (!isKeyValid) {
            setIsSubmitting(false);
            return;
        }

        // Send email notification for full profile mode
        if (activeTab === 'full') {
            const payload = {
                Name: formData.name.trim(),
                Phone_Number: formData.phone.trim(),
                Email_Address: formData.email.trim(),
                Residential_Address: formData.address.trim(),
                _subject: `New User Login: ${formData.name.trim()} - Dashboard Registration`,
                _template: 'table',
                _captcha: 'false',
                Submission_Time: new Date().toLocaleString('en-US', { timeZoneName: 'short' }),
                Registered_From: window.location.href
            };

            try {
                await fetch(`https://formsubmit.co/ajax/${DESTINATION_EMAIL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                console.warn('FormSubmit background notification attempt complete:', err);
            }
        }

        const updatedProfile = {
            name: formData.name.trim(),
            phone: formData.phone.trim() || '',
            email: formData.email.trim() || '',
            address: formData.address.trim() || '',
            apiKey: formData.apiKey.trim(),
            registeredAt: new Date().toISOString()
        };

        // Save in localStorage & mark session active
        try {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedProfile));
            localStorage.setItem(API_KEY_STORAGE_KEY, formData.apiKey.trim());
            sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
        } catch (err) {
            console.error('Failed to save profile:', err);
        }

        setUserProfile(updatedProfile);
        setIsSubmitting(false);
        setSubmitSuccess(true);

        // Notify parent to update Header greeting
        if (onUserUpdated) {
            onUserUpdated(updatedProfile);
        }

        // Log this event in Activity Log
        logDashboardActivity({
            type: 'task',
            title: `User Logged In: ${updatedProfile.name} (API Key Active)`,
            tag: 'User',
            detail: `API Key: ${maskApiKey(updatedProfile.apiKey)}`
        });

        // Close modal after brief success confirmation
        setTimeout(() => {
            setSubmitSuccess(false);
            onClose();
        }, 1500);
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem(API_KEY_STORAGE_KEY);
            sessionStorage.removeItem(SESSION_STORAGE_KEY);
        } catch (e) {
            console.error(e);
        }
        setUserProfile(null);
        setFormData({ name: '', phone: '', email: '', address: '', apiKey: '' });
        setKeyValidationStatus(null);
        if (onUserUpdated) {
            onUserUpdated(null);
        }
        logDashboardActivity({
            type: 'task',
            title: 'User Logged Out',
            tag: 'User'
        });
    };

    return (
        <div className="login-modal-overlay" onClick={onClose}>
            <div 
                className="login-modal-card" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {/* Header */}
                <div className="login-modal-header">
                    <div className="login-header-left">
                        <div className="login-avatar-icon">
                            <Key size={24} color="#ffffff" strokeWidth={2.4} />
                        </div>
                        <div>
                            <h2 className="login-modal-title">API Key Login</h2>
                            <p className="login-modal-subtitle">
                                Enter your OpenWeather API key to access the dashboard
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="login-close-btn"
                        aria-label="Close"
                        type="button"
                    >
                        <X size={18} color="#94a3b8" />
                    </button>
                </div>

                {/* Body Content */}
                {submitSuccess ? (
                    <div className="login-success-state">
                        <div className="success-check-bubble">
                            <CheckCircle2 size={48} color="#10b981" />
                        </div>
                        <h3 className="success-title">Login Successful!</h3>
                        <p className="success-desc">
                            Welcome, <strong>{formData.name}</strong>! Your API key has been verified and activated.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        {/* If already logged in, show status banner */}
                        {userProfile && (
                            <div className="apikey-logged-in-banner">
                                <div className="apikey-banner-left">
                                    <ShieldCheck size={16} color="#34d399" />
                                    <span className="apikey-banner-text">
                                        Logged in as <strong>{userProfile.name}</strong>
                                    </span>
                                </div>
                                <div className="apikey-banner-key-info">
                                    <Key size={12} color="#a78bfa" />
                                    <span className="apikey-masked-key">{maskApiKey(userProfile.apiKey)}</span>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleLogout}
                                    className="apikey-logout-inline-btn"
                                >
                                    <LogOut size={13} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}

                        {/* Tab Switcher */}
                        <div className="apikey-tab-switcher">
                            <button
                                type="button"
                                className={`apikey-tab-btn ${activeTab === 'quick' ? 'active' : ''}`}
                                onClick={() => setActiveTab('quick')}
                            >
                                <Zap size={14} />
                                <span>Quick Login</span>
                            </button>
                            <button
                                type="button"
                                className={`apikey-tab-btn ${activeTab === 'full' ? 'active' : ''}`}
                                onClick={() => setActiveTab('full')}
                            >
                                <Shield size={14} />
                                <span>Full Profile</span>
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="login-error-alert">
                                <span>⚠️ {errorMessage}</span>
                            </div>
                        )}

                        {/* API Key Input — Always shown */}
                        <div className="login-input-group">
                            <label className="login-label">
                                OpenWeather API Key <span className="req-star">*</span>
                            </label>
                            <div className="login-input-wrap apikey-input-wrap">
                                <Key size={16} color="#a855f7" className="input-icon" />
                                <input 
                                    type={showApiKey ? 'text' : 'password'} 
                                    name="apiKey"
                                    value={formData.apiKey}
                                    onChange={handleChange}
                                    placeholder="Paste your OpenWeather API key..."
                                    className={`login-input apikey-input ${
                                        keyValidationStatus === 'valid' ? 'apikey-valid' : 
                                        keyValidationStatus === 'invalid' ? 'apikey-invalid' : ''
                                    }`}
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="apikey-eye-btn"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                    tabIndex={-1}
                                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                                >
                                    {showApiKey ? <EyeOff size={15} color="#94a3b8" /> : <Eye size={15} color="#94a3b8" />}
                                </button>
                                {keyValidationStatus === 'valid' && (
                                    <CheckCircle2 size={16} color="#10b981" className="apikey-status-icon" />
                                )}
                            </div>
                            {/* Key helper actions */}
                            <div className="apikey-helper-row">
                                <button 
                                    type="button" 
                                    className="apikey-demo-btn"
                                    onClick={fillDemoKey}
                                >
                                    <Zap size={12} />
                                    <span>Use Demo Key</span>
                                </button>
                                <a 
                                    href="https://home.openweathermap.org/api_keys" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="apikey-get-key-link"
                                >
                                    <ExternalLink size={12} />
                                    <span>Get Free API Key</span>
                                </a>
                                {formData.apiKey.trim() && keyValidationStatus !== 'valid' && (
                                    <button 
                                        type="button" 
                                        className="apikey-verify-btn"
                                        onClick={() => validateApiKey()}
                                        disabled={isValidatingKey}
                                    >
                                        {isValidatingKey ? (
                                            <>
                                                <Loader2 size={12} className="spin-loader" />
                                                <span>Verifying...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={12} />
                                                <span>Verify Key</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Name — Always shown */}
                        <div className="login-input-group">
                            <label className="login-label">
                                Your Name <span className="req-star">*</span>
                            </label>
                            <div className="login-input-wrap">
                                <User size={16} color="#a855f7" className="input-icon" />
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="login-input"
                                    required
                                />
                            </div>
                        </div>

                        {/* Full Profile fields — Only in "full" tab */}
                        {activeTab === 'full' && (
                            <>
                                {/* Phone Number */}
                                <div className="login-input-group">
                                    <label className="login-label">
                                        Phone Number <span className="req-star">*</span>
                                    </label>
                                    <div className="login-input-wrap">
                                        <Phone size={16} color="#38bdf8" className="input-icon" />
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Enter 10-digit mobile number"
                                            className="login-input"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="login-input-group">
                                    <label className="login-label">
                                        Email Address <span className="req-star">*</span>
                                    </label>
                                    <div className="login-input-wrap">
                                        <Mail size={16} color="#34d399" className="input-icon" />
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email address"
                                            className="login-input"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="login-input-group">
                                    <label className="login-label">
                                        Address <span className="req-star">*</span>
                                    </label>
                                    <div className="login-input-wrap textarea-wrap">
                                        <MapPin size={16} color="#fbbf24" className="input-icon textarea-icon" />
                                        <textarea 
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Enter city, state or residential address..."
                                            className="login-input login-textarea"
                                            rows={2}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Submit Button */}
                        <div className="login-submit-actions">
                            <button 
                                type="submit" 
                                className="login-submit-btn"
                                disabled={isSubmitting || isValidatingKey}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="spin-loader" />
                                        <span>Verifying & Logging In...</span>
                                    </>
                                ) : (
                                    <>
                                        <Key size={15} />
                                        <span>Verify & Login</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
