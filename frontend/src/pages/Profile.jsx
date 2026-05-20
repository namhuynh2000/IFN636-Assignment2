import { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [initialData, setInitialData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  const canSubmit = useMemo(() => {
    return formData.name.trim().length > 0 && formData.email.trim().length > 0 && formData.phoneNumber.trim().length > 0;
  }, [formData]);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get('/api/auth/profile');
        const data = {
          name: res.data?.name || '',
          email: res.data?.email || '',
          phoneNumber: res.data?.phoneNumber || '',
        };
        setInitialData(data);
        setFormData(data);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!canSubmit) {
      setError('Phone number is required.');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.put('/api/auth/profile', {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
      });

      await login(res.data);
      setInitialData({
        name: res.data?.name || '',
        email: res.data?.email || '',
        phoneNumber: res.data?.phoneNumber || formData.phoneNumber,
      });
    } catch (e2) {
      setError(e2.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setError('');
    setFormData(initialData);
  };

  if (loading && !formData.name) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-2">
          Personal Details
        </h1>
        
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-8">
          <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col items-center text-center transition-all">
            <div className="relative group cursor-pointer mb-6">
              <img
                alt="Profile avatar"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                src="/profile.png"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
            </div>

            <h2 className="font-headline font-bold text-xl mb-1">{formData.name || 'Your Name'}</h2>
            <p className="text-sm text-on-surface-variant mb-6">Sliver member</p>

            <button
              type="button"
              className="w-full py-3 bg-secondary-fixed text-on-secondary-fixed rounded-full text-sm font-bold hover:bg-secondary-fixed-dim transition-colors"
              onClick={() => {}}
            >
              Change Photo
            </button>
            <button
                type="button"
                className="w-full flex items-center justify-center text-sm font-medium hover:text-primary transition-colors"
            >
                <span>Change Password</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-8">
          <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <span className="material-symbols-outlined text-primary">person_edit</span>
              <h3 className="font-headline font-bold text-xl">Personal Details</h3>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl">
                <p className="font-body text-sm text-error">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Full Name</label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                  placeholder="Enter your full name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">Email Address</label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                  placeholder="name@company.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant ml-1">
                  Phone Number <span className="text-error">*</span>
                </label>
                <input
                  className="w-full bg-surface-container-low border-none rounded-xl px-4 py-4 text-base focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all"
                  placeholder="+1 (000) 000-0000"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((p) => ({ ...p, phoneNumber: e.target.value }))}
                  required
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  className="flex-1 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold text-base shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  className="flex-1 py-4 bg-surface-container-high text-on-surface rounded-full font-bold text-base hover:bg-surface-container-highest transition-all"
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <div className="mt-8 bg-error-container/10 rounded-3xl p-8 border border-error-container/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-headline font-bold text-error mb-1">Danger Zone</h4>
                <p className="text-sm text-on-surface-variant">
                  Deleting your account will permanently remove all your data and workspace access. This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                className="whitespace-nowrap px-6 py-3 border-2 border-error text-error rounded-full text-sm font-bold hover:bg-error hover:text-white transition-all"
                onClick={() => {}}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
