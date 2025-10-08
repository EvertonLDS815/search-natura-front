import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

export const redirectToLogin = () => {
  history.push('/login');
};

export default history;