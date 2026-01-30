import React, { useState, useEffect, useRef } from 'react';
import { useUserProfile } from '../../contexts/user-profile-context';
import { getIdToken } from '../../lib/firebase';
import {
  Save,
  Loader2,
  User,
  CreditCard,
  Link as LinkIcon,
  Camera,
} from 'lucide-react';

export const Settings = () => {
  const { profile, updateProfile, loading: profileLoading } = useUserProfile();

  const [displayName, setDisplayName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [photoURL, setPhotoURL] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setCurrency(profile.currency || 'USD');
      setPhotoURL(profile.photoURL || '');
    }
  }, [profile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPG, PNG, and WebP formats are allowed');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const token = await getIdToken();
      if (!token) throw new Error('Not authenticated');

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

      // 1. Get signature
      const signResponse = await fetch(
        `${API_BASE_URL}/cloudinary/sign-profile-upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!signResponse.ok) throw new Error('Failed to get upload signature');
      const { signature, timestamp, cloudName, apiKey, public_id, folder } =
        await signResponse.json();

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);
      formData.append('public_id', public_id);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!uploadResponse.ok) {
        let errorMessage = 'Failed to upload image';
        try {
          const errorData = await uploadResponse.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch {
          // Response wasn't JSON, use default message
        }
        throw new Error(errorMessage);
      }
      const uploadData = await uploadResponse.json();

      // 3. Update Profile
      await updateProfile({ photoURL: uploadData.secure_url });
      setPhotoURL(uploadData.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    setSaving(true);
    try {
      await updateProfile({
        displayName,
        currency,
        photoURL,
      });
    } catch (error) {
      // Error handled in context
    } finally {
      setSaving(false);
    }
  };

  const currencies = [
    { code: 'USD', label: 'US Dollar ($)' },
    { code: 'EUR', label: 'Euro (€)' },
    { code: 'GBP', label: 'British Pound (£)' },
    { code: 'JPY', label: 'Japanese Yen (¥)' },
    { code: 'CAD', label: 'Canadian Dollar ($)' },
    { code: 'AUD', label: 'Australian Dollar ($)' },
    { code: 'INR', label: 'Indian Rupee (₹)' },
    { code: 'CNY', label: 'Chinese Yuan (¥)' },
    { code: 'NGN', label: 'Nigerian Naira (₦)' },
    { code: 'GHS', label: 'Ghanaian Cedi (₵)' },
  ];

  if (profileLoading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-emerald-500' />
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl space-y-8 p-6'>
      <div>
        <h1 className='text-3xl font-bold text-slate-50'>Settings</h1>
        <p className='text-slate-400'>Manage your profile and preferences.</p>
      </div>

      <div className='grid gap-8 md:grid-cols-3'>
        {/* Main Content */}
        <div className='md:col-span-3 space-y-6'>
          {/* Profile Section */}
          <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm'>
            <div className='flex items-center gap-2 mb-6'>
              <User className='h-5 w-5 text-emerald-500' />
              <h2 className='text-xl font-semibold text-slate-100'>Profile</h2>
            </div>

            <div className='flex flex-col md:flex-row gap-8 items-start'>
              {/* Avatar Preview */}
              <div className='flex flex-col items-center gap-3'>
                <div className='relative h-32 w-32 overflow-hidden rounded-full border-4 border-slate-800 bg-slate-800 shadow-xl'>
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt='Avatar'
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center text-4xl font-bold text-slate-600'>
                      {displayName ? displayName[0].toUpperCase() : '?'}
                    </div>
                  )}
                  {uploading && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
                      <Loader2 className='h-8 w-8 animate-spin text-white' />
                    </div>
                  )}
                </div>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='image/jpeg,image/png,image/webp'
                  onChange={handleFileChange}
                />
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className='flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50'
                >
                  <Camera className='h-3 w-3' />
                  Change Photo
                </button>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleSubmit} className='flex-1 space-y-4 w-full'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-300'>
                    Display Name
                  </label>
                  <input
                    type='text'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className='w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all'
                    placeholder='Enter your name'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-medium text-slate-300'>
                    Avatar URL
                  </label>
                  <div className='relative'>
                    <LinkIcon className='absolute left-3 top-2.5 h-4 w-4 text-slate-500' />
                    <input
                      type='url'
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className='w-full rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all'
                      placeholder='https://example.com/avatar.jpg'
                    />
                  </div>
                  <p className='text-xs text-slate-500'>
                    Provide a direct link to an image or upload one above. (&lt; 5mb)
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Preferences Section */}
          <div className='rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm'>
            <div className='flex items-center gap-2 mb-6'>
              <CreditCard className='h-5 w-5 text-emerald-500' />
              <h2 className='text-xl font-semibold text-slate-100'>
                Preferences
              </h2>
            </div>

            <div className='space-y-4 max-w-md'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-slate-300'>
                  Currency
                </label>
                <p className='text-xs text-slate-500 mb-2'>
                  Select your preferred currency for display.
                </p>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className='w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all appearance-none cursor-pointer'
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                  }}
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className='flex justify-end'>
            <button
              onClick={handleSubmit}
              disabled={saving || uploading}
              className='flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 font-medium text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {saving ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Save className='h-4 w-4' />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
