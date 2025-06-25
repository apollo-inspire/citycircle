export function getIsOpenNow(openingTimes?: {
    [day: string]: string[];
}): boolean {
const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(); // e.g. "monday"
    const openTime = openingTimes[`${weekday}_open`];
    const closeTime = openingTimes[`${weekday}_close`];

    if (!openTime || !closeTime) return false;

    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    const openDate = new Date(now);
    openDate.setHours(openHour, openMinute, 0);

    const closeDate = new Date(now);
    closeDate.setHours(closeHour, closeMinute, 0);

    return now >= openDate && now <= closeDate;
}