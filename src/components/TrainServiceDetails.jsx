import React from "react";
import { FormatTime } from "../utils/TimeUtils";

export function TrainServiceDetails({ serviceDetails }) {

  return (
    <div className="mt-4 p-4 bg-black rounded">
      <h3 className="font-bold">Location</h3>
      {serviceDetails ? (
        <div>
          <p>
            <strong>Station:</strong> {serviceDetails.description || "N/A"}
          </p>
          <p>
            <strong>Departure Time:</strong>{" "}
            {serviceDetails.realtimeDeparture
              ? FormatTime(serviceDetails.realtimeDeparture)
              : "N/A"}
          </p>
        </div>
      ) : (
        <p>Train location not available.</p>
      )}
    </div>
  );
}