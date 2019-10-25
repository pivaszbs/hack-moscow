import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import MainPage from './main-page/main-page';

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path={'/'} component={MainPage} />
            </Switch>
        </Router>
    );
}

export default Routes;