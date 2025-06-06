import { useEffect, useState } from "react";
import { TrainList } from "./TrainList";

export function TrainData({ stationCode, destCode }) {
    const [trainData, setTrainData] = useState(null);
    const [serviceData, setServiceData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainData = async (stationCode, destCode) => {
            try {
                const response = await fetch(
                    `https://rtt.07edwardsk.workers.dev/proxy/search/${stationCode}/to/${destCode}`
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const filteredServices = data.services.filter(
                    (service) => service.atocCode !== "LO"
                );

                setTrainData(data);
                setServiceData(filteredServices.slice(0, 8));
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
                    <h2 className="text-lg text-center text-black">
                        <span className="font-bold mr-1">{trainData.location.name}</span>
                        to
                        <span className="font-bold ml-1">{trainData.filter.destination.name}</span>
                    </h2>
                    <TrainList trainData={serviceData} destCode={destCode} />
                </div>
            )}
        </div>
    );
}