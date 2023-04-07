import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  GET_ALL_USER,
  GET_USER_BY_NAME,
  CREATE_USER_MUTATION,
  DELETE_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from "../query";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Box,
  TextField,
  Button,
} from "@mui/material";
import Paginate from "./Paginate";

const User = () => {
  const [searchData, setSearchData] = useState();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const { data: getAllUser, refetch } = useQuery(GET_ALL_USER, {
    variables: { skip: indexOfFirstPost, take: 5, cursor: currentPage },
  });
  const [getUserdata, { data: getUserByName, loading, error }] =
    useLazyQuery(GET_USER_BY_NAME);

  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);

  const currentPosts = getAllUser?.getAllUsers?.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  console.log("getAllUser--", getAllUser);
  console.log(
    "indexOfLastPost",
    indexOfLastPost,
    "indexOfFirstPost",
    indexOfFirstPost
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const previousPage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (
      currentPage !== Math.ceil(getAllUser?.getAllUsers.length / postsPerPage)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    setUserData({
      ...userData,
      name: getUserByName?.getUser?.name,
      email: getUserByName?.getUser?.email,
    });
  }, [getUserByName?.getUser]);

  // useEffect(() => {
  //   searchData?.length > 0 && getUserdata({ variables: { name: searchData } });
  //   console.log("searchData--", searchData);
  // }, [searchData]);

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="standard-search"
          label="Search field"
          type="search"
          variant="standard"
          onChange={(e) => {
            // setSearchData(e.target.value);
            getUserdata({ variables: { name: e.target.value } });
          }}
        />
        <Button
          variant="contained"
          size="small"
          onClick={() => getUserdata({ variables: { name: searchData } })}
        >
          Search
        </Button>
        <h3>Create User</h3>
        <TextField
          label="Enter name"
          id="outlined-size-small"
          size="small"
          value={userData.name}
          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          focused
        />
        <TextField
          label="Enter email"
          id="outlined-size-small"
          size="small"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          focused
        />
        <br />
        {!getUserByName?.getUser?.id && (
          <TextField
            label="Enter password"
            id="outlined-size-small"
            size="small"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            focused
          />
        )}
        <br />
        <br />
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            getUserByName?.getUser?.id
              ? updateUser({
                  variables: {
                    id: getUserByName?.getUser?.id,
                    name: userData.name,
                    email: userData.email,
                  },
                  onCompleted: () => refetch(),
                  onError: () => {
                    alert("Somthing went wrong!");
                  },
                })
              : createUser({
                  variables: {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                  },
                  onCompleted: () => refetch(),
                  onError: () => {
                    alert("Somthing went wrong!");
                  },
                });
          }}
        >
          {getUserByName?.getUser?.id ? "Update" : "Add"}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <h3>User List</h3>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Id</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Action</TableCell>
            </TableRow>
          </TableHead>
          {searchData ? (
            <TableBody>
              <TableCell align="left">{getUserByName?.getUser?.id}</TableCell>
              <TableCell align="left">{getUserByName?.getUser?.name}</TableCell>
              <TableCell align="left">
                {getUserByName?.getUser?.email}
              </TableCell>
            </TableBody>
          ) : (
            getAllUser?.getAllUsers?.map((i) => (
              <TableBody>
                <TableCell align="left">{i.id}</TableCell>
                <TableCell align="left">{i.name}</TableCell>
                <TableCell align="left">{i.email}</TableCell>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    getUserdata({
                      variables: {
                        id: i.id,
                      },
                      onError: () => {
                        alert("Somthing went wrong!");
                      },
                    });
                  }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    deleteUser({
                      variables: {
                        id: i.id,
                      },
                      onCompleted: () => refetch(),
                      onError: () => {
                        alert("Somthing went wrong!");
                      },
                    });
                  }}
                >
                  Delete
                </Button>
              </TableBody>
            ))
          )}
        </Table>
      </TableContainer>

      <Paginate
        postsPerPage={postsPerPage}
        totalPosts={15}
        // totalPosts={getAllUser?.getAllUsers?.length}
        paginate={paginate}
        previousPage={previousPage}
        nextPage={nextPage}
      />
    </div>
  );
};

export default User;
