import { Segment, Grid, Container } from "semantic-ui-react";
import RegistrationForm from "./components/RegistrationForm";
import EmployeeList from "./components/EmployeeList";
import React from "react";
import Empctx from "./context/Empctx";

const InitialData = {
  name: "",
  mobile: ["", ""],
  jobtype: "",
  preferredlocation: [],
  profilepicurl: "https://react.semantic-ui.com/images/wireframe/image.png",
  email: "",
  dob: "",
  mobilecode: "",
  number: "",
};

function App() {
  const [emp, setEmp] = React.useState(InitialData);
  const [formType, setFormType] = React.useState("add");
  const appRef = React.useRef();
  React.useEffect(() => {
    console.log("App render");
  }, [emp, setEmp]);

  return (
    <>
      <div ref={appRef}></div>
      <Empctx.Provider
        value={{ emp, setEmp, appRef, formType, setFormType, InitialData }}
      >
        <Container style={{ marginBottom: "1em" }}>
          <Segment style={{ marginTop: "10vh" }}>
            <Grid stackable>
              <RegistrationForm />
            </Grid>
          </Segment>
        </Container>
        <Container style={{ marginBottom: "1em" }}>
          <Segment style={{ marginTop: "10vh" }}>
            <Grid>
              <EmployeeList />
            </Grid>
          </Segment>
        </Container>
      </Empctx.Provider>
    </>
  );
}

export default App;
