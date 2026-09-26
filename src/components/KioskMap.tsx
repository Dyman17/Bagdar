import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Place, RouteResponse, KioskOrigin } from '../types';

interface KioskMapProps {
  origin: KioskOrigin;
  places: Place[];
  selectedPlace: Place | null;
  route: RouteResponse | null;
  onMarkerSelect?: (place: Place) => void;
}

export const KioskMap: React.FC<KioskMapProps> = ({
  origin,
  places,
  selectedPlace,
  route,
  onMarkerSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const originMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map with CartoDB Positron architectural tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [origin.lat, origin.lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    // Clean, high-legibility architectural basemap
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
      }
    ).addTo(map);

    // Kiosk Origin Marker with heading indicator cone
    const originIcon = L.divIcon({
      className: 'kiosk-origin-pin-container',
      html: `
        <div class="bhutan-kiosk-pin">
          <div class="kiosk-radar-cone" style="transform: rotate(${origin.heading_deg}deg);"></div>
          <div class="kiosk-outer-pulsar"></div>
          <div class="kiosk-pin-core">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3">
              <circle cx="12" cy="12" r="8"/>
            </svg>
          </div>
          <div class="kiosk-pin-tag">
            <span class="tag-title">СІЗ ОСЫНДАСЫЗ</span>
            <span class="tag-sub">15-ш/а Амфитеатр</span>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const originMarker = L.marker([origin.lat, origin.lng], {
      icon: originIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    originMarkerRef.current = originMarker;
    markersLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [origin]);

  // Update Markers
  useEffect(() => {
    if (!mapRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;

      const icon = L.divIcon({
        className: 'bhutan-place-pin-container',
        html: `
          <div class="atlas-pin-wrapper ${isSelected ? 'is-active' : ''}">
            <div class="atlas-pin-body">
              <span class="pin-number">${place.id}</span>
            </div>
            <div class="atlas-pin-label">
              <span class="pin-name">${place.name}</span>
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const marker = L.marker([place.lat, place.lng], { icon });
      marker.on('click', () => {
        onMarkerSelect?.(place);
      });
      markersLayerRef.current?.addLayer(marker);
    });
  }, [places, selectedPlace, onMarkerSelect]);

  // Update Route Polyline & Bounds
  useEffect(() => {
    if (!mapRef.current) return;

    if (routeLayerRef.current) {
      mapRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (route && route.geometry?.coordinates?.length) {
      const latLngs = route.geometry.coordinates.map(
        ([lng, lat]) => [lat, lng] as [number, number]
      );

      const polyline = L.polyline(latLngs, {
        color: '#F5F2EB',
        weight: 4,
        opacity: 0.95,
        lineCap: 'square',
        lineJoin: 'miter',
        dashArray: '8, 8',
        className: 'bhutan-route-animated-path',
      }).addTo(mapRef.current);

      routeLayerRef.current = polyline;

      const bounds = L.latLngBounds(latLngs);
      bounds.extend([origin.lat, origin.lng]);
      mapRef.current.fitBounds(bounds, {
        paddingTopLeft: [80, 80],
        paddingBottomRight: [480, 80],
        maxZoom: 17,
      });
    } else if (selectedPlace && mapRef.current) {
      mapRef.current.flyTo([selectedPlace.lat, selectedPlace.lng], 17, {
        duration: 1.2,
      });
    } else if (mapRef.current) {
      mapRef.current.flyTo([origin.lat, origin.lng], 16, {
        duration: 1.2,
      });
    }
  }, [route, selectedPlace, origin]);

  return (
    <div className="bhutan-map-canvas">
      <div ref={mapContainerRef} className="bhutan-leaflet-container" />
      <div className="bhutan-map-gradient-overlay" />
    </div>
  );
};
