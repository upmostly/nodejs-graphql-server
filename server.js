const app = require("express")();
const cors = require('cors');
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const schema = buildSchema(
  `
    type Query {
      authors: [Author]
      books: [Book] 
    }

    type Mutation {
      createAuthor(
        firstName: String!,
        lastName: String!
      ): Author
    }

    type Author {
      id: String
      firstName: String!
      lastName: String!
      books: [Book]
    }

    type Book {
      id: String
      title: String!
      author: Author
    }
  `
);

const mockedAuthors = [
  {
    id: '1',
    firstName: "Mike",
    lastName: "Ross",
  },
  {
    id: '2',
    firstName: "John",
    lastName: "Miles",
    books: [
      {
        id: '1',
        title: "Book 1",
        author: {
          id: '2',
          firstName: "John",
          lastName: "Miles",
        },
      },
      {
        id: '2',
        title: "Book 2",
        author: {
          id: '2',
          firstName: "John",
          lastName: "Miles",
        },
      },
    ],
  },
];

const mockedBooks = {
  '1': {
    title: "Book 1",
    author: mockedAuthors["2"],
  },
  '2': {
    title: "Book 2",
    author: mockedAuthors["2"],
  },
};

const root = {
  authors: () => mockedAuthors,
  books: () => mockedBooks,
  createAuthor: ({ firstName, lastName }) => {
    const id = String(mockedAuthors.length + 1);

    const createdAuthor = {
      id,
      firstName,
      lastName
    };

    mockedAuthors.push(createdAuthor);

    return createdAuthor;
  }
};

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(8080);
