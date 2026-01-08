import { createContext, useEffect, useState, type PropsWithChildren } from 'react'
import type { Hero } from '../types/hero.interface'

interface favoriteHeroContext{
    favorites: Hero[];
    favoriteCount: number;
    isFavorite:(hero: Hero) => boolean;
    toggleFavorite: (hero: Hero)=>void;
}


export const FavortiteHeroContext = createContext({} as favoriteHeroContext);


const getFavoriteFromLocalStorage = () : Hero[]=>{
    const favorites = localStorage.getItem('favorites');
   
    return favorites ? JSON.parse(favorites): [];



};



export const FavoriteHeroProvider= ({children}:PropsWithChildren) => {
    const [favorites, setFavorites] = useState<Hero[]>(
        getFavoriteFromLocalStorage());
    
    
    const toggleFavorite = (hero: Hero)=>{
        const heroExist = favorites.find((h) => h.id === hero.id);

        if(heroExist){
            const newFavorites = favorites.filter((h) => h.id != hero.id);
            setFavorites(newFavorites);
            return
        }
        
        setFavorites([...favorites,hero]);
        console.log(favorites)
    }


    useEffect(() =>{
        localStorage.setItem('favorites',JSON.stringify(favorites));
    },[favorites]);
  return (
   <FavortiteHeroContext
    value={{
        favoriteCount: favorites.length,
        favorites: favorites,
       
        isFavorite:(hero:Hero) => favorites.some(h => h.id === hero.id),
        toggleFavorite: toggleFavorite,


    }}
   
   >
        {children}
   </FavortiteHeroContext>
  )
}
