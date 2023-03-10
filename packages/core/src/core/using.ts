function using<T extends { dispose(): void }>(
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
