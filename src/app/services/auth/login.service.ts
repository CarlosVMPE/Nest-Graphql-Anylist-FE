import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const LOGIN_USER = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
      user {
        id
        email
        fullName
        isActive
        roles
      }
    }
  }
`;

const REVALIDATE_USER = gql`
  query Revalidate {
    revalidate {
      token
      user {
        email
        fullName
        isActive
      }
    }
  }
`;

const REGISTER_USER = gql`
  mutation Register($signupInput: SignupInput!) {
    signup(signupInput: $signupInput) {
      token
      user {
        id
        email
        fullName
        isActive
        roles
      }
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private apollo: Apollo) {}

  login(email: string, password: string) {
    return this.apollo.mutate({
      mutation: LOGIN_USER,
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  }

  register(email: string, password: string, fullName: string) {
    return this.apollo.mutate({
      mutation: REGISTER_USER,
      variables: {
        signupInput: {
          email,
          password,
          fullName,
        },
      },
    });
  }

  revalidate() {
    return this.apollo.query({
      query: REVALIDATE_USER,
      fetchPolicy: 'no-cache',
    });
  }
}
