import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import MainPage from './main-page';
import Login from './login';

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path={'/'} component={MainPage} restrictred={false} />
            </Switch>
        </Router>
    );
}

export default Routes;