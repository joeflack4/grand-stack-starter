import { neo4jgraphql } from "neo4j-graphql-js";

// GraphQL SDL (Schema Definition Language)
// - url: https://graphql.org/learn/schema/
// - comments: https://stackoverflow.com/questions/39962867/how-do-i-add-a-description-to-a-field-in-graphql-schema-language
// - !: means non-nullable
export const typeDefs = `
type User {
  id: ID!
  name: String
  # relations
  friends(first: Int = 10, offset: Int = 0): [User] @relation(name: "FRIENDS", direction: "BOTH")
  reviews(first: Int = 10, offset: Int = 0): [Review] @relation(name: "WROTE", direction: "OUT")
  # calculated
  avgStars: Float @cypher(statement: "MATCH (this)-[:WROTE]->(r:Review) RETURN toFloat(avg(r.stars))")
  numReviews: Int @cypher(statement: "MATCH (this)-[:WROTE]->(r:Review) RETURN COUNT(r)")
}

type Business {
  id: ID!
  name: String
  address: String
  city: String
  state: String
  reviews(first: Int = 10, offset: Int = 0): [Review] @relation(name: "REVIEWS", direction: "IN")
  categories(first: Int = 10, offset: Int =0): [Category] @relation(name: "IN_CATEGORY", direction: "OUT")
}

type Review {
  id: ID!
  stars: Int
  text: String
  business: Business @relation(name: "REVIEWS", direction: "OUT")
  user: User @relation(name: "WROTE", direction: "IN")
}

type Category {
  name: ID!
  businesses(first: Int = 10, offset: Int = 0): [Business] @relation(name: "IN_CATEGORY", direction: "IN")
}

# Should be able to auto-generate some basic queries, I would imagine, similar to the resolvers and mutations.
type Query {
    users(id: ID, name: String, first: Int = 10, offset: Int = 0): [User]
    businesses(id: ID, name: String, first: Int = 10, offset: Int = 0): [Business]
    reviews(id: ID, stars: Int, first: Int = 10, offset: Int = 0): [Review]
    category(name: ID!): Category
    usersBySubstring(substring: String, first: Int = 10, offset: Int = 0): [User] @cypher(statement: "MATCH (u:User) WHERE u.name CONTAINS $substring RETURN u")
}
`;

export const resolvers = {
  Query: {
    users: neo4jgraphql,
    businesses: neo4jgraphql,
    reviews: neo4jgraphql,
    category: neo4jgraphql,
    usersBySubstring: neo4jgraphql
  }
};
