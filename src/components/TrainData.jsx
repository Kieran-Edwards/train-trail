import { useEffect, useState } from "react";
import { GetFormattedDate } from "../utils/TimeUtils"
import { TrainList } from "./TrainList";

export function TrainData({ stationCode, destCode, isCurrent }) {
    const [trainData, setTrainData] = useState(null);
    const [pastServiceData, setPastServiceData] = useState(null);
    const [showPastServices, setshowPastServices] = useState(false);
    const [serviceData, setServiceData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTable, setShowTable] = useState(isCurrent)

    const fetchPastTrainData = async (stationCode, destCode) => {
        if (showPastServices) {
            setshowPastServices(false)
            return;
        }

        try {
            const dateString = GetFormattedDate(true)

            const pastTrains = await fetch(
                `https://rtt.07edwardsk.workers.dev/proxy/search/${stationCode}/to/${destCode}${dateString}`
            );

            const pastTrainsData = await pastTrains.json();

            const filteredServices = pastTrainsData.services.filter(
                (service) => service.atocCode !== "LO"
            );

            setPastServiceData(filteredServices)

            setshowPastServices(true)

        }  catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchTrainData = async (stationCode, destCode) => {
            try {
                const futureTrains = await fetch(
                    `https://rtt.07edwardsk.workers.dev/proxy/search/${stationCode}/to/${destCode}`
                );

                if (!futureTrains.ok) {
                    throw new Error(`HTTP error! Status: ${futureTrains.status}`);
                }

                const futureTrainsData = await futureTrains.json();

                const filteredServices = futureTrainsData.services.filter(
                    (service) => service.atocCode !== "LO"
                );

                setTrainData(futureTrainsData);
                setServiceData(filteredServices.slice(0,8));
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
                <div className="flex flex-col mb-4">
                    <h2 className="text-lg text-center text-black cursor-pointer" onClick={() => setShowTable(!showTable)}>
                        <span className="font-bold mr-1">{trainData.location.name}</span>
                        to
                        <span className="font-bold ml-1">{trainData.filter.destination.name}</span>
                    </h2>

                    {showTable && (
                        <button 
                            className="bg-blue-300 p-1 m-3 rounded-md cursor-pointer"
                            onClick={() => fetchPastTrainData(stationCode, destCode)}
                        >
                            {showPastServices ? 'hide' : 'load'} Past Trains
                        </button>
                    )}

                    {pastServiceData && showPastServices && (
                        <TrainList trainData={pastServiceData} destCode={destCode} />
                    )}

                    {showTable && (
                        <TrainList trainData={serviceData} destCode={destCode} />
                    )}
                </div>
            )}
        </div>
    );
}