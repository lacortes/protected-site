import React, { useState } from 'react';
import validator from 'validator';
import Button from '../atoms/Button';
import axios from 'axios';

const ComingSoon = () => {
    const [ email, setEmail ] = useState('');
    const [ isEmailValid, setEmailValid ] = useState(false);
    const [ isBtnEnabled, setBtnEnabled ] = useState(false);
    const [ isMakingRequest, setIsMakingRequest ] = useState(false);
    const [ msg, setMsg ] = useState('');
    const [ failedToSignUp, setFailedToSignUp ] = useState(false);

    const updateEmail = e => {
        const emailRaw = e.target.value.trim();
        if ( !validator.isEmpty(emailRaw) && validator.isEmail(emailRaw) ) {
            setBtnEnabled(true);
            setEmailValid(true);
        } else {
            setBtnEnabled(false);
            setEmailValid(false);
        }
        setEmail(emailRaw);
        setMsg('');
    };

    const handleSignUp = () => {
        if (isBtnEnabled === false || isMakingRequest) {
            return; // no double click
        }

        setIsMakingRequest(true);
        axios.post('http://localhost:5050/api/email-sign-up'
            , { email }
            , { timeout: 10000 }
        )
            .then( resp => {
                const { status } = resp;
                if (status === 201) {
                    setFailedToSignUp(false);
                    setMsg('You will be notified once the site is up!');
                } else {
                    setFailedToSignUp(true);
                    setMsg('Email is currently signed up');
                }
            })
            .catch(err => {
                const resp = err.toJSON();
                const status = resp.status;

                if ( status === 400 ) {
                    setBtnEnabled(false);
                    setMsg('Invaid Email!');
                } else {
                    setMsg('Currently no longer accepting new sign-ups.');
                }
                setFailedToSignUp(true);
            })
            .finally(() => {
                setIsMakingRequest(false);
            })
        ;

        setBtnEnabled(false);
    };

    return (
        <div className="coming-soon-wrapper">
            <div className="coming-soon-content">
                <div className="title-container">
                    <div className="title">
                        Karly&apos;s Capstone
                    </div>
                    <div className="line"></div>
                </div>
                
                <div className="main-label">
                    Coming Soon
                </div>

                <div className="body-text-container">
                    <div className="body-text">
                    The capstone project will mark the completion of a two-year graduate program in college counseling
                    and student development. 
                    </div>
                    <div className="line"></div>
                </div>

                <div className="email-input-wrapper">
                    <label htmlFor="emailAddress">Find out when the journey begins </label>
                    <div className="email-container">
                        <input 
                            id="emailAddress" 
                            className={(isEmailValid && !failedToSignUp) ? '' : 'invalid'}
                            type="email" 
                            placeholder="Enter you email" 
                            value={email} 
                            onChange={updateEmail}
                        />
                        <Button className='signup-btn' label="Sign Up" enabled={isBtnEnabled} onClick={handleSignUp}/>
                    </div>
                    {
                        msg ? 
                            <div className={'signup-message ' + failedToSignUp ? 'error' : ''}>
                                { msg }
                            </div>
                            : null
                    }
                    
                </div>
                
            </div>
        </div>
    );
};

export default ComingSoon;