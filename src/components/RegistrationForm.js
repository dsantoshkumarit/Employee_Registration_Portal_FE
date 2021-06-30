import React from "react";
import axios from "axios";
import makeToast from "../Toaster";
import Empctx from "../context/Empctx";
import {
  Grid,
  Form,
  Header,
  Icon,
  Input,
  Dropdown,
  Image,
  Button,
} from "semantic-ui-react";

export default function RegistrationForm() {
  const empctx = React.useContext(Empctx);
  const [employee, setEmployee] = React.useState(empctx.emp);
  const [picPreview, setPicPreview] = React.useState("");

  React.useEffect(() => {
    console.log(empctx.emp.preferredlocation);
    setEmployee(empctx.emp);
  }, [empctx.emp]);

  const locations = [
    "Chennai",
    "Bangalore",
    "Pune",
    "Hyderabad",
    "Mumbai",
    "Delhi",
  ];
  const locationoptions = locations.map((loc, i) => ({
    key: i,
    text: loc,
    value: loc,
  }));

  const handleChange = (e, { name, value }) => {
    const { files } = e.target;

    if (name === "media") {
      setEmployee((prevState) => ({ ...prevState, media: files[0] }));
      setPicPreview(window.URL.createObjectURL(files[0]));
    } else {
      setEmployee((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  async function handleImageUpload() {
    const data = new FormData();
    data.append("file", employee.media);
    data.append("upload_preset", "ShopZone");
    data.append("cloud_name", "dskimgurl");
    const response = await axios.post(
      process.env.REACT_APP_CLOUDINARY_URL,
      data
    );
    return response.data.url;
  }

  async function handleSubmit(event) {
    try {
      event.preventDefault();
      const mediaUrl = await handleImageUpload();
      const [code, mobileno] = [employee.mobilecode, employee.number];
      const url = `${process.env.REACT_APP_BACKEND_URL}/employee/addEmployee`;
      const payload = {
        ...employee,
        profilepicurl: mediaUrl,
        mobile: [code, mobileno],
        media: "",
      };

      const response = await axios.post(url, payload);
      makeToast("success", response.data.message);
    } catch (error) {
      makeToast("error", error?.response?.data?.message);
    }
  }

  return (
    <>
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Header as="h1" block>
            <Icon size="large" name="clipboard list" />
            <Header.Content>Registration</Header.Content>
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Form style={{ width: "100%" }} onSubmit={handleSubmit}>
        <Grid stackable celled>
          <Grid.Row columns={2}>
            <Grid.Column floated="left">
              <Form.Field
                label="Full Name"
                name="name"
                control={Input}
                defaultValue={employee.name}
                placeholder="Full Name"
                onChange={handleChange}
              />
              <Form.Field label="Mobile" />
              <Form.Group inline widths="equal">
                <Form.Field>
                  <Input
                    name="mobilecode"
                    defaultValue={employee.mobile[0]}
                    label={{ basic: true, content: "+" }}
                    labelPosition="left"
                    placeholder="91"
                    onChange={handleChange}
                    type="number"
                  />
                </Form.Field>
                <Form.Field>
                  <Input
                    name="number"
                    type="number"
                    defaultValue={employee.mobile[1]}
                    placeholder="9876543210"
                    onChange={handleChange}
                  />
                </Form.Field>
              </Form.Group>
              <Form.Field label="Job Type" />
              <Form.Group inline>
                <Form.Radio
                  name="jobtype"
                  label="Part Time"
                  value="Part Time"
                  checked={employee.jobtype === "Part Time"}
                  onChange={handleChange}
                />
                <Form.Radio
                  name="jobtype"
                  label="Full Time"
                  value="Full Time"
                  checked={employee.jobtype === "Full Time"}
                  onChange={handleChange}
                />

                <Form.Radio
                  name="jobtype"
                  label="Consultant"
                  value="Consultant"
                  checked={employee.jobtype === "Consultant"}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Field label="Pref. Location" />
              <Form.Group inline>
                <Dropdown
                  placeholder="Select"
                  fluid
                  multiple
                  search
                  selection
                  options={locationoptions}
                  value={employee.preferredlocation}
                  name="preferredlocation"
                  onChange={handleChange}
                />
              </Form.Group>
            </Grid.Column>
            <Grid.Column floated="right">
              <Form.Group>
                <Form.Field
                  label="Profile Pic"
                  control={Input}
                  type="file"
                  name="media"
                  onChange={handleChange}
                />

                <Image
                  label="Preview"
                  alt="Profile Pic"
                  size="tiny"
                  rounded
                  centered
                  src={picPreview || empctx.emp.profilepicurl}
                />
              </Form.Group>
              <Form.Field
                label="Email"
                value={employee.email}
                control={Input}
                type="email"
                name="email"
                onChange={handleChange}
              />
              <Form.Field
                name="dob"
                control={Input}
                type="date"
                label="DOB"
                onChange={handleChange}
                defaultValue={employee.dob.split("T")[0]}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button
                content="Add/Update"
                icon="add"
                color="green"
                inverted
                fluid
                style={{ width: "50%", margin: "1em auto" }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </>
  );
}
