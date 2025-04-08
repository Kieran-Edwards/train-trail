import { useState } from "react";
import { TrainData } from "./TrainData";

export function TimetableWrap({ stationCode1, stationCode2, destCode1, destCode2, title }) {
    const [showTimetable, setShowTimetable] = useState(false);

    const switchTimetable = () => {
        setShowTimetable(!showTimetable);
    };

    return (
        <div className="flex flex-col lg:pb-16">
            <button
                onClick={switchTimetable}
                className="cursor-pointer self-center bg-blue-500 hover:bg-transparent hover:text-blue-700 font-semibold text-white py-2 px-4 border border-blue-500 rounded mb-8"
            >
                {showTimetable ? "hide" : "show"} {title} timetable
            </button>

            {showTimetable && (
                <div className="grid lg:grid-cols-2">
                    <TrainData stationCode={stationCode1} destCode={destCode1} />
                    <TrainData stationCode={stationCode2} destCode={destCode2} />
                </div>
            )}
        </div>
    );
}