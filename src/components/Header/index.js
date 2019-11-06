import React from 'react';
import { Image }  from 'react-bootstrap';

class Header extends React.Component {
    render() {
        return (
        <>
            <div><Image src='img/logo.jpg'/></div>
        </>
        );
    }
}

export default Header;