import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer } from 'react-leaflet';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '@/firebase';
import { Button } from '@nextui-org/react';

interface GpxListProps {
  gpxFiles: Array<GpxFile>;
}

type GpxFile = {
  name: string;
  fileLocation: string;
};

const DynamicMapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), {
  ssr: false,
});

const GpxList = ({ gpxFiles }: GpxListProps) => {
  const mapRefs = useRef<Array<L.Map | null>>([]);

  useEffect(() => {
    const fetchGpxData = async () => {
        try {
          const promises = gpxFiles.map(async (gpx, index) => {
            console.log(gpx)
            const { fileLocation } = gpx;
            const url = await getDownloadURL(ref(storage, fileLocation));
            const response = await fetch(url);
            const gpxData = await response.text();
            console.log(response, gpxData);

            // Load Leaflet dynamically
            const L = await import('leaflet');
            await import('leaflet/dist/leaflet.css');

            // Use react-leaflet to create the map
            if (mapRefs.current[index]) {
              mapRefs.current[index].eachLayer((layer) => {
                // Remove existing layers (if any)
                mapRefs.current[index].removeLayer(layer);
              });

              const gpxLayer = L.geoJSON(JSON.parse(gpxData)).addTo(mapRefs.current[index]);

              // Fit the map bounds to the GPX track
              mapRefs.current[index].fitBounds(gpxLayer.getBounds());
            }
          });

          await Promise.all(promises);
        } catch (error) {
          console.error('Error fetching the GPX files:', error);
        }
    };

    fetchGpxData();
  }, [gpxFiles]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {gpxFiles.map((gpx, index) => (
        <div key={gpx.name} className="flex flex-col items-center gap-2">
          <h2 className="font-bold">{gpx.name}</h2>
          {/* <DynamicMapContainer
            center={[0, 0]}
            zoom={2}
            style={{ height: '400px', width: '100%' }}
            whenCreated={(map: L.Map) => (mapRefs.current[index] = map)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </DynamicMapContainer> */}
          <Button color="primary" fullWidth>
            Download
          </Button>
        </div>
      ))}
    </div>
  );
};

export default GpxList;