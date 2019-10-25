import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import MainPage from './main-page';
import Login from './login';

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path={'/'} component={Login} restrictred={false} />
                <Route path={'/login'} component={Login} />
            </Switch>
        </Router>
    );
}

export default Routes;