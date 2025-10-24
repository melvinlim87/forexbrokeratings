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
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.gdpr.region" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.gdpr.rights" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.ccpa.region" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.ccpa.rights" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.lgpd.region" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.lgpd.rights" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.pipeda.region" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.pipeda.rights" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.popia.region" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.popia.rights" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.au.region" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.frameworks.rows.au.rights" /></td></tr>
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
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.identifiers.category" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.identifiers.examples" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.identifiers.method" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.usage.category" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.usage.examples" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.usage.method" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.commercial.category" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.commercial.examples" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.commercial.method" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.marketing.category" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.marketing.examples" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.marketing.method" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.ugc.category" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.ugc.examples" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.data-we-collect.rows.ugc.method" /></td></tr>
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
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.operate.purpose" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.operate.gdpr" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.operate.ccpa" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.newsletters.purpose" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.newsletters.gdpr" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.newsletters.ccpa" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.affiliate.purpose" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.affiliate.gdpr" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.affiliate.ccpa" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.enquiries.purpose" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.enquiries.gdpr" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.enquiries.ccpa" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.compliance.purpose" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.compliance.gdpr" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.bases.rows.compliance.ccpa" /></td></tr>
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
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.rights.rows.gdpr.region" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.rights.rows.gdpr.how" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.rights.rows.ccpa.region" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.rights.rows.ccpa.how" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.rights.rows.lgpd.region" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.rights.rows.lgpd.how" /></td></tr>
              <tr className="border-b border-gray-200 hover:bg-blue-100 transition"><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.rights.rows.others.region" /></td><td className="px-4 py-3 text-gray-900"><T k="privacy.sections.rights.rows.others.how" /></td></tr>
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
    <section className="prose max-w-none text-base" style={{ lineHeight: 1.6 }}>
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
