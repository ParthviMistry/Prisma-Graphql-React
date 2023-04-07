import { gql } from "@apollo/client";

export const GET_ALL_USER = gql`
  query getAllUsers($skip: Int, $take: Int, $cursor: Int) # $totalCount: Int
  {
    getAllUsers(
      skip: $skip
      take: $take
      cursor: $cursor
    ) # totalCount: $totalCount
    {
      id
      name
      email
    }
  }
  # query getAllUsers {
  #   getAllUsers {
  #     id
  #     name
  #     email
  #   }
  # }
`;

export const GET_USER_BY_NAME = gql`
  query getUser($id: Int, $name: String) {
    getUser(id: $id, name: $name) {
      id
      name
      email
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation createUser($name: String, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      name
      email
      password
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($id: Int, $name: String, $email: String!) {
    updateUser(id: $id, data: { name: $name, email: $email }) {
      name
      email
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation deleteUser($id: Int) {
    deleteUser(id: $id) {
      email
    }
  }
`;
