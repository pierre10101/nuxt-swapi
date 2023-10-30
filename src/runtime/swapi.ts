import * as _ from "lodash";
import {
  type IFilm,
  type IPeople,
  type IPlanet,
  type ISpecie,
  type IStarship,
  type IVehicle,
  ResourcesType,
type IPage,
} from "./types";
import { StorageSerializers, useSessionStorage } from '@vueuse/core';
class StarWarsClass<T> {
    private rootUrl: string;

    constructor(resourceType: ResourcesType) {
      this.rootUrl = `https://swapi.dev/api/${resourceType}/`;
    }

    public async getPage(page: number = 1, search?: string) {
      if (search) {
        const cached = useSessionStorage(this.rootUrl, null, {
          serializer: StorageSerializers.object,
        });
      
        if (!cached.value) {
          cached.value = await $fetch(`${this.rootUrl}?page=${page}&search=${search}`)
        } 
      
        return cached.value;
      }
      const cached = useSessionStorage(this.rootUrl, null, {
        serializer: StorageSerializers.object,
      });
    
      if (!cached.value) {
        cached.value = await $fetch(`${this.rootUrl}?page=${page}`)
      } 
    
      return cached.value;
    }

    public async find(predicate: (single: T) => boolean) {
      const { count, results } = await this.getPage();
        const pages = Math.ceil( count / results.length);
        const left = Array.from(
          {
            length: pages - 1,
          },
          (_, i) => this.getPage(2 + i)
        );
        const restResults = await Promise.all(left);
          const startArray = [...results] 
          try {
            const totalResults: T[] = restResults.reduce((prev, current) => {
              return [...prev, ...current.results];
            }, startArray);
    
            return _.filter(totalResults, predicate);
          } catch(error: unknown) {
            return null;
          }
    }

    public async getAll() {
      const { count, results } = await this.getPage();
      const pages = Math.ceil( count / results.length);
      const left = Array.from(
        {
          length: pages - 1,
        },
        (_, i) => this.getPage(2 + i)
      );
      const restResults = await Promise.all(left);
        const startArray = [...results] 
        try {
          const totalResults: T[] = restResults.reduce((prev, current) => {
            return [...prev, ...current.results];
          }, startArray);
          return totalResults
        } catch (error) {
          return null;
        }
    }

    public async findBySearch(predicate: string[]) {
      return (await Promise.all(
        predicate.map((query) => $fetch(`${this.rootUrl}?search=${query}`))
      )).map((item) => item);
    }

    public async findByUrl(urls: string[]) {
      return (await Promise.all(
        urls.map((query) =>  $fetch(query))
      )).map((item) => item);
    }
  }

export const Films = new StarWarsClass<IFilm>(ResourcesType.Films);
export const People = new StarWarsClass<IPeople>(ResourcesType.People);
export const Planets = new StarWarsClass<IPlanet>(ResourcesType.Planets);
export const Species = new StarWarsClass<ISpecie>(ResourcesType.Species);
export const Starships = new StarWarsClass<IStarship>(ResourcesType.Starships);
export const Vehicles = new StarWarsClass<IVehicle>(ResourcesType.Vehicles);

const swApi = {
  Films,
  People,
  Planets,
  Species,
  Starships,
  Vehicles,
};

export type SWApi = typeof swApi;

export default swApi;
