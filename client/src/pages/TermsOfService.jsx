import React from 'react'
import '../styles/InfoPages.css'

function TermsOfService() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: January 30, 2026</p>

        <section className="info-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using OverloadR ("the Service"), you accept and agree to be bound by the terms and 
            provisions of this agreement. If you do not agree to these terms, please do not use our Service.
          </p>
        </section>

        <section className="info-section">
          <h2>2. Description of Service</h2>
          <p>
            OverloadR provides a workout tracking platform that allows users to log exercises, create workout 
            plans, track progress, and access exercise information. The Service is provided "as is" and we 
            reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.
          </p>
        </section>

        <section className="info-section">
          <h2>3. User Accounts</h2>
          <h3>3.1 Account Creation</h3>
          <ul>
            <li>You must provide accurate, current, and complete information during registration</li>
            <li>You must be at least 13 years old to create an account</li>
            <li>You are responsible for maintaining the confidentiality of your password</li>
            <li>You are responsible for all activities that occur under your account</li>
          </ul>
          
          <h3>3.2 Account Security</h3>
          <ul>
            <li>Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters</li>
            <li>Do not share your account credentials with anyone</li>
            <li>Notify us immediately of any unauthorized use of your account</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>4. User Conduct</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any illegal purpose or in violation of any laws</li>
            <li>Attempt to gain unauthorized access to our systems or other users' accounts</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Upload or transmit viruses or malicious code</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Impersonate any person or entity</li>
            <li>Scrape, crawl, or use automated means to access the Service</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>5. User Content</h2>
          <h3>5.1 Your Data</h3>
          <p>
            You retain all rights to your workout data, exercise logs, and other content you create using the 
            Service. By using the Service, you grant us a license to store, process, and display your content 
            for the purpose of providing the Service to you.
          </p>
          
          <h3>5.2 Data Backup</h3>
          <p>
            While we maintain regular backups, you are responsible for maintaining your own backup of important 
            data. We are not liable for any loss of data.
          </p>
        </section>

        <section className="info-section">
          <h2>6. Intellectual Property</h2>
          <p>
            All content, features, and functionality of OverloadR, including but not limited to text, graphics, 
            logos, images, and software, are owned by OverloadR and are protected by copyright, trademark, and 
            other intellectual property laws.
          </p>
        </section>

        <section className="info-section">
          <h2>7. Health and Fitness Disclaimer</h2>
          <p className="disclaimer-box">
            <strong>IMPORTANT:</strong> OverloadR is a workout tracking tool only. We do not provide medical 
            advice, diagnosis, or treatment. Always consult with a qualified healthcare provider before starting 
            any fitness program. Use of this Service is at your own risk. We are not responsible for any injuries, 
            health issues, or adverse effects that may result from your workout activities.
          </p>
        </section>

        <section className="info-section">
          <h2>8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, OverloadR shall not be liable for any indirect, incidental, 
            special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred 
            directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
          </p>
          <ul>
            <li>Your use or inability to use the Service</li>
            <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
            <li>Any interruption or cessation of transmission to or from the Service</li>
            <li>Any bugs, viruses, or other harmful code transmitted through the Service</li>
            <li>Any errors or omissions in any content or for any loss or damage incurred from use of any content</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>9. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account and access to the Service at our sole 
            discretion, without notice, for conduct that we believe violates these Terms or is harmful to other 
            users, us, or third parties, or for any other reason.
          </p>
          <p>
            You may terminate your account at any time through your profile settings. Upon termination, your 
            right to use the Service will immediately cease.
          </p>
        </section>

        <section className="info-section">
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes 
            by posting a notice on the Service or sending you an email. Your continued use of the Service after 
            such modifications constitutes your acceptance of the updated Terms.
          </p>
        </section>

        <section className="info-section">
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws, without regard to 
            conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be 
            resolved through binding arbitration.
          </p>
        </section>

        <section className="info-section">
          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <ul>
            <li>Email: enid.hasan.21@gmail.com</li>
            <li>Contact Form: <a href="/contact">Contact Page</a></li>
          </ul>
        </section>

        <section className="info-section">
          <p className="acknowledgment">
            By using OverloadR, you acknowledge that you have read, understood, and agree to be bound by these 
            Terms of Service.
          </p>
        </section>
      </div>
    </div>
  )
}

export default TermsOfService
