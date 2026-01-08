import { useQuery } from '@tanstack/react-query';
import { searchHeroesAction } from '../actions/search-hero.action';

export const useSearchHero = (name:string,strength:string) => {
    
  return useQuery({
    queryKey: ['search-hero',{name,strength}],
    queryFn: ()=>searchHeroesAction({name,strength}),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
