import { describe, expect, test } from "vitest";
import { SearchControls } from "./SearchControls";
import { fireEvent, render, screen } from "@testing-library/react";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

console.log(typeof window.ResizeObserver);
if(typeof window.ResizeObserver === 'undefined')
{
    class ResizeObserver{
        observe(){}
        unobserve(){}
        disconnect(){}
    }
    window.ResizeObserver = ResizeObserver;

}

// const queryClient = new QueryClient()
const renderHSearhControls= (initialEntries: string[]=['/']) =>{
    return render(
        <MemoryRouter initialEntries={initialEntries}>
         
            {/* <QueryClientProvider client={queryClient}> */}
              
           <SearchControls/>
          
            {/* </QueryClientProvider> */}
  
        </MemoryRouter>
    )
}

describe('SearchControl',()=>{
    test('should render SearchControls with default values ',()=>{
     const {container} = renderHSearhControls();
      expect(container).toMatchSnapshot();

    })
    test('should set input value when search param name is set',()=>{
        renderHSearhControls(['/?name=Batman']);

        const input = screen.getByPlaceholderText("Search heroes, villains, powers, teams...")
        expect(input.getAttribute('value')).toBe('Batman')
    })
       test('should change params when input is changed and enter is pressed',()=>{
        renderHSearhControls(['/?name=Batman']);

        const input = screen.getByPlaceholderText("Search heroes, villains, powers, teams...")
        expect(input.getAttribute('value')).toBe('Batman')
        fireEvent.change(input,{target:{value:'Superman'}});
        fireEvent.keyDown(input,{key: 'Enter'});
       
                expect(input.getAttribute('value')).toBe('Superman')
    })

    test('should change params strength when slider is  change',()=>{
        renderHSearhControls(['/?name=Batman&active-accordion=advance-filters']);
        const slider= screen.getByRole('slider');


        // console.log(slider.getAttribute('aria-valuenow'))

        expect(slider.getAttribute('aria-valuenow')).toBe('0')

        fireEvent.keyDown(slider,{key:'ArrowRight'})
         console.log(slider.getAttribute('aria-valuenow'))
    })
    test('should accordion be open when active-accordion param is set',()=>{
         renderHSearhControls(['/?name=Batman&active-accordion=advance-filters']);

         const accordion = screen.getByTestId('accordion');
         const accordionItem = accordion.querySelector('div')



         screen.debug(accordion)

         expect(accordionItem?.getAttribute('data-state')).toBe('open')
        
    
    })


    test('should accordion be close when active-accordion param is  not set',()=>{
         renderHSearhControls(['/?name=Batman']);

         const accordion = screen.getByTestId('accordion');
         const accordionItem = accordion.querySelector('div')



         screen.debug(accordion)

         expect(accordionItem?.getAttribute('data-state')).toBe('closed')
        
    
    })
})