import React from "react";
import '../Styles/header.css';
import ReactModal from "react-modal";
import GoogleLogin from "react-google-login";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'antiquewhite',
        border: '1px solid brown'

    },
};

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            backgroundColor: '',
            display: 'none',
            loginModalIsOpen: false,
            isLoggedIn: false,
            loggedInUser: undefined
        }
    }

    componentDidMount() {
        const path = this.props.history.location.pathname;
        this.setAttributes(path);
    }

    setAttributes = (path) => {
        let bg, display;
        if( path == "/") {
            bg = '#000000';
            display: 'none';
        } else {
            bg = '#ff0000';
            display = 'inline-block';
        }
        this.setState({ backgroundColor : bg, display : display });

    }

    handleLogin = () => {
        this.setState({ loginModalIsOpen: true });
    }

    handleLogout = () => {
        this.setState({ isLoggedIn: false, loggedInUser: undefined });
    }

    handleCancel = () => {
        this.setState({ loginModalIsOpen: false });
    }

    responseGoogle = (response) => {
        this.setState({ isLoggedIn: true, loggedInUser: response.profileObj.name, loginModalIsOpen: false });
      }

    render() {
        const { backgroundColor, display, loginModalIsOpen, loggedInUser, isLoggedIn } = this.state;
        return (
            <div className="header" style={{ backgroundColor : backgroundColor }}>
                <div className="header-logo" style={{ display : display }}>
                    <p>e!</p>

                </div>
                {!isLoggedIn ?
                        <div className="user-account">
                            <div className="login" onClick={this.handleLogin}>Login</div>
                            <div className="signup">Create an account</div>
                        </div>
                        :  <div className="user-account">
                        <div className="login">{loggedInUser}</div>
                        <div className="signup" onClick={this.handleLogout}>Logout</div>
                    </div>}
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <h2>Login</h2>
                        <input type="text" placeholder="Email" />
                        <br />
                        <input type="text" placeholder="Password" />
                        <div>
                            <button>Login</button>
                            <button onClick={this.handleCancel}>Cancel</button>
                        </div>
                        <div>
                        <GoogleLogin
                            clientId="871669474758-51avid9nde4mv7rmuqp91q0nn304mgej.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                        </div>

                    </div>
                </Modal>
            </div>
        )
    }
}
export default Header;