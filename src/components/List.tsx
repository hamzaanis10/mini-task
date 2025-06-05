import React, { useEffect, useState } from "react";
import {
  Button,
  TextInput,
  Checkbox,
  Group,
  Stack,
  Card,
  Text,
  Container,
  Modal,
  Title,
  Accordion,
} from "@mantine/core";
import axios from "axios";

interface ChecklistItem {
  title: string;
  completed: boolean;
}

interface Task {
  _id: string;
  title: string;
  items: ChecklistItem[];
}

const List: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  // {
  //     "_id": "6841446f05000dfea22141cb",
  //     "title": "My New Task",
  //     "user": "684097de2bf7a91b76e052ac",
  //     "items": [
  //         {
  //             "_id": "6841464df28911d0c413cdbb",
  //             "title": "Item on this task",
  //             "completed": false,
  //             "task": "6841446f05000dfea22141cb",
  //             "__v": 0
  //         }
  //     ],
  //     "__v": 1
  // }
  const [title, setTitle] = useState("");
  const [items, setChecklist] = useState<string[]>([""]);
  const [modalOpened, setModalOpened] = useState(false);
  const [checkModalOpened, setCheckModalOpened] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  console.log("newChecklistItem:", newChecklistItem);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the token from localStorage
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found in localStorage");
          return;
        }

        // Make the POST request with the token in the Authorization header
        const res = await axios.get("http://localhost:5000/api/tasks/", {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });

        console.log(res.data); // Handle the response data as needed
        setTasks(res.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, [modalOpened, checkModalOpened]);
  const handleCreateTask = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/tasks/",
        {
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the token in the Authorization header
          },
        }
      );
      console.log(data);
    } catch (error) {
      console.log("Error logging in:", error);
    }
    setTitle("");
    setChecklist([]); // Clear the checklist state as well
    setModalOpened(false);
  };
  console.log(selectedTaskId);
  const handleAddChecklistItem = async () => {
    if (selectedTaskId) {
      try {
        const { data } = await axios.post(
          `http://localhost:5000/api/tasks/${selectedTaskId}/items`,
          {
            title: newChecklistItem,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the token in the Authorization header
            },
          }
        );
        console.log(data);
      } catch (error) {
        console.log("Error logging in:", error);
      }
      setSelectedTaskId(null);
      setNewChecklistItem(""); // Clear the input after adding the item
      setCheckModalOpened(false);
    }
  };

  const handleChecklistChange = (
    taskId: string,
    index: number,
    value: string
  ) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id === taskId) {
        const updatedChecklist = [...task.items];
        updatedChecklist[index].item = value;
        return { ...task, items: updatedChecklist };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleCheckboxChange = (taskId: string, index: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id === taskId) {
        const updatedChecklist = [...task.items];
        updatedChecklist[index].completed = !updatedChecklist[index].completed;
        return { ...task, items: updatedChecklist };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  return (
    <Container>
      {/* Task List with Accordion */}
      <Stack mt={40}>
        {tasks &&
          tasks.map((task) => (
            <Card
              key={task._id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
            >
              {/* Task Title - Accordion Header */}
              <Accordion>
                <Accordion.Item value={task._id}>
                  <Accordion.Control
                    onClick={() =>
                      setExpandedTaskId(
                        expandedTaskId === task._id ? null : task._id
                      )
                    }
                  >
                    <Title order={3}>{task.title}</Title>
                  </Accordion.Control>
                  <Accordion.Panel>
                    {/* Checklist Items */}
                    <Stack>
                      {task.items.map((item, index) => (
                        <Group key={index} position="apart">
                          <Text>{item.title}</Text>
                          <Checkbox
                            checked={item.completed}
                            onChange={() =>
                              handleCheckboxChange(task._id, index)
                            }
                          />
                        </Group>
                      ))}
                    </Stack>

                    {/* Add New Item Button */}
                    <Button
                      onClick={() => {
                        setSelectedTaskId(task._id);
                        setCheckModalOpened(true);
                      }}
                      variant="light"
                      color="blue"
                      fullWidth
                      mt="md"
                    >
                      Add New Item
                    </Button>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Card>
          ))}
      </Stack>
      {/* Create Task Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Create New Task"
      >
        <TextInput
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />

        <Button onClick={handleCreateTask} color="green" fullWidth mt="md">
          Create Task
        </Button>
      </Modal>
      {/* Add Checklist Modal */}
      <Modal
        opened={checkModalOpened}
        onClose={() => setCheckModalOpened(false)}
        title="Add New Checklist Item"
      >
        {/* Form for adding a new checklist item */}
        <TextInput
          label="New Checklist Item"
          value={newChecklistItem} // Store the value in a string, not an array
          onChange={(e) => setNewChecklistItem(e.target.value)} // Update the input value
          placeholder="Enter new checklist item"
        />

        {/* Add New Item Button */}
        <Button
          onClick={handleAddChecklistItem} // Add the item to the checklist
          variant="light"
          color="blue"
          fullWidth
          mt="md"
        >
          Add Checklist Item
        </Button>
      </Modal>
      {/* Create New Task Button */}
      <Group className="mt-4" position="center">
        <Button onClick={() => setModalOpened(true)}>Create New Task</Button>
      </Group>
    </Container>
  );
};

export default List;
