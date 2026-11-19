import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  APIProvider,
  Map as GoogleMap2D,
  AdvancedMarker,
  InfoWindow,
  Pin,
  Polyline,
  useMapsLibrary,
  useApiIsLoaded,
  useApiLoadingStatus,
  APILoadingStatus,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Map3D,
  Marker3D,
  Polyline3D,
  MapMode,
  GestureHandling,
  Map3DRef,
  Map3DCameraChangedEvent,
} from '@vis.gl/react-google-maps/3d';
import { ActiveTab } from '../types';
import {
  Compass,
  Play,
  Pause,
  RotateCw,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  Star,
  Clock,
  ExternalLink,
  Layers,
  Eye,
  Plus,
  Minus,
  Globe,
  Mountain,
  Landmark,
  UtensilsCrossed,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  ArrowLeft,
  X,
} from 'lucide-react';

interface Tour3DViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

type TourThemeId = 'destaques' | 'natureza' | 'cultura' | 'gastronomia';

interface LandmarkStop {
  id: string;
  name: string;
  categoryLabel: string;
  location: { lat: number; lng: number };
  rating: number | null;
  userRatingCount: number | null;
  photoUrl: string | null;
  placeInstance: google.maps.places.Place;
}

interface LandmarkDetails {
  formattedAddress: string | null;
  editorialSummary: string | null;
  isOpenNowText: string | null;
  weekdayDescriptions: string[];
  googleMapsURI: string | null;
  photoUrls: string[];
  topReviewText: string | null;
  topReviewAuthor: string | null;
}

interface RouteSummary {
  originName: string;
  destinationName: string;
  distanceText: string;
  durationText: string;
  path: google.maps.LatLngLiteral[];
}

const TOUR_THEMES: {
  id: TourThemeId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  queries: string[];
}[] = [
  {
    id: 'destaques',
    label: 'Pontos Icônicos',
    icon: Sparkles,
    queries: [
      'pontos turísticos em Mairiporã SP',
      "Pico do Olho D'Água Mairiporã SP",
      'Represa Paulo de Paiva Castro Mairiporã SP',
      'Parque Estadual da Cantareira Mairiporã SP',
      'Parque Linear Mairiporã SP',
      'Igreja Matriz Nossa Senhora do Desterro Mairiporã SP',
    ],
  },
  {
    id: 'natureza',
    label: 'Serra & Mirantes',
    icon: Mountain,
    queries: [
      'mirantes parques ecológicos cachoeiras Mairiporã SP',
      'trilhas Serra da Cantareira Mairiporã SP',
    ],
  },
  {
    id: 'cultura',
    label: 'História & Fé',
    icon: Landmark,
    queries: [
      'igrejas históricas praças patrimônio cultural Mairiporã SP',
    ],
  },
  {
    id: 'gastronomia',
    label: 'Gastronomia Serrana',
    icon: UtensilsCrossed,
    queries: [
      'restaurantes cafés mirantes Serra da Cantareira Mairiporã SP',
    ],
  },
];

const ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

declare global {
  interface Window {
    __CONECTA_CONFIG__?: {
      GOOGLE_MAPS_API_KEY?: string;
    };
  }
}

function getGoogleMapsApiKey(): string {
  const fromEnv =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    (typeof process !== 'undefined' ? process.env.GOOGLE_MAPS_API_KEY : undefined) ||
    '';
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv.trim();
  }
  if (typeof window !== 'undefined') {
    const fromRuntime = window.__CONECTA_CONFIG__?.GOOGLE_MAPS_API_KEY;
    if (fromRuntime && fromRuntime.trim().length > 0) {
      return fromRuntime.trim();
    }
  }
  return '';
}

function detectWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

function isQuotaError(err: unknown): boolean {
  const text = err instanceof Error ? err.message : String(err);
  return (
    text.includes('RESOURCE_EXHAUSTED') ||
    text.includes('OVER_QUERY_LIMIT') ||
    text.includes('OverQuotaMapError') ||
    text.includes('QuotaExceededError') ||
    text.includes('429')
  );
}

function formatDurationPtBr(durationMillis?: number | null): string {
  if (!durationMillis || durationMillis <= 0) return '—';
  const totalMinutes = Math.max(1, Math.round(durationMillis / 60000));
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

function formatDistancePtBr(distanceMeters?: number | null): string {
  if (!distanceMeters || distanceMeters <= 0) return '—';
  if (distanceMeters < 1000) return `${Math.round(distanceMeters)} m`;
  return `${(distanceMeters / 1000).toFixed(1).replace('.', ',')} km`;
}

export const Tour3DView: React.FC<Tour3DViewProps> = ({ onNavigate }) => {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    return (
      <div className="min-h-[75dvh] bg-[#0B1611] text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-[#12221A] border border-white/15 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFD700]/15 text-[#FFD700] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Tour 3D aguardando configuração do Google Maps
          </h2>
          <p className="text-sm text-white/75 leading-relaxed">
            A chave da Google Maps Platform não está configurada neste servidor. Em hospedagem
            externa (como HostGator), edite o arquivo <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#66CDAA] font-mono text-xs">config.js</code> na
            pasta <code className="px-1.5 py-0.5 rounded bg-white/10 text-white/90 font-mono text-xs">public_html</code> e
            informe sua chave do Google Cloud com restrição para este domínio.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008f5a] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o Início</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      version="alpha"
      libraries={['maps3d', 'marker', 'places', 'routes']}
      language="pt-BR"
      region="BR"
    >
      <Tour3DExperience onNavigate={onNavigate} />
    </APIProvider>
  );
};

