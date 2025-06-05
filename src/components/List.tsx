import React, { useState } from "react";
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

interface ChecklistItem {
  item: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  checklist: ChecklistItem[];
}

const List: React.FC = () => {
  // State for tasks and form
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Light Bulb 150S",
      checklist: [
        {
          item: "Electrical connection, general, 3-pin. Electrical",
          completed: false,
        },
        { item: "Final installation done", completed: true },
        {
          item: "L3.1 LED surface-mounted wall light Architect",
          completed: false,
        },
      ],
    },
    {
      id: "2",
      title: "Sample Task 2",
      checklist: [
        { item: "Setup environment", completed: false },
        { item: "Deploy application", completed: false },
      ],
    },
  ]);

  const [title, setTitle] = useState("");
  const [checklist, setChecklist] = useState<string[]>([""]);
  const [modalOpened, setModalOpened] = useState(false);
  const [checkModalOpened, setCheckModalOpened] = useState(false);
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleCreateTask = () => {
    const newTask: Task = {
      id: Math.random().toString(),
      title,
      checklist: [], // Initialize with an empty checklist
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTitle("");
    setChecklist([]); // Clear the checklist state as well
    setModalOpened(false);
  };
  

  const handleAddChecklistItem = () => {
    if (selectedTaskId) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === selectedTaskId) {
          return {
            ...task,
            checklist: [
              ...task.checklist,
              { item: newChecklistItem, completed: false },
            ],
          };
        }
        return task;
      });
      setTasks(updatedTasks);
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
      if (task.id === taskId) {
        const updatedChecklist = [...task.checklist];
        updatedChecklist[index].item = value;
        return { ...task, checklist: updatedChecklist };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const handleCheckboxChange = (taskId: string, index: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedChecklist = [...task.checklist];
        updatedChecklist[index].completed = !updatedChecklist[index].completed;
        return { ...task, checklist: updatedChecklist };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  return (
    <Container>
      {/* Task List with Accordion */}
      <Stack mt={40}>
        {tasks.map((task) => (
          <Card key={task.id} shadow="sm" padding="lg" radius="md" withBorder>
            {/* Task Title - Accordion Header */}
            <Accordion>
              <Accordion.Item value={task.id}>
                <Accordion.Control
                  onClick={() =>
                    setExpandedTaskId(
                      expandedTaskId === task.id ? null : task.id
                    )
                  }
                >
                  <Title order={3}>{task.title}</Title>
                </Accordion.Control>
                <Accordion.Panel>
                  {/* Checklist Items */}
                  <Stack>
                    {task.checklist.map((item, index) => (
                      <Group key={index} position="apart">
                        <Text>{item.item}</Text>
                        <Checkbox
                          checked={item.completed}
                          onChange={() => handleCheckboxChange(task.id, index)}
                        />
                      </Group>
                    ))}
                  </Stack>

                  {/* Add New Item Button */}
                  <Button
                    onClick={() => {
                      setSelectedTaskId(task.id);
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
