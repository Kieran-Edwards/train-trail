import { useState, useEffect } from "react";
import { FormatTime } from "../utils/TimeUtils";

export function TrainList({ trainData, destCode }) {
    const [serviceDetailsMap, setServiceDetailsMap] = useState({});
    const [loadingServices, setLoadingServices] = useState(true);

    useEffect(() => {
        const fetchAllServiceDetails = async () => {
            try {
                const today = new Date();
                const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(
                    today.getDate()
                ).padStart(2, "0")}`;

                const detailsMap = {};

                await Promise.all(
                    trainData.map(async (trainService) => {
                        const response = await fetch(
                            `https://rtt.07edwardsk.workers.dev/proxy/service/${trainService.serviceUid}/${formattedDate}`
                        );

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const data = await response.json();

                        const currentLocation = data.locations.find(
                            (location) =>
                                location.realtimeActivated &&
                                (!location.realtimeDepartureActual || location.realtimeArrivalActual)
                        );

                        const destLocation = data.locations.find((location) => location.crs === destCode);

                        detailsMap[trainService.serviceUid] = {
                            currentLocation: currentLocation || null,
                            destLocation: destLocation || null,
                        };
                    })
                );

                setServiceDetailsMap(detailsMap);
                setLoadingServices(false);
            } catch (err) {
                console.error(err.message);
                setLoadingServices(false);
            }
        };

        fetchAllServiceDetails();
    }, [trainData, destCode, setServiceDetailsMap]);

    return (
        <div className="flex flex-col mb-4">
            {loadingServices ? (
                <p>Loading service details...</p>
            ) : (
                trainData.map((trainService) => {
                    const serviceDetails = serviceDetailsMap[trainService.serviceUid];
                    return (
                        <div key={trainService.serviceUid} className="flex text-black text-left p-4 border-b border-slate-400">
                            <p className="mr-3">
                                {FormatTime(
                                    trainService.locationDetail.gbttBookedArrival
                                        ? trainService.locationDetail.gbttBookedArrival
                                        : trainService.locationDetail.gbttBookedDeparture
                                )}
                            </p>
                            <p className="mr-3">to</p>
                            <div className="flex-grow">
                                <p>{trainService.locationDetail.destination[0].description}</p>
                                <p className="text-xs">
                                    <span>Expected: </span>
                                    <span>
                                        {FormatTime(
                                            trainService.locationDetail.gbttBookedArrival
                                                ? trainService.locationDetail.realtimeArrival
                                                : trainService.locationDetail.realtimeDeparture
                                        )}
                                    </span>
                                </p>
                                <p className="text-xs">
                                    <span>Arrives at dest: </span>
                                    {serviceDetails && (
                                        <span>
                                            {serviceDetails.destLocation.realtimeArrival
                                                ? FormatTime(serviceDetails.destLocation.realtimeArrival)
                                                : "N/A"}
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div className="text-center">
                                <p>Plat</p>
                                <p
                                    className={
                                        trainService.locationDetail.platformConfirmed ? "text-green-500" : "text-red-500"
                                    }
                                >
                                    {trainService.locationDetail.platform}
                                </p>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}