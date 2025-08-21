import { MapConfiguration, ProjectGeography, MapCoordinates } from '../types/map.types';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Polyline from '@arcgis/core/geometry/Polyline';
import Polygon from '@arcgis/core/geometry/Polygon';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import SimpleFillSymbol from '@arcgis/core/symbols/SimpleFillSymbol';

/**
 * Utility functions for map operations based on project tracking requirements
 */

/**
 * Creates a MapConfiguration object similar to your project documentation
 */
export const createMapConfiguration = (
  zoomLevel: number,
  startLocation: MapCoordinates
): MapConfiguration => {
  return {
    zoomLevel,
    startLocation
  };
};

/**
 * Creates default configurations based on your documentation examples
 */
export const getDefaultConfigurations = () => {
  return {
    interactiveDisplay: createMapConfiguration(9, {
      latitude: 39.481112520084416,
      longitude: -104.48777395663238
    }),
    countiesDisplay: createMapConfiguration(9, {
      latitude: 39.771,
      longitude: -104.981
    })
  };
};

/**
 * Converts project geography data to ESRI graphics
 * Based on the coordinate storage format from your documentation
 */
export const createGraphicFromGeography = (
  geography: ProjectGeography,
  symbolOptions?: {
    color?: number[];
    size?: number;
    width?: number;
  }
): Graphic | null => {
  const { color = [226, 119, 40], size = 8, width = 2 } = symbolOptions || {};

  let geometry;
  let symbol;

  switch (geography.type) {
    case 'Point':
      geometry = new Point({
        longitude: (geography.coordinates as number[])[0],
        latitude: (geography.coordinates as number[])[1]
      });
      symbol = new SimpleMarkerSymbol({
        color,
        size,
        outline: {
          color: [255, 255, 255],
          width: 1
        }
      });
      break;

    case 'LineString':
      geometry = new Polyline({
        paths: [geography.coordinates as number[][]]
      });
      symbol = new SimpleLineSymbol({
        color,
        width
      });
      break;

    case 'Polygon':
      geometry = new Polygon({
        rings: geography.coordinates as number[][][]
      });
      symbol = new SimpleFillSymbol({
        color: [...color, 0.3], // Add transparency
        outline: {
          color,
          width
        }
      });
      break;

    default:
      console.warn(`Unsupported geometry type: ${geography.type}`);
      return null;
  }

  return new Graphic({
    geometry,
    symbol
  });
};

/**
 * Calculates bounding box for a set of coordinates
 * Useful for the ProjectMappedLocationSummary functionality
 */
export const calculateBoundingBox = (coordinates: MapCoordinates[]) => {
  if (coordinates.length === 0) {
    return null;
  }

  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLng = coordinates[0].longitude;
  let maxLng = coordinates[0].longitude;

  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });

  return {
    minLatitude: minLat,
    maxLatitude: maxLat,
    minLongitude: minLng,
    maxLongitude: maxLng
  };
};

/**
 * Converts coordinates from your storage format to ESRI format
 * Based on: "Geographic coordinates in the format: [-104.95528835374222, 39.71692272431555]"
 */
export const convertStoredCoordinatesToMapCoordinates = (
  storedCoordinates: number[]
): MapCoordinates => {
  return {
    longitude: storedCoordinates[0],
    latitude: storedCoordinates[1]
  };
};

/**
 * Converts map coordinates to storage format
 */
export const convertMapCoordinatesToStored = (
  coordinates: MapCoordinates
): number[] => {
  return [coordinates.longitude, coordinates.latitude];
};

/**
 * Creates sample project data similar to your system
 */
export const createSampleProjectData = () => {
  return {
    projectRevisionId: 'sample-123',
    projectId: 'project-456',
    geographies: [
      {
        type: 'Point' as const,
        coordinates: [-104.95528835374222, 39.71692272431555]
      },
      {
        type: 'LineString' as const,
        coordinates: [
          [-104.95, 39.71],
          [-104.94, 39.72],
          [-104.93, 39.73]
        ]
      },
      {
        type: 'Polygon' as const,
        coordinates: [[
          [-104.96, 39.70],
          [-104.94, 39.70],
          [-104.94, 39.72],
          [-104.96, 39.72],
          [-104.96, 39.70]
        ]]
      }
    ] as ProjectGeography[]
  };
};
