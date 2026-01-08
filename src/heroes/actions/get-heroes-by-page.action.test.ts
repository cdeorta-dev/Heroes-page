import { beforeEach, describe, expect, test } from "vitest";
import { getHeroesByPageAction } from "./get-heroes-by-page.action";
import AxiosMockAdapter from 'axios-mock-adapter';
import { heroApi } from "../api/hero.api";

const BASE_URL = import.meta.env.VITE_API_URL;
describe('getHeroeByPageAction',()=>{
    // const page= 1
    // const limit = 6
    // const category = 'all'

    const heroesApiMock = new AxiosMockAdapter(heroApi);




    beforeEach(()=>{
        heroesApiMock.reset();
        heroesApiMock.resetHistory();
    });
    test('should return default heroes', async()=>{




        heroesApiMock.onGet('/').reply(200,{
            total:10,
            pages:2,
            heroes:[
                {
                    image:'1.jpeg',

                },
                {
                    image: '2.jpeg',
                },
            ],
        });
        const HeroeResponse =await  getHeroesByPageAction(1
          // page,
          // limit,
          // category
        )
        console.log(HeroeResponse)


        expect(HeroeResponse).toStrictEqual({
  total: 10,
  pages: 2,
  heroes: [
    { image: `${BASE_URL}/images/1.jpeg` },
    { image: `${BASE_URL}/images/2.jpeg` }
  ]
})


    });


    test('should return the correct heroes  when page is not a number',async()=>{
        const responseObject = {
            total:10,
            pages:1,
            heroes:[],
        };
        heroesApiMock.onGet('/').reply(200,responseObject);
         heroesApiMock.resetHistory();

       await getHeroesByPageAction("abc" as unknown as number);
        const params = heroesApiMock.history.get[0].params;
expect(params).toStrictEqual({ limit: 6, offset: 0, category: 'all' });
        console.log(params)
    });

        test('should return the correct heroes  when page is string number',async()=>{
        const responseObject = {
            total:10,
            pages:1,
            heroes:[],
        };
        heroesApiMock.onGet('/').reply(200,responseObject);
         heroesApiMock.resetHistory();

       await getHeroesByPageAction("5" as unknown as number);
        const params = heroesApiMock.history.get[0].params;
expect(params).toStrictEqual({ limit: 6, offset: 24, category: 'all' });
        console.log(params)
    });

     test('should call the api with correct params',async()=>{
        const responseObject = {
            total:10,
            pages:1,
            heroes:[],
        };
        heroesApiMock.onGet('/').reply(200,responseObject);
         heroesApiMock.resetHistory();

        await getHeroesByPageAction(2,10,`heroes`);
        const params = heroesApiMock.history.get[0].params;
        expect(params).toStrictEqual({  "category": "heroes",
   "limit": 10,
   "offset": 10, });
        console.log(params)
    });



    


})