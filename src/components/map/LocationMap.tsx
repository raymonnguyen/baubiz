'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Product } from '../marketplace/ProductCard';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import L from 'leaflet';

// Create custom marker icons to avoid the missing icon issue
const defaultIcon = L.icon({
  iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAApCAYAAADAk4LOAAAFgUlEQVR4Aa1XA5BjWRTN2oW17d3YaZtr2962HUzbDNpjszW24mRt28p47v7zq/bXZtrp/lWnXr337j3nPCe85NcypgSFdugCpW5YoDAMRaIMqRi6aKq5E3YqDQO3qAwjVWrD8Ncq/RBpykd8oZUb/kaJutow8r1aP9II0WmLKLIsJyv1w/kqw9Ch2MYdB++12Onxee/QMwvf4/Dk/Lfp/i4nxTXtOoQ4pW5Aj7wpici1A9erdAN2OH64x8OSP9j3Ft3b7aWkTg/Fm91siTra0f9on5sQr9INejH6CUUUpavjFNq1B+Oadhxmnfa8RfEmN8VNAsQhPqF55xHkMzz3jSmChWU6f7/XZKNH+9+hBLOHYozuKQPxyMPUKkrX/K0uWnfFaJGS1QPRtZsOPtr3NsW0uyh6NNCOkU3Yz+bXbT3I8G3xE5EXLXtCXbbqwCO9zPQYPRTZ5vIDXD7U+w7rFDEoUUf7ibHIR4y6bLVPXrz8JVZEql13trxwue/uDivd3fkWRbS6/IA2bID4uk0UpF1N8qLlbBlXs4Ee7HLTfV1j54APvODnSfOWBqtKVvjgLKzF5YdEk5ewRkGlK0i33Eofffc7HT56jD7/6U+qH3Cx7SBLNntH5YIPvODnyfIXZYRVDPqgHtLs5ABHD3YzLuespb7t79FY34DjMwrVrcTuwlT55YMPvOBnRrJ4VXTdNnYug5ucHLBjEpt30701A3Ts+HEa73u6dT3FNWwflY86eMHPk+Yu+i6pzUpRrW7SNDg5JHR4KapmM5Wv2E8Tfcb1HoqqHMHU+uWDD7zg54mz5/2BSnizi9T1Dg4QQXLToGNCkb6tb1NU+QAlGr1++eADrzhn/u8Q2YZhQVlZ5+CAOtqfbhmaUCS1ezNFVm2imDbPmPng5wmz+gwh+oHDce0eUtQ6OGDIyR0uUhUsoO3vfDmmgOezH0mZN59x7MBi++WDL1g/eEiU3avlidO671bkLfwbw5XV2P8Pzo0ydy4t2/0eu33xYSOMOD8hTf4CrBtGMSoXfPLchX+J0ruSePw3LZeK0juPJbYzrhkH0io7B3k164hiGvawhOKMLkrQLyVpZg8rHFW7E2uHOL888IBPlNZ1FPzstSJM694fWr6RwpvcJK60+0HCILTBzZLFNdtAzJaohze60T8qBzyh5ZuOg5e7uwQppofEmf2++DYvmySqGBuKaicF1blQjhuHdvCIMvp8whTTfZzI7RldpwtSzL+F1+wkdZ2TBOW2gIF88PBTzD/gpeREAMEbxnJcaJHNHrpzji0gQCS6hdkEeYt9DF/2qPcEC8RM28Hwmr3sdNyht00byAut2k3gufWNtgtOEOFGUwcXWNDbdNbpgBGxEvKkOQsxivJx33iow0Vw5S6SVTrpVq11ysA2Rp7gTfPfktc6zhtXBBC+adRLshf6sG2RfHPZ5EAc4sVZ83yCN00Fk/4kggu40ZTvIEm5g24qtU4KjBrx/BTTH8ifVASAG7gKrnWxJDcU7x8X6Ecczhm3o6YicvsLXWfh3Ch1W0k8x0nXF+0fFxgt4phz8QvypiwCCFKMqXCnqXExjq10beH+UUA7+nG6mdG/Pu0f3LgFcGrl2s0kNNjpmoJ9o4B29CMO8dMT4Q5ox8uitF6fqsrJOr8qnwNbRzv6hSnG5wP+64C7h9lp30hKNtKdWjtdkbuPA19nJ7Tz3zR/ibgARbhb4AlhavcBebmTHcFl2fvYEnW0ox9xMxKBS8btJ+KiEbq9zA4RthQXDhPa0T9TEe69gWupwc6uBUphquXgf+/FrIjweHQS4/pduMe5ERUMHUd9xv8ZR98CxkS4F2n3EUrUZ10EYNw7BWm9x1GiPssi3GgiGRDKWRYZfXlON+dfNbM+GgIwYdwAAAAASUVORK5CYII=',
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  popupAnchor: [0, -41],
  shadowUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAApCAQAAAACach9AAACMUlEQVR4Ae3ShY7jQBAE0Aoz/f9/HTMzhg1zrdKUrJbdx+Kd2nD8VNudfsL/Th////KTl3KzN7iXnb2QK+RK2QJmTHa2kJVyMxoi5ULWCUQiJSHSTaGpU4hKCdE/hKR4KanIB4MMgcBHQ/pXicAXQ5KfgwjxUDgf6YBgITxYiEaOsEGYeIhGz7BRGIeKDZGSEGGbMGJjDhKEhPwasVgSMt6GMK0bYcu4Y8dcdYhwja0YJ9SKE+uTceSjI+wWtuADRoWFuNhggmF9hhZRosLGQUKiHGFX9KlwMZstLbTEJN2GEnLSapBXjyFJKwEHC+9x8vICwm1YAk0BwwXYIE+WVItD2Texas1Beui/F+ZasJt2P6outa12L3d9mzEG3r6H9/l3CNAADCgABCgABCjySJgYFYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABS9Nw35xAhQAEgQAEgQAEgQAEgQAEgQAEgQAEgQAEgQAEgQAEAvnDN9cwadIva+1zQAE98ZgU064LmOKxnhY3GaO7H1uawjubkS9cls7Y0m1Um5zZjC/E84c0iZ3rsC9xNdCT9+6g+62omJ7u2FhiGOGP7csgOcdXYzVAF75gN4MbrXgodTldBWLQjxqDU8g+ioQO6c0cTzstvQtfudPdMr79pmzH3xzXrAE9xhiOmGvYhxiGOkcI4xDjEOMQ4xDjEOMQ4xDjEOMQ4xDjEOMQ4xDjEOFzTdZ0VJ0WdFyfFnUTDRps/+44PPvwDVX8zSvDXfvvKCQAAAABJRU5ErkJggg==',
  shadowSize: [41, 41]
});

