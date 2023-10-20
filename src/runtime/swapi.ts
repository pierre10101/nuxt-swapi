import * as _ from "lodash";
import {
  type IFilm,
  type IPeople,
  type IPlanet,
  type ISpecie,
  type IStarship,
  type IVehicle,
  ResourcesType,
} from "./types";

import axios, { type AxiosResponse } from "axios";

interface CustomErrorResponse {
  status: number;
  data: null;
  message: string;
}

interface CustomSuccessResponse<T> {
  status: number;
  data: T;
}

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

class Resource<T> {
  constructor(public value: T) {}

  public async populate(path: string) {
    await this.populateRec(path, this.value);

    return this;
  }

  private async populateSingle(path: string, obj: any) {
    if (Array.isArray(obj[path])) {
      obj[path] = await Promise.all(
        (obj[path] as string[]).map((url) =>
          request(url.replace("http", "https"))
        )
      );

      return this;
    }

    obj[path] = await request((obj[path] as string).replace("http", "https"));

    return this;
  }

  private populateRec(path: string, obj: any): Promise<{}> {
    const [next, ...rest] = path.split(".");

    if (rest.length > 0 && Array.isArray(obj[next])) {
      return Promise.all(
        obj[next].map((single: any) => this.populateRec(rest.join("."), single))
      );
    }

    if (rest.length === 0 && Array.isArray(obj)) {
      return Promise.all(
        obj.map((single) => this.populateSingle(next, single))
      );
    } else if (rest.length === 0) {
      return this.populateSingle(next, obj);
    }

    return this.populateRec(rest.join("."), obj[next] as {});
  }
}

function collectionBuilder<T>(resource: ResourcesType) {
  return class SWCollection {
    static root = `https://swapi.dev/api/${resource}/`;
    public resources: Resource<T>[] = [];

    constructor(unparsedResources: T[]) {
      this.resources = unparsedResources.map(
        (resource) => new Resource<T>(resource)
      );
    }

    async populateAll(path: string) {
      this.resources = await Promise.all(
        this.resources.map((obj) => obj.populate(path))
      );

      return this;
    }

    static getPage<T>(page: number = 1, search?: string) {
      if (search) {
        return request<T>(`${SWCollection.root}?page=${page}&search=${search}`);
      }

      return request<T>(`${SWCollection.root}?page=${page}`);
    }

    public static async find(predicate: (single: T) => boolean) {
      const { data } = await SWCollection.getPage<{
        count: number;
        results: T[];
      }>();
      if (data) {
        const pages = Math.ceil(data.count / data.results.length);
        const left = Array.from(
          {
            length: pages - 1,
          },
          (_, i) => SWCollection.getPage<{ count: number; results: T[] }>(2 + i)
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

        return new SWCollection(_.filter(totalResults, predicate));
      }
    }

    public static async findBySearch(predicate: string[]) {
      const pages = await Promise.all(
        predicate.map((query) => this.getPage(1, query))
      );

      return new SWCollection(_.flatMap(pages, "results"));
    }
  };
}

export const Films = collectionBuilder<IFilm>(ResourcesType.Films);
export const People = collectionBuilder<IPeople>(ResourcesType.People);
export const Planets = collectionBuilder<IPlanet>(ResourcesType.Planets);
export const Species = collectionBuilder<ISpecie>(ResourcesType.Species);
export const Starships = collectionBuilder<IStarship>(ResourcesType.Starships);
export const Vehicles = collectionBuilder<IVehicle>(ResourcesType.Vehicles);

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
