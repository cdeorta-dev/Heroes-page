import { beforeEach, describe, expect, test, vi } from "vitest";
import { usePaginatedHero } from "./usePaginatedHero";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getHeroesByPageAction } from "../actions/get-heroes-by-page.action";
import type { PropsWithChildren } from "react";



vi.mock('../actions/get-heroes-by-page.action',()=>({
    getHeroesByPageAction: vi.fn()
}))

const mockGetHeroesByPageAction = vi.mocked(getHeroesByPageAction);
   const queryClient = new QueryClient({
        defaultOptions:{
            queries:{
                retry: false
            }
        }
    })










const tanStackCustomProvider = () =>{
 


    return ({children}: PropsWithChildren) =>(
        <QueryClientProvider client ={queryClient}>{children}</QueryClientProvider>
    )
}


describe('usePaginatedHero',()=>{
    beforeEach(()=>{
        vi.clearAllMocks();
        queryClient.clear();
    });



    test('Should return the initial state(isLoading)',()=>{
        const{ result} = renderHook(() => usePaginatedHero(1,6),{
            wrapper: tanStackCustomProvider(),
        });
         expect(result.current.isLoading).toBe(true);
         expect(result.current.isError).toBe(false);
         expect(result.current.data).toBe(undefined);
         expect(result.current.data).toBeUndefined();
        

    })
    test('should call getHeroesByPageActions with argunments', async()=>{
         


        const mosckHeroesData = {
            total:20,
            pages:4,
            heroes:[],
        };

       
        mockGetHeroesByPageAction.mockResolvedValue(mosckHeroesData);
        const{ result} = renderHook(() => usePaginatedHero(1,6,'heroesABC'),{
            wrapper: tanStackCustomProvider(),
        });


        await waitFor(()=>{
            expect(result.current.isSuccess).toBe(true)
        });

        expect(result.current.status).toBe('success');
        expect(mockGetHeroesByPageAction).toHaveBeenCalled();
        expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1,6,'heroesABC');
    });


      test('should return success state with data when API call succeds', async()=>{
         


        const mosckHeroesData = {
            total:20,
            pages:4,
            heroes:[],
        };

        mockGetHeroesByPageAction.mockResolvedValue(mosckHeroesData);
 const{ result} = renderHook(() => usePaginatedHero(1,6),{
            wrapper: tanStackCustomProvider(),
        });


        await waitFor(()=>{
            expect(result.current.isSuccess).toBe(true)
        });
        expect(result.current.status).toBe('success');

        expect(mockGetHeroesByPageAction).toHaveBeenCalled();
        expect(mockGetHeroesByPageAction).toHaveBeenCalledWith(1,6,'all');
    })
})