export const SERVICE_TYPES = {
    COMPLETE: "both",
    DEVELOPMENT: "dev",
    MAINTENANCE: "maintenance",
} as const;

export type ServiceType = (typeof SERVICE_TYPES)[keyof typeof SERVICE_TYPES];