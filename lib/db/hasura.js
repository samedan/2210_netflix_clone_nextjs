/*
This is an example snippet - you should consider tailoring it
to your service.
*/

// NEW USER
export async function createNewUser(token, metadata) {
  const { issuer, email, publicAddress } = metadata;
  const operationsDoc = `
    mutation createNewUser($issuer: String!, $email:String!, $publicAddress:String!) {
      insert_users(objects: {email: $email, issuer: $issuer, publicAddress:$publicAddress}) {
        affected_rows
        returning {
          email
          id
          issuer
          publicAddress
        }
      }
    }
  `;
  const response = await queryHasuraGQL(
    operationsDoc,
    "createNewUser",
    { issuer, email, publicAddress },
    token
  );

  if (response.errors !== undefined) {
    console.log(" response.errors on lib/db/hasura.io");
    console.log(response.errors);
  }
  console.log(
    "response.data.insert_users.returning[0] on lib/db/hasura.io on NEW USER"
  );
  console.log(response.data.insert_users.returning[0]);
  // return response?.data?.users?.length === 0;
  return response;
}

// OLD User check
// issuer comes form /api/login.js metadata.issuer
export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer }}) {
      email
      issuer
      id
    }
  }
`;

  const response = await queryHasuraGQL(
    operationsDoc,
    "isNewUser",
    { issuer },
    token
  );

  if (response.errors !== undefined) {
    console.log(" response.errors on lib/db/hasura.io");
    console.log(response.errors);
  }
  console.log("response.data.users[0] on lib/db/hasura.io");
  console.log(response.data.users[0]);
  return response?.data?.users?.length === 0;
}

async function queryHasuraGQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

function fetchMyQuery() {
  const operationsDoc = `
  query MyQuery {
    users(where: {issuer: {_eq: ""}}) {
      email
      id
      issuer
    }
  }
`;
  return queryHasuraGQL(operationsDoc, "MyQuery", {}, "");
}

export async function startFetchMyQuery() {
  const { errors, data } = await fetchMyQuery();

  if (errors) {
    // handle those errors like a pro
    console.error(errors);
  }

  // do something great with this precious data
  console.log(data);
}

startFetchMyQuery();
