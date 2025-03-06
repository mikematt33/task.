const now = new Date();

export const eventData = [
    {
        id: 0,
        title: "Today",
        start: new Date(new Date().setHours(new Date().getHours() - 3)),
        end: new Date(new Date().setHours(new Date().getHours() + 3)),
    },
    {
        id: 1,
        title: "Point in Time Event",
        start: now,
        end: new Date(now.getTime() + 180 * 60000)
    },
    {
        id: 2,
        title: "Multi-day Event",
        start: now,
        end: new Date(now.getTime() + 90 * 60000)
    },
    {
        id: 3,
        title: "Now",
        start: now,
        end: now
    }
];