import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { UiProvider } from "@/context/UiContext/uiContext";
import { FromProvider } from "@/context/LocationContext/user/FromContext";
import { DestinationProvider } from "@/context/LocationContext/user/DestinationContext";
import { DriverDestinationProvider } from "@/context/LocationContext/driver/DriverDestinationContext";
import { DriverFromProvider } from "@/context/LocationContext/driver/DriverFromContext";
import { TripProvider } from "@/context/TripContext/TripContext";
import { DriversProvider } from "@/context/DriversContext/DriversContext";
import {
  WebSocketProvider
} from '@/context/WebSocketContext';

export default function App({ Component, pageProps }) {
  return (
    <WebSocketProvider>
      <UiProvider>
        <TripProvider>
          <FromProvider>
            <DestinationProvider>
              <DriverDestinationProvider>
                <DriverFromProvider>
                  <DriversProvider>
                    <Component {...pageProps} />
                  </DriversProvider>
                </DriverFromProvider>
              </DriverDestinationProvider>
            </DestinationProvider>
          </FromProvider>
        </TripProvider>
      </UiProvider>
    </WebSocketProvider>
  );
}
