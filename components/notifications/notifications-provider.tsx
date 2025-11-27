import * as Notifications from "expo-notifications";

import { getCurrentNotificationsPermission } from "@/utils/notifications";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

interface NotificationsContextType {
  status: Notifications.PermissionStatus;
  refreshStatus: () => Promise<Notifications.PermissionStatus>;
}

export const NotificationsContext = createContext<NotificationsContextType>({
  status: Notifications.PermissionStatus.UNDETERMINED,
  refreshStatus: async () => Notifications.PermissionStatus.UNDETERMINED,
});

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [status, setStatus] = useState<Notifications.PermissionStatus>(
    Notifications.PermissionStatus.UNDETERMINED
  );

  const refreshStatus = useCallback(async () => {
    const currentStatus = await getCurrentNotificationsPermission();
    setStatus(currentStatus);
    return currentStatus;
  }, []);

  // Only check current status on mount - never auto-request
  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  return (
    <NotificationsContext.Provider value={{ status, refreshStatus }}>
      {children}
    </NotificationsContext.Provider>
  );
};
