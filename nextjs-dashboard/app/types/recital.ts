//types/recital.ts
export type Recital = {
  id: number;
  name: string;
  
  date: Date; 
  price: number;
  info?: string | null;

  artist: {
    id:   number;
    name: string;
  };
  venue: {
    id:   number;
    name: string;
    city?: string | null;
  };
  images: Photo[];
};
export type Photo = {
  id: number;
  url: string;
  ratio?: string | null;
  height?: number | null;
  width?: number | null;
  fallback?: boolean | null;
};