const Tour3DExperience: React.FC<Tour3DViewProps> = ({ onNavigate }) => {
  const isApiLoaded = useApiIsLoaded();
  const apiStatus = useApiLoadingStatus();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');
  const map2d = useMap('mairipora-2d-fallback');
  const map3dRef = useRef<Map3DRef>(null);

  const [supportsWebGL2] = useState<boolean>(() => detectWebGL2());
  const [viewMode, setViewMode] = useState<'3d' | '2d'>(() =>
    detectWebGL2() ? '3d' : '2d'
  );
  const [map3dMode, setMap3dMode] = useState<MapMode>(MapMode.HYBRID);

  // City center resolved dynamically from Google Places API
  const [cityCenter, setCityCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [cityResolving, setCityResolving] = useState(true);

  // Landmarks state
  const [activeTheme, setActiveTheme] = useState<TourThemeId>('destaques');
  const [searchQuery, setSearchQuery] = useState('');
  const [landmarks, setLandmarks] = useState<LandmarkStop[]>([]);
  const [loadingLandmarks, setLoadingLandmarks] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Selected stop & on-demand details
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [detailsCache, setDetailsCache] = useState<Record<string, LandmarkDetails>>({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(true);

  // Guided Tour & Camera Animation state
  const [isAutoTourPlaying, setIsAutoTourPlaying] = useState(false);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [cameraHud, setCameraHud] = useState({
    heading: 24,
    tilt: 62,
    range: 3200,
  });

  // 3D / 2D Route computation state
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [computingRoute, setComputingRoute] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Mobile itinerary drawer
  const [mobileListOpen, setMobileListOpen] = useState(false);

  const selectedIndex = landmarks.findIndex((item) => item.id === selectedStopId);
  const selectedStop = selectedIndex >= 0 ? landmarks[selectedIndex] : null;
  const selectedDetails = selectedStop ? detailsCache[selectedStop.id] || null : null;

  // 1. Resolve Mairiporã official center dynamically via Places API (no hardcoded coords)
  useEffect(() => {
    if (!placesLib || cityCenter) return;
    let cancelled = false;

    const resolveCity = async () => {
      setCityResolving(true);
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: 'Mairiporã, São Paulo, Brasil',
          fields: ['id', 'displayName', 'location'],
          language: 'pt-BR',
          region: 'br',
          maxResultCount: 1,
          internalUsageAttributionIds: ATTRIBUTION_IDS,
        });

        if (cancelled) return;
        const first = places?.[0];
        if (first?.location) {
          setCityCenter({
            lat: first.location.lat(),
            lng: first.location.lng(),
          });
        } else {
          setLoadError('Não foi possível localizar Mairiporã no Google Maps.');
        }
      } catch (err) {
        if (cancelled) return;
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setLoadError('Não foi possível carregar os dados geográficos de Mairiporã.');
      } finally {
        if (!cancelled) setCityResolving(false);
      }
    };

    void resolveCity();
    return () => {
      cancelled = true;
    };
  }, [placesLib, cityCenter]);

  // 2. Fetch landmarks for current theme or custom search via Place.searchByText
  const fetchPlacesForQueries = useCallback(
    async (queries: string[]) => {
      if (!placesLib || !cityCenter) return;
      setLoadingLandmarks(true);
      setLoadError(null);
      setRouteSummary(null);
      setRouteError(null);

      try {
        const responses = await Promise.all(
          queries.map((q) =>
            placesLib.Place.searchByText({
              textQuery: q,
              fields: [
                'id',
                'displayName',
                'location',
                'primaryTypeDisplayName',
                'rating',
                'userRatingCount',
                'photos',
              ],
              locationBias: {
                center: cityCenter,
                radius: 18000,
              },
              language: 'pt-BR',
              region: 'br',
              maxResultCount: queries.length > 1 ? 4 : 10,
              internalUsageAttributionIds: ATTRIBUTION_IDS,
            })
          )
        );

        const seenIds: Record<string, boolean> = {};
        const stops: LandmarkStop[] = [];

        for (const res of responses) {
          for (const place of res.places || []) {
            if (!place.id || !place.location || !place.displayName) continue;
            if (seenIds[place.id]) continue;
            seenIds[place.id] = true;

            const photoUri =
              place.photos && place.photos.length > 0
                ? place.photos[0].getURI({ maxWidth: 640, maxHeight: 400 })
                : null;

            stops.push({
              id: place.id,
              name: place.displayName,
              categoryLabel: place.primaryTypeDisplayName || 'Ponto de Interesse',
              location: {
                lat: place.location.lat(),
                lng: place.location.lng(),
              },
              rating: typeof place.rating === 'number' ? place.rating : null,
              userRatingCount:
                typeof place.userRatingCount === 'number' ? place.userRatingCount : null,
              photoUrl: photoUri,
              placeInstance: place,
            });
          }
        }

        const curated = stops.slice(0, 12);
        setLandmarks(curated);
        if (curated.length > 0) {
          setSelectedStopId(curated[0].id);
          setDetailsDrawerOpen(true);
        } else {
          setSelectedStopId(null);
        }
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setLoadError('Não foi possível consultar os pontos turísticos no momento.');
      } finally {
        setLoadingLandmarks(false);
      }
    },
    [placesLib, cityCenter]
  );

  // Load landmarks whenever theme or cityCenter resolves
  useEffect(() => {
    if (!placesLib || !cityCenter) return;
    const theme = TOUR_THEMES.find((t) => t.id === activeTheme) || TOUR_THEMES[0];
    void fetchPlacesForQueries(theme.queries);
  }, [activeTheme, placesLib, cityCenter, fetchPlacesForQueries]);

  // 3. On-demand Place Details fetch when a stop is selected (keeps SKU billing lean)
  useEffect(() => {
    if (!selectedStop || detailsCache[selectedStop.id]) return;
    let cancelled = false;

    const loadDetails = async () => {
      setLoadingDetails(true);
      try {
        await selectedStop.placeInstance.fetchFields({
          fields: [
            'formattedAddress',
            'editorialSummary',
            'regularOpeningHours',
            'googleMapsURI',
            'photos',
            'reviews',
          ],
        });

        if (cancelled) return;
        const p = selectedStop.placeInstance;
        const photoUrls = (p.photos || [])
          .slice(0, 3)
          .map((ph) => ph.getURI({ maxWidth: 800, maxHeight: 500 }));
        const firstReview = p.reviews?.[0];

        const detail: LandmarkDetails = {
          formattedAddress: p.formattedAddress || null,
          editorialSummary: p.editorialSummary || null,
          isOpenNowText: null,
          weekdayDescriptions: p.regularOpeningHours?.weekdayDescriptions || [],
          googleMapsURI: p.googleMapsURI || null,
          photoUrls,
          topReviewText: firstReview?.text || null,
          topReviewAuthor: firstReview?.authorAttribution?.displayName || null,
        };

        setDetailsCache((prev) => ({
          ...prev,
          [selectedStop.id]: detail,
        }));
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
      } finally {
        if (!cancelled) setLoadingDetails(false);
      }
    };

    void loadDetails();
    return () => {
      cancelled = true;
    };
  }, [selectedStop, detailsCache]);

  // 4. Smoothly fly 3D / 2D camera when selectedStop changes
  const flyToStop = useCallback(
    (stop: LandmarkStop, stopIdx?: number) => {
      setIsOrbiting(false);
      if (viewMode === '3d' && map3dRef.current) {
        const headingAngle = ((stopIdx ?? 0) * 42 + 20) % 360;
        map3dRef.current.stopCameraAnimation();
        map3dRef.current.flyCameraTo({
          endCamera: {
            center: {
              lat: stop.location.lat,
              lng: stop.location.lng,
              altitude: 35,
            },
            range: 680,
            heading: headingAngle,
            tilt: 64,
            roll: 0,
          },
          durationMillis: 2400,
        });
      } else if (map2d) {
        map2d.panTo(stop.location);
        map2d.setZoom(16);
      }
    },
    [viewMode, map2d]
  );

  useEffect(() => {
    if (!selectedStop) return;
    flyToStop(selectedStop, selectedIndex);
  }, [selectedStopId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 5. Guided Auto-Tour loop
  useEffect(() => {
    if (!isAutoTourPlaying || landmarks.length === 0) return;

    const timer = window.setInterval(() => {
      setSelectedStopId((prevId) => {
        const idx = landmarks.findIndex((l) => l.id === prevId);
        const nextIdx = idx < 0 || idx >= landmarks.length - 1 ? 0 : idx + 1;
        return landmarks[nextIdx].id;
      });
    }, 6800);

    return () => window.clearInterval(timer);
  }, [isAutoTourPlaying, landmarks]);

  const handleSelectStop = (stop: LandmarkStop) => {
    setIsAutoTourPlaying(false);
    setSelectedStopId(stop.id);
    setDetailsDrawerOpen(true);
    setMobileListOpen(false);
    flyToStop(stop, landmarks.findIndex((l) => l.id === stop.id));
  };

  const handleStepStop = (delta: number) => {
    if (landmarks.length === 0) return;
    setIsAutoTourPlaying(false);
    const currentIdx = selectedIndex >= 0 ? selectedIndex : 0;
    const nextIdx = (currentIdx + delta + landmarks.length) % landmarks.length;
    handleSelectStop(landmarks[nextIdx]);
  };

  const handleOrbitStop = () => {
    if (!selectedStop) return;
    if (viewMode !== '3d' || !map3dRef.current) return;

    if (isOrbiting) {
      map3dRef.current.stopCameraAnimation();
      setIsOrbiting(false);
      return;
    }

    setIsAutoTourPlaying(false);
    setIsOrbiting(true);
    map3dRef.current.flyCameraAround({
      camera: {
        center: {
          lat: selectedStop.location.lat,
          lng: selectedStop.location.lng,
          altitude: 30,
        },
        range: 540,
        heading: cameraHud.heading,
        tilt: 66,
        roll: 0,
      },
      durationMillis: 18000,
      repeatCount: 2,
    });
  };

  const handleOverviewMairipora = () => {
    if (!cityCenter) return;
    setIsAutoTourPlaying(false);
    setIsOrbiting(false);
    if (viewMode === '3d' && map3dRef.current) {
      map3dRef.current.stopCameraAnimation();
      map3dRef.current.flyCameraTo({
        endCamera: {
          center: {
            lat: cityCenter.lat,
            lng: cityCenter.lng,
            altitude: 120,
          },
          range: 5800,
          heading: 18,
          tilt: 52,
          roll: 0,
        },
        durationMillis: 2400,
      });
    } else if (map2d) {
      map2d.panTo(cityCenter);
      map2d.setZoom(13);
    }
  };

  const handleAdjustRange = (factor: number) => {
    if (viewMode === '3d' && map3dRef.current?.map3d) {
      const m3d = map3dRef.current.map3d;
      const currentRange = m3d.range || cameraHud.range;
      const currentCenter = m3d.center || (selectedStop ? { ...selectedStop.location, altitude: 30 } : cityCenter ? { ...cityCenter, altitude: 60 } : undefined);
      if (!currentCenter) return;
      const nextRange = Math.max(220, Math.min(18000, currentRange * factor));
      map3dRef.current.flyCameraTo({
        endCamera: {
          center: currentCenter,
          range: nextRange,
          heading: m3d.heading || cameraHud.heading,
          tilt: m3d.tilt || cameraHud.tilt,
          roll: 0,
        },
        durationMillis: 500,
      });
    } else if (map2d) {
      const z = map2d.getZoom() || 14;
      map2d.setZoom(factor < 1 ? Math.min(20, z + 1) : Math.max(10, z - 1));
    }
  };

  const handleAdjustTilt = () => {
    if (viewMode !== '3d' || !map3dRef.current?.map3d) return;
    const m3d = map3dRef.current.map3d;
    const currentTilt = m3d.tilt ?? 62;
    const nextTilt = currentTilt > 70 ? 35 : currentTilt < 45 ? 65 : 75;
    const currentCenter = m3d.center;
    if (!currentCenter) return;
    map3dRef.current.flyCameraTo({
      endCamera: {
        center: currentCenter,
        range: m3d.range || 800,
        heading: m3d.heading || 20,
        tilt: nextTilt,
        roll: 0,
      },
      durationMillis: 700,
    });
  };

  const handleComputeRoute = async () => {
    if (!routesLib || !selectedStop || !cityCenter) return;
    setComputingRoute(true);
    setRouteError(null);

    const prevStop = selectedIndex > 0 ? landmarks[selectedIndex - 1] : null;
    const originCoords = prevStop ? prevStop.location : cityCenter;
    const originName = prevStop ? prevStop.name : 'Centro de Mairiporã';

    // Avoid routing from identical point
    if (
      Math.abs(originCoords.lat - selectedStop.location.lat) < 0.0001 &&
      Math.abs(originCoords.lng - selectedStop.location.lng) < 0.0001
    ) {
      setRouteError('Selecione uma parada seguinte para traçar o trajeto até ela.');
      setComputingRoute(false);
      return;
    }

    try {
      const { routes } = await routesLib.Route.computeRoutes({
        origin: originCoords,
        destination: selectedStop.location,
        travelMode: 'DRIVING',
        fields: ['path', 'distanceMeters', 'durationMillis', 'localizedValues'],
        language: 'pt-BR',
        region: 'br',
        internalUsageAttributionIds: ATTRIBUTION_IDS,
      });

      const route = routes?.[0];
      if (!route || !route.path || route.path.length === 0) {
        setRouteError('Não foi possível calcular uma rota rodoviária entre estes pontos.');
        return;
      }

      const pathCoords: google.maps.LatLngLiteral[] = route.path.map((pt) => ({
        lat: pt.lat,
        lng: pt.lng,
      }));

      setRouteSummary({
        originName,
        destinationName: selectedStop.name,
        distanceText:
          route.localizedValues?.distance || formatDistancePtBr(route.distanceMeters),
        durationText:
          route.localizedValues?.duration || formatDurationPtBr(route.durationMillis),
        path: pathCoords,
      });
    } catch (err) {
      if (isQuotaError(err)) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
      setRouteError('Não foi possível traçar a rota no momento.');
    } finally {
      setComputingRoute(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setIsAutoTourPlaying(false);
    void fetchPlacesForQueries([`${q} em Mairiporã SP`]);
  };

  const handleCamera3DChange = useCallback((ev: Map3DCameraChangedEvent) => {
    setCameraHud({
      heading: Math.round(ev.detail.heading),
      tilt: Math.round(ev.detail.tilt),
      range: Math.round(ev.detail.range),
    });
  }, []);

  if (apiStatus === APILoadingStatus.FAILED || apiStatus === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="min-h-[75dvh] bg-[#0B1611] text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-[#12221A] border border-white/15 rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Falha ao inicializar Google Maps 3D</h2>
          <p className="text-sm text-white/75 leading-relaxed">
            Não foi possível autenticar ou carregar a biblioteca Google Maps Platform nesta página.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A86B] hover:bg-[#008f5a] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o Portal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      aria-label="Tour 3D Interativo de Mairiporã"
      className="relative w-full h-[calc(100dvh-76px)] md:h-[calc(100dvh-86px)] min-h-[600px] bg-[#0B1611] overflow-hidden select-none"
    >
      {/* Full-bleed Map Canvas (3D Photorealistic by default, 2D interactive fallback) */}
      {isApiLoaded && cityCenter ? (
        viewMode === '3d' ? (
          <Map3D
            ref={map3dRef}
            id="mairipora-3d-tour"
            mode={map3dMode}
            gestureHandling={GestureHandling.GREEDY}
            defaultCenter={{
              lat: cityCenter.lat,
              lng: cityCenter.lng,
              altitude: 90,
            }}
            defaultRange={4600}
            defaultHeading={24}
            defaultTilt={60}
            defaultRoll={0}
            onCameraChanged={handleCamera3DChange}
            onError={() => {
              setViewMode('2d');
            }}
            internalUsageAttributionIds={ATTRIBUTION_IDS}
            className="w-full h-full block"
          >
            {landmarks.map((stop, idx) => {
              const isSelected = stop.id === selectedStopId;
              return (
                <Marker3D
                  key={stop.id}
                  position={{
                    lat: stop.location.lat,
                    lng: stop.location.lng,
                    altitude: isSelected ? 42 : 24,
                  }}
                  altitudeMode="RELATIVE_TO_GROUND"
                  extruded
                  title={`${idx + 1}. ${stop.name}`}
                  onClick={() => handleSelectStop(stop)}
                >
                  <Pin
                    background={isSelected ? '#FFD700' : '#00A86B'}
                    borderColor={isSelected ? '#12221A' : '#FFFFFF'}
                    glyphColor={isSelected ? '#12221A' : '#FFFFFF'}
                    glyphText={String(idx + 1)}
                    scale={isSelected ? 1.28 : 1.0}
                  />
                </Marker3D>
              );
            })}

            {routeSummary && routeSummary.path.length > 1 && (
              <Polyline3D
                coordinates={routeSummary.path}
                altitudeMode="CLAMP_TO_GROUND"
                strokeColor="#FFD700"
                strokeWidth={7}
                outerColor="#00553A"
                outerWidth={11}
                drawsOccludedSegments
              />
            )}
          </Map3D>
        ) : (
          <GoogleMap2D
            id="mairipora-2d-fallback"
            mapId="DEMO_MAP_ID"
            defaultCenter={cityCenter}
            defaultZoom={13}
            mapTypeId={map3dMode === MapMode.SATELLITE ? 'satellite' : 'hybrid'}
            gestureHandling="greedy"
            disableDefaultUI
            internalUsageAttributionIds={ATTRIBUTION_IDS}
            className="w-full h-full"
          >
            {landmarks.map((stop, idx) => {
              const isSelected = stop.id === selectedStopId;
              return (
                <AdvancedMarker
                  key={stop.id}
                  position={stop.location}
                  title={stop.name}
                  onClick={() => handleSelectStop(stop)}
                >
                  <Pin
                    background={isSelected ? '#FFD700' : '#00A86B'}
                    borderColor={isSelected ? '#12221A' : '#FFFFFF'}
                    glyphColor={isSelected ? '#12221A' : '#FFFFFF'}
                    glyphText={String(idx + 1)}
                    scale={isSelected ? 1.25 : 1.0}
                  />
                </AdvancedMarker>
              );
            })}

            {routeSummary && routeSummary.path.length > 1 && (
              <Polyline
                path={routeSummary.path}
                strokeColor="#FFD700"
                strokeWeight={5}
                strokeOpacity={0.95}
              />
            )}

            {selectedStop && detailsDrawerOpen && (
              <InfoWindow
                position={selectedStop.location}
                onCloseClick={() => setDetailsDrawerOpen(false)}
              >
                <div className="p-1 text-[#12221A] max-w-[220px]">
                  <p className="font-bold text-sm leading-snug">{selectedStop.name}</p>
                  <p className="text-xs text-[#586B60] mt-0.5">{selectedStop.categoryLabel}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap2D>
        )
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0D1B15] text-white gap-4 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#00A86B]/20 border border-[#00A86B]/40 flex items-center justify-center">
            <Compass className="w-6 h-6 text-[#66CDAA] animate-spin" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight">
              {cityResolving ? 'Localizando Mairiporã na Serra da Cantareira' : 'Carregando cenário 3D'}
            </h2>
            <p className="text-xs text-white/65 max-w-sm">
              Inicializando terreno tridimensional, imagens de satélite e pontos turísticos oficiais via Google Maps Platform.
            </p>
          </div>
        </div>
      )}

      {/* TOP FLOATING BAR: Title, Theme Filters & Quick Search */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 pointer-events-none">
        {/* Left: Title + Theme Tabs */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <div className="bg-[#0C1913]/85 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-2.5 text-white shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#00A86B] flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold leading-tight whitespace-nowrap">
                Tour 3D · Mairiporã
              </h1>
              <p className="text-[11px] text-white/70 whitespace-nowrap">
                Serra da Cantareira · Google Maps 3D
              </p>
            </div>
          </div>

          {/* Theme Filter Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-[#0C1913]/85 backdrop-blur-md border border-white/15 rounded-2xl shadow-xl overflow-x-auto max-w-full">
            {TOUR_THEMES.map((theme) => {
              const Icon = theme.icon;
              const isActive = activeTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTheme(theme.id);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#00A86B] text-white shadow-sm'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{theme.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Search + 3D/2D Mode Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-[#0C1913]/85 backdrop-blur-md border border-white/15 rounded-2xl p-1 shadow-xl flex-1 sm:flex-initial"
          >
            <div className="relative flex items-center flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-white/60 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar local em Mairiporã..."
                className="w-full pl-8 pr-3 py-1.5 bg-transparent text-xs text-white placeholder-white/55 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-[#FFD700] hover:bg-[#f0ca00] text-[#12221A] text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Buscar
            </button>
          </form>

          {/* Toggle 3D / 2D */}
          <div className="flex items-center p-1 bg-[#0C1913]/85 backdrop-blur-md border border-white/15 rounded-2xl shadow-xl shrink-0">
            {supportsWebGL2 && (
              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-white text-[#12221A]'
                    : 'text-white/75 hover:text-white'
                }`}
              >
                3D
              </button>
            )}
            <button
              onClick={() => setViewMode('2d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                viewMode === '2d'
                  ? 'bg-white text-[#12221A]'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              2D
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP LEFT SIDEBAR: Curated Itinerary Stops */}
      <aside className="hidden lg:flex flex-col absolute left-3 top-20 bottom-20 w-80 z-20 bg-[#0C1913]/85 backdrop-blur-md border border-white/15 rounded-2xl text-white shadow-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#66CDAA]">
              Roteiro Interativo
            </h2>
            <p className="text-xs text-white/70 tabular-nums mt-0.5">
              {loadingLandmarks
                ? 'Buscando locais...'
                : `${landmarks.length} pontos encontrados`}
            </p>
          </div>
          <button
            onClick={handleOverviewMairipora}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="Visão panorâmica de Mairiporã"
          >
            Vista Geral
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-white/10">
          {loadingLandmarks ? (
            <div className="p-6 text-center space-y-2 text-xs text-white/70">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#66CDAA]" />
              <p>Carregando pontos turísticos de Mairiporã...</p>
            </div>
          ) : loadError ? (
            <div className="p-5 text-xs text-amber-200 space-y-2">
              <p>{loadError}</p>
            </div>
          ) : landmarks.length === 0 ? (
            <div className="p-6 text-center text-xs text-white/70">
              Nenhum ponto encontrado para esta busca. Tente outro termo em Mairiporã.
            </div>
          ) : (
            landmarks.map((stop, idx) => {
              const isSelected = stop.id === selectedStopId;
              return (
                <button
                  key={stop.id}
                  onClick={() => handleSelectStop(stop)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#00A86B]/25'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#FFD700] text-[#12221A]'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
                      {stop.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-white/65 mt-1 truncate">
                      <span className="truncate">{stop.categoryLabel}</span>
                      {stop.rating !== null && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="inline-flex items-center gap-0.5 text-[#FFD700] font-semibold tabular-nums shrink-0">
                            <Star className="w-3 h-3 fill-current" />
                            {stop.rating.toFixed(1)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* RIGHT SELECTED LANDMARK CARD */}
      {selectedStop && detailsDrawerOpen && (
        <div className="absolute right-3 top-28 xl:top-20 bottom-20 lg:bottom-auto lg:max-h-[calc(100%-170px)] w-[calc(100%-24px)] sm:w-96 z-20 bg-white/95 backdrop-blur-xl border border-[#E2ECE5] rounded-2xl shadow-2xl text-[#12221A] flex flex-col overflow-hidden pointer-events-auto">
          {/* Header Image */}
          <div className="relative h-40 sm:h-44 bg-[#12221A] shrink-0 overflow-hidden">
            {(selectedDetails?.photoUrls?.[0] || selectedStop.photoUrl) ? (
              <img
                src={selectedDetails?.photoUrls?.[0] || selectedStop.photoUrl || ''}
                alt={selectedStop.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#00553A] to-[#12221A] text-white/75 gap-2">
                <Mountain className="w-8 h-8 text-[#66CDAA]" />
                <span className="text-xs font-medium">{selectedStop.name}</span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

            <button
              onClick={() => setDetailsDrawerOpen(false)}
              aria-label="Fechar detalhes da parada"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-4 right-4 text-white">
              <div className="text-[11px] font-medium text-[#66CDAA] flex items-center gap-1.5">
                <span className="tabular-nums">
                  Parada {String(selectedIndex + 1).padStart(2, '0')}
                </span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{selectedStop.categoryLabel}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold leading-snug mt-0.5 line-clamp-2">
                {selectedStop.name}
              </h3>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 overflow-y-auto space-y-3.5 text-sm">
            {/* Rating & Coordinates Summary */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#586B60]">
              {selectedStop.rating !== null && (
                <span className="inline-flex items-center gap-1 font-semibold text-[#12221A] tabular-nums">
                  <Star className="w-3.5 h-3.5 text-[#FFD700] fill-current" />
                  {selectedStop.rating.toFixed(1)}
                  {selectedStop.userRatingCount !== null && (
                    <span className="font-normal text-[#586B60]">
                      ({selectedStop.userRatingCount.toLocaleString('pt-BR')})
                    </span>
                  )}
                </span>
              )}
              {selectedStop.rating !== null && <span aria-hidden="true">·</span>}
              <span className="tabular-nums">
                {selectedStop.location.lat.toFixed(4)}, {selectedStop.location.lng.toFixed(4)}
              </span>
            </div>

            {loadingDetails ? (
              <div className="py-3 flex items-center gap-2 text-xs text-[#586B60]">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00A86B]" />
                <span>Carregando informações do Google Maps...</span>
              </div>
            ) : (
              <>
                {selectedDetails?.editorialSummary && (
                  <p className="text-xs sm:text-sm text-[#12221A] leading-relaxed">
                    {selectedDetails.editorialSummary}
                  </p>
                )}

                {selectedDetails?.formattedAddress && (
                  <div className="flex items-start gap-2 text-xs text-[#586B60]">
                    <MapPin className="w-4 h-4 text-[#00A86B] shrink-0 mt-0.5" />
                    <span>{selectedDetails.formattedAddress}</span>
                  </div>
                )}

                {selectedDetails?.weekdayDescriptions &&
                  selectedDetails.weekdayDescriptions.length > 0 && (
                    <div className="flex items-start gap-2 text-xs text-[#586B60]">
                      <Clock className="w-4 h-4 text-[#00A86B] shrink-0 mt-0.5" />
                      <span>{selectedDetails.weekdayDescriptions[0]}</span>
                    </div>
                  )}

                {selectedDetails?.topReviewText && (
                  <div className="pt-2 border-t border-[#E2ECE5] space-y-1">
                    <p className="text-xs text-[#586B60] italic line-clamp-3">
                      &ldquo;{selectedDetails.topReviewText}&rdquo;
                    </p>
                    {selectedDetails.topReviewAuthor && (
                      <p className="text-[11px] font-medium text-[#12221A]">
                        — {selectedDetails.topReviewAuthor}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Route info banner if computed */}
            {routeSummary && (
              <div className="p-3 rounded-xl bg-[#EBF8F2] border border-[#00A86B]/25 text-xs space-y-1">
                <div className="font-bold text-[#00553A] flex items-center justify-between gap-2">
                  <span>Trajeto calculado</span>
                  <span className="tabular-nums">
                    {routeSummary.distanceText} · {routeSummary.durationText}
                  </span>
                </div>
                <p className="text-[#586B60] truncate">
                  De {routeSummary.originName} até {routeSummary.destinationName}
                </p>
              </div>
            )}

            {routeError && (
              <p className="text-xs text-amber-700 font-medium">{routeError}</p>
            )}

            {/* Interactive Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {viewMode === '3d' && (
                <button
                  onClick={handleOrbitStop}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    isOrbiting
                      ? 'bg-[#FFD700] text-[#12221A]'
                      : 'bg-[#00A86B] hover:bg-[#008f5a] text-white'
                  }`}
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isOrbiting ? 'animate-spin' : ''}`} />
                  <span>{isOrbiting ? 'Parar Órbita' : 'Sobrevoar 360°'}</span>
                </button>
              )}

              <button
                onClick={handleComputeRoute}
                disabled={computingRoute}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#F6FAF7] hover:bg-[#EBF8F2] border border-[#E2ECE5] text-[#00553A] text-xs font-bold transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{computingRoute ? 'Calculando...' : 'Traçar Rota'}</span>
              </button>

              {selectedDetails?.googleMapsURI && (
                <a
                  href={selectedDetails.googleMapsURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2ECE5] hover:border-[#00A86B] text-[#12221A] text-xs font-semibold transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>Ver no Google Maps</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Re-open button if user closed details card */}
      {selectedStop && !detailsDrawerOpen && (
        <button
          onClick={() => setDetailsDrawerOpen(true)}
          className="absolute right-3 bottom-20 z-20 px-4 py-2.5 rounded-xl bg-white text-[#12221A] border border-[#E2ECE5] shadow-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer hover:bg-[#EBF8F2]"
        >
          <Eye className="w-4 h-4 text-[#00A86B]" />
          <span className="truncate max-w-[180px]">{selectedStop.name}</span>
        </button>
      )}

      {/* RIGHT VERTICAL CAMERA CONTROLS (3D / 2D) */}
      <div className="hidden md:flex flex-col gap-1.5 absolute right-3 bottom-20 z-10 pointer-events-auto">
        {!detailsDrawerOpen && (
          <div className="bg-[#0C1913]/85 backdrop-blur-md border border-white/15 rounded-xl p-1 flex flex-col gap-1 shadow-xl">
            <button
              onClick={() => handleAdjustRange(0.7)}
              className="w-9 h-9 rounded-lg hover:bg-white/15 text-white flex items-center justify-center cursor-pointer"
              title="Aproximar câmera"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAdjustRange(1.4)}
              className="w-9 h-9 rounded-lg hover:bg-white/15 text-white flex items-center justify-center cursor-pointer"
              title="Afastar câmera"
            >
              <Minus className="w-4 h-4" />
            </button>
            {viewMode === '3d' && (
              <button
                onClick={handleAdjustTilt}
                className="w-9 h-9 rounded-lg hover:bg-white/15 text-white flex items-center justify-center text-[11px] font-bold tabular-nums cursor-pointer"
                title="Alternar inclinação 3D"
              >
                {cameraHud.tilt}°
              </button>
            )}
            <button
              onClick={() =>
                setMap3dMode((m) =>
                  m === MapMode.HYBRID ? MapMode.SATELLITE : MapMode.HYBRID
                )
              }
              className="w-9 h-9 rounded-lg hover:bg-white/15 text-white flex items-center justify-center cursor-pointer"
              title="Alternar rótulos no satélite"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM FLOATING GUIDED TOUR BAR */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-3 pointer-events-none">
        {/* Mobile Itinerary Drawer Trigger */}
        <button
          onClick={() => setMobileListOpen(!mobileListOpen)}
          className="lg:hidden pointer-events-auto px-3.5 py-2.5 rounded-2xl bg-[#0C1913]/90 backdrop-blur-md border border-white/15 text-white text-xs font-bold shadow-xl inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <MapPin className="w-4 h-4 text-[#FFD700]" />
          <span>Paradas ({landmarks.length})</span>
        </button>

        {/* Centered Cinematic Tour Controls */}
        <div className="mx-auto pointer-events-auto bg-[#0C1913]/90 backdrop-blur-md border border-white/15 rounded-2xl px-2.5 py-1.5 text-white shadow-2xl flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => handleStepStop(-1)}
            disabled={landmarks.length === 0}
            className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
            title="Parada anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsAutoTourPlaying((prev) => !prev)}
            disabled={landmarks.length === 0}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-40 ${
              isAutoTourPlaying
                ? 'bg-[#FFD700] text-[#12221A]'
                : 'bg-[#00A86B] hover:bg-[#008f5a] text-white'
            }`}
          >
            {isAutoTourPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar Tour</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Tour Guiado</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleStepStop(1)}
            disabled={landmarks.length === 0}
            className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
            title="Próxima parada"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {selectedStop && (
            <div className="hidden sm:flex items-center gap-2 pl-2 pr-2 border-l border-white/15 text-xs">
              <span className="text-[#FFD700] font-bold tabular-nums">
                {selectedIndex + 1}/{landmarks.length}
              </span>
              <span className="text-white/90 font-medium truncate max-w-[180px]">
                {selectedStop.name}
              </span>
            </div>
          )}
        </div>

        {/* Right HUD telemetry (Camera altitude/heading) + Layer toggle on desktop */}
        <div className="hidden xl:flex items-center gap-2 pointer-events-auto bg-[#0C1913]/85 backdrop-blur-md border border-white/15 rounded-2xl px-3.5 py-2 text-[11px] text-white/80 shadow-xl tabular-nums">
          {viewMode === '3d' ? (
            <>
              <span>Rumos {cameraHud.heading}°</span>
              <span aria-hidden="true">·</span>
              <span>Inclinação {cameraHud.tilt}°</span>
              <span aria-hidden="true">·</span>
              <span>Distância {cameraHud.range} m</span>
            </>
          ) : (
            <span>Modo Satélite 2D</span>
          )}
          <button
            onClick={() =>
              setMap3dMode((m) =>
                m === MapMode.HYBRID ? MapMode.SATELLITE : MapMode.HYBRID
              )
            }
            className="ml-1 pl-2 border-l border-white/15 text-[#66CDAA] hover:text-white font-semibold cursor-pointer whitespace-nowrap"
          >
            {map3dMode === MapMode.HYBRID ? 'Híbrido' : 'Satélite'}
          </button>
        </div>
      </div>

      {/* MOBILE ITINERARY OVERLAY LIST */}
      {mobileListOpen && (
        <div className="lg:hidden absolute inset-x-3 bottom-16 max-h-[55vh] z-30 bg-[#0C1913]/95 backdrop-blur-xl border border-white/15 rounded-2xl text-white shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#66CDAA]">
              Paradas em Mairiporã
            </span>
            <button
              onClick={() => setMobileListOpen(false)}
              className="p-1 text-white/75 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto divide-y divide-white/10">
            {landmarks.map((stop, idx) => {
              const isSelected = stop.id === selectedStopId;
              return (
                <button
                  key={stop.id}
                  onClick={() => handleSelectStop(stop)}
                  className={`w-full text-left p-3 flex items-center gap-3 cursor-pointer ${
                    isSelected ? 'bg-[#00A86B]/25' : 'hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums shrink-0 ${
                      isSelected ? 'bg-[#FFD700] text-[#12221A]' : 'bg-white/10 text-white'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate">{stop.name}</p>
                    <p className="text-[11px] text-white/65 truncate">{stop.categoryLabel}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
