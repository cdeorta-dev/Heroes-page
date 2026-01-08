import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import SearchPage from "./SearchPage";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { searchHeroesAction } from "@/heroes/actions/search-hero.action";
import type { Hero } from "@/heroes/types/hero.interface";


vi.mock('@/heroes/components/HeroGrid',()=>({
    HeroGrid:({heroes}: {heroes: Hero[]})=>(<div data-testid="hero-grid">{
        heroes.map(hero=>(
        <div key={hero.id}>{hero.name}</div>
        ))
    }</div>)
}))
vi.mock( "@/heroes/actions/search-hero.action")
const mockSearchHeroesAction = vi.mocked(searchHeroesAction)

vi.mock('./ui/SearchControls',()=>({
    SearchControls:() => <div data-testid="search-controls"></div>
}))




vi.mock('@/components/custom/CustomJumbotron',()=>({
    CustomJumbotron:()=><div data-testid='custom-jumbotron'></div>
}))
//const moskCustomJumbotron = vi.mocked(CustomJumbotron)



const queryClient = new QueryClient()
const renderHSearhPage= (initialEntries: string[]=['/']) =>{
    return render(
        <MemoryRouter initialEntries={initialEntries}>
         
            <QueryClientProvider client={queryClient}>
              
            <SearchPage/>
          
            </QueryClientProvider>
  
        </MemoryRouter>
    )
}


describe('SerchPage',()=>{

    beforeEach(()=>{
        vi.clearAllMocks();
    })
    test('should render SearchPage with default values',()=>{
    const {container} = renderHSearhPage();
       expect(mockSearchHeroesAction).toHaveBeenCalledWith(
        {
        name:"",
        strength:"",
       }
    );
    
    expect(container).toMatchSnapshot();
    })

    test('should call search action with name parameter', ()=>{
        const {container} = renderHSearhPage(['/search?name=superman']);
        expect(mockSearchHeroesAction).toHaveBeenCalledWith({
            name:"superman",
            strength:"",
        });
        expect(container).toMatchSnapshot();
    })
    test('should call search action with strength parameter', ()=>{
        const {container} =     renderHSearhPage(['/search?strength=5']);
        expect(mockSearchHeroesAction).toHaveBeenCalledWith(
        {
        name:"",
        strength:"5",
       });
        expect(container).toMatchSnapshot();
    })

    test('should call search action with strength  and name parameter', ()=>{
        const {container} =     renderHSearhPage(['/search?strength=8&name=batman']);
        expect(mockSearchHeroesAction).toHaveBeenCalledWith(
        {
        name:"batman",
        strength:"8",
       });
        expect(container).toMatchSnapshot();
    })
    test('should render HeroGrid with search result',async()=>{
        const mockHeroes = [
        {id:'1', name:'Clark Kent'}as unknown as Hero,
        {id:'2', name:'Bruce Wayne'}as unknown as Hero,
        ]
        mockSearchHeroesAction.mockResolvedValue(mockHeroes);
        renderHSearhPage();
        await waitFor(() =>{
            expect(screen.getByText('Clark Kent')).toBeDefined();
            expect(screen.getByText('Bruce Wayne')).toBeDefined();
        })
       
    })

})