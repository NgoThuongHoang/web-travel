import React from 'react';
import { useParams } from 'react-router-dom';

function TourDetails() {
    const { id } = useParams();
    return (
        <div>
            <h1>Tour Details</h1>
            <p>Details about tour {id} will go here.</p>
        </div>
    );
}

export default TourDetails;
