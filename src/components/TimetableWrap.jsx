import { useState } from "react";
import { TrainData } from "./TrainData";

export function TimetableWrap({ stationCode, destCode, title }) {
    const [showTimetable, setShowTimetable] = useState(false);

    const switchTimetable = () => {
        setShowTimetable(!showTimetable);
    };

    return (
        <div className="flex flex-col lg:pb-16 lg:px-16">
            <button
                onClick={switchTimetable}
                className="cursor-pointer self-center bg-blue-500 hover:bg-transparent hover:text-blue-700 font-semibold text-white py-2 px-4 border border-blue-500 rounded mb-8"
            >
                {showTimetable ? "hide" : "show"} {title}
            </button>

            {showTimetable && (
                <div className="grid lg:grid-cols-1">
                    <TrainData stationCode={stationCode} destCode={destCode} />
                </div>
            )}
        </div>
    );
}