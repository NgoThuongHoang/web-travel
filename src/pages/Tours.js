import React from 'react';
import { Link } from 'react-router-dom';

function Tours() {
    return (
        <div>
            <h1>Our Tours</h1>
            <ul>
                <li>Tour 1 - <Link to="/tours/1">View Details</Link></li>
                <li>Tour 2 - <Link to="/tours/2">View Details</Link></li>
                <li>Tour 3 - <Link to="/tours/3">View Details</Link></li>
            </ul>
        </div>
    );
}

export default Tours;