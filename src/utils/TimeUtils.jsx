export const FormatTime = (time) => {
    if (!time || time.length !== 4) return "N/A";
    const hours = time.slice(0, 2);
    const minutes = time.slice(2, 4);
    return `${hours}:${minutes}`;
};

export const ParseTimeToDate = (hhmm) => {
    const hours = Math.floor(hhmm / 100);
    const minutes = hhmm % 100;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

export const GetFormattedDate = (withTime = false) => {
  const date = new Date();
  if (withTime) date.setHours(date.getHours() - 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  if (!withTime) return `/${year}/${month}/${day}`;

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `/${year}/${month}/${day}/${hours}${minutes}`;
};

