function checkAccessAndInitializeApp() {
    const cookieName = 'hasAccessedApp';
    if (document.cookie.split(';').some((item) => item.trim().startsWith(`${cookieName}=`))) {
      alert("You have already accessed this app.");
      return false; // Indicates the app should not initialize
    } else {
      // Set the cookie to expire in 365 days
      const expiryDate = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000);
      document.cookie = `${cookieName}=true; expires=${expiryDate.toGMTString()}; path=/`;
      return true; // Indicates the app can initialize
    }
  }
  