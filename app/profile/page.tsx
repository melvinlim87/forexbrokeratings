"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
const FilterableCountryCodeSelect = dynamic(() => import('../register/FilterableCountryCodeSelect'), { ssr: false });

export default function UserProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    countryCode: user?.countryCode || "",
    mobileno: user?.mobileno || "",
  });
  // TODO: Wire up save action to API
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-8 mx-10">
        {/* Sidebar */}
        <aside className="w-full md:w-64 mb-6 md:mb-0">
          <nav className="rounded-2xl border border-border shadow-md flex flex-col gap-2 py-6 px-0 md:px-4">
            <a
              href="/profile"
              className="font-semibold text-lg px-6 py-3 rounded transition text-black bg-gray-50 dark:bg-gray-100 ring-2 ring-gray-900/30"
            >
              User Profile
            </a>
            <a
              href="/profile/reviews"
              className="font-semibold text-lg px-6 py-3 rounded transition hover:bg-gray-50 dark:hover:bg-gray-50 text-black"
            >
              Reviews
            </a>
          </nav>
        </aside>
        {/* Profile Form */}
        <div className="flex-1">
          <div className="max-w-2xl rounded-2xl border border-border bg-transparent shadow-lg p-0 md:p-8 backdrop-blur-md">
            <div className="px-6 pt-8 pb-2">
              <h2 className="text-3xl font-extrabold mb-2 text-gray-900 dark:text-white tracking-tight">User Profile</h2>
              <p className="text-gray-500 dark:text-gray-300 mb-6">Manage your account information below.</p>
            </div>
            <form className="space-y-6 px-6 pb-8" onSubmit={e => { e.preventDefault(); /* TODO: Save logic */ }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input className="block w-full rounded-md border border-border bg-white/80 dark:bg-background/60 px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input className="block w-full rounded-md border border-border bg-white/80 dark:bg-background/60 px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none" disabled value={form.email} />
              </div>
              <div className="flex gap-3">
                <div className="w-1/3">
                  <FilterableCountryCodeSelect
                    value={form.countryCode}
                    onChange={v => setForm(f => ({ ...f, countryCode: v }))}
                  />
                </div>
                <div className="w-2/3">
                  <input className="block w-full rounded-md border border-border bg-white/80 dark:bg-background/60 px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder="Mobile Number" value={form.mobileno} onChange={e => setForm(f => ({ ...f, mobileno: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <Button type="submit" className="w-32">Save</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
