export type RdfQuery = {
  userId: string;
  query: string;
};

export type RdfData = {
  results: {
    bindings: {
      s: KeyValueRdfPair;
      p: KeyValueRdfPair;
      o: KeyValueRdfPair;
    }[];
  };
};

export type KeyValueRdfPair = {
  type: string;
  value: string;
};
