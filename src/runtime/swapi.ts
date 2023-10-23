import * as _ from "lodash";
import {
  type IFilm,
  type IPeople,
  type IPlanet,
  type ISpecie,
  type IStarship,
  type IVehicle,
  ResourcesType,
type CustomSuccessResponse,
type CustomErrorResponse,
type IPage,
} from "./types";

import axios, { type AxiosResponse } from "axios";

async function request<T>(
  url: string
): Promise<CustomSuccessResponse<T> | CustomErrorResponse> {
  const headers = {
    headers: {
      accept: "application/json",
    },
  };

  try {
    const result: AxiosResponse<T> = await axios.get(url, headers);
    if (result.status === 200) {
      return {
        status: result.status,
        data: result.data,
      };
    } else {
      return {
        status: result.status,
        data: null,
        message: result.statusText,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status || 500,
        data: null,
        message: error.message,
      };
    } else {
      throw error;
    }
  }
}

class StarWarsClass<T> {
    private rootUrl: string;

    constructor(resourceType: ResourcesType) {
      this.rootUrl = `https://swapi.dev/api/${resourceType}/`;
    }

    public getPage(page: number = 1, search?: string) {
      if (search) {
        return request<IPage<T>>(`${this.rootUrl}?page=${page}&search=${search}`);
      }

      return request<IPage<T>>(`${this.rootUrl}?page=${page}`);
    }

    public async find(predicate: (single: T) => boolean) {
      const { data } = await this.getPage();
      if (data) {
        const pages = Math.ceil(data.count / data.results.length);
        const left = Array.from(
          {
            length: pages - 1,
          },
          (_, i) => this.getPage(2 + i)
        );
        const restResults = await Promise.all(left);

        const totalResults: T[] = [
          {
            results: data.results,
          },
          ...restResults,
        ].reduce((prev, current) => {
          if ("results" in current) {
            return [...prev, ...current.results];
          }
          return prev;
        }, [] as T[]);

        return _.filter(totalResults, predicate);
      }
    }

    public async getAll() {
      const { data } = await this.getPage();
      if (data) {
        const pages = Math.ceil(data.count / data.results.length);
        const left = Array.from(
          {
            length: pages - 1,
          },
          (_, i) => this.getPage(2 + i)
        );
        const restResults = await Promise.all(left);
        console.log(restResults);

        const totalResults: T[] = [
          {
            data: {
              results: data.results
            },
          },
          ...restResults,
        ].reduce((prev, current) => {
          if (current.data) {
            return [...prev, ...current.data.results];
          }
          return prev;
        }, [] as T[]);
        return totalResults
      }
    }

    public async findBySearch(predicate: string[]) {
      return (await Promise.all(
        predicate.map((query) =>  request<IPage<T>>(`${this.rootUrl}?search=${query}`))
      )).map((item) => item.data);
    }

    public async findByUrl(urls: string[]) {
      return (await Promise.all(
        urls.map((query) =>  request<T>(query))
      )).map((item) => item.data);
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
