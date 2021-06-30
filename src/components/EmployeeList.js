import React from "react";
import makeToast from "../Toaster";
import axios from "axios";
import { Grid, Header, Icon, Button, Table } from "semantic-ui-react";
import Empctx from "../context/Empctx";

export default function EmployeeList() {
  const empctx = React.useContext(Empctx);
  const [employeeList, setEmployeeList] = React.useState([empctx.emp]);

  async function getAllEmployees() {
    console.log(process.env.REACT_APP_BACKEND_URL);
    let employees = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/employee/getAllEmployees`
    );
    setEmployeeList(employees.data);
  }

  React.useEffect(() => {
    getAllEmployees();
  }, []);

  function handleEdit(e, index) {
    empctx.setEmp(employeeList[index]);
  }

  async function handleDelete(e, _id) {
    try {
      let response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/employee/deleteEmployee/${_id}`
      );
      makeToast("success", response.data.message);
      getAllEmployees();
    } catch (error) {
      makeToast("error", error?.response?.data?.message);
    }
  }

  return (
    <>
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Header as="h1" block>
            <Icon size="large" name="list ol" />
            <Header.Content>Employee List</Header.Content>
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={16}>
          <Table celled fixed singleLine>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Email</Table.HeaderCell>
                <Table.HeaderCell>Mobile</Table.HeaderCell>
                <Table.HeaderCell>DOB (YYYY-MM-DD)</Table.HeaderCell>
                <Table.HeaderCell>Job Type</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {employeeList.map((emp, i) => {
                return (
                  <Table.Row key={i}>
                    <Table.Cell>{emp.name}</Table.Cell>
                    <Table.Cell>{emp.email}</Table.Cell>
                    <Table.Cell>+{emp.mobile.join(" ")}</Table.Cell>
                    <Table.Cell>{emp.dob.split("T")[0]}</Table.Cell>
                    <Table.Cell>{emp.jobtype}</Table.Cell>
                    <Table.Cell collapsing>
                      <Button
                        icon="edit"
                        content="Edit"
                        inverted
                        color="violet"
                        onClick={(e) => handleEdit(e, i)}
                      />
                      <br />
                      <br />
                      <Button
                        icon="trash alternate"
                        content="Delete"
                        inverted
                        color="red"
                        onClick={(e) => handleDelete(e, emp._id)}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </>
  );
}
