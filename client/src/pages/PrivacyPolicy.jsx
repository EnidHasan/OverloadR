import React from 'react'
import '../styles/InfoPages.css'

function PrivacyPolicy() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: January 30, 2026</p>

        <section className="info-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to OverloadR ("we," "our," or "us"). We respect your privacy and are committed to protecting 
            your personal data. This privacy policy will inform you about how we handle your personal data when 
            you use our workout tracking application.
          </p>
        </section>

        <section className="info-section">
          <h2>2. Information We Collect</h2>
          <h3>Personal Information</h3>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password (encrypted)</li>
            <li><strong>Profile Information:</strong> Age, weight (optional)</li>
            <li><strong>Workout Data:</strong> Exercise logs, workout plans, performance history</li>
          </ul>
          
          <h3>Automatically Collected Information</h3>
          <ul>
            <li>Device information and browser type</li>
            <li>IP address and location data</li>
            <li>Usage data and interaction with our services</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use your personal information to:</p>
          <ul>
            <li>Provide and maintain our workout tracking services</li>
            <li>Create and manage your account</li>
            <li>Store and display your workout data and progress</li>
            <li>Send you important updates and notifications</li>
            <li>Improve our services and user experience</li>
            <li>Protect against unauthorized access and abuse</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>4. Data Storage and Security</h2>
          <p>
            Your data is stored securely using industry-standard encryption. We use MongoDB Atlas for database 
            hosting with enterprise-grade security features. Your password is encrypted using secure hashing 
            algorithms, and we never store passwords in plain text.
          </p>
          <p>
            While we implement robust security measures, no method of transmission over the internet is 100% 
            secure. We continuously work to protect your personal information.
          </p>
        </section>

        <section className="info-section">
          <h2>5. Data Sharing and Disclosure</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your 
            information only in the following circumstances:
          </p>
          <ul>
            <li><strong>With Your Consent:</strong> When you explicitly agree to share your data</li>
            <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
            <li><strong>Service Providers:</strong> With trusted third-party services that help us operate (e.g., hosting providers)</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>6. Your Rights and Choices</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct your information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Export:</strong> Download your workout data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>7. Data Retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide 
            you services. You can request deletion of your account at any time through your profile settings.
          </p>
        </section>

        <section className="info-section">
          <h2>8. Cookies and Tracking</h2>
          <p>
            We use local storage and session tokens to maintain your login session and preferences. We do not 
            use third-party advertising cookies or tracking pixels.
          </p>
        </section>

        <section className="info-section">
          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not intended for users under 13 years of age. We do not knowingly collect personal 
            information from children under 13. If you believe we have collected information from a child, 
            please contact us immediately.
          </p>
        </section>

        <section className="info-section">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting 
            the new policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section className="info-section">
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <ul>
            <li>Email: enid.hasan.21@gmail.com</li>
            <li>Contact Form: <a href="/contact">Contact Page</a></li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default PrivacyPolicy
