import React, { useState } from "react";
import axios from "axios";
import {
  TextInput,
  PasswordInput,
  Button,
  Container,
  Paper,
  Text,
} from "@mantine/core";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to handle login errors

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );
      localStorage.setItem("token", data.token);
      window.location.href = "/";
      console.log("Login successful!");

      // Optionally, redirect to a different page after successful login
      // e.g., window.location.href = '/dashboard'; // Redirect to dashboard
    } catch (error) {
      // Handle errors (e.g., invalid credentials)
      console.log("Error logging in:", error);
      setError("Invalid credentials. Please try again."); // Set error message
    }
  };

  return (
    <Container size={420} mt={30}>
      <Paper padding="xl" shadow="xs" radius="md" className="bg-white">
        <Text align="center" size="xl" weight={500} className="text-gray-800">
          Login to Your Account
        </Text>
        {/* Display error message if login fails */}
        {error && (
          <Text
            align="center"
            color="red"
            size="sm"
            weight={400}
            className="mb-4"
          >
            {error}
          </Text>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <TextInput
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              classNames={{ root: "mb-4" }}
            />
          </div>
          <div className="mt-4">
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              classNames={{ root: "mb-4" }}
            />
          </div>
          <Button
            type="submit"
            fullWidth
            mt="xl"
            className="bg-blue-500 hover:bg-blue-600"
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
