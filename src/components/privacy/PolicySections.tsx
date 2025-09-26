import React from 'react';
import T from '@/components/common/T';

const sections = [
  {
    id: 'who-we-are',
    title: '1. Who We Are & Scope',
    content: (
      <>
        <p><T k="privacy.sections.who-we-are.p1" /></p>
      </>
    )
  },
  {
    id: 'frameworks',
    title: '2. Legal Frameworks',
    content: (
      <>
        <p><T k="privacy.sections.frameworks.p1" /></p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950 mt-3 mb-3">
            <thead className="bg-white">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition">
                <th className="px-4 py-3 font-semibold text-gray-800"><T k="privacy.table.law_region" /></th>
                <th className="px-4 py-3 font-semibold text-gray-800"><T k="privacy.table.key_rights" /></th>
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
        <p><T k="privacy.sections.frameworks.p2" /></p>
      </>
    )
  },
  {
    id: 'data-we-collect',
    title: '3. Information We Collect',
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950 mt-3 mb-3">
            <thead className="bg-white">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition">
                <th className="px-4 py-3 font-semibold text-gray-800"><T k="privacy.table.category" /></th>
                <th className="px-4 py-3 font-semibold text-gray-800"><T k="privacy.table.examples" /></th>
                <th className="px-4 py-3 font-semibold text-gray-800"><T k="privacy.table.collection_method" /></th>
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
        <p><T k="privacy.sections.data-we-collect.p1" /></p>
      </>
    )
  },
  {
    id: 'bases',
    title: '4. Purposes & Legal Bases',
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950 mt-3 mb-3">
            <thead className="bg-white">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition">
                <th className="px-4 py-3 font-semibold text-gray-800"><T k="privacy.table.purpose" /></th>
                <th className="px-4 py-3 font-semibold text-gray-800"><T k="privacy.table.gdpr_basis" /></th>
                <th className="px-4 py-3 font-semibold text-gray-800"><T k="privacy.table.ccpa_category" /></th>
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
    title: '5. Cookies & Tracking',
    content: (
      <>
        <p><T k="privacy.sections.cookies.p1" /></p>
      </>
    )
  },
  {
    id: 'transfers',
    title: '6. Global Data Transfers',
    content: (
      <>
        <p><T k="privacy.sections.transfers.p1" /></p>
        <ul className="list-disc pl-10 my-2">
          <li><T k="privacy.sections.transfers.li1" /></li>
          <li><T k="privacy.sections.transfers.li2" /></li>
          <li><T k="privacy.sections.transfers.li3" /></li>
        </ul>
      </>
    )
  },
  {
    id: 'sharing',
    title: '7. How We Share Information',
    content: (
      <>
        <p><T k="privacy.sections.sharing.p1" /></p>
        <ol className="list-decimal pl-10 my-2">
          <li><T k="privacy.sections.sharing.li1" /></li>
          <li><T k="privacy.sections.sharing.li2" /></li>
          <li><T k="privacy.sections.sharing.li3" /></li>
          <li><T k="privacy.sections.sharing.li4" /></li>
        </ol>
        <p><T k="privacy.sections.sharing.p2" /></p>
      </>
    )
  },
  {
    id: 'retention',
    title: '8. Data Retention',
    content: (
      <>
        <p><T k="privacy.sections.retention.p1" /></p>
      </>
    )
  },
  {
    id: 'security',
    title: '9. Security Measures',
    content: (
      <>
        <ul className="list-disc pl-10 my-2">
          <li><T k="privacy.sections.security.li1" /></li>
          <li><T k="privacy.sections.security.li2" /></li>
          <li><T k="privacy.sections.security.li3" /></li>
          <li><T k="privacy.sections.security.li4" /></li>
          <li><T k="privacy.sections.security.li5" /></li>
          <li><T k="privacy.sections.security.li6" /></li>
        </ul>
        <p><T k="privacy.sections.security.p1" /></p>
      </>
    )
  },
  {
    id: 'rights',
    title: '10. Your Rights',
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left rounded-2xl overflow-hidden bg-gray-950 mt-3 mb-3">
            <thead className="bg-white">
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition">
                <th className="px-4 py-3 font-semibold text-gray-800"><T k="privacy.table.region" /></th>
                <th className="px-4 py-3 font-semibold text-gray-800"><T k="privacy.table.rights_how" /></th>
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
        <p><T k="privacy.sections.rights.p1" /></p>
      </>
    )
  },
  {
    id: 'automated',
    title: '11. Automated Decision-Making',
    content: (
      <>
        <p><T k="privacy.sections.automated.p1" /></p>
      </>
    )
  },
  {
    id: 'thirdparties',
    title: '12. Third-Party Links',
    content: (
      <>
        <p><T k="privacy.sections.thirdparties.p1" /></p>
      </>
    )
  },
  {
    id: 'children',
    title: '13. Children’s Privacy',
    content: (
      <>
        <p><T k="privacy.sections.children.p1" /></p>
      </>
    )
  },
  {
    id: 'changes',
    title: '14 Changes to This Policy',
    content: (
      <>
        <p><T k="privacy.sections.changes.p1" /></p>
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
            <T k={`privacy.sections.${section.id}.title`} />
          </h2>
          <div>{section.content}</div>
        </section>
      ))}
    </section>
  );
}
