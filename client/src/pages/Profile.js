import React from 'react';
import { useAuthUser } from '../security/AuthContext';
import AppLayout from '../components/AppLayout';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, loading, logout } = useAuthUser();
  const navigate = useNavigate(); // ← add this

  const handleLogout = async () => {
    await logout();            // call logout function
    navigate('/');             // redirect to home
  };


  return (
    <AppLayout>
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow border border-pearl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-paynes-gray mb-4">Account Settings</h2>

          {loading ? (
            <p className="italic text-sm text-paynes-gray">Loading user info...</p>
          ) : !user ? (
            <p className="text-sm text-red-500">You are not logged in.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-paynes-gray font-semibold">Name</p>
                <p className="mt-1 border border-columbia-blue rounded-lg px-3 py-2 bg-columbia-blue/20">
                  {user.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-paynes-gray font-semibold">Email</p>
                <p className="mt-1 border border-columbia-blue rounded-lg px-3 py-2 bg-columbia-blue/20">
                  {user.email}
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
