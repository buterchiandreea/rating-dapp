import React from 'react';

const LoginCard =  ({ app }) => {
    const { img, href, color, name} = app;

    return (
        <div
            className="card"
            onClick={() => window.location = href}
        >
            <div
                style={{
                    height: '115px',
                    width: '130px',
                    background: `url("${img}") no-repeat center center / 100% ${color}` 
                }}
            />

            <div className="card-footer">
                <div style={{ textAlign: 'center', fontSize: 20, color: 'white' }}>
                    {name}
                </div>
            </div>

        </div>
    );
 };

export default LoginCard;