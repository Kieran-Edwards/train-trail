export const FormatTime = (time) => {
    if (!time || time.length !== 4) return "N/A";
    const hours = time.slice(0, 2);
    const minutes = time.slice(2, 4);
    return `${hours}:${minutes}`;
};