import { IDisposable } from './types';

export function using<T extends IDisposable>(
  resource: T,
  func: (resource: T) => void
) {
  try {
    func(resource);
  } finally {
    resource.dispose();
  }
}

// usage
//using(new Resource(), (resource) => {
// code that uses the resource
//});

export function usingBlock(
  func: (use: <T extends IDisposable>(resource: T) => T) => void
) {
  const resources: IDisposable[] = [];
  try {
    func(function <T extends IDisposable>(resource: T) {
      resources.push(resource);
      return resource;
    });
  } finally {
    resources.forEach((resource) => resource.dispose());
  }
}

// usage
//usingBlock((use) => {
// const resource = use(new Resource());
// code that uses the resource
//});
