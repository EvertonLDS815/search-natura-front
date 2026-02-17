export const redirectToLogin = () => {
  localStorage.removeItem('token');
  window.location.replace('/login');
};