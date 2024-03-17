import "@/styles/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";

import { UiProvider } from "@/context/UiContext/uiContext";
import { FromProvider } from "@/context/LocationContext/FromContext";
import { DestinationProvider } from "@/context/LocationContext/DestinationContext";

export default function App({ Component, pageProps }) {
  return (
    <UiProvider>
      <FromProvider>
        <DestinationProvider>
          <Component {...pageProps} />
        </DestinationProvider>
      </FromProvider>
    </UiProvider>
  );
}
