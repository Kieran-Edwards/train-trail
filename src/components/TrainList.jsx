import { useState, useEffect } from "react";
import { FormatTime, GetFormattedDate } from "../utils/TimeUtils";

export function TrainList({ trainData, destCode }) {
    const [serviceDetailsMap, setServiceDetailsMap] = useState({});
    const [loadingServices, setLoadingServices] = useState(true);

    useEffect(() => {
        const fetchAllServiceDetails = async () => {
            try {
                const formattedDate = GetFormattedDate();

                const detailsMap = Object.fromEntries(
                    await Promise.all(
                        trainData.map(async ({ serviceUid }) => {
                            const response = await fetch(
                                `https://rtt.07edwardsk.workers.dev/proxy/service/${serviceUid}${formattedDate}`
                            );

                            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                            const data = await response.json();
                            const currentLocation = data.locations.find(
                                (loc) =>
                                    loc.realtimeActivated &&
                                    (!loc.realtimeDepartureActual || loc.realtimeArrivalActual)
                            );
                            const destLocation = data.locations.find((loc) => loc.crs === destCode);

                            return [serviceUid, { currentLocation: currentLocation || null, destLocation: destLocation || null }];
                        })
                    )
                );

                setServiceDetailsMap(detailsMap);
            } catch (err) {
                console.error(err.message);
            } finally {
                setLoadingServices(false);
            }
        };

        fetchAllServiceDetails();
    }, [trainData, destCode]);

    if (loadingServices) return <p>Loading service details...</p>;

    return (
        <div className="flex flex-col mb-4">
            {trainData.map((trainService) => {
                const { locationDetail, serviceUid } = trainService;
                const serviceDetails = serviceDetailsMap[serviceUid];

                const departureTime = locationDetail.gbttBookedArrival || locationDetail.gbttBookedDeparture;
                const timeDifference = locationDetail.realtimeDeparture - departureTime;

                return (
                    <div key={serviceUid} className="flex text-black text-left p-4 border-b border-slate-400">
                        <p className={`mr-3 ${locationDetail.realtimeDepartureActual ? 'text-red-500' : ''}`}>{FormatTime(departureTime)}</p>

                        <p className="mr-3">to</p>

                        <div className="flex-grow">
                            <p>{locationDetail.destination[0].description}</p>

                            <p className="text-xs">
                                {locationDetail.realtimeDepartureActual
                                    ? `Departed: ${FormatTime(locationDetail.realtimeDeparture)}`
                                    : timeDifference > 0
                                    ? `Expected: ${FormatTime(locationDetail.realtimeDeparture)}`
                                    : null}
                                {timeDifference !== 0 &&
                                    ` (${timeDifference > 0 ? "+" : "-"}${Math.abs(timeDifference)}min)`}
                            </p>

                            {locationDetail.cancelReasonShortText}

                            <p className="text-xs">
                                <span>Arrives at {destCode}: </span>
                                {serviceDetails?.destLocation?.realtimeArrival
                                    ? FormatTime(serviceDetails.destLocation.realtimeArrival)
                                    : "N/A"}
                            </p>
                        </div>

                        <div className="text-center">
                            <p>Plat</p>
                            <p className={locationDetail.platformConfirmed ? "text-green-500" : "text-red-500"}>
                                {locationDetail.platform}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
