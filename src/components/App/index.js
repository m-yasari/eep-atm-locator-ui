import React from 'react';
import Header from '../Header';
import Main from '../Main';
import Container from 'react-bootstrap/Container';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheckSquare, faCog, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { GoogleApiWrapper } from 'google-maps-react';

library.add(faCheckSquare, faCog, faAngleUp, faAngleDown);

class App extends React.Component {
    render() {
        return (
        <Container>
            <Header />
            <Main />
        </Container>
        );
    }
}

export default App;
