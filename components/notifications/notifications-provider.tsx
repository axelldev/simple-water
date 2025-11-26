import * as Notifications from "expo-notifications";

import { requestNotificationsPermission } from "@/utils/notifications";
import { createContext, ReactNode, useEffect, useState } from "react";

interface NotificationsContextType {
  status: Notifications.PermissionStatus;
}

export const NotificationsContext = createContext<NotificationsContextType>({
  status: Notifications.PermissionStatus.DENIED,
});

export const NotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [status, setStatus] = useState<Notifications.PermissionStatus>(
    Notifications.PermissionStatus.UNDETERMINED
  );

  useEffect(() => {
    requestNotificationsPermission()
      .then((status) => {
        setStatus(status);
      })
      .catch((error) => {
        console.warn("Error requesting notifications permission:", error);
      });
  }, []);

  return (
    <NotificationsContext.Provider value={{ status }}>
      {children}
    </NotificationsContext.Provider>
  );
};
