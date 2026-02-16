import { create } from "zustand";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface NotificationAction {
    label: string;
    onClick: () => void;
}

export interface NotificationState {
    isOpen: boolean;
    message: string;
    type: NotificationType;
    action?: NotificationAction;
    showNotification: (
        message: string,
        type: NotificationType,
        action?: NotificationAction
    ) => void;
    hideNotification: () => void;
}


export const useNotificationStore = create<NotificationState>((set) => ({
    isOpen: false,
    message: "",
    type: "info",
    action: undefined,

    showNotification: (message, type, action) => {
        set({
            isOpen: true,
            message,
            type,
            action,
        });
    },

    hideNotification: () => {
        set({
            isOpen: false,
            action: undefined,
        });
    }
}));