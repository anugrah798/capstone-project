import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [preferredCity, setPreferredCity] = useState(
    user?.preferredCity || ""
  );

  const [historyCount, setHistoryCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);

  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(
    localStorage.getItem("skySenseProfilePhoto") || ""
  );

  const [showPasswordBox, setShowPasswordBox] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadActivity();
  }, []);

  async function loadActivity() {
    try {
      const historyResponse = await api.get("/history");

      setHistoryCount(
        historyResponse.data.history?.length || 0
      );
    } catch (error) {
      console.log("History loading failed");
    }

    try {
      const favoritesResponse = await api.get("/favorites");

      setFavoriteCount(
        favoritesResponse.data.favorites?.length || 0
      );
    } catch (error) {
      console.log("Favorites loading failed");
    }
  }

  async function handleSave(e) {
    e.preventDefault();

    try {
      await api.put("/auth/profile", {
        name,
        preferredCity,
      });

      setMessage("Profile updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Unable to update profile."
      );
    }
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Profile photo must be less than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setPhoto(imageData);

      localStorage.setItem(
        "skySenseProfilePhoto",
        imageData
      );

      setMessage("Profile photo updated.");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    };

    reader.readAsDataURL(file);
  }

  function removePhoto() {
    setPhoto("");

    localStorage.removeItem(
      "skySenseProfilePhoto"
    );

    setMessage("Profile photo removed.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  async function handleChangePassword(e) {
    e.preventDefault();

    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage(
        "Please fill in all password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await api.put("/auth/profile/password", {
        currentPassword,
        newPassword,
      });

      setPasswordMessage(
        "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setShowPasswordBox(false);
        setPasswordMessage("");
      }, 2000);
    } catch (error) {
      setPasswordMessage(
        error.response?.data?.message ||
        "Unable to change password."
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  const initials = name
    ? name.charAt(0).toUpperCase()
    : "U";

  return (
    <main className="profile-page">

      {/* =====================================
          PROFILE HEADER
      ====================================== */}

      <div className="profile-header">

        <div className="profile-avatar-wrapper">

          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="profile-avatar-image"
            />
          ) : (
            <div className="profile-avatar">
              {initials}
            </div>
          )}

          <button
            type="button"
            className="profile-camera-button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            title="Change profile photo"
          >
            📷
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            hidden
            onChange={handlePhotoChange}
          />

        </div>

        <div>

          <p className="eyebrow">
            ACCOUNT
          </p>

          <h1>
            My Profile
          </h1>

          <p>
            Manage your personal information and
            weather preferences.
          </p>

        </div>

      </div>


      {/* =====================================
          PROFILE PHOTO
      ====================================== */}

      <section className="profile-card">

        <div className="profile-card-header">

          <div className="profile-icon">
            📷
          </div>

          <div>
            <h2>
              Profile Photo
            </h2>

            <p>
              Add a profile picture to personalize
              your SkySense AI account.
            </p>
          </div>

        </div>

        <div className="profile-photo-actions">

          <button
            type="button"
            className="primary"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            📷 Choose Photo
          </button>

          {photo && (
            <button
              type="button"
              className="secondary"
              onClick={removePhoto}
            >
              Remove Photo
            </button>
          )}

        </div>

      </section>


      {/* =====================================
          PROFILE INFORMATION
      ====================================== */}

      <section className="profile-card">

        <div className="profile-card-header">

          <div className="profile-icon">
            👤
          </div>

          <div>
            <h2>
              Profile Information
            </h2>

            <p>
              Update your basic account information.
            </p>
          </div>

        </div>


        <form onSubmit={handleSave}>

          <div className="profile-form-grid">

            <div className="profile-field">

              <label>
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
                required
              />

            </div>


            <div className="profile-field">

              <label>
                Email Address
              </label>

              <input
                type="email"
                value={user?.email || ""}
                disabled
              />

            </div>

          </div>


          <div className="profile-field">

            <label>
              📍 Preferred City
            </label>

            <input
              type="text"
              value={preferredCity}
              onChange={(e) =>
                setPreferredCity(e.target.value)
              }
              placeholder="Example: Kochi"
            />

            <small>
              This city can be used as your default
              weather location.
            </small>

          </div>


          {message && (
            <p className="profile-message">
              ✓ {message}
            </p>
          )}


          <button
            type="submit"
            className="primary profile-save-button"
          >
            💾 Save Changes
          </button>

        </form>

      </section>


      {/* =====================================
          ACCOUNT DETAILS
      ====================================== */}

      <section className="profile-card">

        <div className="profile-card-header">

          <div className="profile-icon">
            🛡️
          </div>

          <div>
            <h2>
              Account Details
            </h2>

            <p>
              Information about your SkySense AI account.
            </p>
          </div>

        </div>


        <div className="account-details">

          <div className="account-detail">
            <span>Email</span>

            <strong>
              {user?.email || "Not available"}
            </strong>
          </div>


          <div className="account-detail">
            <span>Account Type</span>

            <strong>
              {user?.role === "admin"
                ? "Administrator"
                : "Standard User"}
            </strong>
          </div>


          <div className="account-detail">
            <span>Weather Location</span>

            <strong>
              {preferredCity || "Current Location"}
            </strong>
          </div>

        </div>

      </section>


      {/* =====================================
          ACTIVITY
      ====================================== */}

      <section className="profile-card">

        <div className="profile-card-header">

          <div className="profile-icon">
            📊
          </div>

          <div>
            <h2>
              Your Activity
            </h2>

            <p>
              Your activity on SkySense AI.
            </p>
          </div>

        </div>


        <div className="profile-stats">

          <div className="profile-stat">

            <div className="profile-stat-icon">
              🔎
            </div>

            <div>
              <strong>
                {historyCount}
              </strong>

              <span>
                Weather Searches
              </span>
            </div>

          </div>


          <div className="profile-stat">

            <div className="profile-stat-icon">
              ❤️
            </div>

            <div>
              <strong>
                {favoriteCount}
              </strong>

              <span>
                Favorite Locations
              </span>
            </div>

          </div>


          <div className="profile-stat">

            <div className="profile-stat-icon">
              ☁️
            </div>

            <div>
              <strong>
                SkySense AI
              </strong>

              <span>
                Weather Platform
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          SECURITY
      ====================================== */}

      <section className="profile-card">

        <div className="profile-card-header">

          <div className="profile-icon">
            🔐
          </div>

          <div>
            <h2>
              Security
            </h2>

            <p>
              Keep your account secure.
            </p>
          </div>

        </div>


        <div className="security-row">

          <div>

            <h3>
              Password
            </h3>

            <p>
              Change your account password securely.
            </p>

          </div>

          <button
            type="button"
            className="secondary"
            onClick={() =>
              setShowPasswordBox(
                !showPasswordBox
              )
            }
          >
            🔑 {showPasswordBox
              ? "Cancel"
              : "Change Password"}
          </button>

        </div>


        {/* CHANGE PASSWORD FORM */}

        {showPasswordBox && (

          <form
            className="password-form"
            onSubmit={handleChangePassword}
          >

            <div className="profile-field">

              <label>
                Current Password
              </label>

              <div className="password-input-wrapper">

                <input
                  type={
                    showCurrent
                      ? "text"
                      : "password"
                  }
                  value={currentPassword}
                  onChange={(e) =>
                    setCurrentPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowCurrent(!showCurrent)
                  }
                >
                  {showCurrent ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            <div className="profile-field">

              <label>
                New Password
              </label>

              <div className="password-input-wrapper">

                <input
                  type={
                    showNew
                      ? "text"
                      : "password"
                  }
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowNew(!showNew)
                  }
                >
                  {showNew ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            <div className="profile-field">

              <label>
                Confirm New Password
              </label>

              <div className="password-input-wrapper">

                <input
                  type={
                    showConfirm
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm(
                      !showConfirm
                    )
                  }
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            {passwordMessage && (
              <p className="profile-message">
                {passwordMessage}
              </p>
            )}


            <button
              type="submit"
              className="primary"
              disabled={passwordLoading}
            >
              {passwordLoading
                ? "Changing Password..."
                : "🔐 Update Password"}
            </button>

          </form>

        )}

      </section>

    </main>
  );
}