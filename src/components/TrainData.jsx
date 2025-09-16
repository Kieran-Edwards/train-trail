import { useEffect, useState } from "react";
import { GetFormattedDate } from "../utils/TimeUtils"
import { TrainList } from "./TrainList";

export function TrainData({ stationCode, destCode }) {
    const [trainData, setTrainData] = useState(null);
    const [serviceData, setServiceData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTable, setShowTable] = useState(true)

    useEffect(() => {
        const fetchTrainData = async (stationCode, destCode) => {
            try {

                const dateString = GetFormattedDate(true)

                const pastTrains = await fetch(
                    `https://rtt.07edwardsk.workers.dev/proxy/search/${stationCode}/to/${destCode}${dateString}`
                );

                const futureTrains = await fetch(
                    `https://rtt.07edwardsk.workers.dev/proxy/search/${stationCode}/to/${destCode}`
                );

                if (!pastTrains.ok || !futureTrains.ok) {
                    throw new Error(`HTTP error! res1 status: ${pastTrains.status}, res2 status: ${futureTrains.status}`);
                }

                const pastTrainsData = await pastTrains.json();
                const futureTrainsData = await futureTrains.json();

                const mergedServices = [...pastTrainsData.services, ...futureTrainsData.services];

                const mergedData = { 
                ...futureTrainsData, 
                services: mergedServices 
                };

                const filteredServices = mergedData.services.filter(
                    (service) => service.atocCode !== "LO"
                );

                setTrainData(mergedData);
                setServiceData(filteredServices.slice(0,10));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainData(stationCode, destCode);
    }, [stationCode, destCode]);

    return (
        <div className="bg-white p-4 rounded mb-20 mx-8">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}
            {trainData && (
                <div>
                    <h2 className="text-lg text-center text-black" onClick={() => setShowTable(!showTable)}>
                        <span className="font-bold mr-1">{trainData.location.name}</span>
                        to
                        <span className="font-bold ml-1">{trainData.filter.destination.name}</span>
                    </h2>
                    {showTable && (
                        <TrainList trainData={serviceData} destCode={destCode} />
                    )}
                </div>
            )}
        </div>
    );
}