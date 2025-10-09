export type Settings = {
    usesOslProtocol: boolean;
    currentSort: string;
};

export const DEFAULT_SETTINGS: Settings = {
    usesOslProtocol: false,
    currentSort: "online",
};