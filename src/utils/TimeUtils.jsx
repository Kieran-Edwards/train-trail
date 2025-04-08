export const FormatTime = (time) => {
    if (!time || time.length !== 4) return "N/A";
    const hours = time.slice(0, 2);
    const minutes = time.slice(2, 4);
    return `${hours}:${minutes}`;
};

export const GetFormattedDate = () => {
    const today = new Date();

    return `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, "0")}/${String(
        today.getDate()
    ).padStart(2, "0")}`
};
