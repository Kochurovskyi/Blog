import { useContext } from "react";

import "./Auth.css";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useState } from "react";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/contex/auth-context";

function Auth() {
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [formState, inputHandler] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  async function authSubmitHandler(event) {
    event.preventDefault();
    // console.log("AUTH FORM STATE:", formState.inputs);
    try {
      setIsLoading(true);
      const responce = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
      });
      const responceData = await responce.json();
      if (!responce.ok) {
        throw new Error(responceData.message);
      }
      auth.login();
    } catch (err) {
      console.log(err);
      setError(
        err.message ||
          "<<<Something went wrong with Login IN, please try again>>>"
      );
    }
    setIsLoading(false);
  }

  return (
    <>
      <ErrorModal error={error} onClear={() => setError(null)} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Loging Requiered</h2>
        <form onSubmit={authSubmitHandler}>
          <Input
            element="input"
            id="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            LOGIN
          </Button>
        </form>
      </Card>
    </>
  );
}

export default Auth;
