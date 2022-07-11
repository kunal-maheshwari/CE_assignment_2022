import React, { useEffect, useState } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import axios from "axios";
import moment from "moment";

const ShowProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await axios("http://localhost:5000/showProjects");
      setProjects(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      axios(`http://localhost:5000/deleteProject/${id}`, {
        method: "DELETE",
      }).then(() => fetchData());
    }
  };

  const onSearch = (text) => {
    setSearch(text);
    const data = projects.filter(
      (item) =>
        item.name.toLowerCase().includes(text.toLowerCase()) ||
        item.description.toLowerCase().includes(text.toLowerCase())
    );
    setFilterData(data);
  };

  const ProjectForm = ({ open, edit = false, onClose, projectData = {} }) => {
    const { projects_id, name, description, skills, members, is_active } =
      projectData;
    const [projectName, setProjectName] = useState(name ?? "");
    const [projectDesc, setProjectDesc] = useState(description ?? "");
    const [projectSkills, setProjectSkills] = useState(skills ? skills : []);
    const [projectMembers, setProjectMembers] = useState(members ?? "");
    const [isActive, setisActive] = useState(is_active ? is_active : false);
    const [isError, setisError] = useState(false);

    const handleSkills = ({ target: { value } }) => {
      setProjectSkills(value);
    };

    const handleMembers = ({ target: { value } }) => {
      setProjectMembers(value);
    };

    const handleCheck = ({ target: { checked } }) => {
      setisActive(checked);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (validate()) {
        let url = edit
          ? `http://localhost:5000/editProject/${projects_id}`
          : "http://localhost:5000/addProject";
        try {
          await axios(url, {
            method: "POST",
            data: {
              name: projectName,
              description: projectDesc,
              skills: projectSkills,
              members: projectMembers,
              is_active: isActive,
              updated_at: moment().format(),
            },
          });
          fetchData();
          handleClose();
        } catch (err) {
          console.log(err);
        }
      }
    };

    const handleClose = () => {
      setProjectName("");
      setProjectDesc("");
      setProjectSkills([]);
      setProjectMembers("");
      setisActive(false);
      onClose();
    };

    const validate = () => {
      let isValid = true;
      if (!projectName) {
        isValid = false;
      } else if (!projectDesc) {
        isValid = false;
      } else if (projectSkills.length === 0) {
        isValid = false;
      } else if (!projectMembers) {
        isValid = false;
      }
      setisError(isValid);
      return isValid;
    };

    return (
      <Modal open={open} onClose={onClose} align="center">
        <div style={{ backgroundColor: "#fff", width: "80%" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: "bold",
              marginTop: 20,
              marginBottom: 20,
              paddingTop: 20,
            }}
          >
            {edit ? "Edit" : "Add"} Projects
          </div>
          <TextField
            required
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={styles.inputField}
            error={isError && !projectName}
            helperText={isError && !projectName ? "Required" : ""}
          />
          <TextField
            required
            label="Project Description"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            style={styles.inputField}
            error={isError && !projectDesc}
            helperText={isError && !projectDesc ? "Required" : ""}
          />
          <FormControl
            style={styles.inputField}
            error={isError && projectSkills.length === 0}
          >
            <InputLabel>Skills*</InputLabel>
            <Select
              required
              multiple
              value={projectSkills}
              label="Skills"
              onChange={handleSkills}
            >
              {skillSet.map((skill, index) => (
                <MenuItem key={index} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {isError && projectSkills.length === 0 ? "Required" : ""}
            </FormHelperText>
          </FormControl>
          <FormControl
            style={styles.inputField}
            error={isError && !projectMembers}
          >
            <InputLabel>Members*</InputLabel>
            <Select
              required
              value={projectMembers}
              label="Members"
              onChange={handleMembers}
            >
              {membersOption.map((opt, index) => (
                <MenuItem key={index} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {isError && !projectMembers ? "Required" : ""}
            </FormHelperText>
          </FormControl>
          <div align="left" style={styles.inputField}>
            <FormControlLabel
              label="Is Active?"
              control={<Checkbox checked={isActive} onChange={handleCheck} />}
            />
          </div>
          <div style={{ alignItems: "center", justifyContent: "space-evenly" }}>
            <Button
              variant="contained"
              style={{ width: "25%", margin: 20 }}
              onClick={handleSubmit}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              style={{ width: "25%", margin: 20 }}
              onClick={handleClose}
            >
              Back
            </Button>
          </div>
        </div>
      </Modal>
    );
  };

  const visibleData = search ? filterData : projects;

  return (
    <>
      <div
        align="center"
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        My Projects
      </div>
      <div
        align="left"
        style={{ width: "65%", padding: 10, flexDirection: "row" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShow(true)}
        >
          Add Projects
        </Button>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{ marginLeft: "80%" }}
        />
      </div>
      <ProjectForm open={show} onClose={() => setShow(false)} />
      <Table style={styles.mainTable} align="center">
        <TableHead>
          <TableRow style={styles.headerRow}>
            {tableHeaders.map((heading, index) => (
              <TableCell key={index} style={styles.headerCell}>
                {heading}
              </TableCell>
            ))}
            <TableCell colSpan={2}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleData.map((project) => {
            const {
              projects_id,
              name,
              description,
              skills,
              members,
              is_active,
              created_at,
            } = project;
            return (
              <TableRow key={`${name}-${projects_id}`}>
                <TableCell style={styles.dataCell}>{name}</TableCell>
                <TableCell style={styles.dataCell}>{description}</TableCell>
                <TableCell style={styles.dataCell}>
                  {skills.join(", ")}
                </TableCell>
                <TableCell style={styles.dataCell}>{members}</TableCell>
                <TableCell style={styles.dataCell}>
                  {is_active ? "Yes" : "No"}
                </TableCell>
                <TableCell style={styles.dataCell}>
                  {moment(created_at).format("DD-MM-YYYY hh:mm A")}
                </TableCell>
                <TableCell style={styles.dataCell}>
                  <Button
                    onClick={() => {
                      setShow(true);
                      setIsEdit(true);
                      setEditData(project);
                    }}
                  >
                    Edit
                  </Button>
                  <ProjectForm
                    open={show}
                    onClose={() => {
                      setShow(false);
                      setIsEdit(false);
                      setEditData({});
                    }}
                    projectData={editData}
                    edit={isEdit}
                  />
                </TableCell>
                <TableCell style={styles.dataCell}>
                  <Button color="error" onClick={() => onDelete(projects_id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

const tableHeaders = [
  "Project Name",
  "Project Description",
  "Skill Set",
  "No of Members",
  "is Active?",
  "Created Date",
];

const skillSet = [
  "Asp.Net",
  "PHP",
  "Java",
  "ReactJs",
  "React Native",
  "AngularJs",
  "NodeJs",
  "PWA",
  "Flutter",
  "VueJs",
  "Vanilla Js",
  "SQL Server",
  "My SQL",
  "MongoDB",
  "HTML",
  "CSS",
  "JavaScript/jQuery",
];

const membersOption = ["1", "2", "3", "4", "5 or 5+"];

const styles = {
  mainTable: { width: "65%" },
  headerRow: { backgroundColor: "#00f" },
  headerCell: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  dataCell: { fontSize: 14, color: "#000", fontWeight: "600" },
  inputField: { width: "60%", marginTop: 20 },
};

export default ShowProjects;
