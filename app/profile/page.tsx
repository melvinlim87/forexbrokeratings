"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '@/store/store';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import {updateUserInformation, fetchUserById} from '@/lib/supabase'
import { setUser } from '@/store/slices/authSlice';
import { useI18n } from '@/lib/i18n-client';
const FilterableCountryCodeSelect = dynamic(() => import('../register/FilterableCountryCodeSelect'), { ssr: false });


export default function UserProfilePage() {
  const { t } = useI18n();
  const user = useSelector((state: RootState) => state.auth.user) as any | null;
  const [form, setForm] = useState({
    name: user?.user_detail?.name ?? "",
    email: user?.email ?? "",
    country_code: user?.user_detail?.country_code ?? "",
    mobileno: user?.user_detail?.mobileno ?? "",
  });
  const [saved, setSaved] = useState(false);
  const dispatch = useDispatch();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user_id = user.user_detail.id;
      const { name, country_code, mobileno } = form;

      await updateUserInformation(user_id, name, country_code, mobileno);

      // Refetch latest user record from Supabase
      const latestUser: any = await fetchUserById(user_id);

      // Update local form with confirmed values from DB
      setForm(f => ({
        ...f,
        name: latestUser?.name ?? f.name,
        country_code: latestUser?.country_code ?? f.country_code,
        mobileno: latestUser?.mobileno ?? f.mobileno,
      }));

      // Immutably update Redux state
      const updated = {
        ...user,
        user_detail: latestUser,
      };
      dispatch(setUser(updated));

      // Show success message
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      // Swallow error for now; consider user feedback/toast in future
      console.error(err);
    }
  };
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mx-2 md:mx-10 min-h-[60vh]">
        {/* Sidebar */}
        <aside className="w-full md:w-48 flex-shrink-0 h-auto md:h-full mb-4 md:mb-0">
          <nav className="rounded-2xl border border-border shadow-md flex flex-col gap-2 py-6 px-0 md:px-4 md:sticky md:top-10">
            <a
              href="/profile"
              className="font-semibold text-lg px-6 py-3 rounded transition text-black bg-gray-50 ring-2 ring-gray-900/30"
            >
              {t('profile.sidebar.profile')}
            </a>
            <a
              href="/profile/reviews"
              className="font-semibold text-lg px-6 py-3 rounded transition hover:bg-gray-50 text-black"
            >
              {t('profile.sidebar.reviews')}
            </a>
          </nav>
        </aside>
        {/* Profile Form */}
        <div className="flex-1">
          <div className="w-full rounded-2xl border border-border bg-slate-300/50 shadow-lg p-0 md:p-8 backdrop-blur-md">
            <div className="px-6 pt-8 pb-2">
              <h2 className="text-3xl font-extrabold mb-2 text-gray-900 tracking-tight">{t('profile.title')}</h2>
              <p className="text-gray-500 mb-6">{t('profile.subtitle')}</p>
              {saved && (
                <div className="mb-4 rounded-md border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">
                  {t('profile.update_success')}
                </div>
              )}
            </div>
            <form className="space-y-6 px-6 pb-8" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.form.name')}</label>
                <input className="block w-full rounded-md border border-border bg-white/80 px-3 py-2 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.form.email')}</label>
                {/* email input always disabled, so need disabled style */}
                <input className="block w-full rounded-md border border-border bg-white/80 px-3 py-2 text-base text-gray-900 focus:outline-none disabled:opacity-50" disabled value={form.email} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.form.mobile')}</label>
                <div className="flex gap-3">
                  <div className="w-1/3">
                    <FilterableCountryCodeSelect
                      value={form.country_code}
                      onChange={v => setForm(f => ({ ...f, country_code: v }))}
                    />
                  </div>
                  <div className="w-2/3">
                    <input className="block w-full rounded-md border border-border bg-white/80 px-3 py-2 text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition" placeholder={t('profile.form.mobile_placeholder')} value={form.mobileno} onChange={e => setForm(f => ({ ...f, mobileno: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <Button type="submit" className="w-32">{t('profile.save')}</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