// Optional: Create a user location icon
const userIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwNjZjYyIgd2lkdGg9IjM2cHgiIGhlaWdodD0iMzZweCI+PHBhdGggZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVhMi41IDIuNSAwIDAgMS0wIC4wMSAyLjUgMi41IDAgMCAxLTIuNS0yLjUxIDIuNSAyLjUgMCAwIDEgMi41LTIuNSAyLjUgMi41IDAgMCAxIDIuNSAyLjVBMi41IDIuNSAwIDAgMSAxMiAxMS41eiIvPjwvc3ZnPg==',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

interface LocationMapProps {
  products: Product[];
  centerLocation?: [number, number]; // [latitude, longitude]
  initialZoom?: number;
  userLocation?: [number, number];
}

const LocationMap = ({
  products,
  centerLocation = [40.7128, -74.006], // Default to NYC coordinates
  initialZoom = 9,
  userLocation,
}: LocationMapProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-[400px] md:h-[600px] rounded-xl overflow-hidden shadow-soft"
    >
      <MapContainer
        center={centerLocation as L.LatLngExpression}
        zoom={initialZoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker 
            position={userLocation as L.LatLngExpression} 
            icon={userIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Product markers */}
        {products.map((product) => {
          // In a real app, we would get actual coordinates from the product data
          // For now, we'll generate random coordinates near the center
          const randomOffset = () => (Math.random() - 0.5) * 0.1;
          const markerPosition: [number, number] = [
            centerLocation[0] + randomOffset(),
            centerLocation[1] + randomOffset(),
          ];

          return (
            <Marker 
              key={product.id} 
              position={markerPosition as L.LatLngExpression}
              icon={defaultIcon}
            >
              <Popup>
                <div className="p-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-10 h-10 overflow-hidden rounded-md">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm">{product.title}</h3>
                      <p className="text-primary font-bold text-sm">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                      {product.seller.avatar ? (
                        <Image
                          src={product.seller.avatar}
                          alt={product.seller.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary text-white text-xs">
                          {product.seller.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-xs">
                      {product.seller.name}
                      {product.seller.verified && (
                        <span
                          className="text-secondary ml-1"
                          title="Verified Seller"
                        >
                          ✓
                        </span>
                      )}
                    </span>
                  </div>
                  <Link
                    href={`/marketplace/${product.id}`}
                    className="text-primary text-xs hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Center map on user location if available */}
        {userLocation && <RecenterMap position={userLocation as L.LatLngExpression} />}
      </MapContainer>
    </motion.div>
  );
};

// Helper component to recenter map
interface RecenterMapProps {
  position: L.LatLngExpression;
}

const RecenterMap = ({ position }: RecenterMapProps) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);
  
  return null;
};

export default LocationMap; 