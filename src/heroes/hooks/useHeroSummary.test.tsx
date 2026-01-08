import { describe, expect, test, vi } from "vitest";
import { useHeroSummary } from "./useHeroSummary";
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { getSummaryAction } from "../actions/get-summary.action";
import type { SummaryInformationResponse } from "../types/summary-information.response";



vi.mock( '../actions/get-summary.action',()=>({
    getSummaryAction: vi.fn(),

})   );

const mockGetSummaryAction = vi.mocked(getSummaryAction);







const tanStackCustomProvider = () =>{
    const queryClient = new QueryClient({
        defaultOptions:{
            queries:{
                retry: false
            }
        }
    })


    return ({children}: PropsWithChildren) =>(
        <QueryClientProvider client ={queryClient}>{children}</QueryClientProvider>
    )
}



describe('useHeroSummary',()=>{
    test('should return the initial state((isLoading)',async()=>{



        const {result}= renderHook(()=>useHeroSummary(), {
             wrapper: tanStackCustomProvider()
        })







      //  const summaryInformation = await useHeroSummary() 
        expect(result.current.isLoading).toBe(true);
         expect(result.current.isError).toBe(false);
         expect(result.current.data).toBe(undefined);
         expect(result.current.data).toBeUndefined();
    })

    test('should return success state with data whan API call succeds',async()=>{
    

        const mockSummaryData= {
           totalHeroes:10,
           strongestHero:{
            id:'1',
            name:'Superman',
           },
           smartestHero:{
            id:'2',
            name: 'Batman',

           },
           heroCount:18,
           villainCount:7,

        } as SummaryInformationResponse;

        mockGetSummaryAction.mockResolvedValue(mockSummaryData);
            const {result} = renderHook(() => useHeroSummary(),{
            wrapper: tanStackCustomProvider(),
        });

//esto es para que espere el hook que termine de cargar, lo anterior obserba que se monte correctamente y esto
// es para que ver si termina totalmente de ejecutarse el hook
        await waitFor(() =>{
            expect(result.current.isSuccess).toBe(true);
           
        })

      
        expect(result.current.isError).toBe(false)
        expect(mockGetSummaryAction).toHaveBeenCalled();
        // expect(mockGetSummaryAction).toHaveBeenCalledWith();
    });


    test('should return error state when API call fails',async()=>{
        const mockError = new Error('Failed to fetch summary');
               mockGetSummaryAction.mockRejectedValue(mockError);
            const {result} = renderHook(() => useHeroSummary(),{
            wrapper: tanStackCustomProvider(),
        });

  await waitFor(() =>{
            expect(result.current.isError).toBe(true);
           
        })

      expect(result.current.error).toBeDefined();
      expect(result.current.isLoading).toBe(false);
      expect(mockGetSummaryAction).toHaveBeenCalled();
      expect(mockGetSummaryAction).toHaveBeenCalledTimes(3);
     expect(result.current.error?.message).toBe('Failed to fetch summary')
    })


});