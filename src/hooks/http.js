import { useReducer, useCallback } from "react";

const httpReducer = (prevHttpState, action) => {
  switch (action.type) {
    case "SEND":
      // overtake all properties loading:true, error: null
      return {
        ...prevHttpState,
        loading: true,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      // override all properties from the old state - avoid to type error: null again
      return {
        ...prevHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...prevHttpState, error: null };
    default:
      throw new Error("Should not get there!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null,
  });
  //const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: "SEND", identifier: reqIdentifier });
      fetch(url, {
        method,
        body,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseData) => {
          dispatchHttp({
            type: "RESPONSE",
            responseData: responseData,
            extra: reqExtra,
          });
        })
        .catch((error) => {
          dispatchHttp({
            type: "ERROR",
            errorMessage: "Ups, something went wrong!",
          });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
  };
};

export default useHttp;
