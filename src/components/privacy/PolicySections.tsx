import React from 'react';

const sections = [
  {
    id: 'who-we-are',
    title: '1 Who We Are & Scope',
    content: (
      <>
        <p>ForexBrokerRatings.com (“FBR,” “we,” “our,” “us”) is an independent publisher that analyses and reviews retail foreign-exchange (“forex”) brokers. We operate the website <a href="https://forexbrokeratings.com" className="text-cyan-600 underline" target="_blank" rel="noopener noreferrer">https://forexbrokeratings.com</a> (the “Site”). We do not provide brokerage services or personalised investment advice. This Privacy Policy governs all personal data processed via the Site, APIs, email, and any future mobile applications.</p>
      </>
    )
  },
  {
    id: 'frameworks',
    title: '2 Legal Frameworks',
    content: (
      <>
        <p>We designed this Policy to comply with—or provide equivalent protection to—the world’s leading privacy regimes:</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950 mt-3 mb-3">
            <thead className="bg-white">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition">
                <th className="px-4 py-3 font-semibold text-gray-800">Law / Region</th>
                <th className="px-4 py-3 font-semibold text-gray-800">Key Rights Reflected</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">GDPR (EEA/UK)</td><td className="px-4 py-3 text-gray-900">Art. 6 lawful bases, Art. 15-22 data-subject rights, SCCs for transfers</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">CCPA / CPRA (California)</td><td className="px-4 py-3 text-gray-900">Notice at collection, “sale/share” opt-out, enhanced consumer rights</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">LGPD (Brazil)</td><td className="px-4 py-3 text-gray-900">Legitimate interest basis, data portability, DPO contact</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">PIPEDA (Canada)</td><td className="px-4 py-3 text-gray-900">10 Fair Information Principles</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">POPIA (South Africa)</td><td className="px-4 py-3 text-gray-900">Processing limitation, openness, security safeguards</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Australia Privacy Act</td><td className="px-4 py-3 text-gray-900">APP 1-13, cross-border disclosure protections</td></tr>
            </tbody>
          </table>
        </div>
        <p>Where local law affords stronger protections than this Policy, we will honour them.</p>
      </>
    )
  },
  {
    id: 'data-we-collect',
    title: '3 Information We Collect',
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950 mt-3 mb-3">
            <thead className="bg-white">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition">
                <th className="px-4 py-3 font-semibold text-gray-800">Category</th>
                <th className="px-4 py-3 font-semibold text-gray-800">Examples</th>
                <th className="px-4 py-3 font-semibold text-gray-800">Collection Method</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Identifiers</td><td className="px-4 py-3 text-gray-900">email, IP, cookie ID, device fingerprint</td><td className="px-4 py-3 text-gray-900">web forms, analytics scripts</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Usage Data</td><td className="px-4 py-3 text-gray-900">pages viewed, clicks on broker links, session duration</td><td className="px-4 py-3 text-gray-900">first-party cookies, log files</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Commercial Data</td><td className="px-4 py-3 text-gray-900">broker promotions clicked, affiliate IDs</td><td className="px-4 py-3 text-gray-900">redirect URLs</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Marketing Preferences</td><td className="px-4 py-3 text-gray-900">newsletter opt-in status, email opens</td><td className="px-4 py-3 text-gray-900">ESP reports</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">User-generated Content</td><td className="px-4 py-3 text-gray-900">comments, feedback, survey results</td><td className="px-4 py-3 text-gray-900">voluntary submission</td></tr>
            </tbody>
          </table>
        </div>
        <p>We do not knowingly collect special-category data (e.g., health, biometrics) or data from children &lt; 13 yrs. If notified, we will delete such data within 30 days.</p>
      </>
    )
  },
  {
    id: 'bases',
    title: '4 Purposes & Legal Bases',
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950 mt-3 mb-3">
            <thead className="bg-white">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition">
                <th className="px-4 py-3 font-semibold text-gray-800">Purpose</th>
                <th className="px-4 py-3 font-semibold text-gray-800">GDPR Basis</th>
                <th className="px-4 py-3 font-semibold text-gray-800">CCPA Category</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Operate & secure Site</td><td className="px-4 py-3 text-gray-900">Legitimate interests</td><td className="px-4 py-3 text-gray-900">“Security”</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Send newsletters</td><td className="px-4 py-3 text-gray-900">Consent</td><td className="px-4 py-3 text-gray-900">“Marketing”</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Track affiliate referrals</td><td className="px-4 py-3 text-gray-900">Legitimate interests</td><td className="px-4 py-3 text-gray-900">“Commercial information”</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Respond to enquiries</td><td className="px-4 py-3 text-gray-900">Contract</td><td className="px-4 py-3 text-gray-900">“Customer records”</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Comply with law / tax</td><td className="px-4 py-3 text-gray-900">Legal obligation</td><td className="px-4 py-3 text-gray-900">“Legal compliance”</td></tr>
            </tbody>
          </table>
        </div>
      </>
    )
  },
  {
    id: 'cookies',
    title: '5 Cookies & Tracking',
    content: (
      <>
        <p>We use session & persistent cookies plus similar technologies (e.g., localStorage) for: analytics, affiliate attribution, and UI preferences. You can control cookies via browser settings; disabling them may degrade some features (e.g., broker-comparison filters).</p>
      </>
    )
  },
  {
    id: 'transfers',
    title: '6 Global Data Transfers',
    content: (
      <>
        <p>Our servers are hosted in [select cloud region]. If your data is transferred cross-border, we rely on:</p>
        <ul className="list-disc ml-6 my-2">
          <li>Standard Contractual Clauses (SCCs) for EEA/UK transfers</li>
          <li>UK Addendum to SCCs (where applicable)</li>
          <li>Implementing adequacy decisions, Binding Corporate Rules, or other recognised safeguards</li>
        </ul>
      </>
    )
  },
  {
    id: 'sharing',
    title: '7 How We Share Information',
    content: (
      <>
        <p>We never sell personal data. We share only with:</p>
        <ol className="list-decimal ml-6 my-2">
          <li>Service providers (hosting, analytics, email) bound by confidentiality & data-processing agreements.</li>
          <li>Affiliate networks / brokers to validate referral conversions—limited to click ID & timestamp.</li>
          <li>Advisers & auditors under NDA.</li>
          <li>Regulators or courts when legally compelled or to assert/defend legal claims.</li>
        </ol>
        <p>All vendors are vetted for technical & organisational security measures.</p>
      </>
    )
  },
  {
    id: 'retention',
    title: '8 Data Retention',
    content: (
      <>
        <p>We retain data only as long as necessary for each purpose, plus any statutory retention period (e.g., 5 yrs for tax). Afterward, data is anonymised or securely erased using NIST SP-800-88 methods.</p>
      </>
    )
  },
  {
    id: 'security',
    title: '9 Security Measures',
    content: (
      <>
        <ul className="list-disc ml-6 my-2">
          <li>HTTPS/TLS 1.3 encryption in transit</li>
          <li>At-rest encryption (AES-256) on production databases</li>
          <li>WAF & DDoS filtration, rate limiting</li>
          <li>Role-based access controls, MFA for admin accounts</li>
          <li>Quarterly vulnerability scans & annual penetration tests</li>
          <li>Incident-response plan aligned with ISO 27001 Annex A</li>
        </ul>
        <p>No Internet transmission is 100 % secure; use the Site at your own risk.</p>
      </>
    )
  },
  {
    id: 'rights',
    title: '10 Your Rights',
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950 mt-3 mb-3">
            <thead className="bg-white">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition">
                <th className="px-4 py-3 font-semibold text-gray-800">Region</th>
                <th className="px-4 py-3 font-semibold text-gray-800">Rights & How to Exercise</th>
              </tr>
            </thead>
            <tbody className="bg-gray-50">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">GDPR / UK-GDPR</td><td className="px-4 py-3 text-gray-900">Access, rectify, erase, restrict, object, data portability, lodge complaint with supervisory authority.</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">CCPA / CPRA</td><td className="px-4 py-3 text-gray-900">Know, delete, correct, opt-out of sale/share, limit use of sensitive data.</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">LGPD</td><td className="px-4 py-3 text-gray-900">Confirm processing, anonymise, data portability, revoke consent.</td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900">Others</td><td className="px-4 py-3 text-gray-900">Equivalent rights under PIPEDA, POPIA, etc.</td></tr>
            </tbody>
          </table>
        </div>
        <p>Submit requests via <a href="mailto:privacy@forexbrokeratings.com" className="text-cyan-600 underline">privacy@forexbrokeratings.com</a>. We must verify identity (K-ID request token) before actioning. Response window: 30 days (extendable +60 days for complex cases).</p>
      </>
    )
  },
  {
    id: 'automated',
    title: '11 Automated Decision-Making',
    content: (
      <>
        <p>We do not use profiling or automated decisions that produce legal or similarly significant effects (GDPR Art. 22).</p>
      </>
    )
  },
  {
    id: 'thirdparties',
    title: '12 Third-Party Links',
    content: (
      <>
        <p>Outbound links to brokers & resources have independent privacy practices. Review their policies before providing personal data. We disclaim liability for third-party content or data handling.</p>
      </>
    )
  },
  {
    id: 'children',
    title: '13 Children’s Privacy',
    content: (
      <>
        <p>The Site is not directed to children under 13. If you are a parent/guardian and believe your child provided data, contact us and we will delete it.</p>
      </>
    )
  },
  {
    id: 'changes',
    title: '14 Changes to This Policy',
    content: (
      <>
        <p>We may revise this Policy due to legal, technical, or business changes. Updates appear here with a new “Last updated” date; material changes may be emailed to subscribers. Continued use after an update equals acceptance.</p>
      </>
    )
  },
];

export default function PolicySections() {
  return (
    <section className="prose dark:prose-invert max-w-none text-base" style={{ lineHeight: 1.6 }}>
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mb-12 fade-in-section"
          tabIndex={-1}
          aria-labelledby={section.id + '-heading'}
        >
          <h2
            id={section.id + '-heading'}
            className="text-2xl font-semibold underline decoration-cyan-500 decoration-4 underline-offset-4 mb-3"
          >
            {section.title}
          </h2>
          <div>{section.content}</div>
        </section>
      ))}
    </section>
  );
}
