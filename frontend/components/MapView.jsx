// This file just re-exports MapView to satisfy regular imports. 
// Metro will automatically pick MapView.native.jsx on mobile and MapView.web.jsx on web.
import MapView, { Marker, Polyline } from './MapView.native'; // Fallback to native type signatures for autocomplete

export { Marker, Polyline };
export default MapView;
